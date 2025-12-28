/* =========================
   Helpers
========================= */
const qs = (s, el = document) => el.querySelector(s);
const qsa = (s, el = document) => [...el.querySelectorAll(s)];

/* =========================
   NAV: menú móvil fullscreen
   Requiere clases:
   .nav__toggle, .nav__overlay, .nav__close, .nav__mLink
========================= */
(() => {
  const nav = qs(".nav");
  const toggle = qs(".nav__toggle");
  const overlay = qs(".nav__overlay");
  const closeBtn = qs(".nav__close");

  if (overlay) overlay.hidden = true;

  const openMenu = () => {
    if (!overlay || !toggle) return;
    overlay.hidden = false;
    toggle.setAttribute("aria-expanded", "true");
    document.body.style.overflow = "hidden";
  };

  const closeMenu = () => {
    if (!overlay || !toggle) return;
    overlay.hidden = true;
    toggle.setAttribute("aria-expanded", "false");
    document.body.style.overflow = "";
  };

  // Toggle open
  if (toggle && overlay) {
    toggle.addEventListener("click", () => {
      if (overlay.hidden) openMenu();
      else closeMenu();
    });
  }

  // Close button
  if (closeBtn) closeBtn.addEventListener("click", closeMenu);

  // Close when clicking any menu link
  if (overlay) {
    qsa("a", overlay).forEach((a) => a.addEventListener("click", closeMenu));
  }

  // Close on ESC
  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && overlay && !overlay.hidden) closeMenu();
  });

  // Navbar scrolled style
  const onScroll = () => {
    if (!nav) return;
    if (window.scrollY > 10) nav.classList.add("nav--scrolled");
    else nav.classList.remove("nav--scrolled");
  };
  window.addEventListener("scroll", onScroll, { passive: true });
  onScroll();
})();

/* =========================
   REVEAL + STAGGER on scroll
   Requiere clases:
   .reveal, .stagger
========================= */
(() => {
  const els = qsa(".reveal, .stagger");
  if (!els.length) return;

  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          // opcional: dejar de observar para ahorrar
          io.unobserve(entry.target);
        }
      });
    },
    {
      threshold: 0.08,
      rootMargin: "0px 0px -10% 0px",
    }
  );

  els.forEach((el) => io.observe(el));
})();

/* =========================
   FORM: Formspree + success swap
   Requiere:
   .contact-form (form)
   .form-success (div hidden)
========================= */
(() => {
  const form = qs(".contact-form");
  const success = qs(".form-success");
  if (success) success.hidden = true;

  if (!form || !success) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    try {
      const data = new FormData(form);
      const res = await fetch(form.action, {
        method: form.method,
        body: data,
        headers: { Accept: "application/json" },
      });

      if (res.ok) {
        form.style.display = "none";
        success.hidden = false;
      } else {
        alert("No se pudo enviar el mensaje. Inténtalo de nuevo.");
      }
    } catch (err) {
      alert("Error de conexión. Inténtalo más tarde.");
    }
  });
})();

/* =========================
   FOOTER YEAR
========================= */
(() => {
  const yearEl = qs("#year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();
})();

/* =========================
   SERVICIOS: modal "Ver ejemplo"
========================= */
(() => {
  const modal = document.getElementById("serviceModal");
  if (!modal) return;

  const modalTitle = modal.querySelector("#modalTitle");
  const modalText  = modal.querySelector("#modalText");

  const EXAMPLES = {
    branding: {
      title: "Ejemplo — Branding",
      text: "Caso tipo: rediseño de identidad con logo, sistema visual, paleta, tipografías y mini guía para aplicar la marca en piezas digitales."
    },
    social: {
      title: "Ejemplo — Redes",
      text: "Caso tipo: pack de plantillas y sistema de publicaciones. Consistencia visual + estructura para que el contenido se produzca rápido."
    },
    marketing: {
      title: "Ejemplo — Marketing",
      text: "Caso tipo: creatividades para campaña + landing/piezas web. Diseño enfocado a mensaje, claridad y conversión."
    }
  };

  const open = (key) => {
    const data = EXAMPLES[key] || { title: "Ejemplo", text: "Contenido de ejemplo." };
    modalTitle.textContent = data.title;
    modalText.textContent = data.text;
    modal.hidden = false;
    document.body.style.overflow = "hidden";
  };

  const close = () => {
    modal.hidden = true;
    document.body.style.overflow = "";
  };

  document.querySelectorAll(".js-open-service").forEach((btn) => {
    btn.addEventListener("click", (e) => {
      const card = e.currentTarget.closest(".service-card");
      const key = card?.dataset?.service;
      open(key);
    });
  });

  modal.addEventListener("click", (e) => {
    if (e.target.matches("[data-close-modal]")) close();
  });

  window.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && !modal.hidden) close();
  });
})();
