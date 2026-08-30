// shared.js — Nav, lang, scroll (imported by all portfolio-pro pages)
import './portfolio-pro.css';

export let lang = localStorage.getItem('pp-lang') || 'fr';

export const CAT_LABELS = {
  fr: { documentary:'Documentaire', corporate:'Corporate', restaurant:'Restaurant', real_estate:'Immobilier', non_profit:'Associations', event:'Événementiel', product:'Produit' },
  en: { documentary:'Documentary', corporate:'Corporate', restaurant:'Restaurant', real_estate:'Real Estate', non_profit:'Non-Profit', event:'Event', product:'Product' },
};

export function catLabel(key) { return CAT_LABELS[lang][key] || key; }

export function setupNav(onLangChange) {
  const navEl   = document.getElementById('nav');
  const langBtn = document.getElementById('lang-btn');
  const burger  = document.getElementById('burger');
  const mMenu   = document.getElementById('mobile-menu');

  window.addEventListener('scroll', () => {
    navEl?.classList.toggle('scrolled', window.scrollY > 60);
  }, { passive: true });

  burger?.addEventListener('click', () => {
    const isOpen = mMenu?.classList.toggle('open');
    burger?.classList.toggle('open', isOpen);
    document.body.style.overflow = isOpen ? 'hidden' : '';
  });
  mMenu?.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
    mMenu.classList.remove('open');
    burger?.classList.remove('open');
    document.body.style.overflow = '';
  }));

  if (langBtn) {
    langBtn.textContent = lang === 'fr' ? 'EN' : 'FR';
    langBtn.addEventListener('click', () => {
      lang = lang === 'fr' ? 'en' : 'fr';
      localStorage.setItem('pp-lang', lang);
      langBtn.textContent = lang === 'fr' ? 'EN' : 'FR';
      onLangChange?.();
    });
  }
}

export function setFooter() {
  const el = document.getElementById('footer-copy');
  if (el) el.textContent = lang === 'fr'
    ? '© 2025 Lucas Jacquot. Tous droits réservés.'
    : '© 2025 Lucas Jacquot. All rights reserved.';
}

export function observeReveal() {
  const obs = new IntersectionObserver((entries) => {
    entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); obs.unobserve(e.target); } });
  }, { threshold: 0.07 });
  document.querySelectorAll('.reveal').forEach(el => obs.observe(el));
}

export function buildCard(proj, linkBase = '/portfolio-freelance/project.html') {
  const hasSrc = proj.thumbnail;
  const card = document.createElement('article');
  card.className = `project-card${proj.featured ? ' is-featured' : ''}${!hasSrc ? ' card-placeholder' : ''}`;
  card.dataset.cat = proj.category;

  const imgWrap = document.createElement('div');
  imgWrap.className = 'project-card-img';
  if (hasSrc) {
    const img = document.createElement('img');
    img.src = proj.thumbnail; img.alt = proj.name; img.loading = 'lazy';
    imgWrap.appendChild(img);
  }

  const overlay = document.createElement('div');
  overlay.className = 'project-card-overlay';
  overlay.innerHTML = `<div class="project-card-info">
    <p class="project-card-cat">${catLabel(proj.category)}</p>
    <h3 class="project-card-name">${proj.name}</h3>
    ${proj.role ? `<p class="project-card-role">${proj.role}</p>` : ''}
  </div>`;

  card.appendChild(imgWrap);
  card.appendChild(overlay);
  card.addEventListener('click', () => { window.location.href = `${linkBase}?p=${proj.slug}`; });
  return card;
}
