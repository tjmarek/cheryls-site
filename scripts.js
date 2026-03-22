/* ============================================
   scripts.js
   From Burnout To Breakthrough — Cheryl Donahue
   ============================================ */

(function () {
  "use strict";

  /* ============================================
     UTILITY: Respect reduced motion preference
     ============================================ */
  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  /* ============================================
     MOBILE NAV TOGGLE
     ============================================ */
  function initMobileNav() {
    const toggle = document.querySelector(".nav-toggle");
    const mobileNav = document.querySelector(".nav-mobile");

    if (!toggle || !mobileNav) return;

    toggle.addEventListener("click", () => {
      const isOpen = toggle.classList.contains("is-open");

      toggle.classList.toggle("is-open");
      toggle.setAttribute("aria-expanded", String(!isOpen));

      if (!isOpen) {
        mobileNav.style.display = "flex";
        // Animate in
        if (!prefersReducedMotion) {
          mobileNav.style.opacity = "0";
          mobileNav.style.transform = "translateY(-6px)";
          mobileNav.style.transition = "opacity 0.2s ease, transform 0.2s ease";
          requestAnimationFrame(() => {
            mobileNav.style.opacity = "1";
            mobileNav.style.transform = "translateY(0)";
          });
        }
      } else {
        if (!prefersReducedMotion) {
          mobileNav.style.opacity = "0";
          mobileNav.style.transform = "translateY(-6px)";
          setTimeout(() => {
            mobileNav.style.display = "none";
          }, 200);
        } else {
          mobileNav.style.display = "none";
        }
      }
    });

    // Close mobile nav when a link is clicked
    mobileNav.querySelectorAll("a").forEach((link) => {
      link.addEventListener("click", () => {
        toggle.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
        mobileNav.style.opacity = "0";
        setTimeout(() => {
          mobileNav.style.display = "none";
        }, 200);
      });
    });

    // Close mobile nav on outside click
    document.addEventListener("click", (e) => {
      if (
        !toggle.contains(e.target) &&
        !mobileNav.contains(e.target) &&
        toggle.classList.contains("is-open")
      ) {
        toggle.classList.remove("is-open");
        toggle.setAttribute("aria-expanded", "false");
        mobileNav.style.opacity = "0";
        setTimeout(() => {
          mobileNav.style.display = "none";
        }, 200);
      }
    });
  }

  /* ============================================
     HEADER: Add scrolled shadow on scroll
     ============================================ */
  function initHeaderScroll() {
    const header = document.querySelector("header");
    if (!header) return;

    const onScroll = () => {
      if (window.scrollY > 12) {
        header.style.boxShadow = "0 2px 16px rgba(26,26,26,0.07)";
      } else {
        header.style.boxShadow = "none";
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
  }

  /* ============================================
     SCROLL REVEAL
     Reveals .reveal and .reveal-group elements
     as they enter the viewport
     ============================================ */
  function initScrollReveal() {
    if (prefersReducedMotion) {
      // Skip animation — just make everything visible
      document.querySelectorAll(".reveal, .reveal-group").forEach((el) => {
        el.classList.add("is-visible");
      });
      return;
    }

    const revealEls = document.querySelectorAll(".reveal, .reveal-group");
    if (!revealEls.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            observer.unobserve(entry.target);
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: "0px 0px -40px 0px",
      }
    );

    revealEls.forEach((el) => observer.observe(el));
  }

  /* ============================================
     COUNT-UP ANIMATION
     Targets elements with data-countup attribute
     Usage: <div data-countup="27" data-suffix="+" data-decimals="0">0</div>
     ============================================ */
  function initCountUp() {
    if (prefersReducedMotion) return;

    const countEls = document.querySelectorAll("[data-countup]");
    if (!countEls.length) return;

    const duration = 1800; // ms

    function animateCount(el) {
      const target = parseFloat(el.dataset.countup);
      const suffix = el.dataset.suffix || "";
      const decimals = parseInt(el.dataset.decimals ?? "0", 10);
      const start = performance.now();

      function easeOutQuart(t) {
        return 1 - Math.pow(1 - t, 4);
      }

      function step(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        const eased = easeOutQuart(progress);
        const current = (target * eased).toFixed(decimals);
        el.textContent = current + suffix;

        if (progress < 1) {
          requestAnimationFrame(step);
        } else {
          el.textContent = target.toFixed(decimals) + suffix;
        }
      }

      requestAnimationFrame(step);
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            animateCount(entry.target);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.5 }
    );

    countEls.forEach((el) => observer.observe(el));
  }

  /* ============================================
     BLOG CATEGORY FILTER
     Works with filter-btn + data-category on cards
     ============================================ */
  function initBlogFilter() {
    const filterBtns = document.querySelectorAll(".filter-btn");
    const blogGrid = document.getElementById("blog-grid");
    if (!filterBtns.length || !blogGrid) return;

    const blogCards = blogGrid.querySelectorAll(".blog-card");

    filterBtns.forEach((btn) => {
      btn.addEventListener("click", () => {
        const filter = btn.dataset.filter;

        // Update button states
        filterBtns.forEach((b) => {
          b.style.background = "transparent";
          b.style.borderColor = "var(--color-border)";
          b.style.color = "var(--color-mid)";
          b.classList.remove("active");
        });

        btn.style.background = "var(--color-ink)";
        btn.style.borderColor = "var(--color-ink)";
        btn.style.color = "var(--color-cream)";
        btn.classList.add("active");

        // Filter cards
        blogCards.forEach((card) => {
          const show = filter === "all" || card.dataset.category === filter;

          if (!prefersReducedMotion) {
            if (show) {
              card.style.display = "flex";
              card.style.opacity = "0";
              card.style.transform = "translateY(8px)";
              requestAnimationFrame(() => {
                card.style.transition = "opacity 0.25s ease, transform 0.25s ease";
                card.style.opacity = "1";
                card.style.transform = "translateY(0)";
              });
            } else {
              card.style.transition = "opacity 0.15s ease";
              card.style.opacity = "0";
              setTimeout(() => {
                card.style.display = "none";
              }, 150);
            }
          } else {
            card.style.display = show ? "flex" : "none";
          }
        });
      });
    });
  }

  /* ============================================
     SMOOTH ANCHOR SCROLL
     Handles in-page links like href="#booking"
     ============================================ */
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
      anchor.addEventListener("click", (e) => {
        const target = document.querySelector(anchor.getAttribute("href"));
        if (!target) return;
        e.preventDefault();

        const headerHeight = document.querySelector("header")?.offsetHeight || 0;
        const targetTop =
          target.getBoundingClientRect().top +
          window.scrollY -
          headerHeight -
          24;

        if (prefersReducedMotion) {
          window.scrollTo({ top: targetTop });
        } else {
          window.scrollTo({ top: targetTop, behavior: "smooth" });
        }
      });
    });
  }

  /* ============================================
     NAV: Highlight active page link
     ============================================ */
  function initActiveNav() {
    const currentPath = window.location.pathname.split("/").pop() || "index.html";

    document.querySelectorAll(".nav-links a, .nav-mobile a").forEach((link) => {
      const linkPath = link.getAttribute("href");
      if (
        linkPath === currentPath ||
        (currentPath === "" && linkPath === "index.html")
      ) {
        link.style.color = "var(--color-ink)";
        link.style.fontWeight = "500";
      }
    });
  }

  /* ============================================
     FORM: Contact form submit handler
     (Fallback if inline handler isn't present)
     ============================================ */
  function initContactForm() {
    const form = document.getElementById("contact-form");
    if (!form) return;

    // Only attach if not already handled inline
    if (form.dataset.jsInit) return;
    form.dataset.jsInit = "true";

    form.addEventListener("submit", (e) => {
      e.preventDefault();

      const submitBtn = form.querySelector("button[type=submit]");
      const successMsg = document.getElementById("form-success");

      if (submitBtn) submitBtn.style.display = "none";
      if (successMsg) successMsg.style.display = "block";

      // Wire to your form backend or Netlify Forms here later:
      // fetch("/", { method: "POST", body: new FormData(form) })
    });
  }

  /* ============================================
     FOOTER: Dynamic copyright year
     (Fallback if inline script isn't present)
     ============================================ */
  function initYear() {
    const yearEl = document.getElementById("year");
    if (yearEl && !yearEl.textContent) {
      yearEl.textContent = new Date().getFullYear();
    }
  }

  /* ============================================
     INIT ALL
     ============================================ */
  function init() {
    initMobileNav();
    initHeaderScroll();
    initScrollReveal();
    initCountUp();
    initBlogFilter();
    initSmoothScroll();
    initActiveNav();
    initContactForm();
    initYear();
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
