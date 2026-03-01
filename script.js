// =============================================
// Vishal Dhiman Portfolio — JS
// =============================================

// Scroll reveal
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('section > .container, .project-card, .timeline-item, .skill-group').forEach(el => {
  el.classList.add('reveal');
  revealObserver.observe(el);
});

// Navbar shrink + active nav link on scroll (single listener)
const navbar = document.getElementById('navbar');
const sections = document.querySelectorAll('section[id]');
const navItems = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
  navbar.style.padding = window.scrollY > 50 ? '10px 40px' : '16px 40px';

  let current = '';
  sections.forEach(section => {
    if (window.scrollY >= section.offsetTop - 100) {
      current = section.getAttribute('id');
    }
  });
  navItems.forEach(a => {
    a.style.color = a.getAttribute('href') === `#${current}` ? 'var(--accent)' : '';
  });
}, { passive: true });

// Mobile menu toggle (class-based)
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');
menuToggle?.addEventListener('click', () => {
  navLinks.classList.toggle('mobile-open');
});

// Close mobile menu on nav click
navLinks?.addEventListener('click', (e) => {
  if (e.target.tagName === 'A' && navLinks.classList.contains('mobile-open')) {
    navLinks.classList.remove('mobile-open');
  }
});
