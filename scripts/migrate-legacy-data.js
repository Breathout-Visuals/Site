
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { projects } from '../src/zoltan/projects.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '..');
const contentDir = path.join(rootDir, 'zoltan-content');
const publicDir = path.join(rootDir, 'public');

if (!fs.existsSync(contentDir)) {
    fs.mkdirSync(contentDir);
}

console.log('Starting migration...');

for (const [category, items] of Object.entries(projects)) {
    console.log(`Processing category: ${category}`);
    const catDir = path.join(contentDir, category);
    if (!fs.existsSync(catDir)) fs.mkdirSync(catDir);

    for (const project of items) {
        console.log(`  - Migrating: ${project.title.fr || project.title}`);
        const projDir = path.join(catDir, project.id);
        if (!fs.existsSync(projDir)) fs.mkdirSync(projDir);

        // 1. Generate info.txt
        let infoContent = '';

        // Handle Title (String or Object)
        if (typeof project.title === 'object') {
            infoContent += `Title: ${project.title.fr}\n`; // Defaulting to FR for main title line if broad
            // Actually, let's keep it simple. If it's bilingual, we might need a specific format or just store separate lines?
            // User requested "Title: Value". Let's support "Title FR" and "Title EN" in our parsing logic later.
            // For now, let's put Title as FR and handle bilingualism via specific keys if needed or just Title.
            // Wait, standardizing:
            infoContent += `Title FR: ${project.title.fr}\n`;
            infoContent += `Title EN: ${project.title.en}\n`;
        } else {
            infoContent += `Title: ${project.title}\n`;
        }

        if (project.subtitle) infoContent += `Subtitle: ${project.subtitle}\n`;
        infoContent += `Year: ${project.year}\n`;
        if (project.videoUrl) infoContent += `Video: ${project.videoUrl}\n`;
        if (project.isPrivate) infoContent += `Private: true\n`;

        infoContent += `\n`;
        if (project.description && project.description.fr) infoContent += `Description FR: ${project.description.fr.replace(/\n/g, ' ')}\n`;
        if (project.description && project.description.en) infoContent += `Description EN: ${project.description.en.replace(/\n/g, ' ')}\n`;

        infoContent += `\n`;
        if (project.credits && project.credits.length > 0) {
            project.credits.forEach(credit => {
                // Determine format: Role : Name (Highlight*)
                let names = credit.name || (credit.names ? credit.names.join(', ') : '');
                let line = `Credit: ${credit.role} : ${names}`;
                if (credit.highlight) line += ` *`;
                infoContent += `${line}\n`;
            });
        }

        fs.writeFileSync(path.join(projDir, 'info.txt'), infoContent);

        // 2. Copy Image
        if (project.thumbnail) {
            // thumbnail matches "/zoltan/assets/..."
            // Need to map to "public/zoltan/assets/..."
            const relativePath = project.thumbnail.startsWith('/') ? project.thumbnail.substring(1) : project.thumbnail;
            const sourcePath = path.join(publicDir, relativePath);

            if (fs.existsSync(sourcePath)) {
                const ext = path.extname(sourcePath);
                // Standardize name to 'thumbnail' + ext generic, or keep original name?
                // Plan said "thumbnail.webp". Let's stick to that for consistency.
                fs.copyFileSync(sourcePath, path.join(projDir, `thumbnail${ext}`));
            } else {
                console.warn(`    WARNING: Image not found at ${sourcePath}`);
            }
        }
    }
}

console.log('Migration complete!');
