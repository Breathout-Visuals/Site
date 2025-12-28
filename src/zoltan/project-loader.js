import { projects } from './data/projects.gen.js';

document.addEventListener('DOMContentLoaded', () => {
    const params = new URLSearchParams(window.location.search);
    const category = params.get('category');
    const id = params.get('id');

    const loading = document.getElementById('loading');
    const mainContent = document.getElementById('main-content');
    const errorMsg = document.getElementById('error-msg');

    // Back Link Logic
    const backLink = document.getElementById('back-link');
    if (category) {
        backLink.href = `/zoltan-hays/${category}/`;
    }

    // Find Project
    let project = null;
    if (category && projects[category]) {
        project = projects[category].find(p => p.id === id);
    }

    if (!project) {
        loading.style.display = 'none';
        errorMsg.style.display = 'block';
        return;
    }

    // Populate Data
    // Title (Handle object vs string)
    const currentLang = localStorage.getItem('zoltan-lang') || 'fr';
    let titleText = typeof project.title === 'object' ? (project.title[currentLang] || project.title.fr) : project.title;

    document.title = `${titleText} | Zoltan Hays`;
    const titleEl = document.getElementById('project-title');
    titleEl.textContent = titleText;

    // Subtitle (if any, e.g. for Clips)
    let subtitleEl = document.getElementById('project-subtitle');
    if (project.subtitle) {
        if (!subtitleEl) {
            subtitleEl = document.createElement('h2');
            subtitleEl.id = 'project-subtitle';
            subtitleEl.style.cssText = "font-family: 'Italiana', serif; font-size: 2rem; margin-top: -30px; margin-bottom: 40px; color:#ddd; font-weight: 400;";
            titleEl.after(subtitleEl);
        }
        subtitleEl.textContent = project.subtitle;
    } else if (subtitleEl) {
        subtitleEl.remove();
    }

    // Video Logic (Handle Private)
    const videoContainer = document.querySelector('.video-wrapper');
    if (project.isPrivate) {
        // Private Video Mode
        videoContainer.innerHTML = `
            <div class="private-video" style="display:flex; justify-content:center; align-items:center; height:100%; width:100%; background:#111; color:#aaa; font-family:'Poppins'; text-align:center; padding:20px;">
                <p data-fr="Cette vidéo ne peut être visionnée qu’en privé." data-en="This video can only be viewed privately.">
                    Cette vidéo ne peut être visionnée qu’en privé.
                </p>
            </div>
        `;
        // Re-run language check on new element
        if (window.updateLanguage) window.updateLanguage();
    } else {
        // Standard YouTube
        const iframe = document.getElementById('video-frame') || document.createElement('iframe');
        iframe.id = 'video-frame';
        iframe.title = titleText;
        iframe.allowFullscreen = true;
        iframe.src = project.videoUrl;

        if (!document.getElementById('video-frame')) {
            videoContainer.innerHTML = '';
            videoContainer.appendChild(iframe);
        }
    }

    // Description (Bilingual)
    const descEl = document.getElementById('project-desc');
    descEl.setAttribute('data-fr', project.description.fr || "");
    descEl.setAttribute('data-en', project.description.en || "");
    descEl.textContent = project.description[currentLang] || project.description.fr || "";

    // Credits
    const creditsContainer = document.getElementById('credits-list');
    if (project.credits && project.credits.length > 0) {
        creditsContainer.innerHTML = project.credits.map(c => {
            const isHighlight = c.highlight ? 'highlight' : '';
            // Handle role bilingual
            // We expect data like "ROLE FR / ROLE EN" or strict keys. Current data in JS is combined string "ROLE / ROLE".
            // Let's just output the role string as is, or attempt to split it if slash exists? 
            // The user data provided "RÉALISÉ PAR / DIRECTED BY".

            let roleDisplay = c.role;
            if (c.role && c.role.includes('/')) {
                const parts = c.role.split('/');
                // This is a naive split, assuming FR / EN
                roleDisplay = `<span data-fr="${parts[0].trim()}" data-en="${parts[1].trim()}">${currentLang === 'fr' ? parts[0].trim() : parts[1].trim()}</span>`;
            }

            const namesHtml = c.names
                ? c.names.map(n => `<p class="name ${isHighlight}">${n}</p>`).join('')
                : `<p class="name ${isHighlight}">${c.name}</p>`;

            return `
                <div class="credit-block" style="margin-bottom: 2rem;">
                    <p class="role ${isHighlight}" style="font-weight:600; font-size:0.9rem; margin-bottom: 5px; opacity:0.7;">${roleDisplay}</p>
                    ${namesHtml}
                </div>
            `;
        }).join('');
    } else {
        creditsContainer.innerHTML = ''; // Clear if no credits
    }

    // Force language update to ensure dynamic elements are correct
    // Dispatch a custom event or check global zoltan if needed, but manual setting above covers most.
    // However, for role splitting, we inserted HTML tags with data attributes, so the main zoltan.js loop needs to run or we manually trigger it.
    // We'll rely on zoltan.js observing DOM or running initially. 
    // Since this is async/dynamic, let's try to trigger a language refresh if possible or manual set.

    document.querySelectorAll('[data-fr]').forEach(el => {
        const txt = el.getAttribute(`data-${currentLang}`);
        if (txt) el.innerHTML = txt; // InnerHTML because roleDisplay contains HTML
    });

    // Reveal
    setTimeout(() => {
        loading.style.opacity = '0';
        setTimeout(() => {
            loading.style.display = 'none';
            mainContent.style.opacity = '1';
        }, 500);
    }, 300);
});
