/**
 * Clock Module
 * Updates and displays the current time
 */

/**
 * Updates the clock display with current time
 */
export function updateCurrentTime(clockElement) {
    if (!clockElement) return;

    const now = new Date();
    const options = {
        hour12: true,
        hour: 'numeric',
        minute: '2-digit',
        second: '2-digit',
        timeZoneName: 'short'
    };

    const formatter = new Intl.DateTimeFormat('en-US', options);
    const formattedTime = formatter.format(now);
    clockElement.textContent = formattedTime;
    clockElement.setAttribute('aria-label', `Current time: ${formattedTime}`);
}
