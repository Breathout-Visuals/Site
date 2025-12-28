
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const rootDir = path.resolve(__dirname, '../..');
const contentDir = path.join(rootDir, 'zoltan-content');
// We no longer use publicAssetsDir
const outputFile = path.join(rootDir, 'src', 'zoltan', 'data', 'projects.gen.js');

console.log('Generating Zoltan Data with Imports...');

const projects = {};
const imports = []; // To store lines like: import img_xyz from '...'
let importCounter = 0;

if (fs.existsSync(contentDir)) {
    const categories = fs.readdirSync(contentDir);

    for (const category of categories) {
        if (category.startsWith('.')) continue;
        const catPath = path.join(contentDir, category);
        if (!fs.statSync(catPath).isDirectory()) continue;

        projects[category] = [];

        const projectFolders = fs.readdirSync(catPath);
        for (const projId of projectFolders) {
            if (projId.startsWith('.')) continue;
            const projPath = path.join(catPath, projId);
            if (!fs.statSync(projPath).isDirectory()) continue;

            const infoFile = path.join(projPath, 'info.txt');
            if (!fs.existsSync(infoFile)) continue;

            // Parse info.txt (Logic preserved)
            const content = fs.readFileSync(infoFile, 'utf-8');
            const lines = content.split('\n');

            const projectData = {
                id: projId,
                credits: []
            };

            for (let line of lines) {
                line = line.trim();
                if (!line || line.startsWith('#')) continue;
                const colonIndex = line.indexOf(':');
                if (colonIndex === -1) continue;
                const key = line.substring(0, colonIndex).trim();
                const value = line.substring(colonIndex + 1).trim();

                switch (key) {
                    case 'Title': if (typeof projectData.title !== 'object') projectData.title = value; break;
                    case 'Title FR': if (typeof projectData.title !== 'object') projectData.title = { fr: value, en: value }; else projectData.title.fr = value; break;
                    case 'Title EN': if (typeof projectData.title !== 'object') projectData.title = { fr: value, en: value }; else projectData.title.en = value; break;
                    case 'Subtitle': projectData.subtitle = value; break;
                    case 'Label': projectData.label = value; break;
                    case 'Year': projectData.year = value; break;
                    case 'Video': projectData.videoUrl = value; break;
                    case 'Private': projectData.isPrivate = (value.toLowerCase() === 'true'); break;
                    case 'Description FR': if (!projectData.description) projectData.description = {}; projectData.description.fr = value; break;
                    case 'Description EN': if (!projectData.description) projectData.description = {}; projectData.description.en = value; break;
                    case 'Credit':
                        let creditParts = value.split(':');
                        if (creditParts.length >= 2) {
                            let role = creditParts[0].trim();
                            let remaining = creditParts.slice(1).join(':').trim();
                            let isHighlight = false;
                            if (remaining.endsWith('*')) {
                                isHighlight = true;
                                remaining = remaining.substring(0, remaining.length - 1).trim();
                            }
                            if (remaining.includes(',')) {
                                projectData.credits.push({ role: role, names: remaining.split(',').map(s => s.trim()), highlight: isHighlight });
                            } else {
                                projectData.credits.push({ role: role, name: remaining, highlight: isHighlight });
                            }
                        }
                        break;
                }
            }

            // Asset Handling - CHANGED: Use Imports
            const files = fs.readdirSync(projPath);
            const imageFile = files.find(f => f.startsWith('thumbnail.') && !f.endsWith('.txt'));

            if (imageFile) {
                // DO NOT COPY
                // Generate variable name
                const varName = `img_${category}_${projId.replace(/-/g, '_')}`;
                importCounter++;

                // Path relative to projects.gen.js (src/zoltan/projects.gen.js)
                // zoltan-content is at root. 
                // projects.gen.js is at src/zoltan
                // Relative path: ../../zoltan-content/cat/proj/image.webp
                // Note: Windows paths need to be normalized to forward slashes for JS imports
                const absImagePath = path.join(projPath, imageFile);
                let relPath = path.relative(path.dirname(outputFile), absImagePath).split(path.sep).join('/');

                if (!relPath.startsWith('.')) relPath = './' + relPath; // Ensure strict relative path if needed

                imports.push(`import ${varName} from '${relPath}';`);

                // Assign variable name (we will inject this raw into the JSON string later)
                projectData.thumbnail = `__VAR__${varName}`;
            }

            projects[category].push(projectData);
        }
    }
}

// Transform the JSON string to replace "__VAR__name" with name (unquoted)
let projectsString = JSON.stringify(projects, null, 4);
// Regex to unquote variable placeholders
// Looks for "thumbnail": "__VAR__img_name" and replaces with "thumbnail": img_name
projectsString = projectsString.replace(/"thumbnail": "__VAR__(.*?)"/g, '"thumbnail": $1');

const fileContent = `
${imports.join('\n')}

export const projects = ${projectsString};
`;

fs.writeFileSync(outputFile, fileContent);

console.log(`Generated ${outputFile} successfully (Imports Mode).`);
