/**
 * Main Module
 * Handles typing animations and welcome message
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
