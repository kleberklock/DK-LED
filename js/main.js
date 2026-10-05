/**
 * DK LED - Laboratório Especializado em Manutenção de Painéis de LED
 * Lógica Interativa: Slider Antes/Depois, Contadores Numéricos, FAQ e Menu Mobile
 */

document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initComparisonSlider();
  initAnimatedCounters();
  initFaqAccordion();
  initActiveNavHighlight();
});

/* 1. Menu Mobile */
function initMobileMenu() {
  const menuToggle = document.getElementById('menuToggle');
  const navMenu = document.getElementById('navMenu');
  const navLinks = document.querySelectorAll('.nav-link');

  if (!menuToggle || !navMenu) return;

  menuToggle.addEventListener('click', () => {
    navMenu.classList.toggle('open');
    const isOpen = navMenu.classList.contains('open');
    menuToggle.setAttribute('aria-expanded', isOpen);
    menuToggle.innerHTML = isOpen 
      ? `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>`
      : `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>`;
  });

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      navMenu.classList.remove('open');
      menuToggle.innerHTML = `<svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>`;
    });
  });
}

/* 2. Slider Antes & Depois — técnica clip-path (sem zoom, sem wrapper) */
function initComparisonSlider() {
  const container = document.getElementById('comparisonSlider');
  const beforeImg  = document.getElementById('comparisonBeforeImg');
  const handle     = document.getElementById('comparisonHandle');
  const divider    = document.getElementById('comparisonDivider');

  if (!container || !beforeImg || !handle) return;

  let isDragging = false;

  /**
   * Aplica a posição do slider.
   * @param {number} percentage — 0 a 100, posição do handle em % da largura
   */
  function applyPosition(percentage) {
    // Garante limites 1–99 para nunca esconder totalmente uma imagem
    const pct = Math.max(1, Math.min(99, percentage));
    const rightClip = 100 - pct;

    // Clip-path corta a imagem ANTES pelo lado direito (sem mover a imagem!)
    beforeImg.style.clipPath = `inset(0 ${rightClip}% 0 0)`;

    // Move o handle e a linha divisória
    handle.style.left    = `${pct}%`;
    if (divider) divider.style.left = `${pct}%`;
  }

  function getPercentage(clientX) {
    const rect = container.getBoundingClientRect();
    const posX = clientX - rect.left;
    return (posX / rect.width) * 100;
  }

  // Posição inicial: 50%
  applyPosition(50);

  // Mouse
  container.addEventListener('mousedown', (e) => {
    e.preventDefault();
    isDragging = true;
    applyPosition(getPercentage(e.clientX));
  });

  window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    applyPosition(getPercentage(e.clientX));
  });

  window.addEventListener('mouseup', () => { isDragging = false; });

  // Touch
  container.addEventListener('touchstart', (e) => {
    isDragging = true;
    if (e.touches && e.touches[0]) {
      applyPosition(getPercentage(e.touches[0].clientX));
    }
  }, { passive: true });

  window.addEventListener('touchmove', (e) => {
    if (!isDragging || !e.touches || !e.touches[0]) return;
    applyPosition(getPercentage(e.touches[0].clientX));
  }, { passive: true });

  window.addEventListener('touchend', () => { isDragging = false; });
}

/* 3. Contadores Numéricos Animados (+20.000) */
function initAnimatedCounters() {
  const counterElements = document.querySelectorAll('[data-counter-target]');
  if (!counterElements.length) return;

  const observerOptions = {
    threshold: 0.3,
    rootMargin: '0px 0px -40px 0px'
  };

  const counterObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        animateNumber(el);
        observer.unobserve(el);
      }
    });
  }, observerOptions);

  counterElements.forEach(el => counterObserver.observe(el));

  function animateNumber(element) {
    const target = parseFloat(element.getAttribute('data-counter-target'));
    const prefix = element.getAttribute('data-counter-prefix') || '';
    const suffix = element.getAttribute('data-counter-suffix') || '';
    const isDecimal = target % 1 !== 0;
    const duration = 1600;
    const startTime = performance.now();

    function step(currentTime) {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      const easeProgress = 1 - Math.pow(1 - progress, 3);

      const currentVal = easeProgress * target;
      const displayVal = isDecimal 
        ? currentVal.toFixed(1) 
        : Math.floor(currentVal).toLocaleString('pt-BR');

      element.textContent = `${prefix}${displayVal}${suffix}`;

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        const finalVal = isDecimal ? target.toFixed(1) : target.toLocaleString('pt-BR');
        element.textContent = `${prefix}${finalVal}${suffix}`;
      }
    }

    requestAnimationFrame(step);
  }
}

/* 4. FAQ Accordion */
function initFaqAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');
  if (!faqItems.length) return;

  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    if (!questionBtn) return;

    questionBtn.addEventListener('click', () => {
      const isActive = item.classList.contains('active');

      faqItems.forEach(otherItem => {
        otherItem.classList.remove('active');
        const otherBtn = otherItem.querySelector('.faq-question');
        if (otherBtn) otherBtn.setAttribute('aria-expanded', 'false');
      });

      if (!isActive) {
        item.classList.add('active');
        questionBtn.setAttribute('aria-expanded', 'true');
      }
    });
  });
}

/* 5. Destaque de Navegação Ativa no Scroll */
function initActiveNavHighlight() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  if (!sections.length || !navLinks.length) return;

  window.addEventListener('scroll', () => {
    let current = '';
    const scrollY = window.pageYOffset;

    sections.forEach(section => {
      const sectionHeight = section.offsetHeight;
      const sectionTop = section.offsetTop - 100;
      if (scrollY >= sectionTop && scrollY < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  }, { passive: true });
}
