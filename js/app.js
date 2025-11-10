/**
 * Main Application Initialization
 * Coordinates all widget initialization
 */

import { initWeather } from './weather.js';
import { initLinks } from './links.js';
import { initCrypto } from './crypto.js';
import { updateCurrentTime } from './clock.js';
import { runTyping } from './main.js';

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