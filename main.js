/**
 * Function once page is fully loaded
 */
$(window).bind('load', function() {
  var menu = [
    'Sundae Sunday', 'Meatloaf Monday', 'Thai Tuesday', 'Waffle Wednesday',
    'Thai Thursday', 'Fried Food Friday', 'Salmon Saturday'
  ];
  $('#food-message').text(menu[(new Date()).getDay()]);
});