// Theme toggle
document.addEventListener("DOMContentLoaded", function () {
  const toggleBtn = document.getElementById("theme-toggle");
  const icon = toggleBtn.querySelector("i");

  toggleBtn.addEventListener("click", function () {
    document.body.classList.toggle("light");
    const isLight = document.body.classList.contains("light");
    icon.className = isLight ? "fas fa-sun" : "fas fa-moon";
    localStorage.setItem("theme", isLight ? "light" : "dark");
  });

  // Restore saved theme preference
  if (localStorage.getItem("theme") === "light") {
    document.body.classList.add("light");
    icon.className = "fas fa-sun";
  }

  // Scroll progress bar
  const progressBar = document.querySelector(".scroll-progress");
  function updateProgress() {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    if (progressBar) progressBar.style.width = progress + "%";
  }
  window.addEventListener("scroll", updateProgress, { passive: true });
  updateProgress();

  // Reveal-on-scroll for cards and sections
  const revealEls = document.querySelectorAll(".reveal");
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  if (prefersReducedMotion) {
    revealEls.forEach((el) => el.classList.add("is-visible"));
  } else {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.15 }
    );
    revealEls.forEach((el) => observer.observe(el));
  }
});

// Register service worker for caching (speeds up repeat visits)
if ("serviceWorker" in navigator) {
  window.addEventListener("load", () => {
    navigator.serviceWorker.register("serviceworker.js").catch((err) => {
      console.warn("[portfolio] Service worker registration failed:", err);
    });
  });
}

// Certificate lightbox
function openCertModal(imageSrc, title) {
  const modal = document.getElementById("cert-modal");
  const img = document.getElementById("cert-modal-img");
  const caption = document.getElementById("cert-modal-title");
  if (!modal || !img) return;

  img.src = imageSrc;
  img.alt = title || "Certificate";
  if (caption) caption.textContent = title || "";

  modal.classList.add("is-open");
  modal.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closeCertModal() {
  const modal = document.getElementById("cert-modal");
  if (!modal) return;
  modal.classList.remove("is-open");
  modal.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") closeCertModal();
});

document.addEventListener("DOMContentLoaded", () => {
  document.querySelectorAll(".cert-link").forEach((btn) => {
    btn.addEventListener("click", () => {
      openCertModal(btn.dataset.certImg, btn.dataset.certTitle);
    });
  });

  const backdrop = document.getElementById("cert-modal-backdrop");
  const closeBtn = document.getElementById("cert-modal-close");
  if (backdrop) backdrop.addEventListener("click", closeCertModal);
  if (closeBtn) closeBtn.addEventListener("click", closeCertModal);

  // Observability: flag any image that fails to load instead of showing a broken icon silently
  document.querySelectorAll(".project-image img, .cert-image img").forEach((img) => {
    img.addEventListener(
      "error",
      function () {
        console.warn("[portfolio] Missing image file:", this.getAttribute("src"));
        const wrapper = this.closest(".project-image, .cert-image");
        if (wrapper) wrapper.classList.add("img-missing");
      },
      { once: true }
    );
  });
});

// Rotating role words in the hero, e.g. "software developer" -> "game developer"
const roles = [
  ["software", "developer"],
  ["game", "developer"],
  ["web", "developer"],
  ["unity", "developer"]
];
let roleIndex = 0;

function rotateRole() {
  const wordA = document.querySelector(".role-word.role-a");
  const wordB = document.querySelector(".role-word.role-b");
  if (!wordA || !wordB) return;

  wordA.classList.add("swap-out");
  wordB.classList.add("swap-out");

  setTimeout(() => {
    roleIndex = (roleIndex + 1) % roles.length;
    wordA.textContent = roles[roleIndex][0];
    wordB.textContent = roles[roleIndex][1];
    wordA.classList.remove("swap-out");
    wordB.classList.remove("swap-out");
  }, 350);
}

setInterval(rotateRole, 2400);