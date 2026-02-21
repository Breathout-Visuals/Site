// --- ABOUT SECTION ANIMATION LOGIC (Refined V5) ---
// This script handles the specific scroll-driven animation for the About section.
// It is designed to be modular and easily integrated into the main portfolio.

document.addEventListener('DOMContentLoaded', () => {

    // --- SETUP ELEMENTS ---
    const track = document.querySelector('.about-scroll-track');
    // If track doesn't exist, exit safely
    if (!track) return;

    // TARGETS
    // Note: ensure these classes exist in your HTML structure
    const revealTexts = document.querySelectorAll('.scroll-reveal-text, .scroll-reveal-block');
    const textGroup = document.querySelector('.about-text-group');
    const actionGroup = document.querySelector('.about-actions');

    const cardAnimContainer = document.querySelector('.about-card-overlay-anim');
    const cardInner = document.querySelector('.card-anim-inner');

    // --- SCROLL HANDLER ---
    const onScroll = () => {
        const rect = track.getBoundingClientRect();
        const viewHeight = window.innerHeight;
        const trackHeight = rect.height;

        // "scrolled" relative to the top of the track
        let scrolled = -rect.top;
        if (scrolled < 0) scrolled = 0;

        const totalDistance = trackHeight - viewHeight;

        let progress = 0;
        if (totalDistance > 0) {
            progress = scrolled / totalDistance;
        }
        progress = Math.min(Math.max(progress, 0), 1);

        // --- PHASE 1: TEXT REVEAL (0% to 45%) ---
        const textPhaseEnd = 0.45;

        revealTexts.forEach((el, index) => {
            const step = textPhaseEnd / revealTexts.length;
            const triggerStart = step * index;
            const triggerEnd = triggerStart + 0.15;

            let localP = (progress - triggerStart) / (triggerEnd - triggerStart);
            localP = Math.min(Math.max(localP, 0), 1);

            // Apply Reveal Styles
            el.style.opacity = localP;
            el.style.transform = `translateY(${30 * (1 - localP)}px)`;

            // Phase 1 Blur (Reveal only)
            if (progress < textPhaseEnd + 0.1 && localP < 1) {
                el.style.filter = `blur(${10 * (1 - localP)}px)`;
            } else {
                el.style.filter = 'none';
            }
        });

        // --- PHASE 2: CARD ENTRANCE & TEXT BLUR (55% to 100%) ---
        const cardStart = 0.55;
        const cardEnd = 1.0;

        let cardP = (progress - cardStart) / (cardEnd - cardStart);
        cardP = Math.min(Math.max(cardP, 0), 1);

        if (cardAnimContainer) {
            // Start DEEP left (-250%)
            const startX = -250;
            const endX = -50; // Center

            // Current X Position
            const currentX = startX + ((endX - startX) * cardP);
            // Rotation (-15deg to 0deg)
            const currentRot = -15 * (1 - cardP);

            if (cardP > 0) {
                cardAnimContainer.style.opacity = 1;
                // V4 Change: Lowered Y position by 5rem
                cardAnimContainer.style.transform = `translate(${currentX}%, calc(-50% + 5rem))`;

                cardInner.style.transform = `rotate(${currentRot}deg)`;
                cardInner.style.opacity = 1;

                // --- V5 CHANGE: DELAYED BLUR ---
                // Wait until card has traveled 30% of its path before blurring text
                // ensuring blur matches visual arrival of card
                const blurStartOffset = 0.3;
                let blurP = (cardP - blurStartOffset) / (1 - blurStartOffset);
                blurP = Math.max(blurP, 0);

                if (textGroup) {
                    const blurAmount = blurP * 15;
                    textGroup.style.filter = `blur(${blurAmount}px)`;
                    textGroup.style.opacity = 1 - (blurP * 0.5);
                }
            } else {
                cardAnimContainer.style.opacity = 0;
                if (textGroup) {
                    textGroup.style.filter = 'none';
                    textGroup.style.opacity = 1;
                }
            }
        }

        // --- PHASE 3: ACTION BUTTON REVEAL (Sync Finish with Card) ---
        if (actionGroup) {
            const actionStart = 0.8;
            const actionEnd = 1.0;

            let actionP = (progress - actionStart) / (actionEnd - actionStart);
            actionP = Math.min(Math.max(actionP, 0), 1);

            actionGroup.style.opacity = actionP;
            actionGroup.style.transform = `translateY(${30 * (1 - actionP)}px)`;
        }
    };

    window.addEventListener('scroll', onScroll, { passive: true });
    // Initial Tick
    onScroll();
});

// Clean up listener when not needed if module is HMR replaced (Optional)
// if (import.meta.hot) { ... }
