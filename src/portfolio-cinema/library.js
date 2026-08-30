/**
 * ============================================================================
 * BIBLIOTHÈQUE CENTRALE (DICTIONARY)
 * ============================================================================
 * Structure (4 colonnes) :
 * 1. Clé courte (Diminutif ultra-léger pour le info.txt)
 * 2. en : Anglais
 * 3. fr : Français
 * 4. extra : Colonne libre (icône, couleur, tri, etc.)
 * ============================================================================
 */

export const LIBRARY = {

    // ------------------------------------------------------------------------
    // 1. CATÉGORIES (Filtres principaux)
    // ------------------------------------------------------------------------
    categories: {
        all:  { en: "All",            fr: "Tout",              extra: "" },
        fic:  { en: "Fiction",        fr: "Fiction",           extra: "" },
        crp:  { en: "Corporate",      fr: "Corporate",         extra: "" },
        doc:  { en: "Documentary",    fr: "Documentaire",      extra: "" },
        clp:  { en: "Music Video",    fr: "Clip Musical",      extra: "" },
        soc:  { en: "Social Media",   fr: "Réseaux Sociaux",   extra: "" },
        wed:  { en: "Wedding",        fr: "Mariage",           extra: "" }
    },

    // ------------------------------------------------------------------------
    // 2. SOUS-CATÉGORIES
    // ------------------------------------------------------------------------
    subcategories: {
        // Fiction
        sf:   { en: "Short Film",     fr: "Court-métrage",     extra: "" },
        ftr:  { en: "Feature Film",   fr: "Long-métrage",      extra: "" },
        ser:  { en: "Series",         fr: "Série",             extra: "" },
        // Corporate
        cflm: { en: "Corporate Film", fr: "Film d'Entreprise", extra: "" },
        ad:   { en: "Advertisement",  fr: "Publicité",         extra: "" },
        itw:  { en: "Interview",      fr: "Interview",         extra: "" },
        // Social Media
        yt:   { en: "YouTube",        fr: "YouTube",           extra: "" },
        vrt:  { en: "Vertical Content", fr: "Format Vertical", extra: "" }
    },

    // ------------------------------------------------------------------------
    // 3. TYPES (Festivals, concours...)
    // ------------------------------------------------------------------------
    types: {
        yt: { en: "Youtube", fr: "Youtube", extra: "" },
        nk25: { en: "Nikon Film Fest 2025", fr: "Nikon Film Fest 2025", extra: "" },
        nk26: { en: "Nikon Film Fest 2026", fr: "Nikon Film Fest 2026", extra: "" },
        pf26: { en: "Plein Format Fest 2026", fr: "Plein Format Fest 2026", extra: "" },
        ca26: { en: "48h Côte d'Azur 2026", fr: "48h Côte d'Azur 2026", extra: "" }
    },

    // ------------------------------------------------------------------------
    // 4. DATES (Mois) - Utilisation des chiffres pour un tri logique et rapide
    // ------------------------------------------------------------------------
    dates: {
        "01": { en: "January",   fr: "Janvier",   extra: "" },
        "02": { en: "February",  fr: "Février",   extra: "" },
        "03": { en: "March",     fr: "Mars",      extra: "" },
        "04": { en: "April",     fr: "Avril",     extra: "" },
        "05": { en: "May",       fr: "Mai",       extra: "" },
        "06": { en: "June",      fr: "Juin",      extra: "" },
        "07": { en: "July",      fr: "Juillet",   extra: "" },
        "08": { en: "August",    fr: "Août",      extra: "" },
        "09": { en: "September", fr: "Septembre", extra: "" },
        "10": { en: "October",   fr: "Octobre",   extra: "" },
        "11": { en: "November",  fr: "Novembre",  extra: "" },
        "12": { en: "December",  fr: "Décembre",  extra: "" }
    },

    // ------------------------------------------------------------------------
    // 5. MÉTIERS PERSOS ("_me")
    // ------------------------------------------------------------------------
    roles_me: {
        dir:  { en: "Director",                 fr: "Réalisateur",                extra: "" },
        dop:  { en: "Director of Photography",  fr: "Directeur de la Photo",      extra: "" },
        fmk:  { en: "Filmmaker",                fr: "Filmmaker",                  extra: "" },
        gaf:  { en: "Gaffer",                   fr: "Chef Électricien",           extra: "" },
        spk:  { en: "Spark",                    fr: "Électricien",                extra: "" },
        kgr:  { en: "Key Grip",                 fr: "Chef Machiniste",            extra: "" },
        grp:  { en: "Grip",                     fr: "Machiniste",                 extra: "" }
    },

    // ------------------------------------------------------------------------
    // 6. MÉTIERS GÉNÉRAUX (Crew ~50 pers)
    // ------------------------------------------------------------------------
    roles_credits: {
        // Production
        prod:     { en: "Producer",                fr: "Producteur",                 extra: "" },
        xprod:    { en: "Executive Producer",      fr: "Producteur Exécutif",        extra: "" },
        lprod:    { en: "Line Producer",           fr: "Directeur de Production",    extra: "" },
        pman:     { en: "Production Manager",      fr: "Régisseur Général",          extra: "" },
        pcoor:    { en: "Production Coordinator",  fr: "Coordinateur de Production", extra: "" },
        locm:     { en: "Location Manager",        fr: "Régisseur Lieux",            extra: "" },
        
        // Mise en scène (Direction)
        dir:      { en: "Director",                fr: "Réalisateur",                extra: "" },
        ad1:      { en: "1st Assistant Dir.",      fr: "1er Assistant Réal.",        extra: "" },
        ad2:      { en: "2nd Assistant Dir.",      fr: "2nd Assistant Réal.",        extra: "" },
        scrp:     { en: "Script Supervisor",       fr: "Scripte",                    extra: "" },
        cstg:     { en: "Casting Director",        fr: "Directeur de Casting",       extra: "" },
        
        // Image (Camera)
        dop:      { en: "Director of Photography", fr: "Directeur de la Photo",      extra: "" },
        cam:      { en: "Camera Operator",         fr: "Cadreur",                    extra: "" },
        ac1:      { en: "1st AC (Focus Puller)",   fr: "1er Assistant Caméra",       extra: "" },
        ac2:      { en: "2nd AC",                  fr: "2nd Assistant Caméra",       extra: "" },
        std:      { en: "Steadicam Operator",      fr: "Opérateur Steadicam",        extra: "" },
        dit:      { en: "DIT",                     fr: "DIT",                        extra: "" },
        phot:     { en: "Set Photographer",        fr: "Photographe de Plateau",     extra: "" },

        // Lumière (Electric)
        gaf:      { en: "Gaffer",                  fr: "Chef Électricien",           extra: "" },
        bbe:      { en: "Best Boy Electric",       fr: "Second Électricien",         extra: "" },
        spk:      { en: "Spark",                   fr: "Électricien",                extra: "" },
        
        // Machinerie (Grip)
        kgr:      { en: "Key Grip",                fr: "Chef Machiniste",            extra: "" },
        bbg:      { en: "Best Boy Grip",           fr: "Second Machiniste",          extra: "" },
        grp:      { en: "Grip",                    fr: "Machiniste",                 extra: "" },
        
        // Déco (Art Dept)
        pdes:     { en: "Production Designer",     fr: "Chef Décorateur",            extra: "" },
        artd:     { en: "Art Director",            fr: "Directeur Artistique",       extra: "" },
        sdec:     { en: "Set Decorator",           fr: "Ensemblier",                 extra: "" },
        prop:     { en: "Props Master",            fr: "Accessoiriste",              extra: "" },
        
        // HMC (Hair, Makeup, Costumes)
        cost:     { en: "Costume Designer",        fr: "Chef Costumier",             extra: "" },
        ward:     { en: "Wardrobe",                fr: "Habilleur",                  extra: "" },
        muah:     { en: "Key Makeup & Hair",       fr: "Chef Maquilleur / Coiffeur", extra: "" },
        mkup:     { en: "Makeup Artist",           fr: "Maquilleur",                 extra: "" },
        hair:     { en: "Hair Stylist",            fr: "Coiffeur",                   extra: "" },
        
        // Son (Sound)
        snd:      { en: "Sound Mixer",             fr: "Chef Opérateur Son",         extra: "" },
        boom:     { en: "Boom Operator",           fr: "Perchman",                   extra: "" },
        
        // Post-Production
        edt:      { en: "Editor",                  fr: "Chef Monteur",               extra: "" },
        aedt:     { en: "Assistant Editor",        fr: "Assistant Monteur",          extra: "" },
        col:      { en: "Colorist",                fr: "Étalonneur",                 extra: "" },
        sndd:     { en: "Sound Designer",          fr: "Sound Designer",             extra: "" },
        mix:      { en: "Re-recording Mixer",      fr: "Mixeur Son",                 extra: "" },
        vfxs:     { en: "VFX Supervisor",          fr: "Superviseur VFX",            extra: "" },
        comp:     { en: "Compositor",              fr: "Truquiste (Compositing)",    extra: "" },
        
        // Musique
        cmp:      { en: "Composer",                fr: "Compositeur",                extra: "" }
    },

    // ------------------------------------------------------------------------
    // 7. STATUT DU PROJET
    // ------------------------------------------------------------------------
    statuses: {
        edit: { en: "In Editing", fr: "En Montage", extra: "" },
        del:  { en: "Delivered",  fr: "Livré",      extra: "" }
    }
};
