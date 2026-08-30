import { resolve } from 'path';
import { defineConfig } from 'vite';
import { exec } from 'child_process';

const runScript = (script, label) => {
    exec(`node ${script}`, (err, stdout, stderr) => {
        if (err) console.error(`[${label} Error] ${stderr}`);
        else if (stdout.trim()) console.log(`[${label}] ${stdout.trim()}`);
    });
};

const contentWatcher = () => ({
    name: 'content-watcher',
    configureServer(server) {
        const ppDir = resolve(__dirname, 'portfolio-freelance-content');
        const lucasDir = resolve(__dirname, 'portfolio-cinema-content');
        server.watcher.add(ppDir);
        server.watcher.add(lucasDir);

        const generate = (file) => {
            // Normalize path for Windows compatibility
            const normalizedFile = file.replace(/\\/g, '/');
            
            if (normalizedFile.includes('/portfolio-freelance-content/')) {
                console.log(`[Content Watcher] portfolio-freelance-content changed → regenerating...`);
                runScript('scripts/portfolio-pro/generate.cjs', 'Portfolio Pro Gen');
            }
            if (normalizedFile.includes('/portfolio-cinema-content/')) {
                console.log(`[Content Watcher] Lucas Content changed → regenerating...`);
                runScript('scripts/lucas/generate-data.cjs', 'Lucas Data Gen');
            }
        };

        server.watcher.on('change', generate);
        server.watcher.on('add', generate);
        server.watcher.on('unlink', generate);
    }
});

export default defineConfig({
    plugins: [contentWatcher()],
    build: {
        rollupOptions: {
            input: {
                // Lucas Jacquot Cinema Portfolio
                lucas: resolve(__dirname, 'lucas-jacquot/index.html'),
                // Portfolio Pro (Breathout Visuals)
                portfolio_pro:         resolve(__dirname, 'index.html'),
                portfolio_pro_project: resolve(__dirname, 'portfolio-freelance/project.html'),
                portfolio_pro_projets: resolve(__dirname, 'portfolio-freelance/projets.html'),
                portfolio_pro_contact: resolve(__dirname, 'portfolio-freelance/contact.html'),
            },
        },
    },
});
