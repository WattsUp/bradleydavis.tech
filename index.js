'use strict';

/**
 * Changes the message about the current food day
 * Reruns at midnight
 */
function updateFoodMessage() {
  let menu = [
    'Sundae Sunday', 'Meatloaf Monday', 'Thai Tuesday', 'Waffle Wednesday',
    'Turnip Thursday', 'Fried Food Friday', 'Salmon Saturday'
  ];
  let location =
      ['freezer', 'fridge', 'fridge', 'fridge', 'pantry', 'fridge', 'grill'];
  let today = new Date();
  let i = today.getDay();
  document.getElementById('food-message').innerHTML = menu[i];
  document.getElementById('food-location').innerHTML = location[i];
  let tomorrow =
      new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
  let timeToMidnight = tomorrow - today;
  setTimeout(updateFoodMessage, timeToMidnight);
}

if (document.readyState == 'Loading')
  window.addEventListener('DOMContentLoaded', updateFoodMessage);
else
  updateFoodMessage();