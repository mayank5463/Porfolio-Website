/* Capabilities page: one self-contained script (content, charts, tabs, filters, certificates). */
(() => {
  const $ = (s, r = document) => r.querySelector(s), $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const rm = matchMedia('(prefers-reduced-motion: reduce)').matches;
  document.documentElement.classList.add('js');
  const TICK = '<svg viewBox="0 0 16 16" aria-hidden="true"><path d="M3 8.5l3.2 3L13 4.5"/></svg>';
  const ticks = (a) => `<ul class="ticks">${a.map((t, i) => `<li style="--i:${i}">${TICK}<span>${t}</span></li>`).join('')}</ul>`;
  const chips = (a) => `<ul class="chips">${a.map((t) => `<li>${t}</li>`).join('')}</ul>`;
  const head = (t, p) => `<div class="sec-head"><h2>${t}</h2><p class="muted">${p}</p></div>`;

  /* ---------------- data ---------------- */
  const GROUPS = [['Frontend', '#e0b76a'], ['Backend', '#d4527a'], ['Data', '#7aa2ff'], ['AI', '#5df0a0'], ['Cloud and DevOps', '#c792ea'], ['Testing', '#ff9f6b'], ['APIs and design', '#6bd6e8'], ['Core', '#9aa4b2']];
  const TECH = [
    ['HTML5', 'Semantic pages', 'Frontend', 'html5'], ['CSS3', 'Responsive layouts', 'Frontend', 'css3'], ['JavaScript', 'ES6+ logic', 'Frontend', 'javascript'], ['React', 'Component UIs', 'Frontend', 'react'], ['Redux', 'App state', 'Frontend', 'redux'],
    ['Node.js', 'Server runtime', 'Backend', 'nodejs'], ['Express', 'REST APIs', 'Backend', 'express'], ['NestJS', 'Structured servers', 'Backend', 'nestjs'], ['FastAPI', 'Python APIs', 'Backend', 'fastapi'], ['Django', 'Full web framework', 'Backend', 'django'], ['Python', 'Services, AI glue', 'Backend', 'python'],
    ['MySQL', 'Relational data', 'Data', 'mysql'], ['PostgreSQL', 'SQL at scale', 'Data', 'postgresql'], ['MongoDB', 'Document data', 'Data', 'mongodb'], ['Redis cache', 'Fast caching', 'Data', 'redis'], ['BullMQ', 'Job queues', 'Data', 'bullmq'],
    ['RAG', 'Grounded answers', 'AI', 'rag'], ['GenAI', 'Generative features', 'AI', 'genai'], ['ML', 'Models', 'AI', 'ml'], ['LLM APIs', 'Chat and tools', 'AI', 'llm'], ['Agentic AI', 'Multi-step agents', 'AI', 'agent'],
    ['AWS', 'EC2, S3, RDS, Lambda', 'Cloud and DevOps', 'aws'], ['Docker', 'Containers', 'Cloud and DevOps', 'docker'], ['Kubernetes', 'Orchestration', 'Cloud and DevOps', 'kubernetes'], ['GitHub Actions', 'CI pipelines', 'Cloud and DevOps', 'githubactions'], ['CI/CD', 'Automated releases', 'Cloud and DevOps', 'cicd'],
    ['Pytest', 'Python tests', 'Testing', 'pytest'], ['Jest', 'JavaScript tests', 'Testing', 'jest'],
    ['REST API', 'Clear contracts', 'APIs and design', 'rest'], ['GraphQL', 'Flexible queries', 'APIs and design', 'graphql'], ['System design', 'Scalable structure', 'APIs and design', 'sysdesign'],
    ['DSA', 'Problem solving', 'Core', 'dsa'], ['Git', 'Version control', 'Core', 'git']
  ];
  const count = (g) => TECH.filter((t) => t[2] === g).length;

  const CORE = [
    ['Frontend engineering', 'Responsive interfaces with clean structure, routing and state management.', 'M3 5h18v12H3zM8 21h8M12 17v4'],
    ['REST API design', 'Express APIs with validation, error handling and clear request and response contracts.', 'M8 7l-5 5 5 5M16 7l5 5-5 5'],
    ['Database modelling', 'MongoDB and Mongoose schemas, queries and indexes shaped around how the app reads data.', 'M4 6c0-2 16-2 16 0v12c0 2-16 2-16 0zM4 12c0 2 16 2 16 0'],
    ['AI integration', 'LLM-backed features and Python services (Flask, FastAPI) connected to the web app.', 'M12 3v4M12 17v4M3 12h4M17 12h4M7 7l2 2M15 15l2 2M17 7l-2 2M9 15l-2 2'],
    ['Auth and security', 'JWT sessions, hashed passwords, rate limiting and secure headers.', 'M12 3l8 3v6c0 5-3.5 8-8 9-4.5-1-8-4-8-9V6z'],
    ['Deployment', 'Git workflows and hosting for the client, the API and a MongoDB Atlas database.', 'M12 3c4 2 6 6 6 10l-3 3H9l-3-3c0-4 2-8 6-10zM9 19l-2 2M15 19l2 2']
  ];
  const TOOLS = ['React', 'Node.js', 'Express', 'MongoDB', 'Mongoose', 'Redux', 'Python', 'Flask', 'FastAPI', 'Git', 'Postman', 'Vite'];

  const SERVICES = [
    ['Web app development', 'Dashboards, marketplaces and tools that need real data, accounts and speed.', ['React and Redux front ends with reusable components', 'Node.js, Express, NestJS, FastAPI or Django back ends', 'MongoDB, PostgreSQL or MySQL, with Redis caching and BullMQ queues', 'Authentication, validation and REST or GraphQL APIs'], ['React', 'Node.js', 'MongoDB', 'PostgreSQL', 'Redis'], 'M8 40l24 12 24-12M8 32l24 12 24-12M8 24l24 12 24-12-24-12z'],
    ['Website development', 'Fast, responsive business sites that look sharp and bring in enquiries.', ['Responsive design, English and Hindi supported', 'SEO fundamentals and contact-form workflows', 'Tested in Chrome, Firefox and Safari', 'Deployed on Netlify or Vercel'], ['HTML5', 'CSS3', 'JavaScript', 'SEO', 'Netlify'], 'M8 12h48v40H8zM8 22h48M16 31h30M16 38h22M16 45h34'],
    ['AI development', 'Practical AI features added to real products, not demos.', ['RAG pipelines that ground answers in your own data', 'LLM API integrations and generative features', 'Agentic workflows that complete multi-step tasks', 'Python services with FastAPI connected to your app'], ['RAG', 'GenAI', 'LLM APIs', 'Agentic AI', 'FastAPI'], 'M10 16l22-6 22 14M10 32l22-22M10 32l22 8 22-16M10 48l22-24 22 16M32 54l22-14M10 16l22 24'],
    ['Software development', 'Clean, tested back end systems and tooling that stay maintainable.', ['REST and GraphQL APIs with clear contracts', 'Pytest and Jest test suites, debugging and performance work', 'System design and data structures applied to real constraints', 'Docker, CI/CD with GitHub Actions, AWS deployment'], ['Python', 'Pytest', 'Jest', 'Docker', 'AWS'], 'M24 20L12 32l12 12M40 20l12 12-12 12M36 16L28 48']
  ];

  const LAYERS = [
    ['Client', 'React · Redux · UI', 'Interfaces that stay fast: reusable React components, Redux state, charts and forms that work on every screen.', ['React', 'Redux', 'HTML5', 'CSS3'], "Tradewell's dashboards, candlestick charts and watchlists."],
    ['API layer', 'Express · NestJS · FastAPI', 'The contract between screen and data: REST or GraphQL endpoints with validation, authentication and rate limiting.', ['Node.js', 'Express', 'NestJS', 'FastAPI', 'Django', 'GraphQL'], 'REST APIs behind Tradewell and TripStay.'],
    ['Services', 'Cache · Queues · AI', 'The work behind the scenes: Redis caching for speed, BullMQ queues for background jobs and LLM-powered features.', ['Redis', 'BullMQ', 'LLM APIs', 'RAG', 'Agents'], 'Data caching helped cut Tradewell chart loads from 8 s to under 2 s.'],
    ['Data', 'SQL · MongoDB', 'Schemas and queries shaped around how the app reads data, in the right database for the job.', ['MongoDB', 'PostgreSQL', 'MySQL'], 'MongoDB behind both Tradewell and TripStay.'],
    ['Infrastructure', 'Docker · AWS · CI/CD', 'Packaging, pipelines and hosting so releases are repeatable and the app stays up.', ['Docker', 'Kubernetes', 'AWS', 'GitHub Actions', 'Vercel', 'Render', 'Netlify'], 'Shipped to Vercel, Render and Netlify.']
  ];

  const PHASES = [
    ['Discover', 'Goals, users and scope.', ['Your goals and audience', 'Sites or apps you like', 'Any deadlines'], ['A written scope and feature list', 'Technology choices explained in plain language']],
    ['Design the API', 'Data models and endpoints first.', ['Feedback on the scope', 'Answers on edge cases'], ['Data models and an endpoint list (the API contract)', 'Page and screen structure']],
    ['Build', 'The UI on top of a live API.', ['Content, logos and assets', 'Quick feedback on previews'], ['A working React interface connected to the real API', 'Previews as features land']],
    ['Test', 'Endpoints, edge cases and devices.', ['Anything that looks off to you'], ['Endpoint and edge-case checks', 'Tested on mobile and desktop in Chrome, Firefox and Safari']],
    ['Deploy', 'Release, monitor, iterate.', ['Domain or hosting preferences'], ['A live URL on Vercel, Render, Netlify or AWS', 'Documentation for the setup, then iteration based on real use']]
  ];

  const CERTS = [
    ['AI Upskilling Certificate: Technical Foundation', 'Qualcomm Academy', 'October 19, 2026', 'Qualcomm ID', '4g4IdMULMT', 'assets/certificates/qualcomm-ai-upskilling.pdf', '#1b3fae', '#0a1a5c'],
    ['Introduction to Amazon SageMaker', 'Course certificate', '21 October 2026', 'Certificate code', '10919768', 'assets/certificates/amazon-sagemaker.pdf', '#7a0f2d', '#3a0614'],
    ['Introduction to Prompt Engineering with GitHub Copilot', 'Course certificate', '21 October 2026', 'Certificate code', '10919621', 'assets/certificates/prompt-engineering-github-copilot.pdf', '#8a6a24', '#2e220a']
  ];

  const QUALITY = ['Responsive on mobile, tablet and desktop', 'Tested in Chrome, Firefox and Safari', 'Input validation and clear error handling', 'Secure headers and rate limiting on APIs', 'SEO fundamentals and fast loading', 'Keyboard focus and reduced-motion support', 'Documented setup and API', 'Deployed and handed over, not left on localhost'];

  const API = [['GET', '/api/health', 'Server and database status'], ['GET', '/api/profile', 'Bio, stats, skills and process'], ['GET', '/api/projects', 'All projects. Filter with ?featured=true or ?tag=React'], ['GET', '/api/projects/:slug', 'One project by slug'], ['POST', '/api/contact', 'Save a contact-form message (validated, rate limited)'], ['POST', '/api/projects', 'Create a project (needs x-admin-key header)'], ['DELETE', '/api/projects/:slug', 'Delete a project (needs x-admin-key header)'], ['GET', '/api/contact', 'Read saved messages (needs x-admin-key header)']];
  const L = (i, h) => `<span class="ln" style="--i:${i}">${h}</span>`;
  const SAMPLES = [
    ['GET /api/projects', [L(0, '<span class="c"># List featured projects</span>'), L(1, 'curl <span class="s">"https://your-api.example.com/api/projects?featured=true"</span>'), L(2, '<span class="ok">200 OK</span>'), L(3, '['), L(4, '  {'), L(5, '    <span class="k">"title"</span>: <span class="s">"Tradewell"</span>,'), L(6, '    <span class="k">"slug"</span>: <span class="s">"tradewell"</span>,'), L(7, '    <span class="k">"tags"</span>: [<span class="s">"React"</span>, <span class="s">"Redux"</span>, <span class="s">"Upstox API"</span>],'), L(8, '    <span class="k">"featured"</span>: <span class="n">true</span>'), L(9, '  }'), L(10, ']')]],
    ['POST /api/contact', [L(0, '<span class="c"># Send a message</span>'), L(1, 'curl -X POST https://your-api.example.com/api/contact \\'), L(2, '  -H <span class="s">"Content-Type: application/json"</span> \\'), L(3, '  -d <span class="s">\'{"name":"Ada","email":"ada@example.com","message":"Hello"}\'</span>'), L(4, '<span class="ok">201 Created</span>'), L(5, '{ <span class="k">"ok"</span>: <span class="n">true</span> }')]],
    ['GET /api/health', [L(0, '<span class="c"># Check server and database</span>'), L(1, 'curl <span class="s">"https://your-api.example.com/api/health"</span>'), L(2, '<span class="ok">200 OK</span>'), L(3, '{'), L(4, '  <span class="k">"status"</span>: <span class="s">"ok"</span>,'), L(5, '  <span class="k">"db"</span>: <span class="s">"connected"</span>'), L(6, '}')]]
  ];

  const FAQ = [
    ['What can you build for me?', 'Business websites, full stack web apps, REST and GraphQL APIs, and AI features such as RAG and LLM integrations. If you are unsure which fits, describe the goal and I will suggest a route.'],
    ['Which technologies do you use?', 'My core is React, Node.js, Express and MongoDB. I also work with Python (FastAPI, Django), PostgreSQL and MySQL, Redis, Docker and AWS, and I deploy to Vercel, Render and Netlify.'],
    ['How long will my project take?', 'It depends on scope. After a short discovery step I give a written scope and an estimate, so you know what to expect before we start.'],
    ['Do you handle deployment?', 'Yes. I own delivery through to a live URL and write up the setup so it can be maintained.'],
    ['Can you work remotely?', 'Yes. I am based in Mumbai and work independently in a remote setup, communicating directly with clients.'],
    ['Can you build a bilingual site?', 'Yes. I delivered an English and Hindi website for a client, built to work on mobile and desktop.']
  ];

  /* ---------------- render ---------------- */
  const tabs = (id, cls) => (n) => n;
  const tabsHtml = {
    arch: () => `<div class="arch glass pad rv" data-tabs data-auto="4200"><div class="layers" role="tablist" aria-label="Architecture layers">${LAYERS.map(([t, s], i) => `${i ? '<i class="wire"></i>' : ''}<button class="tab" data-tab role="tab"><b>0${i + 1}</b><span>${t}</span><small>${s}</small></button>`).join('')}</div><div class="panels">${LAYERS.map(([t, , d, c, e]) => `<div class="panel" data-panel role="tabpanel"><h3>${t}</h3><p class="muted">${d}</p>${chips(c)}<p class="ex">In practice: ${e}</p></div>`).join('')}</div></div>`,
    flow: () => `<div class="glass pad rv" data-tabs data-auto="5200"><div class="stepper" role="tablist" aria-label="Delivery phases">${PHASES.map(([t], i) => `<button class="step" data-tab role="tab"><i>${i + 1}</i><span>${t}</span></button>`).join('')}</div><div class="panels">${PHASES.map(([t, d, a, b]) => `<div class="panel" data-panel role="tabpanel"><h3>${t}</h3><p class="muted">${d}</p><div class="two"><div><h4>You provide</h4>${ticks(a)}</div><div><h4>I deliver</h4>${ticks(b)}</div></div></div>`).join('')}</div></div>`,
    code: () => `<div class="code rv" data-tabs><div class="code-bar"><i></i><i></i><i></i><div role="tablist" aria-label="Example requests">${SAMPLES.map(([t]) => `<button class="pill" data-tab role="tab">${t}</button>`).join('')}</div></div>${SAMPLES.map(([, l]) => `<pre class="panel" data-panel><code>${l.join('')}</code></pre>`).join('')}</div>`
  };

  const SECTIONS = [
    ['core', 'Core', 'Core capabilities', 'What I do every day, and the tools behind it.', () => `<div class="core rv"><ul class="core-list">${CORE.map(([t, d, p]) => `<li><i><svg viewBox="0 0 24 24" aria-hidden="true"><path d="${p}"/></svg></i><h3>${t}</h3><p class="muted">${d}</p></li>`).join('')}</ul><div class="glass pad core-tools"><h3>Tools and technologies</h3>${chips(TOOLS)}</div></div>`],
    ['services', 'Services', 'What I build for you', 'Four service lines, one developer who owns the result.', () => `<div class="svcs">${SERVICES.map(([t, d, l, c, p], i) => `<article class="glass svc rv" data-tilt style="transition-delay:${(i % 2) * 90}ms"><svg class="svc-ic" viewBox="0 0 64 64" aria-hidden="true"><path d="${p}"/></svg><h3>${t}</h3><p class="muted">${d}</p>${ticks(l)}${chips(c)}</article>`).join('')}</div>`],
    ['stack', 'Stack', 'The full toolbox', 'Filter by area. Every tile is something I build with.', () => `<div class="stack"><div class="glass donut-card rv"><div id="donut"></div><p class="muted" id="donut-note">Share of the 33 tools, by area.</p></div><div><div class="filter rv" role="group" aria-label="Filter technologies"><button class="pill on" data-f="All" aria-pressed="true"><i></i>All</button>${GROUPS.map(([g, c]) => `<button class="pill" data-f="${g}" aria-pressed="false" style="--c:${c}"><i></i>${g}</button>`).join('')}</div><ul class="tech rv">${TECH.map(([n, s, g, ic], i) => `<li data-g="${g}" style="--i:${i % 12}"><span class="ic"><img src="assets/icons/${ic}.svg" alt="" loading="lazy" onerror="this.replaceWith(document.createTextNode('${n.slice(0, 2)}'))"></span><b>${n}</b><small>${s}</small></li>`).join('')}</ul></div></div>`],
    ['architecture', 'Architecture', 'How the layers fit together', 'Pick a layer, or watch it cycle.', tabsHtml.arch],
    ['proof', 'Proof', 'Practice and results', 'Numbers I can back up.', () => `<div class="proof"><article class="glass rv"><div class="lc"><div id="lc"></div><div><h3>250 problems on LeetCode</h3><p class="muted">Completed 250 questions, building the data structures and algorithms habit behind clean, efficient code.</p></div></div></article><article class="glass rv"><h3>Tradewell chart loads</h3><p class="muted">Redis caching of market data cut chart load time from 8 s to under 2 s.</p><div class="bars"><div><div class="bar-l"><span>Before caching</span><b>8 s</b></div><div class="bar-t"><i class="a" data-w="100"></i></div></div><div><div class="bar-l"><span>With Redis caching</span><b>under 2 s</b></div><div class="bar-t"><i class="b" data-w="25"></i></div></div></div></article></div>`],
    ['certificates', 'Certificates', 'Certificates', 'Completed in October 2026. Open any one to read it.', () => `<div class="certs">${CERTS.map(([t, iss, date, lab, id, f, c1, c2], i) => `<article class="glass cert rv" style="--c1:${c1};--c2:${c2};transition-delay:${i * 90}ms"><div class="cert-top"><span>${iss}</span></div><div class="cert-body"><h3>${t}</h3><dl><dt>Issued</dt><dd>${date}</dd><dt>${lab}</dt><dd><code>${id}</code><button class="cp" data-copy="${id}">Copy</button></dd></dl><button class="btn ghost sm" data-cert="${f}" data-title="${t}">View certificate</button></div></article>`).join('')}</div>`],
    ['delivery', 'Delivery', 'What you get at every step', 'Five phases, each with something concrete handed over.', () => `<div class="mstrip rv"><span>Design</span><i>✦</i><span>Build</span><i>✦</i><span>Ship</span></div>${tabsHtml.flow()}<ul class="checks glass pad rv" style="margin-top:18px">${QUALITY.map((q, i) => `<li style="--i:${i}">${TICK}${q}</li>`).join('')}</ul>`],
    ['api', 'API', 'What the API looks like', 'Sample requests and responses. Replace the host with your own.', () => `<div class="glass pad rv"><div class="api-wrap"><table class="api"><tbody>${API.map(([m, p, d]) => `<tr><td><span class="m ${m}">${m}</span></td><td><code>${p}</code></td><td class="muted">${d}</td></tr>`).join('')}</tbody></table></div><div class="row"><button class="btn ghost sm" id="ping">Try GET /api/health</button><code class="resp" id="ping-out" role="status"></code></div></div>${tabsHtml.code()}`],
    ['faq', 'FAQ', 'Questions clients ask', 'Short, honest answers.', () => `<div class="faq rv">${FAQ.map(([q, a]) => `<details><summary>${q}</summary><div class="a">${a}</div></details>`).join('')}</div>`]
  ];

  $('.index').innerHTML = SECTIONS.map(([id, l], i) => `<a href="#${id}"${i ? '' : ' class="on"'}>${l}</a>`).join('');
  $('#sections').innerHTML = SECTIONS.map(([id, , t, p, f]) => `<section class="sec" id="${id}">${head(t, p)}${f()}</section>`).join('');
  $('#stats').innerHTML = [[4, 'service lines'], [33, 'technologies across the stack'], [250, 'LeetCode problems solved'], [3, 'certificates earned']].map(([n, l]) => `<div><b data-count="${n}">0</b><span>${l}</span></div>`).join('');
  $('#yr').textContent = new Date().getFullYear();

  /* ---------------- nav, progress, smooth scroll ---------------- */
  const burger = $('.burger'), links = $('.links');
  burger.addEventListener('click', () => burger.setAttribute('aria-expanded', links.classList.toggle('open')));
  links.addEventListener('click', () => { links.classList.remove('open'); burger.setAttribute('aria-expanded', 'false'); });
  const bar = Object.assign(document.createElement('i'), { className: 'sprog' });
  document.body.append(bar);
  const prog = () => { const h = document.documentElement.scrollHeight - innerHeight; bar.style.setProperty('--p', h > 0 ? (scrollY / h).toFixed(4) : 0); };
  addEventListener('scroll', prog, { passive: true }); prog();
  if (!rm) {
    const s = document.createElement('script');
    s.src = 'https://cdn.jsdelivr.net/npm/lenis@1.1.14/dist/lenis.min.js';
    s.onload = () => { if (!window.Lenis) return; const l = new Lenis({ lerp: 0.085, smoothWheel: true }); const raf = (t) => { l.raf(t); requestAnimationFrame(raf); }; requestAnimationFrame(raf); };
    document.head.append(s);
  }

  /* ---------------- reveal + counters + bars ---------------- */
  const ease = (t) => 1 - Math.pow(1 - t, 3);
  const run = (ms, fn) => { if (rm) return fn(1); const t0 = performance.now(); const f = (t) => { const p = Math.min(1, (t - t0) / ms); fn(ease(p)); if (p < 1) requestAnimationFrame(f); }; requestAnimationFrame(f); };
  const io = new IntersectionObserver((es) => es.forEach((e) => {
    if (!e.isIntersecting) return;
    e.target.classList.add('in'); io.unobserve(e.target);
    $$('[data-w]', e.target).forEach((b) => (b.style.width = b.dataset.w + '%'));
    $$('.ticks,.checks', e.target).forEach((u) => u.classList.add('in'));
  }), { threshold: 0.15 });
  $$('.rv,.sec').forEach((el) => io.observe(el));
  const cio = new IntersectionObserver((es) => es.forEach((e) => {
    if (!e.isIntersecting) return; cio.unobserve(e.target);
    const n = +e.target.dataset.count; run(1400, (p) => (e.target.textContent = Math.round(n * p)));
  }), { threshold: 0.6 });
  $$('[data-count]').forEach((el) => cio.observe(el));

  /* ---------------- scroll spy ---------------- */
  const idx = $$('.index a');
  const spy = new IntersectionObserver((es) => es.forEach((e) => {
    if (e.isIntersecting) idx.forEach((a) => a.classList.toggle('on', a.getAttribute('href') === '#' + e.target.id));
  }), { rootMargin: '-35% 0px -60% 0px' });
  $$('.sec').forEach((s) => spy.observe(s));

  /* ---------------- hero radar chart ---------------- */
  (() => {
    const N = GROUPS.length, C = 230, R = 150, MAX = 6, ang = (i) => -Math.PI / 2 + (i * 2 * Math.PI) / N;
    const pt = (i, v, r = R) => [C + Math.cos(ang(i)) * r * (v / MAX), C + Math.sin(ang(i)) * r * (v / MAX)];
    const rings = [2, 4, 6].map((v) => `<polygon class="rd-ring" points="${GROUPS.map((_, i) => pt(i, v).join(',')).join(' ')}"/>`).join('');
    const axes = GROUPS.map((_, i) => `<line class="rd-axis" x1="${C}" y1="${C}" x2="${pt(i, MAX)[0]}" y2="${pt(i, MAX)[1]}"/>`).join('');
    const labs = GROUPS.map(([g], i) => { const [x, y] = pt(i, MAX * 1.22); const a = Math.cos(ang(i)); return `<text class="rd-lab" data-i="${i}" x="${x}" y="${y + 4}" text-anchor="${a > 0.3 ? 'start' : a < -0.3 ? 'end' : 'middle'}">${g}</text>`; }).join('');
    $('#radar').innerHTML = `<svg viewBox="-40 -10 540 470" role="img" aria-label="Radar chart showing the number of tools in each area">${rings}${axes}<polygon class="rd-area" id="rd-a"/>${GROUPS.map((_, i) => `<circle class="rd-pt" data-i="${i}" r="5" tabindex="0"/>`).join('')}${labs}<g class="rd-c"><text class="rd-big" id="rd-n" x="${C}" y="${C + 14}">33</text><text class="rd-sm" id="rd-t" x="${C}" y="${C + 36}">tools in total</text></g></svg>`;
    const area = $('#rd-a'), pts = $$('.rd-pt', $('#radar')), lab = $$('.rd-lab', $('#radar'));
    const draw = (p) => { area.setAttribute('points', GROUPS.map((g, i) => pt(i, count(g[0]) * p).join(',')).join(' ')); pts.forEach((c, i) => { const [x, y] = pt(i, count(GROUPS[i][0]) * p); c.setAttribute('cx', x); c.setAttribute('cy', y); }); };
    draw(0); setTimeout(() => run(1600, draw), 500);
    const focus = (i) => { const n = $('#rd-n'), t = $('#rd-t'); pts.forEach((c, k) => c.classList.toggle('on', k === i)); lab.forEach((c, k) => c.classList.toggle('on', k === i)); n.textContent = i < 0 ? TECH.length : count(GROUPS[i][0]); t.textContent = i < 0 ? 'tools in total' : GROUPS[i][0]; };
    [...pts, ...lab].forEach((el) => { const i = +el.dataset.i; el.addEventListener('pointerenter', () => focus(i)); el.addEventListener('pointerleave', () => focus(-1)); el.addEventListener('focus', () => focus(i)); el.addEventListener('blur', () => focus(-1)); });
  })();

  /* ---------------- donut + filter ---------------- */
  (() => {
    const r = 70, cf = 2 * Math.PI * r; let off = 0;
    const segs = GROUPS.map(([g, c]) => { const len = (count(g) / TECH.length) * cf; const s = `<circle class="dn-seg" data-g="${g}" r="${r}" cx="100" cy="100" stroke="${c}" stroke-dasharray="${Math.max(0, len - 3)} ${cf}" stroke-dashoffset="${-off}" transform="rotate(-90 100 100)"><title>${g}: ${count(g)}</title></circle>`; off += len; return s; }).join('');
    $('#donut').innerHTML = `<svg viewBox="0 0 200 200" role="img" aria-label="Donut chart of tools by area">${segs}<text class="dn-n" id="dn-n" x="100" y="108">${TECH.length}</text><text class="dn-t" id="dn-t" x="100" y="128">tools</text></svg>`;
    const sg = $$('.dn-seg'), items = $$('.tech li'), pills = $$('[data-f]');
    const pick = (f) => {
      pills.forEach((b) => { const on = b.dataset.f === f; b.classList.toggle('on', on); b.setAttribute('aria-pressed', on); });
      sg.forEach((s) => { s.classList.toggle('sel', s.dataset.g === f); s.classList.toggle('dim', f !== 'All' && s.dataset.g !== f); });
      $('#dn-n').textContent = f === 'All' ? TECH.length : count(f); $('#dn-t').textContent = f === 'All' ? 'tools' : f;
      items.forEach((li) => { const on = f === 'All' || li.dataset.g === f; li.hidden = !on; if (on) { li.style.animation = 'none'; void li.offsetWidth; li.style.animation = ''; } });
    };
    pills.forEach((b) => b.addEventListener('click', () => pick(b.dataset.f)));
    sg.forEach((s) => s.addEventListener('click', () => pick(s.dataset.g)));
  })();

  /* ---------------- leetcode ring (10 blocks of 25) ---------------- */
  (() => {
    const r = 80, segs = 10, gap = 0.012; let out = '';
    for (let i = 0; i < segs; i++) {
      const a0 = (i / segs) * 360 - 90 + 2, a1 = ((i + 1) / segs) * 360 - 90 - 2, p = (a) => [100 + r * Math.cos((a * Math.PI) / 180), 100 + r * Math.sin((a * Math.PI) / 180)];
      const [x0, y0] = p(a0), [x1, y1] = p(a1);
      out += `<path class="lc-bg" d="M${x0} ${y0}A${r} ${r} 0 0 1 ${x1} ${y1}"/><path class="lc-seg" pathLength="1" style="--i:${i}" d="M${x0} ${y0}A${r} ${r} 0 0 1 ${x1} ${y1}"/>`;
    }
    $('#lc').innerHTML = `<svg viewBox="0 0 200 200" role="img" aria-label="250 LeetCode problems solved, shown as ten blocks of 25"><defs><linearGradient id="lcg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#f8edd2"/><stop offset=".6" stop-color="#dcbb6a"/><stop offset="1" stop-color="#d4527a"/></linearGradient></defs>${out}<text class="lc-n" x="100" y="112">250</text><text class="lc-t" x="100" y="134">solved</text></svg>`;
  })();

  /* ---------------- tabs (architecture, delivery, api samples) ---------------- */
  $$('[data-tabs]').forEach((root) => {
    const ts = $$('[data-tab]', root), ps = $$('[data-panel]', root);
    let cur = 0, timer = null, stopped = false;
    const show = (n) => { cur = n; ts.forEach((t, k) => { t.classList.toggle('on', k === n); t.setAttribute('aria-selected', k === n); }); ps.forEach((p, k) => p.classList.toggle('on', k === n)); root.style.setProperty('--step', n); };
    const stop = () => { clearInterval(timer); timer = null; };
    const start = () => { if (stopped || rm || !root.dataset.auto || timer) return; timer = setInterval(() => show((cur + 1) % ts.length), +root.dataset.auto); };
    ts.forEach((t, k) => {
      t.addEventListener('click', () => { stopped = true; stop(); show(k); });
      t.addEventListener('keydown', (e) => { const d = { ArrowRight: 1, ArrowDown: 1, ArrowLeft: -1, ArrowUp: -1 }[e.key]; if (!d) return; e.preventDefault(); stopped = true; stop(); const n = (k + d + ts.length) % ts.length; show(n); ts[n].focus(); });
    });
    new IntersectionObserver((es) => es.forEach((e) => (e.isIntersecting ? start() : stop())), { threshold: 0.3 }).observe(root);
    root.addEventListener('mouseenter', stop); root.addEventListener('mouseleave', start);
    show(0);
  });

  /* ---------------- service card tilt + spotlight ---------------- */
  if (!rm && matchMedia('(hover:hover)').matches) $$('[data-tilt]').forEach((c) => {
    c.addEventListener('pointermove', (e) => { const b = c.getBoundingClientRect(), x = (e.clientX - b.left) / b.width, y = (e.clientY - b.top) / b.height; c.style.setProperty('--mx', x * 100 + '%'); c.style.setProperty('--my', y * 100 + '%'); c.style.transform = `perspective(900px) rotateX(${((0.5 - y) * 5).toFixed(2)}deg) rotateY(${((x - 0.5) * 6).toFixed(2)}deg)`; });
    c.addEventListener('pointerleave', () => (c.style.transform = ''));
  });

  /* ---------------- certificates: copy + viewer ---------------- */
  const toast = Object.assign(document.createElement('div'), { className: 'toast' }); toast.setAttribute('role', 'status'); document.body.append(toast);
  let tt; const say = (m) => { toast.textContent = m; toast.classList.add('show'); clearTimeout(tt); tt = setTimeout(() => toast.classList.remove('show'), 1800); };
  $$('[data-copy]').forEach((b) => b.addEventListener('click', async () => {
    try { await navigator.clipboard.writeText(b.dataset.copy); } catch { const t = Object.assign(document.createElement('textarea'), { value: b.dataset.copy }); document.body.append(t); t.select(); document.execCommand('copy'); t.remove(); }
    say('Copied ' + b.dataset.copy);
  }));
  const dlg = $('#cert-dlg');
  $$('[data-cert]').forEach((b) => b.addEventListener('click', () => {
    $('#dlg-t').textContent = b.dataset.title; $('#dlg-a').href = b.dataset.cert; $('#dlg-f').src = b.dataset.cert;
    typeof dlg.showModal === 'function' ? dlg.showModal() : window.open(b.dataset.cert, '_blank');
  }));
  const close = () => { dlg.close(); $('#dlg-f').src = 'about:blank'; };
  $('#dlg-x').addEventListener('click', close);
  dlg.addEventListener('click', (e) => { if (e.target === dlg) close(); });
  dlg.addEventListener('cancel', () => ($('#dlg-f').src = 'about:blank'));

  /* ---------------- api health check ---------------- */
  $('#ping').addEventListener('click', async () => {
    const out = $('#ping-out'), b = $('#ping'); b.disabled = true; out.className = 'resp muted'; out.textContent = 'Checking...';
    try {
      const c = new AbortController(), t = setTimeout(() => c.abort(), 6000);
      const r = await fetch('/api/health', { signal: c.signal }); clearTimeout(t);
      const j = await r.json(); out.className = 'resp ok'; out.textContent = `${r.status} ${JSON.stringify(j)}`;
    } catch { out.className = 'resp err'; out.textContent = 'No API reachable from this host. Connect the backend to see a live response.'; }
    b.disabled = false;
  });
})();