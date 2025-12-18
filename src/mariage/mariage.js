import './mariage.css';
import { weddings } from './data.js';

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
            <span class="season">${wedding.subtitle}</span>
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

    // 4. SLIDESHOW LOGIC (Story Style)
    const slideshows = document.querySelectorAll('.slideshow');

    slideshows.forEach(show => {
        const images = show.querySelectorAll('.img-bg');
        const indicators = show.querySelectorAll('.indicator');
        let index = 0;

        // Initialize
        if (images.length > 0 && indicators.length > 0) {
            images[0].classList.add('active');
            indicators[0].classList.add('active');
        }

        const nextSlide = () => {
            // Mark current indicator as viewed (full)
            indicators[index].classList.remove('active');
            indicators[index].classList.add('viewed');

            // Hide curent image
            images[index].classList.remove('active');

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
            images[index].classList.add('active');

            // Force reflow for animation restart if needed, 
            // but adding class 'active' should trigger animation on new element.
            indicators[index].classList.add('active');
        };

        setInterval(nextSlide, 4000); // Sync with CSS 4s animation
    });

    // 5. CUSTOM CURSOR
    const cursor = document.createElement('div');
    cursor.classList.add('luxe-cursor');
    document.body.appendChild(cursor);

    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    });

    // Global Link Handler (Hides Status Bar URL)
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('custom-link')) {
            const url = e.target.dataset.link;
            const target = e.target.dataset.target || '_self';
            if (url) {
                window.open(url, target);
            }
        }
    });

    // Restore hover listeners
    document.querySelectorAll('a, button, .media-item, .custom-link').forEach(el => {
        el.addEventListener('mouseenter', () => cursor.classList.add('hovered'));
        el.addEventListener('mouseleave', () => cursor.classList.remove('hovered'));
    });

    console.log('Series-Style Wedding Page Screenplay Loaded');
});
