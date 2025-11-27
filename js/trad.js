document.addEventListener("DOMContentLoaded", function() {
  
  const langBtn = document.getElementById('lang-toggle');
  const langText = langBtn ? langBtn.querySelector('.lang-text') : null;
  
  // 1. Charger la langue sauvegardée OU défaut 'en'
  let currentLang = localStorage.getItem('siteLanguage') || 'en';
  
  // Appliquer la langue tout de suite
  updateLanguage(currentLang);

  if(langBtn) {
      langBtn.addEventListener('click', () => {
        // Inverser la langue
        currentLang = currentLang === 'en' ? 'fr' : 'en';
        
        // 2. Sauvegarder le choix
        localStorage.setItem('siteLanguage', currentLang);
        
        updateLanguage(currentLang);
      });
  }

  function updateLanguage(lang) {
    if(langText) langText.textContent = lang.toUpperCase();

    const enElements = document.querySelectorAll('.lang-en');
    const frElements = document.querySelectorAll('.lang-fr');

    if (lang === 'fr') {
      enElements.forEach(el => el.style.display = 'none');
      frElements.forEach(el => el.style.display = 'inline');
    } else {
      frElements.forEach(el => el.style.display = 'none');
      enElements.forEach(el => el.style.display = 'inline');
    }

    const cvLink = document.getElementById('cv-link');
    if(cvLink) {
        if (lang === 'fr') {
            cvLink.setAttribute('href', 'assets/cv/cv_fr.pdf');
        } else {
            cvLink.setAttribute('href', 'assets/cv/cv.pdf');
        }
    }
  }
});