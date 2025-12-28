const fs = require('fs');
const path = require('path');

// 1. Define ALL Valid Roles (matching src/data/roles.js)
// I am copying these to ensure independence from ES modules
const ALL_ROLES = [
    // PRODUCTION
    'producer', 'exec_producer', 'co_producer', 'line_producer', 'prod_manager', 'prod_coord',
    'assist_prod_coord', 'prod_assist', 'unit_manager', 'unit_assist', 'loc_manager',
    'assist_loc_manager', 'loc_assist',

    // DIRECTION
    'director', 'ad_1', 'ad_2', 'ad_3', 'ad_add', 'script_sup', 'storyboard', 'video_assist',

    // CAMERA
    'dop', 'cam_op_a', 'cam_op_b', 'cam_op', 'steadicam', 'trinity', 'ac_1_a', 'ac_1_b',
    'ac_1', 'ac_2', 'dit', 'video_op', 'photographer',

    // LIGHTING
    'gaffer', 'best_boy_elec', 'sparks', 'spark',

    // GRIP
    'key_grip', 'best_boy_grip', 'grips', 'grip', 'rig_gaffer', 'rig_grip',

    // ART
    'prod_design', 'art_dir', 'assist_art_dir', 'construction_coord', 'construction_crew',
    'props_master', 'props_assist', 'set_dresser', 'set_decorator', 'painters', 'carpenters',
    'model_maker', 'hmc',

    // COSTUMES
    'costume_designer', 'assist_costume', 'tailor', 'costume_sup', 'costume_assist',
    'ager_dyer', 'set_costumer',

    // HMC
    'makeup_head', 'hair_head', 'makeup_artist', 'hair_stylist', 'sfx_makeup', 'prosthetic', 'barber',

    // SOUND
    'sound', 'sound_mixer', 'boom_op', 'sound_utility', 'playback',

    // TRANSPORT
    'transport_capt', 'drivers',

    // SFX
    'sfx_sup', 'sfx_tech', 'pyro',

    // VFX SET
    'vfx_sup', 'vfx_data', 'lidar', 'tech_tracking',

    // SPECIALTY
    'drone_pilot', 'drone_op', 'drone_tech', 'stunt_rigger', 'cam_car',

    // STUNTS
    'stunt_coord', 'stunt_perf', 'doubles', 'stunt_driver', 'safety',

    // CREATURE
    'creature_design', 'animatronic', 'puppeteer',

    // CASTING
    'casting_dir', 'casting_assist', 'acting_coach', 'dial_coach', 'extras_coord',

    // CATERING
    'caterer', 'catering_crew', 'craft_service',

    // POST
    'editor', 'assist_editor', 'post_coord',

    // COLOR
    'colorist', 'assist_colorist',

    // MUSIC
    'composer', 'orchestrator', 'conductor', 'musicians', 'music_mixer',

    // POST SOUND
    'sound_design', 'sound_editor', 'dial_editor', 'adr_editor', 'foley', 'foley_mixer', 're_record_mixer',

    // VFX POST
    'vfx_prod', 'lead_comp', 'compositors', '3d_artist', 'matte_paint', 'roto', 'matchmove', 'pipeline_td',

    // TITLES
    'motion_des', 'title_des',

    // LOCALIZATION
    'translator', 'dial_adapt', 'voice_actor', 'subtitler',

    // SAFETY & LAB
    'safety_coord', 'medic', 'security', 'lab', 'archivist', 'distributor', 'publicist', 'epk'
];

const PROJECTS_DIR = path.resolve(__dirname, '../../portfolio-content/Projets');

function scanAndPopulate(dir) {
    if (!fs.existsSync(dir)) return;

    const entries = fs.readdirSync(dir, { withFileTypes: true });

    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);

        if (entry.isDirectory()) {
            scanAndPopulate(fullPath);
        } else if (entry.name === 'info.txt') {
            populateInfoFile(fullPath);
        }
    }
}

function populateInfoFile(filePath) {
    let content = fs.readFileSync(filePath, 'utf-8');

    // Check if [CREDITS] section exists
    if (!content.includes('[CREDITS]')) {
        content += '\n\n[CREDITS]';
    }

    const lines = content.split(/\r?\n/);
    let inCredits = false;
    const existingKeys = new Set();

    // Scan existing keys
    lines.forEach(line => {
        if (line.trim() === '[CREDITS]') {
            inCredits = true;
            return;
        }
        if (inCredits) {
            const match = line.match(/^([^:]+):/);
            if (match) {
                existingKeys.add(match[1].trim());
            }
        }
    });

    // Prepare lines to append
    let addedCount = 0;
    let newContent = content;

    // Ensure we append after [CREDITS]
    // If [CREDITS] is at the end, just append. 
    // If there is content after [CREDITS], we need to be careful, but usually [CREDITS] is last.
    // For simplicity, we assume [CREDITS] is the last section or we append to the end.

    // Better strategy: Split by [CREDITS], take the second part, append missing, rejoin.
    const parts = content.split('[CREDITS]');
    const preCredits = parts[0];
    const postCredits = parts[1] || ''; // This is the existing credits body

    let newCreditsBody = postCredits;
    // Add a newline if needed
    if (!newCreditsBody.endsWith('\n')) newCreditsBody += '\n';

    ALL_ROLES.forEach(roleKey => {
        if (!existingKeys.has(roleKey)) {
            newCreditsBody += `${roleKey}:\n`;
            addedCount++;
        }
    });

    if (addedCount > 0) {
        const finalContent = preCredits + '[CREDITS]' + newCreditsBody;
        fs.writeFileSync(filePath, finalContent, 'utf-8');
        console.log(`Updated ${path.basename(path.dirname(filePath))}: Added ${addedCount} missing roles.`);
    } else {
        console.log(`Skipped ${path.basename(path.dirname(filePath))}: All roles already present (or file structure complex).`);
    }
}

console.log("Starting Credits Population...");
scanAndPopulate(PROJECTS_DIR);
console.log("Done.");
