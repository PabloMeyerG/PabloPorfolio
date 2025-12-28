// Año automático
document.getElementById("year").textContent = new Date().getFullYear();

// Menú móvil simple
const burger = document.querySelector(".nav__burger");
const navLinks = document.querySelector(".nav__links");

if (burger && navLinks) {
  burger.addEventListener("click", () => {
    const open = burger.getAttribute("aria-expanded") === "true";
    burger.setAttribute("aria-expanded", String(!open));

    if (open) {
      navLinks.style.display = "none";
      return;
    }

    navLinks.style.display = "flex";
    navLinks.style.position = "absolute";
    navLinks.style.right = "18px";
    navLinks.style.top = "64px";
    navLinks.style.flexDirection = "column";
    navLinks.style.gap = "12px";
    navLinks.style.padding = "12px";
    navLinks.style.background = "rgba(0,0,0,.9)";
    navLinks.style.border = "1px solid rgba(255,255,255,.08)";
    navLinks.style.borderRadius = "16px";
    navLinks.style.backdropFilter = "blur(10px)";
    navLinks.style.minWidth = "220px";
  });
}

// ===== Reveal on scroll (Intersection Observer) =====
const revealEls = document.querySelectorAll(".reveal, .stagger");

const io = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        // anima una sola vez:
        io.unobserve(entry.target);
      }
    });
  },
  { threshold: 0.08, rootMargin: "0px 0px -10% 0px" }
);

revealEls.forEach((el) => io.observe(el));

// ===== Navbar scrolled state =====
const nav = document.querySelector(".nav");
const setNavState = () => {
  if (!nav) return;
  if (window.scrollY > 10) nav.classList.add("nav--scrolled");
  else nav.classList.remove("nav--scrolled");
};
window.addEventListener("scroll", setNavState, { passive: true });
setNavState();

const contactForm = document.querySelector(".contact-form");
const successBox = document.querySelector(".form-success");

if (contactForm) {
  contactForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    try {
      const data = new FormData(contactForm);
      const res = await fetch(contactForm.action, {
        method: contactForm.method,
        body: data,
        headers: { Accept: "application/json" }
      });

      if (res.ok) {
        contactForm.style.display = "none";
        successBox.hidden = false;
      } else {
        alert("No se pudo enviar el mensaje. Inténtalo de nuevo.");
      }
    } catch (err) {
      alert("Error de conexión. Inténtalo más tarde.");
    }
  });
}


