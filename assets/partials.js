/* Header + footer injection so every page stays consistent */

(function() {
  const NAV = [
    ['index.html', 'Home'],
    ['about.html', 'About'],
    ['games.html', 'Games'],
    ['projects.html', 'Projects'],
    ['alternance.html', 'Alternance'],
    ['contact.html', 'Contact']
  ];

  function topbar() {
    return `
      <header class="topbar">
        <div class="topbar-inner">
          <a class="brand" href="index.html">
            <span class="dot"></span>
            <span>alexis.martinho</span>
            <span class="tag">/ gameplay programmer</span>
          </a>
          <nav class="nav">
            ${NAV.map(([h, l]) => `<a href="${h}">${l}</a>`).join('')}
          </nav>
        </div>
      </header>
    `;
  }

  function footer() {
    return `
      <footer class="foot">
        <div class="shell">
          <div class="row">
            <div>
              <div class="eyebrow" style="margin-bottom:12px"><span class="idx">/</span> END OF LINE</div>
              <div class="sign">Let's build<br>something good.</div>
              <div class="mono dim" style="margin-top:16px; font-size:13px;">alexis.martinho.78@gmail.com</div>
            </div>
            <div class="links">
              <a href="contact.html">→ Contact</a>
              <a href="https://www.linkedin.com/in/alexis-martinho-76265125b/" target="_blank" rel="noopener">→ LinkedIn</a>
              <a href="https://github.com/Al3xics" target="_blank" rel="noopener">→ GitHub</a>
              <a href="https://al3xics.itch.io/" target="_blank" rel="noopener">→ itch.io</a>
              <a href="mailto:alexis.martinho.78@gmail.com">→ Email</a>
            </div>
          </div>
          <div class="legal">
            <span>© 2026 Alexis Martinho — Portfolio v1.0</span>
            <span>Designed &amp; built from scratch · No templates</span>
          </div>
        </div>
      </footer>
    `;
  }

  window.mountChrome = function() {
    const header = document.querySelector('[data-chrome="header"]');
    const foot = document.querySelector('[data-chrome="footer"]');
    if (header) header.outerHTML = topbar();
    if (foot) foot.outerHTML = footer();
  };

  document.addEventListener('DOMContentLoaded', () => window.mountChrome());
})();
