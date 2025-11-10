/**
 * Links Widget Module
 * Dynamically creates and displays quick links
 */

import { createLinksStructure, getSectionClass } from './utils/links-structure.js';

/**
 * Creates a link block element
 */
function createLinkBlock(link) {
    const linkBlock = document.createElement('a');
    linkBlock.className = 'linkBlock';
    linkBlock.href = link.url;
    linkBlock.target = '_blank';
    linkBlock.rel = 'noopener noreferrer';
    linkBlock.setAttribute('aria-label', `Open ${link.name}`);

    const icon = document.createElement('img');
    icon.src = link.icon;
    icon.alt = link.name;
    icon.className = 'linkIcon';
    icon.loading = 'lazy';

    const linkName = document.createElement('span');
    linkName.className = 'linkName';
    linkName.textContent = `${link.name}\n`;

    const truncatedUrl = link.url.length > 28 
        ? link.url.substring(0, 28) + '...' 
        : link.url;
    
    const linkUrl = document.createElement('span');
    linkUrl.className = 'linkUrl';
    linkUrl.textContent = truncatedUrl;

    linkName.appendChild(linkUrl);
    linkBlock.appendChild(icon);
    linkBlock.appendChild(linkName);

    return linkBlock;
}

/**
 * Initializes links widget
 */
export async function initLinks() {
    try {
        // Create links structure
        const mainContainer = document.querySelector('main.container');
        const linksContainer = createLinksStructure();
        mainContainer.appendChild(linksContainer);

        const response = await fetch('./data/links.json');
        if (!response.ok) return;

        const links = await response.json().catch(() => null);
        if (!links) return;

        links.forEach(link => {
            const sectionClass = getSectionClass(link.section);
            const sectionDiv = document.querySelector(`.${sectionClass}`);
            
            if (sectionDiv) {
                const linkBlock = createLinkBlock(link);
                sectionDiv.appendChild(linkBlock);
            }
        });
    } catch (error) {
        // Links file not available
    }
}
