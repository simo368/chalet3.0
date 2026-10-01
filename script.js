(() => {
  const header = document.querySelector('.site-header');
  const toggle = document.querySelector('.menu-toggle');
  const nav = document.querySelector('.main-nav');

  const updateHeader = () => header.classList.toggle('scrolled', window.scrollY > 32);
  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });

  toggle.addEventListener('click', () => {
    const isOpen = nav.classList.toggle('open');
    toggle.setAttribute('aria-expanded', String(isOpen));
    toggle.setAttribute('aria-label', isOpen ? 'Chiudi il menu' : 'Apri il menu');
  });
  nav.addEventListener('click', (event) => {
    if (event.target.closest('a')) {
      nav.classList.remove('open');
      toggle.setAttribute('aria-expanded', 'false');
      toggle.setAttribute('aria-label', 'Apri il menu');
    }
  });

  const momentItems = [...document.querySelectorAll('.moment-item')];
  const momentImage = document.querySelector('#moment-image');
  momentItems.forEach((item) => {
    const activate = () => {
      momentItems.forEach((entry) => entry.classList.toggle('active', entry === item));
      momentImage.alt = `Atmosfera Chalet 3.0: ${item.querySelector('strong').textContent.toLowerCase()}`;
      momentImage.src = item.dataset.image;
    };
    item.addEventListener('mouseenter', activate);
    item.addEventListener('focus', activate);
  });

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
