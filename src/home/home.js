import './home.css';
import { content } from './data/content.js';

// Access Shortcuts
const dynamicProjects = content.projects;
const dynamicTeam = content.team;
const dynamicServices = content.services;
const dynamicHome = content.home;

// STATE MANAGEMENT
const state = {
    activeOverlay: null
};

document.addEventListener('DOMContentLoaded', () => {

    // 1. PRELOADER
    setTimeout(() => {
        const preloader = document.getElementById('preloader');
        if (preloader) preloader.classList.add('hidden');
    }, 1000);

    // 2. DOM ELEMENTS
    const burgerBtn = document.getElementById('burger-trigger');
    const menuOverlay = document.getElementById('menu-overlay');
    // const closeBtns = document.querySelectorAll('.close-btn'); // REMOVED
    const navItems = document.querySelectorAll('.nav-item');

    // 3. EVENT LISTENERS

    // BURGER CLICK (TOGGLE MENU / CLOSE OVERLAY)
    burgerBtn.addEventListener('click', () => {
        if (document.body.classList.contains('nav-open')) {
            // If open (Cross state), close everything
            closeAllOverlays();
        } else {
            // If closed (Burger state), open Menu
            openOverlay('menu-overlay');
        }
    });

    // Nav Item Click
    navItems.forEach(item => {
        item.addEventListener('click', () => {
            const targetId = item.getAttribute('data-target');
            if (targetId === 'home') {
                closeAllOverlays();
            } else {
                openOverlay(targetId);
            }
        });
    });

    // Custom Events
    document.addEventListener('open-contact', () => {
        openOverlay('contact-overlay');
    });

    const servicesContactBtn = document.getElementById('services-contact-trigger');
    if (servicesContactBtn) {
        servicesContactBtn.addEventListener('click', () => {
            openOverlay('contact-overlay');
        });
    }

    // WORK LIST HOVER... (Keep logic)
    const workItems = document.querySelectorAll('.work-li');
    const bgs = document.querySelectorAll('.bg-reveal');

    workItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            const targetId = item.getAttribute('data-bg');
            bgs.forEach(bg => bg.classList.remove('active'));
            const targetBg = document.getElementById(targetId);
            if (targetBg) targetBg.classList.add('active');
        });
    });

    // Reset background? No close buttons anymore.
    // Reset happens in closeAllOverlays
});

// Store timeout to clear if user clicks fast
let switchTimeout = null;

function openOverlay(id) {
    const overlay = document.getElementById(id);
    if (!overlay) return;

    const currentActive = document.querySelector('.overlay-window.active');

    // If switching between windows (e.g. Menu -> Team)
    if (currentActive && currentActive.id !== id) {
        // Clear cleanup if any
        if (switchTimeout) clearTimeout(switchTimeout);

        // CIRCLE ANIMATION HANDLING
        // If we are leaving Menu (switch to sub-page), turn OFF circle so it lifts like a curtain
        if (currentActive.id === 'menu-overlay') {
            currentActive.classList.remove('circle-anim');
        }

        // If we are entering Menu (Team -> Menu), Turn ON circle (for future close)
        // Actually, entering Menu via 'Back' assumes it's revealed underneath. 
        // Does adding the class affect the "Pre-existing" state?
        // If Menu is underneath (active), it has inset(0).
        // If we add .circle-anim (active), it becomes circle(150%).
        // Visually identical (both full screen). So it is safe to add.
        if (id === 'menu-overlay') {
            overlay.classList.add('circle-anim');
        }

        // REVEAL LOGIC:
        // 1. Prepare New Overlay BEHIND the current one, standard z-index (900) or lower?
        //    Actually, we want to force the CURRENT one to stay on top while it closes.
        //    CSS default z-index is 900.

        currentActive.style.zIndex = '950'; // Make sure Old is on top

        // 2. Make New Overlay instantly visible UNDERNEATH
        overlay.classList.add('instant-active');
        overlay.classList.add('active'); // Logically active

        // 3. Trigger Old Overlay to CLOSE (Slide Up)
        //    Triggering removal of 'active' causes transition: clip-path inset(0 0 100% 0) (Curtain Up)

        // Force reflow specifically for currentActive to ensure z-index applies?
        void currentActive.offsetWidth;

        currentActive.classList.remove('active');

        // 4. Cleanup after animation (0.8s)
        switchTimeout = setTimeout(() => {
            overlay.classList.remove('instant-active'); // restore normal transition for subsequent actions
            currentActive.style.zIndex = '';

            // Note: currentActive doesn't need 'active' removed, we just did it.
        }, 800);

    } else {
        // Normal Open (Home -> Menu)

        // If opening Menu, use Circle Anim
        if (id === 'menu-overlay') {
            overlay.classList.add('circle-anim');
            // FORCE REFLOW: Ensure browser confirms "Circle Closed" state 
            // before updating to "Circle Open" (.active).
            // This prevents trying to transition from Inset -> Circle.
            void overlay.offsetWidth;
        } else {
            // For others (direct open?), ensure clean
            overlay.classList.remove('circle-anim');
        }

        // Standard Curtain Down
        document.querySelectorAll('.overlay-window').forEach(el => {
            el.classList.remove('active');
            el.style.zIndex = '';
        });
        overlay.classList.add('active');
    }

    document.body.classList.add('nav-open');
    state.activeOverlay = id;
}

function closeAllOverlays() {
    document.querySelectorAll('.overlay-window').forEach(el => {
        el.classList.remove('active');
    });
    document.body.classList.remove('nav-open'); // Transform Cross back to Burger
    state.activeOverlay = null;

    // Reset backgrounds
    document.querySelectorAll('.bg-reveal').forEach(bg => bg.classList.remove('active'));
}


// CLOCK

// RENDER TEAM
function renderTeam() {
    const teamOverlay = document.getElementById('team-overlay');
    if (!teamOverlay) return;

    const container = teamOverlay.querySelector('.team-pyramid');
    if (!container) return;

    const header = container.querySelector('.overlay-header');
    container.innerHTML = '';
    if (header) container.appendChild(header);

    // Sort Team: Lucas -> 1st, Zoltan -> 2nd, others -> last
    const sortedTeam = [...dynamicTeam].sort((a, b) => {
        const order = { 'lucas': 1, 'zoltan': 2 };
        const orderA = order[a.id.toLowerCase()] || 99;
        const orderB = order[b.id.toLowerCase()] || 99;
        return orderA - orderB;
    });

    // Create a wrapper for the team members to handle the grid/stack
    const teamWrapper = document.createElement('div');
    teamWrapper.className = 'team-wrapper';
    container.appendChild(teamWrapper);

    let isTeamAnimating = false;

    sortedTeam.forEach((member, index) => {
        const card = document.createElement('div');
        card.className = `team-card ${member.role.toUpperCase().includes('FOUNDER') ? 'founder-card' : ''}`;

        // Give each card a default order based on sorted array
        card.style.order = index + 1;

        // Define Images (Default to same image if expanded version missing)
        const collapsedImg = member.image && member.image !== "''" ? member.image : 'https://picsum.photos/seed/avatar/400/400';
        const expandedImg = member.imageExpanded && member.imageExpanded !== "''" ? member.imageExpanded : collapsedImg;

        card.innerHTML = `
            <div class="team-photo">
                <img src="${collapsedImg}" class="collapsed-img" alt="${member.name}">
                <img src="${expandedImg}" class="expanded-img" alt="${member.name} wide">
                ${!member.image || member.image === "''" ? '<div class="placeholder-photo">PHOTO</div>' : ''}
            </div>
            <div class="team-info">
                <h3>${member.name}</h3>
                <p class="role">${member.role}</p>
                <div class="desc-container">
                    <p class="desc">${member.desc}</p>
                </div>
                ${member.link ? `<a href="${member.link}" class="link-arrow">VIEW PORTFOLIO &rarr;</a>` : ''}
            </div>
        `;

        // Click to expand logic (Mobile Only)
        card.addEventListener('click', (e) => {
            if (window.innerWidth > 768) return; // Keep hover for PC
            if (isTeamAnimating) return; // Spam protection
            if (e.target.tagName === 'A') return;

            isTeamAnimating = true;

            // --- FLIP ANIMATION : FIRST ---
            const allCards = teamWrapper.querySelectorAll('.team-card');
            const states = Array.from(allCards).map(c => ({
                el: c,
                rect: c.getBoundingClientRect()
            }));

            // --- CHANGE STATE ---
            allCards.forEach(c => {
                if (c !== card) c.classList.remove('expanded');
            });
            card.classList.toggle('expanded');

            // --- FLIP ANIMATION : LAST & INVERT & PLAY ---
            requestAnimationFrame(() => {
                states.forEach(({ el, rect: firstRect }) => {
                    const lastRect = el.getBoundingClientRect();

                    // Delta calculation for Position
                    const dx = firstRect.left - lastRect.left;
                    const dy = firstRect.top - lastRect.top;

                    // Delta calculation for Scale (STRETCHING)
                    const sw = firstRect.width / lastRect.width;
                    const sh = firstRect.height / lastRect.height;

                    if (dx !== 0 || dy !== 0 || sw !== 1 || sh !== 1) {
                        el.style.transition = 'none';
                        el.style.transformOrigin = '0 0'; // Keep anchor to top-left for stable delta math
                        el.style.transform = `translate(${dx}px, ${dy}px) scale(${sw}, ${sh})`;
                        if (el === card) el.style.zIndex = '100'; // Bring active card to top

                        // Force reflow
                        el.offsetHeight;

                        requestAnimationFrame(() => {
                            const transitionVal = 'transform 0.75s cubic-bezier(0.16, 1, 0.3, 1), background 0.75s ease, padding 0.75s ease, border 0.75s ease';
                            el.style.setProperty('transition', transitionVal, 'important');
                            el.style.transform = 'translate(0, 0) scale(1, 1)';

                            // Cleanup after animation
                            setTimeout(() => {
                                el.style.transition = '';
                                el.style.transform = '';
                                el.style.transformOrigin = '';
                                el.style.zIndex = '';
                                isTeamAnimating = false; // Reset lock
                            }, 750);
                        });
                    } else {
                        // No movement but lock must be reset
                        setTimeout(() => {
                            isTeamAnimating = false;
                        }, 750);
                    }
                });
            });
        });

        teamWrapper.appendChild(card);
    });
}

// RENDER SERVICES
function renderServices() {
    const servicesOverlay = document.getElementById('todo-overlay');
    if (!servicesOverlay) return;

    const grid = servicesOverlay.querySelector('.services-grid');
    if (!grid) return;

    // Clear existing cards but keep CTA if separate? 
    // In HTML, CTA is inside grid. 
    // We should re-add CTA manually or treat it as a special item.
    // Let's clear and rebuild.
    grid.innerHTML = '';

    dynamicServices.forEach((service, index) => {
        const card = document.createElement('div');
        card.className = 'service-card anim-item';

        const listItems = service.list.map(item => `<li>${item}</li>`).join('');

        card.innerHTML = `
            <div class="service-num">0${index + 1}</div>
            <div class="service-content">
                <h3>${service.title.replace(' ', '<br>')}</h3>
                <p>${service.desc}</p>
                <ul class="service-list">
                    ${listItems}
                </ul>
            </div>
        `;
        grid.appendChild(card);
    });

    // Re-add CTA
    const cta = document.createElement('div');
    cta.className = 'service-cta-container anim-item';
    cta.innerHTML = `<button class="cta-btn service-cta-btn" id="services-contact-trigger-dyn">ELEVATE MY BRANDING</button>`;
    grid.appendChild(cta);

    // Re-bind Contact Event
    const btn = cta.querySelector('#services-contact-trigger-dyn');
    if (btn) {
        btn.addEventListener('click', () => {
            // Dispatch event or call openOverlay directly
            document.dispatchEvent(new Event('open-contact'));
        });
    }
}

// RENDER HOME BACKGROUNDS
function renderHomeBackgrounds() {
    const mainContent = document.getElementById('main-content');
    if (!mainContent) return;

    // Get all existing grid items
    const existingItems = mainContent.querySelectorAll('.grid-item');
    existingItems.forEach(item => item.remove());

    // We need to insert the new items BEFORE the center-cta
    // Use prepend or specific insertion
    const referenceNode = mainContent.querySelector('.center-cta') || mainContent.firstChild;

    // We expect 8 items (A-H) or however many are in dynamicHome.backgrounds
    const images = dynamicHome.backgrounds; // Array of imports [imgA, imgB...]

    // If no images found, fallback to generic placeholders or do nothing (keep HTML?)
    // If we have content, we replace.
    if (!images || images.length === 0) return;

    // Create 8 slots? Or just render what we have? 
    // The design is a 4x2 grid (8 items). 
    // If we have < 8 images, we might repeat or leave empty?
    // Let's loop 8 times and cycle through available images.

    for (let i = 0; i < 8; i++) {
        const imgSrc = images[i % images.length];
        const div = document.createElement('div');
        div.className = 'grid-item';
        div.innerHTML = `<img src="${imgSrc}" alt="Agency Visual ${i + 1}">`;
        mainContent.insertBefore(div, referenceNode);
    }
}



// WORK DATA (Mini-Window Content & Categories)
const CATEGORY_INFO = {
    ADS: {
        title: "ADS",
        desc: "HIGH IMPACT COMMERCIALS.",
        filterKey: 'commercial'
    },
    SOCIAL_MEDIA: {
        title: "SOCIAL MEDIA",
        desc: "ENGAGING CONTENT FOR DIGITAL PLATFORMS.",
        filterKey: 'social_media'
    },
    DOCUMENTARIES: {
        title: "DOCUMENTARIES",
        desc: "REAL STORIES, REAL EMOTION.",
        filterKey: 'documentary'
    },
    MUSIC_VIDEOS: {
        title: "MUSIC VIDEOS",
        desc: "VISUALIZING SOUND.",
        filterKey: 'music_video'
    },
    CORPORATE: {
        title: "CORPORATE",
        desc: "ELEVATING BRAND IDENTITY.",
        filterKey: 'corporate'
    }
};

function startClock() {
    const timeDisplay = document.getElementById('time-display');
    if (!timeDisplay) return;

    function update() {
        const now = new Date();
        const timeString = now.toLocaleTimeString('fr-FR', {
            hour: '2-digit',
            minute: '2-digit',
            second: '2-digit'
        });
        timeDisplay.textContent = timeString;
    }

    update(); // Initial
    setInterval(update, 1000);
}

startClock();

// GALLERY LOGIC
const galleryGrid = document.getElementById('main-gallery-grid');
const filterBtns = document.querySelectorAll('.filter-btn');
const detailWindow = document.getElementById('project-detail-window');
const detailBackBtn = document.getElementById('project-back');

// Flatten all projects for "ALL" view
function getAllProjects() {
    return dynamicProjects;
}

function renderGallery(filter = 'ALL') {
    if (!galleryGrid) return;
    galleryGrid.innerHTML = '';

    let projects = [];
    if (filter === 'ALL') {
        projects = getAllProjects();
    } else {
        const catInfo = CATEGORY_INFO[filter];
        if (catInfo) {
            projects = dynamicProjects.filter(p => p.category === catInfo.filterKey);
        }
    }

    // Shuffle "ALL" for better mix? Optional. For now sequential.

    projects.forEach((proj, index) => {
        const card = document.createElement('div');
        card.className = 'gallery-card';
        card.style.animationDelay = `${index * 0.05}s`;

        // Find nice category label
        const catLabel = proj.category.replace(/_/g, ' ');

        card.innerHTML = `
            <img src="${proj.cover}" alt="${proj.title}" onerror="this.src='https://picsum.photos/seed/${index}99/800/600'">
            <div class="card-overlay">
                <span class="card-title">${proj.title}</span>
                <span class="card-category">${catLabel} • ${proj.client}</span>
            </div>
        `;

        // Open Detail
        card.addEventListener('click', () => {
            openProjectDetail(proj);
        });

        galleryGrid.appendChild(card);
    });
}

// Filter Clicks
filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Active Class
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        const filter = btn.getAttribute('data-filter');
        renderGallery(filter);
    });
});

// Initial Render
renderGallery('ALL');

// DETAIL WINDOW LOGIC
function openProjectDetail(proj) {
    document.getElementById('project-title').textContent = proj.title;
    document.getElementById('project-client').textContent = `${proj.category.replace(/_/g, ' ')} • ${proj.client}`;

    // Use multi-lingual description if available, fallback to string
    const desc = (typeof proj.desc === 'object') ? (proj.desc.en || proj.desc.fr) : proj.desc;
    document.getElementById('project-desc').textContent = desc || "No description available.";

    const mediaContainer = document.getElementById('project-media-container');
    mediaContainer.innerHTML = `<img src="${proj.cover}" onerror="this.src='https://picsum.photos/seed/999/1920/1080'">`;

    detailWindow.classList.add('active');
}

if (detailBackBtn) {
    detailBackBtn.addEventListener('click', () => {
        detailWindow.classList.remove('active');
    });
}

// MINI WINDOW LOGIC
const workListView = document.getElementById('work-list-view');
const miniWindow = document.getElementById('category-mini-window');
const miniGrid = document.getElementById('mini-grid');
const backBtn = document.getElementById('mini-window-back');

// Open Category
document.querySelectorAll('.work-li').forEach(item => {
    item.addEventListener('click', () => {
        const categoryKey = item.getAttribute('data-category'); // e.g., ADS
        const config = CATEGORY_INFO[categoryKey];

        if (config) {
            const filteredProjects = dynamicProjects.filter(p => p.category === config.filterKey);

            // Construct a data object similar to old WORK_DATA structure for populate helper
            const data = {
                title: config.title,
                desc: config.desc,
                projects: filteredProjects
            };

            populateMiniWindow(data);
            workListView.classList.add('hidden');
            miniWindow.classList.add('active');
        }
    });
});

// Back to List
if (backBtn) {
    backBtn.addEventListener('click', () => {
        miniWindow.classList.remove('active');
        workListView.classList.remove('hidden');
    });
}

function populateMiniWindow(data) {
    document.getElementById('mini-title').textContent = data.title;
    document.getElementById('mini-desc').textContent = data.desc;

    miniGrid.innerHTML = ''; // Clear

    data.projects.forEach((proj, index) => {
        const card = document.createElement('div');
        card.className = 'mini-project-card';
        card.style.animationDelay = `${index * 0.1}s`; // Stagger
        card.innerHTML = `
            <img src="${proj.cover}" alt="${proj.title}" onerror="this.src='https://picsum.photos/seed/${index}/600/400'">
            <div class="mini-card-info">
                <div class="mini-card-title">${proj.title}</div>
                <div class="mini-card-client">${proj.client}</div>
            </div>
        `;
        miniGrid.appendChild(card);
    });
}

// Invoke Renderers (At the end to ensure all consts are loaded)
try {
    console.log("Starting Dynamic Render...");
    renderTeam();
    renderServices();
    renderHomeBackgrounds();
    renderGallery('ALL');
} catch (e) {
    console.error("CRITICAL RENDER ERROR:", e);
    alert("System Error: " + e.message + "\\nCheck console for details.");
}
