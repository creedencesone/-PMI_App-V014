/**
 * PMI Mind — Motion Library (v2.0)
 * Native Web Animations API + CSS custom properties.
 * Zero dependencies, < 3KB gzipped.
 * Respects prefers-reduced-motion.
 */

const Motion = (() => {
  // ============================================
  // Configuration & Helpers
  // ============================================
  const prefersReducedMotion = () =>
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const defaultEasing = 'cubic-bezier(0.25, 0.46, 0.45, 0.94)';
  const springEasing = 'cubic-bezier(0.34, 1.56, 0.64, 1)';
  const defaultDuration = 200; // ms

  const getDuration = (duration = defaultDuration) =>
    prefersReducedMotion() ? 0 : duration;

  const createKeyframes = (from, to) => {
    const keys = new Set([...Object.keys(from), ...Object.keys(to)]);
    return Array.from(keys).map(key => ({
      [key]: [from[key] ?? '', to[key] ?? '']
    })).reduce((acc, cur) => ({ ...acc, ...cur }), {});
  };

  // ============================================
  // Core Animation Function
  // ============================================
  const animate = (element, keyframes, options = {}) => {
    if (!element) return Promise.resolve();
    if (prefersReducedMotion()) {
      // Apply final state immediately
      Object.assign(element.style, keyframes[keyframes.length - 1] || {});
      return Promise.resolve();
    }

    const anim = element.animate(keyframes, {
      duration: options.duration ?? defaultDuration,
      easing: options.easing ?? defaultEasing,
      delay: options.delay ?? 0,
      fill: options.fill ?? 'both',
      direction: options.direction ?? 'normal',
      iterations: options.iterations ?? 1,
      composite: options.composite ?? 'replace'
    });

    return anim.finished;
  };

  // ============================================
  // Preset Animations
  // ============================================
  const presets = {
    // Entrance
    fadeIn: (el, opts = {}) => animate(el, [
      { opacity: 0 },
      { opacity: 1 }
    ], { duration: 300, easing: defaultEasing, ...opts }),

    fadeOut: (el, opts = {}) => animate(el, [
      { opacity: 1 },
      { opacity: 0 }
    ], { duration: 200, easing: defaultEasing, ...opts }),

    slideUp: (el, opts = {}) => animate(el, [
      { opacity: 0, transform: 'translateY(20px)' },
      { opacity: 1, transform: 'translateY(0)' }
    ], { duration: 400, easing: springEasing, ...opts }),

    slideDown: (el, opts = {}) => animate(el, [
      { opacity: 0, transform: 'translateY(-20px)' },
      { opacity: 1, transform: 'translateY(0)' }
    ], { duration: 400, easing: springEasing, ...opts }),

    slideInLeft: (el, opts = {}) => animate(el, [
      { opacity: 0, transform: 'translateX(-30px)' },
      { opacity: 1, transform: 'translateX(0)' }
    ], { duration: 400, easing: springEasing, ...opts }),

    slideInRight: (el, opts = {}) => animate(el, [
      { opacity: 0, transform: 'translateX(30px)' },
      { opacity: 1, transform: 'translateX(0)' }
    ], { duration: 400, easing: springEasing, ...opts }),

    scaleIn: (el, opts = {}) => animate(el, [
      { opacity: 0, transform: 'scale(0.95)' },
      { opacity: 1, transform: 'scale(1)' }
    ], { duration: 300, easing: springEasing, ...opts }),

    scaleOut: (el, opts = {}) => animate(el, [
      { opacity: 1, transform: 'scale(1)' },
      { opacity: 0, transform: 'scale(0.95)' }
    ], { duration: 200, easing: defaultEasing, ...opts }),

    // Stagger entrance for lists (máximo 8 elementos para evitar sobrecarga)
    staggerIn: (elements, opts = {}) => {
      const delay = opts.staggerDelay ?? 80;
      const startDelay = opts.startDelay ?? 0;
      const max = opts.max ?? 8;
      return Promise.all(
        Array.from(elements).slice(0, max).map((el, i) =>
          presets.slideUp(el, {
            delay: startDelay + i * delay,
            duration: opts.duration ?? 400,
            easing: springEasing
          })
        )
      );
    },

    // Micro-interactions
    hoverLift: (el) => animate(el, [
      { transform: 'translateY(0)' },
      { transform: 'translateY(-4px)' }
    ], { duration: 200, easing: defaultEasing, fill: 'forwards' }),

    hoverLiftReset: (el) => animate(el, [
      { transform: 'translateY(-4px)' },
      { transform: 'translateY(0)' }
    ], { duration: 300, easing: springEasing }),

    hoverScale: (el, scale = 1.02) => animate(el, [
      { transform: 'scale(1)' },
      { transform: `scale(${scale})` }
    ], { duration: 150, easing: defaultEasing, fill: 'forwards' }),

    hoverScaleReset: (el) => animate(el, [
      { transform: 'scale(1.02)' },
      { transform: 'scale(1)' }
    ], { duration: 250, easing: springEasing }),

    tapScale: (el, scale = 0.97) => animate(el, [
      { transform: 'scale(1)' },
      { transform: `scale(${scale})` }
    ], { duration: 80, easing: defaultEasing, fill: 'forwards' }),

    tapScaleReset: (el) => animate(el, [
      { transform: 'scale(0.97)' },
      { transform: 'scale(1)' }
    ], { duration: 150, easing: springEasing }),

    // Focus ring
    focusRing: (el) => animate(el, [
      { boxShadow: '0 0 0 0 var(--color-primary)' },
      { boxShadow: '0 0 0 4px var(--color-primary-subtle)' }
    ], { duration: 200, easing: defaultEasing }),

    // Progress bar
    progressFill: (el, targetWidth, opts = {}) => animate(el, [
      { width: '0%' },
      { width: `${targetWidth}%` }
    ], { duration: 800, easing: springEasing, ...opts }),

    // Modal / Overlay
    modalOpen: (el, opts = {}) => Promise.all([
      animate(el.querySelector('.modal-backdrop') || el, [
        { opacity: 0 },
        { opacity: 1 }
      ], { duration: 200, easing: defaultEasing }),
      animate(el.querySelector('.modal-content') || el, [
        { opacity: 0, transform: 'scale(0.95) translateY(10px)' },
        { opacity: 1, transform: 'scale(1) translateY(0)' }
      ], { duration: 300, easing: springEasing })
    ]),

    modalClose: (el, opts = {}) => Promise.all([
      animate(el.querySelector('.modal-backdrop') || el, [
        { opacity: 1 },
        { opacity: 0 }
      ], { duration: 150, easing: defaultEasing }),
      animate(el.querySelector('.modal-content') || el, [
        { opacity: 1, transform: 'scale(1) translateY(0)' },
        { opacity: 0, transform: 'scale(0.95) translateY(10px)' }
      ], { duration: 200, easing: defaultEasing })
    ]),

    // Toast
    toastShow: (el, opts = {}) => animate(el, [
      { opacity: 0, transform: 'translateX(100%) translateY(0)' },
      { opacity: 1, transform: 'translateX(0) translateY(0)' }
    ], { duration: 300, easing: springEasing, ...opts }),

    toastHide: (el, opts = {}) => animate(el, [
      { opacity: 1, transform: 'translateX(0)' },
      { opacity: 0, transform: 'translateX(100%)' }
    ], { duration: 200, easing: defaultEasing, ...opts }),

    // Sidebar
    sidebarOpen: (el, opts = {}) => animate(el, [
      { transform: 'translateX(-100%)' },
      { transform: 'translateX(0)' }
    ], { duration: 300, easing: springEasing, ...opts }),

    sidebarClose: (el, opts = {}) => animate(el, [
      { transform: 'translateX(0)' },
      { transform: 'translateX(-100%)' }
    ], { duration: 250, easing: defaultEasing, ...opts }),

    // Shimmer / Skeleton
    shimmer: (el) => {
      const keyframes = [
        { backgroundPosition: '-200% 0' },
        { backgroundPosition: '200% 0' }
      ];
      return el.animate(keyframes, {
        duration: 1500,
        easing: 'linear',
        iterations: Infinity
      });
    },

    // Pulse (for loading states)
    pulse: (el) => animate(el, [
      { opacity: 1 },
      { opacity: 0.5 },
      { opacity: 1 }
    ], { duration: 1500, easing: 'ease-in-out', iterations: Infinity }),

    // Spin (for loading spinners)
    spin: (el) => animate(el, [
      { transform: 'rotate(0deg)' },
      { transform: 'rotate(360deg)' }
    ], { duration: 1000, easing: 'linear', iterations: Infinity }),

    // Wiggle (for errors)
    wiggle: (el) => animate(el, [
      { transform: 'translateX(0)' },
      { transform: 'translateX(-8px)' },
      { transform: 'translateX(8px)' },
      { transform: 'translateX(-8px)' },
      { transform: 'translateX(8px)' },
      { transform: 'translateX(0)' }
    ], { duration: 500, easing: defaultEasing })
  };

  // ============================================
  // Scroll-triggered Animations (IntersectionObserver)
  // ============================================
  const scrollObservers = new Map();

  const observeScroll = (elements, callback, options = {}) => {
    if (prefersReducedMotion()) {
      elements.forEach(el => callback(el, true));
      return () => {};
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          callback(entry.target, true);
          if (options.once !== false) observer.unobserve(entry.target);
        } else if (options.once === false) {
          callback(entry.target, false);
        }
      });
    }, {
      root: options.root ?? null,
      rootMargin: options.rootMargin ?? '0px 0px -10% 0px',
      threshold: options.threshold ?? 0.1
    });

    elements.forEach(el => observer.observe(el));

    return () => observer.disconnect();
  };

  // ============================================
  // Stagger helper for grids/lists
  // ============================================
  const stagger = (elements, animationFn, staggerDelay = 80) => {
    return Promise.all(
      Array.from(elements).map((el, i) =>
        animationFn(el, { delay: i * staggerDelay })
      )
    );
  };

  // ============================================
  // Public API
  // ============================================
  return {
    // Core
    animate,
    createKeyframes,

    // Presets
    ...presets,

    // Scroll
    observeScroll,
    stagger,

    // Helpers
    prefersReducedMotion,
    getDuration
  };
})();

// Auto-initialize common patterns on DOM ready
document.addEventListener('DOMContentLoaded', () => {
  // Stagger animate stat cards
  const statCards = document.querySelectorAll('.stat-card');
  if (statCards.length) {
    Motion.staggerIn(statCards, { startDelay: 100 });
  }

  // Stagger animate project cards
  const projectCards = document.querySelectorAll('.project-card');
  if (projectCards.length) {
    Motion.staggerIn(projectCards, { startDelay: 200, staggerDelay: 60 });
  }

  // Animate progress bars on scroll
  Motion.observeScroll(
    document.querySelectorAll('.progress-fill'),
    (el, isVisible) => {
      if (isVisible) {
        const targetWidth = el.style.width || el.getAttribute('data-progress') || '0%';
        const width = parseFloat(targetWidth);
        if (width > 0) Motion.progressFill(el, width);
      }
    },
    { once: true }
  );

  // Animate elements with .scroll-reveal class
  Motion.observeScroll(
    document.querySelectorAll('.scroll-reveal'),
    (el, isVisible) => {
      if (isVisible) el.classList.add('revealed');
    },
    { once: true }
  );

  // Add hover/tap interactions to interactive elements
  document.querySelectorAll('[data-hover-lift]').forEach(el => {
    el.addEventListener('mouseenter', () => Motion.hoverLift(el));
    el.addEventListener('mouseleave', () => Motion.hoverLiftReset(el));
  });

  document.querySelectorAll('[data-hover-scale]').forEach(el => {
    const scale = parseFloat(el.dataset.hoverScale) || 1.02;
    el.addEventListener('mouseenter', () => Motion.hoverScale(el, scale));
    el.addEventListener('mouseleave', () => Motion.hoverScaleReset(el));
  });

  document.querySelectorAll('[data-tap-scale]').forEach(el => {
    el.addEventListener('mousedown', () => Motion.tapScale(el));
    el.addEventListener('mouseup', () => Motion.tapScaleReset(el));
    el.addEventListener('mouseleave', () => Motion.tapScaleReset(el));
    // Touch
    el.addEventListener('touchstart', () => Motion.tapScale(el), { passive: true });
    el.addEventListener('touchend', () => Motion.tapScaleReset(el), { passive: true });
  });
});

// Pausar animaciones infinitas cuando la pestaña no está visible o el
// elemento sale del viewport (ahorro de batería y menos ruido visual).
(function gestionarAnimacionesInfinitas() {
  if (typeof document === 'undefined' || !document.getAnimations) return;
  // Conservamos TODAS las animaciones infinitas (incluso pausadas) en un Set:
  // filtrar por playState==='running' impedía reanudarlas después de pausarlas.
  const registradas = new Set();
  const registrar = () => document.getAnimations().forEach(a => {
    if (a.effect && a.effect.getTiming().iterations === Infinity) {
      registradas.add(a);
    }
  });
  registrar();

  document.addEventListener('visibilitychange', () => {
    registrar();
    registradas.forEach(a => {
      if (document.hidden) a.pause();
      else if (!a._pmiPorViewport) a.play();
    });
  });

  if (typeof IntersectionObserver !== 'undefined') {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        registrar();
        registradas.forEach(a => {
          if (a.effect?.target !== entry.target) return;
          a._pmiPorViewport = !entry.isIntersecting;
          if (entry.isIntersecting && !document.hidden) a.play();
          else a.pause();
        });
      });
    }, { threshold: 0 });
    const observarNuevas = () => registrar();
    document.addEventListener('pmi:animationcreated', observarNuevas);
    // Registro inicial y sondeo ocasional para animaciones creadas dinámicamente
    registrar();
    registradas.forEach(a => { if (a.effect?.target) observer.observe(a.effect.target); });
    setInterval(() => {
      registrar();
      registradas.forEach(a => { if (a.effect?.target) observer.observe(a.effect.target); });
    }, 2000);
  }
})();

// Export for ES modules
if (typeof module !== 'undefined' && module.exports) {
  module.exports = Motion;
}