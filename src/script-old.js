/* ================================================================
   BANGLAR TRANSIT - script.js  (Fully Functional Version)
   ================================================================ */

/* ── Helpers ─────────────────────────────────────────────── */
const $ = (sel, ctx = document) => ctx.querySelector(sel);
const $$ = (sel, ctx = document) => [...ctx.querySelectorAll(sel)];

/* ================================================================
   1. NAVBAR – scroll shadow + hamburger menu
   ================================================================ */
const navbar   = $('#navbar');
const hamburger = $('#hamburger');
const navLinks  = $('#nav-links');

// Scroll shadow
window.addEventListener('scroll', () => {
  navbar.classList.toggle('scrolled', window.scrollY > 40);
}, { passive: true });

// Hamburger toggle
if (hamburger && navLinks) {
  hamburger.addEventListener('click', () => {
    const open = navLinks.classList.toggle('open');
    hamburger.setAttribute('aria-expanded', open);
    const [s1, s2, s3] = $$('span', hamburger);
    if (open) {
      s1.style.cssText = 'transform:rotate(45deg) translate(5px,5px)';
      s2.style.cssText = 'opacity:0; transform:scaleX(0)';
      s3.style.cssText = 'transform:rotate(-45deg) translate(5px,-5px)';
    } else {
      [s1, s2, s3].forEach(s => s.style.cssText = '');
    }
  });

  // Close on nav-link click
  $$('.nav-link', navLinks).forEach(a =>
    a.addEventListener('click', () => {
      navLinks.classList.remove('open');
      hamburger.setAttribute('aria-expanded', false);
      $$('span', hamburger).forEach(s => s.style.cssText = '');
    })
  );

  // Close on outside click
  document.addEventListener('click', e => {
    if (!navbar.contains(e.target)) {
      navLinks.classList.remove('open');
      hamburger.setAttribute('aria-expanded', false);
      $$('span', hamburger).forEach(s => s.style.cssText = '');
    }
  });
}

/* ================================================================
   2. SCROLL REVEAL – fade-in + slide-up on scroll
   ================================================================ */
function initScrollReveal() {
  const targets = $$('.content-block, .feature-card, .stat-card, .search-teaser-content, .tram-info-box, .route-card, .bus-chip');
  
  targets.forEach((el, i) => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(36px)';
    el.style.transition = `opacity 0.65s ease ${i % 4 * 0.1}s, transform 0.65s ease ${i % 4 * 0.1}s`;
  });

  const io = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.style.opacity = '1';
        entry.target.style.transform = 'translateY(0)';
        io.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  targets.forEach(el => io.observe(el));
}

/* ================================================================
   3. STATS COUNTER – animated number count-up
   ================================================================ */
function animateCounter(el, target, suffix = '', duration = 1600) {
  const start = performance.now();
  const update = (now) => {
    const elapsed = now - start;
    const progress = Math.min(elapsed / duration, 1);
    // Ease-out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = Math.floor(eased * target);
    el.textContent = current + suffix;
    if (progress < 1) requestAnimationFrame(update);
  };
  requestAnimationFrame(update);
}

function initStatsCounter() {
  const statEls = $$('.stat-number');
  if (!statEls.length) return;

  // Map each stat to its target value + suffix
  const statData = [
    { target: 700, suffix: '+' },
    { target: 400, suffix: '+' },
    { target: 3,   suffix: '' },
    { target: 1,   suffix: '' },
  ];

  let triggered = false;
  const io = new IntersectionObserver(entries => {
    if (triggered) return;
    if (entries.some(e => e.isIntersecting)) {
      triggered = true;
      statEls.forEach((el, i) => {
        const d = statData[i] || { target: parseInt(el.textContent), suffix: '' };
        animateCounter(el, d.target, d.suffix);
      });
      io.disconnect();
    }
  }, { threshold: 0.4 });

  statEls.forEach(el => io.observe(el));
}

/* ================================================================
   4. HOMEPAGE SEARCH BOX
   ================================================================ */
function initHomepageSearch() {
  const input = $('.search-box input');
  const btn   = $('.search-box button');
  if (!input || !btn) return;

  const go = () => {
    const q = input.value.trim();
    if (q) {
      window.location.href = `routes.html?q=${encodeURIComponent(q)}`;
    } else {
      // Shake animation
      input.classList.add('input-shake');
      input.placeholder = 'Please enter a route or destination!';
      setTimeout(() => {
        input.classList.remove('input-shake');
        input.placeholder = 'Enter route number or destination...';
      }, 700);
    }
  };

  btn.addEventListener('click', go);
  input.addEventListener('keydown', e => e.key === 'Enter' && go());
}

/* ================================================================
   5. ROUTES PAGE – live searchable list (API Version)
   ================================================================ */

function buildRouteCard(r) {
  const typeColors = { city: '#BE123C', suburban: '#0369a1', ac: '#065f46', district: '#92400e' };
  const typeLabels = { city: 'City', suburban: 'Suburban', ac: 'AC', district: 'District' };
  const color = typeColors[r.type] || '#BE123C';
  const label = typeLabels[r.type] || '';

  const div = document.createElement('a');
  div.href = `route-details.html?route_num=${encodeURIComponent(r.num)}`;
  div.className = 'route-card';
  div.style.textDecoration = 'none';
  div.style.color = 'inherit';
  div.style.display = 'flex';
  div.innerHTML = `
    <div class="route-num" style="background:${color}">${r.num}</div>
    <div class="route-info">
      <strong>${r.from} ↔ ${r.to}</strong>
      <span>${r.via}</span>
    </div>
    <div style="display:flex;align-items:center;gap:0.5rem">
      <span class="route-type-badge" style="background:${color}20;color:${color};border:1px solid ${color}40;
        font-size:0.72rem;padding:2px 8px;border-radius:20px;font-weight:600;white-space:nowrap">${label}</span>
      <div class="route-arrow" style="color:${color}">›</div>
    </div>`;
  return div;
}

function initRoutesPage() {
  const routeList = $('#route-list');
  const input     = $('#route-input');
  const btn       = $('#route-search-btn');
  const counter   = $('#result-count');

  if (!routeList || !input) return;

  function render(list) {
    routeList.innerHTML = '';
    if (counter) counter.textContent = `${list.length} route${list.length !== 1 ? 's' : ''} found`;

    if (!list.length) {
      routeList.innerHTML = `
        <div class="no-results">
          <div style="font-size:3rem;margin-bottom:1rem">🔍</div>
          <strong>No routes found</strong>
          <p>Try searching by route number (e.g. "30A"), origin, or destination (e.g. "Howrah").</p>
        </div>`;
      return;
    }

    list.forEach((r, i) => {
      const card = buildRouteCard(r);
      card.style.animationDelay = `${i * 0.04}s`;
      card.classList.add('card-animate');
      routeList.appendChild(card);
    });

    // Re-trigger scroll reveal for new cards
    setTimeout(initScrollReveal, 50);
  }

  let currentReqController = null;
  
  async function fetchRoutes(query, type) {
    if (currentReqController) {
      currentReqController.abort();
    }
    currentReqController = new AbortController();

    routeList.innerHTML = '<div class="no-results"><strong>Loading routes...</strong></div>';
    
    try {
      const u = new URLSearchParams();
      if (query) u.append('q', query);
      if (type && type !== 'all') u.append('type', type);
      
      const res = await fetch(`/api/routes?${u.toString()}`, { signal: currentReqController.signal });
      if(!res.ok) throw new Error('API Error');
      const data = await res.json();
      render(data);
    } catch(e) {
      if(e.name !== 'AbortError') {
        routeList.innerHTML = '<div class="no-results" style="color:red"><strong>Error loading routes.</strong></div>';
      }
    }
  }

  let activeType = 'all';

  function filter() {
    const q = input.value.trim().toLowerCase();
    fetchRoutes(q, activeType);
  }

  // Read URL query param
  const q = new URLSearchParams(location.search).get('q') || '';
  if (q) input.value = q;
  filter();

  btn.addEventListener('click', filter);
  
  // Debounce input to avoid blowing up the API while typing
  let debounceTimer;
  input.addEventListener('input', () => {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(filter, 300);
  });
  
  input.addEventListener('keydown', e => e.key === 'Enter' && filter());

  // Active filter chips
  $$('.filter-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      $$('.filter-chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      activeType = chip.dataset.type;
      input.value = '';
      filter();
    });
  });
}

/* ================================================================
   6. TRAM PAGE – animated tram cards (API Version)
   ================================================================ */

function initTramsPage() {
  const list = $('#tram-routes');
  if (!list) return;

  list.innerHTML = '<div class="no-results"><strong>Loading tram routes...</strong></div>';

  fetch('/api/trams')
    .then(res => res.json())
    .then(data => {
      list.innerHTML = '';
      data.forEach((t, i) => {
        const div = document.createElement('div');
        div.className = 'route-card tram-card';
        div.style.cssText = `opacity:0;transform:translateY(30px);transition:opacity 0.5s ease ${i*0.08}s,transform 0.5s ease ${i*0.08}s`;
        div.innerHTML = `
          <div class="route-num tram-num">${t.num}</div>
          <div class="route-info">
            <strong>${t.from} ↔ ${t.to}</strong>
            <span>${t.via}</span>
          </div>
          <div style="display:flex;flex-direction:column;align-items:flex-end;gap:3px">
            <span style="font-size:0.75rem;background:#dcfce7;color:#15803d;padding:2px 8px;border-radius:20px;font-weight:600">🕐 ${t.freq}</span>
            <div class="route-arrow" style="color:#15803d">›</div>
          </div>`;
        list.appendChild(div);
      });

      const io = new IntersectionObserver(entries => {
        entries.forEach(e => {
          if (e.isIntersecting) {
            e.target.style.opacity = '1';
            e.target.style.transform = 'translateY(0)';
            io.unobserve(e.target);
          }
        });
      }, { threshold: 0.1 });

      $$('.tram-card').forEach(c => io.observe(c));
    })
    .catch(err => {
      list.innerHTML = '<div class="no-results" style="color:red"><strong>Error loading tram routes.</strong></div>';
    });
}

/* ================================================================
   7. BUS EXPLORER PAGE – tabs + grid (API Version)
   ================================================================ */
const CAT_LABELS = {
  kolkata:  'Kolkata City Routes',
  suburban: 'Suburban Routes',
  ac:       'AC Bus Routes',
  district: 'District Routes',
};
const CAT_COLORS = { kolkata:'#BE123C', suburban:'#0369a1', ac:'#065f46', district:'#92400e' };

function initBusExplorer() {
  const content  = $('#explorer-content');
  const tabBar   = $('#tab-bar');
  if (!content || !tabBar) return;

  async function renderExplorer(cat) {
    content.innerHTML = '<div class="no-results"><strong>Loading explorer data...</strong></div>';
    try {
      let data = {};
      if (cat === 'all') {
        // Group by type from a single API call for 'all'
        const res = await fetch('/api/routes');
        const routes = await res.json();
        const grouped = { kolkata: [], suburban: [], ac: [], district: [] };
        routes.forEach(r => {
          if (r.type === 'city') grouped.kolkata.push(r);
          else if (grouped[r.type]) grouped[r.type].push(r);
        });
        data = grouped;
      } else {
        const typeArg = cat === 'kolkata' ? 'city' : cat;
        const res = await fetch(`/api/routes?type=${typeArg}`);
        data[cat] = await res.json();
      }

      content.innerHTML = '';
      Object.entries(data).forEach(([key, routes]) => {
        if (!routes || !routes.length) return;
        const color = CAT_COLORS[key] || '#BE123C';
        const section = document.createElement('section');
        section.innerHTML = `<h2 class="category-title" style="border-left:4px solid ${color};padding-left:0.8rem;color:${color}">${CAT_LABELS[key]}</h2>`;

        const grid = document.createElement('div');
        grid.className = 'bus-grid';

        routes.forEach((r, i) => {
          const chip = document.createElement('div');
          chip.className = 'bus-chip';
          chip.style.cssText = `opacity:0;transform:translateY(20px);transition:opacity 0.4s ease ${i*0.05}s,transform 0.4s ease ${i*0.05}s;border-top:3px solid ${color}`;
          chip.innerHTML = `
            <div class="chip-num" style="color:${color}">${r.num}</div>
            <div class="chip-route">${r.from} ↔ ${r.to}</div>`;
          chip.addEventListener('click', () => {
             window.location.href = `route-details.html?route_num=${encodeURIComponent(r.num)}`;
          });
          grid.appendChild(chip);
        });

        section.appendChild(grid);
        content.appendChild(section);
      });

      // Animate chips in
      requestAnimationFrame(() => {
        $$('.bus-chip').forEach(c => {
          c.style.opacity = '1';
          c.style.transform = 'translateY(0)';
        });
      });
    } catch(e) {
      content.innerHTML = '<div class="no-results" style="color:red"><strong>Error loading explorer.</strong></div>';
    }
  }

  // Tab click
  $$('.tab-btn', tabBar).forEach(btn => {
    btn.addEventListener('click', () => {
      $$('.tab-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      content.style.opacity = '0';
      content.style.transform = 'translateY(12px)';
      content.style.transition = 'opacity 0.2s, transform 0.2s';
      setTimeout(() => {
        renderExplorer(btn.dataset.cat);
        content.style.opacity = '1';
        content.style.transform = 'translateY(0)';
      }, 200);
    });
  });

  renderExplorer('all');
}

/* ================================================================
   8. ROUTE DETAILS PAGE
   ================================================================ */
function initRouteDetailsPage() {
  const alignList = $('#alignment-list');
  const routeNumEl = $('#detail-route-num');
  const routeNameEl = $('#detail-route-name');
  const routeBadgesEl = $('#detail-route-badges');
  
  if (!alignList) return;

  const urlParams = new URLSearchParams(window.location.search);
  const routeNum = urlParams.get('route_num');

  if (!routeNum) {
    alignList.innerHTML = '<div class="no-results" style="color:red"><strong>No route specified.</strong></div>';
    routeNameEl.textContent = 'Invalid Route';
    return;
  }

  fetch(`/api/routes/${encodeURIComponent(routeNum)}`)
    .then(res => {
      if (!res.ok) throw new Error('Route not found');
      return res.json();
    })
    .then(route => {
      // Update Hero Section
      routeNumEl.textContent = route.num;
      routeNameEl.textContent = `${route.from} ↔ ${route.to}`;
      
      const typeColors = { city: '#BE123C', suburban: '#0369a1', ac: '#065f46', district: '#92400e' };
      const color = typeColors[route.type] || '#333';
      
      routeBadgesEl.innerHTML = `
        <span class="filter-chip active" style="background:${color};border-color:${color};color:#fff;">${route.type.toUpperCase()}</span>
        <span class="filter-chip">Via ${route.via}</span>
      `;

      // Update Stops Timeline
      alignList.innerHTML = '';
      if (!route.stops || route.stops.length === 0) {
        alignList.innerHTML = '<div class="no-results"><strong>No stop information available.</strong></div>';
        return;
      }

      route.stops.forEach((stop, index) => {
        const itemClass = index === 0 ? 'start' : 'regular';
        const div = document.createElement('div');
        div.className = `alignment-item ${itemClass}`;
        
        // simple animation delay for stagger
        div.style.cssText = `opacity:0; transform:translateX(-15px); transition:opacity 0.4s ease ${index*0.1}s, transform 0.4s ease ${index*0.1}s;`;
        
        div.innerHTML = `
          <div class="alignment-pin"></div>
          <div class="stop-name">${stop}</div>
        `;
        alignList.appendChild(div);
      });

      // trigger animation
      requestAnimationFrame(() => {
        const items = document.querySelectorAll('.alignment-item');
        items.forEach(c => {
          c.style.opacity = '1';
          c.style.transform = 'translateX(0)';
        });
      });
    })
    .catch(err => {
      alignList.innerHTML = '<div class="no-results" style="color:red"><strong>Error loading route details.</strong></div>';
      routeNameEl.textContent = 'Not Found';
    });
}


/* ================================================================
   9. INIT – detect page and boot
   ================================================================ */
document.addEventListener('DOMContentLoaded', () => {
  initScrollReveal();
  initStatsCounter();
  initHomepageSearch();

  // Page-specific
  if ($('#route-list'))      initRoutesPage();
  if ($('#tram-routes'))     initTramsPage();
  if ($('#explorer-content')) initBusExplorer();
  if ($('#alignment-list'))  initRouteDetailsPage();
});
