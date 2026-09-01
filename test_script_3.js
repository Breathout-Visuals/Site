
        document.addEventListener("DOMContentLoaded", () => {
          const v = document.querySelector('.hero-video-bg');
          if (v) { v.setAttribute('playsinline', ''); v.play().catch(() => { }); }
        });
      
  

