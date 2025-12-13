import './style.css'
// --- Projects Data (Imported) ---
import { projects } from './project-data.js';
import { inject as injectAnalytics } from '@vercel/analytics';
import { injectSpeedInsights } from '@vercel/speed-insights';

injectAnalytics();
injectSpeedInsights();

// --- Constants ---
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

import { ROLES } from './data/roles.js';


let currentFilteredProjects = projects; // Global filtered list

// --- Translations ---
const translations = {
    fr: {
        nav: { work: "Projets", about: "À Propos", contact: "Contact" },
        hero: { subtitle: "Capturer l'instant, sublimer le récit." },
        filter: { all: "Tout" },
        cat: {
            [CATEGORIES.MUSIC_VIDEO]: "Clip Musical",
            [CATEGORIES.DOCUMENTARY]: "Documentaire",
            [CATEGORIES.COMMERCIAL]: "Publicité",
            [CATEGORIES.SHORT_FILM]: "Court-Métrage",
            [CATEGORIES.SOCIAL]: "Réseaux Sociaux",
            [CATEGORIES.WEDDING]: "Mariage",
            sub: {
                nikon: "Nikon",
                h48: "48h",
                indie: "Indé",
                visualizer: "Visualizer",
                clip: "Clip",
                reel: "Reel Instagram",
                youtube: "Contenu Youtube"
            }
        },
        about: {
            title: "À Propos",
            p1: "Je suis Lucas Jacquot, un filmmaker animé par la lumière, la composition et la quête d'images soignées et porteuses de sens. Ces deux dernières années, j'ai façonné des expériences visuelles à travers des clips, des documentaires et du travail de machinerie sur plateau.",
            p2: "Toujours focalisé sur l'atmosphère et la précision, je cherche à créer des visuels immersifs et émotionnellement marquants. J'apporte soin, intention et un œil cinématographique à chaque projet pour offrir une imagerie qui se démarque et laisse une impression durable."
        },
        contact: { btn: "Me Contacter" },
        modal: {
            related: "Voir aussi",
            view_project: "Voir le projet",
            credits: "Crédits",
            date_label: "Date",
            role_label: "Rôle",
            credits_placeholder: "Crédits à venir..."
        },
        status: {
            editing: "En Montage"
        }
    },
    en: {
        nav: { work: "Work", about: "About", contact: "Contact" },
        hero: { subtitle: "Capturing moments, crafting narratives." },
        filter: { all: "All" },
        cat: {
            [CATEGORIES.MUSIC_VIDEO]: "Music Video",
            [CATEGORIES.DOCUMENTARY]: "Documentary",
            [CATEGORIES.COMMERCIAL]: "Commercial",
            [CATEGORIES.SHORT_FILM]: "Short Film",
            [CATEGORIES.SOCIAL]: "Social Media",
            [CATEGORIES.WEDDING]: "Wedding",
            sub: {
                nikon: "Nikon",
                h48: "48h",
                indie: "Indie",
                visualizer: "Visualizer",
                clip: "Clip",
                reel: "Instagram Reel",
                youtube: "Youtube Content"
            }
        },
        about: {
            title: "About Me",
            p1: "I am Lucas Jacquot, a filmmaker driven by light, composition, and the pursuit of crafted, meaningful images. For the past two years, I’ve been shaping visual experiences across music videos, documentaries, and on-set grip work, always with a focus on atmosphere and precision.",
            p2: "I aim to create visuals that feel immersive and emotionally striking, bringing care, intention, and a cinematic eye to every project I collaborate on. Clients come to me for imagery that stands out and leaves a lasting impression."
        },
        contact: { btn: "Get in touch" },
        modal: {
            related: "See also",
            view_project: "View Project",
            credits: "Credits",
            date_label: "Date",
            role_label: "Role",
            credits_placeholder: "Credits coming soon..."
        },
        status: {
            editing: "In Editing"
        }
    }
};

let currentLang = 'en';

document.addEventListener('DOMContentLoaded', () => {
    // Force scroll to top
    if ('scrollRestoration' in history) {
        history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);

    setupAnimations();
    setupLanguageSwitch();
    setupModal();
    setupCursor();
    setupEmailInteractions();
    setupLogoAnimationReplay();
    setupContactAnimation();
    setupExternalLinks();
    new InfiniteGallery();
});

// --- SAFE ROLE TRANSLATION HELPER ---
function getRoleName(key) {
    if (!key) return "";

    // 1. Try Lookup
    let val = ROLES[key];

    // 2. If valid object, return current lang
    if (val && typeof val === 'object') {
        return val[currentLang] || val.en || key;
    }

    // 3. Fallback: Beautify Key (e.g. "dop_me" -> "Dop Me")
    // This ensures we NEVER show raw keys to user
    return key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
}

// --- Custom Cursor ---
function setupCursor() {
    const cursorDot = document.querySelector('[data-cursor-dot]');
    const cursorOutline = document.querySelector('[data-cursor-outline]');


    let mouseX = 0, mouseY = 0;
    let cursorRaf = null;

    window.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;

        if (!cursorRaf) {
            cursorRaf = requestAnimationFrame(() => {
                cursorDot.style.left = `${mouseX}px`;
                cursorDot.style.top = `${mouseY}px`;

                cursorOutline.animate({
                    left: `${mouseX}px`,
                    top: `${mouseY}px`
                }, { duration: 500, fill: "forwards" });

                cursorRaf = null;
            });
        }
    }, { passive: true });

    // Hover Effects
    const interactables = document.querySelectorAll('a, button, .project-card, .contact-btn');
    interactables.forEach(el => {
        el.addEventListener('mouseenter', () => document.body.classList.add('hovering'));
        el.addEventListener('mouseleave', () => document.body.classList.remove('hovering'));
    });
}

// --- Languages ---
function setupLanguageSwitch() {
    const btn = document.getElementById('lang-switch');
    btn.addEventListener('click', () => {
        currentLang = currentLang === 'fr' ? 'en' : 'fr';
        btn.textContent = currentLang === 'fr' ? 'EN' : 'FR';
        updateContent();
    });
}

function updateContent() {
    document.querySelectorAll('[data-i18n]').forEach(el => {
        const key = el.getAttribute('data-i18n');
        const keys = key.split('.');
        let val = translations[currentLang];

        // Safe traversal
        for (const k of keys) {
            val = val ? val[k] : undefined;
        }

        if (val) {
            el.textContent = val;
            if (el.classList.contains('contact-btn')) {
                setupContactButtonAnimation(el);
            } else if (el.closest('.nav-links')) { // Check if it's a nav link
                setupNavAnimation(el);
            }
        }
    });

    // Custom update for Project Cards (Roles) which are dynamic objects, not static keys
    document.querySelectorAll('.project-card').forEach(card => {
        const id = card.getAttribute('data-id');
        const project = projects.find(p => p.id == id);
        if (project) {
            // Update Role
            const roleEl = card.querySelector('[data-project-role]');
            if (roleEl && project.role) {
                // Updated logic for role key
                const roleText = getRoleName(project.role);
                roleEl.textContent = roleText;
            }
        }
    });

    // Update Modal if open
    const modal = document.getElementById('project-modal');
    if (modal.classList.contains('active')) {
        // We can't easily know WHICH project is open unless we store it. 
    }
}

function setupContactButtonAnimation(btn) {
    const text = btn.textContent;
    btn.innerHTML = '';
    [...text].forEach((char, index) => {
        const span = document.createElement('span');
        span.textContent = char === ' ' ? '\u00A0' : char;
        span.style.setProperty('--i', index);
        span.className = 'btn-char';
        btn.appendChild(span);
    });
}

function setupNavAnimation(link) {
    const text = link.textContent;
    link.innerHTML = '';
    [...text].forEach((char, index) => {
        const span = document.createElement('span');
        span.textContent = char === ' ' ? '\u00A0' : char;
        span.style.setProperty('--i', index);
        span.className = 'nav-char';
        link.appendChild(span);
    });
}

function setupLogoAnimationReplay() {
    const logo = document.querySelector('.logo');
    if (!logo) return;

    logo.addEventListener('click', (e) => {
        // Allow default anchor behavior (scroll to home)
        // e.preventDefault(); 

        const lines = document.querySelectorAll('.stagger-text .line');
        const subtitle = document.querySelector('.hero .fade-up');

        // Reset Title
        lines.forEach(line => {
            line.style.animation = 'none';
            void line.offsetWidth; // Trigger reflow
            line.style.animation = '';
        });

        // Reset Subtitle
        if (subtitle) {
            subtitle.style.animation = 'none';
            void subtitle.offsetWidth;
            subtitle.style.animation = '';
        }
    });
}

function setupExternalLinks() {
    document.querySelectorAll('.external-link').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault(); // Prevent default if it's an anchor tag
            const url = link.getAttribute('data-external-link');
            if (url) {
                window.open(url, '_blank', 'noopener,noreferrer');
            }
        });
    });
}


function setupContactAnimation() {
    // Select triggers: Contact Button in About + Nav Link for Contact
    const triggers = document.querySelectorAll('a[href="#contact"], [data-scroll="#contact"]');

    triggers.forEach(btn => {
        btn.addEventListener('click', (e) => {
            // Check if it's the specific behavior requested
            // Trigger Pulse on footer items
            const footerItems = document.querySelectorAll('.f-mail1, .f-mail2, .f-phone, .f-social');

            footerItems.forEach(item => {
                // Reset animation
                item.classList.remove('highlight-pulse');
                void item.offsetWidth; // Force Reflow
                item.classList.add('highlight-pulse');

                // Remove class after animation (3 * 0.4s = 1.2s)
                setTimeout(() => {
                    item.classList.remove('highlight-pulse');
                }, 1300);
            });
        });
    });
}

// --- Animations ---
function setupAnimations() {
    // Hero Text Reveal is handled by CSS (stagger-text)
    // Removed dead code for #hero-title


    // Initial setup for contact button
    const contactBtn = document.querySelector('.contact-btn');
    if (contactBtn) setupContactButtonAnimation(contactBtn);

    // Call new contact highlight setup
    setupContactAnimation();

    // Initial setup for nav links
    document.querySelectorAll('.nav-links a:not(.lang-btn)').forEach(link => {
        setupNavAnimation(link);

    });

    // Smooth Scroll
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const target = document.querySelector(targetId);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });

    // Fade In Observer
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal, .fade-up').forEach(el => observer.observe(el));

    // Header Scroll Effect
    let lastScrollY = 0;
    let ticking = false;
    const header = document.querySelector('header');

    window.addEventListener('scroll', () => {
        lastScrollY = window.scrollY;
        if (!ticking) {
            window.requestAnimationFrame(() => {
                if (lastScrollY > 50) {
                    header.style.background = '#050505'; // Hardcode same as bg-color for consistency
                    header.style.borderBottom = '1px solid rgba(255,255,255,0.05)';
                    header.style.backdropFilter = 'none'; // Avoid weird blur glitches on some browsers
                } else {
                    header.style.background = 'transparent';
                    header.style.borderBottom = '1px solid transparent';
                    header.style.backdropFilter = 'none';
                }
                ticking = false;
            });
            ticking = true;
        }
    }, { passive: true });
}

// --- Modal System ---
function setupModal() {
    const modal = document.getElementById('project-modal');
    const closeBtn = document.querySelector('.modal-close');
    const backdrop = document.querySelector('.modal-backdrop');

    // New Elements
    const prevBtn = document.querySelector('.modal-nav.prev');
    const nextBtn = document.querySelector('.modal-nav.next');
    const modalRole = document.getElementById('modal-role');
    const mediaContainer = document.querySelector('.modal-media-container');
    const muteBtn = document.querySelector('.modal-mute'); // Add selection

    let currentProjectId = null;

    const openModal = (projectId) => {
        const project = projects.find(p => p.id == projectId);
        if (!project) return;

        currentProjectId = project.id;

        // Reset Scroll Position
        const modalWrapper = document.querySelector('.modal-content-wrapper');
        if (modalWrapper) {
            modalWrapper.scrollTop = 0;
            // Also force it after a frame in case of layout shifts
            requestAnimationFrame(() => {
                modalWrapper.scrollTop = 0;
            });
        }

        // Populate Data
        const titleEl = document.getElementById('modal-title');
        const descEl = document.getElementById('modal-description');
        const modalDetails = document.querySelector('.modal-details');

        // --- Reset Rotation State on Open ---
        globalRotate = false;
        const controls = document.querySelector('.modal-controls');
        const rotateBtn = document.querySelector('.modal-rotate');

        if (controls) {
            if (rotateBtn) {
                rotateBtn.style.background = '';
                rotateBtn.classList.remove('active');
            }

            // Only show for Instagram Reels (ID 10) or collection types
            if (project.id == 10 || project.type === 'collection') {
                controls.style.display = 'flex';
                // Show Mute Button for Reels/Collections if desired
                if (muteBtn) muteBtn.style.display = 'flex';
            } else {
                controls.style.display = 'none';
                // Hide Mute Button for Standard Projects
                if (muteBtn) muteBtn.style.display = 'none';
            }
        }
        // ------------------------------------

        // Reset basic text first
        // titleEl.textContent = project.title; <-- CHANGED to InnerHTML for Badge

        // Resolve Status (Editing Only)
        let statusBadgeHtml = '';
        if (project.status && (project.status.toLowerCase().includes('edit') || project.status.toLowerCase().includes('montage'))) {
            const statusLabel = translations[currentLang].status.editing;
            statusBadgeHtml = `<span class="status-badge" data-i18n="status.editing">${statusLabel}</span>`;
        }

        titleEl.innerHTML = `${project.title}&nbsp;${statusBadgeHtml}`;
        descEl.textContent = project.desc[currentLang];

        // Toggle collection mode class for CSS hooks
        if (project.type === 'collection') {
            document.getElementById('project-modal').classList.add('collection-mode');
        } else {
            document.getElementById('project-modal').classList.remove('collection-mode');
        }

        // Remove existing meta block if we created one previously to avoid dupes
        const existingMeta = modalDetails.querySelector('.modal-meta-block');
        if (existingMeta) existingMeta.remove();

        // Remove any existing credits section in the details block to avoid stacking
        const existingCredits = modalDetails.querySelector('.credits-section');
        if (existingCredits) existingCredits.remove();

        const defaultMeta = modalDetails.querySelector('.modal-meta');
        if (defaultMeta) defaultMeta.style.display = 'none'; // Hide default layout

        if (project.type !== 'collection') {
            // Create rich metadata block
            const metaBlock = document.createElement('div');
            metaBlock.className = 'modal-meta-block';

            const catName = translations[currentLang].cat[project.category] || project.category;

            // Localized date
            const pDate = (typeof project.date === 'object')
                ? (project.date[currentLang] || project.date.en || "")
                : (project.date || "");

            // Resolve Role using ROLES constant
            const pRole = getRoleName(project.role);



            metaBlock.innerHTML = `
         <h6 class="meta-type">${catName}</h6>
         <div class="meta-grid">
           <div class="meta-item">
             <span class="meta-label" data-i18n="modal.date_label">${translations[currentLang].modal.date_label}</span>
             <span class="meta-value">${pDate}</span>
           </div>
           <div class="meta-item">
             <span class="meta-label" data-i18n="modal.role_label">${translations[currentLang].modal.role_label}</span>
             <span class="meta-value">${pRole}</span>
           </div>
         </div>
       `;

            // Add Link Button
            if (project.link) {
                const linkBtn = document.createElement('button');
                linkBtn.className = 'project-link-btn';
                linkBtn.textContent = 'View Project';
                linkBtn.onclick = () => window.open(project.link, '_blank');

                metaBlock.appendChild(linkBtn);
            }

            // Insert after title
            titleEl.after(metaBlock);

            // Credits Section Injection
            const excludedCredits = [6, 9, 10];

            if (!excludedCredits.includes(project.id)) {
                const creditsContainer = document.createElement('div');
                creditsContainer.className = 'credits-section';
                creditsContainer.innerHTML = `
          <button class="credits-toggle">
            Credits <i class="fa-solid fa-chevron-down arrow-icon"></i>
          </button>
          <div class="credits-content">
            ${(() => {
                        if (project.structuredCredits && project.structuredCredits.length > 0) {

                            // Define Groups with Categories
                            const CREDIT_GROUPS = [
                                { category: "PRODUCTION", roles: ['producer', 'exec_producer', 'co_producer', 'line_producer', 'prod_manager', 'prod_coord', 'assist_prod_coord', 'prod_assist', 'unit_manager', 'unit_manager_me', 'unit_assist', 'loc_manager', 'assist_loc_manager', 'loc_assist'] },
                                { category: "DIRECTION", roles: ['director', 'director_me', 'cam_dir_me', 'ad_1', 'ad_2', 'ad_3', 'ad_add', 'script_sup', 'storyboard', 'video_assist'] },
                                { category: "CAMERA", roles: ['dop', 'dop_me', 'dop_cam_me', 'cam_op_a', 'cam_op_b', 'cam_op', 'camera_op_me', 'steadicam', 'trinity', 'ac_1_a', 'ac_1_b', 'ac_1', 'ac_2', 'camera_assistant_me', 'dit', 'video_op', 'photographer'] },
                                { category: "LIGHTING & GRIP", roles: ['gaffer', 'gaffer_me', 'best_boy_elec', 'sparks', 'spark', 'spark_me', 'spark_reinforcement_me', 'rig_gaffer', 'key_grip', 'key_grip_me', 'best_boy_grip', 'grips', 'grip', 'grip_me', 'grip_spark_me', 'rig_grip'] },
                                { category: "ART DEPARTMENT", roles: ['prod_design', 'art_dir', 'assist_art_dir', 'construction_coord', 'construction_crew', 'props_master', 'props_assist', 'set_dresser', 'set_decorator', 'painters', 'carpenters', 'model_maker'] },
                                { category: "COSTUMES", roles: ['costume_designer', 'assist_costume', 'tailor', 'costume_sup', 'costume_assist', 'ager_dyer', 'set_costumer'] },
                                { category: "MAKEUP & HAIR", roles: ['makeup_head', 'hair_head', 'makeup_artist', 'hair_stylist', 'sfx_makeup', 'prosthetic', 'barber', 'hmc'] },
                                { category: "SOUND", roles: ['sound', 'sound_mixer', 'boom_op', 'sound_utility', 'playback'] }, // Added generic 'sound'
                                { category: "TRANSPORTATION", roles: ['transport_capt', 'drivers'] },
                                { category: "SFX", roles: ['sfx_sup', 'sfx_tech', 'pyro'] },
                                { category: "VFX (ON SET)", roles: ['vfx_sup', 'vfx_data', 'lidar', 'tech_tracking'] },
                                { category: "SPECIALTY RIGS & DRONE", roles: ['drone_pilot', 'drone_op', 'drone_tech', 'stunt_rigger', 'cam_car'] },
                                { category: "STUNTS", roles: ['stunt_coord', 'stunt_perf', 'doubles', 'stunt_driver', 'safety'] },
                                { category: "CREATURE & ANIMATRONICS", roles: ['creature_design', 'animatronic', 'puppeteer'] },
                                { category: "CASTING", roles: ['casting_dir', 'casting_assist', 'acting_coach', 'dial_coach', 'extras_coord'] },
                                { category: "CATERING", roles: ['caterer', 'catering_crew', 'craft_service'] },
                                { category: "POST-PRODUCTION", roles: ['editor', 'editor_me', 'assist_editor', 'post_coord', 'content_creation_me'] },
                                { category: "COLOR", roles: ['colorist', 'assist_colorist'] },
                                { category: "MUSIC", roles: ['composer', 'orchestrator', 'conductor', 'musicians', 'music_mixer'] },
                                { category: "POST SOUND", roles: ['sound_design', 'sound_editor', 'dial_editor', 'adr_editor', 'foley', 'foley_mixer', 're_record_mixer'] },
                                { category: "VFX (POST)", roles: ['vfx_prod', 'lead_comp', 'compositors', '3d_artist', 'matte_paint', 'roto', 'matchmove', 'pipeline_td'] },
                                { category: "TITLES", roles: ['motion_des', 'title_des', 'screenwriter_me'] }, // Added screenwriter here as it fits best with titles/writing
                                { category: "LOCALIZATION", roles: ['translator', 'dial_adapt', 'voice_actor', 'subtitler'] },
                                { category: "SAFETY", roles: ['safety_coord', 'medic', 'security'] },
                                { category: "LAB & DISTRIBUTION", roles: ['lab', 'archivist', 'distributor', 'publicist', 'epk'] }
                            ];

                            let html = '<div class="credits-container">';
                            let renderedRoles = new Set();

                            // Helper to render a list of items
                            let globalDelay = 0; // Reset for each open? No, reset for render.

                            const renderItems = (items) => {
                                let chunk = '<div class="credits-grid">'; // Grid inside category
                                items.forEach(item => {
                                    if (renderedRoles.has(item.roleKey)) return;
                                    renderedRoles.add(item.roleKey);

                                    const roleName = getRoleName(item.roleKey);

                                    const namesHtml = item.names.map(name => {
                                        return `<span class="credit-name">${name}</span>`;
                                    }).join(', ');

                                    // Stagger Logic
                                    const delay = globalDelay * 0.03; // 30ms per item
                                    globalDelay++;

                                    chunk += `
                                <div class="credits-row" style="transition-delay: ${delay}s">
                                    <span class="credit-role">${roleName}</span>
                                    <span class="credit-value">${namesHtml}</span>
                                </div>
                            `;
                                });
                                chunk += '</div>';
                                return chunk;
                            };

                            let innerContent = '';
                            globalDelay = 0; // START COUNTER
                            // 1. Render Groups
                            CREDIT_GROUPS.forEach(group => {
                                // Find items in this group that haven't been rendered yet
                                const groupItems = project.structuredCredits.filter(item => {
                                    const match = group.roles.includes(item.roleKey) || (item.originalRole && group.roles.includes(item.originalRole));
                                    return match;
                                });

                                if (groupItems.length > 0) {
                                    const groupHtml = renderItems(groupItems);
                                    if (groupHtml.includes('class="credits-row"')) { // Only add if items actually rendered
                                        innerContent += `
                                    <div class="credits-category">
                                        <h4 class="credits-category-title">${group.category}</h4>
                                        ${groupHtml}
                                    </div>
                                `;
                                    }
                                }
                            });

                            // 2. Render Leftovers
                            const leftovers = project.structuredCredits.filter(item => !renderedRoles.has(item.roleKey));
                            if (leftovers.length > 0) {
                                innerContent += `
                            <div class="credits-category">
                                <h4 class="credits-category-title">ADDITIONAL CREW</h4>
                                ${renderItems(leftovers)}
                            </div>
                        `;
                            }

                            // SAFETY NET: If nothing rendered but we have credits, force render everything
                            if (!innerContent && project.structuredCredits.length > 0) {
                                console.warn("Credit grouping failed, rendering raw list.");
                                innerContent = `
                            <div class="credits-category">
                                <h4 class="credits-category-title">ALL CREDITS (FALLBACK)</h4>
                                ${renderItems(project.structuredCredits)}
                            </div>`;
                            }

                            html += `<div class="credits-inner">${innerContent}</div></div>`;
                            return html;
                        } else {
                            return `<p class="credits-text" style="white-space: pre-line;">${project.credits || translations[currentLang].modal.credits_placeholder}</p>`;
                        }
                    })()}
          </div>
        `;

                // Insert credits AFTER THE DESCRIPTION (descEl) as requested
                descEl.after(creditsContainer);

                // Toggle Logic
                const toggle = creditsContainer.querySelector('.credits-toggle');
                const content = creditsContainer.querySelector('.credits-content');
                const arrow = creditsContainer.querySelector('.arrow-icon');

                toggle.addEventListener('click', () => {
                    const isActive = content.classList.contains('active');
                    if (isActive) {
                        content.classList.remove('active');
                        arrow.style.transform = 'rotate(0deg)';
                    } else {
                        content.classList.add('active');
                        arrow.style.transform = 'rotate(180deg)';
                    }
                });
            }

        } else {
            // Collection (Social): Keep simple or default
            if (defaultMeta) {
                defaultMeta.style.display = 'flex'; // Show default "Category • Date"
                const catName = translations[currentLang].cat[project.category] || project.category;
                document.getElementById('modal-category').textContent = catName;

                // Localized date for collection if applicable
                const pDate = (typeof project.date === 'object')
                    ? (project.date[currentLang] || project.date.en || "")
                    : (project.date || "");

                document.getElementById('modal-date').textContent = pDate;
            }
        }

        // Handle role badge
        const roleBadgeData = ROLES[project.role] || project.role;
        const pRoleBadge = (typeof roleBadgeData === 'object')
            ? (roleBadgeData[currentLang] || roleBadgeData.en || "")
            : (roleBadgeData || "Filmmaker");

        if (modalRole) modalRole.textContent = pRoleBadge;

        // Media Content Logic
        mediaContainer.innerHTML = ''; // Clear previous

        if (project.type === 'collection') {
            modal.classList.add('collection-mode');
            if (window.currentCarousel) {
                window.currentCarousel.destroy();
            }
            window.currentCarousel = new ReelCarousel(mediaContainer, project.collection);
        } else {
            modal.classList.remove('collection-mode');
            if (window.currentCarousel) {
                window.currentCarousel.destroy();
                window.currentCarousel = null;
            }

            // Standard Image/Video Handling (Unified as Carousel)

            // 1. Determine Source: Collection (Obj Array) vs Media (String)
            let rawMedia = [];
            if (project.collection && project.collection.length > 0) {
                rawMedia = project.collection;
            } else if (project.media) {
                rawMedia = [project.media]; // Fallback to single media
            }

            // 2. Normalize to standard format { src, type }
            const mediaList = rawMedia.map(item => {
                if (typeof item === 'object') {
                    // Already an object (from collection)
                    return item;
                } else {
                    // String (from media property)
                    const isVid = item.match(/\.(mp4|webm)$/i);
                    return {
                        src: item,
                        type: isVid ? 'video' : 'image'
                    };
                }
            });

            // --- CAROUSEL MODE FOR ALL STANDARD PROJECTS ---
            const carousel = document.createElement('div');
            carousel.className = 'project-carousel';

            const track = document.createElement('div');
            track.className = 'project-carousel-track';

            mediaList.forEach((item) => {
                const slide = document.createElement('div');
                slide.className = 'project-carousel-slide';

                if (item.type === 'video' || (item.src && item.src.match(/\.(mp4|webm)$/i))) {
                    const video = document.createElement('video');
                    video.src = item.src;
                    video.controls = false; // Hide controls globally
                    video.autoplay = false;
                    video.loop = true;
                    video.muted = true; // Required for autoplay
                    video.playsInline = true;
                    slide.appendChild(video);
                } else {
                    const img = document.createElement('img');
                    img.src = item.src;
                    slide.appendChild(img);
                }
                track.appendChild(slide);
            });

            carousel.appendChild(track);

            // Navigation Buttons (Only if > 1 item)
            if (mediaList.length > 1) {
                const prevBtn = document.createElement('button');
                prevBtn.className = 'project-carousel-nav prev';
                prevBtn.innerHTML = '<i class="fa-solid fa-chevron-left"></i>';

                const nextBtn = document.createElement('button');
                nextBtn.className = 'project-carousel-nav next';
                nextBtn.innerHTML = '<i class="fa-solid fa-chevron-right"></i>';

                carousel.appendChild(prevBtn);
                carousel.appendChild(nextBtn);

                // Logic
                let currentIndex = 0;
                const updateSlide = () => {
                    track.style.transform = `translateX(-${currentIndex * 100}%)`;

                    // Smart Video Playback
                    const slides = track.children;
                    Array.from(slides).forEach((slide, index) => {
                        const video = slide.querySelector('video');
                        if (video) {
                            if (index === currentIndex) {
                                video.play().catch(e => console.log('Autoplay prevent:', e));
                            } else {
                                video.pause();
                                video.currentTime = 0;
                            }
                        }
                    });
                };

                prevBtn.onclick = (e) => {
                    e.stopPropagation();
                    currentIndex = (currentIndex > 0) ? currentIndex - 1 : mediaList.length - 1;
                    updateSlide();
                };

                nextBtn.onclick = (e) => {
                    e.stopPropagation();
                    currentIndex = (currentIndex < mediaList.length - 1) ? currentIndex + 1 : 0;
                    updateSlide();
                };

                // Initial trigger
                setTimeout(updateSlide, 100);
            } else {
                // Single Item Case: Ensure video plays if it's a video
                const video = track.querySelector('video');
                if (video) {
                    // Play immediately if single video
                    video.play().catch(e => console.log('Autoplay prevent:', e));
                }
            }

            mediaContainer.appendChild(carousel);

        }
        // Related Projects
        const relatedContainer = document.getElementById('related-projects');
        relatedContainer.innerHTML = '';

        // Randomize related projects
        const related = projects.filter(p => p.id != projectId)
            .sort(() => 0.5 - Math.random())
            .slice(0, 3);

        related.forEach(rel => {
            const relEl = document.createElement('div');
            relEl.className = 'related-item project-card';
            relEl.setAttribute('data-id', rel.id);

            const relDate = (typeof rel.date === 'object')
                ? (rel.date[currentLang] || rel.date.en || "")
                : (rel.date || "");

            const catName = translations[currentLang].cat[rel.category] || rel.category;

            const thumbSrc = Array.isArray(rel.media) ? rel.media[0] : rel.media;

            relEl.innerHTML = `
        <div class="related-card-inner">
           <img src="${thumbSrc}" alt="${rel.title}">
        </div>
        <div class="related-overlay">
           <div class="related-cat-overlay">${catName}</div>
           <div class="related-title-overlay">${rel.title}</div>
        </div>
      `;
            relatedContainer.appendChild(relEl);
        });

        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    };

    const closeModal = () => {
        modal.classList.remove('active');
        document.body.style.overflow = '';

        // Cleanup Carousel
        if (window.currentCarousel) {
            window.currentCarousel.destroy();
            window.currentCarousel = null;
        }
    };

    const navigateModal = (direction) => {
        if (currentProjectId === null) return;

        // Use filtered list for navigation context
        let list = currentFilteredProjects;
        let currentIndex = list.findIndex(p => p.id == currentProjectId);

        // Fallback if not found in filtered list
        if (currentIndex === -1) {
            list = projects;
            currentIndex = list.findIndex(p => p.id == currentProjectId);
        }

        if (currentIndex === -1) return;

        let newIndex = currentIndex + direction;
        if (newIndex < 0) newIndex = list.length - 1;
        if (newIndex >= list.length) newIndex = 0;

        // Transition
        const modalContent = document.querySelector('.modal-content');
        const outClass = direction === 1 ? 'animating-out-left' : 'animating-out-right';
        const inClass = direction === 1 ? 'animating-in-left' : 'animating-in-right';

        modalContent.classList.add(outClass);

        setTimeout(() => {
            openModal(list[newIndex].id);
            // Ensure scroll is reset during navigation
            const modalWrapper = document.querySelector('.modal-content-wrapper');
            if (modalWrapper) modalWrapper.scrollTop = 0;

            modalContent.classList.remove(outClass);
            modalContent.classList.add(inClass);

            // Trigger reflow to ensure animation plays
            void modalContent.offsetWidth;

            modalContent.classList.remove(inClass);

        }, 400); // Wait for out-animation
    };

    // Event Listeners
    document.addEventListener('click', (e) => {
        // Check global drag flag from InfiniteGallery to prevent click after drag
        if (window.isGalleryDragging) return;

        const card = e.target.closest('.project-card');

        // 1. CLICK OUTSIDE LOGIC
        if (!card) {
            document.querySelectorAll('.project-card.touched').forEach(c => c.classList.remove('touched'));
            return;
        }

        // Ensure we don't trigger if clicking nav buttons
        if (card && !e.target.closest('.modal-nav')) {

            // ROBUST MOBILE DETECT: If touch event happened recently (<600ms), it is a TAP.
            // This overrides CSS hover states which can be sticky on mobile.
            const lastTouch = window.lastTouchTime || 0;
            const isTouch = (Date.now() - lastTouch < 600) || window.matchMedia('(hover: none) and (pointer: coarse)').matches;

            if (isTouch) {
                if (!card.classList.contains('touched')) {
                    // EXCLUSIVE TOUCH: Clear all others first
                    document.querySelectorAll('.project-card.touched').forEach(c => {
                        if (c !== card) c.classList.remove('touched');
                    });

                    // First Tap: Reveal Info
                    card.classList.add('touched');

                    // Auto-hide fallback (optional, longer duration)
                    if (card.touchTimer) clearTimeout(card.touchTimer);
                    card.touchTimer = setTimeout(() => {
                        card.classList.remove('touched');
                    }, 4000);

                    return; // STOP here, do not open modal
                }
                // If already touched (Second Tap), proceed to open modal below
            }


            // Center Work Section
            const workSection = document.getElementById('work');
            if (workSection) workSection.scrollIntoView({ behavior: 'smooth' });

            openModal(card.getAttribute('data-id'));
        }
        /* REMOVED: Clicking outside should NOT clear active states (User Request) */
    });

    closeBtn.addEventListener('click', closeModal);
    backdrop.addEventListener('click', closeModal);

    if (prevBtn) {
        prevBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            navigateModal(-1);
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            navigateModal(1);
        });
    }

    // Escape Key & Arrows
    document.addEventListener('keydown', (e) => {
        if (!modal.classList.contains('active')) return;
        if (e.key === 'Escape') closeModal();
        // Arrows might conflict with carousel horizontal scroll if we implement key nav there, 
        // but for now let's keep project nav
        if (e.key === 'ArrowLeft') navigateModal(-1);
        if (e.key === 'ArrowRight') navigateModal(1);
    });
}

// --- 3D Curve Carousel ---
// --- 9:16 Reel Carousel (Simple Horizontal Scroll) ---
// --- Global Audio State ---
let globalMute = false; // Default unmuted
let isMuteSetup = false; // Flag to prevent duplicate listeners

// --- Mute Button Logic ---
function setupMuteButton() {
    const muteBtn = document.querySelector('.modal-mute');
    if (!muteBtn) return;
    if (isMuteSetup) return; // Prevent multiple listeners

    const icon = muteBtn.querySelector('i');

    muteBtn.addEventListener('click', () => {
        globalMute = !globalMute;
        // Update Icon
        if (globalMute) {
            icon.classList.remove('fa-volume-high');
            icon.classList.add('fa-volume-xmark');
            muteBtn.classList.remove('sound-active');
        } else {
            icon.classList.remove('fa-volume-xmark');
            icon.classList.add('fa-volume-high');

            // Trigger Pulse Animation (Two pulses)
            muteBtn.classList.add('sound-active');
            setTimeout(() => {
                muteBtn.classList.remove('sound-active');
            }, 1200); // 0.6s * 2
        }

        // Apply to all reel videos
        document.querySelectorAll('.reel-item video').forEach(v => {
            v.muted = globalMute;
        });
    });

    isMuteSetup = true;
}

// --- Rotate Button Logic ---
let globalRotate = false;
let isRotateSetup = false;

function setupRotateButton() {
    const rotateBtn = document.querySelector('.modal-rotate');
    if (!rotateBtn) return;
    if (isRotateSetup) return;

    rotateBtn.addEventListener('click', () => {
        globalRotate = !globalRotate;

        // Toggle active state on button or similar if desired
        if (globalRotate) {
            rotateBtn.style.background = 'rgba(255, 255, 255, 0.3)';
            rotateBtn.classList.add('active'); // Rotates icon to vertical
        } else {
            rotateBtn.style.background = '';
            rotateBtn.classList.remove('active'); // Rotates icon to horizontal
        }

        // Apply rotation only to active item (via carousel instance)
        if (window.currentCarousel) {
            window.currentCarousel.updateRotation();
        }
    });

    isRotateSetup = true;
}

function setupFullscreenButton() {
    const btn = document.querySelector('.modal-fullscreen');
    if (!btn) return;

    btn.addEventListener('click', () => {
        if (!window.currentCarousel || window.currentCarousel.selectedIndex === -1) return;

        const activeItem = window.currentCarousel.items[window.currentCarousel.selectedIndex];
        if (activeItem) {
            const inner = activeItem.querySelector('.reel-inner');
            if (inner) {
                if (inner.requestFullscreen) {
                    inner.requestFullscreen();
                } else if (inner.webkitRequestFullscreen) { /* Safari */
                    inner.webkitRequestFullscreen();
                } else if (inner.msRequestFullscreen) { /* IE11 */
                    inner.msRequestFullscreen();
                }
            }
        }
    });
}

class ReelCarousel {
    constructor(container, items) {
        this.container = container;
        this.itemsData = items;
        this.items = [];

        // Duplicate for infinite scroll 
        // Increased duplication to Ensure NO gaps/black spots (12x)
        // If user has 3 items -> 36 items. Enough for wide screens.
        this.displayData = [
            ...items, ...items, ...items, ...items,
            ...items, ...items, ...items, ...items,
            ...items, ...items, ...items, ...items
        ];

        this.rafId = null;
        this.scrollX = 0;
        this.targetScrollX = 0;
        this.speed = 0;
        this.isDragging = false;
        this.startX = 0;
        this.startScroll = 0;
        this.pause = false;
        this.selectedIndex = -1;
        this.easing = 0.05;

        // Intro State
        this.isIntro = true;
        this.introVelocity = 0;
        this.introFriction = 0;

        this.init();
    }

    init() {
        setupMuteButton();
        setupRotateButton();
        setupFullscreenButton();

        this.container.innerHTML = ''; // Clear container

        // Create Viewport & Track
        const viewport = document.createElement('div');
        viewport.className = 'reel-carousel-viewport';
        this.container.appendChild(viewport);

        const track = document.createElement('div');
        track.className = 'reel-carousel-track';
        viewport.appendChild(track);

        this.track = track;

        // Create Items
        this.displayData.forEach((data, i) => {
            const item = document.createElement('div');
            item.className = 'reel-item';

            const inner = document.createElement('div');
            inner.className = 'reel-inner';
            item.appendChild(inner);

            const video = document.createElement('video');
            video.loop = true;
            video.muted = globalMute;
            video.playsInline = true;

            if (data.poster && data.poster !== '') {
                // OPTIMIZED PATH: Custom Poster
                video.src = data.src;
                video.preload = 'none';
                video.poster = data.poster;
            } else {
                // FALLBACK PATH: No Poster -> Use Black Placeholder (Zero Lag)
                video.src = data.src; // Clean src
                video.preload = 'none'; // ZERO Network usage until click
                // Tiny 1x1 Black Pixel (Base64)
                video.poster = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mBk+A8AABOBAAQ12tuAAAAAElFTkSuQmCC";
                video.style.backgroundColor = "black"; // Double safety
            }

            inner.appendChild(video);

            // Click Layer (Transparent Overlay to guarantee capture)
            const clickLayer = document.createElement('div');
            clickLayer.className = 'click-layer';
            clickLayer.style.cursor = 'none'; // Force hide cursor inline

            // Click Interaction (Fixed for Infinite Scroll & Anti-Spin)
            clickLayer.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation(); // Prevent bubbling to container which might handle drags
                if (this.isDragging) return; // Ignore drag clicks

                const itemSpacing = 210;
                const totalWidth = this.displayData.length * itemSpacing;

                // 1. Calculate Shortest Path to this clone ('i')
                // The item 'i' has a fixed absolute position in the strip: i * 210
                // But 'scrollX' might be very far (due to infinite looping).
                // We want to move scrollX by the small visual distance to bring 'i' to center.

                const itemPos = i * itemSpacing;
                const diff = itemPos - this.scrollX;

                // Wrap the difference to find shortest path (Modulo)
                let wrappedDiff = ((diff % totalWidth) + totalWidth) % totalWidth;
                if (wrappedDiff > totalWidth / 2) wrappedDiff -= totalWidth;

                // wrappedDiff is the distance from Center to Item 'i'.
                // If wrappedDiff is ~0, the item is physically centered.

                const isCentered = Math.abs(wrappedDiff) < 10;

                if (isCentered) {
                    // IT IS CENTERED -> TOGGLE PLAY
                    // Also Sync Selection just in case
                    this.selectedIndex = i;

                    // Toggle Play/Pause
                    if (video.paused) {
                        if (video.readyState < 3) {
                            video.preload = 'auto';
                            video.load();
                        }

                        video.play().then(() => {
                            item.classList.add('active');
                        }).catch(e => console.log("Play failed:", e));

                        // Stop ALL other videos (clones or different)
                        this.items.forEach((it, idx) => {
                            if (idx !== i) {
                                const ov = it.querySelector('video');
                                if (ov) {
                                    ov.pause();
                                    if (ov.readyState > 0) ov.currentTime = 0;
                                }
                                // Clean active class
                                it.classList.remove('active');
                            }
                        });
                        this.updateRotation(); // Ensure rotation persists
                    } else {
                        video.pause();
                        item.classList.remove('active');
                        this.updateRotation(); // Ensure rotation persists
                    }
                } else {
                    // NOT CENTERED -> SCROLL TO IT (Smoothly, Shortest Path)

                    // Reset Rotation if active (User switched item)
                    if (globalRotate) {
                        globalRotate = false;
                        const rotateBtn = document.querySelector('.modal-rotate');
                        if (rotateBtn) {
                            rotateBtn.style.background = '';
                            rotateBtn.classList.remove('active');
                        }
                        const allRotated = this.container.querySelectorAll('.is-rotated');
                        allRotated.forEach(el => el.classList.remove('is-rotated'));
                    }

                    this.selectedIndex = i;
                    this.targetScrollX = this.scrollX + wrappedDiff;

                    // Optional: Force Pause others as we move away?
                    // Good UX: Leave playing until new one selected?
                    // Let's pause to keep performance high during scroll.
                    this.items.forEach((it) => {
                        const ov = it.querySelector('video');
                        if (ov && !ov.paused) {
                            ov.pause();
                            it.classList.remove('active');
                        }
                    });
                }
            });

            inner.appendChild(clickLayer);
            track.appendChild(item);
            this.items.push(item);
        });

        // Events
        this.container.addEventListener('mousedown', this.onDown.bind(this));
        window.addEventListener('mousemove', this.onMove.bind(this));
        window.addEventListener('mouseup', this.onUp.bind(this));

        this.container.addEventListener('touchstart', this.onDown.bind(this));
        window.addEventListener('touchmove', this.onMove.bind(this));
        window.addEventListener('touchend', this.onUp.bind(this));

        // Center Initial
        // Center Initial with Random Spin Animation
        const midIndex = Math.floor(this.displayData.length / 2);
        // Randomize target (+/- 6 items) to show different content
        const randomOffset = Math.floor(Math.random() * 12) - 6;
        const finalIndex = midIndex + randomOffset;

        const itemSpacing = 210;

        this.centerItem(finalIndex);

        // Linear Deceleration Setup
        // Distance = 4500px (Increased for longer tail)
        // Velocity = 50
        // Friction = ~0.30 to last ~2.5s

        const dist = 4500;
        this.scrollX = this.targetScrollX - dist;
        this.introVelocity = 50;
        this.introFriction = 0.30;
        this.isIntro = true; // Activate intro mode

        // Start Loop
        this.loop();
    }

    onDown(e) {
        this.isIntro = false; // Cancel intro immediately on interaction
        this.easing = 0.1;
        this.isDragging = true;
        this.startX = e.pageX || e.touches[0].pageX;
        this.startScroll = this.targetScrollX;
    }

    onMove(e) {
        if (!this.isDragging) return;
        const x = e.pageX || e.touches[0].pageX;
        const diff = (x - this.startX) * 1.5;
        this.targetScrollX = this.startScroll - diff;

        // Pause all if actually dragging (threshold)
        if (Math.abs(diff) > 5) {
            this.items.forEach(it => {
                const v = it.querySelector('video');
                if (v && !v.paused) v.pause();
                it.classList.remove('active');
            });
        }
    }

    onUp() {
        if (!this.isDragging) return;
        this.isDragging = false;

        // Snap
        const itemSpacing = 210;
        const index = Math.round(this.targetScrollX / itemSpacing);
        this.centerItem(index);
    }

    centerItem(index) {
        const itemSpacing = 210;
        const totalWidth = this.items.length * itemSpacing;

        let itemPos = index * itemSpacing;
        let currentDist = itemPos - this.targetScrollX;

        let wrappedDist = ((currentDist % totalWidth) + totalWidth) % totalWidth;
        if (wrappedDist > totalWidth / 2) wrappedDist -= totalWidth;

        // Check if changing index (reset rotation)
        if (index !== this.selectedIndex) {
            if (globalRotate) {
                globalRotate = false; // Reset Reset

                // Force Clean UI
                const rotateBtn = document.querySelector('.modal-rotate');
                if (rotateBtn) {
                    rotateBtn.style.background = '';
                    rotateBtn.classList.remove('active');
                }

                // Force Clean DOM of any stuck rotation
                const allRotated = this.container.querySelectorAll('.is-rotated');
                allRotated.forEach(el => el.classList.remove('is-rotated'));
            }
        }

        this.targetScrollX += wrappedDist;
        this.selectedIndex = index;

        // Apply Rotation to Active Only
        this.updateRotation();
    }

    updateRotation() {
        this.items.forEach((item, i) => {
            if (i === this.selectedIndex && globalRotate) {
                item.classList.add('is-rotated');
            } else {
                item.classList.remove('is-rotated');
            }
        });
    }

    loop() {
        this.rafId = requestAnimationFrame(this.loop.bind(this));

        if (this.isIntro) {
            // Pure Linear Deceleration
            this.scrollX += this.introVelocity;
            this.introVelocity -= this.introFriction;

            // Handover Condition: "Walking Speed"
            // When slow enough, switch to physics for soft landing
            if (this.introVelocity <= 2) {
                this.isIntro = false;
                // Do NOT snap. Let standard physics take over for the last few pixels.
            }
        } else {
            // Standard Elastic Physics
            this.scrollX += (this.targetScrollX - this.scrollX) * this.easing;
        }

        // 3D Infinite Logic
        const itemSpacing = 210;
        const totalWidth = this.items.length * itemSpacing;

        this.items.forEach((item, i) => {
            let itemPos = i * itemSpacing;
            let currentPos = itemPos - this.scrollX;
            let wrappedPos = ((currentPos % totalWidth) + totalWidth) % totalWidth;
            if (wrappedPos > totalWidth / 2) wrappedPos -= totalWidth;

            const x = wrappedPos;
            const absX = Math.abs(x);

            // Z-depth: Linear with Center Boost
            const z = -Math.abs(x) * 0.5 + 110 * Math.exp(-Math.abs(x) / 100);

            // Rotation
            let rotateY = x * 0.05;
            rotateY = Math.max(-60, Math.min(60, rotateY));

            // Scaling
            const scale = 1.15 - (Math.min(1, absX / 1500) * 0.35);

            // Opacity
            const opacity = 1;

            // Brightness
            const brightness = 1 - (Math.min(1, absX / 1200) * 0.5);

            // Z-Index
            const zIndex = Math.round(10000 - absX);

            // Neighbor Shift
            let xOffset = 60 * Math.exp(-Math.pow((absX - 210) / 150, 2));
            xOffset *= Math.min(1, absX / 60);

            const finalX = x + (x >= 0 ? xOffset : -xOffset);

            item.style.transform = `translateX(${finalX}px) translateZ(${z}px) rotateY(${rotateY}deg) scale(${scale})`;
            item.style.zIndex = zIndex;
            item.style.opacity = opacity;
            item.style.filter = `brightness(${brightness})`;
            item.style.display = 'block'; // Always visible
            item.style.pointerEvents = 'auto';
        });
    }

    destroy() {
        cancelAnimationFrame(this.rafId);
        this.items.forEach(item => {
            const v = item.querySelector('video');
            if (v) {
                v.pause();
                v.removeAttribute('src'); // Force stop
                v.load();
            }
        });
        this.container.innerHTML = '';
    }
}

// --- Custom Link Interactions (Hidden Status Bar) ---

// --- Custom Link Interactions (Hidden Status Bar) ---
function setupEmailInteractions() {
    // Emails
    document.querySelectorAll('.email-interaction').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();

            const href = link.getAttribute('data-href');
            if (href) {
                // Create invisible link to force native browser behavior
                const mailLink = document.createElement('a');
                mailLink.href = href;
                mailLink.style.display = 'none';
                document.body.appendChild(mailLink);
                mailLink.click();
                setTimeout(() => document.body.removeChild(mailLink), 100);
            }
        });
    });

    // Scroll Buttons (like Contact Btn)
    document.querySelectorAll('[data-scroll]').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const targetId = btn.getAttribute('data-scroll');
            const target = document.querySelector(targetId);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
}

// --- Preloader ---
function preloadInstagramReels() {
    // Attempt to find the Instagram Reels project data
    const reelsProject = projects.find(p => p.id === 'reels' || p.title === 'Instagram Reels');
    if (reelsProject && reelsProject.gallery) { // Assuming 'gallery' or 'collection'
        // Safe approach since we use 'collection' key mostly now
    }
}

// Trigger load
window.addEventListener('load', () => {
    // Defer slightly to let critical assets load first
    setTimeout(preloadInstagramReels, 1000);
});

// --- Infinite Gallery & Filters (Phase 3) ---
class InfiniteGallery {
    constructor() {
        this.track = document.getElementById('gallery-track');
        this.wrapper = document.querySelector('.gallery-wrapper');
        this.items = [];
        this.animationId = null;
        this.currentTranslate = 0;
        this.currentVelocity = 0; // For manual boost

        // Smooth Speed Logic
        this.baseSpeed = 0.5;
        this.speed = this.baseSpeed;
        this.targetSpeed = this.baseSpeed;

        // Randomize Projects on Load
        const shuffled = [...projects];
        for (let i = shuffled.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
        }
        this.originalData = shuffled;

        this.filterButtons = document.querySelectorAll('.filter-btn');
        this.navButtons = document.querySelectorAll('.gallery-nav');

        // State for correct looping width
        this.currentCount = 0;

        // Drag State
        this.isDragging = false;
        this.startX = 0;
        this.startTranslate = 0;
        this.lastX = 0;
        this.velocity = 0;

        this.init();
    }

    init() {
        this.setupFilters();
        this.setupNav();
        this.render(this.originalData);
        this.setupHover();
        this.setupDrag();
        this.observeFilters();
    }

    setupFilters() {
        // Filter Logic
        this.filterButtons.forEach(btn => {
            btn.addEventListener('click', () => {

                // Handle Active State
                this.filterButtons.forEach(b => b.classList.remove('active'));

                // If this is a main category trigger, active is handled by the toggle logic visually?
                // No, we still want it white.
                btn.classList.add('active');

                // Also highlight parent if sub-item clicked?
                // For now, simple logic:
                if (btn.classList.contains('dropup-item')) {
                    const parentTrigger = btn.closest('.filter-dropup')?.querySelector('.filter-btn');
                    if (parentTrigger) {
                        // parentTrigger.classList.add('active'); // Optional: keep parent white
                    }
                }

                // Scroll to Work section
                const workSection = document.getElementById('work');
                // ... rest (keep standard filtering)
                if (workSection) {
                    // Only scroll if we are not already there?
                    workSection.scrollIntoView({ behavior: 'smooth' });
                }

                const filter = btn.getAttribute('data-filter');

                const filtered = (filter === 'all')
                    ? this.originalData
                    : this.originalData.filter(p => p.category === filter);

                currentFilteredProjects = filtered; // Update global

                // Reset Carousel Position
                this.currentTranslate = 0;
                this.targetTranslate = 0;
                this.speed = this.baseSpeed;

                this.render(filtered);
            });
        });
    }

    setupNav() {
        // Optional Nav Buttons (Arrows) logic
        // For now, we rely on drag and scroll
    }

    observeFilters() {
        const filters = document.getElementById('project-filters');
        if (!filters) return;

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    filters.classList.add('visible');
                } else {
                    filters.classList.remove('visible');
                }
            });
        }, { threshold: 0.2 });

        if (this.wrapper) {
            observer.observe(this.wrapper);
        }
    }

    setupHover() {
        // Handled by CSS largely or setupCursor hover
    }

    render(data) {
        if (this.animationId) cancelAnimationFrame(this.animationId);
        this.track.innerHTML = '';

        // Update current valid count for animate logic
        this.currentCount = data.length;

        // 1. Initial Render (Original Data)
        data.forEach(project => {
            this.track.appendChild(this.createCard(project));
        });

        // 2. Check overflow
        const isOverflowing = this.track.scrollWidth > this.wrapper.clientWidth;

        // Remove old state
        this.track.classList.remove('no-scroll');
        this.track.classList.remove('center-content');
        if (this.navButtons) this.navButtons.forEach(btn => btn.style.display = 'none');

        if (isOverflowing && data.length > 0) {

            // FIX: If count is odd AND we need to loop, we must duplicate to fix grid alignment.
            // But we do this ONLY if overflowing, to avoid "doubled" content on static views.
            if (data.length % 2 !== 0) {
                // Duplicate Data
                data = [...data, ...data];
                this.currentCount = data.length; // Update count

                // Re-render completely with new even data
                this.track.innerHTML = '';
                data.forEach(project => {
                    this.track.appendChild(this.createCard(project));
                });
            }

            // 3. Add Clones for Infinity (x3)
            data.forEach(project => {
                const clone = this.createCard(project);
                clone.classList.add('clone');
                this.track.appendChild(clone);
            });
            data.forEach(project => {
                const clone = this.createCard(project);
                clone.classList.add('clone');
                this.track.appendChild(clone);
            });

            this.currentTranslate = 0;
            this.currentVelocity = 0;
            this.targetSpeed = this.baseSpeed;
            this.isScrolling = true;

            if (this.navButtons) this.navButtons.forEach(btn => btn.style.display = 'block');

            // Recalculate dimensions immediately
            this.calculateDimensions();

            this.animate();
        } else {
            // Static Layout
            this.isScrolling = false;
            this.track.style.transform = 'translateX(0)';
            this.track.classList.add('no-scroll');
            this.track.classList.add('center-content'); // Center items
        }
    }



    createCard(project) {
        const article = document.createElement('article');
        article.className = 'project-card';
        article.setAttribute('data-id', project.id);

        // Using refactored Categories
        const catKey = project.category;
        const catName = translations[currentLang].cat[catKey] || catKey;

        // Resolve Role
        const roleName = getRoleName(project.role);

        // Resolve Status (Editing Only)
        let statusBadgeHtml = '';
        if (project.status && (project.status.toLowerCase().includes('edit') || project.status.toLowerCase().includes('montage'))) {
            const statusLabel = translations[currentLang].status.editing;
            // Add data-i18n for auto-translation on switch
            statusBadgeHtml = `<span class="status-badge" data-i18n="status.editing">${statusLabel}</span>`;
        }

        // Resolve Media (Handle Carousel Array)
        let mediaSrc = project.media;
        if (Array.isArray(mediaSrc)) {
            mediaSrc = mediaSrc[0];
        }

        // PREFER COVER IF AVAILABLE (Work Only)
        const displaySrc = project.cover || mediaSrc;

        article.innerHTML = `
      <div class="project-overlay-role">
        <span class="role-badge" data-project-role>${roleName || 'Filmmaker'}</span>
        ${statusBadgeHtml}
      </div>
      <img src="${displaySrc}" alt="${project.title}" class="project-media">
      <div class="project-info">
        <h3 class="project-title">${project.title}</h3>
        <span class="project-category" data-i18n="cat.${catKey}">${catName}</span>
      </div>
    `;
        return article;
    }

    setupDrag() {
        // Mouse Events
        this.wrapper.addEventListener('mousedown', e => {
            this.isDragging = true;
            this.startX = e.pageX;
            this.lastX = e.pageX;
        });

        window.addEventListener('mouseup', () => {
            if (!this.isDragging) return;
            this.isDragging = false;
            this.targetSpeed = this.baseSpeed; // Return to auto

            if (window.isGalleryDragging) {
                setTimeout(() => { window.isGalleryDragging = false; }, 50);
            }
        });

        window.addEventListener('mousemove', e => {
            if (!this.isDragging) return;
            e.preventDefault();
            const x = e.pageX;
            const delta = x - this.lastX;

            if (Math.abs(x - this.startX) > 5) {
                window.isGalleryDragging = true;
            }

            this.currentTranslate += delta;
            this.lastX = x;
        });

        // Touch Events (Mobile Swipe)
        this.wrapper.addEventListener('touchstart', e => {
            this.isDragging = true;
            this.startX = e.touches[0].pageX;
            this.lastX = e.touches[0].pageX;
            this.targetSpeed = 0; // Stop auto-scroll on touch

            // Global Touch Tracker for Click Logic
            window.lastTouchTime = Date.now();
        }, { passive: false });

        window.addEventListener('touchend', () => {
            if (!this.isDragging) return;
            this.isDragging = false;
            this.targetSpeed = this.baseSpeed; // Return to auto

            // Allow click if minor move
            if (window.isGalleryDragging) {
                setTimeout(() => { window.isGalleryDragging = false; }, 50);
            }
        });

        window.addEventListener('touchmove', e => {
            if (!this.isDragging) return;
            // e.preventDefault(); // allow vertical scroll? 
            // Better to only preventDefault if horizontal move is dominant

            const x = e.touches[0].pageX;
            const delta = x - this.lastX;

            // Simple horizontal lock check could go here, but for now direct map
            if (Math.abs(x - this.startX) > 5) {
                window.isGalleryDragging = true;

                // Clear all hover/touch states on scroll start
                document.querySelectorAll('.project-card.touched').forEach(c => c.classList.remove('touched'));
            }

            this.currentTranslate += delta * 1.5; // Sensitivity Boost for Touch
            this.lastX = x;
        }, { passive: false });

        // Add Trackpad / Horizontal Scroll Support
        this.wrapper.addEventListener('wheel', e => {
            // Check for horizontal scroll (Trackpad or Shift+Wheel)
            if (Math.abs(e.deltaX) > Math.abs(e.deltaY)) {
                e.preventDefault();
                // Invert delta because: scrolling right (two fingers left) -> positive deltaX -> should move content left (negative translate)
                // Actually:
                // Standard: Pan Right -> Content moves Left.
                // e.deltaX > 0 (Pan Right gesture?). 

                this.currentTranslate -= e.deltaX * 1.5;

                // Temporarily pause auto-scroll or boost it?
                // Usually we just affect currentTranslate directly.
            }
        }, { passive: false });
    }

    calculateDimensions() {
        const firstCard = this.track.children[0];
        if (firstCard) {
            const cardWidth = firstCard.getBoundingClientRect().width;
            const trackStyle = window.getComputedStyle(this.track);
            const gap = parseFloat(trackStyle.gap) || 0;
            this.singleItemWidth = cardWidth + gap;
        } else {
            // Fallback
            const vw = window.innerWidth / 100;
            this.singleItemWidth = 30 * vw;
        }

        // Calculate limit once
        // FIX: Handle Odd vs Even counts for 2-row grid.
        // Even: Pattern repeats every 1 Set (Count/2 cols).
        // Odd: Pattern shifts rows, repeats every 2 Sets (Count cols).
        const visualCols = (this.currentCount % 2 === 0)
            ? (this.currentCount / 2)
            : this.currentCount;

        this.singleSetWidth = visualCols * this.singleItemWidth;
    }

    animate() {
        if (!this.isScrolling) return;

        if (!this.isDragging) {
            // Lerp Speed (Reduced factor for smoother stop)
            this.speed += (this.targetSpeed - this.speed) * 0.05;
            this.currentTranslate -= this.speed;
        }

        // Use Cached Dimensions (No DOM Read)
        const singleSetWidth = this.singleSetWidth || (this.currentCount * 300); // safety fallback

        // Wrapping logic
        if (singleSetWidth > 0) { // Safety check
            if (Math.abs(this.currentTranslate) >= singleSetWidth) {
                this.currentTranslate += singleSetWidth;
            }
            if (this.currentTranslate > 0) {
                this.currentTranslate -= singleSetWidth;
            }
        }

        this.track.style.transform = `translateX(${this.currentTranslate}px)`;

        this.animationId = requestAnimationFrame(this.animate.bind(this));
    }
}
// --- Mobile Menu Toggle ---
const menuToggle = document.querySelector('.mobile-menu-toggle');
const navLinks = document.querySelector('.nav-links');

if (menuToggle && navLinks) {
    // Toggle Menu
    menuToggle.addEventListener('click', () => {
        navLinks.classList.toggle('active');
        menuToggle.classList.toggle('active');

        // Icon Swap Logic
        const icon = menuToggle.querySelector('i');
        if (navLinks.classList.contains('active')) {
            // Switch to X (Close)
            if (icon) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-xmark');
            }
            document.body.style.overflow = 'hidden'; // Lock Scroll
        } else {
            // Switch to Bars (Menu)
            if (icon) {
                icon.classList.remove('fa-xmark');
                icon.classList.add('fa-bars');
            }
            document.body.style.overflow = ''; // Unlock Scroll
        }
    });

    // Close on Link Click
    navLinks.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navLinks.classList.remove('active');

            // Revert Icon
            const icon = menuToggle.querySelector('i');
            if (icon) {
                icon.classList.remove('fa-xmark');
                icon.classList.add('fa-bars');
            }

            document.body.style.overflow = '';
        });
    });
}

// --- FORCE MOBILE CSS FIX (JS Injection to bypass cache) ---
(function () {
    const style = document.createElement('style');
    style.innerHTML = `
        @media (max-width: 1300px) {
            .project-overlay-role {
                display: flex !important;
                flex-direction: column !important;
                align-items: flex-end !important;
                justify-content: flex-start !important;
                gap: 4px !important;
                top: 1rem !important;
                right: 1rem !important;
                left: auto !important;
                width: auto !important;
                height: auto !important;
            }
            .role-badge, .status-badge {
                font-size: 0.55rem !important;
                padding: 4px 8px !important;
                white-space: nowrap !important;
                max-width: 100% !important;
                text-align: right !important;
                display: block !important;
                margin-left: auto !important;
                transform: none !important;
                opacity: 1 !important; /* Ensure visible */
            }
            /* Stack order: Role first, then Status */
            .role-badge { order: 1; }
            .status-badge { order: 2; }

            /* --- MODAL MOBILE FIX --- */
            #modal-title .status-badge {
                display: block !important;
                width: fit-content !important;
                margin: 0.5rem auto 0 auto !important; /* Center below title */
                vertical-align: baseline !important;
                font-size: 0.6rem !important;
                transform: none !important;
                opacity: 0.8 !important;
                white-space: normal !important; /* Allow wrap if somehow needed, but fit-content prevents it */
            }
        }
    `;
    document.head.appendChild(style);
})();
