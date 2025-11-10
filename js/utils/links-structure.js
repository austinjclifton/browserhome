/**
 * Links Widget Structure Generator
 * Dynamically creates the links container with sections
 */

/**
 * Section configuration with display names
 */
const SECTION_CONFIG = {
    general: 'general',
    email: 'email',
    code: 'code',
    school: 'school',
    work: 'work',
    banks: 'banks',
    streaming: 'streaming',
    fantasy: 'fantasy',
    games: 'games',
    project: 'projects',
    helpful: 'helpful',
    doc: 'documentations',
    studio: 'studio software'
};

/**
 * Creates the links container with all section divs
 * @returns {HTMLElement} Links container with sections
 */
export function createLinksStructure() {
    const container = document.createElement('div');
    container.className = 'widget quickLinksContainer';
    container.id = 'quickLinksContainer';
    container.setAttribute('role', 'navigation');
    container.setAttribute('aria-label', 'Quick links');

    // Create section divs dynamically
    Object.entries(SECTION_CONFIG).forEach(([sectionKey, displayName]) => {
        const sectionClass = `${sectionKey}Links`;
        const sectionDiv = document.createElement('div');
        sectionDiv.className = sectionClass;
        sectionDiv.setAttribute('role', 'group');
        sectionDiv.setAttribute('aria-label', `${displayName} links`);

        const h2 = document.createElement('h2');
        h2.textContent = displayName;
        sectionDiv.appendChild(h2);

        container.appendChild(sectionDiv);
    });

    return container;
}

/**
 * Gets the section class name for a given section key
 * @param {string} section - Section key
 * @returns {string} CSS class name
 */
export function getSectionClass(section) {
    return `${section}Links`;
}

