#!/usr/bin/env python
""" A script to generate lazy and preview versions of photos
"""

import argparse
import math
import os
import re
import subprocess
import sys

def makeAbsolute(f, directory):
  if os.path.isabs(f):
    return os.path.abspath(f)
  return os.path.normpath(os.path.join(directory, f))


def getArguments():
  parser = argparse.ArgumentParser(
      description='Generate lazy and preview versions of photos')
  parser.add_argument('-r', action='store_true', default=False,
                      help='recursively search subdirectories, only meaningful if FILE is a directory')
  parser.add_argument('files', metavar='FILE', nargs='+',
                      help='one or more files or directories to generate')
  parser.add_argument('--exclude', metavar='FILE', nargs='+',
                      help='one or more files or directories to ignore')
  parser.add_argument('-f', action='store_true', default=False,
                      help='force update photos already generated')

  argv = sys.argv[1:]
  args = parser.parse_args(argv)

  excludeFiles = []
  if not args.exclude:
    args.exclude = []

  for path in args.exclude:
    if os.path.isdir(path):
      if args.r:
        for root, _, files in os.walk(path):
          for file in files:
            addFile(excludeFiles, makeAbsolute(file, root), None, False)
      else:
        for file in os.listdir(path):
          addFile(excludeFiles, makeAbsolute(file, path), None, False)
    else:
      addFile(excludeFiles, makeAbsolute(path, "."), None, False)
  args.exclude = excludeFiles

  return args


def addFile(files, file, excludeFiles, force):
  if not os.path.isfile(file):
    return
  if excludeFiles:
    for f in excludeFiles:
      if os.path.samefile(file, f):
        return
  if file in files:
    return
  matches = re.match(r"(.*)(?<!_lazy)(?<!_preview)\.(jpg|png|jpeg)$",file, re.I)
  if matches:
    if not force and os.path.exists(matches.expand(r"\1_lazy.\2")):
      return
    if not force and os.path.exists(matches.expand(r"\1_preview.\2")):
      return
    files.append(file)


def getFiles(args):
  htmlFiles = []
  for path in args.files:
    if os.path.isdir(path):
      if args.r:
        for root, _, files in os.walk(path):
          for file in files:
            addFile(htmlFiles, makeAbsolute(file, root), args.exclude, args.f)
      else:
        for file in os.listdir(path):
          addFile(htmlFiles, makeAbsolute(file, path), args.exclude, args.f)
    else:
      addFile(htmlFiles, makeAbsolute(path, "."), args.exclude, args.f)
  return htmlFiles

def processFile(file):
  print("Processing", file)
  cmd = ['gm', 'identify', file]
  output = subprocess.check_output(cmd, universal_newlines=True)
  size = re.match(r".*?(\d+)x(\d+)", output).groups()
  size = (int(size[0]), int(size[1]))

  # Remove EXIF from original
  cmd = ['gm', 'mogrify',
         '-auto-orient',
         '+profile', "\"*\"",
         file]
  subprocess.check_call(cmd)

  matches = re.match(r"(.*)\.(jpg|png|jpeg)$", file, re.I)
  name = matches.expand(r"\1_preview.\2")
  resize(file, size, 800, name, False)
  name = matches.expand(r"\1_lazy.\2")
  resize(file, size, 100, name, True)

def resize(file, size, approximate, output, blur):
  factor = math.floor(size[0] / approximate)
  if factor == 0:
    factor = 1
  width = math.floor(size[0] / factor)
  height = math.floor(size[1] / factor)
  size = '{}x{}'.format(width, height)
  cmd = ['gm', 'convert', file, '-scale', size]
  if blur:
    cmd.append('-gaussian')
    cmd.append('10')
  cmd.append(output)
  subprocess.check_call(cmd)

def main():
  args = getArguments()
  files = getFiles(args)
  for f in files:
    processFile(f)


if __name__ == "__main__":
  main()
