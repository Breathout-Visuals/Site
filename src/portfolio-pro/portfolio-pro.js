import './portfolio-pro.css';
import { projects } from './data/projects.gen.js';

// ─── TRANSLATIONS ──────────────────────────────────────────────────
const T = {
  fr: {
    nav: { work: 'Projets', about: 'À propos', contact: 'Contact' },
    hero: 'Vidéaste · Photographe · Paris',
    lbl: { projets: 'Projets', services: 'Approche', about: 'À propos' },
    filter: { all: 'Tout', commercial: 'Commercial', short_film: 'Court-Métrage',
              music_video: 'Clip', documentary: 'Documentaire', social_media: 'Social',
              wedding: 'Mariage', photo: 'Photo', event: 'Événement', other: 'Autre' },
    about: {
      title: 'LUCAS\nJACQUOT',
      text: 'Vidéaste et photographe freelance basé à Paris. Je travaille sur des courts-métrages, clips musicaux, contenus publicitaires et productions digitales, toujours avec un œil porté sur la lumière, le rythme et la composition.',
      cta: 'Me contacter',
    },
    contact: 'Parlons de\nvotre projet.',
    services: [
      { num:'01', title:'Concept & Préparation', desc:'Chaque projet démarre par une phase de co-construction : comprendre vos objectifs, définir le ton, choisir les formats. Une pré-production solide est la clé d\'un tournage fluide et d\'un résultat précis.' },
      { num:'02', title:'Tournage', desc:'Que ce soit en plateau, en extérieur ou à l\'international, j\'apporte rigueur et adaptabilité sur chaque tournage. Chaque plan est pensé pour son impact visuel et narratif.' },
      { num:'03', title:'Post-production & Livraison', desc:'Montage, étalonnage, optimisation par format et plateforme. Vous recevez des contenus prêts à diffuser, cohérents avec votre identité visuelle.' },
    ],
    footer: '© 2025 Lucas Jacquot. Tous droits réservés.',
    empty: 'Ajoutez un dossier dans Portfolio-Pro-Content/ et relancez le script.',
  },
  en: {
    nav: { work: 'Work', about: 'About', contact: 'Contact' },
    hero: 'Filmmaker · Photographer · Paris',
    lbl: { projets: 'Work', services: 'Approach', about: 'About' },
    filter: { all: 'All', commercial: 'Commercial', short_film: 'Short Film',
              music_video: 'Music Video', documentary: 'Documentary', social_media: 'Social',
              wedding: 'Wedding', photo: 'Photo', event: 'Event', other: 'Other' },
    about: {
      title: 'LUCAS\nJACQUOT',
      text: 'Freelance filmmaker and photographer based in Paris. I work on short films, music videos, commercial content and digital productions, always focused on light, rhythm and composition.',
      cta: 'Get in touch',
    },
    contact: 'Let\'s talk\nabout your project.',
    services: [
      { num:'01', title:'Concept & Preparation', desc:'Every project starts with a co-creation phase: understanding your goals, defining the tone, choosing the formats. Solid pre-production is the key to a smooth shoot and a precise result.' },
      { num:'02', title:'Production', desc:'Whether on set, outdoors or internationally, I bring rigour and adaptability to every shoot. Every shot is designed for its visual and narrative impact.' },
      { num:'03', title:'Post-production & Delivery', desc:'Editing, colour grading, format optimisation per platform. You receive content ready to publish, consistent with your visual identity.' },
    ],
    footer: '© 2025 Lucas Jacquot. All rights reserved.',
    empty: 'Add a folder to Portfolio-Pro-Content/ and run the script.',
  },
};

// ─── STATE ─────────────────────────────────────────────────────────
let lang = localStorage.getItem('pp-lang') || 'fr';
let activeFilter = 'all';

// ─── DOM REFS ──────────────────────────────────────────────────────
const navEl       = document.getElementById('nav');
const langBtn     = document.getElementById('lang-btn');
const burger      = document.getElementById('burger');
const mobileMenu  = document.getElementById('mobile-menu');
const grid        = document.getElementById('projects-grid');
const filtersEl   = document.getElementById('filters');
const projCount   = document.getElementById('proj-count');
const emptyState  = document.getElementById('empty-state');
const heroBg      = document.getElementById('hero-bg');

// ─── NAV SCROLL ────────────────────────────────────────────────────
window.addEventListener('scroll', () => {
  navEl.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

// ─── BURGER ────────────────────────────────────────────────────────
burger?.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
});
mobileMenu?.querySelectorAll('a').forEach(a => {
  a.addEventListener('click', () => mobileMenu.classList.remove('open'));
});

// ─── LANGUAGE ──────────────────────────────────────────────────────
function applyLang() {
  const t = T[lang];
  langBtn.textContent = lang === 'fr' ? 'EN' : 'FR';

  // Nav
  document.getElementById('nav-work').textContent  = t.nav.work;
  document.getElementById('nav-about').textContent = t.nav.about;
  document.getElementById('nav-contact').textContent = t.nav.contact;
  const mw = document.getElementById('m-work');
  const ma = document.getElementById('m-about');
  const mc = document.getElementById('m-contact');
  if (mw) mw.textContent = t.nav.work;
  if (ma) ma.textContent = t.nav.about;
  if (mc) mc.textContent = t.nav.contact;

  // Hero
  document.getElementById('hero-label').textContent = t.hero;

  // Sections
  document.getElementById('lbl-projets').textContent  = t.lbl.projets;
  document.getElementById('lbl-services').textContent = t.lbl.services;
  document.getElementById('lbl-about').textContent    = t.lbl.about;

  // Services
  const items = document.querySelectorAll('.service-item');
  t.services.forEach((s, i) => {
    if (!items[i]) return;
    items[i].querySelector('.service-title').textContent = s.title;
    items[i].querySelector('.service-desc').textContent  = s.desc;
  });

  // About
  document.getElementById('about-title').innerHTML = t.about.title.replace('\n', '<br>');
  document.getElementById('about-text').textContent = t.about.text;
  document.getElementById('about-cta').textContent  = t.about.cta;

  // Contact
  document.getElementById('contact-cta').innerHTML = t.contact.replace('\n', '<br>');

  // Footer
  document.getElementById('footer-copy').textContent = t.footer;

  // Empty state
  if (emptyState) emptyState.textContent = t.empty;

  // Filters
  buildFilters();

  // Card descriptions (rebuild or update)
  rebuildGrid();
}

langBtn?.addEventListener('click', () => {
  lang = lang === 'fr' ? 'en' : 'fr';
  localStorage.setItem('pp-lang', lang);
  applyLang();
});

// ─── CATEGORY LABEL ────────────────────────────────────────────────
function catLabel(key) {
  return T[lang].filter[key] || key;
}

// ─── HERO BACKGROUND ───────────────────────────────────────────────
function setupHeroBg() {
  const featured = projects.find(p => p.featured && p.thumbnail);
  if (!featured || !heroBg) return;
  const img = document.createElement('img');
  img.src = featured.thumbnail;
  img.alt = '';
  img.loading = 'eager';
  heroBg.appendChild(img);
}

// ─── FILTERS ───────────────────────────────────────────────────────
function buildFilters() {
  if (!filtersEl) return;
  const cats = [...new Set(projects.map(p => p.category))];
  filtersEl.innerHTML = '';

  const all = document.createElement('button');
  all.className = `filter-btn ${activeFilter === 'all' ? 'active' : ''}`;
  all.dataset.filter = 'all';
  all.textContent = T[lang].filter.all;
  all.addEventListener('click', () => setFilter('all'));
  filtersEl.appendChild(all);

  cats.forEach(cat => {
    const btn = document.createElement('button');
    btn.className = `filter-btn ${activeFilter === cat ? 'active' : ''}`;
    btn.dataset.filter = cat;
    btn.textContent = catLabel(cat);
    btn.addEventListener('click', () => setFilter(cat));
    filtersEl.appendChild(btn);
  });
}

function setFilter(cat) {
  activeFilter = cat;
  buildFilters();
  filterGrid();
}

function filterGrid() {
  const cards = grid.querySelectorAll('.project-card');
  cards.forEach(card => {
    const show = activeFilter === 'all' || card.dataset.cat === activeFilter;
    card.classList.toggle('hidden', !show);
  });
  updateCount();
}

function updateCount() {
  const visible = grid.querySelectorAll('.project-card:not(.hidden)').length;
  if (projCount) projCount.textContent = `— ${visible}`;
}

// ─── PROJECT GRID ──────────────────────────────────────────────────
function buildCard(proj) {
  const card = document.createElement('article');
  card.className = `project-card reveal${proj.featured ? ' is-featured' : ''}`;
  card.dataset.cat = proj.category;

  const imgWrap = document.createElement('div');
  imgWrap.className = 'project-card-img';

  if (proj.thumbnail) {
    const img = document.createElement('img');
    img.src = proj.thumbnail;
    img.alt = proj.name;
    img.loading = 'lazy';
    imgWrap.appendChild(img);
  }

  const overlay = document.createElement('div');
  overlay.className = 'project-card-overlay';
  overlay.innerHTML = `
    <div class="project-card-info">
      <p class="project-card-cat">${catLabel(proj.category)}</p>
      <h3 class="project-card-name">${proj.name}</h3>
      ${proj.role ? `<p class="project-card-role">${proj.role}</p>` : ''}
    </div>`;

  card.appendChild(imgWrap);
  card.appendChild(overlay);

  card.addEventListener('click', () => {
    window.location.href = `/portfolio-pro/project.html?p=${proj.slug}`;
  });
  card.style.cursor = 'pointer';

  return card;
}

function rebuildGrid() {
  if (!grid) return;
  grid.innerHTML = '';

  if (projects.length === 0) {
    const empty = document.createElement('div');
    empty.className = 'projects-empty';
    empty.textContent = T[lang].empty;
    grid.appendChild(empty);
    if (projCount) projCount.textContent = '— 0';
    return;
  }

  projects.forEach(proj => {
    grid.appendChild(buildCard(proj));
  });

  filterGrid();
  observeReveal();
}

// ─── REVEAL OBSERVER ───────────────────────────────────────────────
function observeReveal() {
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        obs.unobserve(e.target);
      }
    });
  }, { threshold: 0.08 });

  document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
}

// ─── SMOOTH SCROLL ─────────────────────────────────────────────────
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    const id = a.getAttribute('href').slice(1);
    const target = document.getElementById(id);
    if (target) { e.preventDefault(); target.scrollIntoView({ behavior: 'smooth' }); }
  });
});

// ─── INIT ──────────────────────────────────────────────────────────
setupHeroBg();
applyLang();    // builds filters + grid + translations
observeReveal(); // for static reveal elements (services, about)
