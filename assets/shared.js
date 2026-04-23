/* Shared behavior across pages */

// --- Reveal on scroll
(function() {
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('in');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  document.addEventListener('DOMContentLoaded', () => {
    document.querySelectorAll('.reveal').forEach(el => io.observe(el));
  });
})();

// --- Cursor trail
(function() {
  if (matchMedia('(hover: none)').matches) return;
  const dot = document.createElement('div');
  dot.className = 'cursor-trail';
  document.addEventListener('DOMContentLoaded', () => document.body.appendChild(dot));
  let x = 0, y = 0, tx = 0, ty = 0;
  window.addEventListener('mousemove', (e) => {
    tx = e.clientX; ty = e.clientY;
  });
  function raf() {
    x += (tx - x) * 0.22;
    y += (ty - y) * 0.22;
    dot.style.transform = `translate(${x}px, ${y}px) translate(-50%, -50%)`;
    requestAnimationFrame(raf);
  }
  raf();
  document.addEventListener('mouseover', (e) => {
    if (e.target.closest('a, button, .card, .sw, .opt')) dot.classList.add('hover');
    else dot.classList.remove('hover');
  });
})();

// --- Active nav link
(function() {
  document.addEventListener('DOMContentLoaded', () => {
    const path = location.pathname.split('/').pop() || 'index.html';
    document.querySelectorAll('.nav a').forEach(a => {
      const href = a.getAttribute('href');
      if (!href) return;
      if (href === path || (path === '' && href === 'index.html')) {
        a.classList.add('active');
      }
    });
  });
})();

// --- Tweaks
(function() {
  const DEFAULTS = /*EDITMODE-BEGIN*/{
    "accentHue": 258,
    "fontPair": "mono-plex",
    "heroStyle": "identity"
  }/*EDITMODE-END*/;

  const state = Object.assign({}, DEFAULTS, readLocal());

  const FONT_PAIRS = {
    'mono-plex': { display: "'JetBrains Mono', monospace", body: "'IBM Plex Sans', system-ui, sans-serif", mono: "'JetBrains Mono', monospace" },
    'mono-only': { display: "'JetBrains Mono', monospace", body: "'JetBrains Mono', monospace", mono: "'JetBrains Mono', monospace" },
    'grotesk': { display: "'Space Grotesk', sans-serif", body: "'Inter', system-ui, sans-serif", mono: "'JetBrains Mono', monospace" },
    'inter': { display: "'Inter', sans-serif", body: "'Inter', system-ui, sans-serif", mono: "'JetBrains Mono', monospace" }
  };

  const ACCENTS = [
    { name: 'cool blue', hue: 258 },
    { name: 'green', hue: 155 },
    { name: 'amber', hue: 70 },
    { name: 'red', hue: 25 },
    { name: 'violet', hue: 300 }
  ];

  function readLocal() {
    try { return JSON.parse(localStorage.getItem('tweaks') || '{}'); } catch { return {}; }
  }
  function writeLocal() {
    localStorage.setItem('tweaks', JSON.stringify(state));
  }

  function apply() {
    const root = document.documentElement.style;
    root.setProperty('--accent', `oklch(0.72 0.15 ${state.accentHue})`);
    root.setProperty('--accent-2', `oklch(0.58 0.15 ${state.accentHue})`);
    root.setProperty('--accent-soft', `oklch(0.72 0.15 ${state.accentHue} / 0.12)`);
    root.setProperty('--accent-line', `oklch(0.72 0.15 ${state.accentHue} / 0.35)`);

    const fp = FONT_PAIRS[state.fontPair] || FONT_PAIRS['mono-plex'];
    root.setProperty('--font-display', fp.display);
    root.setProperty('--font-body', fp.body);
    root.setProperty('--font-mono', fp.mono);

    document.documentElement.dataset.hero = state.heroStyle;
  }

  function buildPanel() {
    const panel = document.createElement('div');
    panel.id = 'tweaks';
    panel.innerHTML = `
      <h4>Tweaks <span class="close" data-close>×</span></h4>

      <label>Accent</label>
      <div class="swatches" data-swatches></div>

      <label>Typography</label>
      <div class="opts" data-fonts>
        <button class="opt" data-font="mono-plex">Mono + Plex Sans</button>
        <button class="opt" data-font="mono-only">All mono</button>
        <button class="opt" data-font="grotesk">Space Grotesk + Inter</button>
        <button class="opt" data-font="inter">Inter only</button>
      </div>

      <label>Home hero</label>
      <div class="opts" data-hero>
        <button class="opt" data-hero-val="identity">Identity first</button>
        <button class="opt" data-hero-val="terminal">Terminal-inspired</button>
        <button class="opt" data-hero-val="editorial">Editorial typography</button>
      </div>
    `;
    document.body.appendChild(panel);

    // Swatches
    const sw = panel.querySelector('[data-swatches]');
    ACCENTS.forEach(a => {
      const el = document.createElement('div');
      el.className = 'sw' + (a.hue === state.accentHue ? ' active' : '');
      el.style.background = `oklch(0.72 0.15 ${a.hue})`;
      el.title = a.name;
      el.onclick = () => {
        state.accentHue = a.hue;
        panel.querySelectorAll('.sw').forEach(s => s.classList.remove('active'));
        el.classList.add('active');
        apply(); writeLocal(); persist();
      };
      sw.appendChild(el);
    });

    // Fonts
    panel.querySelectorAll('[data-font]').forEach(b => {
      if (b.dataset.font === state.fontPair) b.classList.add('active');
      b.onclick = () => {
        state.fontPair = b.dataset.font;
        panel.querySelectorAll('[data-font]').forEach(x => x.classList.remove('active'));
        b.classList.add('active');
        apply(); writeLocal(); persist();
      };
    });

    // Hero
    panel.querySelectorAll('[data-hero-val]').forEach(b => {
      if (b.dataset.heroVal === state.heroStyle) b.classList.add('active');
      b.onclick = () => {
        state.heroStyle = b.dataset.heroVal;
        panel.querySelectorAll('[data-hero-val]').forEach(x => x.classList.remove('active'));
        b.classList.add('active');
        apply(); writeLocal(); persist();
      };
    });

    panel.querySelector('[data-close]').onclick = () => panel.classList.remove('open');

    return panel;
  }

  function persist() {
    try {
      window.parent.postMessage({ type: '__edit_mode_set_keys', edits: {
        accentHue: state.accentHue,
        fontPair: state.fontPair,
        heroStyle: state.heroStyle
      }}, '*');
    } catch {}
  }

  apply();

  window.addEventListener('message', (e) => {
    if (!e.data || typeof e.data !== 'object') return;
    if (e.data.type === '__activate_edit_mode') {
      let panel = document.getElementById('tweaks');
      if (!panel) panel = buildPanel();
      panel.classList.add('open');
    }
    if (e.data.type === '__deactivate_edit_mode') {
      const panel = document.getElementById('tweaks');
      if (panel) panel.classList.remove('open');
    }
  });
  try { window.parent.postMessage({ type: '__edit_mode_available' }, '*'); } catch {}
})();
