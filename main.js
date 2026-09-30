// Hampton Roads Counseling — shared behavior
document.addEventListener('DOMContentLoaded', () => {
  const yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // mobile nav
  const toggle = document.getElementById('menuToggle');
  const links = document.getElementById('navLinks');
  if (toggle && links) {
    toggle.addEventListener('click', () => links.classList.toggle('open'));
    links.querySelectorAll('a').forEach(a => a.addEventListener('click', () => links.classList.remove('open')));
  }

  // reveal on scroll
  const revealEls = document.querySelectorAll('.reveal');
  if (revealEls.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('is-visible'); io.unobserve(e.target); }
      });
    }, { threshold: 0.14, rootMargin: '0px 0px -60px 0px' });
    revealEls.forEach(el => io.observe(el));
  }

  // "who we are" scrollytelling: sticky image + stepped bullets (+ mobile dots)
  const story = document.querySelector('.story');
  if (story) {
    const steps = story.querySelectorAll('.step');
    const images = story.querySelectorAll('.story-imgstack img');
    const dots = document.querySelectorAll('.story-dots .s-dot');
    const stepIO = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        const idx = Number(entry.target.dataset.step);
        if (entry.isIntersecting) {
          steps.forEach(s => s.classList.remove('active'));
          images.forEach(i => i.classList.remove('active'));
          dots.forEach(d => d.classList.remove('active'));
          entry.target.classList.add('active');
          if (images[idx]) images[idx].classList.add('active');
          if (dots[idx]) dots[idx].classList.add('active');
        }
      });
    }, { threshold: 0.6 });
    steps.forEach(s => stepIO.observe(s));
  }

  // clinicians card stack
  const stackWrap = document.querySelector('.stack-wrap');
  if (stackWrap) {
    const cards = Array.from(stackWrap.querySelectorAll('.clin-card'));
    const pips = Array.from(document.querySelectorAll('.stack-progress .pip'));
    const n = cards.length;

    function updateStack() {
      const rect = stackWrap.getBoundingClientRect();
      const total = rect.height - window.innerHeight;
      let progress = total > 0 ? (-rect.top) / total : 0;
      progress = Math.min(Math.max(progress, 0), 0.9999);
      const idx = Math.floor(progress * n);

      cards.forEach((card, i) => {
        card.classList.remove('active', 'prev');
        if (i === idx) card.classList.add('active');
        else if (i < idx) card.classList.add('prev');
      });
      pips.forEach((p, i) => p.classList.toggle('active', i === idx));
    }

    let ticking = false;
    window.addEventListener('scroll', () => {
      if (!ticking) {
        window.requestAnimationFrame(() => { updateStack(); ticking = false; });
        ticking = true;
      }
    });
    window.addEventListener('resize', updateStack);
    updateStack();
  }

  // home page clinician carousel
  const carousel = document.querySelector('.clin-carousel');
  if (carousel) {
    const imgs = Array.from(carousel.querySelectorAll('.carousel-frame img'));
    const nameEl = carousel.querySelector('.carousel-name');
    const roleEl = carousel.querySelector('.carousel-role');
    const dots = Array.from(carousel.querySelectorAll('.carousel-dots span'));
    let i = 0;
    function show(idx) {
      imgs.forEach((img, n) => img.classList.toggle('c-active', n === idx));
      dots.forEach((d, n) => d.classList.toggle('c-active', n === idx));
      nameEl.textContent = imgs[idx].dataset.name;
      roleEl.textContent = imgs[idx].dataset.role;
    }
    show(0);
    setInterval(() => { i = (i + 1) % imgs.length; show(i); }, 3200);
    dots.forEach((d, n) => d.addEventListener('click', () => { i = n; show(i); }));
  }

  // services page interactive tabs
  const wwdTabs = document.querySelector('.wwd-tabs');
  if (wwdTabs) {
    const buttons = Array.from(wwdTabs.querySelectorAll('button'));
    const panels = Array.from(document.querySelectorAll('.wwd-panel'));
    buttons.forEach(btn => {
      btn.addEventListener('click', () => {
        buttons.forEach(b => b.classList.remove('active'));
        panels.forEach(p => p.classList.remove('active'));
        btn.classList.add('active');
        document.getElementById(btn.dataset.target).classList.add('active');
      });
    });
  }
});
