// contact.js — Contact + Bio page
import { setupNav, setFooter, lang as initLang } from './shared.js';

let lang = initLang;

const T = {
  fr: {
    bioTag: 'Filmmaker · Photographer',
    bioRole: 'French Riviera & Paris',
    skills: ['Réalisation', 'Direction Photo', 'Montage', 'Étalonnage', 'Photographie'],
    bioDesc1: 'Vidéaste et photographe freelance passionné par l\'image, je mets mon œil et mes compétences techniques au service de vos histoires. Formé en école de cinéma, j\'ai développé une approche rigoureuse de la narration visuelle — du développement d\'un concept à la livraison finale.',
    bioDesc2: 'Mon terrain de jeu : clips musicaux, publicités, courts-métrages, contenus digitaux et couvertures événementielles. Je travaille en France et à l\'international, avec la même exigence quel que soit le format ou le budget.',
    bioAvail: 'Disponible pour de nouvelles collaborations',
    cpLabel: 'Me contacter',
    cpSubtitle: 'Parlons de votre projet.',
    emailLbl: 'Email', telLbl: 'Téléphone',
    based: 'Basé à Nice · Paris · Disponible partout',
  },
  en: {
    bioTag: 'Filmmaker · Photographer',
    bioRole: 'French Riviera & Paris',
    skills: ['Directing', 'Cinematography', 'Editing', 'Colour Grading', 'Photography'],
    bioDesc1: 'Freelance filmmaker and photographer, I put my eye and technical skills at the service of your stories. Trained in film school, I have developed a rigorous approach to visual storytelling — from concept development to final delivery.',
    bioDesc2: 'My playground: music videos, commercials, short films, digital content and event coverage. I work in France and internationally, with the same level of demand regardless of format or budget.',
    bioAvail: 'Available for new projects',
    cpLabel: 'Get in touch',
    cpSubtitle: 'Let\'s talk about your project.',
    emailLbl: 'Email', telLbl: 'Phone',
    based: 'Based in Nice · Paris · Available everywhere',
  },
};

function render() {
  setFooter();
  const t = T[lang];

  const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
  const setHtml = (id, val) => { const el = document.getElementById(id); if (el) el.innerHTML = val; };

  set('bio-tag', t.bioTag);
  set('bio-role', t.bioRole);
  set('bio-avail-txt', t.bioAvail);
  set('bio-desc-1', t.bioDesc1);
  set('bio-desc-2', t.bioDesc2);
  set('cp-label', t.cpLabel);
  set('cp-subtitle', t.cpSubtitle);
  set('ci-email-lbl', t.emailLbl);
  set('ci-tel-lbl', t.telLbl);
  set('cp-based', t.based);

  const skillIds = ['bs-1','bs-2','bs-3','bs-4','bs-5'];
  t.skills.forEach((skill, i) => set(skillIds[i], skill));
}

setupNav(() => { lang = localStorage.getItem('pp-lang') || 'fr'; render(); });
render();
