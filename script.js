/* ── NAV SCROLL & ACTIVE LINK ── */
const navbar = document.getElementById('navbar');

window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);

  const sections = ['home', 'about', 'projects', 'skills', 'contact'];
  let current = 'home';
  sections.forEach(id => {
    const el = document.getElementById(id);
    if (el && window.scrollY >= el.offsetTop - 110) current = id;
  });
  document.querySelectorAll('.nav-links a').forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') === '#' + current);
  });
}, { passive: true });

/* ── HAMBURGER MENU ── */
const hamburger  = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

hamburger.addEventListener('click', () => {
  const open = mobileMenu.classList.toggle('open');
  hamburger.classList.toggle('open', open);
  document.body.style.overflow = open ? 'hidden' : '';
});

function closeMobile() {
  mobileMenu.classList.remove('open');
  hamburger.classList.remove('open');
  document.body.style.overflow = '';
}

/* ── SCROLL REVEAL ── */
document.querySelectorAll('.reveal').forEach(el => {
  new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('visible'); }
    });
  }, { threshold: 0.1 }).observe(el);
});

/* ── SKILLS CAROUSEL ── */
const track   = document.getElementById('skillsTrack');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
let carouselIndex = 0;

/* Detect RTL once on load — works for both separate HTML files */
const isRTL = document.documentElement.dir === 'rtl';

function getCardWidth() {
  const card = track.querySelector('.skill-card');
  return card ? card.offsetWidth + 20 : 220;
}

function getVisible() {
  return Math.floor(track.parentElement.offsetWidth / getCardWidth());
}

function maxIndex() {
  return Math.max(0, track.children.length - getVisible());
}

function updateCarousel() {
  track.style.transform = `translateX(-${carouselIndex * getCardWidth()}px)`;
  prevBtn.style.opacity = carouselIndex === 0         ? '0.35' : '1';
  nextBtn.style.opacity = carouselIndex >= maxIndex() ? '0.35' : '1';
}

/*
  prevBtn (← arrow) = visually on the LEFT in both LTR and RTL
  → always moves to earlier cards (lower index)

  nextBtn (→ arrow) = visually on the RIGHT in both LTR and RTL
  → always moves to later cards (higher index)

  CSS handles the visual swap of button positions via `order`.
  JS logic stays the same either way.
*/
prevBtn.addEventListener('click', () => {
  if (carouselIndex > 0) { carouselIndex--; updateCarousel(); }
});

nextBtn.addEventListener('click', () => {
  if (carouselIndex < maxIndex()) { carouselIndex++; updateCarousel(); }
});

window.addEventListener('resize', () => {
  carouselIndex = Math.min(carouselIndex, maxIndex());
  updateCarousel();
});

updateCarousel();

/* ── TOUCH SWIPE ── */
let touchStart = 0;
track.addEventListener('touchstart', e => {
  touchStart = e.touches[0].clientX;
}, { passive: true });

track.addEventListener('touchend', e => {
  const diff = touchStart - e.changedTouches[0].clientX;
  if (Math.abs(diff) > 40) {
    /*
      LTR: swipe left  (diff > 0) → next card
           swipe right (diff < 0) → prev card

      RTL: swipe right (diff < 0) → next card
           swipe left  (diff > 0) → prev card
      (mirrors physical expectation when content reads right-to-left)
    */
    const goNext = isRTL ? diff < 0 : diff > 0;
    const goPrev = isRTL ? diff > 0 : diff < 0;

    if (goNext && carouselIndex < maxIndex()) { carouselIndex++; }
    else if (goPrev && carouselIndex > 0)     { carouselIndex--; }
    updateCarousel();
  }
});