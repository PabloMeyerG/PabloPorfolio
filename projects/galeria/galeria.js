// galeria.js
(() => {
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));

  const year = $('#year');
  if (year) year.textContent = String(new Date().getFullYear());

  // Elements
  const lb = $('#lightbox');
  const lbImg = $('#lbImg');
  const lbTitle = $('#lbTitle');
  const lbDesc = $('#lbDesc');
  const btnPrev = $('#lbPrev');
  const btnNext = $('#lbNext');

  const chips = $$('.chip');
  const allItems = $$('.gallery-item');
  const allButtons = $$('.gallery-btn');

  let currentIndex = -1;
  let lastFocusEl = null;

  const getVisibleButtons = () => {
    return allButtons.filter((btn) => {
      const fig = btn.closest('.gallery-item');
      if (!fig) return false;
      // hidden items are display:none
      return fig.offsetParent !== null;
    });
  };

  const setScrollLock = (lock) => {
    document.body.classList.toggle('is-locked', lock);
  };

  const openLightboxAt = (index, visibleButtons) => {
    if (!lb || !lbImg || !lbTitle || !lbDesc) return;
    if (!visibleButtons.length) return;

    const safeIndex = ((index % visibleButtons.length) + visibleButtons.length) % visibleButtons.length;
    currentIndex = safeIndex;

    const btn = visibleButtons[safeIndex];
    const full = btn.dataset.full || '';
    const title = btn.dataset.title || '';
    const desc = btn.dataset.desc || '';

    lbImg.src = full;
    lbImg.alt = title || 'Imagen ampliada';
    lbTitle.textContent = title;
    lbDesc.textContent = desc;

    lb.classList.add('is-open');
    lb.setAttribute('aria-hidden', 'false');

    setScrollLock(true);

    // Focus management
    lastFocusEl = document.activeElement;
    // Prefer close button focus
    const closeBtn = $('[data-close]', lb);
    (closeBtn || btnNext || btnPrev || lb).focus?.();
  };

  const closeLightbox = () => {
    if (!lb || !lbImg || !lbTitle || !lbDesc) return;

    lb.classList.remove('is-open');
    lb.setAttribute('aria-hidden', 'true');

    // reset
    lbImg.src = '';
    lbImg.alt = '';
    lbTitle.textContent = '';
    lbDesc.textContent = '';

    setScrollLock(false);

    // return focus
    if (lastFocusEl && typeof lastFocusEl.focus === 'function') lastFocusEl.focus();
    lastFocusEl = null;
    currentIndex = -1;
  };

  // Open on click (delegation)
  document.addEventListener('click', (e) => {
    const btn = e.target.closest?.('.gallery-btn');
    if (!btn) return;

    const visibleButtons = getVisibleButtons();
    const idx = visibleButtons.indexOf(btn);
    openLightboxAt(idx, visibleButtons);
  });

  // Close handlers
  if (lb) {
    lb.addEventListener('click', (e) => {
      if (e.target.matches('[data-close]')) closeLightbox();
    });
  }

  document.addEventListener('keydown', (e) => {
    const isOpen = lb?.classList.contains('is-open');
    if (!isOpen) return;

    if (e.key === 'Escape') {
      e.preventDefault();
      closeLightbox();
      return;
    }

    // Navigation
    if (e.key === 'ArrowLeft' || e.key === 'ArrowRight') {
      e.preventDefault();
      const visibleButtons = getVisibleButtons();
      if (!visibleButtons.length) return;

      const delta = e.key === 'ArrowLeft' ? -1 : 1;
      openLightboxAt(currentIndex + delta, visibleButtons);
      return;
    }

    // Basic focus trap
    if (e.key === 'Tab' && lb) {
      const focusables = $$(
        'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])',
        lb
      ).filter((el) => !el.hasAttribute('disabled'));

      if (!focusables.length) return;

      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      const active = document.activeElement;

      if (!e.shiftKey && active === last) {
        e.preventDefault();
        first.focus();
      } else if (e.shiftKey && active === first) {
        e.preventDefault();
        last.focus();
      }
    }
  });

  // Prev/Next buttons
  btnPrev?.addEventListener('click', () => {
    const visibleButtons = getVisibleButtons();
    if (!visibleButtons.length) return;
    openLightboxAt(currentIndex - 1, visibleButtons);
  });

  btnNext?.addEventListener('click', () => {
    const visibleButtons = getVisibleButtons();
    if (!visibleButtons.length) return;
    openLightboxAt(currentIndex + 1, visibleButtons);
  });

  // Filters
  const setActiveChip = (chip) => {
    chips.forEach((c) => {
      c.classList.remove('is-active');
      c.setAttribute('aria-selected', 'false');
    });
    chip.classList.add('is-active');
    chip.setAttribute('aria-selected', 'true');
  };

  const applyFilter = (filter) => {
    allItems.forEach((item) => {
      const tags = (item.dataset.tags || '')
        .split(/\s+/)
        .map((t) => t.trim().toLowerCase())
        .filter(Boolean);

      const show = filter === 'all' || tags.includes(filter);
      item.style.display = show ? '' : 'none';
    });

    // If lightbox open and filtered out, close
    if (lb?.classList.contains('is-open')) {
      const visibleButtons = getVisibleButtons();
      if (!visibleButtons.length) closeLightbox();
      else openLightboxAt(0, visibleButtons);
    }
  };

  chips.forEach((chip) => {
    chip.addEventListener('click', () => {
      const filter = (chip.dataset.filter || 'all').toLowerCase();
      setActiveChip(chip);
      applyFilter(filter);
    });
  });

  // Click on any [data-close] inside lightbox (close button)
  $$('.lightbox [data-close]').forEach((b) => {
    if (b.tagName === 'BUTTON') b.tabIndex = 0;
    b.addEventListener('click', (e) => {
      // backdrop uses data-close too; already handled, but this ensures button works always
      if (e.currentTarget.matches('button')) closeLightbox();
    });
  });
})();
