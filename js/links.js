/**
 * Links Widget Module
 * Dynamically creates and displays quick links
 */

import { createLinksStructure, getSectionClass } from './utils/links-structure.js';

/**
 * Creates a clickable link block element with icon, name, and URL
 * 
 * @param {Object} link - Link object with name, url, and icon properties
 * @returns {HTMLElement} Complete link block element ready for DOM insertion
 */
function createLinkBlock(link) {
    const linkBlock = document.createElement('a');
    linkBlock.className = 'linkBlock';
    linkBlock.href = link.url;
    linkBlock.target = '_blank';
    linkBlock.rel = 'noopener noreferrer'; // Security: prevent new page from accessing window.opener
    linkBlock.setAttribute('aria-label', `Open ${link.name}`);

    // Create icon image
    const icon = document.createElement('img');
    icon.src = link.icon;
    icon.alt = link.name;
    icon.className = 'linkIcon';
    icon.loading = 'lazy'; // Performance: lazy load images

    // Create name container (flex column to stack name above URL)
    const linkName = document.createElement('span');
    linkName.className = 'linkName';
    linkName.textContent = link.name;

    // Truncate long URLs to prevent layout issues
    const truncatedUrl = link.url.length > 28 
        ? link.url.substring(0, 28) + '...' 
        : link.url;
    
    // Create URL display (nested inside linkName for vertical stacking)
    const linkUrl = document.createElement('span');
    linkUrl.className = 'linkUrl';
    linkUrl.textContent = truncatedUrl;

    // Assemble: URL nested in name, then icon and name in link block
    linkName.appendChild(linkUrl);
    linkBlock.appendChild(icon);
    linkBlock.appendChild(linkName);

    return linkBlock;
}

/**
 * Initializes the links widget
 * Creates the container structure, loads links from JSON, and populates sections
 * Silently fails if links.json is unavailable (graceful degradation)
 */
export async function initLinks() {
    try {
        // Create and append links container structure to main container
        const mainContainer = document.querySelector('main.container');
        const linksContainer = createLinksStructure();
        mainContainer.appendChild(linksContainer);

        // Fetch links data from JSON file
        const response = await fetch('./data/links.json');
        if (!response.ok) return;

        const links = await response.json().catch(() => null);
        if (!links) return;

        // Populate each link into its appropriate section
        links.forEach(link => {
            const sectionClass = getSectionClass(link.section);
            const sectionDiv = document.querySelector(`.${sectionClass}`);
            
            if (sectionDiv) {
                const linkBlock = createLinkBlock(link);
                sectionDiv.appendChild(linkBlock);
            }
        });
    } catch (error) {
        // Silently fail if links.json is unavailable (widget just won't show links)
        // This allows the rest of the dashboard to function normally
    }
}
