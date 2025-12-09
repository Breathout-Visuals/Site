const fs = require('fs');
const path = require('path');

// --- DATA FROM MAIN.JS ---
const CATEGORIES = {
    SHORT_FILM: "short_film",
    COMMERCIAL: "commercial",
    MUSIC_VIDEO: "music_video",
    DOCUMENTARY: "documentary",
    SOCIAL: "social_media",
    WEDDING: "wedding"
};

const STATUS = {
    EDITING: "En montage",
    DELIVERED: "Délivré",
    DISTRIBUTION: "En distribution",
    ONGOING: "En cours"
};

const ROLES = {
    key_grip: { fr: "Chef Machiniste", en: "Key Grip" },
    dop: { fr: "Directeur de la Photographie", en: "Director of Photography" },
    spark: { fr: "Électro", en: "Spark" },
    spark_reinforcement: { fr: "Renfort Électro", en: "Spark" },
    grip_spark: { fr: "Électro & Machino", en: "Grip & Spark" },
    camera_op: { fr: "Cadreur", en: "Camera Operator" },
    director: { fr: "Réalisateur", en: "Director" },
    cam_dop: { fr: "Cadreur & DoP", en: "Camera Operator & DoP" },
    content_creation: { fr: "Création de Contenu", en: "Content Creation" },
    dop_cam: { fr: "DoP & Cadreur", en: "DoP & Camera Op" },
    gaffer: { fr: "Chef Électricien", en: "Gaffer" },
    cam_dir: { fr: "Cadreur & Réalisateur", en: "Camera Op & Director" }
};

const projects = [
    {
        id: 1,
        title: "Marcello",
        category: CATEGORIES.SHORT_FILM,
        role: "key_grip",
        desc: {
            fr: "Court-métrage réalisé pour des festivals, produit en association. L'histoire plonge dans le monde du journalisme niçois des années 1980. J'y ai travaillé comme Chef Machiniste, encadrant une équipe de 2 à 4 techniciens, de la pré-production à l'intense travail de plateau.",
            en: "Short film made for festivals, produced under a non-profit association. The story dives into the world of Nice journalism in the 1980s. I worked as Key Grip, managing a team of 2 to 4 technicians from pre-production to set preparation and an intense on-set workload."
        },
        folderName: "Marcello"
    },
    {
        id: 2,
        title: "Le miroir des générations",
        category: CATEGORIES.SHORT_FILM,
        role: "dop",
        desc: {
            fr: "Court-métrage réalisé pour le Nikon Film Festival sur le thème « Le Feu ». Le film explore la transmission, la perception de soi et les liens intergénérationnels. J'étais Directeur de la Photographie.",
            en: "Short film created for the Nikon Film Festival, on the theme “Beauty.” The film explores transmission, self-perception, and generational shifts. I was Director of Photography."
        },
        folderName: "Le miroir des générations" // Guessing folder name based on title
    },
    {
        id: 3,
        title: "Dîner d’Affaire",
        category: CATEGORIES.SHORT_FILM,
        role: "spark",
        desc: {
            fr: "Court-métrage tourné pour le 48h Côte d’Azur, sur le thème « Repas ». L'histoire suit une artiste qui confronte son producteur toxique. Initialement engagé comme Électro, j'ai finalement pris en charge toute la machinerie durant le tournage.",
            en: "Short film shot for the 48h Côte d’Azur, on the theme “Dinner.” The story follows an artist confronting her toxic producer. Originally hired as Electrician, I ended up taking full charge of the grip department during the shoot."
        },
        folderName: "Dîner d’Affaire"
    },
    {
        id: 4,
        title: "Converse",
        category: CATEGORIES.COMMERCIAL,
        role: "spark_reinforcement",
        desc: {
            fr: "Publicité (Spec Ad) réalisée par une équipe de l'ESRA. Un tournage entièrement sous la pluie, nécessitant une gestion électrique rigoureuse et sécurisée. J'y ai travaillé comme renfort Électro.",
            en: "Spec ad made by an ESRA team. A shoot entirely under rain, requiring rigorous and safe electrical management. I worked as Electrician reinforcement."
        },
        folderName: "Converse"
    },
    {
        id: 5,
        title: "Fishermen Friends",
        category: CATEGORIES.COMMERCIAL,
        role: "grip_spark",
        desc: {
            fr: "Publicité (Spec Ad) produite par une équipe de l'ESRA, tournée entièrement en studio. Un décor surélevé qui exigeait une grande rigueur technique. J'ai occupé les postes d'Électro et Machiniste.",
            en: "Spec ad produced by an ESRA team, shot entirely in studio. A raised set that demanded significant technical rigour. I worked as Electrician and Grip."
        },
        folderName: "Fishermen Friends"
    },
    {
        id: 6,
        title: "Nassim Boukrouh",
        category: CATEGORIES.SOCIAL,
        role: "camera_op",
        desc: {
            fr: "Série de vidéos YouTube pour un créateur de contenu immobilier. Tournages mobiles à travers la Suisse dans des environnements variés. J'étais Cadreur.",
            en: "YouTube video series for a real-estate content creator. Mobile shoots across Switzerland in varied environments. I worked as Camera Operator."
        },
        folderName: "Nassim Boukrouh"
    },
    {
        id: 7,
        title: "Komani",
        category: CATEGORIES.MUSIC_VIDEO,
        role: "director",
        desc: {
            fr: "Clip vidéo pour l'artiste Faz’r Elengi. Tourné dans quatre lieux différents, avec notamment ma première gestion de voitures de drift sur le plateau. J'ai réalisé le clip et supervisé toute la mise en scène.",
            en: "Music video for artist Faz’r Elengi. Shot across four locations, including my first time managing drift cars on set. I directed the video and supervised the full staging."
        },
        folderName: "Komani"
    },
    {
        id: 8,
        title: "Jamais",
        category: CATEGORIES.MUSIC_VIDEO,
        role: "dop",
        desc: {
            fr: "Clip vidéo pour Faz’r Elengi tourné en studio d'enregistrement. Une création simple mais efficace avec très peu de matériel. J'étais Directeur de la Photographie.",
            en: "Music video for Faz’r Elengi shot in a recording studio. A simple but effective creation with very minimal gear. I was Director of Photography."
        },
        folderName: "Jamais"
    },
    {
        id: 9,
        title: "M&L",
        category: CATEGORIES.WEDDING,
        role: "cam_dop",
        desc: {
            fr: "Film de mariage tourné au Mas des 5 Fontaines. Un mélange entre captation documentaire et approche cinématographique. J'étais Cadreur et Directeur de la Photographie.",
            en: "Wedding film shot at Mas des 5 Fontaines. A mix between documentary capture and cinematic approach. I worked as Camera Operator and Director of Photography."
        },
        folderName: "M&L"
    },
    {
        id: 10,
        title: 'Instagram Reels',
        category: CATEGORIES.SOCIAL,
        role: "content_creation",
        desc: {
            en: 'A collection of dynamic, high-engagement reels created for various brands and personal projects.',
            fr: 'Une collection de reels dynamiques créés pour diverses marques et projets personnels.'
        },
        folderName: "Instagram Reel" // Folder is singular
    },
    {
        id: 11,
        title: "Bonne Santé – Visualiser",
        category: CATEGORIES.MUSIC_VIDEO,
        role: "dop",
        desc: {
            fr: "Visualizer musical pour Faz’r Elengi. Un concept épuré et ciblé, centré sur la performance et l'esthétique. J'étais Directeur de la Photographie.",
            en: "Music visualizer for Faz’r Elengi. A clean, focused concept centred on performance and aesthetics. I was Director of Photography."
        },
        folderName: "Bonne Santé – Visualiser"
    },
    {
        id: 12,
        title: "Bergers des Abeilles",
        category: CATEGORIES.DOCUMENTARY,
        role: "dop_cam",
        desc: {
            fr: "Documentaire de festival suivant des apiculteurs et le rôle vital des abeilles. Un film ancré dans le travail de terrain et l'artisanat traditionnel. J'étais Directeur de la Photographie et Cadreur.",
            en: "Festival-oriented documentary following beekeepers and the vital role of bees. A film grounded in real fieldwork and traditional crafts. I was Director of Photography and Camera Operator."
        },
        folderName: "Bergers des Abeilles"
    },
    {
        id: 13,
        title: "Fort Intérieur",
        category: CATEGORIES.SHORT_FILM,
        role: "dop",
        desc: {
            fr: "Court-métrage d'un étudiant de Studio M. L'histoire d'un jeune homme héritant de la maison familiale et confrontant un traumatisme enfoui. J'ai travaillé comme Directeur de la Photographie.",
            en: "Short film by a Studio M student. The story of a young man inheriting his family home and confronting buried trauma. I worked as Director of Photography."
        },
        folderName: "Fort Intérieur"
    },
    {
        id: 14,
        title: "Léo",
        category: CATEGORIES.SHORT_FILM,
        role: "camera_op",
        desc: {
            fr: "Court-métrage pour le Nikon Film Festival 2024, thème « Super-héros ». Un jeune garçon handicapé imagine marcher comme dans ses comics préférés. J'étais Cadreur.",
            en: "Short film for the Nikon Film Festival 2024, theme “Superhero.” A young disabled boy imagines walking like in his favourite comics. I was Camera Operator."
        },
        folderName: "Léo"
    },
    {
        id: 15,
        title: "Parles-moi",
        category: CATEGORIES.SHORT_FILM,
        role: "gaffer",
        desc: {
            fr: "Court-métrage pour le Nikon 2025. Un couple déstabilisé par une hospitalisation soudaine, naviguant entre fragilité et intimité. J'étais Chef Électricien (Gaffer), créant une lumière douce et émotionnelle.",
            en: "Short film for the Nikon 2025, theme “Beauty.” A couple destabilised by a sudden hospitalisation, navigating fragility and intimacy. I was Gaffer, crafting a soft and emotional lighting approach."
        },
        folderName: "Parles-moi"
    },
    {
        id: 16,
        title: "Des collines aux machines",
        category: CATEGORIES.DOCUMENTARY,
        role: "director",
        desc: {
            fr: "Documentaire de festival sur les bergers modernes et les défis qu'ils affrontent aujourd'hui. Un regard authentique sur la tension entre tradition et modernité. J'ai réalisé le film.",
            en: "Festival documentary about modern shepherds and the challenges they face today. An authentic look at the tension between tradition and modernity. I directed the film."
        },
        folderName: "Des collines aux machines"
    },
    {
        id: 17,
        title: "Nouvelle Ecoute",
        category: CATEGORIES.SHORT_FILM,
        role: "camera_op",
        desc: {
            fr: "Court-métrage pour le Festival TousHanscene. Un jeune sourd perd ses appareils auditifs et fait face à une journée d'obstacles. J'étais Cadreur.",
            en: "Short film for the TousHanscene Festival. A young deaf man loses his hearing devices and faces a day of obstacles. I was Camera Operator."
        },
        folderName: "Nouvelle Ecoute"
    },
    {
        id: 18,
        title: "Level Up",
        category: CATEGORIES.MUSIC_VIDEO,
        role: "cam_dir",
        desc: {
            fr: "Clip vidéo pour l'artiste VIO. Un univers dynamique mêlant danse, rythme et une identité visuelle marquante. J'ai réalisé le vidéo.",
            en: "Music video for artist VIO. A dynamic universe blending dance, rhythm, and a striking visual identity. I directed the video."
        },
        folderName: "Level Up"
    },
    {
        id: 19,
        title: "The Street Partners",
        category: CATEGORIES.COMMERCIAL,
        role: "dop",
        desc: {
            fr: "Publicité pour The Street Partners. Une approche corporate moderne axée sur le branding et une image soignée. J'étais Directeur de la Photographie.",
            en: "Commercial for The Street Partners. A modern corporate approach focused on branding and clean imagery. I was Director of Photography."
        },
        folderName: "The Street Partners"
    }
];

// --- LOGIC ---

// Map Category Keys to Folder Names
const CAT_FOLDERS = {
    short_film: "Short Film",
    commercial: "Commercial",
    music_video: "Music Video",
    documentary: "Documentary",
    social_media: "Social Media",
    wedding: "Weddings" // Note the 's'
};

const BASE_DIR = path.resolve(__dirname, '../Contents projets/Projets');

function findProjectFile(project) {
    const catFolder = CAT_FOLDERS[project.category];
    if (!catFolder) {
        console.error(`Unknown category folder for ${project.category}`);
        return null;
    }

    // Try exact folder name
    let projectPath = path.join(BASE_DIR, catFolder, project.folderName);

    // Handlers for known mismatches if any, but our list seems accurate to earlier `ls`
    // Except "Instagram Reels" vs "Instagram Reel" in Social Media
    if (project.id === 10) {
        projectPath = path.resolve(__dirname, '../Contents projets/Instagram Reel'); // It's at root of Contents? No, let's check ls output
        // ls output said: Contents projets\Instagram Reel (Parallel to Projets)
        // Wait, let's check if it moved inside Projets/Social Media or stayed outside. 
        // The `ls` showed "Instagram Reel" adjacent to "Projets".
        // But `projects.js` has category: social_media. 
        // Let's assume for now it might be in `Contents projets/Instagram Reel`.
    }

    const infoPath = path.join(projectPath, 'info.txt');

    if (fs.existsSync(infoPath)) {
        return infoPath;
    }

    // Try searching if exact name fails
    // (Not implemented for safety, we want exact matches)
    console.warn(`File not found: ${infoPath}`);
    return null;
}


projects.forEach(p => {
    // Special case for Instagram Reel if it's outside
    let finalPath = null;
    if (p.id === 10) {
        finalPath = path.resolve(__dirname, '../Contents projets/Instagram Reel/info.txt');
    } else {
        finalPath = findProjectFile(p);
    }

    if (finalPath && fs.existsSync(finalPath)) {
        console.log(`Updating: ${p.title}`);
        let content = fs.readFileSync(finalPath, 'utf-8');

        // Check if Description Fr already exists
        if (!content.includes('Description Fr:')) {
            // Append it
            const descFr = p.desc.fr;

            // Ensure we have a clean newline before appending
            if (!content.endsWith('\n')) content += '\n';

            content += `Description Fr: ${descFr}\n`;

            fs.writeFileSync(finalPath, content, 'utf-8');
        } else {
            console.log(" - Already verified.");
        }

    } else {
        // Try look into Social Media folder for Nassim?
        console.log(`SKIPPED: ${p.title} (File not found)`);
    }
});

console.log("Backport complete.");
