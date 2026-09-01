

  import { LIBRARY } from '/src/portfolio-cinema/library.js';

  import { projects } from '/src/portfolio-cinema/project-data.js';

  window.populateTestModal = function(projectId) {
          const testProj = projects.find(p => p.id == projectId) || projects[0];
          
          let testProjectFiles = [];
          if (testProj && testProj.collection) {
              testProjectFiles = testProj.collection.map((col, index) => {
                  const char = String.fromCharCode(65 + index);
                  const ext = col.type === 'video' ? 'mp4' : 'jpg';
                  const folder = testProj.folderPath || '';
                  // Use Vite's resolved static import for Final Cut
                  // But for BTS we have to guess the path.
                  const btsPath = `/portfolio-cinema-content/Projets/${folder}/${char}.${ext}`;
                  return {
                      type: col.type,
                      main: col.src,
                      bts: btsPath
                  };
              });
          }

          const data = {
              title: testProj.title,
              descEn: testProj.desc.en,
              descFr: testProj.desc.fr,
              roles: testProj.structuredCredits.map(c => c.originalRole),
              camera: testProj.camera,
              lens: testProj.lens,
              format: testProj.format,
              date: testProj.date.raw,
              subcategory: testProj.subcategory,
              link: testProj.link
          };
          
          const lang = document.documentElement.lang || 'fr';
          
          try {
            const rolesLib = LIBRARY.roles_me || {};
            const translatedRoles = data.roles.map(r => (rolesLib[r] && rolesLib[r][lang]) ? rolesLib[r][lang] : r);
            
            document.getElementById('test-hud-title').innerText = data.title || '';
            document.querySelector('.test-hud-desc').innerText = lang === 'fr' ? (data.descFr || data.descEn || '') : (data.descEn || '');
            
            const dateLib = LIBRARY.dates || {};
            let finalDate = '';
            if (data.date) {
                const parts = data.date.split(' ');
                if (parts.length === 2) {
                    const m = parts[0];
                    const y = parts[1];
                    finalDate = (dateLib[m] && dateLib[m][lang] ? dateLib[m][lang] : m) + ' ' + y;
                } else {
                    finalDate = data.date;
                }
            }
            const catLib = LIBRARY.subcategories || {};
            const translatedSubcat = data.subcategory && catLib[data.subcategory] && catLib[data.subcategory][lang] ? catLib[data.subcategory][lang] : (data.subcategory || 'Short Film');
            document.querySelector('.test-hud-meta').innerText = translatedSubcat + ' — ' + translatedRoles.join(' & ') + (finalDate ? ' — ' + finalDate : '');
            
            const techText = [data.camera, data.lens, data.format].filter(Boolean).join(' &nbsp; • &nbsp; ');
            document.querySelector('.test-hud-tech').innerHTML = techText;
            
            const playBtn = document.querySelector('.test-hud-play-btn');
            if (data.link) {
                playBtn.setAttribute('onclick', "window.open('" + data.link + "', '_blank')");
                playBtn.style.display = 'inline-flex';
            } else {
                playBtn.style.display = 'none';
            }

            // Populate Related Projects dynamically
            const relatedList = document.getElementById('test-related-list');
            if (relatedList) {
                relatedList.innerHTML = '';
                const otherProjects = projects.filter(p => p.id != projectId && p.media && p.title).slice(0, 2);
                otherProjects.forEach(op => {
                    const item = document.createElement('div');
                    item.className = 'test-related-item';
                    item.innerHTML = `<img src="${op.media}" alt="${op.title}"><span class="hover-title">${op.title}</span>`;
                    item.onclick = function() { window.populateTestModal(op.id); };
                    relatedList.appendChild(item);
                });
            }

            const gallery = document.getElementById('test-gallery');
            gallery.innerHTML = ''; 
          testProjectFiles.forEach((file) => {
              const item = document.createElement('div');
              item.className = 'test-gallery-item';
              let mainEl = file.type === 'video' ? document.createElement('video') : document.createElement('img');
              mainEl.src = file.main;
              if (file.type === 'video') {
                  mainEl.loop = true; mainEl.muted = true; mainEl.playsInline = true;
                  mainEl.style.width = '100%'; mainEl.style.height = '100%'; mainEl.style.objectFit = 'cover';
              }
              mainEl.className = 'main-layer active' + (file.type === 'video' ? ' test-video' : '');
              
              let btsEl = document.createElement('img');
                btsEl.src = file.bts;
                btsEl.className = 'bts-layer inactive';
                btsEl.onerror = function() { this.setAttribute('data-no-bts', 'true'); if (typeof updateProgress === 'function') updateProgress(); };
              
              item.appendChild(mainEl);
              item.appendChild(btsEl);
              gallery.appendChild(item);
          });
      } catch (e) {
          console.error("Ingestion failed:", e);
      }
  }

  let isBtsMode = false;

  let isHudManuallyHidden = false;
  let hasSeenInstructions = false;
  let hudTimeout;
  let isWheeling = false;

  const gallery = document.getElementById('test-gallery');
  const hud = document.getElementById('test-hud');
  const instructions = document.getElementById('test-instructions');
  const progressBar = document.getElementById('test-progress');
  const overlay = document.getElementById('da-test-modal');
    overlay.addEventListener('click', (e) => {
      if (e.target === overlay) {
        document.getElementById('close-test-modal').click();
      }
    });
  const progressContainer = document.querySelector('.test-progress-container');
  const pipBts = document.querySelector('.pip-bts-layer');
  const pipMain = document.querySelector('.pip-main-layer');
  if (pipBts && pipMain) {
      const firstBts = document.querySelector('.bts-layer');
      const firstMain = document.querySelector('.main-layer');
      // If it's a video, we can't easily extract src for img unless we use a poster or something. Assuming images for first slide.
      if (firstBts && firstBts.src) pipBts.src = firstBts.src;
      if (firstMain && firstMain.src) pipMain.src = firstMain.src;
  }

  document.querySelector('.test-rotate-message').addEventListener('click', () => {
    document.getElementById('da-test-modal').classList.add('force-landscape-bypass');
  });


  let isModeSwitching = false;
  function setMode(bts) {
      if (isBtsMode !== bts) {
          isModeSwitching = true; gallery.classList.add('instant-switch');
          hud.classList.add('instant-show'); // Bypass CSS delays
          hud.classList.remove('hidden');
          isHudManuallyHidden = false;
          gallery.scrollLeft = 0; // Instant jump back to first image on mode switch
          setTimeout(() => { 
              isModeSwitching = false; 
              hud.classList.remove('instant-show'); gallery.classList.remove('instant-switch'); 
          }, 800);
      }
      isBtsMode = bts;
      document.querySelectorAll('.main-layer').forEach(el => {
          el.classList.toggle('active', !isBtsMode);
          el.classList.toggle('inactive', isBtsMode);
      });
      manageVideos();
      document.querySelectorAll('.bts-layer').forEach(el => {
          el.classList.toggle('active', isBtsMode);
          el.classList.toggle('inactive', !isBtsMode);
      });
      document.querySelectorAll('.pip-main-layer').forEach(el => {
          el.classList.toggle('active', isBtsMode);
          el.classList.toggle('inactive', !isBtsMode);
      });
      document.querySelectorAll('.pip-bts-layer').forEach(el => {
          el.classList.toggle('active', !isBtsMode);
          el.classList.toggle('inactive', isBtsMode);
      });
      manageVideos();
      document.getElementById('pip-view-label').innerText = isBtsMode ? "TO THE FINAL CUT" : "TO THE BTS SHOT";
  }


  document.getElementById('open-test-modal').addEventListener('click', async () => {
      // Run ingestion system before opening
      await populateTestModal();
      
      // Setup PiP dynamic images again since DOM was rewritten
      const pipBts = document.querySelector('.pip-bts-layer');
      const pipMain = document.querySelector('.pip-main-layer');
      if (pipBts && pipMain) {
          const firstBts = document.querySelector('.bts-layer');
          const firstMain = document.querySelector('.main-layer');
          if (firstBts && firstBts.src) pipBts.src = firstBts.src;
          if (firstMain && firstMain.src) pipMain.src = firstMain.src;
      }

    try {
      if (!document.fullscreenElement && /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        await document.documentElement.requestFullscreen();
      }
    } catch (e) { console.log(e); }
    const modal = document.getElementById('da-test-modal');
    modal.style.display = 'block';
    void modal.offsetWidth;
    modal.classList.add('active');
    modal.classList.remove('force-landscape-bypass');
    document.body.style.overflow = 'hidden';
    document.getElementById('test-instructions').classList.remove('hidden');
    hasSeenInstructions = false;
    isHudManuallyHidden = false;
    setMode(false); // Reset to Final Cut
    updateProgress();
  });
  
  document.getElementById('close-test-modal').addEventListener('click', async () => {
    try {
      if (document.fullscreenElement) {
        await document.exitFullscreen();
      }
    } catch (e) {}
    const modal = document.getElementById('da-test-modal');
    modal.classList.remove('active');
    document.body.style.overflow = '';
    setTimeout(() => { 
        modal.style.display = 'none';
        gallery.scrollLeft = 0; 
        hud.classList.remove('hidden');
        
        setMode(false);
    }, 800);
  });

  

  function hideHUD() {
      hud.classList.add('hidden');
      instructions.classList.add('hidden');
      
      hasSeenInstructions = true;
    manageVideos();
  }

  function updateProgress() {
      const maxScroll = gallery.scrollWidth - gallery.clientWidth;
      if (maxScroll <= 0) { progressBar.style.width = '0%'; return; }
      const percent = (gallery.scrollLeft / maxScroll) * 100;
      progressBar.style.width = percent + '%';

      const items = document.querySelectorAll('.test-gallery-item');
      const activeIndex = Math.round(gallery.scrollLeft / gallery.clientWidth);
      const activeBts = items[activeIndex] ? items[activeIndex].querySelector('.bts-layer') : null;
      
      const swapTrigger = document.getElementById('swap-trigger');
      
      if (items[activeIndex]) {
          const mainL = items[activeIndex].querySelector('.main-layer');
          const btsL = items[activeIndex].querySelector('.bts-layer');
          const pipMain = document.querySelector('.pip-main-layer');
          const pipBts = document.querySelector('.pip-bts-layer');
          if (mainL && pipMain) pipMain.src = mainL.src || mainL.currentSrc || '';
          if (btsL && pipBts) pipBts.src = btsL.src || '';
      }
      
      if (activeBts && activeBts.getAttribute('data-no-bts') === 'true') {
          swapTrigger.style.display = 'none';
          if (isBtsMode) setMode(false);
      } else {
          swapTrigger.style.display = 'flex';
      }
    }

  function manageVideos() {
      const videos = gallery.querySelectorAll('video.test-video');
      const isHudVisible = !hud.classList.contains('hidden');
      
      videos.forEach(video => {
          const item = video.closest('.test-gallery-item');
          const itemStart = item.offsetLeft;
          const itemEnd = itemStart + item.clientWidth;
          
          const scrollStart = gallery.scrollLeft;
          const scrollEnd = scrollStart + gallery.clientWidth;
          
          const overlap = Math.max(0, Math.min(itemEnd, scrollEnd) - Math.max(itemStart, scrollStart));
          const isInView = overlap > (item.clientWidth * 0.5);
          
          if (isInView && !isHudVisible && !isBtsMode) {
              video.play().catch(e => console.log(e));
          } else {
              video.pause();
          }
      });
  }

  document.getElementById('nav-toggle').addEventListener('click', () => {
    clearTimeout(hudTimeout);
    if (hud.classList.contains('hidden')) {
      hud.classList.remove('hidden');
      isHudManuallyHidden = false;
    manageVideos();
    } else {
      hideHUD();
      isHudManuallyHidden = true;
    }
  });

  gallery.addEventListener('scroll', () => {
    updateProgress();
    manageVideos();
    if (gallery.scrollLeft > 50) {
      clearTimeout(hudTimeout);
      hideHUD();
    } else {
      if (hud.classList.contains('hidden')) {
        clearTimeout(hudTimeout);
        hudTimeout = setTimeout(() => {
          if (gallery.scrollLeft <= 50 && !isHudManuallyHidden) {
            hud.classList.remove('hidden');
            
manageVideos();
          }
        }, 800);
      }
    }
  });

  function smoothScrollTo(element, target, duration) {
    const start = element.scrollLeft;
    const change = target - start;
    let startTime = null;
    function easeInOutCubic(t, b, c, d) {
      t /= d/2;
      if (t < 1) return c/2*t*t*t + b;
      t -= 2; return c/2*(t*t*t + 2) + b;
    }
    function animation(currentTime) {
      if (startTime === null) startTime = currentTime;
      const timeElapsed = currentTime - startTime;
      element.scrollLeft = easeInOutCubic(timeElapsed, start, change, duration);
      if (timeElapsed < duration) {
        requestAnimationFrame(animation);
      } else {
        element.scrollLeft = target;
        isWheeling = false;
      }
    }
    requestAnimationFrame(animation);
    setTimeout(() => { isWheeling = false; }, duration + 50);
  }

    overlay.addEventListener('wheel', (evt) => {
    evt.preventDefault();
    if (isWheeling) return;
    
    const deltaX = evt.deltaX;
    const deltaY = evt.deltaY;
    
    if (Math.abs(deltaX) < 15 && Math.abs(deltaY) < 15) return;
    
    let direction = 0;
    if (Math.abs(deltaX) > Math.abs(deltaY)) {
        direction = deltaX > 0 ? 1 : -1;
    } else {
        direction = deltaY > 0 ? 1 : -1;
    }
    
    if (direction === 0) return;

    isWheeling = true;
    const currentIndex = Math.round(gallery.scrollLeft / gallery.clientWidth);
    const target = (currentIndex + direction) * gallery.clientWidth;
    const maxScroll = gallery.scrollWidth - gallery.clientWidth;
    const boundedTarget = Math.max(0, Math.min(target, maxScroll));
    smoothScrollTo(gallery, boundedTarget, 900);
  }, { passive: false });

  let touchStartX = 0;
  let touchStartY = 0;
  overlay.addEventListener('touchstart', (evt) => {
      touchStartX = evt.changedTouches[0].clientX;
      touchStartY = evt.changedTouches[0].clientY;
  }, { passive: true });
  
  overlay.addEventListener('touchend', (evt) => {
      if (isWheeling) return;
      const touchEndX = evt.changedTouches[0].clientX;
      const touchEndY = evt.changedTouches[0].clientY;
      
      let diffX = touchStartX - touchEndX;
      let diffY = touchStartY - touchEndY;
      
      if (document.getElementById('da-test-modal').classList.contains('force-landscape-bypass')) {
          diffX = -diffY;
          diffY = 0;
      }
      
      if (Math.abs(diffX) > 40 && Math.abs(diffX) > Math.abs(diffY)) {
          isWheeling = true;
          const direction = diffX > 0 ? 1 : -1;
          const currentIndex = Math.round(gallery.scrollLeft / gallery.clientWidth);
    const target = (currentIndex + direction) * gallery.clientWidth;
          const maxScroll = gallery.scrollWidth - gallery.clientWidth;
          const boundedTarget = Math.max(0, Math.min(target, maxScroll));
          smoothScrollTo(gallery, boundedTarget, 700);
      }
  }, { passive: true });

  document.getElementById('nav-prev').addEventListener('click', () => {
    if (isWheeling) return; isWheeling = true;
    const currentIndex = Math.round(gallery.scrollLeft / gallery.clientWidth);
    const boundedTarget = Math.max(0, (currentIndex - 1) * gallery.clientWidth);
    smoothScrollTo(gallery, boundedTarget, 900);
  });
  document.getElementById('nav-next').addEventListener('click', () => {
    if (isWheeling) return; isWheeling = true;
    const maxScroll = gallery.scrollWidth - gallery.clientWidth;
    const currentIndex = Math.round(gallery.scrollLeft / gallery.clientWidth);
    const boundedTarget = Math.min(maxScroll, (currentIndex + 1) * gallery.clientWidth);
    smoothScrollTo(gallery, boundedTarget, 900);
  });

  document.getElementById('swap-trigger').addEventListener('click', (e) => {
    e.stopPropagation();
    setMode(!isBtsMode);
  });
