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
        crp:  { en: "Corporate",      fr: "Entreprise",         extra: "" },
        doc:  { en: "Documentary",    fr: "Documentaire",      extra: "" },
        clp:  { en: "Music Video",    fr: "Clip",      		extra: "" },
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
        col:  { en: "Colorist",                 fr: "Étalonneur",                 extra: "" },
        fmk:  { en: "Filmmaker",                fr: "Filmmaker",                  extra: "" },
        gaf:  { en: "Gaffer",                   fr: "Chef Électricien",           extra: "" },
        spk:  { en: "Spark",                    fr: "Électricien",                extra: "" },
        kgr:  { en: "Key Grip",                 fr: "Chef Machiniste",            extra: "" },
        grp:  { en: "Grip",                     fr: "Machiniste",                 extra: "" }
    },

    
        

    // ------------------------------------------------------------------------
    // 7. STATUT DU PROJET
    // ------------------------------------------------------------------------
    statuses: {
        edit: { en: "In Editing", fr: "En Montage", extra: "" },
        del:  { en: "Delivered",  fr: "Livré",      extra: "" }
    }
};
