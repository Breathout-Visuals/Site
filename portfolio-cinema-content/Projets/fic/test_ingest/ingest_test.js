import { LIBRARY } from '/src/portfolio-cinema/library.js';

// Mock des fichiers générés par le système de build pour le projet 'test'
const testProjectFiles = [
    { type: 'image', main: '/portfolio-cinema-content/Projets/fic/test/FINAL CUT/A.jpg', bts: '/portfolio-cinema-content/Projets/fic/test/BTS/A.jpg' },
    { type: 'image', main: '/portfolio-cinema-content/Projets/fic/test/FINAL CUT/B.jpg', bts: '/portfolio-cinema-content/Projets/fic/test/BTS/B.jpg' },
    { type: 'video', main: '/portfolio-cinema-content/Projets/fic/test/FINAL CUT/C.mp4', bts: '/portfolio-cinema-content/Projets/fic/test/BTS/C.mp4' }
];

async function loadProjectData(projectFolderUrl) {
    try {
        // En prod, le nom du fichier pourrait être info.txt
        const response = await fetch(projectFolderUrl + '/info.txt');
        if (!response.ok) throw new Error('Network response was not ok');
        const text = await response.text();
        
        // Parsing simple du TXT
        const data = {};
        const lines = text.split('\n');
        let currentKey = null;
        let roleList = [];
        
        for (let line of lines) {
            line = line.trim();
            if (!line) continue;
            
            if (line.startsWith('TITRE:')) data.title = line.replace('TITRE:', '').trim();
            else if (line.startsWith('SOUSTITRE:')) data.subtitle = line.replace('SOUSTITRE:', '').trim();
            else if (line.startsWith('LIEN:')) data.link = line.replace('LIEN:', '').trim();
            else if (line.startsWith('Camera:')) data.camera = line.replace('Camera:', '').trim();
            else if (line.startsWith('Optique:')) data.lens = line.replace('Optique:', '').trim();
            else if (line.startsWith('Format:')) data.format = line.replace('Format:', '').trim();
            else if (line.startsWith('Role:')) { currentKey = 'roles'; }
            else if (line.startsWith('Synopsis:')) { currentKey = 'synopsis'; data.synopsis = ''; }
            else if (line.startsWith('- ') && currentKey === 'roles') {
                roleList.push(line.replace('- ', '').trim());
            }
            else if (currentKey === 'synopsis') {
                data.synopsis += line + ' ';
            }
        }
        data.roles = roleList;
        return data;
    } catch (e) {
        console.error("Erreur ingestion info.txt:", e);
        return null;
    }
}

function translateRoles(roles, lang) {
    const rolesLib = LIBRARY.roles_me || {};
    return roles.map(r => {
        if (rolesLib[r] && rolesLib[r][lang]) {
            return rolesLib[r][lang];
        }
        return r; // Fallback to raw text if not in library
    });
}

export async function populateTestModal() {
    const lang = document.documentElement.lang || 'fr';
    
    // 1. Charger et parser le TXT
    const data = await loadProjectData('/portfolio-cinema-content/Projets/fic/test');
    if (!data) return;
    
    // 2. Traduction
    const translatedRoles = translateRoles(data.roles, lang);
    
    // 3. Injection des métadonnées texte dans le DOM
    document.getElementById('test-hud-title').innerText = data.title || '';
    document.querySelector('.test-hud-desc').innerText = (data.synopsis || '').trim();
    document.querySelector('.test-hud-meta').innerText = (data.subtitle || '') + ' — ' + translatedRoles.join(' & ');
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
