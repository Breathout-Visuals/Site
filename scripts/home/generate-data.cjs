const fs = require('fs');
const path = require('path');

// --- CONFIGURATION ---
const CONTENT_ROOT = path.resolve(__dirname, '../../home-content');
const OUTPUT_FILE = path.resolve(__dirname, '../../src/home/data/content.js'); // Changed output file name for clarity

// Initial Config (Projects)
const PROJECTS_DIR = path.join(CONTENT_ROOT, 'Projets');

const KEY_MAP = {
    'Name': 'title',
    'Type': 'category',
    'Date': 'date',
    'Client': 'client',
    'Status': 'status',
    'Project Link': 'link',
    'Link': 'link', // Generic Link
    'Description': 'desc_en',
    'Description Fr': 'desc_fr',
    'Role': 'role', // Team
    'Desc': 'desc', // Team/Services
    'Title': 'title', // Services
    'Sub': 'subtitle', // Services/Home
    'List': 'list', // Services
    'Location': 'location', // Home
    'Subtitle': 'subtitle' // Home
};

const MEDIA_EXTS = ['.jpg', '.jpeg', '.png', '.mp4', '.webm', '.gif', '.webp'];

function parseInfoTxt(filePath) {
    if (!fs.existsSync(filePath)) return {};
    const content = fs.readFileSync(filePath, 'utf-8');
    const lines = content.split(/\r?\n/);
    const data = { meta: {} };
    let currentKey = null;

    lines.forEach(line => {
        const trimmed = line.trim();
        if (!trimmed) return;
        const match = line.match(/^([^:]+):\s*(.*)$/);
        if (match) {
            const rawKey = match[1].trim();
            const value = match[2].trim();
            if (KEY_MAP[rawKey]) {
                currentKey = KEY_MAP[rawKey];
                data.meta[currentKey] = value;
            } else {
                currentKey = null; // Unknown key
            }
        } else if (currentKey && trimmed) {
            data.meta[currentKey] += ' ' + trimmed;
        }
    });
    return data.meta;
}

function scanMedia(dir) {
    if (!fs.existsSync(dir)) return {};
    let files = [];
    try { files = fs.readdirSync(dir); } catch (e) { }
    const media = {};
    const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split(''); // A-Z

    alphabet.forEach(letter => {
        const match = files.find(f => f.toUpperCase().startsWith(letter + '.') && MEDIA_EXTS.includes(path.extname(f).toLowerCase()));
        if (match) {
            media[letter] = match;
        }
    });

    // Special Case: Cover
    const coverMatch = files.find(f => f.toLowerCase().startsWith('cover.') && MEDIA_EXTS.includes(path.extname(f).toLowerCase()));
    if (coverMatch) media.cover = coverMatch;

    return media;
}

// --- SCANNING FUNCTIONS ---

// 1. PROJECTS
function getProjects(imports) {
    if (!fs.existsSync(PROJECTS_DIR)) return [];
    let results = [];

    // Recursive scan helper
    const scan = (dir) => {
        const entries = fs.readdirSync(dir, { withFileTypes: true });
        for (const entry of entries) {
            const fullPath = path.join(dir, entry.name);
            if (entry.isDirectory()) {
                if (fs.existsSync(path.join(fullPath, 'info.txt'))) {
                    // It's a project
                    processProject(fullPath, results, imports);
                } else {
                    scan(fullPath); // Recurse
                }
            }
        }
    };

    scan(PROJECTS_DIR);
    return results;
}

function processProject(dir, list, imports) {
    const info = parseInfoTxt(path.join(dir, 'info.txt'));
    const mediaFiles = scanMedia(dir);
    const dirName = path.basename(dir);
    const index = list.length;
    const projectVarName = `proj_${index}`;

    // Collection
    let collection = [];
    Object.keys(mediaFiles).forEach(key => {
        if (key === 'cover') return;
        const alphabetIndex = key.charCodeAt(0) - 65; // A=0
        const fileName = mediaFiles[key];
        const varName = `${projectVarName}_${key}`;
        imports.push(`import ${varName} from '${getRelativePath(dir, fileName)}';`);

        const isVideo = fileName.match(/\.(mp4|webm)$/i);
        collection.push({
            id: alphabetIndex + 1,
            type: isVideo ? 'video' : 'image',
            src: varName // Will be replaced by raw string in JSON.stringify hack
        });
    });

    // Cover
    let coverVar = "''";
    if (mediaFiles.cover) {
        const varName = `${projectVarName}_cover`;
        imports.push(`import ${varName} from '${getRelativePath(dir, mediaFiles.cover)}';`);
        coverVar = varName;
    } else if (collection.length > 0) {
        coverVar = collection[0].src; // Fallback to first media
    }

    // Category Logic
    let category = 'other';
    const rawType = (info.category || path.basename(path.dirname(dir))).toLowerCase();
    if (rawType.includes('short') || rawType.includes('fiction')) category = 'short_film';
    else if (rawType.includes('commercial') || rawType.includes('ads')) category = 'commercial';
    else if (rawType.includes('music') || rawType.includes('clip')) category = 'music_video';
    else if (rawType.includes('documentary') || rawType.includes('doc')) category = 'documentary';
    else if (rawType.includes('social') || rawType.includes('reel')) category = 'social_media';
    else if (rawType.includes('corporate') || rawType.includes('corp')) category = 'corporate';
    else if (rawType.includes('wedding') || rawType.includes('mariage')) category = 'wedding';

    list.push({
        id: index + 100,
        title: info.title || dirName.replace(/_/g, ' '),
        category: category,
        client: info.client || "",
        date: info.date || "2025",
        status: info.status || "Completed",
        link: info.link || "",
        desc: {
            fr: info.desc_fr || "Pas de description.",
            en: info.desc_en || "No description." // Simplified for now
        },
        cover: coverVar,
        media: collection
    });
}

// 2. TEAM
function getTeam(imports) {
    const TEAM_DIR = path.join(CONTENT_ROOT, 'Team');
    if (!fs.existsSync(TEAM_DIR)) return [];
    let team = [];
    const entries = fs.readdirSync(TEAM_DIR, { withFileTypes: true });

    entries.forEach((entry, i) => {
        if (!entry.isDirectory()) return;
        const dir = path.join(TEAM_DIR, entry.name);
        const info = parseInfoTxt(path.join(dir, 'info.txt'));
        const media = scanMedia(dir);

        // Image A for profile
        let imgVar = "''";
        if (media.A) {
            const varName = `team_${i}_img`;
            imports.push(`import ${varName} from '${getRelativePath(dir, media.A)}';`);
            imgVar = varName;
        }

        team.push({
            id: entry.name.toLowerCase(),
            name: info.title || entry.name, // Name maps to title in KEY_MAP
            role: info.role || "MEMBER",
            desc: info.desc || "",
            link: info.link || "",
            image: imgVar
        });
    });

    // Sort logic? Lucas first?
    // User structure implies explicit folders, let's trust folder names or sort later.
    // For now, simple directory order (alphabetical usually).
    return team;
}

// 3. SERVICES
function getServices(imports) {
    const SERVICES_DIR = path.join(CONTENT_ROOT, 'Services');
    if (!fs.existsSync(SERVICES_DIR)) return [];
    let services = [];
    const entries = fs.readdirSync(SERVICES_DIR, { withFileTypes: true });

    entries.forEach((entry, i) => {
        if (!entry.isDirectory()) return;
        const dir = path.join(SERVICES_DIR, entry.name);
        const info = parseInfoTxt(path.join(dir, 'info.txt'));

        // Services usually don't have images in this design, but if they did...

        services.push({
            id: entry.name.toLowerCase(),
            title: info.title || entry.name.replace(/_/g, ' '),
            subtitle: info.subtitle || "", // Sub maps to subtitle
            desc: info.desc || info.subtitle, // Logic overlap? Use subtitle as 'p' logic
            list: info.list ? info.list.split(',').map(s => s.trim()) : []
        });
    });
    return services;
}

// 4. HOME (Backgrounds)
function getHome(imports) {
    const HOME_DIR = path.join(CONTENT_ROOT, 'Home/Landing');
    if (!fs.existsSync(HOME_DIR)) return { backgrounds: [], info: {} };

    const info = parseInfoTxt(path.join(HOME_DIR, 'info.txt'));
    const media = scanMedia(HOME_DIR);

    let backgrounds = [];
    // User requested A-H
    ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H'].forEach(letter => {
        if (media[letter]) {
            const varName = `home_bg_${letter}`;
            imports.push(`import ${varName} from '${getRelativePath(HOME_DIR, media[letter])}';`);
            backgrounds.push(varName);
        }
    });

    return {
        info: {
            title: info.title || "LANDING",
            subtitle: info.subtitle || "CREATIVE PRODUCTION",
            location: info.location || "PARIS, FRANCE"
        },
        backgrounds: backgrounds
    };
}


// UTILS
function getRelativePath(fromDir, fileName) {
    const outputDir = path.dirname(OUTPUT_FILE);
    let relative = path.relative(outputDir, path.join(fromDir, fileName));
    relative = relative.split(path.sep).join('/');
    if (!relative.startsWith('.')) relative = './' + relative;
    return relative;
}

function generate() {
    const outputDir = path.dirname(OUTPUT_FILE);
    if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

    let imports = [];

    const projects = getProjects(imports);
    const team = getTeam(imports);
    const services = getServices(imports);
    const home = getHome(imports);

    const fileContent = `
// AUTO-GENERATED BY scripts/home/generate-data.cjs
// DO NOT EDIT MANUALLY - UPDATE info.txt FILES IN HOME-CONTENT

${imports.join('\n')}

export const content = {
    projects: ${stringify(projects)},
    team: ${stringify(team)},
    services: ${stringify(services)},
    home: ${stringify(home)}
};
`;

    fs.writeFileSync(OUTPUT_FILE, fileContent);
    console.log(`Generated content.js with: ${projects.length} Projects, ${team.length} Team Members, ${services.length} Services.`);
}

function stringify(obj) {
    return JSON.stringify(obj, null, 4)
        .replace(/"(proj_\d+_[a-zA-Z0-9_]+)"/g, '$1') // Projects Projects Media (including cover)
        .replace(/"(team_\d+_img)"/g, '$1') // Team Media
        .replace(/"(home_bg_[A-Z])"/g, '$1'); // Home Media
}

generate();
