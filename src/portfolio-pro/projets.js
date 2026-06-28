// projets.js — Projects grid page
import { setupNav, setFooter, buildCard, catLabel, lang as initLang } from './shared.js';
import { projects } from './data/projects.gen.js';

let lang = initLang;
let activeFilter = 'all';

const T = {
  fr: { all:'Tout', empty:'Ajoutez des projets dans Portfolio-Pro-Content/', phTitle:'Projets', countSuffix:'réalisations publiques' },
  en: { all:'All',  empty:'Add projects to Portfolio-Pro-Content/', phTitle:'Projects', countSuffix:'public works' },
};

const excludedCats = ['film', 'films', 'clip', 'clips', 'short_film', 'music_video'];
const digitalProjects = projects.filter(p => !excludedCats.includes((p.category || '').toLowerCase()));

function buildFilters() {
  const filtersEl = document.getElementById('filters');
  if (!filtersEl) return;
  const cats = [...new Set(digitalProjects.map(p => p.category))];
  filtersEl.innerHTML = '';

  const allBtn = document.createElement('button');
  allBtn.className = `filter-btn${activeFilter === 'all' ? ' active' : ''}`;
  allBtn.textContent = T[lang].all;
  allBtn.addEventListener('click', () => { activeFilter = 'all'; buildFilters(); filterCards(); });
  filtersEl.appendChild(allBtn);

  cats.forEach(cat => {
    const btn = document.createElement('button');
    btn.className = `filter-btn${activeFilter === cat ? ' active' : ''}`;
    btn.textContent = catLabel(cat);
    btn.addEventListener('click', () => { activeFilter = cat; buildFilters(); filterCards(); });
    filtersEl.appendChild(btn);
  });
}

function filterCards() {
  const cards = document.querySelectorAll('#projects-grid .project-card');
  let visible = 0;
  cards.forEach(card => {
    const show = activeFilter === 'all' || card.dataset.cat === activeFilter;
    card.classList.toggle('hidden', !show);
    if (show) visible++;
  });
  const count = document.getElementById('proj-count');
  if (count) count.textContent = `— ${visible} ${T[lang].countSuffix}`;
}

function buildGrid() {
  const grid = document.getElementById('projects-grid');
  if (!grid) return;
  grid.innerHTML = '';

  if (!digitalProjects.length) {
    const empty = document.createElement('div');
    empty.className = 'projects-empty';
    empty.textContent = T[lang].empty;
    grid.appendChild(empty);
    return;
  }

  digitalProjects.forEach(proj => grid.appendChild(buildCard(proj)));
  filterCards();
}

function render() {
  setFooter();
  const phTitle = document.getElementById('ph-title');
  if (phTitle) phTitle.textContent = T[lang].phTitle;
  buildFilters();
  buildGrid();
}

setupNav(() => { lang = localStorage.getItem('pp-lang') || 'fr'; render(); });
render();
