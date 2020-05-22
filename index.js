"use strict";

/**
 * Changes the message about the current food day
 * Reruns at midnight
 */
function updateFoodMessage() {
  var menu = [
    'Sundae Sunday', 'Meatloaf Monday', 'Thai Tuesday', 'Waffle Wednesday',
    'Turnip Thursday', 'Fried Food Friday', 'Salmon Saturday'
  ];
  document.getElementById('food-message').innerHTML =
      menu[(new Date()).getDay()];
  var today = new Date();
  var tomorrow =
      new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
  var timeToMidnight = tomorrow - today;
  setTimeout(updateFoodMessage, timeToMidnight);
}

if (document.readyState == 'Loading')
  window.addEventListener('DOMContentLoaded', updateFoodMessage);
else
  updateFoodMessage();