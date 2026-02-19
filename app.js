/* ══════════════════════════════════════════════════════════
   asone — SPA logic v4
   4 pages: home, collection, about, contact
   Features: routing, traveling shirt, product modal, EmailJS,
             particles, flip card, stat counters, smooth fade-in
   ══════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  const $ = (s, p = document) => p.querySelector(s);
  const $$ = (s, p = document) => [...p.querySelectorAll(s)];
  const lerp = (a, b, t) => a + (b - a) * t;

  /* ── product data (enhanced with discount/stock info) ── */
  const products = {
    'classic-tee': {
      name: 'classic tee', code: 'AS-CT-001', color: 'jet black', size: 'S / M / L / XL',
      originalPrice: 1499, discountPrice: 999, discountPercent: 33, stocksLeft: 24,
      image: 'shirt1.jpeg',
      desc: 'the everyday essential. a clean crew-neck tee cut from 100% organic cotton with a relaxed, comfortable fit.',
      fabric: '100% organic cotton', fit: 'regular', weight: '180 gsm', care: 'machine wash cold',
      fill: '#111', stroke: '#333', type: 'tee', cat: 'tee'
    },
    'cloud-oversized': {
      name: 'cloud oversized', code: 'AS-CO-002', color: 'cloud white', size: 'M / L / XL / XXL',
      originalPrice: 1799, discountPrice: 1299, discountPercent: 28, stocksLeft: 12,
      image: 'shirt2.jpeg',
      desc: 'loose, easy, and intentionally oversized. dropped shoulders and a wider body. premium brushed cotton.',
      fabric: 'brushed cotton blend', fit: 'oversized', weight: '200 gsm', care: 'machine wash cold',
      fill: '#fafafa', stroke: '#ccc', type: 'oversized', cat: 'oversized'
    },
    'striped-tee': {
      name: 'striped tee', code: 'AS-ST-003', color: 'mono stripe', size: 'S / M / L / XL',
      originalPrice: 1599, discountPrice: 1199, discountPercent: 25, stocksLeft: 18,
      image: 'shirt3.jpeg',
      desc: 'bold monochrome stripes on a classic silhouette. yarn-dyed stripes that never fade.',
      fabric: 'yarn-dyed cotton', fit: 'regular', weight: '190 gsm', care: 'machine wash cold',
      fill: 'striped', stroke: '#999', type: 'striped', cat: 'striped'
    },
    'henley': {
      name: 'henley', code: 'AS-HN-004', color: 'charcoal grey', size: 'S / M / L / XL',
      originalPrice: 1999, discountPrice: 1499, discountPercent: 25, stocksLeft: 8,
      image: 'shirt4.jpeg',
      desc: 'henley neckline with a three-button placket, ribbed collar, and tapered fit.',
      fabric: '100% organic cotton', fit: 'slim', weight: '195 gsm', care: 'machine wash cold',
      fill: '#444', stroke: '#666', type: 'henley', cat: 'henley'
    },
    'shadow-tee': {
      name: 'shadow tee', code: 'AS-SH-005', color: 'deep shadow', size: 'S / M / L / XL',
      originalPrice: 1499, discountPrice: 1099, discountPercent: 27, stocksLeft: 15,
      image: 'shirt1.jpeg',
      desc: 'deeper than black. garment-dyed for a rich, textured finish with lived-in softness.',
      fabric: 'garment-dyed cotton', fit: 'regular', weight: '185 gsm', care: 'hand wash',
      fill: '#1a1a1a', stroke: '#333', type: 'tee', cat: 'tee'
    },
    'bone-oversized': {
      name: 'bone oversized', code: 'AS-BO-006', color: 'warm bone', size: 'M / L / XL / XXL',
      originalPrice: 1899, discountPrice: 1399, discountPercent: 26, stocksLeft: 5,
      image: 'shirt3.jpeg',
      desc: 'warm off-white meets oversized comfort. Gets better with every wash. a wardrobe anchor.',
      fabric: 'brushed cotton blend', fit: 'oversized', weight: '200 gsm', care: 'machine wash cold',
      fill: '#ddd', stroke: '#bbb', type: 'oversized', cat: 'oversized'
    },
    'ivory-tee': {
      name: 'ivory tee', code: 'AS-IV-007', color: 'pure ivory', size: 'S / M / L / XL',
      originalPrice: 1399, discountPrice: 999, discountPercent: 29, stocksLeft: 30,
      image: 'shirt2.jpeg',
      desc: 'pure and clean. pre-shrunk, double-stitched hem, and built to last.',
      fabric: '100% organic cotton', fit: 'regular', weight: '180 gsm', care: 'machine wash cold',
      fill: '#f5f5f5', stroke: '#ddd', type: 'tee', cat: 'tee'
    },
    'dark-henley': {
      name: 'dark henley', code: 'AS-DH-008', color: 'dark charcoal', size: 'S / M / L / XL',
      originalPrice: 1999, discountPrice: 1499, discountPercent: 25, stocksLeft: 3,
      image: 'shirt4.jpeg',
      desc: 'classic henley in deep charcoal. subtle button placket, modern slim fit.',
      fabric: '100% organic cotton', fit: 'slim', weight: '195 gsm', care: 'machine wash cold',
      fill: '#222', stroke: '#444', type: 'henley', cat: 'henley'
    }
  };


  /* ── shirt SVG builder ───────────────────────────────── */
  function shirtSVG(p, size) {
    const w = size || '55%';
    if (p.type === 'oversized') {
      return `<svg viewBox="0 0 200 260" style="width:${w}"><path d="M55 40 L20 75 L45 85 L45 225 L155 225 L155 85 L180 75 L145 40 L122 58 C112 68 88 68 78 58 L55 40Z" fill="${p.fill}" stroke="${p.stroke}" stroke-width="1.5"/><path d="M78 58 C88 68 112 68 122 58" stroke="${p.stroke}" stroke-width="1.5" fill="none"/></svg>`;
    }
    if (p.type === 'henley') {
      return `<svg viewBox="0 0 200 260" style="width:${w}"><path d="M60 40 L30 70 L50 80 L50 220 L150 220 L150 80 L170 70 L140 40 L120 55 C110 65 90 65 80 55 L60 40Z" fill="${p.fill}" stroke="${p.stroke}" stroke-width="1.5"/><path d="M80 55 C90 65 110 65 120 55" stroke="${p.stroke}" stroke-width="1.5" fill="none"/><line x1="100" y1="55" x2="100" y2="110" stroke="${p.stroke}" stroke-width="1.5"/><circle cx="100" cy="72" r="2.5" fill="${p.stroke}"/><circle cx="100" cy="88" r="2.5" fill="${p.stroke}"/><circle cx="100" cy="104" r="2.5" fill="${p.stroke}"/></svg>`;
    }
    if (p.type === 'striped') {
      return `<svg viewBox="0 0 200 260" style="width:${w}"><defs><pattern id="modal-stripes" x="0" y="0" width="12" height="12" patternUnits="userSpaceOnUse"><rect width="12" height="12" fill="#fafafa"/><rect width="6" height="12" fill="#222"/></pattern></defs><path d="M60 40 L30 70 L50 80 L50 220 L150 220 L150 80 L170 70 L140 40 L120 55 C110 65 90 65 80 55 L60 40Z" fill="url(#modal-stripes)" stroke="${p.stroke}" stroke-width="1.5"/><path d="M80 55 C90 65 110 65 120 55" stroke="${p.stroke}" stroke-width="1.5" fill="none"/></svg>`;
    }
    return `<svg viewBox="0 0 200 260" style="width:${w}"><path d="M60 40 L30 70 L50 80 L50 220 L150 220 L150 80 L170 70 L140 40 L120 55 C110 65 90 65 80 55 L60 40Z" fill="${p.fill}" stroke="${p.stroke}" stroke-width="1.5"/><path d="M80 55 C90 65 110 65 120 55" stroke="${p.stroke}" stroke-width="1.5" fill="none"/></svg>`;
  }

  /* ── custom cursor ───────────────────────────────────── */
  const cursor = $('.cursor');
  let cx = -100, cy = -100, tx = -100, ty = -100;
  if (cursor && window.innerWidth >= 768) {
    document.addEventListener('mousemove', e => { tx = e.clientX; ty = e.clientY; });
    (function moveCursor() {
      cx = lerp(cx, tx, .15); cy = lerp(cy, ty, .15);
      cursor.style.left = cx + 'px'; cursor.style.top = cy + 'px';
      requestAnimationFrame(moveCursor);
    })();
    document.addEventListener('mouseover', e => {
      if (e.target.closest('.visiting-card')) {
        cursor.classList.add('flip-hover');
      } else if (e.target.closest('a, button, .hanger-item, .featured-card, .filter-pill, .value-tile, .contact-item, .social-strip a, .founder-card')) {
        cursor.classList.add('hover');
      }
    });
    document.addEventListener('mouseout', e => {
      if (e.target.closest('.visiting-card')) {
        cursor.classList.remove('flip-hover');
      } else if (e.target.closest('a, button, .hanger-item, .featured-card, .filter-pill, .value-tile, .contact-item, .social-strip a, .founder-card')) {
        cursor.classList.remove('hover');
      }
    });
  }

  /* ── traveling shirt ─────────────────────────────────── */
  const shirt = $('.traveling-shirt');
  let sx, sy, stx, sty;
  const isMobile = window.innerWidth < 768;

  if (shirt) {
    if (isMobile) {
      sx = window.innerWidth * 0.82; sy = window.innerHeight * 0.18;
      let phase = Math.random() * Math.PI * 2;
      (function floatShirt() {
        phase += 0.008;
        const fx = window.innerWidth * 0.82 + Math.sin(phase) * 20;
        const fy = window.innerHeight * 0.18 + Math.cos(phase * 0.7) * 25;
        shirt.style.left = fx + 'px'; shirt.style.top = fy + 'px';
        shirt.style.transform = `translate(-50%,-50%) rotate(${Math.sin(phase * 0.4) * 6}deg)`;
        requestAnimationFrame(floatShirt);
      })();
    } else {
      sx = window.innerWidth * 0.8; sy = window.innerHeight * 0.5;
      stx = sx; sty = sy;
      document.addEventListener('mousemove', e => { stx = e.clientX; sty = e.clientY; });
      let angle = 0;
      (function moveShirt() {
        sx = lerp(sx, stx, .025); sy = lerp(sy, sty, .025);
        angle = lerp(angle, (stx - sx) * 0.15, .05);
        shirt.style.left = sx + 'px'; shirt.style.top = sy + 'px';
        shirt.style.transform = `translate(-50%,-50%) rotate(${angle}deg)`;
        requestAnimationFrame(moveShirt);
      })();
    }
  }

  const shirtScales = { home: 1.3, collection: 0.8, about: 1.1, contact: 0.6 };
  function updateShirt(page) {
    if (!shirt) return;
    shirt.style.setProperty('--shirt-scale', shirtScales[page] || 1);
  }

  /* ── hamburger ───────────────────────────────────────── */
  const hamburger = $('#hamburger');
  const mobileMenu = $('#mobileMenu');
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    mobileMenu.classList.toggle('open');
    document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
  });
  $$('.mobile-link').forEach(a => a.addEventListener('click', () => {
    hamburger.classList.remove('active');
    mobileMenu.classList.remove('open');
    document.body.style.overflow = '';
  }));

  /* ── navbar ──────────────────────────────────────────── */
  const nav = $('#navbar');
  window.addEventListener('scroll', () => nav.classList.toggle('solid', window.scrollY > 50));

  /* ── SPA router ──────────────────────────────────────── */
  const pages = $$('.page');
  const navLinks = $$('.nav__links a, .mobile-link');
  let currentPage = null;

  function navigate(hash) {
    const id = (hash || '#home').replace('#', '');
    if (id === currentPage) return;
    pages.forEach(p => { p.classList.remove('visible'); p.classList.remove('active'); });
    const target = $(`#page-${id}`);
    if (target) {
      target.classList.add('active');
      void target.offsetHeight;
      target.classList.add('visible');
      window.scrollTo(0, 0);
      currentPage = id;
      initReveals();
      updateShirt(id);
      // trigger stat counter on home page
      if (id === 'home') animateStatCounters();
      // restart particles if going to home
      if (id === 'home') initParticles();
    }
    navLinks.forEach(a => a.classList.toggle('active', a.getAttribute('href') === `#${id}`));
  }

  window.addEventListener('hashchange', () => navigate(location.hash));
  window.addEventListener('popstate', () => navigate(location.hash || '#home'));
  document.addEventListener('click', e => {
    const link = e.target.closest('a[href^="#"]');
    if (link) {
      e.preventDefault();
      const hash = link.getAttribute('href');
      history.pushState(null, '', hash);
      navigate(hash);
    }
  });

  /* ── scroll reveal (enhanced with stagger) ──────────── */
  let observer;
  function initReveals() {
    if (observer) observer.disconnect();
    observer = new IntersectionObserver(entries => {
      entries.forEach((entry, i) => {
        if (entry.isIntersecting) {
          const delay = parseInt(entry.target.dataset.revealDelay) || i * 80;
          setTimeout(() => entry.target.classList.add('visible'), delay);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08 });
    const activePage = $('.page.active');
    if (activePage) {
      $$('.reveal, .reveal-left, .reveal-right, .reveal-scale', activePage).forEach(el => {
        el.classList.remove('visible');
        observer.observe(el);
      });
    }
  }

  /* ── filter pills ────────────────────────────────────── */
  $$('.filter-pill').forEach(pill => {
    pill.addEventListener('click', () => {
      $$('.filter-pill').forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      const cat = pill.dataset.cat;
      $$('.hanger-item').forEach(item => {
        if (cat === 'all' || item.dataset.cat === cat) {
          item.classList.remove('filtering-out');
        } else {
          item.classList.add('filtering-out');
        }
      });
    });
  });

  /* ── hanger rack engine ─────────────────────────────── */
  const rackSlider = $('#rackSlider');
  const hangerRack = $('#hangerRack');

  // hanger SVG (realistic wooden hanger with a curved hook)
  function hangerSVG() {
    return `<svg viewBox="0 0 160 85" fill="none" xmlns="http://www.w3.org/2000/svg">
      <!-- hook -->
      <path d="M80 2 C80 2 80 8 80 12 C80 16 76 18 76 22 C76 28 84 28 84 22 C84 18 80 16 80 12"
            stroke="#aaa" stroke-width="2.5" fill="none" stroke-linecap="round"/>
      <!-- hook top circle -->
      <circle cx="80" cy="3" r="3" fill="none" stroke="#aaa" stroke-width="2"/>
      <!-- hanger body -->
      <path d="M80 22 L24 52 Q20 54 22 58 L26 60 Q28 62 30 60 L80 34 L130 60 Q132 62 134 60 L138 58 Q140 54 136 52 L80 22Z"
            fill="url(#hangerGrad)" stroke="#8B7355" stroke-width="1"/>
      <!-- wood grain lines -->
      <line x1="50" y1="38" x2="110" y2="38" stroke="rgba(139,115,85,.2)" stroke-width=".5"/>
      <line x1="40" y1="45" x2="120" y2="45" stroke="rgba(139,115,85,.15)" stroke-width=".5"/>
      <defs>
        <linearGradient id="hangerGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stop-color="#C4A882"/>
          <stop offset="40%" stop-color="#A0825A"/>
          <stop offset="100%" stop-color="#8B7355"/>
        </linearGradient>
      </defs>
    </svg>`;
  }

  // build rack items
  if (rackSlider) {
    Object.entries(products).forEach(([id, p]) => {
      const item = document.createElement('div');
      item.className = 'hanger-item';
      item.dataset.id = id;
      item.dataset.cat = p.cat;

      // price tag
      const tag = `
        <div class="price-tag">
          <div class="price-tag__string"></div>
          <div class="price-tag__card">
            <span class="price-tag__percent">${p.discountPercent}%</span>
            <span class="price-tag__label">off</span>
          </div>
        </div>`;

      // shirt: try image first, fallback to SVG
      const shirtContent = `<img src="${p.image}" alt="${p.name}" class="hanger-item__img"
        onerror="this.style.display='none';this.nextElementSibling.style.display='block'"
      /><div class="hanger-item__svg-fallback">${shirtSVG(p, '100%')}</div>`;

      item.innerHTML = `
        <div class="hanger-item__hanger">${hangerSVG()}</div>
        <div class="hanger-item__shirt">${shirtContent}</div>
        ${tag}
      `;

      item.addEventListener('click', e => {
        // only open detail if not dragging
        if (!wasDragging) openShirtDetail(id);
      });

      rackSlider.appendChild(item);
    });
  }

  /* ── drag / swipe carousel ──────────────────────────── */
  let isDragging = false;
  let wasDragging = false;
  let startX = 0;
  let currentX = 0;
  let sliderX = 0;
  let velocity = 0;
  let lastMoveX = 0;
  let lastMoveTime = 0;
  let momentumId = null;

  function getMaxScroll() {
    if (!rackSlider || !hangerRack) return 0;
    const sliderWidth = rackSlider.scrollWidth;
    const rackWidth = hangerRack.offsetWidth;
    return Math.max(0, sliderWidth - rackWidth + 40);
  }

  function setSliderPos(x, smooth) {
    if (!rackSlider) return;
    const max = getMaxScroll();
    sliderX = Math.max(-max, Math.min(0, x));
    if (smooth) {
      rackSlider.classList.add('smooth');
    } else {
      rackSlider.classList.remove('smooth');
    }
    rackSlider.style.transform = `translateX(${sliderX}px)`;
  }

  function triggerSwing() {
    $$('.hanger-item').forEach((item, i) => {
      setTimeout(() => {
        item.classList.add('swinging');
        setTimeout(() => item.classList.remove('swinging'), 600);
      }, i * 30);
    });
  }

  // mouse drag
  if (hangerRack) {
    hangerRack.addEventListener('mousedown', e => {
      isDragging = true;
      wasDragging = false;
      startX = e.clientX;
      currentX = sliderX;
      lastMoveX = e.clientX;
      lastMoveTime = Date.now();
      velocity = 0;
      if (momentumId) cancelAnimationFrame(momentumId);
      rackSlider.classList.remove('smooth');
      e.preventDefault();
    });

    window.addEventListener('mousemove', e => {
      if (!isDragging) return;
      const diff = e.clientX - startX;
      if (Math.abs(diff) > 5) wasDragging = true;
      setSliderPos(currentX + diff, false);

      const now = Date.now();
      const dt = now - lastMoveTime;
      if (dt > 0) {
        velocity = (e.clientX - lastMoveX) / dt * 16;
      }
      lastMoveX = e.clientX;
      lastMoveTime = now;
    });

    window.addEventListener('mouseup', () => {
      if (!isDragging) return;
      isDragging = false;
      if (Math.abs(velocity) > 1) {
        triggerSwing();
        applyMomentum();
      }
    });

    // touch events
    hangerRack.addEventListener('touchstart', e => {
      isDragging = true;
      wasDragging = false;
      startX = e.touches[0].clientX;
      currentX = sliderX;
      lastMoveX = e.touches[0].clientX;
      lastMoveTime = Date.now();
      velocity = 0;
      if (momentumId) cancelAnimationFrame(momentumId);
      rackSlider.classList.remove('smooth');
    }, { passive: true });

    hangerRack.addEventListener('touchmove', e => {
      if (!isDragging) return;
      const diff = e.touches[0].clientX - startX;
      if (Math.abs(diff) > 5) wasDragging = true;
      setSliderPos(currentX + diff, false);

      const now = Date.now();
      const dt = now - lastMoveTime;
      if (dt > 0) {
        velocity = (e.touches[0].clientX - lastMoveX) / dt * 16;
      }
      lastMoveX = e.touches[0].clientX;
      lastMoveTime = now;
    }, { passive: true });

    hangerRack.addEventListener('touchend', () => {
      if (!isDragging) return;
      isDragging = false;
      if (Math.abs(velocity) > 1) {
        triggerSwing();
        applyMomentum();
      }
    });
  }

  function applyMomentum() {
    const friction = 0.95;
    function step() {
      velocity *= friction;
      sliderX += velocity;
      const max = getMaxScroll();
      sliderX = Math.max(-max, Math.min(0, sliderX));
      rackSlider.style.transform = `translateX(${sliderX}px)`;

      if (Math.abs(velocity) > 0.3) {
        momentumId = requestAnimationFrame(step);
      }
    }
    momentumId = requestAnimationFrame(step);
  }

  // arrow navigation
  const rackLeft = $('#rackLeft');
  const rackRight = $('#rackRight');
  const scrollStep = 250;

  if (rackLeft) rackLeft.addEventListener('click', () => {
    setSliderPos(sliderX + scrollStep, true);
    triggerSwing();
  });
  if (rackRight) rackRight.addEventListener('click', () => {
    setSliderPos(sliderX - scrollStep, true);
    triggerSwing();
  });

  /* ── shirt detail panel ─────────────────────────────── */
  const detailOverlay = $('#shirtDetailOverlay');
  const detailPanel = $('#shirtDetailPanel');

  function openShirtDetail(productId) {
    const p = products[productId];
    if (!p || !detailOverlay) return;

    const stockLabel = p.stocksLeft <= 5 ? 'only ' + p.stocksLeft + ' left!' : p.stocksLeft + ' in stock';
    const stockClass = p.stocksLeft <= 5 ? 'low' : '';

    detailPanel.innerHTML = `
      <div class="detail__header">
        <div>
          <div class="detail__name">${p.name}</div>
          <div class="detail__code">${p.code}</div>
        </div>
        <button class="detail__close" id="detailClose">✕</button>
      </div>
      <div class="detail__shirt-preview">
        <img src="${p.image}" alt="${p.name}" class="detail__img"
          onerror="this.style.display='none';this.nextElementSibling.style.display='block'"
        />
        <div class="detail__svg-fallback">${shirtSVG(p, '45%')}</div>
        <div class="detail__discount-badge">${p.discountPercent}% OFF</div>
      </div>
      <div class="detail__body">
        <div class="detail__prices">
          <span class="detail__original-price">₹${p.originalPrice.toLocaleString('en-IN')}</span>
          <span class="detail__discount-price">₹${p.discountPrice.toLocaleString('en-IN')}</span>
        </div>
        <ul class="detail__meta">
          <li><span>color</span><span>${p.color}</span></li>
          <li><span>size</span><span>${p.size}</span></li>
          <li><span>fabric</span><span>${p.fabric}</span></li>
          <li><span>fit</span><span>${p.fit}</span></li>
          <li><span>weight</span><span>${p.weight}</span></li>
          <li><span>care</span><span>${p.care}</span></li>
          <li><span>stock</span><span class="detail__stock"><span class="detail__stock-dot ${stockClass}"></span>${stockLabel}</span></li>
        </ul>
        <p class="modal__desc">${p.desc}</p>
        <a href="#contact" class="btn detail__cta">enquire now</a>
      </div>
    `;

    detailOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';

    $('#detailClose').addEventListener('click', closeShirtDetail);
    detailPanel.querySelector('.detail__cta').addEventListener('click', e => {
      e.preventDefault();
      closeShirtDetail();
      history.pushState(null, '', '#contact');
      navigate('#contact');
    });
  }

  function closeShirtDetail() {
    if (!detailOverlay) return;
    detailOverlay.classList.remove('open');
    document.body.style.overflow = '';
  }

  if (detailOverlay) {
    detailOverlay.addEventListener('click', e => {
      if (e.target === detailOverlay) closeShirtDetail();
    });
  }

  /* ── visiting card flip ─────────────────────────────── */
  const visitingCard = $('#visitingCard');
  if (visitingCard) {
    visitingCard.addEventListener('click', () => {
      visitingCard.classList.toggle('flipped');
    });
  }

  /* ── particle canvas (home hero) ────────────────────── */
  let particlesActive = false;
  let particleAnimId = null;

  function initParticles() {
    const canvas = $('#particleCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d');

    // cancel previous animation
    if (particleAnimId) cancelAnimationFrame(particleAnimId);

    function resize() {
      const hero = canvas.parentElement;
      canvas.width = hero.offsetWidth;
      canvas.height = hero.offsetHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    const particleCount = isMobile ? 35 : 70;
    const particles = [];
    const connectionDist = isMobile ? 100 : 150;

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.4,
        vy: (Math.random() - 0.5) * 0.4,
        r: Math.random() * 1.5 + 0.5,
        alpha: Math.random() * 0.4 + 0.1
      });
    }

    function drawParticles() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        // wrap around
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        // draw dot
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${p.alpha})`;
        ctx.fill();

        // draw connecting lines
        for (let j = i + 1; j < particles.length; j++) {
          const q = particles[j];
          const dx = p.x - q.x;
          const dy = p.y - q.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < connectionDist) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(q.x, q.y);
            const lineAlpha = (1 - dist / connectionDist) * 0.08;
            ctx.strokeStyle = `rgba(255, 255, 255, ${lineAlpha})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      particleAnimId = requestAnimationFrame(drawParticles);
    }

    particlesActive = true;
    drawParticles();
  }

  /* ── stat counter animation ─────────────────────────── */
  let statsAnimated = false;

  function animateStatCounters() {
    if (statsAnimated) return;
    const nums = $$('.hero__stat-num');
    if (nums.length === 0) return;
    statsAnimated = true;

    nums.forEach(el => {
      const target = parseInt(el.dataset.target);
      const duration = 2000;
      const start = performance.now();

      function tick(now) {
        const elapsed = now - start;
        const progress = Math.min(elapsed / duration, 1);
        // ease out cubic
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.floor(target * eased);
        if (progress < 1) requestAnimationFrame(tick);
        else el.textContent = target;
      }
      requestAnimationFrame(tick);
    });
  }

  /* ── EmailJS contact form ────────────────────────────── */
  // =====================================================
  // HOW TO SET UP EmailJS (free tier):
  // 1. Go to https://www.emailjs.com/ and create a free account
  // 2. Add an email service (Gmail, Outlook, etc.)
  // 3. Create an email template with variables:
  //    {{from_name}}, {{from_email}}, {{message}}
  // 4. Replace the 3 IDs below with your own:
  // =====================================================
//   const EMAILJS_PUBLIC_KEY = 'qI2jERAhXIB0hWaf1';     // from EmailJS dashboard → Account → API Keys
//   const EMAILJS_SERVICE_ID = 'service_nbuivo7';     // from EmailJS dashboard → Email Services
//   const EMAILJS_TEMPLATE_ID = 'template_lnbi0ig';   // from EmailJS dashboard → Email Templates

//   const form = $('#contactForm');
//   const formStatus = $('#formStatus');

//   if (form) {
//     form.addEventListener('submit', e => {
//       e.preventDefault();
//       const btn = form.querySelector('.btn');
//       const name = form.querySelector('[name="from_name"]').value;
//       const email = form.querySelector('[name="from_email"]').value;
//       const message = form.querySelector('[name="message"]').value;

//       btn.textContent = 'sending...';
//       btn.style.pointerEvents = 'none';

//     //   check if EmailJS is configured
//     //   if (EMAILJS_PUBLIC_KEY === 'qI2jERAhXIB0hWaf1') {
//     //     // demo mode — simulate success
//     //     setTimeout(() => {
//     //       formStatus.textContent = 'message sent ✓ (demo mode — set up emailjs to send real emails)';
//     //       formStatus.className = 'form-status success';
//     //       btn.textContent = 'send message';
//     //       btn.style.pointerEvents = '';
//     //       form.reset();
//     //       setTimeout(() => { formStatus.textContent = ''; formStatus.className = 'form-status'; }, 4000);
//     //     }, 1000);
//     //     return;
//     //   }

//       // real EmailJS send
//       emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
//         from_name: name,
//         from_email: email,
//         message: message
//       }).then(() => {
//         formStatus.textContent = 'message sent successfully ✓';
//         formStatus.className = 'form-status success';
//         btn.textContent = 'send message';
//         btn.style.pointerEvents = '';
//         form.reset();
//         setTimeout(() => { formStatus.textContent = ''; formStatus.className = 'form-status'; }, 4000);
//       }).catch(err => {
//         console.error('EmailJS error:', err);
//         formStatus.textContent = 'failed to send. please try again.';
//         formStatus.className = 'form-status error';
//         btn.textContent = 'send message';
//         btn.style.pointerEvents = '';
//         setTimeout(() => { formStatus.textContent = ''; formStatus.className = 'form-status'; }, 4000);
//       });
//     });
//   }

// ── EmailJS Config ─────────────────────────────
const EMAILJS_PUBLIC_KEY = 'qI2jERAhXIB0hWaf1';  // ← replace with real key
const EMAILJS_SERVICE_ID = 'service_nbuivo7';
const EMAILJS_TEMPLATE_ID = 'template_lnbi0ig';

// Initialize EmailJS
emailjs.init(EMAILJS_PUBLIC_KEY);

const form = $('#contactForm');
const formStatus = $('#formStatus');

if (form) {
  form.addEventListener('submit', e => {
    e.preventDefault();

    const btn = form.querySelector('.btn');
    const name = form.querySelector('[name="from_name"]').value;
const email = form.querySelector('[name="from_email"]').value;
const phone = form.querySelector('[name="phone"]').value;
const message = form.querySelector('[name="message"]').value;

    btn.textContent = 'sending...';
    btn.style.pointerEvents = 'none';

    // Send email using EmailJS
    emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, {
  name: form.querySelector('[name="from_name"]').value,
  email: form.querySelector('[name="from_email"]').value,
  phone: form.querySelector('[name="phone"]').value,
  message: message,
  time: new Date().toLocaleString()
})
    .then(() => {
      formStatus.textContent = 'message sent successfully ✓';
      formStatus.className = 'form-status success';
      btn.textContent = 'send message';
      btn.style.pointerEvents = '';
      form.reset();

      setTimeout(() => {
        formStatus.textContent = '';
        formStatus.className = 'form-status';
      }, 4000);
    })
    .catch(err => {
      console.error('EmailJS error:', err);
      formStatus.textContent = 'failed to send. please try again.';
      formStatus.className = 'form-status error';
      btn.textContent = 'send message';
      btn.style.pointerEvents = '';

      setTimeout(() => {
        formStatus.textContent = '';
        formStatus.className = 'form-status';
      }, 4000);
    });
  });
}

  /* ── init ─────────────────────────────────────────────── */
  navigate(location.hash || '#home');
})();
