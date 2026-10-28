// Work page upgrade: scroll progress, reveals, counters, spotlight, section index, stack-map hover.
(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // scroll progress bar
  const bar = $('.wk-progress');
  const onScroll = () => {
    const h = document.documentElement;
    bar?.style.setProperty('--p', (h.scrollTop / Math.max(1, h.scrollHeight - h.clientHeight)).toFixed(4));
  };
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();

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

  // sticky section index: highlight the section currently under the 40% line (first one by default)
  const links = $$('.wk-index a');
  const secs = links.map((a) => document.getElementById(a.getAttribute('href').slice(1)));
  let ticking = false, current = -1;
  const mark = () => {
    ticking = false;
    let idx = 0;
    secs.forEach((s, i) => { if (s && s.getBoundingClientRect().top <= innerHeight * 0.4) idx = i; });
    if (idx === current) return;
    current = idx;
    links.forEach((a, i) => a.classList.toggle('on', i === idx));
    links[idx]?.scrollIntoView({ block: 'nearest', inline: 'center' });
  };
  addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(mark); } }, { passive: true });
  mark();

  // stack map: hover a project column header to highlight its column
  $$('.wk-matrix thead th[data-c]').forEach((th) => {
    const set = (on) => $$(`.wk-matrix [data-c="${th.dataset.c}"]`).forEach((c) => c.classList.toggle('hc', on));
    th.addEventListener('mouseenter', () => set(true));
    th.addEventListener('mouseleave', () => set(false));
  });
})();
