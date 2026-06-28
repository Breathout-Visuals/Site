// AUTO-GENERATOR — Portfolio Pro
// Run: node scripts/portfolio-pro/generate.cjs
// Triggered automatically by Vite content watcher on changes in Portfolio-Pro-Content/

const fs = require('fs');
const path = require('path');

const CONTENT_DIR = path.resolve(__dirname, '../../Portfolio-Pro-Content');
const OUTPUT_FILE = path.resolve(__dirname, '../../src/portfolio-pro/data/projects.gen.js');

const IMAGE_EXTS = ['.jpg', '.jpeg', '.png', '.webp'];
const VIDEO_EXTS = ['.mp4', '.webm'];
const MEDIA_EXTS = [...IMAGE_EXTS, ...VIDEO_EXTS];

// --- Slugify ---
function slugify(str) {
    return str
        .toLowerCase()
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .replace(/['']/g, '')
        .replace(/[^a-z0-9\s-]/g, '')
        .trim()
        .replace(/\s+/g, '-');
}

// --- Parse info.txt ---
const KEY_MAP = {
    'Name': 'Name',
    'Client': 'Client',
    'Category': 'Category',
    'Date': 'Date',
    'Role': 'Role',
    'Video': 'Video',
    'Description FR': 'Description FR',
    'Description EN': 'Description EN',
    'Featured': 'Featured',
    'Order': 'Order',
    'Thumbnail URL': 'Thumbnail URL',
    'Hero URL': 'Hero URL'
};

function parseInfoTxt(filePath) {
    if (!fs.existsSync(filePath)) return { meta: {}, _credits: {} };
    const content = fs.readFileSync(filePath, 'utf-8');
    const lines = content.split(/\r?\n/);
    const data = { meta: {}, credits: {} };
    let currentKey = null;
    let inCreditsSection = false;

    lines.forEach(line => {
        const trimmed = line.trim();
        if (!trimmed || (trimmed.startsWith('#') && !inCreditsSection)) return;

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

// --- Normalize category from info.txt ---
function normalizeCategory(raw) {
    const s = (raw || '').toLowerCase();
    if (s.includes('commercial') || s.includes('pub') || s.includes('ad')) return 'commercial';
    if (s.includes('short') || s.includes('court')) return 'short_film';
    if (s.includes('music') || s.includes('clip')) return 'music_video';
    if (s.includes('doc')) return 'documentary';
    if (s.includes('social') || s.includes('youtube') || s.includes('instagram') || s.includes('reel')) return 'social_media';
    if (s.includes('wedding') || s.includes('mariage')) return 'wedding';
    if (s.includes('photo')) return 'photo';
    if (s.includes('event') || s.includes('evenement') || s.includes('évènement')) return 'event';
    return 'other';
}

// --- Main ---
function generate() {
    // Create content dir if missing
    if (!fs.existsSync(CONTENT_DIR)) {
        fs.mkdirSync(CONTENT_DIR, { recursive: true });
        console.log(`[Portfolio Pro] Created ${CONTENT_DIR}`);
    }

    const folders = fs.readdirSync(CONTENT_DIR).filter(f => {
        const p = path.join(CONTENT_DIR, f);
        return fs.statSync(p).isDirectory() && !f.startsWith('.');
    });

    const imports = [];
    const rawProjects = [];

    folders.forEach((folder, index) => {
        const folderPath = path.join(CONTENT_DIR, folder);
        const info = parseInfoTxt(path.join(folderPath, 'info.txt'));

        if (!info['Name']) {
            console.warn(`[Portfolio Pro] Skipping "${folder}" — no Name in info.txt`);
            return;
        }

        // --- Structured Credits Logic ---
        const structuredCredits = [];
        const rawCredits = info._credits || {};
        Object.keys(rawCredits).forEach(rawRole => {
            const finalRoleKey = rawRole.toLowerCase().trim().replace(/[\s\.]+/g, '_');
            const names = rawCredits[rawRole].split(',').map(n => n.trim()).filter(n => n.length > 0);
            if (names.length > 0) {
                structuredCredits.push({
                    roleKey: finalRoleKey,
                    originalRole: rawRole,
                    names: names
                });
            }
        });

        const slug = slugify(info['Name']);
        const files = fs.readdirSync(folderPath);
        const prefix = `p${index}`;

        // Helper: import an asset and return variable name
        function importAsset(fileName, varSuffix) {
            let relPath = path.relative(path.dirname(OUTPUT_FILE), path.join(folderPath, fileName))
                .split(path.sep).join('/');
            if (!relPath.startsWith('.')) relPath = './' + relPath;
            const varName = `${prefix}_${varSuffix}`;
            imports.push(`import ${varName} from '${relPath}';`);
            return varName;
        }

        // Thumbnail (local file > remote URL)
        const thumbFile = files.find(f =>
            f.toLowerCase().startsWith('thumbnail.') && IMAGE_EXTS.includes(path.extname(f).toLowerCase())
        );
        let thumbVar = 'null';
        let thumbIsUrl = false;
        if (thumbFile) {
            thumbVar = importAsset(thumbFile, 'thumb');
        } else if (info['Thumbnail URL']) {
            thumbVar = JSON.stringify(info['Thumbnail URL']);
            thumbIsUrl = true;
        }

        // Hero image (local file > remote URL > fallback to thumbnail)
        const heroFile = files.find(f =>
            f.toLowerCase().startsWith('hero.') && IMAGE_EXTS.includes(path.extname(f).toLowerCase())
        );
        let heroVar = thumbVar;
        let heroIsUrl = thumbIsUrl;
        if (heroFile) {
            heroVar = importAsset(heroFile, 'hero');
            heroIsUrl = false;
        } else if (info['Hero URL']) {
            heroVar = JSON.stringify(info['Hero URL']);
            heroIsUrl = true;
        }

        // Gallery: A.jpg, B.mp4, C.png ... (alphabetical order)
        const gallery = [];
        'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('').forEach(letter => {
            const match = files.find(f =>
                f.startsWith(letter + '.') && MEDIA_EXTS.includes(path.extname(f).toLowerCase())
            );
            if (!match) return;
            const isVideo = VIDEO_EXTS.includes(path.extname(match).toLowerCase());
            const varName = importAsset(match, letter);

            // Poster for video (e.g. A-poster.jpg)
            let posterVar = 'null';
            if (isVideo) {
                const posterFile = files.find(f =>
                    f.toLowerCase().startsWith(letter.toLowerCase() + '-poster.') &&
                    IMAGE_EXTS.includes(path.extname(f).toLowerCase())
                );
                if (posterFile) posterVar = importAsset(posterFile, `${letter}poster`);
            }

            gallery.push({ type: isVideo ? 'video' : 'image', src: `__VAR__${varName}`, poster: `__VAR__${posterVar}` });
        });

        rawProjects.push({
            slug,
            name: info['Name'],
            client: info['Client'] || '',
            category: normalizeCategory(info['Category']),
            date: info['Date'] || '2025',
            video: info['Video'] || '',
            descFr: info['Description FR'] || '',
            descEn: info['Description EN'] || '',
            featured: info['Featured'] === 'true',
            order: parseInt(info['Order'] || '999', 10),
            // If URL, store as plain string; if Vite import var, use __VAR__ placeholder
            thumbnail: thumbIsUrl ? info['Thumbnail URL'] : (thumbVar === 'null' ? null : `__VAR__${thumbVar}`),
            hero: heroIsUrl ? (info['Hero URL'] || info['Thumbnail URL'] || null) : (heroVar === 'null' ? null : `__VAR__${heroVar}`),
            structuredCredits,
            gallery,
        });
    });

    // Sort by order, then name
    rawProjects.sort((a, b) => a.order - b.order || a.name.localeCompare(b.name, 'fr'));

    // Inject next/prev navigation
    const projects = rawProjects.map((proj, i) => {
        const next = rawProjects[(i + 1) % rawProjects.length];
        const prev = rawProjects[(i - 1 + rawProjects.length) % rawProjects.length];
        return {
            ...proj,
            nextSlug: next?.slug || null,
            nextName: next?.name || null,
            prevSlug: prev?.slug || null,
            prevName: prev?.name || null,
        };
    });

    // Serialize + replace string placeholders with JS identifiers
    let dataStr = JSON.stringify(projects, null, 2)
        .replace(/"__VAR__(.*?)"/g, (_, v) => v || 'null');

    // Output
    const output = `// AUTO-GENERATED by scripts/portfolio-pro/generate.cjs
// DO NOT EDIT MANUALLY — Update Portfolio-Pro-Content/ folders instead
// Run: node scripts/portfolio-pro/generate.cjs

${imports.join('\n')}

export const projects = ${dataStr};

export function getProjectBySlug(slug) {
    return projects.find(p => p.slug === slug) ?? null;
}

export function getCategories() {
    const cats = [...new Set(projects.map(p => p.category))];
    return cats;
}
`;

    fs.mkdirSync(path.dirname(OUTPUT_FILE), { recursive: true });
    fs.writeFileSync(OUTPUT_FILE, output, 'utf-8');
    console.log(`[Portfolio Pro] ✓ Generated ${projects.length} project(s) → ${OUTPUT_FILE}`);
}

generate();
