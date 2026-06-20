// =============================================
// Vishal Dhiman Portfolio — JS
// =============================================

// Scroll reveal
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('#about .container, #experience .container, #projects .container, #skills .container, #academics .container, #contact .container, .exp, .project, .skill-group, .edu, .pub').forEach(el => {
  el.classList.add('reveal');
  revealObserver.observe(el);
});

// Active nav link on scroll
const sections = document.querySelectorAll('section[id]');
const navItems = document.querySelectorAll('.nav-links a');

window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach(section => {
    if (window.scrollY >= section.offsetTop - 120) {
      current = section.getAttribute('id');
    }
  });
  navItems.forEach(a => {
    const active = a.getAttribute('href') === `#${current}`;
    a.style.color = active && !a.classList.contains('nav-cta') ? 'var(--text)' : '';
  });
}, { passive: true });

// Mobile menu toggle
const menuToggle = document.querySelector('.menu-toggle');
const navLinks = document.querySelector('.nav-links');
menuToggle?.addEventListener('click', () => navLinks.classList.toggle('mobile-open'));
navLinks?.addEventListener('click', (e) => {
  if (e.target.tagName === 'A') navLinks.classList.remove('mobile-open');
});

// =============================================
// Lightbox gallery
// =============================================
const lightbox = document.getElementById('lightbox');
const lbImg = lightbox.querySelector('.lb-img');
const lbCounter = lightbox.querySelector('.lb-counter');
const lbClose = lightbox.querySelector('.lb-close');
const lbPrev = lightbox.querySelector('.lb-prev');
const lbNext = lightbox.querySelector('.lb-next');

let currentSet = [];
let currentIndex = 0;

function showImage(i) {
  currentIndex = (i + currentSet.length) % currentSet.length;
  const item = currentSet[currentIndex];
  lbImg.src = item.src;
  lbImg.alt = item.alt;
  lbCounter.textContent = `${currentIndex + 1} / ${currentSet.length}`;
  const multi = currentSet.length > 1;
  lbPrev.style.display = multi ? '' : 'none';
  lbNext.style.display = multi ? '' : 'none';
  lbCounter.style.display = multi ? '' : 'none';
}

function openLightbox(gallery, index) {
  currentSet = [...gallery.querySelectorAll('.thumb')].map(t => ({
    src: t.dataset.full,
    alt: t.querySelector('img')?.alt || ''
  }));
  showImage(index);
  lightbox.classList.add('open');
  lightbox.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}

function closeLightbox() {
  lightbox.classList.remove('open');
  lightbox.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}

document.querySelectorAll('.project-gallery').forEach(gallery => {
  const thumbs = [...gallery.querySelectorAll('.thumb')];
  thumbs.forEach((thumb, i) => {
    thumb.addEventListener('click', () => openLightbox(gallery, i));
  });
});

lbClose.addEventListener('click', closeLightbox);
lbNext.addEventListener('click', () => showImage(currentIndex + 1));
lbPrev.addEventListener('click', () => showImage(currentIndex - 1));
lightbox.addEventListener('click', (e) => { if (e.target === lightbox) closeLightbox(); });

document.addEventListener('keydown', (e) => {
  if (!lightbox.classList.contains('open')) return;
  if (e.key === 'Escape') closeLightbox();
  else if (e.key === 'ArrowRight') showImage(currentIndex + 1);
  else if (e.key === 'ArrowLeft') showImage(currentIndex - 1);
});

// Touch swipe
let touchStartX = 0;
lightbox.addEventListener('touchstart', (e) => { touchStartX = e.changedTouches[0].screenX; }, { passive: true });
lightbox.addEventListener('touchend', (e) => {
  const dx = e.changedTouches[0].screenX - touchStartX;
  if (Math.abs(dx) > 50) showImage(currentIndex + (dx < 0 ? 1 : -1));
}, { passive: true });
