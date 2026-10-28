/* Premium layer: load AFTER main.js on every page (defer). Wrapped so it never clashes with main.js. */
(() => {
  const q = (s, r = document) => r.querySelector(s), qa = (s, r = document) => [...r.querySelectorAll(s)];
  const rm = matchMedia('(prefers-reduced-motion: reduce)').matches;
  const pages = [['Home', 'index.html'], ['About', 'about.html'], ['Work', 'work.html'], ['Capabilities', 'capabilities.html'], ['Contact', 'contact.html']];
  const cur = location.pathname.split('/').pop() || 'index.html';
  const io = new IntersectionObserver((es) => es.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } }), { threshold: 0.15 });

  // Navbar: Home, About, Work, Capabilities, Contact (all pages)
  const links = q('.links');
  if (links) {
    links.innerHTML = pages.map(([n, h]) => `<a href="${h}"${cur === h ? ' class="active"' : ''}>${n}</a>`).join('');
    links.addEventListener('click', () => links.classList.remove('open'));
  }

  // Maroon 3D strips between sections
  const strip = () => { const d = document.createElement('div'); d.className = 'mstrip rv'; d.innerHTML = '<span>Design</span><i>✦</i><span>Build</span><i>✦</i><span>Ship</span>'; io.observe(d); return d; };
  q('[data-mount="featured"]')?.closest('section')?.before(strip());
  q('.cta')?.before(strip());

  // Lamp over the headline (click or press Enter to switch it)
  const intro = q('.intro'), h1 = q('.intro .display');
  if (h1) {
    const l = document.createElement('div');
    l.className = 'lamp on'; l.tabIndex = 0; l.setAttribute('role', 'button'); l.setAttribute('aria-label', 'Switch the lamp on or off');
    l.innerHTML = '<i class="cord"></i><i class="shade"></i><i class="bulb"></i><i class="beam"></i>';
    h1.before(l);
    const tg = () => { l.classList.toggle('on'); intro.classList.toggle('dark', !l.classList.contains('on')); };
    l.addEventListener('click', tg);
    l.addEventListener('keydown', (e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); tg(); } });
  }

  // Interactive chip: tilts with finger or mouse, click sends a pulse through every module
  const chip = q('.chip'), die = q('.chip-die');
  if (chip && die) {
    const set = (x, y) => { die.style.setProperty('--tx', x + 'deg'); die.style.setProperty('--ty', y + 'deg'); };
    chip.style.cursor = 'pointer'; chip.style.touchAction = 'pan-y';
    chip.addEventListener('pointermove', (e) => {
      const r = chip.getBoundingClientRect();
      set((-((e.clientY - r.top) / r.height - 0.5) * 34).toFixed(1), (((e.clientX - r.left) / r.width - 0.5) * 40).toFixed(1));
    });
    chip.addEventListener('pointerleave', () => set(0, 0));
    chip.addEventListener('click', () => {
      chip.classList.remove('burst'); void chip.offsetWidth; chip.classList.add('burst');
      qa('.nodes .node').forEach((n, i) => setTimeout(() => {
        n.classList.add('ping'); qa(`.trace[data-n="${i}"]`).forEach((t) => t.classList.add('hot'));
        setTimeout(() => { n.classList.remove('ping'); qa(`.trace[data-n="${i}"]`).forEach((t) => t.classList.remove('hot')); }, 800);
      }, i * 140));
    });
  }

  // Rangoli tech orbit: stack icons travel around the half flower
  const stats = q('.stats');
  if (stats && typeof DATA !== 'undefined' && typeof icon === 'function') {
    const sec = document.createElement('section');
    sec.className = 'sec';
    sec.innerHTML = '<div class="sec-head"><h2>Tech stack, in full bloom</h2><a href="capabilities.html">See the full stack ↗</a></div><div class="rang rv"><div class="rg-disc"></div><div class="rg-copy"><h3>Every tool, in orbit.</h3><p>Hover an icon to pause the orbit and read its name.</p></div><div class="rg-items"></div></div>';
    stats.after(sec);
    const rang = q('.rang', sec), host = q('.rg-items', sec);
    io.observe(rang);
    const its = DATA.stack.flatMap((g) => g.items).map(([n, k], i) => {
      const el = document.createElement('div'); el.className = 'rg-i'; el.innerHTML = `${icon(k, n)}<b>${n}</b>`; host.append(el);
      return { el, ring: i % 5 < 2 ? 0 : 1 };
    });
    [0, 1].forEach((r) => { const g = its.filter((x) => x.ring === r); g.forEach((x, j) => (x.a = (j / g.length) * Math.PI * 2)); });
    let t = 0, last = performance.now(), paused = false, vis = true, mx = 0;
    host.addEventListener('mouseover', (e) => { if (e.target.closest('.rg-i')) paused = true; });
    host.addEventListener('mouseout', () => (paused = false));
    rang.addEventListener('pointermove', (e) => { const r = rang.getBoundingClientRect(); mx = (e.clientX - r.left) / r.width - 0.5; });
    new IntersectionObserver((es) => (vis = es[0].isIntersecting)).observe(rang);
    const frame = (now) => {
      const dt = Math.min(now - last, 50); last = now;
      if (vis) {
        if (!paused && !rm) t += dt / 1000;
        const H = rang.clientHeight, W = rang.clientWidth, R = [H * 0.36, H * 0.56];
        its.forEach((x) => {
          const a = x.a + (x.ring ? 1 : -1) * t * (x.ring ? 0.07 : 0.11);
          x.el.style.transform = `translate3d(${(W + R[x.ring] * Math.cos(a) + mx * 18).toFixed(1)}px,${(H / 2 + R[x.ring] * Math.sin(a)).toFixed(1)}px,0)`;
        });
      }
      requestAnimationFrame(frame);
    };
    requestAnimationFrame(frame);
  }

  // Radial dial menu (bottom right)
  const d = document.createElement('div');
  d.className = 'dial';
  d.innerHTML = `<nav aria-label="Quick menu">${pages.map(([n, h], i) => `<a href="${h}" style="--i:${4 - i};--y:${-(70 + (4 - i) * 48)}px;--x:${-Math.pow(i - 2, 2) * 9}px">${n}</a>`).join('')}</nav><button class="knob" aria-label="Quick menu" aria-expanded="false"><i></i></button>`;
  document.body.append(d);
  const kb = q('.knob', d);
  kb.addEventListener('click', () => kb.setAttribute('aria-expanded', d.classList.toggle('open')));
  addEventListener('keydown', (e) => e.key === 'Escape' && d.classList.remove('open'));

  // Scroll progress + strip parallax + Lenis smooth scrolling
  const bar = document.createElement('i'); bar.className = 'sprog'; document.body.append(bar);
  const strips = qa('.mstrip');
  const onScroll = () => {
    const y = scrollY, h = document.documentElement.scrollHeight - innerHeight;
    bar.style.setProperty('--p', h > 0 ? (y / h).toFixed(4) : 0);
    strips.forEach((s) => s.style.setProperty('--bx', -y * 0.3 + 'px'));
  };
  addEventListener('scroll', onScroll, { passive: true }); onScroll();
  if (!rm) {
    const s = document.createElement('script');
    s.src = 'https://cdn.jsdelivr.net/npm/lenis@1.1.14/dist/lenis.min.js';
    s.onload = () => {
      if (!window.Lenis) return;
      const l = new Lenis({ lerp: 0.085, smoothWheel: true });
      const raf = (t) => { l.raf(t); requestAnimationFrame(raf); };
      requestAnimationFrame(raf);
    };
    document.head.append(s);
  }
})();