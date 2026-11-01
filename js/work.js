/* =====================================================================
   work.js: the ONE script for work.html
   Load order: js/main.js (site base: project grid, filters, tilt), then this file. Nothing else.
   Replaces premium.js on this page.

   1  Scroll progress bar
   2  Page: stagger, counters, reveal, spotlight, section index, stack map
   3  Extras: design strip, quick menu, smooth scrolling
   ===================================================================== */
(() => {
  const OPTIONS = {
    dial: true,          // radial quick menu, bottom right
    smoothScroll: true   // Lenis smooth scrolling (loaded from a CDN)
  };

  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const root = document.documentElement;
  const PAGES = [['Home', 'index.html'], ['About', 'about.html'], ['Work', 'work.html'], ['Capabilities', 'capabilities.html'], ['Contact', 'contact.html']];
  let lenis = null;

  /* ------------------------------------------------------------------
     1. Scroll progress bar (the navbar itself is handled by main.js)
     ------------------------------------------------------------------ */
  const bar = document.createElement('i');
  bar.className = 'sprog';
  document.body.append(bar);
  const onProgress = () => {
    const h = root.scrollHeight - innerHeight;
    bar.style.setProperty('--p', h > 0 ? (scrollY / h).toFixed(4) : 0);
  };
  addEventListener('scroll', onProgress, { passive: true });
  onProgress();

  /* ------------------------------------------------------------------
     2. Page
     ------------------------------------------------------------------ */
  // stagger index for children of [data-stagger]
  $$('[data-stagger]').forEach((p) => [...p.children].forEach((c, i) => c.style.setProperty('--i', i)));

  // animated counters
  const fmt = (el, n) => (el.dataset.wkPrefix || '') + Math.round(n).toLocaleString('en-US') + (el.dataset.wkSuffix || '');
  const count = (el) => {
    const end = +el.dataset.wkCount;
    if (reduced) { el.textContent = fmt(el, end); return; }
    const t0 = performance.now(), dur = 1600;
    const tick = (t) => {
      const k = Math.min((t - t0) / dur, 1);
      el.textContent = fmt(el, end * (1 - Math.pow(1 - k, 3)));
      if (k < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  // reveal on scroll
  const io = new IntersectionObserver((entries) => entries.forEach((en) => {
    if (!en.isIntersecting) return;
    const el = en.target;
    el.classList.add('in');
    io.unobserve(el);
    $$('[data-wk-count]', el).forEach(count);
  }), { threshold: 0.15 });
  $$('.wk-rv, [data-stagger]').forEach((el) => (reduced ? (el.classList.add('in'), $$('[data-wk-count]', el).forEach(count)) : io.observe(el)));

  // cursor spotlight
  $$('[data-spot]').forEach((c) => c.addEventListener('pointermove', (e) => {
    const r = c.getBoundingClientRect();
    c.style.setProperty('--mx', e.clientX - r.left + 'px');
    c.style.setProperty('--my', e.clientY - r.top + 'px');
  }));

  // section index: highlight the section under the 40% line, and scroll to it smoothly
  const idxLinks = $$('.wk-index a');
  const secs = idxLinks.map((a) => document.getElementById(a.getAttribute('href').slice(1)));
  let ticking = false, currentIdx = -1;
  const mark = () => {
    ticking = false;
    let idx = 0;
    secs.forEach((s, i) => { if (s && s.getBoundingClientRect().top <= innerHeight * 0.4) idx = i; });
    if (idx === currentIdx) return;
    currentIdx = idx;
    idxLinks.forEach((a, i) => a.classList.toggle('on', i === idx));
    idxLinks[idx]?.scrollIntoView({ block: 'nearest', inline: 'center' });
  };
  addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(mark); } }, { passive: true });
  mark();
  idxLinks.forEach((a) => a.addEventListener('click', (e) => {
    const t = document.getElementById(a.getAttribute('href').slice(1));
    if (!t || !lenis) return;           // without Lenis the browser handles the jump (CSS scroll-margin applies)
    e.preventDefault();
    lenis.scrollTo(t, { offset: -90 });
  }));

  // stack map: hover a project column header to highlight its column
  $$('.wk-matrix thead th[data-c]').forEach((th) => {
    const set = (on) => $$(`.wk-matrix [data-c="${th.dataset.c}"]`).forEach((c) => c.classList.toggle('hc', on));
    th.addEventListener('mouseenter', () => set(true));
    th.addEventListener('mouseleave', () => set(false));
  });

  /* ------------------------------------------------------------------
     3. Extras
     ------------------------------------------------------------------ */
  // design / build / ship strip before the closing call to action
  const strip = document.createElement('div');
  strip.className = 'mstrip';
  strip.innerHTML = '<span>Design</span><i>✦</i><span>Build</span><i>✦</i><span>Ship</span>';
  $('.cta')?.before(strip);

  // radial quick menu
  if (OPTIONS.dial) {
    const d = document.createElement('div');
    d.className = 'dial';
    d.innerHTML = `<nav aria-label="Quick menu">${PAGES.map(([n, h], i) => `<a href="${h}" style="--i:${4 - i};--y:${-(70 + (4 - i) * 48)}px;--x:${-Math.pow(i - 2, 2) * 9}px">${n}</a>`).join('')}</nav>`
      + '<button class="knob" aria-label="Quick menu" aria-expanded="false"><i></i></button>';
    document.body.append(d);
    const kb = $('.knob', d);
    kb.addEventListener('click', () => kb.setAttribute('aria-expanded', d.classList.toggle('open')));
    addEventListener('keydown', (e) => { if (e.key === 'Escape') { d.classList.remove('open'); kb.setAttribute('aria-expanded', 'false'); } });
  }

  // smooth scrolling
  if (OPTIONS.smoothScroll && !reduced) {
    const s = document.createElement('script');
    s.src = 'https://cdn.jsdelivr.net/npm/lenis@1.1.14/dist/lenis.min.js';
    s.onload = () => {
      if (!window.Lenis) return;
      lenis = new Lenis({ lerp: 0.085, smoothWheel: true });
      const raf = (t) => { lenis.raf(t); requestAnimationFrame(raf); };
      requestAnimationFrame(raf);
    };
    document.head.append(s);
  }
})();