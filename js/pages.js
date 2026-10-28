// About, Capabilities and Contact upgrades: tabs, tech filter, contact helpers, clock.
(() => {
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // ---- tabs (architecture explorer, delivery steps, API examples); auto-cycles while visible until the visitor interacts
  $$('[data-tabs]').forEach((root) => {
    const tabs = $$('[data-tab]', root), panels = $$('[data-panel]', root);
    let cur = 0, timer = null, stopped = false;
    const show = (n) => {
      cur = n;
      tabs.forEach((t, k) => { t.classList.toggle('on', k === n); t.setAttribute('aria-selected', k === n); });
      panels.forEach((p, k) => p.classList.toggle('on', k === n));
      root.style.setProperty('--step', n);
    };
    const stop = () => { clearInterval(timer); timer = null; };
    const start = () => {
      if (stopped || reduced || !root.dataset.auto || timer) return;
      timer = setInterval(() => show((cur + 1) % tabs.length), +root.dataset.auto);
    };
    tabs.forEach((t, k) => {
      t.addEventListener('click', () => { stopped = true; stop(); show(k); });
      t.addEventListener('keydown', (e) => {
        const d = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key];
        if (!d) return;
        e.preventDefault(); stopped = true; stop();
        const n = (k + d + tabs.length) % tabs.length; show(n); tabs[n].focus();
      });
    });
    new IntersectionObserver((es) => es.forEach((e) => (e.isIntersecting ? start() : stop())), { threshold: 0.3 }).observe(root);
    root.addEventListener('mouseenter', stop);
    root.addEventListener('mouseleave', start);
    show(0);
  });

  // ---- technology filter
  const fbtns = $$('[data-f]'), items = $$('.pg-tech li');
  fbtns.forEach((b) => b.addEventListener('click', () => {
    fbtns.forEach((x) => { x.classList.toggle('on', x === b); x.setAttribute('aria-pressed', x === b); });
    items.forEach((li) => {
      const on = b.dataset.f === 'All' || li.dataset.g === b.dataset.f;
      li.hidden = !on;
      if (on) { li.style.animation = 'none'; void li.offsetWidth; li.style.animation = ''; }
    });
  }));

  // ---- Mumbai clock
  const clocks = $$('[data-clock]');
  if (clocks.length) {
    const f = new Intl.DateTimeFormat('en-IN', { hour: 'numeric', minute: '2-digit', hour12: true, timeZone: 'Asia/Kolkata' });
    const tick = () => clocks.forEach((c) => (c.textContent = f.format(new Date()) + ' IST'));
    tick(); setInterval(tick, 20000);
  }

  // ---- contact page helpers
  const form = $('#contact-form');
  if (!form) return;
  const ta = form.elements.message;

  // project type chips (no form fields; the type is prefixed to the message on submit)
  const types = $$('.pg-types [role=radio]');
  let type = '';
  const pick = (el) => { types.forEach((t) => t.setAttribute('aria-checked', t === el)); type = el.dataset.type; };
  types.forEach((t) => {
    t.addEventListener('click', () => pick(t));
    t.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); pick(t); } });
  });
  form.addEventListener('reset', () => { type = ''; types.forEach((t) => t.setAttribute('aria-checked', 'false')); setTimeout(count, 0); });
  document.addEventListener('submit', (e) => {
    if (e.target !== form || !type || !ta || ta.value.startsWith('Project type:')) return;
    ta.value = `Project type: ${type}\n\n${ta.value}`;
  }, true);

  // character counter
  const cnt = $('#pg-count'), fill = $('#pg-barfill');
  function count() { const n = ta.value.length; cnt.textContent = n; fill.style.width = Math.min(100, (n / 2000) * 100) + '%'; }
  ta.addEventListener('input', count); count();

  // brief template
  const tpl = 'Project goal:\nWho it is for:\nMust-have features:\nExamples I like:\nDeadline:\nBudget range:\n';
  $$('[data-template],[data-template2]').forEach((a) => a.addEventListener('click', (e) => {
    e.preventDefault();
    if (!ta.value.trim()) ta.value = tpl;
    else if (!ta.value.includes('Project goal:')) ta.value = ta.value.trim() + '\n\n' + tpl;
    count();
    form.scrollIntoView({ behavior: reduced ? 'auto' : 'smooth', block: 'center' });
    ta.focus({ preventScroll: true });
  }));

  // copy buttons + toast
  const toast = document.createElement('div');
  toast.className = 'pg-toast'; toast.setAttribute('role', 'status'); document.body.appendChild(toast);
  let tt;
  const say = (m) => { toast.textContent = m; toast.classList.add('show'); clearTimeout(tt); tt = setTimeout(() => toast.classList.remove('show'), 1800); };
  const copy = async (b) => {
    const v = b.dataset.copy;
    try { await navigator.clipboard.writeText(v); }
    catch { const t = document.createElement('textarea'); t.value = v; document.body.appendChild(t); t.select(); document.execCommand('copy'); t.remove(); }
    say('Copied ' + (b.dataset.label || ''));
  };
  $$('[data-copy]').forEach((b) => {
    b.addEventListener('click', () => copy(b));
    b.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); copy(b); } });
  });

  // paper plane when the message goes through
  const msg = $('#form-msg');
  let planeT;
  if (msg) new MutationObserver(() => {
    if (!msg.classList.contains('ok') || form.classList.contains('pg-sent')) return;
    form.classList.add('pg-sent'); clearTimeout(planeT);
    planeT = setTimeout(() => form.classList.remove('pg-sent'), 2000);
  }).observe(msg, { attributes: true, childList: true, characterData: true, subtree: true });
})();
