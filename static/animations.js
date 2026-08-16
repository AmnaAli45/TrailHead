/* Trailhead - Interactive/animation layer */

document.addEventListener("DOMContentLoaded", () => {

  // ---------- 1. Scroll-reveal ----------
  const revealEls = document.querySelectorAll(".reveal");
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("is-visible");
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15 });
  revealEls.forEach((el) => revealObserver.observe(el));

  // ---------- 2. Nav shrink on scroll ----------
  const nav = document.querySelector(".site-nav");
  if (nav) {
    window.addEventListener("scroll", () => {
      if (window.scrollY > 40) {
        nav.classList.add("scrolled");
      } else {
        nav.classList.remove("scrolled");
      }
    });
  }

  // ---------- 3. Animated counters ----------
  const counters = document.querySelectorAll("[data-count-to]");
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.4 });
  counters.forEach((el) => counterObserver.observe(el));

  function animateCounter(el) {
    const target = el.getAttribute("data-count-to");
    const suffix = el.getAttribute("data-suffix") || "";
    const numericTarget = parseInt(target.replace(/\D/g, ""), 10);
    if (isNaN(numericTarget)) return;
    let current = 0;
    const duration = 1200;
    const stepTime = 16;
    const steps = duration / stepTime;
    const increment = numericTarget / steps;

    const timer = setInterval(() => {
      current += increment;
      if (current >= numericTarget) {
        el.textContent = target;
        clearInterval(timer);
      } else {
        el.textContent = Math.floor(current) + suffix;
      }
    }, stepTime);
  }

  // ---------- 4. Trail-blaze cursor follower (desktop only) ----------
  const isTouchDevice = window.matchMedia("(pointer: coarse)").matches;
  if (!isTouchDevice) {
    const dot = document.createElement("div");
    dot.className = "blaze-cursor";
    document.body.appendChild(dot);

    let mouseX = 0, mouseY = 0;
    let dotX = 0, dotY = 0;

    window.addEventListener("mousemove", (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      dot.style.opacity = "1";
    });

    document.addEventListener("mouseleave", () => { dot.style.opacity = "0"; });

    function animateDot() {
      dotX += (mouseX - dotX) * 0.18;
      dotY += (mouseY - dotY) * 0.18;
      dot.style.transform = `translate(${dotX}px, ${dotY}px)`;
      requestAnimationFrame(animateDot);
    }
    animateDot();

    // Grow the dot slightly over links/buttons/cards
    document.querySelectorAll("a, button").forEach((el) => {
      el.addEventListener("mouseenter", () => dot.classList.add("blaze-cursor--hover"));
      el.addEventListener("mouseleave", () => dot.classList.remove("blaze-cursor--hover"));
    });
  }

  // ---------- 5. Size selector interactivity (product page) ----------
  document.querySelectorAll(".size-swatch").forEach((swatch) => {
    swatch.addEventListener("click", () => {
      document.querySelectorAll(".size-swatch").forEach((s) => s.classList.remove("selected"));
      swatch.classList.add("selected");
    });
  });

  // ---------- 6. Add to Cart micro-interaction ----------
  document.querySelectorAll(".btn-add-cart").forEach((btn) => {
    btn.addEventListener("click", () => {
      if (btn.dataset.animating === "true") return;
      btn.dataset.animating = "true";
      const originalText = btn.textContent;
      btn.classList.add("btn-pulse");
      btn.textContent = "Added ✓";
      setTimeout(() => {
        btn.classList.remove("btn-pulse");
        btn.textContent = originalText;
        btn.dataset.animating = "false";
      }, 1400);
    });
  });

});