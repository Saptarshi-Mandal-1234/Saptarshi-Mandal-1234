'use strict';

document.documentElement.classList.add('js');

const themeToggle = document.getElementById('themeToggle');

function getPreferredTheme() {
  return 'dark';
}

function applyTheme(theme, save = false) {
  document.documentElement.setAttribute('data-theme', theme);
  if (save) {
    try {
      localStorage.setItem('portfolio-theme-pref', theme);
    } catch (e) {
      // Ignore storage errors
    }
  }
}

applyTheme(getPreferredTheme(), false);

const menu = document.getElementById('menuToggle');
const nav = document.getElementById('navLinks');

if (menu && nav) {
  menu.hidden = false;

  function closeMenu() {
    nav.classList.remove('is-open');
    menu.setAttribute('aria-expanded', 'false');
  }

  menu.addEventListener('click', () => {
    const open = menu.getAttribute('aria-expanded') !== 'true';
    menu.setAttribute('aria-expanded', String(open));
    nav.classList.toggle('is-open', open);
  });

  nav.addEventListener('click', (event) => {
    if (event.target.closest('a')) {
      closeMenu();
    }
  });
}

const sectionElements = document.querySelectorAll('header#top, section[id]');
const navLinkElements = document.querySelectorAll('#navLinks a');

function updateActiveNav(activeId) {
  navLinkElements.forEach((link) => {
    const href = link.getAttribute('href');
    if (href === `#${activeId}`) {
      link.classList.add('active');
      link.setAttribute('aria-current', 'location');
    } else {
      link.classList.remove('active');
      link.removeAttribute('aria-current');
    }
  });
}

if ('IntersectionObserver' in window && sectionElements.length > 0) {
  const navObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        updateActiveNav(entry.target.id);
      }
    });
  }, {
    rootMargin: '-20% 0px -55% 0px',
    threshold: 0
  });

  sectionElements.forEach((sec) => navObserver.observe(sec));
}

const revealTargets = document.querySelectorAll('[data-reveal]');
const reduceMotionQuery = window.matchMedia('(prefers-reduced-motion: reduce)');

if (reduceMotionQuery.matches || !('IntersectionObserver' in window)) {
  revealTargets.forEach((el) => el.style.animation = 'none');
} else {
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.style.animation = 'reveal 0.6s ease-out forwards';
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.08,
    rootMargin: '0px 0px -30px 0px'
  });

  revealTargets.forEach((el) => revealObserver.observe(el));
}