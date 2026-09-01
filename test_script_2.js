
    window.addEventListener('load', () => {
      const preloader = document.getElementById('preloader');
      const bar = preloader.querySelector('.preloader-bar');
      
      // Stop simulation and force completion
      bar.style.animation = 'none';
      void bar.offsetWidth; // Force reflow
      bar.style.transition = 'transform 0.4s cubic-bezier(0.4, 0, 0.2, 1)';
      bar.style.transform = 'translateX(0)';

      setTimeout(() => {
        preloader.classList.add('hidden');
      }, 500); // Wait for bar to finish before fading out
    });
  
  

