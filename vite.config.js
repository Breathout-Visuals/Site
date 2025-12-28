import { resolve } from 'path';
import { defineConfig } from 'vite';

export default defineConfig({
    build: {
        rollupOptions: {
            input: {
                main: resolve(__dirname, 'index.html'),
                lucas: resolve(__dirname, 'lucas-jacquot/index.html'),
                mariage: resolve(__dirname, 'mariage/index.html'),
                zoltan: resolve(__dirname, 'zoltan-hays/index.html'),
                zoltan_mariage: resolve(__dirname, 'zoltan-hays/mariage/index.html'),
                zoltan_fiction: resolve(__dirname, 'zoltan-hays/fiction/index.html'),
                zoltan_docu: resolve(__dirname, 'zoltan-hays/docu/index.html'),
                zoltan_corporate: resolve(__dirname, 'zoltan-hays/corporate/index.html'),
                zoltan_clips: resolve(__dirname, 'zoltan-hays/clips/index.html'),
                zoltan_reels: resolve(__dirname, 'zoltan-hays/reels/index.html'),
                // Zoltan Projects
                zoltan_p_marion: resolve(__dirname, 'zoltan-hays/mariage/marion-et-laurent/index.html'),
                zoltan_p_sous_controle: resolve(__dirname, 'zoltan-hays/fiction/sous-controle/index.html'),
                zoltan_p_abysse: resolve(__dirname, 'zoltan-hays/fiction/abysse/index.html'),
                zoltan_p_bergers: resolve(__dirname, 'zoltan-hays/docu/bergers-des-abeilles/index.html'),
                zoltan_p_baumettes: resolve(__dirname, 'zoltan-hays/corporate/baumettes/index.html'),
                zoltan_p_festival: resolve(__dirname, 'zoltan-hays/corporate/festival-impro/index.html'),
                zoltan_p_sante: resolve(__dirname, 'zoltan-hays/clips/bonne-sante/index.html'),
                zoltan_p_levelup: resolve(__dirname, 'zoltan-hays/clips/level-up/index.html'),
                zoltan_p_jamais: resolve(__dirname, 'zoltan-hays/clips/jamais/index.html'),
                zoltan_p_achat: resolve(__dirname, 'zoltan-hays/clips/achat/index.html'),
                zoltan_p_lelabo: resolve(__dirname, 'zoltan-hays/reels/le-labo/index.html'),
                zoltan_p_musee: resolve(__dirname, 'zoltan-hays/reels/musee-du-sport/index.html'),
            },
        },
    },
});
