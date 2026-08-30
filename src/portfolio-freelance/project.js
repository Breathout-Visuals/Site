import { setupNav, setFooter, lang as initLang } from './shared.js';
import { getProjectBySlug, projects } from './data/projects.gen.js';

// ─── TRANSLATIONS ──────────────────────────────────────────────────
const T = {
  fr: {
    nav: { work: 'Projets', about: 'À propos', contact: 'Contact' },
    labels: { cat: 'Catégorie', client: 'Client', date: 'Date', next: 'Projet suivant', view: '▶ Voir le projet' },
    cat: { commercial: 'Commercial', short_film: 'Court-Métrage', music_video: 'Clip Musical',
           documentary: 'Documentaire', social_media: 'Social Media', wedding: 'Mariage',
           photo: 'Photo', event: 'Événement', other: 'Autre' },
    notfound: 'Projet introuvable.',
    footer: '© 2025 Lucas Jacquot. Tous droits réservés.',
  },
  en: {
    nav: { work: 'Work', about: 'About', contact: 'Contact' },
    labels: { cat: 'Category', client: 'Client', date: 'Date', next: 'Next project', view: '▶ View project' },
    cat: { commercial: 'Commercial', short_film: 'Short Film', music_video: 'Music Video',
           documentary: 'Documentary', social_media: 'Social Media', wedding: 'Wedding',
           photo: 'Photo', event: 'Event', other: 'Other' },
    notfound: 'Project not found.',
    footer: '© 2025 Lucas Jacquot. All rights reserved.',
  },
};

// ─── STATE ─────────────────────────────────────────────────────────
let lang = initLang;

// ─── HELPERS ───────────────────────────────────────────────────────
function getSlug() {
  return new URLSearchParams(location.search).get('p') || '';
}

function catLabel(key) {
  return T[lang].cat[key] || key;
}

function getYouTubeId(url) {
  const m = url.match(/(?:youtu\.be\/|youtube\.com\/(?:watch\?v=|embed\/|v\/))([^&\n?#]+)/);
  return m ? m[1] : null;
}

function getVimeoId(url) {
  const m = url.match(/vimeo\.com\/(\d+)/);
  return m ? m[1] : null;
}

// ─── NAV ───────────────────────────────────────────────────────────
const navEl    = document.getElementById('nav');
const langBtn  = document.getElementById('lang-btn');
const burger   = document.getElementById('burger');
const mMenu    = document.getElementById('mobile-menu');

window.addEventListener('scroll', () => {
  navEl?.classList.toggle('scrolled', window.scrollY > 60);
}, { passive: true });

burger?.addEventListener('click', () => mMenu?.classList.toggle('open'));
mMenu?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => mMenu.classList.remove('open')));

langBtn?.addEventListener('click', () => {
  lang = lang === 'fr' ? 'en' : 'fr';
  localStorage.setItem('pp-lang', lang);
  renderPage();
});

// ─── RENDER ────────────────────────────────────────────────────────
function renderPage() {
  const slug = getSlug();
  const proj = getProjectBySlug(slug);
  const t = T[lang];

  langBtn.textContent = lang === 'fr' ? 'EN' : 'FR';
  document.getElementById('nav-work').textContent    = t.nav.work;
  document.getElementById('nav-about').textContent   = t.nav.about;
  document.getElementById('nav-contact').textContent = t.nav.contact;
  document.getElementById('footer-copy').textContent = t.footer;

  // Labels
  document.getElementById('lbl-cat').textContent    = t.labels.cat;
  document.getElementById('lbl-client').textContent = t.labels.client;
  document.getElementById('lbl-date').textContent   = t.labels.date;
  document.getElementById('lbl-next').textContent   = t.labels.next;

  if (!proj) {
    document.getElementById('proj-title').textContent = t.notfound;
    document.title = 'Projet | Lucas Jacquot';
    return;
  }

  // Page title
  document.title = `${proj.name} | Lucas Jacquot`;

  // Hero
  const heroEl = document.getElementById('proj-hero');
  if (heroEl && (proj.hero || proj.thumbnail)) {
    heroEl.innerHTML = '';
    const img = document.createElement('img');
    img.src = proj.hero || proj.thumbnail;
    img.alt = proj.name;
    img.loading = 'eager';
    heroEl.appendChild(img);
  }

  // Info bar
  document.getElementById('info-cat').textContent    = catLabel(proj.category);
  document.getElementById('info-client').textContent = proj.client || proj.name;
  document.getElementById('info-date').textContent   = proj.date   || '—';

  // Body text
  document.getElementById('proj-title').textContent     = proj.name;
  document.getElementById('proj-client-sub').textContent = proj.client ? proj.client : '';
  document.getElementById('proj-desc').textContent =
    (lang === 'fr' ? proj.descFr : proj.descEn) || '—';

  // Credits
  const creditsEl = document.getElementById('proj-credits');
  if (creditsEl) {
    creditsEl.innerHTML = '';
    if (proj.structuredCredits && proj.structuredCredits.length > 0) {
      proj.structuredCredits.forEach(credit => {
        const row = document.createElement('div');
        row.className = 'proj-credit-row';
        row.innerHTML = `<span class="proj-credit-role">${credit.originalRole} :</span> <span class="proj-credit-names">${credit.names.join(', ')}</span>`;
        creditsEl.appendChild(row);
      });
    }
  }

  // External link button (Instagram / non-embeddable)
  const videoLinkEl = document.getElementById('proj-video-link');
  const embedEl     = document.getElementById('proj-video-embed');

  if (proj.video) {
    const ytId    = getYouTubeId(proj.video);
    const vimeoId = getVimeoId(proj.video);

    if (ytId) {
      embedEl.classList.remove('hidden-initially');
      embedEl.innerHTML = `<iframe src="https://www.youtube.com/embed/${ytId}?rel=0&color=white&modestbranding=1"
        allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture"
        allowfullscreen title="${proj.name}"></iframe>`;
    } else if (vimeoId) {
      embedEl.classList.remove('hidden-initially');
      embedEl.innerHTML = `<iframe src="https://player.vimeo.com/video/${vimeoId}?color=ffffff&title=0&byline=0&portrait=0"
        allow="autoplay; fullscreen; picture-in-picture"
        allowfullscreen title="${proj.name}"></iframe>`;
    } else {
      // Instagram or other external link → button only
      videoLinkEl.href = proj.video;
      videoLinkEl.textContent = t.labels.view;
      videoLinkEl.classList.remove('hidden-initially');
    }
  }

  // Gallery
  const galleryEl = document.getElementById('proj-gallery');
  galleryEl.innerHTML = '';
  (proj.gallery || []).forEach(item => {
    const wrap = document.createElement('div');
    wrap.className = 'proj-gallery-item';

    if (item.type === 'video') {
      const vid = document.createElement('video');
      vid.src = item.src;
      if (item.poster && item.poster !== 'null') vid.poster = item.poster;
      vid.controls = true;
      vid.preload = 'metadata';
      vid.loading = 'lazy';
      wrap.appendChild(vid);
    } else {
      const img = document.createElement('img');
      img.src = item.src;
      img.alt = proj.name;
      img.loading = 'lazy';
      wrap.appendChild(img);
    }

    galleryEl.appendChild(wrap);
  });

  // Next project (Random)
  const nextEl = document.getElementById('proj-next');
  if (nextEl) {
    const otherProjects = projects.filter(p => p.slug !== proj.slug);
    if (otherProjects.length > 0) {
      const randomProj = otherProjects[Math.floor(Math.random() * otherProjects.length)];
      nextEl.removeAttribute('href');
      nextEl.onclick = () => window.location.href = `/portfolio-freelance/project.html?p=${randomProj.slug}`;
      document.getElementById('next-name').textContent = randomProj.name || '—';
      
      const nextInfos = [
        randomProj.client ? randomProj.client : null,
        catLabel(randomProj.category),
        randomProj.date
      ].filter(Boolean).join(' • ');
      
      document.getElementById('next-infos').textContent = nextInfos;
    } else {
      nextEl.style.display = 'none';
    }
  }
}

// ─── INIT ──────────────────────────────────────────────────────────
renderPage();
