// approche.js — Approach page with accordion
import { setupNav, setFooter, lang as initLang } from './shared.js';

let lang = initLang;

const T = {
  fr: {
    phSub: 'Ma façon de travailler', lbl: 'Processus',
    items: [
      { num:'01', title:'Concept & Préparation', desc:'Chaque projet démarre par une phase de co-construction. Je prends le temps de comprendre vos objectifs, votre univers et vos contraintes pour définir ensemble le concept, le ton, les formats et le rythme. Une pré-production solide permet d\'anticiper les imprévus, d\'optimiser le temps de tournage et d\'assurer une vision claire dès le départ. C\'est ce travail en amont qui fait la différence entre un contenu esthétique… et un contenu efficace.' },
      { num:'02', title:'Tournage & Direction', desc:'Que ce soit en plateau, en extérieur ou à l\'international, j\'apporte rigueur, réactivité et discrétion sur chaque tournage. Je m\'adapte aux contraintes du lieu, du timing et des talents, tout en maintenant une exigence constante sur la qualité image. Chaque plan est pensé pour maximiser l\'impact visuel et narratif, dans le respect de la vision initiale.' },
      { num:'03', title:'Post-production & Livraison', desc:'Un contenu n\'est jamais terminé sans une livraison pensée pour l\'usage réel. Je décline les rendus selon les formats, les durées et les codes des plateformes ciblées. L\'étalonnage, le montage et la supervision sonore sont intégrés au processus pour garantir cohérence et qualité. Vous recevez des fichiers prêts à diffuser, sans friction.' },
      { num:'04', title:'Photographie', desc:'En complément de la vidéo, je propose une couverture photographique de vos projets : portraits, backstage, reportage événementiel ou visuels produit. Les images sont traitées avec le même soin — composition, lumière, étalonnage — pour une cohérence forte entre tous vos supports.' },
    ],
    ctaTxt: 'Un projet en tête ?', ctaBtn: 'Me contacter →',
  },
  en: {
    phSub: 'How I work', lbl: 'Process',
    items: [
      { num:'01', title:'Concept & Preparation', desc:'Every project starts with a co-creation phase. I take time to understand your goals, your universe and constraints to define together the concept, tone, formats and rhythm. Solid pre-production means fewer surprises, an optimised shoot and a clear vision from day one. This upstream work is what separates visually pleasing content from content that actually works.' },
      { num:'02', title:'Shooting & Direction', desc:'Whether on set, outdoors or internationally, I bring rigour, reactivity and discretion to every shoot. I adapt to the constraints of location, timing and talent, while maintaining constant demands on image quality. Every shot is designed to maximise visual and narrative impact within the initial vision.' },
      { num:'03', title:'Post-production & Delivery', desc:'Content is never finished without a delivery designed for real-world use. I adapt renders to formats, durations and platform codes. Colour grading, editing and sound supervision are integrated into the process. You receive files ready to publish, without friction or quality loss.' },
      { num:'04', title:'Photography', desc:'Alongside video, I offer photo coverage for your projects: portraits, backstage, event reporting or product visuals. Images are treated with the same care — composition, light, grading — to ensure strong consistency across all your communication materials.' },
    ],
    ctaTxt: 'A project in mind?', ctaBtn: 'Get in touch →',
  },
};

function render() {
  setFooter();
  const t = T[lang];

  const phSub = document.getElementById('ph-sub');
  if (phSub) phSub.textContent = t.phSub;
  const lblApp = document.getElementById('lbl-approche');
  if (lblApp) lblApp.textContent = t.lbl;

  // Accordion content
  const accordion = document.getElementById('accordion');
  if (accordion) {
    accordion.innerHTML = '';
    t.items.forEach(item => {
      const div = document.createElement('div');
      div.className = 'acc-item';
      div.innerHTML = `
        <button class="acc-trigger" aria-expanded="false">
          <span class="acc-num">${item.num}</span>
          <span class="acc-title">${item.title}</span>
          <span class="acc-icon">+</span>
        </button>
        <div class="acc-body">
          <div class="acc-body-inner"><p>${item.desc}</p></div>
        </div>`;
      accordion.appendChild(div);

      const trigger = div.querySelector('.acc-trigger');
      const body    = div.querySelector('.acc-body');
      trigger.addEventListener('click', () => {
        const isOpen = trigger.getAttribute('aria-expanded') === 'true';
        // Close all
        accordion.querySelectorAll('.acc-trigger').forEach(t => t.setAttribute('aria-expanded', 'false'));
        accordion.querySelectorAll('.acc-body').forEach(b => b.classList.remove('open'));
        // Toggle current
        if (!isOpen) {
          trigger.setAttribute('aria-expanded', 'true');
          body.classList.add('open');
        }
      });
    });
  }

  const ctaTxt = document.getElementById('approche-cta-txt');
  const ctaBtn = document.getElementById('approche-cta-btn');
  if (ctaTxt) ctaTxt.textContent = t.ctaTxt;
  if (ctaBtn) ctaBtn.textContent = t.ctaBtn;
}

setupNav(() => { lang = localStorage.getItem('pp-lang') || 'fr'; render(); });
render();
