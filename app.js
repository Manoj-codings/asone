/* ══════════════════════════════════════════════════════════
   asone — SPA logic v5  (E-COMMERCE EDITION)
   Pages: home, collection, about, contact, bag, checkout
   Features: bag, wishlist, checkout (COD), trolley animation,
             EmailJS order emails, enhanced collection animations
   ══════════════════════════════════════════════════════════ */
(function () {
  'use strict';

  const $ = (s, p = document) => p.querySelector(s);
  const $$ = (s, p = document) => [...p.querySelectorAll(s)];
  const lerp = (a, b, t) => a + (b - a) * t;

  /* ── promo codes (update monthly) ────────────────────── */
  const PROMO_CODES = {
    'ASONE10': { percent: 10, label: '10% off' },
    'FIRST20': { percent: 20, label: '20% off — first order' }
  };
  let appliedPromo = null; // { code, percent, label }

  /* ── product data ────────────────────────────────────── */
  const products = {
    'classic-tee': {
      name: 'classic tee', code: 'AS-CT-001', color: 'jet black', sizes: ['S', 'M', 'L', 'XL'],
      originalPrice: 1499, discountPrice: 999, discountPercent: 33, stocksLeft: 24,
      image: 'shirt1.jpeg',
      desc: 'the everyday essential. a clean crew-neck tee cut from 100% organic cotton with a relaxed, comfortable fit.',
      fabric: '100% organic cotton', fit: 'regular', weight: '180 gsm', care: 'machine wash cold',
      fill: '#111', stroke: '#333', type: 'tee', cat: 'tee'
    },
    'cloud-oversized': {
      name: 'cloud oversized', code: 'AS-CO-002', color: 'cloud white', sizes: ['M', 'L', 'XL', 'XXL'],
      originalPrice: 1799, discountPrice: 1299, discountPercent: 28, stocksLeft: 12,
      image: 'shirt2.jpeg',
      desc: 'loose, easy, and intentionally oversized. dropped shoulders and a wider body. premium brushed cotton.',
      fabric: 'brushed cotton blend', fit: 'oversized', weight: '200 gsm', care: 'machine wash cold',
      fill: '#fafafa', stroke: '#ccc', type: 'oversized', cat: 'oversized'
    },
    'striped-tee': {
      name: 'striped tee', code: 'AS-ST-003', color: 'mono stripe', sizes: ['S', 'M', 'L', 'XL'],
      originalPrice: 1599, discountPrice: 1199, discountPercent: 25, stocksLeft: 18,
      image: 'shirt3.jpeg',
      desc: 'bold monochrome stripes on a classic silhouette. yarn-dyed stripes that never fade.',
      fabric: 'yarn-dyed cotton', fit: 'regular', weight: '190 gsm', care: 'machine wash cold',
      fill: 'striped', stroke: '#999', type: 'striped', cat: 'striped'
    },
    'henley': {
      name: 'henley', code: 'AS-HN-004', color: 'charcoal grey', sizes: ['S', 'M', 'L', 'XL'],
      originalPrice: 1999, discountPrice: 1499, discountPercent: 25, stocksLeft: 8,
      image: 'shirt4.jpeg',
      desc: 'henley neckline with a three-button placket, ribbed collar, and tapered fit.',
      fabric: '100% organic cotton', fit: 'slim', weight: '195 gsm', care: 'machine wash cold',
      fill: '#444', stroke: '#666', type: 'henley', cat: 'henley'
    },
    'shadow-tee': {
      name: 'shadow tee', code: 'AS-SH-005', color: 'deep shadow', sizes: ['S', 'M', 'L', 'XL'],
      originalPrice: 1499, discountPrice: 1099, discountPercent: 27, stocksLeft: 15,
      image: 'shirt1.jpeg',
      desc: 'deeper than black. garment-dyed for a rich, textured finish with lived-in softness.',
      fabric: 'garment-dyed cotton', fit: 'regular', weight: '185 gsm', care: 'hand wash',
      fill: '#1a1a1a', stroke: '#333', type: 'tee', cat: 'tee'
    },
    'bone-oversized': {
      name: 'bone oversized', code: 'AS-BO-006', color: 'warm bone', sizes: ['M', 'L', 'XL', 'XXL'],
      originalPrice: 1899, discountPrice: 1399, discountPercent: 26, stocksLeft: 5,
      image: 'shirt3.jpeg',
      desc: 'warm off-white meets oversized comfort. Gets better with every wash. a wardrobe anchor.',
      fabric: 'brushed cotton blend', fit: 'oversized', weight: '200 gsm', care: 'machine wash cold',
      fill: '#ddd', stroke: '#bbb', type: 'oversized', cat: 'oversized'
    },
    'ivory-tee': {
      name: 'ivory tee', code: 'AS-IV-007', color: 'pure ivory', sizes: ['S', 'M', 'L', 'XL'],
      originalPrice: 1399, discountPrice: 999, discountPercent: 29, stocksLeft: 30,
      image: 'shirt2.jpeg',
      desc: 'pure and clean. pre-shrunk, double-stitched hem, and built to last.',
      fabric: '100% organic cotton', fit: 'regular', weight: '180 gsm', care: 'machine wash cold',
      fill: '#f5f5f5', stroke: '#ddd', type: 'tee', cat: 'tee'
    },
    'dark-henley': {
      name: 'dark henley', code: 'AS-DH-008', color: 'dark charcoal', sizes: ['S', 'M', 'L', 'XL'],
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

  /* ══════════════════════════════════════════════════════
     BAG & WISHLIST — localStorage
     ══════════════════════════════════════════════════════ */
  function getBag() {
    try { return JSON.parse(localStorage.getItem('asone_bag') || '[]'); } catch { return []; }
  }
  function saveBag(bag) {
    localStorage.setItem('asone_bag', JSON.stringify(bag));
    updateBadges();
  }
  function getWishlist() {
    try { return JSON.parse(localStorage.getItem('asone_wishlist') || '[]'); } catch { return []; }
  }
  function saveWishlist(wl) {
    localStorage.setItem('asone_wishlist', JSON.stringify(wl));
    updateBadges();
  }

  function addToBag(productId, size) {
    const bag = getBag();
    const existing = bag.find(item => item.id === productId && item.size === size);
    if (existing) {
      existing.qty += 1;
    } else {
      bag.push({ id: productId, size, qty: 1 });
    }
    saveBag(bag);
    showToast(`${products[productId].name} (${size}) added to bag ✓`);
  }

  function removeFromBag(productId, size) {
    let bag = getBag();
    bag = bag.filter(item => !(item.id === productId && item.size === size));
    saveBag(bag);
  }

  function updateBagQty(productId, size, delta) {
    const bag = getBag();
    const item = bag.find(i => i.id === productId && i.size === size);
    if (item) {
      item.qty += delta;
      if (item.qty <= 0) {
        saveBag(bag.filter(i => !(i.id === productId && i.size === size)));
      } else {
        saveBag(bag);
      }
    }
    renderBag();
  }

  function toggleWishlist(productId) {
    const wl = getWishlist();
    const idx = wl.indexOf(productId);
    if (idx > -1) {
      wl.splice(idx, 1);
      showToast('removed from wishlist');
    } else {
      wl.push(productId);
      showToast(`${products[productId].name} added to wishlist ♡`);
    }
    saveWishlist(wl);
  }

  function isInWishlist(productId) {
    return getWishlist().includes(productId);
  }

  function moveToBag(productId) {
    const p = products[productId];
    if (!p) return;
    addToBag(productId, p.sizes[0]);
    // remove from wishlist
    const wl = getWishlist().filter(id => id !== productId);
    saveWishlist(wl);
    renderWishlist();
  }

  /* ── badges ───────────────────────────────────────────── */
  function updateBadges() {
    const bagBadge = $('#bagBadge');
    const wishBadge = $('#wishlistBadge');
    const bag = getBag();
    const wl = getWishlist();
    const bagCount = bag.reduce((s, i) => s + i.qty, 0);
    if (bagBadge) {
      bagBadge.textContent = bagCount;
      bagBadge.classList.toggle('visible', bagCount > 0);
    }
    if (wishBadge) {
      wishBadge.textContent = wl.length;
      wishBadge.classList.toggle('visible', wl.length > 0);
    }
  }

  /* ── toast ────────────────────────────────────────────── */
  let toastTimer;
  function showToast(msg) {
    const toast = $('#toast');
    if (!toast) return;
    toast.textContent = msg;
    toast.classList.add('show');
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => toast.classList.remove('show'), 2500);
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

  const shirtScales = { home: 1.3, collection: 0.8, about: 1.1, contact: 0.6, bag: 0.5, checkout: 0.4 };
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

  /* ── nav icon clicks ─────────────────────────────────── */
  const navBag = $('#navBag');
  const navWishlist = $('#navWishlist');
  if (navBag) navBag.addEventListener('click', () => {
    history.pushState(null, '', '#bag');
    navigate('#bag');
  });
  if (navWishlist) navWishlist.addEventListener('click', () => {
    openWishlistDrawer();
  });

  /* ── SPA router ──────────────────────────────────────── */
  const pages = $$('.page');
  const navLinks = $$('.nav__links a, .mobile-link');
  let currentPage = null;

  const pageTransition = $('#pageTransition');
  let isTransitioning = false;

  function navigate(hash) {
    const id = (hash || '#home').replace('#', '');
    if (id === currentPage) return;

    // page transition wipe effect
    if (currentPage && pageTransition && !isTransitioning) {
      isTransitioning = true;
      pageTransition.classList.remove('wipe-out');
      pageTransition.classList.add('wipe-in');

      setTimeout(() => {
        doNavigate(id);
        pageTransition.classList.remove('wipe-in');
        pageTransition.classList.add('wipe-out');
        setTimeout(() => {
          pageTransition.classList.remove('wipe-out');
          isTransitioning = false;
        }, 450);
      }, 450);
      return;
    }

    doNavigate(id);
  }

  function doNavigate(id) {
    pages.forEach(p => { p.classList.remove('visible'); p.classList.remove('active'); });
    const target = $(`#page-${id}`);
    if (target) {
      target.classList.add('active');
      void target.offsetHeight;
      target.classList.add('visible');
      window.scrollTo(0, 0);
      currentPage = id;

      // always reset body overflow on navigation (prevents stuck 'hidden')
      document.body.style.overflow = '';

      initReveals();
      updateShirt(id);

      if (id === 'home') {
        animateStatCounters();
        initParticles();
      } else {
        // stop particle animation when not on home page
        if (particleAnimId) {
          cancelAnimationFrame(particleAnimId);
          particleAnimId = null;
          particlesActive = false;
        }
      }

      if (id === 'bag') renderBag();
      if (id === 'checkout') renderCheckoutSummary();
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
      $$('.reveal, .reveal-left, .reveal-right, .reveal-scale, .reveal-blur, .reveal-spin, .stagger-children', activePage).forEach(el => {
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
          item.style.transform = '';
        } else {
          item.classList.add('filtering-out');
        }
      });
    });
  });

  /* ── hanger rack engine ─────────────────────────────── */
  const rackSlider = $('#rackSlider');
  const hangerRack = $('#hangerRack');

  // hanger SVG
  function hangerSVG() {
    return `<svg viewBox="0 0 160 85" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M80 2 C80 2 80 8 80 12 C80 16 76 18 76 22 C76 28 84 28 84 22 C84 18 80 16 80 12"
            stroke="#aaa" stroke-width="2.5" fill="none" stroke-linecap="round"/>
      <circle cx="80" cy="3" r="3" fill="none" stroke="#aaa" stroke-width="2"/>
      <path d="M80 22 L24 52 Q20 54 22 58 L26 60 Q28 62 30 60 L80 34 L130 60 Q132 62 134 60 L138 58 Q140 54 136 52 L80 22Z"
            fill="url(#hangerGrad)" stroke="#8B7355" stroke-width="1"/>
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
    Object.entries(products).forEach(([id, p], idx) => {
      const item = document.createElement('div');
      item.className = 'hanger-item';
      item.dataset.id = id;
      item.dataset.cat = p.cat;
      item.style.animationDelay = `${idx * 0.15}s`;

      const tag = `
        <div class="price-tag">
          <div class="price-tag__string"></div>
          <div class="price-tag__card">
            <span class="price-tag__percent">${p.discountPercent}%</span>
            <span class="price-tag__label">off</span>
          </div>
        </div>`;

      const shirtContent = `<img src="${p.image}" alt="${p.name}" class="hanger-item__img"
        onerror="this.style.display='none';this.nextElementSibling.style.display='block'"
      /><div class="hanger-item__svg-fallback">${shirtSVG(p, '100%')}</div>`;

      item.innerHTML = `
        <div class="hanger-item__hanger">${hangerSVG()}</div>
        <div class="hanger-item__shirt">${shirtContent}</div>
        ${tag}
        <div class="hanger-item__name">${p.name}</div>
        <div class="hanger-item__prices">
          <span class="hanger-item__mrp">₹${p.originalPrice.toLocaleString('en-IN')}</span>
          <span class="hanger-item__price">₹${p.discountPrice.toLocaleString('en-IN')}</span>
        </div>
      `;

      item.addEventListener('click', e => {
        if (!wasDragging) openShirtDetail(id);
      });

      rackSlider.appendChild(item);
    });
  }

  /* ── 3D tilt on hanger items (desktop) ─────────────── */
  if (!isMobile && rackSlider) {
    rackSlider.addEventListener('mousemove', e => {
      const item = e.target.closest('.hanger-item');
      if (!item || isDragging) return;
      const rect = item.getBoundingClientRect();
      const x = (e.clientX - rect.left) / rect.width - 0.5;
      const y = (e.clientY - rect.top) / rect.height - 0.5;
      item.style.transform = `perspective(600px) rotateY(${x * 8}deg) rotateX(${-y * 5}deg) scale(1.03)`;
    });
    rackSlider.addEventListener('mouseleave', e => {
      const item = e.target.closest('.hanger-item');
      if (item) item.style.transform = '';
    });
    // also reset on mouseout from individual items
    rackSlider.addEventListener('mouseout', e => {
      if (e.target.classList && e.target.classList.contains('hanger-item')) {
        e.target.style.transform = '';
      }
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
      // NOTE: no preventDefault — allows vertical scroll
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

    // touch events — detect direction before committing
    let startY = 0;
    let dragDirection = null; // null = undecided, 'h' = horizontal, 'v' = vertical

    hangerRack.addEventListener('touchstart', e => {
      isDragging = true;
      wasDragging = false;
      dragDirection = null;
      startX = e.touches[0].clientX;
      startY = e.touches[0].clientY;
      currentX = sliderX;
      lastMoveX = e.touches[0].clientX;
      lastMoveTime = Date.now();
      velocity = 0;
      if (momentumId) cancelAnimationFrame(momentumId);
      rackSlider.classList.remove('smooth');
    }, { passive: true });

    hangerRack.addEventListener('touchmove', e => {
      if (!isDragging) return;

      const dx = e.touches[0].clientX - startX;
      const dy = e.touches[0].clientY - startY;

      // decide direction on first significant move
      if (dragDirection === null && (Math.abs(dx) > 8 || Math.abs(dy) > 8)) {
        dragDirection = Math.abs(dx) > Math.abs(dy) ? 'h' : 'v';
      }

      // if vertical intent, cancel drag and let browser scroll
      if (dragDirection === 'v') {
        isDragging = false;
        return;
      }

      // horizontal drag — move the slider
      if (dragDirection === 'h') {
        wasDragging = true;
        setSliderPos(currentX + dx, false);

        const now = Date.now();
        const dt = now - lastMoveTime;
        if (dt > 0) {
          velocity = (e.touches[0].clientX - lastMoveX) / dt * 16;
        }
        lastMoveX = e.touches[0].clientX;
        lastMoveTime = now;
      }
    }, { passive: true });

    hangerRack.addEventListener('touchend', () => {
      if (!isDragging) return;
      isDragging = false;
      dragDirection = null;
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

  /* ══════════════════════════════════════════════════════
     SHIRT DETAIL PANEL (with Add to Bag / Wishlist)
     ══════════════════════════════════════════════════════ */
  const detailOverlay = $('#shirtDetailOverlay');
  const detailPanel = $('#shirtDetailPanel');

  function openShirtDetail(productId) {
    const p = products[productId];
    if (!p || !detailOverlay) return;

    const stockLabel = p.stocksLeft <= 5 ? 'only ' + p.stocksLeft + ' left!' : p.stocksLeft + ' in stock';
    const stockClass = p.stocksLeft <= 5 ? 'low' : '';
    const wishActive = isInWishlist(productId) ? 'active' : '';

    const sizeBtns = p.sizes.map((s, i) =>
      `<button class="size-btn ${i === 0 ? 'active' : ''}" data-size="${s}">${s}</button>`
    ).join('');

    detailPanel.innerHTML = `
      <div class="detail__header">
        <div>
          <div class="detail__name">${p.name}</div>
          <div class="detail__code">${p.code}</div>
        </div>
        <button class="detail__close" id="detailClose">✕</button>
      </div>
      <div class="detail__top-row">
        <div class="detail__shirt-preview">
          <img src="${p.image}" alt="${p.name}" class="detail__img"
            onerror="this.style.display='none';this.nextElementSibling.style.display='block'"
          />
          <div class="detail__svg-fallback">${shirtSVG(p, '100%')}</div>
          <div class="detail__discount-badge">${p.discountPercent}% OFF</div>
        </div>
        <div class="detail__quick-info">
          <div class="detail__prices">
            <span class="detail__original-price">MRP ₹${p.originalPrice.toLocaleString('en-IN')}</span>
            <span class="detail__discount-price">₹${p.discountPrice.toLocaleString('en-IN')}</span>
            <span class="detail__save-tag">save ₹${(p.originalPrice - p.discountPrice).toLocaleString('en-IN')}</span>
          </div>
          <div class="detail__sizes">
            <span class="detail__sizes-label">select size</span>
            <div class="detail__size-btns">${sizeBtns}</div>
          </div>
          <div class="detail__actions">
            <button class="btn detail__add-bag" id="detailAddBag">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="width:16px;height:16px;margin-right:6px">
                <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/>
              </svg>
              add to bag
            </button>
            <button class="btn-wishlist detail__add-wish ${wishActive}" id="detailAddWish" title="add to wishlist">
              <svg viewBox="0 0 24 24" fill="${wishActive ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="2">
                <path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/>
              </svg>
            </button>
          </div>
        </div>
      </div>
      <div class="detail__body">
        <ul class="detail__meta">
          <li><span>color</span><span>${p.color}</span></li>
          <li><span>fabric</span><span>${p.fabric}</span></li>
          <li><span>fit</span><span>${p.fit}</span></li>
          <li><span>weight</span><span>${p.weight}</span></li>
          <li><span>care</span><span>${p.care}</span></li>
          <li><span>stock</span><span class="detail__stock"><span class="detail__stock-dot ${stockClass}"></span>${stockLabel}</span></li>
        </ul>
        <p class="modal__desc">${p.desc}</p>
      </div>
    `;

    detailOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';

    // size selection
    let selectedSize = p.sizes[0];
    $$('.size-btn', detailPanel).forEach(btn => {
      btn.addEventListener('click', () => {
        $$('.size-btn', detailPanel).forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        selectedSize = btn.dataset.size;
      });
    });

    // add to bag
    $('#detailAddBag').addEventListener('click', () => {
      addToBag(productId, selectedSize);
      closeShirtDetail();
    });

    // wishlist toggle
    $('#detailAddWish').addEventListener('click', () => {
      toggleWishlist(productId);
      const btn = $('#detailAddWish');
      const inWl = isInWishlist(productId);
      btn.classList.toggle('active', inWl);
      btn.querySelector('svg').setAttribute('fill', inWl ? 'currentColor' : 'none');
    });

    // close
    $('#detailClose').addEventListener('click', closeShirtDetail);
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

  /* ══════════════════════════════════════════════════════
     BAG PAGE
     ══════════════════════════════════════════════════════ */
  function renderBag() {
    const container = $('#bagContainer');
    if (!container) return;
    const bag = getBag();

    if (bag.length === 0) {
      container.innerHTML = `
        <div class="bag-empty">
          <svg viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,.2)" stroke-width="1" style="width:80px;height:80px;margin-bottom:1.5rem">
            <path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/>
          </svg>
          <p>your bag is empty</p>
          <a href="#collection" class="btn" style="margin-top:1.5rem">shop now</a>
        </div>`;
      return;
    }

    let subtotal = 0;
    let itemsHtml = '';
    bag.forEach(item => {
      const p = products[item.id];
      if (!p) return;
      const lineTotal = p.discountPrice * item.qty;
      subtotal += lineTotal;
      itemsHtml += `
        <div class="bag-item">
          <div class="bag-item__img">${shirtSVG(p, '100%')}</div>
          <div class="bag-item__info">
            <div class="bag-item__name">${p.name}</div>
            <div class="bag-item__code">${p.code}</div>
            <div class="bag-item__meta">size: ${item.size} · ${p.color}</div>
            <div class="bag-item__price"><span class="bag-item__mrp">₹${p.originalPrice.toLocaleString('en-IN')}</span> ₹${p.discountPrice.toLocaleString('en-IN')}</div>
            <div class="bag-item__qty">
              <button class="bag-qty-btn" data-id="${item.id}" data-size="${item.size}" data-delta="-1">−</button>
              <span>${item.qty}</span>
              <button class="bag-qty-btn" data-id="${item.id}" data-size="${item.size}" data-delta="1">+</button>
              <button class="bag-remove-btn" data-id="${item.id}" data-size="${item.size}" title="remove">✕</button>
            </div>
          </div>
          <div class="bag-item__total">₹${lineTotal.toLocaleString('en-IN')}</div>
        </div>`;
    });

    container.innerHTML = `
      <div class="bag-items">${itemsHtml}</div>
      <div class="bag-summary">
        <div class="bag-summary__row"><span>subtotal</span><span>₹${subtotal.toLocaleString('en-IN')}</span></div>
        <div class="bag-summary__row"><span>delivery</span><span>free</span></div>
        <div class="bag-summary__row bag-summary__total"><span>total</span><span>₹${subtotal.toLocaleString('en-IN')}</span></div>
        <a href="#checkout" class="btn" style="width:100%;text-align:center;margin-top:1rem">proceed to checkout</a>
        <a href="#collection" class="bag-continue">← continue shopping</a>
      </div>
    `;

    // qty buttons
    $$('.bag-qty-btn', container).forEach(btn => {
      btn.addEventListener('click', () => {
        updateBagQty(btn.dataset.id, btn.dataset.size, parseInt(btn.dataset.delta));
      });
    });
    // remove buttons
    $$('.bag-remove-btn', container).forEach(btn => {
      btn.addEventListener('click', () => {
        removeFromBag(btn.dataset.id, btn.dataset.size);
        renderBag();
      });
    });
  }

  /* ══════════════════════════════════════════════════════
     WISHLIST DRAWER
     ══════════════════════════════════════════════════════ */
  const wishlistOverlay = $('#wishlistOverlay');
  const wishlistDrawer = $('#wishlistDrawer');
  const wishlistClose = $('#wishlistClose');

  function openWishlistDrawer() {
    renderWishlist();
    if (wishlistOverlay) {
      wishlistOverlay.classList.add('open');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeWishlistDrawer() {
    if (wishlistOverlay) {
      wishlistOverlay.classList.remove('open');
      document.body.style.overflow = '';
    }
  }

  if (wishlistClose) wishlistClose.addEventListener('click', closeWishlistDrawer);
  if (wishlistOverlay) wishlistOverlay.addEventListener('click', e => {
    if (e.target === wishlistOverlay) closeWishlistDrawer();
  });

  function renderWishlist() {
    const body = $('#wishlistBody');
    if (!body) return;
    const wl = getWishlist();

    if (wl.length === 0) {
      body.innerHTML = `
        <div class="wishlist-empty">
          <p>your wishlist is empty</p>
          <a href="#collection" class="btn" style="margin-top:1rem" onclick="document.getElementById('wishlistOverlay').classList.remove('open');document.body.style.overflow=''">browse collection</a>
        </div>`;
      return;
    }

    let html = '';
    wl.forEach(id => {
      const p = products[id];
      if (!p) return;
      html += `
        <div class="wishlist-item">
          <div class="wishlist-item__img">${shirtSVG(p, '100%')}</div>
          <div class="wishlist-item__info">
            <div class="wishlist-item__name">${p.name}</div>
            <div class="wishlist-item__price">₹${p.discountPrice.toLocaleString('en-IN')}</div>
          </div>
          <div class="wishlist-item__actions">
            <button class="wishlist-move-btn" data-id="${id}" title="move to bag">
              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:16px;height:16px"><path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/><line x1="3" y1="6" x2="21" y2="6"/><path d="M16 10a4 4 0 01-8 0"/></svg>
            </button>
            <button class="wishlist-remove-btn" data-id="${id}" title="remove">✕</button>
          </div>
        </div>`;
    });
    body.innerHTML = html;

    // move to bag
    $$('.wishlist-move-btn', body).forEach(btn => {
      btn.addEventListener('click', () => {
        const pid = btn.dataset.id;
        const p = products[pid];
        if (p) addToBag(pid, p.sizes[0]);
        const wlNew = getWishlist().filter(i => i !== pid);
        saveWishlist(wlNew);
        renderWishlist();
      });
    });
    // remove
    $$('.wishlist-remove-btn', body).forEach(btn => {
      btn.addEventListener('click', () => {
        const wlNew = getWishlist().filter(i => i !== btn.dataset.id);
        saveWishlist(wlNew);
        renderWishlist();
      });
    });
  }

  /* ══════════════════════════════════════════════════════
     CHECKOUT PAGE
     ══════════════════════════════════════════════════════ */
  function renderCheckoutSummary() {
    const container = $('#checkoutSummary');
    if (!container) return;
    const bag = getBag();

    if (bag.length === 0) {
      container.innerHTML = `<p style="color:var(--grey);text-align:center;">your bag is empty. <a href="#collection">shop first</a></p>`;
      return;
    }

    let subtotal = 0;
    let totalMRP = 0;
    let itemsHtml = '<h3 class="checkout-summary__title">order summary</h3>';
    bag.forEach(item => {
      const p = products[item.id];
      if (!p) return;
      const lineTotal = p.discountPrice * item.qty;
      const lineMRP = p.originalPrice * item.qty;
      subtotal += lineTotal;
      totalMRP += lineMRP;
      itemsHtml += `
        <div class="checkout-item">
          <div class="checkout-item__img">${shirtSVG(p, '100%')}</div>
          <div class="checkout-item__info">
            <span>${p.name} × ${item.qty}</span>
            <span class="checkout-item__code">${p.code}</span>
            <span class="checkout-item__size">size: ${item.size} · ${p.color}</span>
          </div>
          <div class="checkout-item__price">
            <span class="checkout-item__mrp">₹${lineMRP.toLocaleString('en-IN')}</span>
            ₹${lineTotal.toLocaleString('en-IN')}
          </div>
        </div>`;
    });

    const mrpDiscount = totalMRP - subtotal;
    const promoAmt = appliedPromo ? Math.round(subtotal * appliedPromo.percent / 100) : 0;
    const afterPromo = subtotal - promoAmt;
    // GST is included in price (5% = 2.5% CGST + 2.5% SGST)
    const taxableAmt = Math.round(afterPromo / 1.05 * 100) / 100;
    const cgst = Math.round((afterPromo - taxableAmt) / 2);
    const sgst = cgst;

    itemsHtml += `
      <div class="checkout-summary__totals">
        <div class="checkout-summary__row"><span>total MRP</span><span>₹${totalMRP.toLocaleString('en-IN')}</span></div>
        <div class="checkout-summary__row checkout-summary__discount"><span>product discount</span><span>-₹${mrpDiscount.toLocaleString('en-IN')}</span></div>
        ${appliedPromo ? `<div class="checkout-summary__row checkout-summary__discount"><span>promo (${appliedPromo.code})</span><span>-₹${promoAmt.toLocaleString('en-IN')}</span></div>` : ''}
        <div class="checkout-summary__row checkout-summary__tax"><span>CGST (2.5%)</span><span>₹${cgst.toLocaleString('en-IN')}</span></div>
        <div class="checkout-summary__row checkout-summary__tax"><span>SGST (2.5%)</span><span>₹${sgst.toLocaleString('en-IN')}</span></div>
        <div class="checkout-summary__row"><span>delivery</span><span style="color:#4caf50">free</span></div>
        <div class="checkout-summary__row checkout-summary__grand"><span>you pay</span><span>₹${afterPromo.toLocaleString('en-IN')}</span></div>
        ${mrpDiscount > 0 ? `<div class="checkout-summary__savings">you save ₹${(mrpDiscount + promoAmt).toLocaleString('en-IN')} on this order 🎉</div>` : ''}
      </div>`;

    container.innerHTML = itemsHtml;
  }

  /* ── promo code logic ─────────────────────────────────── */
  const promoInput = $('#promoInput');
  const promoApplyBtn = $('#promoApplyBtn');
  const promoStatus = $('#promoStatus');

  if (promoApplyBtn) {
    promoApplyBtn.addEventListener('click', () => {
      const code = promoInput.value.trim().toUpperCase();
      if (!code) return;

      if (PROMO_CODES[code]) {
        appliedPromo = { code, ...PROMO_CODES[code] };
        promoInput.value = '';
        promoInput.disabled = true;
        promoApplyBtn.style.display = 'none';
        promoStatus.innerHTML = `<span class="promo-success">✓ ${appliedPromo.label} applied <button class="promo-remove" id="promoRemove">×</button></span>`;
        renderCheckoutSummary();

        // remove promo handler
        const removeBtn = $('#promoRemove');
        if (removeBtn) {
          removeBtn.addEventListener('click', () => {
            appliedPromo = null;
            promoInput.disabled = false;
            promoApplyBtn.style.display = '';
            promoStatus.textContent = '';
            renderCheckoutSummary();
          });
        }
      } else {
        promoStatus.innerHTML = '<span class="promo-error">invalid promo code</span>';
        setTimeout(() => { promoStatus.textContent = ''; }, 3000);
      }
    });

    // allow Enter key to apply
    if (promoInput) {
      promoInput.addEventListener('keydown', e => {
        if (e.key === 'Enter') {
          e.preventDefault();
          promoApplyBtn.click();
        }
      });
    }
  }

  /* ── generate unique order ID ──────────────────────── */
  function generateOrderId() {
    const now = new Date();
    const dateStr = now.getFullYear().toString().slice(-2) +
      String(now.getMonth() + 1).padStart(2, '0') +
      String(now.getDate()).padStart(2, '0');
    const rand = Math.random().toString(36).substring(2, 6).toUpperCase();
    return `ASO-${dateStr}-${rand}`;
  }

  /* ══════════════════════════════════════════════════════
     INVOICE PREVIEW & PLACE ORDER
     ══════════════════════════════════════════════════════ */
  const checkoutForm = $('#checkoutForm');
  const placeOrderBtn = $('#placeOrderBtn');
  const placeOrderText = $('#placeOrderText');
  const orderStatus = $('#orderStatus');
  const invoiceOverlay = $('#invoiceOverlay');
  const invoiceBody = $('#invoiceBody');
  const invoiceId = $('#invoiceId');
  const invoiceEdit = $('#invoiceEdit');
  const invoiceConfirm = $('#invoiceConfirm');
  const invoiceConfirmText = $('#invoiceConfirmText');

  // stored order data when invoice is open
  let pendingOrder = null;

  function showInvoice(orderData) {
    pendingOrder = orderData;
    invoiceId.textContent = `order #${orderData.orderId}`;

    let itemsHtml = '';
    orderData.items.forEach(item => {
      itemsHtml += `
        <div class="invoice-item">
          <div class="invoice-item__img">${item.svg}</div>
          <div class="invoice-item__details">
            <div class="invoice-item__name">${item.name}</div>
            <div class="invoice-item__code">${item.code}</div>
            <div class="invoice-item__meta">size: ${item.size} · color: ${item.color} · qty: ${item.qty}</div>
          </div>
          <div class="invoice-item__price">
            <span class="invoice-item__mrp">₹${(item.mrpPerUnit * item.qty).toLocaleString('en-IN')}</span>
            <span>₹${item.lineTotal.toLocaleString('en-IN')}</span>
          </div>
        </div>`;
    });

    invoiceBody.innerHTML = `
      <div class="invoice-meta-bar">
        <div>GSTIN: <strong>XXXXXXXXXXXXXXX</strong></div>
        <div>Invoice: <strong>${orderData.orderId}</strong></div>
        <div>Date: <strong>${orderData.orderTime}</strong></div>
      </div>

      <div class="invoice-section">
        <div class="invoice-section__label">items ordered</div>
        ${itemsHtml}
      </div>

      <div class="invoice-divider"></div>

      <div class="invoice-two-col">
        <div class="invoice-section">
          <div class="invoice-section__label">delivery to</div>
          <div class="invoice-customer">
            <div class="invoice-customer__name">${orderData.custName}</div>
            <div class="invoice-customer__line">${orderData.custAddress}</div>
            <div class="invoice-customer__line">${orderData.custCity}, ${orderData.custState} - ${orderData.custPincode}</div>
            <div class="invoice-customer__line">📞 ${orderData.custPhone}</div>
            <div class="invoice-customer__line">✉ ${orderData.custEmail}</div>
          </div>
        </div>
        <div class="invoice-section">
          <div class="invoice-section__label">payment summary</div>
          <div class="invoice-totals">
            <div class="invoice-totals__row"><span>total MRP</span><span>₹${orderData.totalMRP.toLocaleString('en-IN')}</span></div>
            <div class="invoice-totals__row invoice-totals__discount"><span>product discount</span><span>-₹${orderData.mrpDiscount.toLocaleString('en-IN')}</span></div>
            ${orderData.promoCode ? `<div class="invoice-totals__row invoice-totals__discount"><span>promo (${orderData.promoCode})</span><span>-₹${orderData.promoAmt.toLocaleString('en-IN')}</span></div>` : ''}
            <div class="invoice-totals__row invoice-totals__taxrow"><span>CGST (2.5%)</span><span>₹${orderData.cgst.toLocaleString('en-IN')}</span></div>
            <div class="invoice-totals__row invoice-totals__taxrow"><span>SGST (2.5%)</span><span>₹${orderData.sgst.toLocaleString('en-IN')}</span></div>
            <div class="invoice-totals__row"><span>delivery</span><span style="color:#4caf50">free</span></div>
            <div class="invoice-totals__row invoice-totals__grand"><span>grand total</span><span>₹${orderData.grandTotal.toLocaleString('en-IN')}</span></div>
            <div class="invoice-totals__method">payment: ${orderData.paymentMethod.toUpperCase()}</div>
            ${orderData.mrpDiscount > 0 ? `<div class="invoice-totals__savings">you save ₹${(orderData.mrpDiscount + orderData.promoAmt).toLocaleString('en-IN')} 🎉</div>` : ''}
          </div>
        </div>
      </div>

      <div class="invoice-divider"></div>
      <div class="invoice-footer-note">
        <p>thank you for shopping with <strong>asone</strong></p>
        <p class="invoice-terms">prices are inclusive of GST · no exchange/return on sale items · delivery within 5-7 business days</p>
      </div>
    `;

    invoiceOverlay.classList.add('open');
    document.body.style.overflow = 'hidden';
  }

  function closeInvoice() {
    invoiceOverlay.classList.remove('open');
    document.body.style.overflow = '';
    pendingOrder = null;
    // reset confirm button
    invoiceConfirm.disabled = false;
    invoiceConfirm.classList.remove('animating', 'success');
    invoiceConfirmText.textContent = 'confirm & place order';
  }

  // STEP 1: form submit → show invoice preview
  if (checkoutForm) {
    checkoutForm.addEventListener('submit', e => {
      e.preventDefault();

      const bag = getBag();
      if (bag.length === 0) {
        orderStatus.textContent = 'your bag is empty!';
        orderStatus.className = 'form-status error';
        return;
      }

      const formData = new FormData(checkoutForm);
      const custName = formData.get('cust_name');
      const custEmail = formData.get('cust_email');
      const custPhone = formData.get('cust_phone');
      const custAddress = formData.get('cust_address');
      const custCity = formData.get('cust_city');
      const custState = formData.get('cust_state');
      const custPincode = formData.get('cust_pincode');
      const paymentMethod = formData.get('payment') || 'cod';

      let total = 0;
      let totalMRP = 0;
      const items = bag.map(item => {
        const p = products[item.id];
        if (!p) return null;
        const lineTotal = p.discountPrice * item.qty;
        total += lineTotal;
        totalMRP += p.originalPrice * item.qty;
        return {
          name: p.name, code: p.code, color: p.color,
          size: item.size, qty: item.qty,
          mrpPerUnit: p.originalPrice,
          lineTotal, svg: shirtSVG(p, '100%')
        };
      }).filter(Boolean);

      const mrpDiscount = totalMRP - total;
      const promoAmt = appliedPromo ? Math.round(total * appliedPromo.percent / 100) : 0;
      const grandTotal = total - promoAmt;
      const taxableAmt = Math.round(grandTotal / 1.05 * 100) / 100;
      const cgst = Math.round((grandTotal - taxableAmt) / 2);
      const sgst = cgst;

      const orderId = generateOrderId();

      showInvoice({
        orderId,
        items,
        custName, custEmail, custPhone,
        custAddress, custCity, custState, custPincode,
        totalMRP,
        total,
        mrpDiscount,
        promoCode: appliedPromo ? appliedPromo.code : null,
        promoAmt,
        cgst, sgst,
        grandTotal,
        paymentMethod,
        orderTime: new Date().toLocaleString()
      });
    });
  }

  // STEP 2: edit button → close invoice, go back to form
  if (invoiceEdit) {
    invoiceEdit.addEventListener('click', closeInvoice);
  }

  // STEP 3: confirm → download invoice → trolley animation → send email to owner
  if (invoiceConfirm) {
    invoiceConfirm.addEventListener('click', async () => {
      if (!pendingOrder) return;
      const od = pendingOrder;

      invoiceConfirm.disabled = true;
      invoiceConfirm.classList.add('animating');
      invoiceConfirmText.textContent = 'preparing invoice…';

      // ── 1) capture invoice as image and download ──────
      try {
        const invoiceModal = $('#invoiceModal');
        if (invoiceModal && typeof html2canvas !== 'undefined') {
          const canvas = await html2canvas(invoiceModal, {
            backgroundColor: '#0d0d0d',
            scale: 2,
            useCORS: true,
            logging: false
          });

          // trigger download
          const link = document.createElement('a');
          link.download = `ASONE-Invoice-${od.orderId}.png`;
          link.href = canvas.toDataURL('image/png');
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);

          showToast('invoice downloaded to your device ✓');
        }
      } catch (err) {
        console.warn('Invoice download failed:', err);
      }

      // ── 2) send order email to owner via EmailJS ──────
      invoiceConfirmText.textContent = 'placing order…';

      const orderLines = od.items.map(i =>
        `${i.name} [${i.code}] (${i.size}) × ${i.qty} = ₹${i.lineTotal.toLocaleString('en-IN')}`
      ).join('\n');

      // build HTML table for email
      const itemRows = od.items.map(i => `
        <tr>
          <td style="padding:8px 12px;border-bottom:1px solid #eee;">${i.name}</td>
          <td style="padding:8px 12px;border-bottom:1px solid #eee;">${i.code}</td>
          <td style="padding:8px 12px;border-bottom:1px solid #eee;">${i.size}</td>
          <td style="padding:8px 12px;border-bottom:1px solid #eee;">${i.color}</td>
          <td style="padding:8px 12px;border-bottom:1px solid #eee;">${i.qty}</td>
          <td style="padding:8px 12px;border-bottom:1px solid #eee;">₹${i.lineTotal.toLocaleString('en-IN')}</td>
        </tr>`).join('');

      const orderTable = `
        <table style="width:100%;border-collapse:collapse;font-size:14px;">
          <thead>
            <tr style="background:#f8f8f8;">
              <th style="padding:10px 12px;text-align:left;border-bottom:2px solid #ddd;">Item</th>
              <th style="padding:10px 12px;text-align:left;border-bottom:2px solid #ddd;">Code</th>
              <th style="padding:10px 12px;text-align:left;border-bottom:2px solid #ddd;">Size</th>
              <th style="padding:10px 12px;text-align:left;border-bottom:2px solid #ddd;">Color</th>
              <th style="padding:10px 12px;text-align:left;border-bottom:2px solid #ddd;">Qty</th>
              <th style="padding:10px 12px;text-align:left;border-bottom:2px solid #ddd;">Amount</th>
            </tr>
          </thead>
          <tbody>${itemRows}</tbody>
          <tfoot>
            <tr style="font-weight:bold;background:#f0f0f0;">
              <td colspan="5" style="padding:10px 12px;text-align:right;">Subtotal</td>
              <td style="padding:10px 12px;">₹${od.total.toLocaleString('en-IN')}</td>
            </tr>
            ${od.mrpDiscount > 0 ? `<tr style="color:#4caf50;"><td colspan="5" style="padding:6px 12px;text-align:right;">Product Discount</td><td style="padding:6px 12px;">-₹${od.mrpDiscount.toLocaleString('en-IN')}</td></tr>` : ''}
            ${od.promoCode ? `<tr style="color:#4caf50;"><td colspan="5" style="padding:6px 12px;text-align:right;">Promo (${od.promoCode})</td><td style="padding:6px 12px;">-₹${od.promoAmt.toLocaleString('en-IN')}</td></tr>` : ''}
            <tr><td colspan="5" style="padding:6px 12px;text-align:right;font-size:12px;color:#888;">CGST (2.5%)</td><td style="padding:6px 12px;font-size:12px;color:#888;">₹${od.cgst.toLocaleString('en-IN')}</td></tr>
            <tr><td colspan="5" style="padding:6px 12px;text-align:right;font-size:12px;color:#888;">SGST (2.5%)</td><td style="padding:6px 12px;font-size:12px;color:#888;">₹${od.sgst.toLocaleString('en-IN')}</td></tr>
            <tr style="font-weight:bold;background:#f0f0f0;font-size:16px;">
              <td colspan="5" style="padding:10px 12px;text-align:right;">Grand Total</td>
              <td style="padding:10px 12px;">₹${od.grandTotal.toLocaleString('en-IN')}</td>
            </tr>
          </tfoot>
        </table>`;

      const templateParams = {
        order_id: od.orderId,
        order_items: orderLines,
        order_table: orderTable,
        customer_name: od.custName,
        customer_email: od.custEmail,
        customer_phone: od.custPhone,
        customer_address: `${od.custAddress}, ${od.custCity}, ${od.custState} - ${od.custPincode}`,
        customer_city: od.custCity,
        customer_state: od.custState,
        customer_pincode: od.custPincode,
        total: `₹${od.grandTotal.toLocaleString('en-IN')}`,
        payment_method: od.paymentMethod.toUpperCase(),
        order_time: od.orderTime
      };

      setTimeout(() => {
        emailjs.send(ORDER_SERVICE_ID, ORDER_TEMPLATE_ID, templateParams, { publicKey: ORDER_PUBLIC_KEY })
          .then(() => {
            invoiceConfirm.classList.remove('animating');
            invoiceConfirm.classList.add('success');
            invoiceConfirmText.textContent = 'order placed ✓';
            showToast('order placed! confirmation sent to your email.');

            saveBag([]);
            checkoutForm.reset();

            setTimeout(() => {
              closeInvoice();
              history.pushState(null, '', '#home');
              navigate('#home');
            }, 3500);
          })
          .catch(err => {
            console.error('EmailJS order error:', err);
            invoiceConfirm.classList.remove('animating');
            invoiceConfirm.disabled = false;
            invoiceConfirmText.textContent = 'confirm & place order';
            showToast('failed to place order. please try again.');
          });
      }, 1400);
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

        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(255, 255, 255, ${p.alpha})`;
        ctx.fill();

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
        const eased = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.floor(target * eased);
        if (progress < 1) requestAnimationFrame(tick);
        else el.textContent = target;
      }
      requestAnimationFrame(tick);
    });
  }

  /* ══════════════════════════════════════════════════════
     EmailJS — TWO SEPARATE ACCOUNTS
     ══════════════════════════════════════════════════════ */

  // ── ORDER PLACEMENT ──────────────────────────────────
  const ORDER_PUBLIC_KEY = 'fXw1MNe7O7pFkSohB';
  const ORDER_SERVICE_ID = 'service_jc24lqb';
  const ORDER_TEMPLATE_ID = 'template_z8c6ijf';

  // ── CONTACT FORM ─────────────────────────────────────
  const CONTACT_PUBLIC_KEY = 'qI2jERAhXIB0hWaf1';
  const CONTACT_SERVICE_ID = 'service_nbuivo7';
  const CONTACT_TEMPLATE_ID = 'template_lnbi0ig';

  // Contact form
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

      emailjs.send(CONTACT_SERVICE_ID, CONTACT_TEMPLATE_ID, {
        name: name,
        email: email,
        phone: phone,
        message: message,
        time: new Date().toLocaleString()
      }, { publicKey: CONTACT_PUBLIC_KEY })
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

  /* ── button glow tracking ────────────────────────────── */
  document.addEventListener('mousemove', e => {
    const btn = e.target.closest('.btn');
    if (btn) {
      const rect = btn.getBoundingClientRect();
      btn.style.setProperty('--mx', ((e.clientX - rect.left) / rect.width * 100) + '%');
      btn.style.setProperty('--my', ((e.clientY - rect.top) / rect.height * 100) + '%');
    }
  });

  /* ── preloader ──────────────────────────────────────── */
  const preloader = $('#preloader');
  function dismissPreloader() {
    if (preloader) preloader.classList.add('done');
    // remove from DOM after animation
    setTimeout(() => {
      if (preloader && preloader.parentNode) preloader.parentNode.removeChild(preloader);
    }, 700);
  }

  // dismiss after 2.5s (allows letter animation to finish)
  setTimeout(dismissPreloader, 2500);

  /* ── init ─────────────────────────────────────────────── */
  updateBadges();
  navigate(location.hash || '#home');
})();
