
import { projects } from './data/projects.gen.js';

document.addEventListener('DOMContentLoaded', () => {
    // Determine category from URL
    // URL exp: /zoltan-hays/mariage/ or /zoltan-hays/mariage/index.html
    const path = window.location.pathname;
    const parts = path.split('/').filter(p => p.length > 0);
    // standard path: ["zoltan-hays", "mariage"]
    // so category is the last part (or second to last if index.html is present, but usually it's stripped)

    let category = parts[parts.length - 1]; // "mariage"
    if (category === 'index.html' || category === '') {
        category = parts[parts.length - 2];
    }

    // Fallback or specific override via data attribute could be added here if needed

    const container = document.querySelector('.grid-container');
    if (!container) return;

    // Check if category exists
    if (!projects[category]) {
        console.warn(`Category "${category}" not found in projects data.`);
        return;
    }

    // Clear existing static content if any (though we will remove it from HTML)
    container.innerHTML = '';

    const categoryProjects = projects[category];

    categoryProjects.forEach(proj => {
        const card = document.createElement('a');
        card.href = `/zoltan-hays/project.html?category=${category}&id=${proj.id}`;
        card.className = 'card';

        // Thumbnail
        // proj.thumbnail is the URL string (processed by Vite)
        const img = document.createElement('img');
        img.src = proj.thumbnail || '/zoltan/assets/placeholder.jpg'; // Fallback
        img.alt = getTitle(proj.title);

        // Badge (Optional - logic unclear, omitting for cleanliness or adding based on some rule?)
        // The static HTML had <span class="badge-breathout">Breathout</span>
        // Maybe we just check if it's a specific type?
        // use classList add if needed.

        // Text Content
        const textDiv = document.createElement('div');
        textDiv.className = 'card-text';

        const h3 = document.createElement('h3');
        h3.textContent = getTitle(proj.title);

        textDiv.appendChild(h3);

        card.appendChild(img);

        // Badge Logic
        if (proj.label === 'Breathout') {
            const badge = document.createElement('span');
            badge.className = 'badge-breathout';
            badge.textContent = 'Breathout';
            card.appendChild(badge);
        }

        card.appendChild(textDiv);

        container.appendChild(card);
    });
});

function getTitle(titleObj) {
    if (typeof titleObj === 'string') return titleObj;
    // Simple language detection or default to FR
    // We can check <html lang="fr">
    const lang = document.documentElement.lang || 'fr';
    return titleObj[lang] || titleObj.fr || titleObj.en || "";
}
