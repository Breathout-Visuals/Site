const fs = require('fs');
const path = require('path');

// --- 1. Define Valid Roles (Mirrored from src/main.js) ---
// I am copying these directly to ensure the script is self-contained and doesn't fail on imports
const ROLES = {
    // PERSONAL / BADGE ROLES
    key_grip_me: true,
    dop_me: true,
    spark_me: true,
    spark_reinforcement_me: true,
    grip_spark_me: true,
    camera_op_me: true,
    director_me: true,
    content_creation_me: true,
    dop_cam_me: true,
    gaffer_me: true,
    cam_dir_me: true,
    editor_me: true,
    unit_manager_me: true,
    screenwriter_me: true,
    camera_assistant_me: true,
    grip_me: true,

    // STANDARD ROLES
    producer: true,
    exec_producer: true,
    co_producer: true,
    line_producer: true,
    prod_manager: true,
    prod_coord: true,
    assist_prod_coord: true,
    prod_assist: true,
    unit_manager: true,
    unit_assist: true,
    loc_manager: true,
    assist_loc_manager: true,
    loc_assist: true,
    director: true,
    ad_1: true,
    ad_2: true,
    ad_3: true,
    ad_add: true,
    script_sup: true,
    storyboard: true,
    video_assist: true,
    dop: true,
    cam_op_a: true,
    cam_op_b: true,
    cam_op: true,
    steadicam: true,
    trinity: true,
    ac_1_a: true,
    ac_1_b: true,
    ac_1: true,
    ac_2: true,
    dit: true,
    video_op: true,
    photographer: true,
    gaffer: true,
    best_boy_elec: true,
    sparks: true,
    spark: true,
    key_grip: true,
    best_boy_grip: true,
    grips: true,
    grip: true,
    rig_gaffer: true,
    rig_grip: true,
    prod_design: true,
    art_dir: true,
    assist_art_dir: true,
    construction_coord: true,
    construction_crew: true,
    props_master: true,
    props_assist: true,
    set_dresser: true,
    set_decorator: true,
    painters: true,
    carpenters: true,
    model_maker: true,
    hmc: true,
    costume_designer: true,
    assist_costume: true,
    tailor: true,
    costume_sup: true,
    costume_assist: true,
    ager_dyer: true,
    set_costumer: true,
    makeup_head: true,
    hair_head: true,
    makeup_artist: true,
    hair_stylist: true,
    sfx_makeup: true,
    prosthetic: true,
    barber: true,
    sound: true,
    sound_mixer: true,
    boom_op: true,
    sound_utility: true,
    playback: true,
    transport_capt: true,
    drivers: true,
    sfx_sup: true,
    sfx_tech: true,
    pyro: true,
    vfx_sup: true,
    vfx_data: true,
    lidar: true,
    tech_tracking: true,
    drone_pilot: true,
    drone_op: true,
    drone_tech: true,
    stunt_rigger: true,
    cam_car: true,
    stunt_coord: true,
    stunt_perf: true,
    doubles: true,
    stunt_driver: true,
    safety: true,
    creature_design: true,
    animatronic: true,
    puppeteer: true,
    casting_dir: true,
    casting_assist: true,
    acting_coach: true,
    dial_coach: true,
    extras_coord: true,
    caterer: true,
    catering_crew: true,
    craft_service: true,
    editor: true,
    assist_editor: true,
    post_coord: true,
    colorist: true,
    assist_colorist: true,
    composer: true,
    orchestrator: true,
    conductor: true,
    musicians: true,
    music_mixer: true,
    sound_design: true,
    sound_editor: true,
    dial_editor: true,
    adr_editor: true,
    foley: true,
    foley_mixer: true,
    re_record_mixer: true,
    vfx_prod: true,
    lead_comp: true,
    compositors: true,
    "3d_artist": true,
    matte_paint: true,
    roto: true,
    matchmove: true,
    pipeline_td: true,
    motion_des: true,
    title_des: true,
    translator: true,
    dial_adapt: true,
    voice_actor: true,
    subtitler: true,
    safety_coord: true,
    medic: true,
    security: true,
    lab: true,
    archivist: true,
    distributor: true,
    publicist: true,
    epk: true
};
const VALID_ROLE_KEYS = Object.keys(ROLES);

// --- 2. Helper to Parse info.txt ---
const KEY_MAP = {
    'Name': 'title',
    'Type': 'category',
    'Date': 'date',
    'Role': 'role',
    'Status': 'status',
    'Project Link': 'link',
    'Description': 'desc_en',
    'Description Fr': 'desc_fr'
};

function parseInfoTxt(filePath) {
    const content = fs.readFileSync(filePath, 'utf-8');
    const lines = content.split(/\r?\n/);
    const data = {};
    lines.forEach(line => {
        const match = line.match(/^([^:]+):\s*(.*)$/);
        if (match) {
            const rawKey = match[1].trim();
            const value = match[2].trim();
            if (KEY_MAP[rawKey]) {
                data[KEY_MAP[rawKey]] = value;
            }
        }
    });
    return data;
}

// --- 3. Scan & Validate ---
const projectsDir = path.resolve(__dirname, '../../portfolio-content/Projets');
let report = [];

function scan(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    for (const entry of entries) {
        const fullPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
            scan(fullPath);
        } else if (entry.name === 'info.txt') {
            const data = parseInfoTxt(fullPath);
            const relativePath = path.relative(projectsDir, fullPath);

            const issues = [];

            // Check Role
            if (!data.role) {
                issues.push('MISSING: Role key is missing.');
            } else if (!VALID_ROLE_KEYS.includes(data.role)) {
                // Check if it's a known legacy or raw string
                issues.push(`INVALID ROLE: "${data.role}" is not a valid key.`);
            }

            // Check Title
            if (!data.title) issues.push('MISSING: Name (Title) is missing.');

            // Check Status
            if (!data.status) issues.push('MISSING: Status is missing.');

            if (issues.length > 0) {
                report.push({
                    file: relativePath,
                    roleFound: data.role,
                    issues: issues
                });
            }
        }
    }
}

if (fs.existsSync(projectsDir)) {
    scan(projectsDir);
} else {
    console.log("Projects directory not found at:", projectsDir);
}

console.log(JSON.stringify(report, null, 2));
