/* ============================================================
   SkillUp — Main JavaScript
   ============================================================ */

// ============================================================
// AOS Initialization
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
  AOS.init({
    duration: 700,
    easing: 'ease-out-cubic',
    once: true,
    offset: 60,
    disable: 'mobile',
  });

  initNavbar();
  initThemeToggle();
  initHamburger();
  initCourseFilter();
  initCountdownTimer();
  initScrollProgress();
  lucide.createIcons();
});

// ============================================================
// Navbar — Scroll Effect
// ============================================================
function initNavbar() {
  const navbar = document.getElementById('navbar');
  const hero = document.getElementById('home');

  const observer = new IntersectionObserver(
    ([entry]) => {
      if (!entry.isIntersecting) {
        navbar.classList.add('scrolled');
      } else {
        navbar.classList.remove('scrolled');
      }
    },
    { threshold: 0.1 }
  );

  if (hero) observer.observe(hero);

  // Active link on scroll
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const sectionObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          const id = entry.target.getAttribute('id');
          navLinks.forEach((link) => {
            link.classList.remove('active');
            if (link.getAttribute('href') === `#${id}`) {
              link.classList.add('active');
            }
          });
        }
      });
    },
    { threshold: 0.4 }
  );

  sections.forEach((s) => sectionObserver.observe(s));
}

// ============================================================
// Theme Toggle — Dark / Light Mode
// ============================================================
function initThemeToggle() {
  const html = document.documentElement;
  const toggle = document.getElementById('theme-toggle');

  // Load saved preference
  const saved = localStorage.getItem('skillup-theme') || 'dark';
  html.setAttribute('data-theme', saved);

  if (toggle) {
    toggle.addEventListener('click', () => {
      const current = html.getAttribute('data-theme');
      const next = current === 'dark' ? 'light' : 'dark';
      html.setAttribute('data-theme', next);
      localStorage.setItem('skillup-theme', next);
      // Reinitialize Lucide icons after toggle (icons might regenerate)
      if (typeof lucide !== 'undefined') {
        setTimeout(() => lucide.createIcons(), 50);
      }
    });
  }
}

// ============================================================
// Hamburger — Mobile Menu
// ============================================================
function initHamburger() {
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');
  const mobileLinks = document.querySelectorAll('.mobile-nav-link, .mobile-nav-links .btn');

  if (!hamburger || !mobileMenu) return;

  hamburger.addEventListener('click', () => {
    const isOpen = mobileMenu.classList.contains('open');
    if (isOpen) {
      mobileMenu.classList.remove('open');
      hamburger.classList.remove('active');
      document.body.style.overflow = '';
    } else {
      mobileMenu.classList.add('open');
      hamburger.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  });

  // Close on link click
  mobileLinks.forEach((link) => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      hamburger.classList.remove('active');
      document.body.style.overflow = '';
    });
  });
}

// ============================================================
// Course Filter Tabs
// ============================================================
function initCourseFilter() {
  const tabs = document.querySelectorAll('.format-tab');
  const cards = document.querySelectorAll('.course-card');

  tabs.forEach((tab) => {
    tab.addEventListener('click', () => {
      // Update active tab
      tabs.forEach((t) => t.classList.remove('active'));
      tab.classList.add('active');

      const filter = tab.getAttribute('data-filter');

      cards.forEach((card) => {
        if (filter === 'all' || card.getAttribute('data-type') === filter) {
          card.classList.remove('hidden');
          // Re-trigger animation
          card.style.animation = 'none';
          card.offsetHeight; // reflow
          card.style.animation = '';
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });
}

// ============================================================
// FAQ Accordion
// ============================================================
function toggleFaq(id) {
  const item = document.getElementById(id);
  if (!item) return;

  const isOpen = item.classList.contains('open');

  // Close all
  document.querySelectorAll('.faq-item').forEach((el) => {
    el.classList.remove('open');
  });

  // Open clicked if it was closed
  if (!isOpen) {
    item.classList.add('open');
  }

  // Reinit icons in case chevron rotated
  if (typeof lucide !== 'undefined') {
    setTimeout(() => lucide.createIcons(), 50);
  }
}

// Make globally accessible for inline onclick
window.toggleFaq = toggleFaq;

// ============================================================
// CTA Form Submit
// ============================================================
function handleCtaSubmit() {
  const emailInput = document.getElementById('cta-email');
  const email = emailInput ? emailInput.value.trim() : '';

  if (!email || !isValidEmail(email)) {
    showToast('Masukkan email yang valid ya! 😅', 'error');
    if (emailInput) {
      emailInput.style.borderColor = 'var(--color-red)';
      emailInput.style.boxShadow = '0 0 0 3px rgba(239,68,68,0.2)';
      setTimeout(() => {
        emailInput.style.borderColor = '';
        emailInput.style.boxShadow = '';
      }, 2000);
    }
    return;
  }

  // Simulate successful registration
  showToast('Berhasil! Cek email kamu ya 🎉', 'success');
  if (emailInput) emailInput.value = '';

  // Add ripple effect to button
  const btn = document.getElementById('cta-submit-btn');
  if (btn) {
    btn.style.transform = 'scale(0.97)';
    setTimeout(() => { btn.style.transform = ''; }, 200);
  }
}

window.handleCtaSubmit = handleCtaSubmit;

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// ============================================================
// Toast Notification
// ============================================================
let toastTimeout = null;

function showToast(msg, type = 'success') {
  const toast = document.getElementById('toast');
  const toastMsg = document.getElementById('toast-msg');
  const toastIcon = toast ? toast.querySelector('.toast-icon') : null;

  if (!toast || !toastMsg) return;

  toastMsg.textContent = msg;

  if (toastIcon) {
    toastIcon.setAttribute('data-lucide', type === 'success' ? 'check-circle' : 'alert-circle');
    toastIcon.style.color = type === 'success' ? 'var(--color-green)' : 'var(--color-red)';
    if (typeof lucide !== 'undefined') lucide.createIcons();
  }

  toast.classList.add('show');

  if (toastTimeout) clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toast.classList.remove('show');
  }, 3500);
}

// ============================================================
// Countdown Timer
// ============================================================
function initCountdownTimer() {
  const hEl = document.getElementById('timer-h');
  const mEl = document.getElementById('timer-m');
  const sEl = document.getElementById('timer-s');

  if (!hEl || !mEl || !sEl) return;

  // Set a fixed end time from now (8h 24m 13s)
  const storageKey = 'skillup-timer-end';
  let endTime = parseInt(localStorage.getItem(storageKey) || '0', 10);

  if (!endTime || endTime < Date.now()) {
    endTime = Date.now() + (8 * 3600 + 24 * 60 + 13) * 1000;
    localStorage.setItem(storageKey, endTime.toString());
  }

  function updateTimer() {
    const remaining = Math.max(0, endTime - Date.now());
    const totalSeconds = Math.floor(remaining / 1000);
    const h = Math.floor(totalSeconds / 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    const s = totalSeconds % 60;

    hEl.textContent = String(h).padStart(2, '0');
    mEl.textContent = String(m).padStart(2, '0');
    sEl.textContent = String(s).padStart(2, '0');

    if (remaining <= 0) {
      clearInterval(timerInterval);
      hEl.textContent = '00';
      mEl.textContent = '00';
      sEl.textContent = '00';
    }
  }

  updateTimer();
  const timerInterval = setInterval(updateTimer, 1000);
}

// ============================================================
// Scroll Progress Bar
// ============================================================
function initScrollProgress() {
  // Create progress bar element
  const bar = document.createElement('div');
  bar.id = 'scroll-progress';
  bar.style.cssText = `
    position: fixed;
    top: 0;
    left: 0;
    height: 2px;
    width: 0%;
    background: linear-gradient(90deg, #7C3AED, #2563EB);
    z-index: 9999;
    transition: width 0.1s linear;
    pointer-events: none;
  `;
  document.body.prepend(bar);

  window.addEventListener('scroll', () => {
    const scrollTop = window.scrollY;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const progress = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
    bar.style.width = `${progress}%`;
  }, { passive: true });
}

// ============================================================
// Smooth scroll for all anchor links
// ============================================================
document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener('click', function (e) {
      const href = this.getAttribute('href');
      if (href === '#') return;
      const target = document.querySelector(href);
      if (target) {
        e.preventDefault();
        const offset = 80;
        const top = target.getBoundingClientRect().top + window.scrollY - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });
});

// ============================================================
// Number Counter Animation
// ============================================================
function animateCounters() {
  const counters = document.querySelectorAll('.stat-number');

  counters.forEach((counter) => {
    const text = counter.textContent;
    const numMatch = text.match(/[\d,.]+/);
    if (!numMatch) return;

    const targetStr = numMatch[0].replace(',', '.');
    const target = parseFloat(targetStr);
    const suffix = text.replace(numMatch[0], '');
    const prefix = text.split(numMatch[0])[0];

    let start = 0;
    const duration = 1500;
    const step = (target / duration) * 16;

    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        start = target;
        clearInterval(timer);
      }
      let display = start >= 10 ? Math.round(start) : start.toFixed(1);
      counter.textContent = `${prefix}${display}${suffix}`;
    }, 16);
  });
}

// Trigger counter animation when hero stats come into view
const heroStats = document.querySelector('.hero-stats');
if (heroStats) {
  const statsObserver = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        animateCounters();
        statsObserver.disconnect();
      }
    },
    { threshold: 0.5 }
  );
  statsObserver.observe(heroStats);
}

// ============================================================
// Cursor glow effect (desktop only)
// ============================================================
if (window.matchMedia('(hover: hover)').matches) {
  const glow = document.createElement('div');
  glow.id = 'cursor-glow';
  glow.style.cssText = `
    position: fixed;
    width: 400px;
    height: 400px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(124,58,237,0.04) 0%, transparent 70%);
    pointer-events: none;
    z-index: 0;
    transform: translate(-50%, -50%);
    transition: transform 0.1s linear;
    will-change: transform;
  `;
  document.body.appendChild(glow);

  let mouseX = 0, mouseY = 0;
  document.addEventListener('mousemove', (e) => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    glow.style.left = `${mouseX}px`;
    glow.style.top = `${mouseY}px`;
  }, { passive: true });
}
