function cssPrefix(obj, baseKey, value) {
  obj.css('-webkit-' + baseKey, value);
  obj.css('-moz-' + baseKey, value);
  obj.css('-ms-' + baseKey, value);
  obj.css('-o-' + baseKey, value);
  obj.css(baseKey, value);
}