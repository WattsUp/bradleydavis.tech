#!/usr/bin/env python
""" A wrapper script for clang-format and clang-tidy that checks all source
files for formatting/static analysis and returns a list of files to fix.
Optionally checks only changed files. Optionally automatically fixes the
errors.
"""

import argparse
import json
import multiprocessing
import os
import queue
import re
import shutil
import subprocess
import sys
import tempfile
import threading
import traceback


def makeAbsolute(f, directory):
  if os.path.isabs(f):
    return os.path.abspath(f)
  return os.path.normpath(os.path.join(directory, f))


def getArguments():
  parser = argparse.ArgumentParser(
      description='Update the template features onto the desired page')
  parser.add_argument('--template', metavar='PATH', default='template.html',
                      help='files or directories to update')
  parser.add_argument('-r', action='store_true', default=False,
                      help='recursively search subdirectories, only meaningful if FILE is a directory')
  parser.add_argument('-a', action='store_true', default=False,
                      help='update all HTML files')
  parser.add_argument('files', metavar='FILE', nargs='+',
                      help='one or more files or directories to update')
  parser.add_argument('--exclude', metavar='FILE', nargs='+',
                      help='one or more files or directories to ignore')

  argv = sys.argv[1:]
  args = parser.parse_args(argv)

  args.template = makeAbsolute(args.template, os.path.curdir)

  excludeFiles = []
  if not args.exclude:
    args.exclude = []
  args.exclude.append(args.template)

  for path in args.exclude:
    if os.path.isdir(path):
      if args.r:
        for root, _, files in os.walk(path):
          for file in files:
            addFile(excludeFiles, makeAbsolute(file, root), None)
      else:
        for file in os.listdir(path):
          addFile(excludeFiles, makeAbsolute(file, path), None)
    else:
      addFile(excludeFiles, makeAbsolute(path, "."), None)
  args.exclude = excludeFiles

  return args


def addFile(files, file, excludeFiles):
  if not os.path.isfile(file):
    return
  if excludeFiles:
    for f in excludeFiles:
      if os.path.samefile(file, f):
        return
  if file in files:
    return
  if re.match(r".*\.(html|htm)", file.lower()):
    files.append(file)


def getFiles(args):
  htmlFiles = []
  for path in args.files:
    if os.path.isdir(path):
      if args.r:
        for root, _, files in os.walk(path):
          for file in files:
            addFile(htmlFiles, makeAbsolute(file, root), args.exclude)
      else:
        for file in os.listdir(path):
          addFile(htmlFiles, makeAbsolute(file, path), args.exclude)
    else:
      addFile(htmlFiles, makeAbsolute(path, "."), args.exclude)
  return htmlFiles


def getCustomHead(fileData):
  CUSTOM_HEAD = ""

  # Check for custom stylesheets
  match = re.search(r"(<link.*\"style\.css.*>)", fileData)
  if match:
    for g in match.groups():
      CUSTOM_HEAD += "\n  " + g
  match = re.search(r"(<link.*/style\.css.*>)", fileData)
  if match:
    for g in match.groups():
      CUSTOM_HEAD += "\n  " + g
  match = re.search(r"(<link.*masonry\.css.*>)", fileData)
  if match:
    for g in match.groups():
      CUSTOM_HEAD += "\n  " + g

  # Check for custom scripts
  match = re.search(r"(<script.*index.js\"></script>)", fileData)
  if match:
    for g in match.groups():
      CUSTOM_HEAD += "\n  " + g
  match = re.search(r"(<script.*lazy-load.js\"></script>)", fileData)
  if match:
    for g in match.groups():
      CUSTOM_HEAD += "\n  " + g
  match = re.search(r"(<script.*masonry.js\"></script>)", fileData)
  if match:
    for g in match.groups():
      CUSTOM_HEAD += "\n  " + g
  
  return CUSTOM_HEAD


def updateFile(template, filename):
  print("Updating", filename)

  with open(filename, "r", newline="\n", encoding='utf-8') as file:
    fileData = file.read()

  TITLE = re.search(r"<title>(.*)</title>", fileData, flags=re.S)
  if TITLE is None:
    print("Could not find title in", filename)
    return
  TITLE = TITLE.group(1)

  BANNER = re.search(r"(<banner.*</banner>)", fileData, flags=re.S)
  if BANNER:
    BANNER = BANNER.group(1) + "\n  "
  else:
    BANNER = ""

  MAIN = re.search(r"<main(.*)</main>", fileData, flags=re.S)
  if MAIN is None:
    print("Could not find main in", filename)
    return
  MAIN = MAIN.group(1)

  CUSTOM_HEAD = getCustomHead(fileData)

  # Create file from template
  newFile = template.expand(
    rf"\1<title>{TITLE}</title>{CUSTOM_HEAD}\2{BANNER}\3{MAIN}\4")
  # print(newFile)
  with open(filename, "w", newline="\n", encoding='utf-8') as file:
    file.write(newFile)


def main():
  args = getArguments()
  files = getFiles(args)
  with open(args.template, "r", newline="\n", encoding='utf-8') as file:
    templateData = file.read()

  template = re.match(
      r"(.*)<title>.*</title>(.*)(<main).*(</main>.*)",
      templateData,
      flags=re.S)

  for f in files:
    updateFile(template, f)


if __name__ == "__main__":
  main()
