/**
 * Austin Clifton
 * 
 * JavaScript for dynamically creating and appending link blocks to the quick links container.
 * Fetches link data from a local JSON file and populates the UI accordingly.
 */

const linksContainer = document.getElementById('quickLinksContainer');

// Object map to associate section names with their corresponding class names
const sectionClassMap = {
    'general': 'generalLinks',
    'banks': 'bankLinks',
    'email': 'emailLinks',
    'fantasy': 'fantasyLinks',
    'code': 'codeLinks',
    'school': 'schoolLinks',
    'streaming': 'streamingLinks',
    'work': 'workLinks',
    'games': 'gamesLinks',
    'project': 'projectLinks',
    'helpful': 'helpfulLinks',
    'doc': 'docLinks'
};

/**
 * Fetches link data from a JSON file and creates link blocks to append to the container.
 */
function createLinkBlocks() {
    fetch('./data/links.json')
    .then(response => response.json())
    .then(data => {
        data.forEach(link => {
            // anchor element for the entire link block
            const linkBlock = document.createElement('a');
            linkBlock.classList.add('linkBlock');
            linkBlock.target = "_blank";
            linkBlock.href = link.url;

            // img element for the link icon
            const icon = document.createElement('img');
            icon.classList.add('linkIcon');
            icon.src = link.icon;

            // span element for the link name (ex. 'Gmail - ajc4409')
            const linkName = document.createElement('span');
            linkName.classList.add('linkName');
            linkName.textContent = `${link.name}\n`;

            // span element for the link url (ex. 'https://mycourses.rit.edu/d2l/home')
            const linkUrl = document.createElement('span');
            linkUrl.classList.add('linkUrl'); 
            const truncatedUrl = link.url.substring(0, 28) + '...';
            linkUrl.textContent = truncatedUrl;

            linkName.appendChild(linkUrl);
            linkBlock.appendChild(icon);
            linkBlock.appendChild(linkName);

            // Determine the section class based on the link's section
            const sectionDivClass = sectionClassMap[link.section] || 'generalLinks'; // Fallback to 'generalLinks'

            // Append the link block to the appropriate topic div
            const sectionDiv = document.querySelector(`.${sectionDivClass}`);
            sectionDiv.appendChild(linkBlock);
        });
    })
    .catch(error => {
        console.error('Error:', error);
    });
}

// Run createLinkBlocks function when the window loads
window.onload = createLinkBlocks;
