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

  // Maroon 3D strips between sections (static: no reveal, no scroll movement)
  const strip = () => { const d = document.createElement('div'); d.className = 'mstrip'; d.innerHTML = '<span>Design</span><i>✦</i><span>Build</span><i>✦</i><span>Ship</span>'; return d; };
  q('[data-mount="featured"]')?.closest('section')?.before(strip());
  q('.cta')?.before(strip());

  // Lamp over the headline (only runs if a .intro .display headline exists)
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

  // Systems I build: simple, static, text-only section
  const stats = q('.stats');
  if (stats) {
    const GROUPS = [
      ['Web Development', [
        ['Website Development', 'Fast, responsive business and portfolio websites.'],
        ['Web App Development', 'Full-stack applications built around your workflow.'],
        ['Frontend Web Development', 'Clean, accessible interfaces in HTML, CSS, JavaScript and React.'],
        ['Backend Web Development', 'Secure APIs, databases and server-side logic.'],
        ['Web Maintenance', 'Updates, bug fixes, monitoring and performance care.']
      ]],
      ['Business Systems', [
        ['ERP Development', 'Custom ERP platforms that connect your departments.'],
        ['Inventory Management System', 'Stock, purchase, sales and supplier tracking.'],
        ['School Management System', 'Students, staff, attendance, fees and results.'],
        ['Hospital Management System', 'Patients, appointments, billing and records.'],
        ['Hotel Management System', 'Bookings, rooms, billing and guest management.'],
        ['All ERP Systems', 'Any industry-specific ERP, designed to your needs.']
      ]],
      ['AI Solutions', [
        ['RAG Chatbot', 'Chatbots that answer from your own documents and data.'],
        ['LLM Integration', 'Language-model features added to your existing product.']
      ]]
    ];
    const sec = document.createElement('section');
    sec.className = 'sec';
    sec.innerHTML = '<div class="sec-head"><h2>Systems I build</h2><a href="contact.html">Start a project ↗</a></div>'
      + '<div class="sys"><div class="sys-intro"><h3>Software built for how your business works.</h3>'
      + '<p>From a single website to a complete management system, each solution is planned, built and supported end to end.</p></div>'
      + '<div class="sys-groups">'
      + GROUPS.map(([g, items]) => `<div class="sys-group"><h4>${g}</h4><ul>${items.map(([t, d]) => `<li><strong>${t}</strong><span>${d}</span></li>`).join('')}</ul></div>`).join('')
      + '</div></div>';
    stats.after(sec);
  }

  // Radial dial menu (bottom right)
  const d = document.createElement('div');
  d.className = 'dial';
  d.innerHTML = `<nav aria-label="Quick menu">${pages.map(([n, h], i) => `<a href="${h}" style="--i:${4 - i};--y:${-(70 + (4 - i) * 48)}px;--x:${-Math.pow(i - 2, 2) * 9}px">${n}</a>`).join('')}</nav><button class="knob" aria-label="Quick menu" aria-expanded="false"><i></i></button>`;
  document.body.append(d);
  const kb = q('.knob', d);
  kb.addEventListener('click', () => kb.setAttribute('aria-expanded', d.classList.toggle('open')));
  addEventListener('keydown', (e) => e.key === 'Escape' && d.classList.remove('open'));

  // Scroll progress + Lenis smooth scrolling
  const bar = document.createElement('i'); bar.className = 'sprog'; document.body.append(bar);
  const onScroll = () => {
    const y = scrollY, h = document.documentElement.scrollHeight - innerHeight;
    bar.style.setProperty('--p', h > 0 ? (y / h).toFixed(4) : 0);
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