// main.js
(() => {
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  // ===== Year =====
  const y = $('#year');
  if (y) y.textContent = String(new Date().getFullYear());

  // ===== Navbar: scrolled state =====
  const nav = $('.nav');
  const onScroll = () => {
    if (!nav) return;
    nav.classList.toggle('nav--scrolled', window.scrollY > 10);
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // ===== Mobile menu =====
  const burg = $('#navBurg');
  const overlay = $('#navOverlay');
  const closeBtn = $('#navClose');

  const setMenuOpen = (open) => {
    if (!nav || !overlay || !burg) return;
    nav.classList.toggle('nav--open', open);
    overlay.hidden = !open;
    burg.setAttribute('aria-expanded', open ? 'true' : 'false');

    // lock body scroll when open
    document.body.style.overflow = open ? 'hidden' : '';
  };

  if (burg && overlay) {
    burg.addEventListener('click', () => setMenuOpen(true));
    overlay.addEventListener('click', (e) => {
      // click outside the menu box closes
      if (e.target === overlay) setMenuOpen(false);
    });
  }
  if (closeBtn) closeBtn.addEventListener('click', () => setMenuOpen(false));

  // close on link click
  $$('.nav__mLink', overlay || document).forEach((a) => {
    a.addEventListener('click', () => setMenuOpen(false));
  });

  // close on ESC
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') setMenuOpen(false);
  });

  // ===== Reveal animations (IntersectionObserver) =====
  const revealEls = $$('.reveal, .stagger');
  if ('IntersectionObserver' in window && revealEls.length) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.18 }
    );

    revealEls.forEach((el) => io.observe(el));
  } else {
    // fallback
    revealEls.forEach((el) => el.classList.add('is-visible'));
  }

  // ===== Contact form: swap to success message =====
  const form = $('.contact-form');
  const success = $('.form-success');

  if (form && success) {
    form.addEventListener('submit', async (e) => {
      // Let HTML validation run first
      if (!form.checkValidity()) return;

      e.preventDefault();
      const action = form.getAttribute('action');
      const formData = new FormData(form);

      try {
        const res = await fetch(action, {
          method: 'POST',
          body: formData,
          headers: { Accept: 'application/json' },
        });

        if (!res.ok) throw new Error('Network response was not ok');

        // Hide form + show success
        form.style.display = 'none';
        success.hidden = false;

        // optional: reset for next time
        form.reset();
      } catch (err) {
        // If it fails, keep the form and show a friendly message
        alert('Ups… No se pudo enviar. Prueba de nuevo o escríbeme por email.');
        console.error(err);
      }
    });
  }
})();
