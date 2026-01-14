// main.js
(() => {
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  const init = () => {
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

    if (nav && burg && overlay) {
      const setMenuOpen = (open) => {
        nav.classList.toggle('nav--open', open);
        overlay.hidden = !open;
        burg.setAttribute('aria-expanded', open ? 'true' : 'false');
        document.body.style.overflow = '';
      };

      const isOpen = () => nav.classList.contains('nav--open');

      // estado inicial
      overlay.hidden = true;
      burg.setAttribute('aria-expanded', 'false');

      burg.addEventListener('click', (e) => {
        e.preventDefault();
        setMenuOpen(!isOpen());
      });

      if (closeBtn) {
        closeBtn.addEventListener('click', (e) => {
          e.preventDefault();
          setMenuOpen(false);
        });
      }

      // cerrar si clickas el fondo del overlay
      overlay.addEventListener('click', (e) => {
        if (e.target === overlay) setMenuOpen(false);
      });

      // cerrar al clickar links
      $$('.nav__mLink', overlay).forEach((a) => {
        a.addEventListener('click', () => setMenuOpen(false));
      });

      // cerrar con ESC
      window.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') setMenuOpen(false);
      });

      // cerrar si vuelves a desktop
      window.addEventListener('resize', () => {
        if (window.innerWidth > 860) setMenuOpen(false);
      });
    }

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
      revealEls.forEach((el) => el.classList.add('is-visible'));
    }

    // ===== Contact form: swap to success message =====
    const form = $('.contact-form');
    const success = $('.form-success');

    if (form && success) {
      form.addEventListener('submit', async (e) => {
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

          form.style.display = 'none';
          success.hidden = false;
          form.reset();
        } catch (err) {
          alert('Ups… No se pudo enviar. Prueba de nuevo o escríbeme por email.');
          console.error(err);
        }
      });
    }
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
