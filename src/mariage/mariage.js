import './mariage.css';
import { weddings } from './data.js';

// iOS :active state hack
document.addEventListener("touchstart", function () { }, true);

document.addEventListener('DOMContentLoaded', () => {

    // 0. DYNAMIC CONTENT GENERATION (Project System)
    const infoContainer = document.querySelector('.gallery-info-col');
    const mediaContainer = document.querySelector('.gallery-media-col');

    // Clear existing hardcoded content
    if (infoContainer) infoContainer.innerHTML = '';
    if (mediaContainer) mediaContainer.innerHTML = '';

    // Create Wrapper for Layout Context (Fixes Padding Issue)
    const infoWrapper = document.createElement('div');
    infoWrapper.classList.add('sticky-wrapper');
    if (infoContainer) infoContainer.appendChild(infoWrapper);

    weddings.forEach((wedding, index) => {
        // 1. Create Info Block (Left)
        const infoBlock = document.createElement('div');
        infoBlock.classList.add('info-block');
        if (index === 0) infoBlock.classList.add('active'); // First one active
        infoBlock.dataset.target = wedding.id;

        infoBlock.innerHTML = `
            <span class="season">${wedding.subtitle.fr || wedding.subtitle}</span>
            <h2 class="ep-name">${wedding.title}</h2>
            <p class="ep-desc">${wedding.description.fr}</p>
            <span class="watch-btn custom-link" data-link="${wedding.link || ''}" data-target="_blank">WATCH FILM</span>
`;
        infoWrapper.appendChild(infoBlock);

        // 2. Create Media Block (Right)
        const mediaItem = document.createElement('div');
        mediaItem.classList.add('media-item');
        mediaItem.dataset.id = wedding.id;

        // Generate Slideshow HTML
        let slidesHTML = '';
        let indicatorsHTML = '';
        wedding.media.forEach((src, imgIndex) => {
            const isActive = imgIndex === 0 ? 'active' : '';
            const isVideo = src.match(/\.(mp4|webm)($|\?)/i);

            if (isVideo) {
                slidesHTML += `<video class="img-bg ${isActive}" src="${src}" autoplay muted loop playsinline></video>`;
            } else {
                slidesHTML += `<div class="img-bg ${isActive}" style="background-image: url('${src}')"></div>`;
            }

            indicatorsHTML += `<div class="indicator ${isActive}"></div>`;
        });

        mediaItem.innerHTML = `
            <div class="img-wrapper slideshow" data-interval="4000">
                <div class="story-indicators">
                    ${indicatorsHTML}
                </div>
                ${slidesHTML}
            </div>
            <div class="media-overlay"></div>
`;
        if (mediaContainer) mediaContainer.appendChild(mediaItem);
    });

    console.log('Wedding System: Content Generated from Data');

    // 1. Reveal Loading Animation
    setTimeout(() => {
        document.querySelectorAll('.reveal-block').forEach(el => el.classList.add('active'));
    }, 200);

    // 2. Intersection Observer for Scroll Reveals
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
            }
        });
    }, { threshold: 0.1 });

    document.querySelectorAll('.reveal-scroll').forEach(el => observer.observe(el));


    // 3. STICKY LOGIC (The "Episode" Switcher)
    const mediaItems = document.querySelectorAll('.media-item');
    const infoBlocks = document.querySelectorAll('.info-block');

    const layoutObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && entry.intersectionRatio > 0.4) { // 50% visible

                const targetId = entry.target.getAttribute('data-id');

                // Switch Class
                infoBlocks.forEach(block => {
                    if (block.getAttribute('data-target') === targetId) {
                        block.classList.add('active');
                    } else {
                        block.classList.remove('active');
                    }
                });
            }
        });
    }, { threshold: 0.5 }); // Trigger when 50% item is visible

    mediaItems.forEach(item => layoutObserver.observe(item));

    // 3. FULL TITLE SLIDESHOW (Single Bar Reset)
    const titleSlides = document.querySelectorAll('.title-full-slide');
    const singleBar = document.querySelector('.t-single-bar');

    // Cleanup previous interval if HMR reloads or re-run
    if (window.mariageInterval) clearInterval(window.mariageInterval);

    if (titleSlides.length > 1 && singleBar) {
        let currentTitleIndex = 0;
        const duration = 5000; // 5 Seconds match CSS

        const runTitleSlideshow = () => {
            // Start Animation
            singleBar.classList.remove('animating');
            void singleBar.offsetWidth; // Force Reflow
            singleBar.classList.add('animating');

            window.mariageInterval = setInterval(() => {
                // Switch Slide
                titleSlides[currentTitleIndex].classList.remove('active');

                // Increment
                currentTitleIndex = (currentTitleIndex + 1) % titleSlides.length;

                // Active new slide
                titleSlides[currentTitleIndex].classList.add('active');

                // Reset & Restart Bar
                singleBar.classList.remove('animating');
                void singleBar.offsetWidth; // Force Reflow
                singleBar.classList.add('animating');

            }, duration);
        };

        // Start
        runTitleSlideshow();
    }

    // 4. SLIDESHOW LOGIC (Story Style) - Reusable Function
    const initSlideshows = (scope = document) => {
        const slideshows = scope.querySelectorAll('.slideshow');

        slideshows.forEach(show => {
            // Avoid double init
            if (show.dataset.init === 'true') return;
            show.dataset.init = 'true';

            const images = show.querySelectorAll('.img-bg');
            const indicators = show.querySelectorAll('.indicator');
            let index = 0;

            // Initialize
            if (images.length > 0) {
                images[0].classList.add('active');
                if (indicators.length > 0) indicators[0].classList.add('active');
            }

            const nextSlide = () => {
                // Mark current indicator as viewed (full)
                if (indicators[index]) {
                    indicators[index].classList.remove('active');
                    indicators[index].classList.add('viewed');
                }

                // Hide curent image
                if (images[index]) images[index].classList.remove('active');

                // Increment
                index++;

                // Loop check
                if (index >= images.length) {
                    index = 0;
                    // Reset indicators
                    indicators.forEach(ind => {
                        ind.classList.remove('viewed', 'active');
                    });
                }

                // Show next
                if (images[index]) images[index].classList.add('active');

                // Force reflow for animation restart if needed, 
                // but adding class 'active' should trigger animation on new element.
                if (indicators[index]) indicators[index].classList.add('active');
            };

            // Only auto-play if multiple images
            if (images.length > 1) {
                setInterval(nextSlide, 4000); // Sync with CSS 4s animation
            }
        });
    };

    // Run initially for Desktop
    initSlideshows();

    // 5. CUSTOM CURSOR
    const cursor = document.createElement('div');
    cursor.classList.add('luxe-cursor');
    document.body.appendChild(cursor);
    // Safe Cursor Activation
    document.body.classList.add('custom-cursor-active');

    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    });

    // Global Link Handler (Hides Status Bar URL)
    // Restore hover listeners
    document.querySelectorAll('a, button, .media-item, .info-block, .custom-link').forEach(el => {
        el.addEventListener('mouseenter', () => cursor.classList.add('hovered'));
        el.addEventListener('mouseleave', () => cursor.classList.remove('hovered'));
    });

    // 6. LINK HANDLER (Hide Status Bar)
    // 6. LINK HANDLER (Hide Status Bar)
    document.addEventListener('click', (e) => {
        const link = e.target.closest('.custom-link') || e.target.closest('[data-link]');
        if (link) {
            e.preventDefault();
            const url = link.getAttribute('data-link') || link.getAttribute('href');
            const target = link.getAttribute('data-target') || link.getAttribute('target');

            if (url) {
                if (target === '_blank') {
                    window.open(url, '_blank');
                } else {
                    window.location.href = url;
                }
            }
        }
    });

    // --- TRANSLATION SYSTEM ---
    const translations = {
        fr: {
            nav: "Histoires Vraies",
            book: "RÉSERVER",
            watch: "VOIR LE FILM",
            hero: {
                presents: "BREATHOUT WEDDINGS PRÉSENTE",
                title1: "VOTRE VIE",
                title2: "COMME UN FILM",
                feat: "LONG MÉTRAGE DOCU",
                netflix: "UNE SÉRIE ORIGINALE",
                series: "SÉRIE MARIAGE",
                orig: "SÉRIE ORIGINALE"
            },
            script: {
                l1: "Pas d'acteurs.",
                l2: "Pas de script.",
                l3: "Juste de l'émotion."
            },
            synopsis: "Votre mariage n'est pas une séance photo. C'est un grand film. Nous capturons votre journée comme un <strong>documentaire d'auteur</strong> : brut, esthétique, et incroyablement vivant. Des rires volés, des larmes discrètes, et cette intensité « Cinéma » que vous ne trouverez nulle part ailleurs.",
            footer: {
                narrative: "UNE NOUVELLE NARRATION",
                chapter: "ÉCRIVEZ VOTRE<br><i class=\"serif\">PROPRE CHAPITRE</i>",
                start: "LANCER LA PRODUCTION",
                prod: "PRODUIT PAR BREATHOUT VISUALS",
                rights: "© 2025 TOUS DROITS RÉSERVÉS"
            }
        },
        en: {
            nav: "True Stories",
            book: "BOOK NOW",
            watch: "WATCH FILM",
            hero: {
                presents: "BREATHOUT WEDDINGS PRESENTS",
                title1: "YOUR LIFE",
                title2: "AS A MOVIE",
                feat: "FEATURE DOC",
                netflix: "A BREATHOUT ORIGINAL",
                series: "WEDDING SERIES",
                orig: "ORIGINAL SERIES"
            },
            script: {
                l1: "No Acting.",
                l2: "No Script.",
                l3: "Pure emotion."
            },
            synopsis: "Your wedding is not a photoshoot. It is a feature film. We capture your day like an <strong>auteur documentary</strong>: raw, aesthetic, and incredibly alive. Stolen laughs, quiet tears, and that \"Cinema\" intensity you won't find anywhere else.",
            footer: {
                narrative: "A NEW NARRATIVE",
                chapter: "WRITE YOUR<br><i class=\"serif\">OWN CHAPTER</i>",
                start: "START PRODUCTION",
                prod: "PRODUCED BY BREATHOUT VISUALS",
                rights: "© 2025 ALL RIGHTS RESERVED"
            }
        }
    };

    let currentLang = 'en'; // Default to English as requested context implies it's the target

    function updateContent() {
        const t = translations[currentLang];

        // Nav
        document.querySelector('.ep-title').textContent = t.nav;
        document.querySelector('.cta-book').textContent = t.book;

        // Hero Slide 1
        document.querySelector('[data-style="doc"] .studio-present').textContent = t.hero.presents;
        document.querySelector('[data-style="doc"] .main-title .line:nth-child(1)').textContent = t.hero.title1;
        document.querySelector('[data-style="doc"] .main-title .line:nth-child(2)').innerHTML = `${t.hero.title2.replace('MOVIE', '<i class="serif">MOVIE</i>').replace('FILM', '<i class="serif">FILM</i>')}`;
        document.querySelector('[data-style="doc"] .bottom-credit').textContent = t.hero.feat;

        // Hero Slide 2
        document.querySelector('[data-style="netflix"] .studio-present').textContent = t.hero.netflix;
        document.querySelector('[data-style="netflix"] .main-title').innerHTML = t.hero.series.replace('WEDDING', 'WEDDING<br>').replace('MARIAGE', 'MARIAGE<br>').replace('SERIES', '<span class="indent red">SERIES</span>').replace('SÉRIE', '<span class="indent red">SÉRIE</span>');
        document.querySelector('[data-style="netflix"] .bottom-credit').textContent = t.hero.orig;

        // Script
        const scripts = document.querySelectorAll('.word-mask');
        if (scripts[0]) scripts[0].textContent = t.script.l1;
        if (scripts[1]) scripts[1].textContent = t.script.l2;
        if (scripts[2]) scripts[2].textContent = t.script.l3;

        // Synopsis
        const p = document.querySelector('.synopsis p');
        if (p) {
            // Keep strong tag
            p.innerHTML = t.synopsis;
        }

        // Footer
        document.querySelector('.the-end').textContent = t.footer.narrative;
        document.querySelector('.next-season').innerHTML = t.footer.chapter;
        document.querySelector('.sober-prod-btn').textContent = t.footer.start;
        document.querySelector('.legal-credits span:first-child').textContent = t.footer.prod;
        document.querySelector('.legal-credits span:nth-child(2)').textContent = t.footer.rights;

        // Button State
        const langBtn = document.getElementById('lang-switch-wedding');
        if (langBtn) langBtn.textContent = currentLang === 'fr' ? 'EN' : 'FR';

        // Update Project Descriptions (Dynamic from Data) AND Watch Buttons
        const infoBlocks = document.querySelectorAll('.info-block');
        infoBlocks.forEach((block, index) => {
            if (weddings[index]) {
                // Description
                if (weddings[index].description) {
                    const descEl = block.querySelector('.ep-desc');
                    if (descEl) {
                        descEl.innerHTML = weddings[index].description[currentLang] || weddings[index].description.fr;
                    }
                }
                // Watch Button
                const watchBtn = block.querySelector('.watch-btn');
                if (watchBtn) {
                    watchBtn.textContent = t.watch;
                }
            }
        });

        // 4. Update Mobile Gallery (NEW)
        const mobileProjects = document.querySelectorAll('.mobile-project-card');
        mobileProjects.forEach((card, index) => {
            if (weddings[index]) {
                const w = weddings[index];
                card.querySelector('.mobile-ep-desc').innerHTML = w.description[currentLang];
                card.querySelector('.watch-btn').textContent = t.watch;
            }
        });
    }

    // --- RENDER MOBILE GALLERY (NEW) ---
    const renderMobileGallery = () => {
        const desktopGallery = document.querySelector('.sticky-gallery');
        if (!desktopGallery) return;

        // Avoid duplicate render
        if (document.querySelector('.mobile-gallery-list')) return;

        // Create Container
        const mobileContainer = document.createElement('div');
        mobileContainer.className = 'mobile-gallery-list';

        // Populate
        weddings.forEach(w => {
            const card = document.createElement('div');
            card.className = 'mobile-project-card';

            // 1. Text Info
            const infoDiv = document.createElement('div');
            // Safe subtitle access (can be object or string)
            const subtitle = w.subtitle ? (w.subtitle.fr || w.subtitle) : '';

            infoDiv.className = 'mobile-project-info';
            infoDiv.innerHTML = `
                <span class="mobile-ep-label">${subtitle}</span>
                <span class="mobile-ep-title">${w.title}</span>
                <p class="mobile-ep-desc">${w.description[currentLang] || w.description.fr}</p>
            `;

            // 2. Media (Slideshow)
            const mediaDiv = document.createElement('div');
            mediaDiv.className = 'mobile-project-media slideshow';

            let htmlContent = '';
            let indicatorsHTML = '';

            // USE 'media' property, not 'assets'
            if (w.media && w.media.length > 0) {
                w.media.forEach((src, i) => {
                    const isActive = i === 0 ? 'active' : '';
                    const isVideo = typeof src === 'string' && src.match(/\.(mp4|webm)($|\?)/i);

                    if (isVideo) {
                        htmlContent += `<video class="img-bg ${isActive}" src="${src}" autoplay muted loop playsinline></video>`;
                    } else {
                        htmlContent += `<div class="img-bg ${isActive}" style="background-image: url('${src}')"></div>`;
                    }

                    indicatorsHTML += `<div class="indicator ${isActive}"></div>`;
                });

                mediaDiv.innerHTML = `
                    ${htmlContent}
                    <div class="indicators" style="display: flex; justify-content: center; gap: 6px; position: absolute; bottom: 10px; width: 100%; z-index: 10;">
                        ${indicatorsHTML}
                    </div>
                 `;
            }

            // 3. Watch Button
            const btn = document.createElement('button');
            btn.className = 'watch-btn custom-link';
            btn.textContent = translations[currentLang].watch;
            btn.setAttribute('data-link', w.link);
            btn.setAttribute('target', '_blank');

            // Append All
            card.appendChild(infoDiv);
            card.appendChild(mediaDiv);
            card.appendChild(btn);
            mobileContainer.appendChild(card);
        });

        // Insert after desktop gallery
        desktopGallery.parentNode.insertBefore(mobileContainer, desktopGallery.nextSibling);

        // Init Slideshows
        if (typeof initSlideshows === 'function') {
            initSlideshows(mobileContainer);
        }

        // Apply "Nuclear" handlers (Universal Fix)
        const makeResponsive = (el) => {
            // Instant Visual
            el.addEventListener('touchstart', () => el.classList.add('is-pressed'), { passive: true });
            el.addEventListener('touchend', () => setTimeout(() => el.classList.remove('is-pressed'), 150));
            el.addEventListener('touchcancel', () => el.classList.remove('is-pressed'));

            // Click Logic (Nuclear)
            el.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();
                const url = el.getAttribute('data-link');

                // Force Animation
                el.classList.add('is-pressed');

                // Wait then Go
                setTimeout(() => {
                    el.classList.remove('is-pressed');
                    if (url) window.open(url, '_blank');
                }, 250);
            });
        };
        mobileContainer.querySelectorAll('.watch-btn').forEach(btn => makeResponsive(btn));
    };

    // Run Render
    renderMobileGallery();

    // Language Switch Logic
    const setupLanguageSwitch = () => {
        const btn = document.createElement('button');
        btn.id = 'lang-switch-wedding';
        btn.className = 'lang-btn-wedding custom-link'; // Added custom-link for cursor
        btn.textContent = 'EN'; // Shows what you switch TO

        // Styling managed by CSS class 'lang-btn-wedding'
        // btn.style.marginLeft = '2rem'; <-- REMOVED
        // ... all inline styles removed to let CSS handle mobile/desktop layout

        btn.addEventListener('mouseenter', () => {
            btn.style.background = 'rgba(0,0,0,0.05)';
            if (typeof cursor !== 'undefined') cursor.classList.add('hovered');
        });
        btn.addEventListener('mouseleave', () => {
            btn.style.background = 'transparent';
            if (typeof cursor !== 'undefined') cursor.classList.remove('hovered');
        });

        btn.addEventListener('click', () => {
            currentLang = currentLang === 'fr' ? 'en' : 'fr';
            updateContent();
        });

        // Append to Header Actions
        const headerActions = document.querySelector('.header-actions');
        if (headerActions) {
            headerActions.appendChild(btn);
        } else {
            // Fallback
            document.body.appendChild(btn);
            btn.style.position = 'fixed';
            btn.style.bottom = '2rem';
            btn.style.right = '2rem';
        }
    };

    setupLanguageSwitch();

    // 7. START PRODUCTION ISOLATED LOGIC
    const prodBtn = document.getElementById('prod-cta');
    if (prodBtn) {
        // Manual Cursor Handling
        prodBtn.addEventListener('mouseenter', () => cursor.classList.add('hovered'));
        prodBtn.addEventListener('mouseleave', () => cursor.classList.remove('hovered'));

        // Forced Animation Logic
        prodBtn.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation(); // Kill global handlers

            // Visual Feedack
            prodBtn.classList.add('is-pressed');

            // Wait then Go
            setTimeout(() => {
                prodBtn.classList.remove('is-pressed');
                window.location.href = 'mailto:lucas.jacquot@breathoutvisuals.fr';
            }, 250);
        });
    }

    // 8. WATCH FILM BUTTONS (Nuclear Option for NodeList)
    const setupWatchButtonHandlers = () => {
        const watchBtns = document.querySelectorAll('.watch-btn');
        watchBtns.forEach(btn => {
            // Clone to strip old listeners
            const newBtn = btn.cloneNode(true);
            btn.parentNode.replaceChild(newBtn, btn);

            // Manual Cursor
            newBtn.addEventListener('mouseenter', () => cursor.classList.add('hovered'));
            newBtn.addEventListener('mouseleave', () => cursor.classList.remove('hovered'));

            // Forced Animation
            newBtn.addEventListener('click', (e) => {
                e.preventDefault();
                e.stopPropagation();

                // Visual Feedback
                newBtn.classList.add('is-pressed');

                // Get URL
                const url = newBtn.getAttribute('href') || newBtn.getAttribute('data-link');
                const target = newBtn.getAttribute('target') || newBtn.getAttribute('data-target') || '_self';

                // Wait then Go
                setTimeout(() => {
                    newBtn.classList.remove('is-pressed');
                    if (url) {
                        if (target === '_blank') {
                            window.open(url, '_blank');
                        } else {
                            window.location.href = url;
                        }
                    }
                }, 250);
            });
        });
    };

    // Initialize
    updateContent();
    setupWatchButtonHandlers();

    const makeResponsive = (el) => {
        if (!el) return;
        el.addEventListener('touchstart', (e) => {
            // Instant Visual Feedback
            el.classList.add('is-pressed');
        }, { passive: true });

        el.addEventListener('touchend', () => {
            // Small delay to ensure the flash is seen if tap is super fast
            setTimeout(() => el.classList.remove('is-pressed'), 150);
        });

        el.addEventListener('touchcancel', () => {
            el.classList.remove('is-pressed');
        });
    };

    // Apply to Book & Lang
    const bookBtn = document.querySelector('.cta-book');
    const langBtn = document.querySelector('.lang-btn-wedding'); // Might be null initially if injected by JS? No, JS injects it.

    // We need to wait for lang btn? setupLanguageSwitch() runs before this.
    // Re-query just in case
    makeResponsive(document.querySelector('.cta-book'));
    makeResponsive(document.getElementById('lang-switch-wedding'));

    // Apply to Nuclear Buttons (Visual Boost)
    makeResponsive(document.getElementById('prod-cta'));
    document.querySelectorAll('.watch-btn').forEach(btn => makeResponsive(btn));

    console.log('Series-Style Wedding Page Screenplay Loaded & Responsive');
});
