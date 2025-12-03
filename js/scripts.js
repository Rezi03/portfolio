document.addEventListener("DOMContentLoaded", function() {

  
  document.body.classList.add('js-loaded');

  // ANIMATION FADE
  const faders = document.querySelectorAll('.fade-in');
  const appearOptions = { threshold: 0.1 };

  const appearOnScroll = new IntersectionObserver(function(entries, appearOnScroll) {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('visible');
      appearOnScroll.unobserve(entry.target);
    });
  }, appearOptions);

  faders.forEach(fader => appearOnScroll.observe(fader));

  // SCROLL
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        window.scrollTo({
          top: target.offsetTop - 100,
          behavior: "smooth"
        });
      }
    });
  });

  // --- POP-UP CONTACT (FIXED) ---
  const contactBtn = document.getElementById('contactBtn');
  const modal = document.getElementById('contactModal');
  const closeModalBtn = document.getElementById('closeModalBtn');

  if (contactBtn && modal) {
      contactBtn.addEventListener('click', function(e) {
          e.preventDefault(); // Empêche de remonter en haut
          modal.classList.add('active');
          console.log("Contact clicked"); // Debug
      });

      if(closeModalBtn) {
          closeModalBtn.addEventListener('click', function() {
              modal.classList.remove('active');
          });
      }

      modal.addEventListener('click', function(e) {
          if (e.target === modal) {
              modal.classList.remove('active');
          }
      });
  } else {
      console.error("Bouton contact ou Modal introuvable !");
  }
});

