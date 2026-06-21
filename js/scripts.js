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

  // SCROLL PROGRESS BAR + BREATHING
  const progressBar = document.getElementById('scrollProgress');
  let breatheTimer = null;
  function updateScroll() {
    const scrolled = window.scrollY;
    const total = document.body.scrollHeight - window.innerHeight;
    if (progressBar) {
      progressBar.style.width = (scrolled / total * 100) + '%';
      progressBar.classList.remove('breathing');
      clearTimeout(breatheTimer);
      breatheTimer = setTimeout(() => {
        if (progressBar) progressBar.classList.add('breathing');
      }, 1800);
    }

    // BACK TO TOP VISIBILITY
    const btn = document.getElementById('backToTop');
    if (btn) btn.classList.toggle('visible', scrolled > 400);
  }
  window.addEventListener('scroll', updateScroll, { passive: true });
  setTimeout(() => { if (progressBar) progressBar.classList.add('breathing'); }, 2000);

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

  // =============================================
  //  ENHANCED ANIMATIONS
  // =============================================

  const isTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;


  // D. SECTION DOTS
  const dotSections = [
    { id: 'about', en: 'Profile', fr: 'Profil' },
    { id: 'experience', en: 'Experience', fr: 'Expérience' },
    { id: 'finance', en: 'Finance', fr: 'Finance' },
    { id: 'education', en: 'Education', fr: 'Formation' },
    { id: 'skills', en: 'Skills', fr: 'Compétences' },
    { id: 'documents', en: 'Documents', fr: 'Documents' },
  ];
  const dotsContainer = document.createElement('div');
  dotsContainer.id = 'section-dots';
  document.body.appendChild(dotsContainer);

  dotSections.forEach(s => {
    const dot = document.createElement('div');
    dot.className = 'sdot';
    dot.dataset.target = s.id;
    dot.innerHTML = `<div class="sdot-tooltip">${s.en}</div>`;
    dot.addEventListener('click', () => {
      const el = document.getElementById(s.id);
      if (el) window.scrollTo({ top: el.offsetTop - 100, behavior: 'smooth' });
    });
    dotsContainer.appendChild(dot);
  });

  const dotObserver = new IntersectionObserver(entries => {
    entries.forEach(e => {
      const dot = dotsContainer.querySelector(`[data-target="${e.target.id}"]`);
      if (dot) dot.classList.toggle('active', e.isIntersecting);
    });
  }, { rootMargin: '-30% 0px -60% 0px' });
  dotSections.forEach(s => {
    const el = document.getElementById(s.id);
    if (el) dotObserver.observe(el);
  });

  // E. TYPEWRITER ON SUBTITLE (runs after scramble ~1.5s)
  setTimeout(() => {
    const lang = localStorage.getItem('siteLanguage') || 'en';
    const sub = document.querySelector('.subtitle .lang-' + lang);
    if (!sub) return;
    const text = sub.textContent;
    sub.textContent = '';
    sub.style.visibility = 'visible';
    let i = 0;
    const tw = setInterval(() => {
      sub.textContent += text[i++];
      if (i >= text.length) clearInterval(tw);
    }, 22);
  }, 1600);

  // F. HERO PARTICLES
  const heroSection = document.querySelector('.hero');
  if (heroSection) {
    const canvas = document.createElement('canvas');
    canvas.id = 'hero-particles';
    canvas.style.cssText = 'position:absolute;inset:0;width:100%;height:100%;pointer-events:none;z-index:0;border-radius:inherit;';
    heroSection.style.position = 'relative';
    heroSection.insertBefore(canvas, heroSection.firstChild);

    const ctx2 = canvas.getContext('2d');
    const particles = [];
    function resizeCanvas() {
      canvas.width = heroSection.offsetWidth;
      canvas.height = heroSection.offsetHeight;
    }
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);

    for (let i = 0; i < 28; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 2 + 0.8,
        dx: (Math.random() - 0.5) * 0.4,
        dy: (Math.random() - 0.5) * 0.4,
        o: Math.random() * 0.4 + 0.1
      });
    }

    function drawParticles() {
      ctx2.clearRect(0, 0, canvas.width, canvas.height);
      particles.forEach(p => {
        ctx2.beginPath();
        ctx2.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx2.fillStyle = `rgba(0,113,227,${p.o})`;
        ctx2.fill();
        p.x += p.dx; p.y += p.dy;
        if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
      });
      requestAnimationFrame(drawParticles);
    }
    drawParticles();
  }

  // G. 20/20 CONFETTI BURST
  function confettiBurst(el) {
    const rect = el.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const colors = ['#0071e3','#00c6ff','#004e92','#34c759','#ffffff'];
    for (let i = 0; i < 22; i++) {
      const p = document.createElement('div');
      p.className = 'confetti-particle';
      const angle = (i / 22) * 360;
      const dist = 60 + Math.random() * 60;
      const dx = Math.cos(angle * Math.PI/180) * dist;
      const dy = Math.sin(angle * Math.PI/180) * dist - 30;
      p.style.cssText = `
        left:${cx}px; top:${cy}px;
        width:${4 + Math.random()*4}px; height:${4 + Math.random()*4}px;
        background:${colors[Math.floor(Math.random()*colors.length)]};
        --dx:${dx}px; --dy:${dy}px; --rot:${Math.random()*360}deg;
      `;
      document.body.appendChild(p);
      setTimeout(() => p.remove(), 900);
    }
    playTone(1047, 0.3, 0.1);
  }

  // Hook confetti into grade counter (override the existing counter observer)
  document.querySelectorAll('.course-grade').forEach(el => {
    if (el.textContent.trim() === '20/20') {
      const perfObs = new IntersectionObserver(entries => {
        if (!entries[0].isIntersecting) return;
        const target = 20;
        let cur = 0;
        const t = setInterval(() => {
          cur = Math.min(cur + 1, target);
          el.textContent = Math.round(cur) + '/20';
          if (cur >= target) { clearInterval(t); setTimeout(() => confettiBurst(el), 100); }
        }, 42);
        perfObs.unobserve(el);
      }, { threshold: 0.6 });
      perfObs.observe(el);
    }
  });

  // H. FINTEKER NAV PREVIEW
  const financeLink = document.querySelector('a[href="#finance"]');
  const preview = document.getElementById('finteker-preview');
  if (financeLink && preview) {
    let previewTimeout;
    financeLink.addEventListener('mouseenter', () => {
      clearTimeout(previewTimeout);
      preview.classList.add('visible');
    });
    financeLink.addEventListener('mouseleave', () => {
      previewTimeout = setTimeout(() => preview.classList.remove('visible'), 250);
    });
    preview.addEventListener('mouseenter', () => clearTimeout(previewTimeout));
    preview.addEventListener('mouseleave', () => {
      previewTimeout = setTimeout(() => preview.classList.remove('visible'), 250);
    });
  }


  // 2. CARD HOVER — elevation/effects handled by CSS (.glass-panel:hover).
  //    Mouse-follow 3D tilt removed per preference.


  // 4. ANIMATED GRADE COUNTERS
  document.querySelectorAll('.course-grade').forEach(el => {
    const obs = new IntersectionObserver(entries => {
      if (!entries[0].isIntersecting) return;
      const m = el.textContent.trim().match(/^(\d+)\/(\d+)$/);
      if (!m) return;
      const target = +m[1], denom = +m[2];
      let cur = 0;
      const step = target / 22;
      const t = setInterval(() => {
        cur = Math.min(cur + step, target);
        el.textContent = Math.round(cur) + '/' + denom;
        if (cur >= target) clearInterval(t);
      }, 42);
      obs.unobserve(el);
    }, { threshold: 0.6 });
    obs.observe(el);
  });

  // 5. MAGNETIC BUTTONS — very subtle pull, capped (kept gentle on purpose)
  if (!isTouch) {
    const MAG = 0.10, CAP = 5; // factor + max px displacement
    const clamp = v => Math.max(-CAP, Math.min(CAP, v));
    document.querySelectorAll('.btn-primary, .btn-gradient, .btn-outline').forEach(btn => {
      btn.addEventListener('mousemove', e => {
        const r = btn.getBoundingClientRect();
        const x = clamp((e.clientX - r.left - r.width / 2) * MAG);
        const y = clamp((e.clientY - r.top - r.height / 2) * MAG);
        btn.style.transform = `translate(${x}px,${y}px)`;
        btn.style.transition = 'transform 0.12s ease';
      });
      btn.addEventListener('mouseleave', () => {
        btn.style.transform = '';
        btn.style.transition = 'transform 0.4s cubic-bezier(0.2,0.8,0.2,1)';
        setTimeout(() => btn.style.transition = '', 400);
      });
    });
  }


  // 7. DARK MODE TOGGLE
  (function() {
    const btn = document.getElementById('theme-toggle');
    const icon = document.getElementById('theme-icon');
    if (!btn || !icon) return;

    const SUN_SVG = `<circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>`;
    const MOON_SVG = `<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>`;

    // Reset si l'utilisateur n'a jamais choisi explicitement (ancienne valeur système)
    if (localStorage.getItem('darkModeUserChosen') !== '1') {
      localStorage.removeItem('darkMode');
      localStorage.setItem('darkModeUserChosen', '1');
    }
    let dark = localStorage.getItem('darkMode') === 'true';
    function applyTheme() {
      document.documentElement.setAttribute('data-theme', dark ? 'dark' : '');
      icon.innerHTML = dark ? SUN_SVG : MOON_SVG;
    }
    applyTheme();

    btn.addEventListener('click', () => {
      dark = !dark;
      localStorage.setItem('darkMode', dark);
      applyTheme();
    });
  })();

  // 8. EXPERIENCE NAV PREVIEW
  (function() {
    const trigger = document.querySelector('a[href="#experience"]');
    const preview = document.getElementById('experience-preview');
    if (!trigger || !preview) return;
    let showTimer, hideTimer;
    trigger.addEventListener('mouseenter', () => {
      clearTimeout(hideTimer);
      showTimer = setTimeout(() => preview.classList.add('visible'), 120);
    });
    trigger.addEventListener('mouseleave', () => {
      clearTimeout(showTimer);
      hideTimer = setTimeout(() => preview.classList.remove('visible'), 200);
    });
    preview.addEventListener('mouseenter', () => clearTimeout(hideTimer));
    preview.addEventListener('mouseleave', () => {
      hideTimer = setTimeout(() => preview.classList.remove('visible'), 200);
    });
  })();

  // 10. FLOATING RUNES
  (function() {
    const symbols = ['∑','∂','π','σ','∫','Δ','∇','μ','ρ','α','β','λ','φ','€','%','‰','∞','≈'];
    const container = document.querySelector('.background-blobs');
    if (!container) return;
    for (let i = 0; i < 18; i++) {
      const el = document.createElement('span');
      el.className = 'rune';
      el.textContent = symbols[i % symbols.length];
      const x = 3 + Math.random() * 94;
      const y = 5 + Math.random() * 90;
      const dur = 28 + Math.random() * 40;
      const delay = -(Math.random() * dur);
      el.style.cssText = `left:${x}vw; top:${y}vh; animation-duration:${dur}s; animation-delay:${delay}s; font-size:${0.9 + Math.random() * 0.7}rem;`;
      container.appendChild(el);
    }
  })();

  // 11. SCROLL REVEAL (staggered) — Magic MCP "Scroll Animation" pattern
  (function () {
    const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const selector = '.bento-card, .mission-card, .project-card, .edu-card, .edu-card-small, .skill-group, .etv-entry';
    const items = Array.prototype.slice.call(document.querySelectorAll(selector));
    if (!items.length) return;
    if (reduce) { items.forEach(el => el.classList.add('reveal-in')); return; }
    items.forEach(el => el.classList.add('reveal-item'));
    const obs = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        // stagger by position among revealing siblings in the same container
        const sibs = el.parentNode
          ? Array.prototype.slice.call(el.parentNode.children).filter(c => c.classList.contains('reveal-item'))
          : [el];
        const idx = Math.max(0, sibs.indexOf(el));
        el.style.transitionDelay = (idx * 90) + 'ms';
        el.classList.add('reveal-in');
        obs.unobserve(el);
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -60px 0px' });
    items.forEach(el => obs.observe(el));
  })();

  // 12. MAGIC TEXT — scroll-linked word reveal (Magic MCP "Magic Text")
  (function () {
    const blocks = Array.prototype.slice.call(document.querySelectorAll('.magic-text'));
    if (!blocks.length) return;

    function wrapWords(el) {
      const text = el.textContent;
      el.textContent = '';
      text.split(/(\s+)/).forEach(tok => {
        if (tok === '') return;
        if (/^\s+$/.test(tok)) { el.appendChild(document.createTextNode(tok)); }
        else { const s = document.createElement('span'); s.className = 'mw'; s.textContent = tok; el.appendChild(s); }
      });
    }
    // wrap words inside each language span (so it works in EN and FR)
    blocks.forEach(block => {
      const langs = block.querySelectorAll('.lang-en, .lang-fr');
      if (langs.length) langs.forEach(wrapWords);
      else wrapWords(block);
    });

    const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduce) { document.querySelectorAll('.magic-text .mw').forEach(w => w.style.opacity = 1); return; }

    let ticking = false;
    function paint() {
      ticking = false;
      const vh = window.innerHeight;
      const startY = vh * 0.85, endY = vh * 0.35; // reveal window
      blocks.forEach(block => {
        const words = Array.prototype.slice.call(block.querySelectorAll('.mw'))
          .filter(w => w.offsetParent !== null); // only the visible language
        if (!words.length) return;
        const top = block.getBoundingClientRect().top;
        let p = (startY - top) / (startY - endY);
        p = Math.max(0, Math.min(1, p));
        const reveal = p * words.length;
        words.forEach((w, i) => {
          const o = i < reveal - 1 ? 1 : (i < reveal ? 0.2 + 0.8 * (reveal - i) : 0.2);
          w.style.opacity = o;
        });
      });
    }
    function onScroll() { if (!ticking) { ticking = true; requestAnimationFrame(paint); } }
    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });
    paint();
  })();

});

/* =============================================
   LIVE MARKET TICKER — Yahoo Finance
   Real-time quotes for the .ticker-track strip.
   Yahoo sends no CORS headers, so requests are routed through a CORS
   proxy (allorigins, with corsproxy.io as fallback). Symbols are
   fetched sequentially with small spacing to avoid proxy rate-limits.
   If the network/proxy is unavailable, the static HTML stays in place.
   ============================================= */
(function () {
  var track = document.querySelector('.ticker-track');
  if (!track) return;

  // symbol, display name, decimals
  var SYMS = [
    { s: '^FCHI',     n: 'CAC 40',        d: 2 },
    { s: '^GSPC',     n: 'S&P 500',       d: 2 },
    { s: '^STOXX50E', n: 'EURO STOXX 50', d: 2 },
    { s: '^GDAXI',    n: 'DAX',           d: 2 },
    { s: 'EURUSD=X',  n: 'EUR/USD',       d: 4 },
    { s: 'GC=F',      n: 'GOLD',          d: 2 },
    { s: 'BZ=F',      n: 'BRENT',         d: 2 },
    { s: '^VIX',      n: 'VIX',           d: 2 },
    { s: 'BTC-EUR',   n: 'BTC/EUR',       d: 0 }
  ];

  var PROXIES = [
    function (u) { return 'https://api.allorigins.win/raw?url=' + encodeURIComponent(u); },
    function (u) { return 'https://corsproxy.io/?url=' + encodeURIComponent(u); }
  ];
  function yurl(s) {
    return 'https://query1.finance.yahoo.com/v8/finance/chart/' +
           encodeURIComponent(s) + '?range=1d&interval=1d';
  }
  function fmt(v, d) { return v.toLocaleString('en-US', { minimumFractionDigits: d, maximumFractionDigits: d }); }
  function sleep(ms) { return new Promise(function (r) { setTimeout(r, ms); }); }

  async function fetchOne(sym) {
    var url = yurl(sym.s);
    for (var i = 0; i < PROXIES.length; i++) {
      try {
        var r = await fetch(PROXIES[i](url), { cache: 'no-store' });
        if (!r.ok) continue;
        var j = await r.json();
        var m = j && j.chart && j.chart.result && j.chart.result[0] && j.chart.result[0].meta;
        if (!m || typeof m.regularMarketPrice !== 'number') continue;
        var price = m.regularMarketPrice;
        var prev = (typeof m.chartPreviousClose === 'number') ? m.chartPreviousClose : m.previousClose;
        return { n: sym.n, price: price, d: sym.d, chg: prev ? ((price / prev - 1) * 100) : 0 };
      } catch (e) { /* try next proxy */ }
    }
    return null;
  }

  function render(items) {
    if (!items.length) return;
    var html = items.map(function (it) {
      var cls = it.chg > 0.001 ? 'up' : (it.chg < -0.001 ? 'down' : 'flat');
      var arrow = cls === 'up' ? '▲' : (cls === 'down' ? '▼' : '—');
      var sign = it.chg > 0 ? '+' : '';
      return '<span class="tk">' +
               '<span class="tk-sym">' + it.n + '</span>' +
               '<span class="tk-val">' + fmt(it.price, it.d) + '</span>' +
               '<span class="tk-chg ' + cls + '">' + arrow + ' ' + sign + it.chg.toFixed(2) + '%</span>' +
             '</span>';
    }).join('');
    track.innerHTML = html + html; // duplicate for seamless loop
  }

  async function update() {
    var out = [];
    for (var i = 0; i < SYMS.length; i++) {
      var q = await fetchOne(SYMS[i]);
      if (q) out.push(q);
      await sleep(450); // gentle pacing to avoid proxy rate-limiting
    }
    if (out.length >= 3) render(out);
  }

  update();
  setInterval(update, 120000);
})();
