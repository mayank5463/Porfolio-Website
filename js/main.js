// ---------- Config ----------
// Leave empty to run fully static. To use the Node/Express/MongoDB backend, set e.g. 'http://localhost:5000/api'
const API_BASE = '';

// ---------- Content (edit me) ----------
const gh = 'https://github.com/mayank5463';
const DATA = {
  email: 'mayanksoni20012001@gmail.com',
  projects: [
    { title: 'Tradewell', slug: 'tradewell', hue: 220, tags: ['React', 'Redux', 'Upstox API'], featured: true,
      image: 'assets/projects/tradewell-cover.png', w: 1920, h: 1080,
      github: gh, live: 'https://tradewell-marketing.vercel.app/',
      description: 'Stock trading dashboard built with React and Redux, connected to the Upstox API for live market data, paper trading and orders.' },
    { title: 'TripStay', slug: 'tripstay', hue: 25, tags: ['Node.js', 'Express', 'MongoDB'], featured: true,
      image: 'assets/projects/tripstay-cover.png', w: 1080, h: 1920, fit: 'contain',
      github: gh, live: 'https://tripstay-kq15.onrender.com',
      description: 'Airbnb-style listings platform with Node, Express, MongoDB and EJS: create listings, browse stays and manage reviews.' },
    { title: 'HealthMatrix', slug: 'healthmatrix', hue: 265, tags: ['Python', 'FastAPI', 'AI'], featured: true,
      image: 'assets/projects/healthmatrix-cover.png', w: 1920, h: 1080,
      github: 'https://github.com/mayank5463/HealthMatrix', live: '',
      description: 'Full-stack health tracking dashboard with a REST API and AI-assisted insights.' },
  ],
  capabilities: [
    ['Frontend engineering', 'Responsive interfaces with clean structure, routing and state management.'],
    ['REST API design', 'Express APIs with validation, error handling and clear request and response contracts.'],
    ['Database modelling', 'MongoDB and Mongoose schemas, queries and indexes shaped around how the app reads data.'],
    ['AI integration', 'LLM-backed features and Python services (Flask, FastAPI) connected to the web app.'],
    ['Auth and security', 'JWT sessions, hashed passwords, rate limiting and secure headers.'],
    ['Deployment', 'Git workflows and hosting for the client, the API and a MongoDB Atlas database.'],
  ],
  tools: ['React', 'Node.js', 'Express', 'MongoDB', 'Mongoose', 'Redux', 'Python', 'Flask', 'FastAPI', 'Git', 'Postman', 'Vite'],
  process: [
    ['Discover', 'Agree on goals, users and scope.'],
    ['Design the API', 'Define data models and endpoints first.'],
    ['Build', 'Ship the UI against the live API.'],
    ['Test', 'Check endpoints, edge cases and devices.'],
    ['Deploy', 'Release, monitor and iterate.'],
  ],
  api: [
    ['GET', '/api/health', 'Server and database status'],
    ['GET', '/api/profile', 'Bio, stats, skills and process'],
    ['GET', '/api/projects', 'All projects. Filter with ?featured=true or ?tag=React'],
    ['GET', '/api/projects/:slug', 'One project by slug'],
    ['POST', '/api/contact', 'Save a contact-form message (validated, rate limited)'],
    ['POST', '/api/projects', 'Create a project (needs x-admin-key header)'],
    ['DELETE', '/api/projects/:slug', 'Delete a project (needs x-admin-key header)'],
    ['GET', '/api/contact', 'Read saved messages (needs x-admin-key header)'],
  ],
  journey: [
    ['Now', 'Freelance full-stack developer', 'Building MERN web apps and client websites from Mumbai.'],
    ['~1 year', 'AI-powered applications', 'Shipping LLM-backed features and the services behind them.'],
    ['~1 year', 'Python backend development', 'REST APIs with Flask and FastAPI.'],
    ['2+ years', 'Full-stack foundations', 'HTML, CSS, JavaScript, React, Node, Express and MongoDB.'],
  ],
};

// ---------- Helpers ----------
const $ = (s, r = document) => r.querySelector(s);
const $$ = (s, r = document) => [...r.querySelectorAll(s)];
const reduced = matchMedia('(prefers-reduced-motion: reduce)').matches;
const mount = (name, html) => { const el = $(`[data-mount="${name}"]`); if (el) el.innerHTML = html; return el; };
const stagger = () => $$('[data-mount] > *').forEach((el, i) => el.style.setProperty('--i', i % 6));

const projectCard = (p, detailed) => {
  const href = p.live || p.github;                       // live site first, GitHub if there is none
  const label = p.live ? 'Visit live site' : 'View on GitHub';
  const alt = p.github && p.live ? `<a class="btn ghost sm" href="${p.github}" target="_blank" rel="noopener">GitHub</a>` : '';
  return `
  <article class="glass project has-poster rv" style="--h:${p.hue}" data-tilt>
    <div class="poster${p.fit === 'contain' ? ' contain' : ''}" style="--img:url('${p.image}')">
      <img src="${p.image}" alt="${p.title} project poster" width="${p.w}" height="${p.h}" loading="lazy" decoding="async">
    </div>
    <div class="p-body">
      <h3><a href="${href}" target="_blank" rel="noopener" aria-label="${p.title}: ${label}">${p.title}</a></h3>
      ${detailed
        ? `<p class="muted">${p.description}</p><ul class="chips">${p.tags.map((t) => `<li>${t}</li>`).join('')}</ul>
           <div class="row"><a class="btn solid sm" href="${href}" target="_blank" rel="noopener">${label} ↗</a>${alt}</div>`
        : `<p class="muted">${p.tags.join(' · ')}</p><span class="go">${label} <i>↗</i></span>`}
    </div>
  </article>`;
};

async function loadProjects() {
  if (!API_BASE) return DATA.projects;
  try {
    const r = await fetch(`${API_BASE}/projects`);
    if (!r.ok) throw new Error();
    return await r.json();
  } catch { return DATA.projects; }
}

// ---------- Nav, glow, page transitions ----------
const burger = $('.burger'), links = $('.links');
burger?.addEventListener('click', () => {
  const open = links.classList.toggle('open');
  burger.setAttribute('aria-expanded', open);
});
$$('.links a').forEach((a) => a.addEventListener('click', () => links.classList.remove('open')));
$$('.links a').forEach((a) => { if (a.getAttribute('href') === location.pathname.split('/').pop() || (a.getAttribute('href') === 'index.html' && !location.pathname.split('/').pop())) a.classList.add('active'); });

if (!reduced) {
  const glow = $('.glow');
  addEventListener('mousemove', (e) => { if (glow) glow.style.transform = `translate(${e.clientX}px,${e.clientY}px)`; });
  document.addEventListener('click', (e) => {
    const a = e.target.closest('a[href]');
    if (!a || a.target === '_blank' || a.hasAttribute('download') || e.metaKey || e.ctrlKey) return;
    const u = new URL(a.href, location.href);
    if (u.origin !== location.origin || u.pathname === location.pathname || !u.pathname.endsWith('.html')) return;
    e.preventDefault();
    document.body.classList.add('leaving');
    setTimeout(() => (location.href = u.href), 240);
  });
  addEventListener('pageshow', () => document.body.classList.remove('leaving'));
}

// ---------- Photo fallback ----------
$$('img.photo, img.chip-img').forEach((img) => img.addEventListener('error', () => {
  const d = document.createElement('div');
  d.className = img.className + ' ph'; d.textContent = 'MS'; d.setAttribute('role', 'img'); d.setAttribute('aria-label', 'Photo placeholder');
  img.replaceWith(d);
}));

// ---------- Tech stack (stage, capabilities, marquee) ----------
const GLYPHS = new Set(['rag', 'genai', 'ml', 'llm', 'agent', 'bullmq', 'dsa', 'sysdesign', 'rest', 'cicd']);
DATA.stack = [
  { t: 'Frontend', side: 'left', x: 12, y: 17, items: [['HTML5', 'html5'], ['CSS3', 'css3'], ['JavaScript', 'javascript'], ['React', 'react'], ['Redux', 'redux']] },
  { t: 'Backend', side: 'left', x: 12, y: 50, items: [['Node.js', 'nodejs'], ['Express', 'express'], ['NestJS', 'nestjs'], ['FastAPI', 'fastapi'], ['Django', 'django'], ['Python', 'python']] },
  { t: 'Data and queues', side: 'left', x: 12, y: 83, items: [['MySQL', 'mysql'], ['PostgreSQL', 'postgresql'], ['MongoDB', 'mongodb'], ['Redis cache', 'redis'], ['BullMQ', 'bullmq']] },
  { t: 'AI engineering', side: 'right', x: 88, y: 17, items: [['RAG', 'rag'], ['GenAI', 'genai'], ['ML', 'ml'], ['LLM APIs', 'llm'], ['Agentic AI', 'agent']] },
  { t: 'Cloud and DevOps', side: 'right', x: 88, y: 50, items: [['AWS', 'aws'], ['Docker', 'docker'], ['Kubernetes', 'kubernetes'], ['GitHub Actions', 'githubactions'], ['CI/CD', 'cicd']] },
  { t: 'Testing', side: 'right', x: 88, y: 83, items: [['Pytest', 'pytest'], ['Jest', 'jest']] },
  { t: 'APIs and design', side: 'top', x: 50, y: 8, items: [['REST API', 'rest'], ['GraphQL', 'graphql'], ['System design', 'sysdesign']] },
  { t: 'Core engineering', side: 'bottom', x: 50, y: 92, items: [['DSA', 'dsa'], ['Git', 'git']] },
];
const icon = (k, n) => `<span class="ic${GLYPHS.has(k) ? ' g' : ''}"><img src="assets/icons/${k}.svg" alt="" loading="lazy" onerror="this.replaceWith(document.createTextNode('${n.slice(0, 2)}'))"></span>`;
const tech = ([n, k]) => `<li title="${n}">${icon(k, n)}<span>${n}</span></li>`;

function buildStage() {
  const st = $('.stage'); if (!st) return;
  const chip = $('.chip', st), svg = $('.traces', st), die = $('.chip-die', st), nodes = $$('.node', st);
  const compact = () => matchMedia('(max-width:1039px)').matches;
  let booted = false;
  const lit = (sel) => $$(sel, svg).forEach((e) => e.classList.add('on'));

  function draw() {
    if (compact()) { svg.innerHTML = ''; return; }
    const W = st.clientWidth, H = st.clientHeight;
    svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
    const cx = chip.offsetLeft, cy = chip.offsetTop, cw = chip.offsetWidth, half = cw / 2 + 18;
    const bySide = { left: [], right: [], top: [], bottom: [] };
    nodes.forEach((n, i) => bySide[n.dataset.side].push(i));
    let out = '';
    nodes.forEach((n, i) => {
      const side = n.dataset.side, w = n.offsetWidth, h = n.offsetHeight, nx = n.offsetLeft, ny = n.offsetTop;
      const horiz = side === 'left' || side === 'right';
      const idx = bySide[side].indexOf(i), cnt = bySide[side].length;
      const pin = horiz ? (idx - (cnt - 1) / 2) * cw * 0.3 : 0;
      const offs = horiz ? [-6, 6] : [-12, 0, 12];
      const reverse = side === 'right' || side === 'bottom';
      offs.forEach((d, li) => {
        let sx, sy, ex, ey, p;
        if (side === 'left') { sx = nx + w / 2; sy = ny + d; ex = cx - half; ey = cy + pin + d; const mx = sx + (ex - sx) * 0.5 + d * 1.5; p = `M${sx} ${sy}H${mx}V${ey}H${ex}`; }
        else if (side === 'right') { sx = nx - w / 2; sy = ny + d; ex = cx + half; ey = cy + pin + d; const mx = sx + (ex - sx) * 0.5 - d * 1.5; p = `M${sx} ${sy}H${mx}V${ey}H${ex}`; }
        else { const dir = side === 'top' ? 1 : -1; sx = nx + d; sy = ny + dir * h / 2; ex = cx + d * 1.7; ey = cy - dir * half; const my = sy + (ey - sy) * 0.45; p = `M${sx} ${sy}V${my}H${ex}V${ey}`; }
        out += `<path class="trace" data-n="${i}" d="${p}"/><path class="flow" data-n="${i}" d="${p}"/>`
          + `<circle class="dot" data-n="${i}" cx="${sx}" cy="${sy}" r="2.5"/><rect class="pin" data-n="${i}" x="${ex - 3}" y="${ey - 3}" width="6" height="6" rx="1"/>`;
        if (li === (offs.length > 2 ? 1 : 0)) {
          const dur = (3 + (i % 4) * 0.45).toFixed(2);
          out += `<circle class="pulse" data-n="${i}" r="3"><animateMotion dur="${dur}s" begin="${(i * 0.4).toFixed(1)}s" repeatCount="indefinite" path="${p}"${reverse ? ' keyPoints="1;0" keyTimes="0;1" calcMode="linear"' : ''}/></circle>`;
        }
      });
    });
    svg.innerHTML = out;
    $$('.trace', svg).forEach((t) => t.style.setProperty('--len', t.getTotalLength()));
    if (booted) lit('.trace,.flow,.dot,.pin,.pulse');
  }

  function boot() {
    if (compact() || reduced) { chip.classList.add('on'); nodes.forEach((n) => n.classList.add('on')); booted = true; lit('.trace,.flow,.dot,.pin,.pulse'); return; }
    setTimeout(() => chip.classList.add('on'), 150);
    nodes.forEach((n, i) => {
      const t = 700 + i * 240;
      setTimeout(() => lit(`.trace[data-n="${i}"],.dot[data-n="${i}"],.pin[data-n="${i}"]`), t);
      setTimeout(() => n.classList.add('on'), t + 500);
      setTimeout(() => lit(`.flow[data-n="${i}"],.pulse[data-n="${i}"]`), t + 1100);
    });
    setTimeout(() => (booted = true), 700 + nodes.length * 240 + 1300);
  }

  nodes.forEach((n, i) => {
    const set = (v) => () => $$(`.trace[data-n="${i}"]`, svg).forEach((e) => e.classList.toggle('hot', v));
    n.addEventListener('mouseenter', set(true)); n.addEventListener('mouseleave', set(false));
  });
  if (!reduced) {
    st.addEventListener('mousemove', (e) => {
      const r = st.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
      st.style.setProperty('--px', x.toFixed(3)); st.style.setProperty('--py', y.toFixed(3));
      die.style.setProperty('--ry', (x * 10).toFixed(1) + 'deg'); die.style.setProperty('--rx', (-y * 10).toFixed(1) + 'deg');
    });
    st.addEventListener('mouseleave', () => { die.style.setProperty('--rx', '0deg'); die.style.setProperty('--ry', '0deg'); });
  }
  let rt; addEventListener('resize', () => { clearTimeout(rt); rt = setTimeout(() => { draw(); if (compact()) { chip.classList.add('on'); nodes.forEach((n) => n.classList.add('on')); } }, 120); });
  draw(); boot();
  document.fonts?.ready.then(draw);
}

// ---------- Render ----------
(async () => {
  const projects = await loadProjects();

  mount('featured', projects.filter((p) => p.featured).map((p) => projectCard(p, false)).join(''));

  const work = $('[data-mount="work"]');
  if (work) {
    const tags = ['All', ...new Set(projects.flatMap((p) => p.tags))];
    const draw = (tag) => {
      work.innerHTML = projects.filter((p) => tag === 'All' || p.tags.includes(tag)).map((p) => projectCard(p, true)).join('');
      stagger(); observe(); tilt();
    };
    mount('filters', tags.map((t) => `<button class="chip-btn${t === 'All' ? ' on' : ''}" aria-pressed="${t === 'All'}">${t}</button>`).join(''));
    $('[data-mount="filters"]').addEventListener('click', (e) => {
      const b = e.target.closest('.chip-btn'); if (!b) return;
      $$('.chip-btn').forEach((x) => { x.classList.toggle('on', x === b); x.setAttribute('aria-pressed', x === b); });
      draw(b.textContent);
    });
    draw('All');
  }

  mount('caps', DATA.capabilities.map(([t, d]) => `<div class="rv"><h3>${t}</h3><p class="muted">${d}</p></div>`).join(''));
  mount('tools', DATA.tools.map((t) => `<li class="rv"><i>${t.slice(0, 2)}</i>${t}</li>`).join(''));
  mount('process', DATA.process.map(([t, d], i) => `<li><span class="muted">${i + 1}</span><h3>${t}</h3><p class="muted">${d}</p></li>`).join(''));
  mount('api', DATA.api.map(([m, p, d]) => `<tr><td><span class="m ${m}">${m}</span></td><td><code>${p}</code></td><td class="muted">${d}</td></tr>`).join(''));
  mount('timeline', DATA.journey.map(([w, t, d]) => `<li class="rv"><span class="muted">${w}</span><h3>${t}</h3><p class="muted">${d}</p></li>`).join(''));
  const flat = DATA.stack.flatMap((g) => g.items);
  mount('marquee', [...flat, ...flat].map(([n, k]) => `<li>${icon(k, n)}${n}</li>`).join(''));
  mount('stackgroups', DATA.stack.map((g) => `<div class="glass pad rv"><h3 class="gh">${g.t}</h3><ul class="tl tgrid">${g.items.map(tech).join('')}</ul></div>`).join(''));
  mount('nodes', DATA.stack.map((g, i) => `<div class="node" style="--x:${g.x}%;--y:${g.y}%" data-side="${g.side}" data-n="${i}"><h3>${g.t}</h3><ul class="tl">${g.items.map(tech).join('')}</ul></div>`).join(''));
  buildStage();

  stagger(); observe(); tilt();
})();

// ---------- Scroll reveal + count-up ----------
let io;
function observe() {
  io = io || new IntersectionObserver((entries) => entries.forEach((en) => {
    if (!en.isIntersecting) return;
    en.target.classList.add('in'); io.unobserve(en.target);
    if (en.target.matches('.stats')) countUp(en.target);
  }), { threshold: 0.15 });
  $$('.rv:not(.in), .process:not(.in)').forEach((el) => (reduced ? el.classList.add('in') : io.observe(el)));
}
function countUp(root) {
  $$('[data-count]', root).forEach((el) => {
    const end = +el.dataset.count, suffix = el.dataset.suffix || '';
    if (reduced) return (el.textContent = end + suffix);
    const t0 = performance.now(), dur = 1400;
    const tick = (t) => {
      const k = Math.min((t - t0) / dur, 1), eased = 1 - Math.pow(1 - k, 3);
      el.textContent = Math.round(end * eased) + suffix;
      if (k < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  });
}

// ---------- 3D tilt on cards ----------
function tilt() {
  if (reduced || matchMedia('(hover: none)').matches) return;
  $$('[data-tilt]:not([data-tilted])').forEach((c) => {
    c.dataset.tilted = '1';
    c.addEventListener('mousemove', (e) => {
      const r = c.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
      c.style.transform = `perspective(700px) rotateX(${(-y * 7).toFixed(2)}deg) rotateY(${(x * 9).toFixed(2)}deg) translateY(-4px)`;
    });
    c.addEventListener('mouseleave', () => (c.style.transform = ''));
  });
}

// ---------- Typewriter ----------
const typed = $('.typed');
if (typed) {
  const words = JSON.parse(typed.dataset.words);
  if (reduced) typed.textContent = words[0];
  else {
    let w = 0, i = 0, del = false;
    (function step() {
      const word = words[w];
      typed.textContent = word.slice(0, i);
      if (!del && i === word.length) { del = true; return setTimeout(step, 1500); }
      if (del && i === 0) { del = false; w = (w + 1) % words.length; }
      i += del ? -1 : 1;
      setTimeout(step, del ? 35 : 70);
    })();
  }
}

// ---------- API status (Capabilities page) ----------
$('#ping')?.addEventListener('click', async () => {
  const out = $('#ping-out');
  if (!API_BASE) { out.textContent = 'Static mode: set API_BASE in js/main.js to connect the Express backend.'; return; }
  try { out.textContent = JSON.stringify(await (await fetch(`${API_BASE}/health`)).json()); }
  catch (e) { out.textContent = 'API not reachable: ' + e.message; }
});

// ---------- Contact form ----------
$('#contact-form')?.addEventListener('submit', async (e) => {
  e.preventDefault();
  const f = e.target, body = Object.fromEntries(new FormData(f)), msg = $('#form-msg'), btn = $('button', f);
  msg.className = ''; msg.textContent = '';
  if (!API_BASE) { // no backend: open the visitor's email app with the message filled in
    location.href = `mailto:${DATA.email}?subject=${encodeURIComponent('Portfolio message from ' + body.name)}&body=${encodeURIComponent(body.message + '\n\n' + body.name + ' (' + body.email + ')')}`;
    msg.className = 'ok'; msg.textContent = 'Opening your email app to send the message.'; return;
  }
  btn.disabled = true; btn.textContent = 'Sending…';
  try {
    const r = await fetch(`${API_BASE}/contact`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
    const d = await r.json().catch(() => ({}));
    if (!r.ok) throw new Error(d.error || 'Could not send your message.');
    f.reset(); msg.className = 'ok'; msg.textContent = "Message sent. I'll reply by email.";
  } catch (err) { msg.className = 'err'; msg.textContent = err.message; }
  btn.disabled = false; btn.textContent = 'Send message';
});

// ---------- "HI" in 15 languages ----------
const HI = [['Hi','English'],['नमस्ते','Hindi'],['Bonjour','French'],['你好','Chinese'],['નમસ્તે','Gujarati'],['नमस्कार','Marathi'],['Hola','Spanish'],['こんにちは','Japanese'],['안녕하세요','Korean'],['Hallo','German'],['Ciao','Italian'],['Olá','Portuguese'],['Привет','Russian'],['مرحبا','Arabic'],['Merhaba','Turkish']];
const hiEl = $('[data-hi]');
if (hiEl) {
  let n = 0;
  const show = () => {
    hiEl.classList.remove('in');
    setTimeout(() => { hiEl.innerHTML = `<span class="hi-w">${HI[n][0]}</span><small>${HI[n][1]}</small>`; hiEl.classList.add('in'); n = (n + 1) % HI.length; }, reduced ? 0 : 300);
  };
  show();
  if (!reduced) setInterval(show, 2300);
}

// ---------- 3D tilt on buttons ----------
if (!reduced && !matchMedia('(hover: none)').matches) {
  $$('.btn,.pill').forEach((b) => {
    b.addEventListener('mousemove', (e) => {
      const r = b.getBoundingClientRect(), x = (e.clientX - r.left) / r.width - 0.5, y = (e.clientY - r.top) / r.height - 0.5;
      b.style.transform = `perspective(500px) rotateX(${(-y * 20).toFixed(1)}deg) rotateY(${(x * 24).toFixed(1)}deg) translateZ(10px)`;
    });
    b.addEventListener('mouseleave', () => (b.style.transform = ''));
  });
}