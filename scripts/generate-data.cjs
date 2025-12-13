const fs = require('fs');
const path = require('path');

const PROJECTS_DIR = path.resolve(__dirname, '../Contents projets/Projets');
const OUTPUT_FILE = path.resolve(__dirname, '../src/project-data.js');

// Helper to normalize keys of the META section
const KEY_MAP = {
    'Name': 'title',
    'Type': 'category',
    'Date': 'date',
    'Role': 'role', // Main Role (badge)
    'Status': 'status',
    'Project Link': 'link',
    'Description': 'desc_en',
    'Description Fr': 'desc_fr',
    'Credits': 'credits' // Legacy single-line credits
};

// Valid extensions for media
const MEDIA_EXTS = ['.jpg', '.jpeg', '.png', '.mp4', '.webm'];

function scanProjects(dir) {
    let results = [];
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
    const data = {
        meta: {},
        credits: {}
    };
    let currentKey = null;
    let inCreditsSection = false;

    lines.forEach(line => {
        const trimmed = line.trim();
        if (!trimmed) return;

        // Section Detection
        if (trimmed.toUpperCase() === '[CREDITS]') {
            inCreditsSection = true;
            return;
        }

        const match = line.match(/^([^:]+):\s*(.*)$/);

        if (inCreditsSection) {
            // CREDITS MODE
            if (match) {
                const role = match[1].trim();
                const name = match[2].trim();
                data.credits[role] = name;
            }
        } else {
            // META MODE (Standard)
            if (match) {
                const rawKey = match[1].trim();
                const value = match[2].trim();

                if (KEY_MAP[rawKey]) {
                    currentKey = KEY_MAP[rawKey];
                    data.meta[currentKey] = value;
                } else if (rawKey.toLowerCase().startsWith('credit ')) {
                    // Backward compatibility: "Credit Role: Name"
                    const role = rawKey.substring(7).trim(); // Remove "Credit "
                    data.credits[role] = value;
                    currentKey = null;
                } else {
                    currentKey = null;
                }
            } else if (currentKey && trimmed) {
                // Append multi-line description
                data.meta[currentKey] += ' ' + trimmed;
            }
        }
    });

    // Return combined object with _credits property
    return { ...data.meta, _credits: data.credits };
}

function generateImportsAndData() {
    const projectDirs = scanProjects(PROJECTS_DIR);
    let imports = [];
    let projectsData = [];

    projectDirs.forEach((dir, index) => {
        const infoPath = path.join(dir, 'info.txt');
        const info = parseInfoTxt(infoPath);

        // Scan for A-Z media AND Cover
        const mediaFiles = {};
        let coverFile = null;
        const files = fs.readdirSync(dir);
        const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

        alphabet.forEach(letter => {
            const match = files.find(f => f.startsWith(letter + '.') && MEDIA_EXTS.includes(path.extname(f).toLowerCase()));
            if (match) {
                mediaFiles[letter] = match;
            }
        });

        // Search for 'cover' image (strict: image only)
        const coverMatch = files.find(f => f.startsWith('cover.') && ['.jpg', '.jpeg', '.png', '.webp'].includes(path.extname(f).toLowerCase()));
        if (coverMatch) {
            coverFile = coverMatch;
        }

        // Generate Import Statements
        const projectVarName = `proj_${index}`;
        const mediaVars = {}; // { A: 'proj_0_A', B: 'proj_0_B' }
        let coverVar = "''";

        // Import Cover
        if (coverFile) {
            let relativePath = path.relative(path.dirname(OUTPUT_FILE), path.join(dir, coverFile));
            relativePath = relativePath.split(path.sep).join('/');
            if (!relativePath.startsWith('.')) relativePath = './' + relativePath;

            const varName = `${projectVarName}_cover`;
            imports.push(`import ${varName} from '${relativePath}';`);
            coverVar = varName;
        }

        Object.keys(mediaFiles).forEach(letter => {
            const fileName = mediaFiles[letter];
            // Path relative to src/project-data.js
            let relativePath = path.relative(path.dirname(OUTPUT_FILE), path.join(dir, fileName));
            relativePath = relativePath.split(path.sep).join('/'); // Normalize slashes
            if (!relativePath.startsWith('.')) relativePath = './' + relativePath;

            const varName = `${projectVarName}_${letter}`;
            imports.push(`import ${varName} from '${relativePath}';`);
            mediaVars[letter] = varName;
        });

        // Category Normalization
        const parentFolder = path.basename(path.dirname(dir)).toLowerCase();
        let normalizedCategory = 'other';

        if (parentFolder.includes('short')) normalizedCategory = 'short_film';
        else if (parentFolder.includes('commercial')) normalizedCategory = 'commercial';
        else if (parentFolder.includes('music')) normalizedCategory = 'music_video';
        else if (parentFolder.includes('documentary')) normalizedCategory = 'documentary';
        else if (parentFolder.includes('wedding')) normalizedCategory = 'wedding';
        else if (parentFolder.includes('social')) normalizedCategory = 'social_media';
        else {
            // Fallback to info.txt
            let type = info.category ? info.category.toLowerCase() : '';
            if (type.includes('short')) normalizedCategory = 'short_film';
            else if (type.includes('commercial')) normalizedCategory = 'commercial';
            else if (type.includes('music')) normalizedCategory = 'music_video';
            else if (type.includes('documentary')) normalizedCategory = 'documentary';
            else if (type.includes('wedding')) normalizedCategory = 'wedding';
            else if (type.includes('social') || type.includes('youtube')) normalizedCategory = 'social_media';
        }

        // --- Structured Credits Logic ---
        const structuredCredits = [];
        const rawCredits = info._credits || {};

        Object.keys(rawCredits).forEach(rawRole => {
            // Normalize: remove spaces, lowercase, replaces spaces with underscores
            // Examples: "1st AD" -> "1st_ad", "Director" -> "director"
            const finalRoleKey = rawRole.toLowerCase().trim().replace(/[\s\.]+/g, '_');

            // Split names by comma
            const names = rawCredits[rawRole].split(',').map(n => n.trim()).filter(n => n.length > 0);

            if (names.length > 0) {
                structuredCredits.push({
                    roleKey: finalRoleKey,
                    originalRole: rawRole, // Debug/Fallback
                    names: names
                });
            }
        });

        // Main Role Logic (Simplified)
        // User has migrated data to use exact keys (e.g. 'dop_me', 'director_me')
        // We just normalize standard things like spaces.

        let mainRoleNormalized = (info.role || "Unknown").toLowerCase().trim().replace(/[\s\.]+/g, '_');

        // Pass directly. Browser will look up ROLES[mainRoleNormalized].
        // If the key is 'dop', browser looks for ROLES['dop']. 
        // If data is migrated to 'dop_me', it looks for ROLES['dop_me'].
        let mappedMainRole = mainRoleNormalized;

        // Collection Construction
        let collection = [];
        alphabet.forEach(l => {
            if (mediaVars[l]) {
                const isVideo = mediaFiles[l].match(/\.(mp4|webm)$/i);
                collection.push({
                    type: isVideo ? 'video' : 'image',
                    src: mediaVars[l],
                    poster: ''
                });
            }
        });

        const projectObj = {
            id: index + 100,
            title: info.title || "Untitled",
            category: normalizedCategory,
            role: mappedMainRole,
            date: { fr: info.date || "2025", en: info.date || "2025" },
            status: info.status || "Completed",
            link: info.link || "",
            desc: {
                fr: info.desc_fr || info.desc_en || "Pas de description.",
                en: info.desc_en || "No description."
            },
            credits: info.credits || "", // Legacy
            structuredCredits: structuredCredits,
            media: (coverVar !== "''") ? coverVar : (mediaVars['A'] ? mediaVars['A'] : "https://picsum.photos/seed/placeholder/800/600"),
            collection: collection.length > 0 ? collection : null
        };

        projectsData.push(projectObj);
    });

    // --- DYNAMIC INSTAGRAM REELS (Fallback) ---
    const reelsDir = path.resolve(__dirname, '../Contents projets/Instagram Reel');
    if (fs.existsSync(reelsDir)) {
        const reelFiles = fs.readdirSync(reelsDir);
        let reelCollection = [];
        const numbers = Array.from({ length: 50 }, (_, i) => i + 1);

        numbers.forEach(number => {
            let match = reelFiles.find(f => f.startsWith(number + '.') && /\.(mp4|webm)$/i.test(f));
            if (!match) match = reelFiles.find(f => f.startsWith(number + '.') && /\.(jpg|jpeg|png)$/i.test(f));

            if (match) {
                let relativePath = path.relative(path.dirname(OUTPUT_FILE), path.join(reelsDir, match));
                relativePath = relativePath.split(path.sep).join('/');
                if (!relativePath.startsWith('.')) relativePath = './' + relativePath;

                const varName = `reel_${number}`;
                imports.push(`import ${varName} from '${relativePath}';`);

                const isVideo = match.match(/\.(mp4|webm)$/i);
                let posterVar = "''";
                if (isVideo) {
                    const baseName = path.basename(match, path.extname(match));
                    const posterFile = reelFiles.find(f => f.startsWith(baseName + '.') && ['.jpg', '.jpeg', '.png', '.webp'].includes(path.extname(f).toLowerCase()) && f !== match);
                    if (posterFile) {
                        let posterPath = path.relative(path.dirname(OUTPUT_FILE), path.join(reelsDir, posterFile));
                        posterPath = posterPath.split(path.sep).join('/');
                        if (!posterPath.startsWith('.')) posterPath = './' + posterPath;

                        const posterVarName = `reel_poster_${number}`;
                        imports.push(`import ${posterVarName} from '${posterPath}';`);
                        posterVar = posterVarName;
                    }
                }

                reelCollection.push({
                    type: isVideo ? 'video' : 'image',
                    src: varName,
                    title: { fr: '', en: '' },
                    poster: (posterVar !== "''") ? posterVar : ''
                });
            }
        });

        if (reelCollection.length === 0) {
            reelCollection = [
                { type: 'video', src: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4', title: { fr: 'Demo 1', en: 'Demo 1' } },
                { type: 'video', src: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerJoyrides.mp4', title: { fr: 'Demo 2', en: 'Demo 2' } }
            ];
        }

        projectsData.push({
            id: 10,
            title: 'Instagram Reels',
            category: 'social_media',
            role: "content_creation_me",
            date: { fr: '2025', en: '2025' },
            status: "Online",
            link: "",
            desc: {
                en: 'A collection of dynamic, high-engagement reels created for various brands and personal projects.',
                fr: 'Une collection de reels dynamiques créés pour diverses marques et projets personnels.'
            },
            media: 'assets/projects/instagram-3d-final.png',
            type: 'collection',
            collection: reelCollection
        });
        console.log(`Added Instagram Reels project separate from scan (Items: ${reelCollection.length})`);

    } else {
        projectsData.push({
            id: 10,
            title: 'Instagram Reels',
            category: 'social_media',
            role: "Content Creation",
            date: { fr: '2025', en: '2025' },
            status: "Online",
            link: "",
            desc: { en: 'Reels collection.', fr: 'Collection Reels.' },
            media: 'assets/projects/instagram-3d-final.png',
            type: 'collection',
            collection: [
                { type: 'video', src: 'https://storage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4' }
            ]
        });
        console.log("Added Fallback Instagram Reels (Folder not found on server)");
    }

    const fileContent = `
// AUTO-GENERATED BY scripts/generate-data.js
// DO NOT EDIT MANUALLY - UPDATE info.txt FILES INSTEAD

${imports.join('\n')}

export const projects = ${JSON.stringify(projectsData, null, 4)
            .replace(/"(proj_\d+_[A-Z])"/g, '$1')
            .replace(/"(proj_\d+_cover)"/g, '$1')
            .replace(/"(reel_\d+)"/g, '$1')
            .replace(/"(reel_poster_\d+)"/g, '$1')
        };
`;

    fs.writeFileSync(OUTPUT_FILE, fileContent);
    console.log(`Generated ${projectsData.length} projects to ${OUTPUT_FILE}`);
}

generateImportsAndData();
