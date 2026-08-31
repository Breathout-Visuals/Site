import { LIBRARY } from '/src/portfolio-cinema/library.js';

// Mock des fichiers générés par le système de build pour le projet 'test'
const testProjectFiles = [
    { type: 'image', main: '/portfolio-cinema-content/Projets/fic/test/FINAL CUT/A.jpg', bts: '/portfolio-cinema-content/Projets/fic/test/BTS/A.jpg' },
    { type: 'image', main: '/portfolio-cinema-content/Projets/fic/test/FINAL CUT/B.jpg', bts: '/portfolio-cinema-content/Projets/fic/test/BTS/B.jpg' },
    { type: 'video', main: '/portfolio-cinema-content/Projets/fic/test/FINAL CUT/C.mp4', bts: '/portfolio-cinema-content/Projets/fic/test/BTS/C.mp4' }
];

async function loadProjectData(projectFolderUrl) {
    try {
        const response = await fetch(projectFolderUrl + '/info.txt');
        if (!response.ok) throw new Error('Network response was not ok');
        const text = await response.text();
        
        const data = { credits: [] };
        const lines = text.split('\n');
        let parsingCredits = false;
        
        for (let line of lines) {
            line = line.trim();
            if (!line) continue;
            
            if (line === '[CREDITS]') {
                parsingCredits = true;
                continue;
            }
            
            if (parsingCredits) {
                // e.g. "dop: Lucas Jacquot"
                const parts = line.split(':');
                if (parts.length >= 2) {
                    data.credits.push({ role: parts[0].trim(), name: parts.slice(1).join(':').trim() });
                }
            } else {
                if (line.startsWith('Name:')) data.title = line.replace('Name:', '').trim();
                else if (line.startsWith('Subcategory:')) data.subcategory = line.replace('Subcategory:', '').trim();
                else if (line.startsWith('Link:')) data.link = line.replace('Link:', '').trim();
                else if (line.startsWith('Camera:')) data.camera = line.replace('Camera:', '').trim();
                else if (line.startsWith('Lens:')) data.lens = line.replace('Lens:', '').trim();
                else if (line.startsWith('Format:')) data.format = line.replace('Format:', '').trim();
                else if (line.startsWith('Role:')) {
                    const r = line.replace('Role:', '').trim();
                    data.roles = r.split(',').map(x => x.trim()).filter(x => x);
                }
                else if (line.startsWith('Description Fr:')) data.synopsis_fr = line.replace('Description Fr:', '').trim();
                else if (line.startsWith('Description:')) data.synopsis_en = line.replace('Description:', '').trim();
            }
        }
        return data;
    } catch (e) {
        console.error("Erreur ingestion info.txt:", e);
        return null;
    }
}

function translateRole(roleKey, lang) {
    const rolesLib = LIBRARY.roles_me || {};
    if (rolesLib[roleKey] && rolesLib[roleKey][lang]) {
        return rolesLib[roleKey][lang];
    }
    return roleKey; 
}

function translateSubcat(catKey, lang) {
    const catLib = LIBRARY.subcategories || {};
    if (catLib[catKey] && catLib[catKey][lang]) {
        return catLib[catKey][lang];
    }
    return catKey;
}

export async function populateTestModal() {
    const lang = document.documentElement.lang || 'fr';
    
    // 1. Charger et parser le TXT
    const data = await loadProjectData('/portfolio-cinema-content/Projets/fic/test');
    if (!data) return;
    
    // 2. Traduction
    const translatedRoles = (data.roles || []).map(r => translateRole(r, lang));
    const translatedSubcat = translateSubcat(data.subcategory, lang);
    const synopsis = lang === 'fr' && data.synopsis_fr ? data.synopsis_fr : (data.synopsis_en || '');
    
    // 3. Injection des métadonnées texte dans le DOM
    document.getElementById('test-hud-title').innerText = data.title || '';
    document.querySelector('.test-hud-desc').innerText = synopsis;
    document.querySelector('.test-hud-meta').innerText = (translatedSubcat || '') + ' — ' + translatedRoles.join(' & ');
    document.querySelector('.test-hud-tech').innerHTML = (data.camera || '') + ' &nbsp; &nbsp; ' + (data.lens || '') + ' &nbsp; &nbsp; ' + (data.format || '');
    
    const playBtn = document.querySelector('.test-hud-play-btn');
    if (data.link) {
        playBtn.setAttribute('onclick', "window.open('" + data.link + "', '_blank')");
        playBtn.style.display = 'inline-flex';
    } else {
        playBtn.style.display = 'none';
    }

    // 4. Construction de la galerie HTML
    const gallery = document.getElementById('test-gallery');
    gallery.innerHTML = ''; // Reset
    
    testProjectFiles.forEach((file, index) => {
        const item = document.createElement('div');
        item.className = 'test-gallery-item';
        
        let mainEl, btsEl;
        
        if (file.type === 'video') {
            mainEl = document.createElement('video');
            mainEl.src = file.main;
            mainEl.loop = true;
            mainEl.muted = true;
            mainEl.playsInline = true;
            mainEl.style.width = '100%'; mainEl.style.height = '100%'; mainEl.style.objectFit = 'cover';
        } else {
            mainEl = document.createElement('img');
            mainEl.src = file.main;
        }
        mainEl.className = 'main-layer active' + (file.type === 'video' ? ' test-video' : '');
        
        btsEl = document.createElement('img');
        btsEl.src = file.bts;
        btsEl.className = 'bts-layer inactive';
        
        item.appendChild(mainEl);
        item.appendChild(btsEl);
        gallery.appendChild(item);
    });

    console.log("Ingestion terminée avec succès !");
}
