// index.js — Homepage Portfolio Pro
import { setupNav, setFooter, buildCard, catLabel, lang as sharedLang } from './shared.js';
import { projects } from './data/projects.gen.js';

let lang = sharedLang;

const T = {
  fr: {
    label: 'Filmmaker · Photographer · French Riviera',
    selected: 'Sélection', linkAll: 'Voir tout →', heroCta: 'Voir les projets →',
    bigCta: 'Tous les projets',
    statProj: 'Projets', statSub1: 'réalisés',
    statCat: 'Catégories', statSub2: 'couvertes',
    statInter: '& International', statSub3: 'South Africa · CH · UAE',
    statSince: 'DÉBUT', statSub4: 'd\'activité',
    approach: 'Notre Approche',
    contact: 'Contact', contactCta: 'Parlons de\nvotre projet.',
    accItems: [
      { num: '01', title: 'Concept & Préparation', desc: 'Nous démarrons chaque projet par une phase de co-construction. Nous prenons le temps de comprendre vos objectifs, votre univers et vos contraintes pour définir ensemble le concept, le ton et les formats. Une pré-production solide est ce qui fait la différence entre un contenu esthétique… et un contenu efficace.' },
      { num: '02', title: 'Tournage & Direction', desc: 'En plateau, en extérieur ou à l\'international, nous apportons rigueur, réactivité et discrétion sur chaque tournage. Nous nous adaptons aux contraintes du lieu et du timing, tout en maintenant une exigence constante sur la qualité image. Chaque plan est pensé pour son impact visuel et narratif.' },
      { num: '03', title: 'Post-production & Livraison', desc: 'Nous déclinons les rendus selon les formats et les codes des plateformes ciblées. Étalonnage, montage, supervision sonore — tout est intégré pour garantir cohérence et qualité. Vous recevez des fichiers prêts à diffuser, sans friction.' },
      { num: '04', title: 'Photographie', desc: 'En complément de la vidéo, nous proposons une couverture photographique complète : portraits, backstage, reportage événementiel ou visuels produit. Le même soin — composition, lumière, étalonnage — pour une cohérence forte sur tous vos supports.' },
    ],
    footer: '© 2025 Lucas Jacquot. Tous droits réservés.',
  },
  en: {
    label: 'Filmmaker · Photographer · French Riviera',
    selected: 'Selection', linkAll: 'See all →', heroCta: 'View projects →',
    bigCta: 'All projects',
    statProj: 'Projects', statSub1: 'completed',
    statCat: 'Categories', statSub2: 'covered',
    statInter: '& International', statSub3: 'South Africa · CH · UAE',
    statSince: 'SINCE', statSub4: 'in business',
    approach: 'Our Approach',
    contact: 'Contact', contactCta: 'Let\'s talk\nabout your project.',
    accItems: [
      { num: '01', title: 'Concept & Preparation', desc: 'We start every project with a co-creation phase. We take time to understand your goals, universe and constraints to define the concept, tone and formats together. Solid pre-production is what makes the difference between visually pleasing content and content that truly works.' },
      { num: '02', title: 'Shooting & Direction', desc: 'On set, outdoors or internationally, we bring rigour, reactivity and discretion to every shoot. We adapt to location and timing constraints while maintaining constant image quality demands. Every shot is designed for its visual and narrative impact.' },
      { num: '03', title: 'Post-production & Delivery', desc: 'We adapt renders to formats and platform codes. Colour grading, editing, sound — all integrated to ensure consistency and quality. You receive files ready to publish, without friction.' },
      { num: '04', title: 'Photography', desc: 'Alongside video, we offer full photo coverage: portraits, backstage, event reporting or product visuals. The same care — composition, light, grading — for strong consistency across all your communication materials.' },
    ],
    footer: '© 2025 Lucas Jacquot. All rights reserved.',
  },
};

// ─── SCROLL ANIMATIONS ─────────────────────────────────────────────
function setupScrollEffects() {
  const heroBg      = document.getElementById('hero-bg');
  const heroContent = document.getElementById('hero-content');
  const heroSection = document.getElementById('hero');
  let ticking = false;

  window.addEventListener('scroll', () => {
    if (ticking) return;
    requestAnimationFrame(() => {
      const scrollY = window.scrollY;
      const vh = window.innerHeight;

      // Parallax hero bg (30% scroll rate)
      if (heroBg && scrollY < vh * 1.2) {
        heroBg.style.transform = `translateY(${scrollY * 0.28}px)`;
      }

      // Hero content fades out as you scroll
      if (heroContent && scrollY < vh) {
        const progress = scrollY / (vh * 0.65);
        heroContent.style.opacity = Math.max(0, 1 - progress);
        heroContent.style.transform = `translateY(${scrollY * 0.12}px)`;
      }

      ticking = false;
    });
    ticking = true;
  }, { passive: true });
}

// ─── COUNT-UP STATS ────────────────────────────────────────────────
function countUp(el, target, duration = 1400) {
  let startTime = null;
  const isNum = !isNaN(parseInt(target, 10));
  const numTarget = isNum ? parseInt(target, 10) : 0;
  
  if (!isNum) {
    el.textContent = target;
    return;
  }
  
  const step = (timestamp) => {
    if (!startTime) startTime = timestamp;
    const progress = Math.min((timestamp - startTime) / duration, 1);
    const eased = 1 - Math.pow(1 - progress, 4);
    
    el.textContent = Math.round(eased * numTarget);
    
    if (progress < 1) requestAnimationFrame(step);
    else el.textContent = target;
  };
  requestAnimationFrame(step);
}

function setupStatsObserver() {
  const stats = [
    document.getElementById('stat-n'),
    document.getElementById('stat-cat-n'),
    document.getElementById('stat-fr'),
    document.getElementById('stat-year')
  ];

  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        const el = e.target;
        const target = el.dataset.target;
        if (target) countUp(el, target);
        obs.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  stats.forEach(el => {
    if (!el) return;
    el.textContent = isNaN(parseInt(el.dataset.target, 10)) ? '--' : '0';
    obs.observe(el);
  });
}

function setupMobileMarquee() {
  if (window.innerWidth > 900) return;
  const section = document.querySelector('.stats-section');
  if (!section || section.dataset.cloned) return;
  const children = Array.from(section.children);
  children.forEach(c => {
    const clone = c.cloneNode(true);
    clone.querySelectorAll('[id]').forEach(el => el.removeAttribute('id'));
    clone.removeAttribute('id');
    clone.classList.add('clone-block');
    section.appendChild(clone);
  });
  section.dataset.cloned = 'true';
}

// ─── REVEAL OBSERVER ───────────────────────────────────────────────
function observeReveal() {
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } });
  }, { threshold: 0.06, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
}

// ─── ACCORDION ─────────────────────────────────────────────────────
function buildAccordion() {
  const t = T[lang];
  const container = document.getElementById('accordion');
  if (!container) return;
  container.innerHTML = '';

  t.accItems.forEach(item => {
    const div = document.createElement('div');
    div.className = 'acc-item';
    div.innerHTML = `
      <button class="acc-trigger" aria-expanded="false">
        <span class="acc-num">${item.num}</span>
        <span class="acc-title">${item.title}</span>
        <span class="acc-icon">+</span>
      </button>
      <div class="acc-body">
        <div class="acc-body-inner">
          <div class="acc-text"><p>${item.desc}</p></div>
          <div class="acc-video">
            <video src="https://assets.mixkit.co/videos/preview/mixkit-set-of-plateaus-seen-from-the-sky-in-a-sunny-day-51197-large.mp4" autoplay loop muted playsinline></video>
          </div>
        </div>
      </div>`;
    container.appendChild(div);

    const trigger = div.querySelector('.acc-trigger');
    const body    = div.querySelector('.acc-body');
    trigger.addEventListener('click', () => {
      const isOpen = trigger.getAttribute('aria-expanded') === 'true';
      container.querySelectorAll('.acc-trigger').forEach(t => t.setAttribute('aria-expanded', 'false'));
      container.querySelectorAll('.acc-body').forEach(b => b.classList.remove('open'));
      if (!isOpen) { 
        trigger.setAttribute('aria-expanded', 'true'); 
        body.classList.add('open'); 
      }
    });
  });
}

// ─── FEATURED GRID ─────────────────────────────────────────────────
function buildFeaturedGrid() {
  const grid = document.getElementById('featured-grid');
  if (!grid) return;
  grid.innerHTML = '';
  const featured = projects.filter(p => p.featured).slice(0, 3);
  const toShow = featured.length ? featured : projects.slice(0, 3);

  toShow.forEach((proj, i) => {
    const hasSrc = proj.thumbnail;
    const card = document.createElement('div');
    card.className = `featured-card reveal reveal-delay-${i}${!hasSrc ? ' card-placeholder' : ''}`;

    const imgWrap = document.createElement('div');
    imgWrap.className = 'featured-card-img';
    if (hasSrc) {
      const img = document.createElement('img');
      img.src = proj.thumbnail; img.alt = proj.name;
      img.loading = i === 0 ? 'eager' : 'lazy';
      imgWrap.appendChild(img);
    }

    const overlay = document.createElement('div');
    overlay.className = 'featured-card-overlay';
    overlay.innerHTML = `<div class="featured-card-info">
      <p class="featured-card-cat">${catLabel(proj.category)}</p>
      <p class="featured-card-name">${proj.name}</p>
      ${proj.role ? `<p class="featured-card-role">${proj.role}</p>` : ''}
    </div>`;

    card.appendChild(imgWrap);
    card.appendChild(overlay);
    card.addEventListener('click', () => { window.location.href = `/portfolio-freelance/project.html?p=${proj.slug}`; });
    grid.appendChild(card);
  });
}

// ─── HERO BG ───────────────────────────────────────────────────────
function setupHeroBg() {
  const heroBg = document.getElementById('hero-bg');
  if (!heroBg) return;
  const featured = projects.find(p => p.featured && p.thumbnail) || projects.find(p => p.thumbnail);
  if (featured) {
    heroBg.innerHTML = '';
    const img = document.createElement('img');
    img.src = featured.thumbnail; img.alt = ''; img.loading = 'eager';
    heroBg.appendChild(img);
  }
}

// ─── RENDER ────────────────────────────────────────────────────────
function render() {
  const t = T[lang];
  setFooter();

  const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
  const setHtml = (id, val) => { const el = document.getElementById(id); if (el) el.innerHTML = val; };

  // Hero
  set('hero-label', t.label);
  set('hero-cta', t.heroCta);

  // Section labels
  set('lbl-selected', t.selected);
  set('link-all', t.linkAll);
  set('lbl-approach', t.approach);
  set('lbl-contact', t.contact);
  set('big-cta-text', t.bigCta);

  // Stats
  const statEl = document.getElementById('stat-n');
  // if (statEl) statEl.textContent = projects.length; // Removing this to allow animation to work properly
  set('stat-proj', t.statProj);   set('stat-sub1', t.statSub1);
  set('stat-cat', t.statCat);     set('stat-sub2', t.statSub2);
  set('stat-inter', t.statInter); set('stat-sub3', t.statSub3);
  set('stat-since', t.statSince); set('stat-sub4', t.statSub4);

  // Contact footer
  setHtml('contact-cta', t.contactCta.replace('\n', '<br>'));

  buildAccordion();
}

// ─── INIT ──────────────────────────────────────────────────────────
setupHeroBg();
setupScrollEffects();
setupStatsObserver();
setupMobileMarquee();

setupNav(() => {
  lang = localStorage.getItem('pp-lang') || 'fr';
  render();
  buildFeaturedGrid();
  observeReveal();
});

render();
buildFeaturedGrid();
observeReveal();
