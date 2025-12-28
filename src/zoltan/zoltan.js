import './zoltan.css';

document.addEventListener("DOMContentLoaded", () => {

    /* -------------------- Scroll Animations -------------------- */
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15 // Trigger when 15% visible
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal');
                // Optional: stop observing once revealed
                // observer.unobserve(entry.target); 
            }
        });
    }, observerOptions);

    // Targets
    const revealElements = document.querySelectorAll('.card, .about-photo, .about-text');
    revealElements.forEach(el => observer.observe(el));


    /* -------------------- Language Switcher -------------------- */
    const langBtn = document.getElementById("lang-toggle");
    let currentLang = localStorage.getItem("zoltan-lang") || "fr";

    function applyLanguage(lang) {
        document.querySelectorAll("[data-fr][data-en]").forEach(el => {
            el.textContent = lang === "fr" ? el.dataset.fr : el.dataset.en;
        });

        document.querySelectorAll("[data-lang]").forEach(el => {
            if (el.dataset.lang === lang) {
                // Determine display type based on tag
                if (el.tagName === 'SPAN') {
                    el.style.display = 'inline';
                } else {
                    el.style.display = 'block';
                }
            } else {
                el.style.display = 'none';
            }
        });

        langBtn.textContent = lang === "fr" ? "EN" : "FR";
        document.documentElement.lang = lang;
    }

    applyLanguage(currentLang);

    langBtn.addEventListener("click", () => {
        currentLang = currentLang === "fr" ? "en" : "fr";
        localStorage.setItem("zoltan-lang", currentLang);
        applyLanguage(currentLang);
    });


    /* -------------------- Mobile Menu -------------------- */
    const burger = document.querySelector(".burger");
    const mobileMenu = document.querySelector(".mobile-menu");
    const mobileLinks = mobileMenu.querySelectorAll('a');

    function toggleMenu() {
        burger.classList.toggle("active");
        mobileMenu.classList.toggle("open");
    }

    burger.addEventListener("click", toggleMenu);

    mobileLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (mobileMenu.classList.contains('open')) {
                toggleMenu();
            }
        });
    });


    /* -------------------- Navbar Scroll Effect -------------------- */
    let lastScroll = 0;
    const navbar = document.querySelector('.navbar');

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;

        // Background darken
        if (currentScroll > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Hide/Show
        if (currentScroll <= 0) {
            navbar.classList.remove('nav-hidden');
            return;
        }

        if (currentScroll > lastScroll && !navbar.classList.contains('nav-hidden')) {
            navbar.classList.add('nav-hidden');
        } else if (currentScroll < lastScroll && navbar.classList.contains('nav-hidden')) {
            navbar.classList.remove('nav-hidden');
        }

        lastScroll = currentScroll;
    });
    /* -------------------- Smooth Scroll (No Hash) -------------------- */
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            const targetElement = document.getElementById(targetId);

            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth'
                });
            }
        });
    });

    /* -------------------- Page Transition Logic -------------------- */
    // Create loader if not exists (it won't exist in HTML by default unless added)
    // We add it via JS to ensure it only appears if JS is running
    let loader = document.getElementById('page-transition-loader');
    if (!loader) {
        loader = document.createElement('div');
        loader.id = 'page-transition-loader';
        // loader.classList.add('active'); // Start INACTIVE (invisible)
        loader.innerHTML = '<img src="/assets/logo-white.png" alt="Breathout">';
        document.body.appendChild(loader);
    }

    // No timeout needed to remove active, since it starts inactive.

    // Fade in on internal link click
    document.addEventListener('click', (e) => {
        const link = e.target.closest('a');
        if (!link) return;

        const href = link.getAttribute('href');
        const target = link.getAttribute('target');

        // Check if internal link and not strict anchor/empty
        if (href &&
            (href.startsWith('/') || href.startsWith(window.location.origin) || href.startsWith('./') || href.startsWith('../')) &&
            href !== '#' &&
            !href.startsWith('#') &&
            target !== '_blank' &&
            !e.ctrlKey && !e.metaKey) {

            e.preventDefault();

            // Show loader
            if (loader) loader.classList.add('active');

            // Wait then navigate
            setTimeout(() => {
                window.location.href = href;
            }, 600); // slightly longer than CSS transition (0.5s)
        }
    });

    console.log("Zoltan Portfolio Loaded");
});
