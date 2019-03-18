/**
 * Function once page is fully loaded
 */
$(window).bind('load', function() {
  updateFoodMessage();
});

/**
 * Changes the message about the current food day
 * Reruns at midnight
 */
function updateFoodMessage() {
  var menu = [
    'Sundae Sunday', 'Meatloaf Monday', 'Thai Tuesday', 'Waffle Wednesday',
    'Turnip Thursday', 'Fried Food Friday', 'Salmon Saturday'
  ];
  $('#food-message').text(menu[(new Date()).getDay()]);
  var today = new Date();
  var tomorrow =
      new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
  var timeToMidnight = tomorrow - today;
  setTimeout(updateFoodMessage, timeToMidnight);
}