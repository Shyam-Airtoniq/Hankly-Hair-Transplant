/* ============================================================
   Euro Hair Transplant — Interactions
   Concept C · All-Inclusive · Modern Clinical Luxury
   ============================================================ */

// Sticky header — adds .scrolled class after 40px scroll
(function(){
  const header = document.getElementById('header');
  if(!header) return;
  const onScroll = () => {
    if(window.scrollY > 40) header.classList.add('scrolled');
    else header.classList.remove('scrolled');
  };
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();
})();

// Mobile nav — hamburger toggle + close on link click
(function(){
  const toggle = document.getElementById('menuToggle');
  const panel = document.getElementById('mobileNav');
  if(!toggle || !panel) return;
  const close = () => {
    toggle.classList.remove('open');
    panel.classList.remove('open');
    panel.setAttribute('aria-hidden','true');
    toggle.setAttribute('aria-expanded','false');
  };
  toggle.addEventListener('click', () => {
    const open = panel.classList.toggle('open');
    toggle.classList.toggle('open', open);
    panel.setAttribute('aria-hidden', open ? 'false' : 'true');
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
  });
  panel.querySelectorAll('.mn-link').forEach(a => a.addEventListener('click', close));
})();

// Reveal on scroll — fade-up via IntersectionObserver
(function(){
  const els = document.querySelectorAll('.reveal');
  if(!('IntersectionObserver' in window)){
    els.forEach(el => el.classList.add('visible'));
    return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        entry.target.classList.add('visible');
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -50px 0px' });
  els.forEach(el => io.observe(el));
})();

// Cost bars — animate width from data-w when in view
(function(){
  const card = document.getElementById('costCard');
  if(!card) return;
  const fills = card.querySelectorAll('.cost-bar-fill');
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        fills.forEach(f => { f.style.width = f.dataset.w; });
        io.unobserve(card);
      }
    });
  }, { threshold: 0.3 });
  io.observe(card);
})();

// How-it-works stepper — fill connector line on scroll into view
(function(){
  const track = document.getElementById('stepsTrack');
  if(!track) return;
  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if(entry.isIntersecting){
        track.classList.add('visible');
        io.unobserve(track);
      }
    });
  }, { threshold: 0.25 });
  io.observe(track);
})();

// FAQ accordion — one-open-at-a-time
(function(){
  const items = document.querySelectorAll('.faq-item');
  items.forEach(item => {
    const btn = item.querySelector('.faq-q');
    const ans = item.querySelector('.faq-a');
    btn.addEventListener('click', () => {
      const isOpen = item.classList.contains('open');
      items.forEach(i => {
        i.classList.remove('open');
        const a = i.querySelector('.faq-a');
        a.style.maxHeight = null;
      });
      if(!isOpen){
        item.classList.add('open');
        ans.style.maxHeight = ans.scrollHeight + 'px';
      }
    });
  });
})();

// Consultation form — demo submit confirmation
// NOTE for WordPress dev: replace this with your actual form handler.
// Hook to a CRM (HubSpot/Pipedrive), email (Postmark/SendGrid),
// or a WordPress plugin (Gravity Forms / WPForms / Contact Form 7).
(function(){
  const form = document.getElementById('consultForm');
  if(!form) return;
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = form.querySelector('.form-submit');
    const original = btn.innerHTML;
    btn.innerHTML = "Thank you — we'll be in touch ✓";
    btn.style.background = '#0a2a55';
    btn.disabled = true;
    setTimeout(() => {
      form.reset();
      btn.innerHTML = original;
      btn.style.background = '';
      btn.disabled = false;
    }, 3500);
  });
})();
