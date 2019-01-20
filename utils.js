/**
 * Adds all of the css prefixes to the css key
 * @param {*} obj to add the css to
 * @param {*} baseKey
 * @param {*} value
 */
function cssPrefix(obj, baseKey, value) {
  obj.css('-webkit-' + baseKey, value);
  obj.css('-moz-' + baseKey, value);
  obj.css('-ms-' + baseKey, value);
  obj.css('-o-' + baseKey, value);
  obj.css(baseKey, value);
}

/**
 * Gets a floating point decimal between min and max
 * @param {number} min 
 * @param {number} max 
 */
function getRandomArbitrary(min, max) {
  return Math.random() * (max - min) + min;
}

/**
 * Gets an integer between min and max (inclusive)
 * @param {number} min 
 * @param {number} max 
 */
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min + 1)) + min;
}