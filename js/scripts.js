document.addEventListener("DOMContentLoaded", function() {

  document.body.classList.add('js-loaded');

  // FADE-IN ON SCROLL
  const appearOnScroll = new IntersectionObserver(function(entries, observer) {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    });
  }, { threshold: 0.08 });

  document.querySelectorAll('.fade-in').forEach(el => appearOnScroll.observe(el));

  // SMOOTH SCROLL FOR ANCHOR LINKS
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) window.scrollTo({ top: target.offsetTop - 100, behavior: 'smooth' });
    });
  });

  // STAGGER MISSION CARDS (inline styles cleared after reveal so CSS hover works)
  document.querySelectorAll('.mission-card').forEach(card => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(28px)';
    card.style.filter = 'blur(5px)';
    card.style.transition = 'opacity 0.65s ease, transform 0.65s ease, filter 0.65s ease';
  });

  const cardObserver = new IntersectionObserver(function(entries, observer) {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const card = entry.target;
      const delay = Array.from(card.parentElement.children).indexOf(card) * 110;
      setTimeout(() => {
        card.style.opacity = '1';
        card.style.transform = 'translateY(0)';
        card.style.filter = 'blur(0)';
        // Clear inline styles after transition so CSS :hover takes over
        setTimeout(() => {
          card.style.opacity = '';
          card.style.transform = '';
          card.style.filter = '';
          card.style.transition = '';
        }, 700);
      }, delay);
      observer.unobserve(card);
    });
  }, { threshold: 0.12 });

  document.querySelectorAll('.mission-card').forEach(card => cardObserver.observe(card));

  // SCROLL PROGRESS BAR
  const progressBar = document.getElementById('scrollProgress');
  function updateScroll() {
    const scrolled = window.scrollY;
    const total = document.body.scrollHeight - window.innerHeight;
    if (progressBar) progressBar.style.width = (scrolled / total * 100) + '%';

    // BACK TO TOP VISIBILITY
    const btn = document.getElementById('backToTop');
    if (btn) btn.classList.toggle('visible', scrolled > 400);
  }
  window.addEventListener('scroll', updateScroll, { passive: true });

  // PARALLAX HERO IMAGE
  const heroImg = document.querySelector('.profile-img');
  window.addEventListener('scroll', () => {
    if (heroImg && window.scrollY < window.innerHeight) {
      heroImg.style.transform = `translateY(${window.scrollY * 0.07}px)`;
    }
  }, { passive: true });

  // ACTIVE NAV LINK ON SCROLL
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.header-right a[href^="#"]');

  const sectionObserver = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        navLinks.forEach(link => {
          link.classList.toggle('active', link.getAttribute('href') === '#' + id);
        });
      }
    });
  }, { rootMargin: '-40% 0px -55% 0px' });

  sections.forEach(s => sectionObserver.observe(s));

  // HAMBURGER MENU
  const menuToggle = document.getElementById('menuToggle');
  const mainNav = document.getElementById('mainNav');

  // Create mobile nav
  const mobileNav = document.createElement('div');
  mobileNav.className = 'mobile-nav';
  mobileNav.id = 'mobileNav';

  const navAnchors = [
    { href: '#about', en: 'About', fr: 'À propos' },
    { href: '#experience', en: 'Experience', fr: 'Expérience' },
    { href: '#finance', en: 'Finance', fr: 'Finance' },
    { href: '#education', en: 'Education', fr: 'Formation' },
    { href: '#skills', en: 'Skills', fr: 'Compétences' },
    { href: '#documents', en: 'Documents', fr: 'Documents' },
  ];

  navAnchors.forEach(item => {
    const a = document.createElement('a');
    a.href = item.href;
    a.innerHTML = `<span class="lang-en">${item.en}</span><span class="lang-fr" style="display:none">${item.fr}</span>`;
    a.addEventListener('click', () => {
      mobileNav.classList.remove('open');
      menuToggle.classList.remove('open');
    });
    mobileNav.appendChild(a);
  });

  const header = document.querySelector('.glass-header');
  header.appendChild(mobileNav);

  menuToggle.addEventListener('click', () => {
    const isOpen = mobileNav.classList.toggle('open');
    menuToggle.classList.toggle('open', isOpen);
  });

  // MISSION MODAL
  const missionData = {
    hub: {
      en: { title: 'Financial Data Hub', gains: [
        'Real-time SQL integration — data refreshed automatically, no manual re-export',
        'Replaces scattered files across the team: one shared hub as the single source of truth',
        'Significant reduction in time spent retrieving and preparing data',
        'Built entirely from scratch — no equivalent tool existed before'
      ]},
      fr: { title: 'Hub de Données Financières', gains: [
        'Intégration SQL en temps réel — données actualisées automatiquement, sans export manuel',
        'Remplace les fichiers dispersés : un hub unique partagé comme source de vérité',
        'Réduction significative du temps de récupération et de préparation des données',
        'Construit de zéro — aucun outil équivalent n\'existait'
      ]}
    },
    reporting: {
      en: { title: 'Reporting Automation', gains: [
        'Context: CPPI = Comité du Pilotage du Portefeuille Informatique — quarterly IT governance committee chaired by the First Deputy Governor',
        '100% of manual data extraction eliminated',
        'End-to-end autonomous pipeline — runs without human intervention',
        'Output: dynamic Power BI dashboard + automated PowerPoint deck',
        'Delivered quarterly to the First Deputy Governor',
        'Python handles the full chain: extraction → transformation → formatting → export'
      ]},
      fr: { title: 'Automatisation du Reporting', gains: [
        'Contexte : CPPI = Comité du Pilotage du Portefeuille Informatique — comité de gouvernance IT trimestriel présidé par le Premier Sous-Gouverneur',
        '100% de l\'extraction manuelle supprimée',
        'Pipeline autonome bout-en-bout — tourne sans intervention humaine',
        'Livrable : tableau de bord Power BI dynamique + PowerPoint automatisé',
        'Présenté trimestriellement au Premier Sous-Gouverneur',
        'Python gère toute la chaîne : extraction → transformation → mise en forme → export'
      ]}
    },
    cppi: {
      en: { title: 'Budget Collection System', gains: [
        'Context: CPPI = Comité du Pilotage du Portefeuille Informatique — the committee that governs all IT investment decisions at the Banque de France',
        '9 Banque de France directorates onboarded on the system',
        'VBA-locked templates pre-filled by Python — deployed on SharePoint',
        'Automated consolidation: historical data + live SharePoint inputs merged automatically',
        'Outputs: governance PowerPoint presentations + Power BI dashboards',
        'NLP model for intelligent cross-referencing across databases',
        'Daily local sync pipeline: SharePoint data pulled automatically once a day',
        'Per-directorate comment files for documentation and traceability'
      ]},
      fr: { title: 'Système de Collecte Budgétaire', gains: [
        'Contexte : CPPI = Comité du Pilotage du Portefeuille Informatique — instance qui gouverne l\'ensemble des décisions d\'investissement informatique de la Banque de France',
        '9 directions de la Banque de France intégrées dans le système',
        'Maquettes VBA verrouillables pré-remplies par Python — déployées sur SharePoint',
        'Consolidation automatique : données historiques + saisies SharePoint fusionnées',
        'Livrables : présentations PowerPoint de gouvernance + tableaux de bord Power BI',
        'Modèle NLP pour croisement intelligent des bases de données',
        'Pipeline de sync quotidien : données SharePoint rapatriées automatiquement en local',
        'Fichiers de commentaires par direction pour traçabilité'
      ]}
    },
    training: {
      en: { title: 'Training Instructor', gains: [
        'Designed and led VBA & Python courses for colleagues in the Financial Directorate',
        'VBA: Excel automation, custom tool development, macro design',
        'Python: data manipulation, automation scripts, financial use cases',
        'Course materials created from scratch, tailored to real workflows',
        'Colleagues autonomised on tools they now use daily'
      ]},
      fr: { title: 'Formateur', gains: [
        'Conception et animation de cours VBA & Python pour les collègues de la Direction Financière',
        'VBA : automatisation Excel, développement d\'outils sur mesure, conception de macros',
        'Python : manipulation de données, scripts d\'automatisation, cas d\'usage financiers',
        'Supports de cours créés de zéro, adaptés aux workflows réels',
        'Collègues autonomisés sur des outils qu\'ils utilisent au quotidien'
      ]}
    }
  };

  const missionModal = document.getElementById('missionModal');
  const mModalTitle = document.getElementById('mModalTitle');
  const mModalGains = document.getElementById('mModalGains');

  function getCurrentLang() {
    return localStorage.getItem('siteLanguage') || 'en';
  }

  document.querySelectorAll('.mission-card[data-mission]').forEach(card => {
    card.addEventListener('click', () => {
      const key = card.dataset.mission;
      const data = missionData[key];
      if (!data) return;
      const content = data[getCurrentLang()] || data['en'];
      mModalTitle.textContent = content.title;
      mModalGains.innerHTML = content.gains.map(g => `<li>${g}</li>`).join('');
      missionModal.classList.add('active');
    });
  });

  // COPY EMAIL BUTTON
  const copyEmailBtn = document.getElementById('copyEmailBtn');
  if (copyEmailBtn) {
    copyEmailBtn.addEventListener('click', function() {
      navigator.clipboard.writeText('rezisabashvili1@gmail.com').then(() => {
        const lang = localStorage.getItem('siteLanguage') || 'en';
        const origHTML = copyEmailBtn.innerHTML;
        copyEmailBtn.textContent = lang === 'fr' ? '✓ Copié !' : '✓ Copied!';
        setTimeout(() => { copyEmailBtn.innerHTML = origHTML; }, 1600);
      });
    });
  }

});
