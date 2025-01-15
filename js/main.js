/**
 * Austin Clifton
 *
 * JavaScript for the Website
 * Implements a typing animation for a welcome message and a Bible verse.
 * Uses fetch() to retrieve a random Bible verse.
 * last updated in v1.1
 */

//import { fetchRandomVerse } from './bible.js';

/**
 * Creates a delay for a specified amount of time.
 * @param {number} ms - The number of milliseconds to delay.
 * @returns {Promise} A promise that resolves after the specified delay.
 */
async function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Types out a string character by character within a specified HTML element.
 * @param {string} id - The ID of the HTML element to type into.
 * @param {string} text - The text to type out.
 * @param {number} speed - The speed (in milliseconds) between each character.
 * @returns {Promise} A promise that resolves when typing is complete.
 */
function typeString(id, text, speed) {
  return new Promise((resolve) => {
    const element = document.getElementById(id);
    let index = 0;

    function type() {
      if (index < text.length) {
        element.textContent += text.charAt(index);
        index++;
        setTimeout(type, speed);
      } else {
        resolve();
      }
    }
    type();
  });
}

/**
 * Runs the typing animation for the welcome message and Bible verse.
 */
async function runTyping() {
  await typeString('title', 'Welcome home, Austin.', 75); // Typing the welcome message
  await delay(2000); // Pause for 2 seconds (2000 milliseconds)
  
  // await typeString('bible', 'Read the Word: ', 50); // Typing the prompt
  // await fetchRandomVerse().then(verse => typeString('bible', verse, 15)); // Typing the Bible verse
}

//start the typing animation
runTyping();