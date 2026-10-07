(() => {
  const header = document.querySelector('.site-header');
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.main-nav');
  const backdrop = document.querySelector('.nav-backdrop');

  // Sticky header on scroll
  const updateHeader = () => {
    if (header) {
      header.classList.toggle('scrolled', window.scrollY > 20);
    }
  };
  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });

  // Menu state management
  const setMenu = (open) => {
    if (!toggle || !nav) return;
    toggle.classList.toggle('open', open);
    nav.classList.toggle('open', open);
    if (backdrop) backdrop.classList.toggle('open', open);
    document.body.classList.toggle('menu-open', open);
    toggle.setAttribute('aria-expanded', String(open));
    toggle.setAttribute('aria-label', open ? 'Chiudi il menu' : 'Apri il menu');
  };

  if (toggle) {
    toggle.addEventListener('click', (e) => {
      e.stopPropagation();
      const willOpen = !nav.classList.contains('open');
      setMenu(willOpen);
    });
  }

  if (backdrop) {
    backdrop.addEventListener('click', () => setMenu(false));
  }

  // Close menu on link click & smooth scroll to anchors with header offset
  document.addEventListener('click', (e) => {
    const link = e.target.closest('a[href^="#"]');
    if (!link) return;

    const href = link.getAttribute('href');
    if (!href || href === '#') return;

    // Always close mobile menu if opened
    if (nav && nav.classList.contains('open')) {
      setMenu(false);
    }

    if (href === '#top') {
      e.preventDefault();
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      const headerHeight = header ? header.offsetHeight : 70;
      const targetPos = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
      window.scrollTo({
        top: Math.max(0, targetPos),
        behavior: 'smooth'
      });
      if (history.pushState) {
        history.pushState(null, '', href);
      }
    }
  });

  // Close menu on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && nav && nav.classList.contains('open')) {
      setMenu(false);
    }
  });

  // Auto-close on desktop resize
  window.addEventListener('resize', () => {
    if (window.innerWidth > 860 && nav && nav.classList.contains('open')) {
      setMenu(false);
    }
  });

  // Moments interactive preview
  const momentItems = [...document.querySelectorAll('.moment-item')];
  const momentImage = document.querySelector('#moment-image');
  if (momentItems.length && momentImage) {
    momentItems.forEach((item) => {
      const activate = () => {
        momentItems.forEach((entry) => entry.classList.toggle('active', entry === item));
        const strong = item.querySelector('strong');
        if (strong) {
          momentImage.alt = `Atmosfera Chalet 3.0: ${strong.textContent.toLowerCase()}`;
        }
        if (item.dataset.image) {
          momentImage.src = item.dataset.image;
        }
      };
      item.addEventListener('mouseenter', activate);
      item.addEventListener('focus', activate);
    });
  }

  // Scroll animations
  if ('IntersectionObserver' in window && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    const observer = new IntersectionObserver((entries, currentObserver) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          currentObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    document.querySelectorAll('.intro-grid,.location-card,.moments-head,.lunch-copy,.food-panel,.event-feature,.private-copy,.carpi-copy,.booking-grid article').forEach((el) => {
      el.classList.add('reveal');
      observer.observe(el);
    });
  }
})();
