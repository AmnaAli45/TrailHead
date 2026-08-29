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
      dot.style.transform = "translate(" + dotX + "px, " + dotY + "px)";
      requestAnimationFrame(animateDot);
    }
    animateDot();

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

  // ---------- 7. Checkout button (demo) ----------
  const checkoutBtn = document.querySelector(".btn-checkout");
  if (checkoutBtn) {
    checkoutBtn.addEventListener("click", () => {
      if (checkoutBtn.dataset.animating === "true") return;
      checkoutBtn.dataset.animating = "true";
      checkoutBtn.classList.add("btn-pulse");
      checkoutBtn.textContent = "Order Placed!";
      checkoutBtn.disabled = true;
      setTimeout(() => {
        window.location.href = "/";
      }, 1600);
    });
  }

  // ---------- 8. Contact form (demo) ----------
  const contactForm = document.querySelector(".contact-form");
  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault();
      const nameField = contactForm.querySelector("[name=name]");
      const emailField = contactForm.querySelector("[name=email]");
      const messageField = contactForm.querySelector("[name=message]");
      const successBox = document.querySelector(".contact-success");

      if (!nameField.value.trim() || !emailField.value.trim() || !messageField.value.trim()) {
        contactForm.classList.add("shake");
        setTimeout(() => contactForm.classList.remove("shake"), 400);
        return;
      }

      // GetScry ko is visitor ki identity bhejein (jo behavior se already track ho raha hai)
      const apiUrl = window.GETSCRY_API_URL || "http://127.0.0.1:8000";
      const sessionId = sessionStorage.getItem("getscry_session_id");

      if (sessionId) {
        fetch(apiUrl + "/identify", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            session_id: sessionId,
            name: nameField.value.trim(),
            email: emailField.value.trim(),
          }),
        }).catch(() => {});   // demo ke liye, fail silently
      }

      contactForm.style.display = "none";
      if (successBox) {
        successBox.style.display = "block";
        successBox.classList.add("reveal");
        requestAnimationFrame(() => successBox.classList.add("is-visible"));
      }
    });
  }

});