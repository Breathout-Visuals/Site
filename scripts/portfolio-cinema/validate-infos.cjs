const fs = require('fs');
const path = require('path');

const rootDir = path.join(__dirname, '../../portfolio-cinema-content/Projets');

const requiredFields = [
    'Name:', 'Category:', 'Subcategory:', 'Type:', 'Role:', 
    'Status:', 'Date:', 'Link:', 'Description:', 'Description Fr:', 
    'Camera:', 'Lens:'
];

const disallowedStrings = ['[CREDITS]'];

let hasErrors = false;

function walkDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            walkDir(fullPath);
        } else if (file.toLowerCase() === 'info.txt') {
            validateFile(fullPath);
        }
    }
}

function validateFile(filePath) {
    const content = fs.readFileSync(filePath, 'utf8');
    const lines = content.split('\n').map(l => l.trim());
    
    // Check for disallowed strings (like [CREDITS])
    for (const disallowed of disallowedStrings) {
        if (content.includes(disallowed)) {
            console.error(`❌ ERREUR dans ${filePath} : Contient la section interdite "${disallowed}" (merci de l'enlever).`);
            hasErrors = true;
        }
    }

    // Check for required fields
    for (const field of requiredFields) {
        const hasField = lines.some(l => l.startsWith(field));
        if (!hasField) {
            console.error(`❌ ERREUR dans ${filePath} : Il manque le champ obligatoire "${field}".`);
            hasErrors = true;
        }
    }
}

console.log('--- Vérification des templates info.txt ---');
if (fs.existsSync(rootDir)) {
    walkDir(rootDir);
} else {
    console.warn(`Dossier non trouvé: ${rootDir}`);
}

if (hasErrors) {
    console.error('\n🔴 Validation échouée. Veuillez corriger les fichiers info.txt pour respecter la template.');
    process.exit(1);
} else {
    console.log('\n✅ Tous les fichiers info.txt respectent parfaitement la template !');
    process.exit(0);
}
