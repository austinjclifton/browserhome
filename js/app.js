/**
 * Main Application Initialization
 * Coordinates all widget initialization
 */

import { initWeather } from './weather.js';
import { initLinks } from './links.js';
import { initCrypto } from './crypto.js';
import { updateCurrentTime } from './clock.js';



/**
 * Creates the header structure
 */
function createHeader() {
    const header = document.createElement('header');
    header.className = 'header';
    header.setAttribute('role', 'banner');

    const titleElement = document.createElement('span');
    titleElement.id = 'title';
    titleElement.setAttribute('aria-label', 'Welcome message');

    const blinkingCursor = document.createElement('span');
    blinkingCursor.id = 'blinkingCursor';
    blinkingCursor.setAttribute('aria-hidden', 'true');

    const typingContainer = document.createElement('div');
    typingContainer.id = 'typingContainer';
    typingContainer.setAttribute('aria-live', 'polite');
    typingContainer.appendChild(titleElement);
    typingContainer.appendChild(blinkingCursor);

    const clockElement = document.createElement('time');
    clockElement.id = 'clock';
    clockElement.setAttribute('role', 'timer');
    clockElement.setAttribute('aria-live', 'polite');
    clockElement.setAttribute('aria-atomic', 'true');

    header.appendChild(typingContainer);
    header.appendChild(clockElement);

    return { header, titleElement, clockElement };
}



/**
 * The next three functions handle typing animations and the welcome message
 */

/**
 * Creates a delay for a specified amount of time
 */
export async function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

/**
 * Types out a string character by character within a specified HTML element
 */
export function typeString(element, text, speed) {
    return new Promise((resolve) => {
        if (!element) {
            console.error('Element not provided');
            resolve();
            return;
        }

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
 * Runs the typing animation for the welcome message
 */
export async function runTyping(titleElement) {
    if (!titleElement) {
        console.error('Title element not provided');
        return;
    }
    await typeString(titleElement, 'Welcome home, Austin.', 75);
    await delay(2000);
}



/**
 * Initializes the application
 */
function init() {
    // Create header structure
    const { header, titleElement, clockElement } = createHeader();
    document.body.insertBefore(header, document.body.firstChild);

    // Initialize widgets in parallel (non-blocking)
    Promise.all([
        initWeather(),
        initLinks(),
        initCrypto()
    ]).catch(error => {
        console.error('Error initializing widgets:', error);
    });

    // Initialize clock
    updateCurrentTime(clockElement);
    setInterval(() => updateCurrentTime(clockElement), 1000);

    // Start typing animation
    runTyping(titleElement);
}

// Start the app
init();