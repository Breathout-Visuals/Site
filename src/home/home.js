import './home.css';

// Custom Cursor
const cursor = document.createElement('div');
cursor.classList.add('custom-cursor');
document.body.appendChild(cursor);
// Safe Activation
document.body.classList.add('custom-cursor-active');

document.addEventListener('mousemove', (e) => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
});

// Link Handler (Hides URL)
document.addEventListener('click', (e) => {
    // Traverse up in case click is on child (like img inside span)
    const target = e.target.closest('.custom-link');
    if (target) {
        const url = target.dataset.href;
        const openTarget = target.dataset.target || '_self';
        if (url) {
            window.open(url, openTarget);
        }
    }
});

// Restore hover listeners
document.querySelectorAll('a, button, .custom-link').forEach(el => {
    el.addEventListener('mouseenter', () => cursor.classList.add('hovered'));
    el.addEventListener('mouseleave', () => cursor.classList.remove('hovered'));
});

document.addEventListener('DOMContentLoaded', () => {

    // Simple staggering animation on load
    // Simple staggering animation on load
    const mainTitle = document.getElementById('main-title');
    const subtitle = document.getElementById('subtitle');
    const nav = document.getElementById('nav-choice');
    const agency = document.getElementById('agency-link');

    // Initial Reveal
    setTimeout(() => {
        if (mainTitle) mainTitle.classList.add('reveal-active');
    }, 200);

    setTimeout(() => {
        subtitle.classList.add('reveal-active');
    }, 600);

    setTimeout(() => {
        nav.classList.add('reveal-active');
    }, 1000);

    setTimeout(() => {
        agency.classList.add('reveal-active');
    }, 1300);
});

console.log('General Site (Home) Loaded');
