/**
 * DK LED - Redesign Ultra-Minimalista & Futurista
 * Lógica Limpa & Fluida: Optical Deck Interativo, Scanner de Comparação e Contadores
 */

document.addEventListener('DOMContentLoaded', () => {
  initMobileMenu();
  initHeroOpticalDeck();
  initComparisonScanner();
  initMetricCounters();
});

/* ==========================================================================
   0. Menu Mobile (Hambúrguer)
   ========================================================================== */
function initMobileMenu() {
  const nav = document.querySelector('.minimal-nav');
  const toggle = document.getElementById('navToggle');
  if (!nav || !toggle) return;

  const setOpen = (open) => {
    nav.classList.toggle('menu-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Fechar menu' : 'Abrir menu');
  };

  toggle.addEventListener('click', (e) => {
    e.stopPropagation();
    setOpen(!nav.classList.contains('menu-open'));
  });

  nav.querySelectorAll('.nav-menu-links a').forEach(a => a.addEventListener('click', () => setOpen(false)));
  document.addEventListener('click', (e) => { if (!nav.contains(e.target)) setOpen(false); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') setOpen(false); });
  window.addEventListener('resize', () => { if (window.innerWidth > 860) setOpen(false); });
}

/* ==========================================================================
   1. Showcase Interativo de Bancada (Optical Deck / Sem Vídeo)
   ========================================================================== */
function initHeroOpticalDeck() {
  const card = document.getElementById('heroDeckCard');
  const layers = document.querySelectorAll('.stage-image-layer, .deck-image-layer');
  const tabBtns = document.querySelectorAll('.stage-tab-btn, .deck-tab-btn');

  if (!card || !layers.length || !tabBtns.length) return;

  // 1.1 Alternância das 2 Fotos Reais
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-target-layer');
      const targetLayer = document.getElementById(targetId);

      if (!targetLayer) return;

      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      layers.forEach(l => l.classList.remove('active'));
      targetLayer.classList.add('active');
    });
  });

  // 1.3 Efeito de Perspectiva 3D Suave ao Mover o Cursor
  card.addEventListener('mousemove', (e) => {
    if (!window.matchMedia('(hover: hover)').matches) return;
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rotateX = ((y - centerY) / centerY) * -5; // max 5deg
    const rotateY = ((x - centerX) / centerX) * 5;  // max 5deg

    card.style.transform = `rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg)`;
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = 'rotateX(0deg) rotateY(0deg)';
  });
}

/* ==========================================================================
   2. Scanner de Comparação Antes & Depois (Fluido e Preciso)
   ========================================================================== */
function initComparisonScanner() {
  const container = document.getElementById('scannerContainer');
  const imgBefore = document.getElementById('scannerBeforeImg');
  const divider = document.getElementById('scannerDividerLine');
  const handle = document.getElementById('scannerHandleCircle');

  if (!container || !imgBefore || !divider || !handle) return;

  let isDragging = false;

  function updatePosition(clientX) {
    const rect = container.getBoundingClientRect();
    const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
    const percentage = Math.max(2, Math.min(98, (x / rect.width) * 100));
    const rightInset = 100 - percentage;

    imgBefore.style.clipPath = `inset(0 ${rightInset}% 0 0)`;
    divider.style.left = `${percentage}%`;
    handle.style.left = `${percentage}%`;
  }

  // Mouse Events
  container.addEventListener('mousedown', (e) => {
    isDragging = true;
    updatePosition(e.clientX);
  });

  window.addEventListener('mousemove', (e) => {
    if (!isDragging) return;
    updatePosition(e.clientX);
  });

  window.addEventListener('mouseup', () => {
    isDragging = false;
  });

  // Touch Events (Mobile)
  container.addEventListener('touchstart', (e) => {
    isDragging = true;
    if (e.touches && e.touches[0]) {
      updatePosition(e.touches[0].clientX);
    }
  }, { passive: true });

  window.addEventListener('touchmove', (e) => {
    if (!isDragging || !e.touches || !e.touches[0]) return;
    updatePosition(e.touches[0].clientX);
  }, { passive: true });

  window.addEventListener('touchend', () => {
    isDragging = false;
  });
}

/* ==========================================================================
   3. Contadores Numéricos (Animação Fluida por Easing)
   ========================================================================== */
function initMetricCounters() {
  const counters = document.querySelectorAll('[data-target-metric]');
  if (!counters.length) return;

  let animated = false;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !animated) {
        animated = true;
        counters.forEach(counter => animateNumber(counter));
      }
    });
  }, { threshold: 0.2 });

  const section = document.querySelector('.metrics-strip');
  if (section) observer.observe(section);

  function animateNumber(el) {
    const target = parseFloat(el.getAttribute('data-target-metric'));
    const isFloat = target % 1 !== 0;
    const duration = 1500;
    const start = performance.now();

    function step(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const easeOut = 1 - Math.pow(1 - progress, 3);
      const value = target * easeOut;

      el.textContent = isFloat ? value.toFixed(1) : Math.floor(value).toLocaleString('pt-BR');

      if (progress < 1) {
        requestAnimationFrame(step);
      } else {
        el.textContent = isFloat ? target.toFixed(1) : target.toLocaleString('pt-BR');
      }
    }

    requestAnimationFrame(step);
  }
}
