const fs = require('fs');
const path = require('path');

const PROJECTS_DIR = path.resolve(__dirname, '../../portfolio-cinema-content/Projets');
const OUTPUT_FILE_REAL = path.resolve(__dirname, '../../src/portfolio-cinema/project-data.js');
const REELS_DIR = path.resolve(__dirname, '../../portfolio-cinema-content/Instagram Reel');

const KEY_MAP = {
    'Name': 'title',
    'Category': 'category',
    'Subcategory': 'subcategory',
    'Type': 'type',
    'Date': 'date',
    'Role': 'role',
    'Status': 'status',
    'Project Link': 'link',
    'Link': 'link',
    'Description': 'desc_en',
    'Description Fr': 'desc_fr',
    'Credits': 'credits'
};

const MEDIA_EXTS = ['.jpg', '.jpeg', '.png', '.mp4', '.webm'];

function scanProjects(dir) {
    let results = [];
    if (!fs.existsSync(dir)) return results;
    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            results = results.concat(scanProjects(fullPath));
        } else if (entry.name === 'info.txt') {
            results.push(path.dirname(fullPath));
        }
    }
    return results;
}

function parseInfoTxt(filePath) {
    const content = fs.readFileSync(filePath, 'utf-8');
    const lines = content.split(/\r?\n/);
    const data = { meta: {}, credits: {} };
    let currentKey = null;
    let inCreditsSection = false;

    lines.forEach(line => {
        const trimmed = line.trim();
        if (!trimmed) return;

        if (trimmed.toUpperCase() === '[CREDITS]') {
            inCreditsSection = true;
            return;
        }

        const match = line.match(/^([^:]+):\s*(.*)$/);

        if (inCreditsSection) {
            if (match) {
                const role = match[1].trim();
                const name = match[2].trim();
                data.credits[role] = name;
            }
        } else {
            let isNewKey = false;
            if (match) {
                const rawKey = match[1].trim();
                const value = match[2].trim();

                if (KEY_MAP[rawKey]) {
                    currentKey = KEY_MAP[rawKey];
                    data.meta[currentKey] = value;
                    isNewKey = true;
                }
            }
            if (!isNewKey && currentKey && trimmed) {
                data.meta[currentKey] += (data.meta[currentKey] && !data.meta[currentKey].endsWith(' ') ? ' ' : '') + trimmed;
            }
        }
    });

    return { ...data.meta, _credits: data.credits };
}

function generateImportsAndData() {
    const projectDirs = scanProjects(PROJECTS_DIR);
    let imports = [];
    let projectsData = [];

    projectDirs.forEach((dir, index) => {
        const infoPath = path.join(dir, 'info.txt');
        const info = parseInfoTxt(infoPath);

        const mediaFiles = {};
        let coverFile = null;
        const files = fs.readdirSync(dir);
        const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

        alphabet.forEach(letter => {
            const match = files.find(f => f.startsWith(letter + '.') && MEDIA_EXTS.includes(path.extname(f).toLowerCase()));
            if (match) mediaFiles[letter] = match;
        });

        const coverMatch = files.find(f => f.startsWith('cover.') && ['.jpg', '.jpeg', '.png', '.webp'].includes(path.extname(f).toLowerCase()));
        if (coverMatch) coverFile = coverMatch;

        const projectVarName = `proj_${index}`;
        const mediaVars = {};
        let coverVar = "''";

        if (coverFile) {
            let relativePath = path.relative(path.dirname(OUTPUT_FILE_REAL), path.join(dir, coverFile)).split(path.sep).join('/');
            if (!relativePath.startsWith('.')) relativePath = './' + relativePath;
            const varName = `${projectVarName}_cover`;
            imports.push(`import ${varName} from ${JSON.stringify(relativePath)};`);
            coverVar = varName;
        }

        Object.keys(mediaFiles).forEach(letter => {
            const fileName = mediaFiles[letter];
            let relativePath = path.relative(path.dirname(OUTPUT_FILE_REAL), path.join(dir, fileName)).split(path.sep).join('/');
            if (!relativePath.startsWith('.')) relativePath = './' + relativePath;
            const varName = `${projectVarName}_${letter}`;
            imports.push(`import ${varName} from ${JSON.stringify(relativePath)};`);
            mediaVars[letter] = varName;
        });

        const structuredCredits = [];
        const rawCredits = info._credits || {};
        Object.keys(rawCredits).forEach(rawRole => {
            const finalRoleKey = rawRole.toLowerCase().trim().replace(/[\s\.]+/, '_');
            const names = rawCredits[rawRole].split(',').map(n => n.trim()).filter(n => n.length > 0);
            if (names.length > 0) {
                structuredCredits.push({
                    roleKey: finalRoleKey,
                    originalRole: rawRole,
                    names: names
                });
            }
        });

        let collection = [];
        alphabet.forEach(l => {
            if (mediaVars[l]) {
                const isVideo = mediaFiles[l].match(/\.(mp4|webm)$/i);
                collection.push({ type: isVideo ? 'video' : 'image', src: mediaVars[l], poster: '' });
            }
        });

        const rawDate = info.date || '';
        let month = '';
        let year = '';
        let sortWeight = 0;
        
        const dateParts = rawDate.split(' ').map(p => p.trim()).filter(p => p.length > 0);
        if (dateParts.length === 2) {
            month = dateParts[0];
            year = dateParts[1];
            sortWeight = parseInt(year) * 100 + parseInt(month);
        } else if (dateParts.length === 1) {
            year = dateParts[0];
            sortWeight = parseInt(year) * 100;
        }

        const projectObj = {
            id: index + 100,
            title: info.title || 'Untitled',
            category: info.category ? info.category.toLowerCase().trim() : 'all',
            subcategory: info.subcategory ? info.subcategory.toLowerCase().trim() : '',
            type: info.type ? info.type.trim() : '',
            role: info.role ? info.role.toLowerCase().trim() : '',
            date: { raw: rawDate, month: month, year: year },
            sortWeight: sortWeight,
            status: info.status ? info.status.toLowerCase().trim() : '',
            link: info.link || '',
            desc: {
                fr: info.desc_fr || info.desc_en || 'Pas de description.',
                en: info.desc_en || 'No description.'
            },
            structuredCredits: structuredCredits,
            media: (coverVar !== "''") ? coverVar : (mediaVars['A'] ? mediaVars['A'] : "'https://picsum.photos/seed/placeholder/800/600'"),
            collection: collection.length > 0 ? collection : null
        };

        projectsData.push(projectObj);
    });

    // Handle Instagram Reels separately
    if (fs.existsSync(REELS_DIR)) {
        const reelFiles = fs.readdirSync(REELS_DIR);
        const pairs = {};
        
        // Group by base name (e.g. '1', '2')
        reelFiles.forEach(f => {
            const ext = path.extname(f).toLowerCase();
            const base = path.basename(f, ext);
            if (!pairs[base]) pairs[base] = { video: null, poster: null };
            
            let relativePath = path.relative(path.dirname(OUTPUT_FILE_REAL), path.join(REELS_DIR, f)).split(path.sep).join('/');
            if (!relativePath.startsWith('.')) relativePath = './' + relativePath;
            
            const varName = `reel_${base}_${ext.substring(1)}`;
            imports.push(`import ${varName} from ${JSON.stringify(relativePath)};`);
            
            if (ext === '.mp4' || ext === '.webm') {
                pairs[base].video = varName;
            } else if (['.jpg', '.jpeg', '.png', '.webp'].includes(ext)) {
                pairs[base].poster = varName;
            }
        });

        const collection = [];
        // Sort numerically
        Object.keys(pairs).sort((a, b) => parseInt(a) - parseInt(b)).forEach(base => {
            if (pairs[base].video) {
                collection.push({
                    type: 'video',
                    src: pairs[base].video,
                    poster: pairs[base].poster || "''"
                });
            }
        });

        // Add import for 3D cover
        const coverVarName = 'reel_instagram_3d_cover';
        let coverRelativePath = path.relative(path.dirname(OUTPUT_FILE_REAL), path.resolve(__dirname, '../../public/portfolio-cinema/assets/miniature-reels-3d.png')).split(path.sep).join('/');
        if (!coverRelativePath.startsWith('.')) coverRelativePath = './' + coverRelativePath;
        imports.push(`import ${coverVarName} from ${JSON.stringify(coverRelativePath)};`);

        if (collection.length > 0) {
            projectsData.push({
                id: 10,
                title: 'Instagram Reels',
                category: 'soc',
                subcategory: 'vrt',
                type: 'collection',
                role: 'fmk',
                date: { raw: '', month: '', year: '' },
                sortWeight: 999999, // Always show first
                status: '',
                link: '',
                desc: {
                    fr: 'Sélection de contenus verticaux et Reels Instagram.',
                    en: 'Selection of vertical content and Instagram Reels.'
                },
                structuredCredits: [],
                media: coverVarName,
                collection: collection
            });
        }    }

    // Sort projects by date (newest first)
    projectsData.sort((a, b) => b.sortWeight - a.sortWeight);

    let jsOutput = `/* DYNAMICALLY GENERATED */\n\n`;
    jsOutput += imports.join('\n') + '\n\n';

    jsOutput += `export const projects = [\n`;
    projectsData.forEach(proj => {
        let pStr = JSON.stringify(proj, null, 4);
        pStr = pStr.replace(/"media":\s*"([^"]+)"/, '"media": $1');
        if (proj.collection) {
            proj.collection.forEach((item, i) => {
                pStr = pStr.replace(new RegExp(`"src":\\s*"${item.src}"`), `"src": ${item.src}`);
                if (item.poster && item.poster !== "''") {
                    pStr = pStr.replace(new RegExp(`"poster":\\s*"${item.poster}"`), `"poster": ${item.poster}`);
                } else if (item.poster === "''") {
                    pStr = pStr.replace(/"poster":\s*"''"/, '"poster": ""');
                }
            });
        }
        jsOutput += pStr + ',\n';
    });
    jsOutput += `];\n`;

    fs.writeFileSync(OUTPUT_FILE_REAL, jsOutput, 'utf-8');
    console.log(`[Lucas Generator] Generated ${projectsData.length} projects   ${OUTPUT_FILE_REAL}`);
}

generateImportsAndData();
