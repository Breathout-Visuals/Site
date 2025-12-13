// --- Roles Data ---
export const ROLES = {
    // ==========================================
    // PERSONAL / BADGE ROLES (Custom translations for Main Badge)
    // ==========================================

    // Explicit "Me" Roles using original provided translations
    key_grip_me: { fr: "Chef Machiniste", en: "Key Grip" },
    dop_me: { fr: "Directeur de la Photographie", en: "Director of Photography" },
    spark_me: { fr: "Électricien", en: "Spark" }, // Assuming needed? keeping generic spark also
    spark_reinforcement_me: { fr: "Renfort Électricien", en: "Spark Reinforcement" },
    grip_spark_me: { fr: "Électro & Machino", en: "Grip & Spark" },
    camera_op_me: { fr: "Cadreur", en: "Camera Operator" },
    director_me: { fr: "Réalisateur", en: "Director" },
    content_creation_me: { fr: "Création de Contenu", en: "Content Creation" },
    dop_cam_me: { fr: "Directeur de la Photo & Cadreur", en: "Director of Photography & Camera Op" },
    gaffer_me: { fr: "Chef Électricien", en: "Gaffer" },
    cam_dir_me: { fr: "Réalisateur & Cadreur", en: "Director & Camera Op" },
    editor_me: { fr: "Monteur", en: "Editor" },
    unit_manager_me: { fr: "Régisseur", en: "Unit Manager" },
    screenwriter_me: { fr: "Scénariste", en: "Screenwriter" },
    camera_assistant_me: { fr: "Assistant Caméra", en: "Camera Assistant" },
    grip_me: { fr: "Machiniste", en: "Grip" },

    // ==========================================
    // CREDITS ROLES (Comprehensive List - Standard Industry Terms)
    // ==========================================

    // --- PRODUCTION ---
    producer: { fr: "Producteur", en: "Producer" },
    exec_producer: { fr: "Producteur Exécutif", en: "Executive Producer" },
    co_producer: { fr: "Co-Producteur", en: "Co-Producer" },
    line_producer: { fr: "Producteur Exécutif", en: "Line Producer" },
    prod_manager: { fr: "Directeur de Production", en: "Production Manager" },
    prod_coord: { fr: "Coordinateur de Prod", en: "Production Coordinator" },
    assist_prod_coord: { fr: "Assistant Coord. Prod", en: "Assistant Prod. Coord" },
    prod_assist: { fr: "Assistant de Prod", en: "Production Assistant" },
    unit_manager: { fr: "Régisseur Général", en: "Unit Manager" }, // Note: slight difference in translation
    unit_assist: { fr: "Régisseur Adjoint", en: "Unit Assistant" },
    loc_manager: { fr: "Repéreur", en: "Location Manager" },
    assist_loc_manager: { fr: "Assistant Repéreur", en: "Assistant Location Manager" },
    loc_assist: { fr: "Assistant Régie", en: "Location Assistant" },

    // --- DIRECTION ---
    director: { fr: "Réalisateur", en: "Director" }, // Standard Credit
    ad_1: { fr: "1er Assistant Réal.", en: "1st AD" },
    ad_2: { fr: "2nd Assistant Réal.", en: "2nd AD" },
    ad_3: { fr: "3ème Assistant Réal.", en: "3rd AD" },
    ad_add: { fr: "Renfort Mise en Scène", en: "Add. AD" },
    script_sup: { fr: "Scripte", en: "Script Supervisor" },
    storyboard: { fr: "Storyboarder", en: "Storyboard Artist" },
    video_assist: { fr: "Operator Vidéo", en: "Video Assist" },

    // --- CAMERA ---
    dop: { fr: "Chef Opérateur", en: "D.O.P" }, // Standard Credit
    cam_op_a: { fr: "Cadreur Cam A", en: "Camera Operator A" },
    cam_op_b: { fr: "Cadreur Cam B", en: "Camera Operator B" },
    cam_op: { fr: "Cadreur", en: "Camera Operator" },
    steadicam: { fr: "Steadicam", en: "Steadicam Operator" },
    trinity: { fr: "Opérateur Trinity", en: "Trinity Operator" },
    ac_1_a: { fr: "1er Ass. Caméra A", en: "1st AC A" },
    ac_1_b: { fr: "1er Ass. Caméra B", en: "1st AC B" },
    ac_1: { fr: "1er Assistant Caméra", en: "1st AC" },
    ac_2: { fr: "2nd Assistant Caméra", en: "2nd AC" },
    dit: { fr: "DIT", en: "DIT" },
    video_op: { fr: "Opérateur Vidéo", en: "Video Operator" },
    photographer: { fr: "Photographe de Plateau", en: "Still Photographer" },

    // --- LIGHTING ---
    gaffer: { fr: "Chef Électricien", en: "Gaffer" }, // Matches, but keeping separate if needed or can merge if identical
    best_boy_elec: { fr: "Best Boy Élec", en: "Best Boy Electric" },
    sparks: { fr: "Électriciens", en: "Sparks" },
    spark: { fr: "Électricien", en: "Spark" },

    // --- GRIP ---
    key_grip: { fr: "Chef Machiniste", en: "Key Grip" },
    best_boy_grip: { fr: "Best Boy Machino", en: "Best Boy Grip" },
    grips: { fr: "Machinistes", en: "Grips" },
    grip: { fr: "Machiniste", en: "Grip" }, // Standard
    rig_gaffer: { fr: "Chef Élec Rigging", en: "Rigging Gaffer" },
    rig_grip: { fr: "Chef Machino Rigging", en: "Rigging Grip" },

    // --- ART ---
    prod_design: { fr: "Chef Décorateur", en: "Production Designer" },
    art_dir: { fr: "Directeur Artistique", en: "Art Director" },
    assist_art_dir: { fr: "Assistant DA", en: "Assistant Art Director" },
    construction_coord: { fr: "Coord. Construction", en: "Construction Coord" },
    construction_crew: { fr: "Équipe Construction", en: "Construction Crew" },
    props_master: { fr: "Accessoiriste", en: "Props Master" },
    props_assist: { fr: "Renfort Accessoiriste", en: "Props Assistant" },
    set_dresser: { fr: "Ensemblier", en: "Set Dresser" },
    set_decorator: { fr: "Décorateur", en: "Set Decorator" },
    painters: { fr: "Peintres", en: "Painters" },
    carpenters: { fr: "Menuisiers", en: "Carpenters" },
    model_maker: { fr: "Maquettiste", en: "Model Maker" },
    hmc: { fr: "HMC", en: "Hair & Makeup" },

    // --- COSTUMES ---
    costume_designer: { fr: "Chef Costumier", en: "Costume Designer" },
    assist_costume: { fr: "Assistant Costumes", en: "Assistant Costume Designer" },
    tailor: { fr: "Tailleur", en: "Tailor" },
    costume_sup: { fr: "Superviseur Costumes", en: "Costume Supervisor" },
    costume_assist: { fr: "Habilleur", en: "Costume Assistant" },
    ager_dyer: { fr: "Patineur", en: "Ager / Dyer" },
    set_costumer: { fr: "Costumier Plateau", en: "Set Costumer" },

    // --- HMC ---
    makeup_head: { fr: "Chef Maquilleur", en: "Makeup Dept. Head" },
    hair_head: { fr: "Chef Coiffeur", en: "Hair Dept. Head" },
    makeup_artist: { fr: "Maquilleur", en: "Makeup Artist" },
    hair_stylist: { fr: "Coiffeur", en: "Hair Stylist" },
    sfx_makeup: { fr: "Maquillage SFX", en: "SFX Makeup" },
    prosthetic: { fr: "Prothésiste", en: "Prosthetic Artist" },
    barber: { fr: "Barbier", en: "Barber" },

    // --- SOUND ---
    sound: { fr: "Son", en: "Sound" },
    sound_mixer: { fr: "Ingénieur du Son", en: "Sound Mixer" },
    boom_op: { fr: "Perchman", en: "Boom Operator" },
    sound_utility: { fr: "Assistant Son", en: "Sound Utility" },
    playback: { fr: "Opérateur Playback", en: "Playback Operator" },

    // --- TRANSPORT ---
    transport_capt: { fr: "Responsable Transports", en: "Transport Captain" },
    drivers: { fr: "Chauffeurs", en: "Drivers" },

    // --- SFX ---
    sfx_sup: { fr: "Chef SFX", en: "SFX Supervisor" },
    sfx_tech: { fr: "Technicien SFX", en: "SFX Technician" },
    pyro: { fr: "Pyrotechnicien", en: "Pyrotechnician" },

    // --- VFX SET ---
    vfx_sup: { fr: "Superviseur VFX", en: "VFX Supervisor" },
    vfx_data: { fr: "Data Wrangler VFX", en: "VFX Data Wrangler" },
    lidar: { fr: "Opérateur Lidar", en: "Lidar Operator" },
    tech_tracking: { fr: "Équipe Tracking", en: "Tracking Team" },

    // --- SPECIALTY ---
    drone_pilot: { fr: "Pilote Drone", en: "Drone Pilot" },
    drone_op: { fr: "Cadreur Drone", en: "Drone Camera Op" },
    drone_tech: { fr: "Technicien Drone", en: "Drone Technician" },
    stunt_rigger: { fr: "Rigger Cascade", en: "Stunt Rigger" },
    cam_car: { fr: "Tech. Voiture Travelling", en: "Camera Car Tech" },

    // --- STUNTS ---
    stunt_coord: { fr: "Coordinateur Cascades", en: "Stunt Coordinator" },
    stunt_perf: { fr: "Cascadeur", en: "Stunt Performer" },
    doubles: { fr: "Doublure", en: "Stunt Double" },
    stunt_driver: { fr: "Pilote de Précision", en: "Stunt Driver" },
    safety: { fr: "Sécurité", en: "Safety Officer" },

    // --- CREATURE ---
    creature_design: { fr: "Design Créature", en: "Creature Designer" },
    animatronic: { fr: "Opérateur Animatronique", en: "Animatronic Op" },
    puppeteer: { fr: "Marionnettiste", en: "Puppeteer" },

    // --- CASTING ---
    casting_dir: { fr: "Directeur de Casting", en: "Casting Director" },
    casting_assist: { fr: "Assistant Casting", en: "Casting Assistant" },
    acting_coach: { fr: "Coach Acteur", en: "Acting Coach" },
    dial_coach: { fr: "Coach Dialogue", en: "Dialogue Coach" },
    extras_coord: { fr: "Coord. Figuration", en: "Extras Coordinator" },

    // --- CATERING ---
    caterer: { fr: "Cantine", en: "Caterer" },
    catering_crew: { fr: "Équipe Cantine", en: "Catering Crew" },
    craft_service: { fr: "Table Régie", en: "Craft Services" },

    // --- POST ---
    editor: { fr: "Monteur", en: "Editor" },
    assist_editor: { fr: "Assistant Monteur", en: "Assistant Editor" },
    post_coord: { fr: "Coord. Post-Prod", en: "Post-Prod Coord" },

    // --- COLOR ---
    colorist: { fr: "Étalonneur", en: "Colorist" },
    assist_colorist: { fr: "Assistant Étalonnage", en: "Assistant Colorist" },

    // --- MUSIC ---
    composer: { fr: "Compositeur", en: "Composer" },
    orchestrator: { fr: "Orchestrateur", en: "Orchestrator" },
    conductor: { fr: "Chef d'Orchestre", en: "Conductor" },
    musicians: { fr: "Musiciens", en: "Musicians" },
    music_mixer: { fr: "Mixeur Musique", en: "Music Mixer" },

    // --- POST SOUND ---
    sound_design: { fr: "Sound Design", en: "Sound Design" },
    sound_editor: { fr: "Monteur Son", en: "Sound Editor" },
    dial_editor: { fr: "Monteur Dialogues", en: "Dialogue Editor" },
    adr_editor: { fr: "Monteur ADR", en: "ADR Editor" },
    foley: { fr: "Bruiteur", en: "Foley Artist" },
    foley_mixer: { fr: "Mixeur Bruitage", en: "Foley Mixer" },
    re_record_mixer: { fr: "Mixeur", en: "Re-recording Mixer" },

    // --- VFX POST ---
    vfx_prod: { fr: "Producteur VFX", en: "VFX Producer" },
    lead_comp: { fr: "Lead Compositing", en: "Lead Compositor" },
    compositors: { fr: "Compositeurs", en: "Compositors" },
    "3d_artist": { fr: "Artiste 3D", en: "3D Artist" },
    matte_paint: { fr: "Matte Painter", en: "Matte Painter" },
    roto: { fr: "Rotoscopeur", en: "Roto Artist" },
    matchmove: { fr: "Matchmove", en: "Matchmove Artist" },
    pipeline_td: { fr: "Pipeline TD", en: "Pipeline TD" },

    // --- TITLES ---
    motion_des: { fr: "Motion Designer", en: "Motion Designer" },
    title_des: { fr: "Générique", en: "Title Designer" },

    // --- LOCALIZATION ---
    translator: { fr: "Traducteur", en: "Translator" },
    dial_adapt: { fr: "Adaptation", en: "Dialogue Adapt." },
    voice_actor: { fr: "Doublage", en: "Voice Actor" },
    subtitler: { fr: "Sous-titreur", en: "Subtitle Artist" },

    // --- SAFETY & LAB ---
    safety_coord: { fr: "Coord. Sécurité", en: "Safety Coordinator" },
    medic: { fr: "Médic", en: "Set Medic" },
    security: { fr: "Sécurité", en: "Security" },
    lab: { fr: "Laboratoire", en: "Film Lab" },
    archivist: { fr: "Archiviste", en: "Archivist" },
    distributor: { fr: "Distributeur", en: "Distributor" },
    publicist: { fr: "Publiciste", en: "Publicist" },
    epk: { fr: "Équipe EPK", en: "EPK Crew" }
};
