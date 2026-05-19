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

// Photo upload UI — pick up to 3 images, show selected list with remove,
// drag-and-drop support. The actual file submission to HighLevel will be
// wired up by the WordPress dev (this just handles the picker UX).
(function(){
  const input = document.getElementById('photos');
  const list = document.getElementById('fileList');
  const btn = document.getElementById('fileUploadBtn');
  if(!input || !list || !btn) return;
  const MAX = 3;
  let files = [];

  const syncInput = () => {
    if(typeof DataTransfer === 'undefined') return;
    const dt = new DataTransfer();
    files.forEach(f => dt.items.add(f));
    input.files = dt.files;
  };

  const render = () => {
    list.innerHTML = '';
    files.forEach((file, i) => {
      const item = document.createElement('div');
      item.className = 'file-item';
      item.innerHTML =
        '<span class="file-item-name">' +
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="9" cy="9" r="2"/><path d="M21 15l-5-5L5 21"/></svg>' +
          '<span>' + file.name + '</span>' +
        '</span>' +
        '<button type="button" class="file-item-remove" data-i="' + i + '" aria-label="Remove ' + file.name + '">' +
          '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.4"><path d="M18 6L6 18M6 6l12 12"/></svg>' +
        '</button>';
      list.appendChild(item);
    });
    syncInput();
  };

  const addFiles = (incoming) => {
    const imgs = Array.from(incoming).filter(f => f.type.startsWith('image/'));
    files = [...files, ...imgs].slice(0, MAX);
    render();
  };

  input.addEventListener('change', () => addFiles(input.files));

  list.addEventListener('click', (e) => {
    const removeBtn = e.target.closest('.file-item-remove');
    if(!removeBtn) return;
    const i = parseInt(removeBtn.dataset.i, 10);
    files.splice(i, 1);
    render();
  });

  // Drag and drop
  ['dragenter','dragover'].forEach(ev => {
    btn.addEventListener(ev, (e) => { e.preventDefault(); btn.classList.add('drag'); });
  });
  ['dragleave','drop'].forEach(ev => {
    btn.addEventListener(ev, (e) => { e.preventDefault(); btn.classList.remove('drag'); });
  });
  btn.addEventListener('drop', (e) => {
    if(e.dataTransfer && e.dataTransfer.files) addFiles(e.dataTransfer.files);
  });

  // Expose a clear function so the submit handler can wipe the list on reset
  window._clearPhotoUpload = () => { files = []; render(); };
})();

// Consultation form — demo submit confirmation
// NOTE for WordPress dev: replace this with your actual form handler.
// Hook to HighLevel (via webhook or form plugin) and trigger SMS + email
// notifications to the client. Field names: fullName, phone, email, photos[].
(function(){
  const form = document.getElementById('consultForm');
  if(!form) return;
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const btn = form.querySelector('.form-submit');
    const original = btn.innerHTML;
    btn.innerHTML = "Thank you. We'll be in touch shortly ✓";
    btn.style.background = '#0a2a55';
    btn.disabled = true;
    setTimeout(() => {
      form.reset();
      if(typeof window._clearPhotoUpload === 'function') window._clearPhotoUpload();
      btn.innerHTML = original;
      btn.style.background = '';
      btn.disabled = false;
    }, 3500);
  });
})();
