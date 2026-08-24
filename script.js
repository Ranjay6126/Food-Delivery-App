/* ============================================================
   Foodie — Food Delivery App
   Cart · Search & Filters · Checkout Modal · UI Polish
   ============================================================ */
(() => {
  'use strict';

  const $ = (sel, ctx = document) => ctx.querySelector(sel);
  const $$ = (sel, ctx = document) => Array.from(ctx.querySelectorAll(sel));

  /* ---------------- element refs ---------------- */
  const header = $('#header');
  const hamburg = $('.hamburg');
  const mobileMenu = $('.mobile-menu');

  const cartBtn = $('#cart-btn');
  const cartSidebar = $('#cart-sidebar');
  const cartOverlay = $('#cart-overlay');
  const closeCartBtn = $('.close-cart');
  const cartItemsEl = $('.cart-items');
  const totalPriceEl = $('.total-price');
  const cartValue = $('.cart-value');
  const deliveryNote = $('#delivery-note');
  const checkoutBtn = $('#checkout-btn');

  const searchInput = $('#search-input');
  const filterBtns = $$('.filter-btn');
  const foodCards = $$('.order-card');
  const resultsCount = $('#results-count');
  const emptyResults = $('#empty-results');
  const resetFiltersBtn = $('#reset-filters');

  const modalOverlay = $('#modal-overlay');
  const modalCloseBtn = $('#modal-close');
  const summaryView = $('#modal-summary-view');
  const successView = $('#modal-success-view');
  const summaryItemsEl = $('#summary-items');
  const sSubtotal = $('#s-subtotal');
  const sDelivery = $('#s-delivery');
  const sTotal = $('#s-total');
  const placeOrderBtn = $('#place-order-btn');
  const continueBtn = $('#continue-btn');

  const subscribeBtn = $('#subscribe-btn');
  const subscribeInput = $('#email-input');
  const signInBtn = $('#sign-in-btn');
  const scrollTopBtn = $('#scroll-top');
  const yearEl = $('#year');
  const toast = $('#toast');

  const FREE_DELIVERY_MIN = 35;
  const DELIVERY_FEE = 2.99;

  let cart = [];
  let activeCategory = 'all';
  let successTimer = null;

  /* ---------------- toast ---------------- */
  function showToast(message, icon = 'fa-circle-check') {
    toast.innerHTML = `<i class="fa-solid ${icon}"></i><span>${message}</span>`;
    toast.classList.add('show');
    clearTimeout(showToast._t);
    showToast._t = setTimeout(() => toast.classList.remove('show'), 2400);
  }

  /* ---------------- scroll lock ---------------- */
  function syncScrollLock() {
    const locked =
      cartSidebar.classList.contains('open') ||
      modalOverlay.classList.contains('show');
    document.body.classList.toggle('no-scroll', locked);
  }

  /* ---------------- cart state ---------------- */
  function saveCart() {
    localStorage.setItem('foodieCart', JSON.stringify(cart));
  }

  function loadCart() {
    try {
      const raw = localStorage.getItem('foodieCart');
      if (!raw) return;
      const parsed = JSON.parse(raw);
      if (Array.isArray(parsed)) {
        cart = parsed.filter(
          (i) =>
            i &&
            typeof i.name === 'string' &&
            typeof i.price === 'number' &&
            typeof i.quantity === 'number'
        );
      }
    } catch {
      cart = [];
    }
  }

  function cartTotals() {
    const subtotal = cart.reduce((sum, i) => sum + i.price * i.quantity, 0);
    const count = cart.reduce((sum, i) => sum + i.quantity, 0);
    return { subtotal, count };
  }

  function updateCartUI() {
    const { subtotal, count } = cartTotals();
    cartValue.textContent = count;
    totalPriceEl.textContent = `$${subtotal.toFixed(2)}`;

    if (subtotal === 0) {
      deliveryNote.innerHTML = `Free delivery on orders over <strong>$${FREE_DELIVERY_MIN}</strong>`;
      deliveryNote.classList.remove('unlocked');
    } else if (subtotal >= FREE_DELIVERY_MIN) {
      deliveryNote.innerHTML = `You've unlocked <strong>FREE delivery</strong>! 🎉`;
      deliveryNote.classList.add('unlocked');
    } else {
      deliveryNote.innerHTML = `Add <strong>$${(FREE_DELIVERY_MIN - subtotal).toFixed(2)}</strong> more for free delivery`;
      deliveryNote.classList.remove('unlocked');
    }

    cartItemsEl.innerHTML = '';

    if (cart.length === 0) {
      cartItemsEl.innerHTML = `
        <div class="empty-state">
          <i class="fa-solid fa-basket-shopping"></i>
          <p>Your basket is empty.<br />Add something delicious!</p>
        </div>`;
      saveCart();
      return;
    }

    cart.forEach((item, index) => {
      const row = document.createElement('div');
      row.className = 'cart-item';
      row.innerHTML = `
        <img src="${item.img}" alt="${item.name}" />
        <div class="cart-item-info">
          <h4>${item.name}</h4>
          <span class="unit-price">$${item.price.toFixed(2)}</span>
          <div class="cart-item-qty flex gap-1">
            <button class="qty-btn minus" data-index="${index}" aria-label="Decrease quantity">&minus;</button>
            <span>${item.quantity}</span>
            <button class="qty-btn plus" data-index="${index}" aria-label="Increase quantity">+</button>
          </div>
        </div>
        <button class="remove-item" data-index="${index}" aria-label="Remove item">
          <i class="fa-solid fa-trash-can"></i>
        </button>`;
      cartItemsEl.appendChild(row);
    });

    saveCart();
  }

  /* ---------------- add to cart ---------------- */
  function addToCart(name, price, img) {
    const existing = cart.find((i) => i.name === name);
    if (existing) existing.quantity += 1;
    else cart.push({ name, price, img, quantity: 1 });

    updateCartUI();
    cartValue.classList.remove('bump');
    void cartValue.offsetWidth; /* restart animation */
    cartValue.classList.add('bump');
    showToast(`${name} added to your basket`);
  }

  document.addEventListener('click', (e) => {
    const addBtn = e.target.closest('.add-to-cart');
    if (!addBtn) return;
    addToCart(
      addBtn.dataset.name,
      parseFloat(addBtn.dataset.price),
      addBtn.dataset.img
    );
  });

  /* ---------------- cart item actions ---------------- */
  cartItemsEl.addEventListener('click', (e) => {
    const btn = e.target.closest('button');
    if (!btn) return;

    const index = Number(btn.dataset.index);
    if (!cart[index]) return;

    if (btn.classList.contains('plus')) {
      cart[index].quantity += 1;
    } else if (btn.classList.contains('minus')) {
      cart[index].quantity -= 1;
      if (cart[index].quantity <= 0) cart.splice(index, 1);
    } else if (btn.classList.contains('remove-item')) {
      cart.splice(index, 1);
    } else {
      return;
    }

    updateCartUI();
  });

  /* ---------------- basket open / close ---------------- */
  function toggleBasket(open) {
    cartSidebar.classList.toggle('open', open);
    cartOverlay.classList.toggle('show', open);
    syncScrollLock();
  }

  cartBtn.addEventListener('click', () => toggleBasket(true));
  closeCartBtn.addEventListener('click', () => toggleBasket(false));
  cartOverlay.addEventListener('click', () => toggleBasket(false));

  /* ---------------- filters + live search ---------------- */
  function applyFilters() {
    const query = searchInput.value.trim().toLowerCase();
    let visible = 0;

    foodCards.forEach((card) => {
      const matchesCat =
        activeCategory === 'all' ||
        card.dataset.category === activeCategory;
      const haystack = `${card.dataset.tags || ''} ${card
        .querySelector('h4')
        .textContent.toLowerCase()}`;
      const matchesQuery = !query || haystack.includes(query);
      const show = matchesCat && matchesQuery;
      card.classList.toggle('hidden', !show);
      if (show) visible++;
    });

    resultsCount.textContent = `Showing ${visible} of ${foodCards.length} dishes`;
    emptyResults.classList.toggle('hidden', visible !== 0);
  }

  filterBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      filterBtns.forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      activeCategory = btn.dataset.category;
      applyFilters();
    });
  });

  searchInput.addEventListener('input', applyFilters);

  resetFiltersBtn.addEventListener('click', () => {
    activeCategory = 'all';
    searchInput.value = '';
    filterBtns.forEach((b) =>
      b.classList.toggle('active', b.dataset.category === 'all')
    );
    applyFilters();
    showToast('Filters cleared');
  });

  /* ---------------- checkout modal ---------------- */
  function renderSummary() {
    const { subtotal } = cartTotals();

    summaryItemsEl.innerHTML = cart
      .map(
        (i) => `
      <div class="summary-item">
        <img src="${i.img}" alt="${i.name}" />
        <div class="s-info">
          <strong>${i.name}</strong>
          <span>${i.quantity} &times; $${i.price.toFixed(2)}</span>
        </div>
        <strong>$${(i.price * i.quantity).toFixed(2)}</strong>
      </div>`
      )
      .join('');

    const fee = subtotal >= FREE_DELIVERY_MIN ? 0 : DELIVERY_FEE;
    sSubtotal.textContent = `$${subtotal.toFixed(2)}`;
    sDelivery.innerHTML =
      fee === 0 ? '<em class="free-tag">FREE</em>' : `$${fee.toFixed(2)}`;
    sTotal.textContent = `$${(subtotal + fee).toFixed(2)}`;
  }

  function openModal() {
    modalOverlay.classList.add('show');
    syncScrollLock();
  }

  function closeModal() {
    modalOverlay.classList.remove('show');
    syncScrollLock();
    clearTimeout(successTimer);
    /* reset views after the fade-out so it opens fresh next time */
    setTimeout(() => {
      summaryView.classList.remove('hidden');
      successView.classList.add('hidden');
    }, 350);
  }

  checkoutBtn.addEventListener('click', () => {
    if (cart.length === 0) {
      showToast('Your basket is empty', 'fa-circle-exclamation');
      return;
    }
    toggleBasket(false);
    renderSummary();
    summaryView.classList.remove('hidden');
    successView.classList.add('hidden');
    openModal();
  });

  placeOrderBtn.addEventListener('click', () => {
    summaryView.classList.add('hidden');
    successView.classList.remove('hidden');
    cart = [];
    updateCartUI();
    successTimer = setTimeout(closeModal, 4200);
  });

  continueBtn.addEventListener('click', closeModal);
  modalCloseBtn.addEventListener('click', closeModal);

  modalOverlay.addEventListener('click', (e) => {
    if (e.target === modalOverlay) closeModal();
  });

  /* ---------------- escape key ---------------- */
  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return;
    if (modalOverlay.classList.contains('show')) closeModal();
    else if (cartSidebar.classList.contains('open')) toggleBasket(false);
    else mobileMenu.classList.remove('open');
  });

  /* ---------------- mobile menu ---------------- */
  hamburg.addEventListener('click', () => {
    const open = mobileMenu.classList.toggle('open');
    hamburg.setAttribute('aria-expanded', String(open));
    hamburg.innerHTML = open
      ? '<i class="fa-solid fa-xmark"></i>'
      : '<i class="fa-solid fa-bars"></i>';
  });

  $$('.mobile-menu a').forEach((link) => {
    link.addEventListener('click', () => {
      mobileMenu.classList.remove('open');
      hamburg.setAttribute('aria-expanded', 'false');
      hamburg.innerHTML = '<i class="fa-solid fa-bars"></i>';
    });
  });

  /* ---------------- sticky header + scroll-top visibility ---------------- */
  window.addEventListener(
    'scroll',
    () => {
      header.classList.toggle('sticky', window.scrollY > 10);
      scrollTopBtn.classList.toggle('visible', window.scrollY > 500);
    },
    { passive: true }
  );

  /* ---------------- scroll spy ---------------- */
  const sections = $$('main section');
  const navAnchors = $$('.navlist a');

  function updateActiveNav() {
    let current = sections.length ? sections[0].id : '';
    sections.forEach((sec) => {
      if (window.scrollY >= sec.offsetTop - 140) current = sec.id;
    });
    navAnchors.forEach((a) =>
      a.classList.toggle('active', a.getAttribute('href') === `#${current}`)
    );
  }
  window.addEventListener('scroll', updateActiveNav, { passive: true });

  /* ---------------- newsletter ---------------- */
  subscribeBtn.addEventListener('click', () => {
    const email = subscribeInput.value.trim();
    const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (!valid) {
      showToast('Please enter a valid email address', 'fa-circle-exclamation');
      subscribeInput.focus();
      return;
    }
    showToast(`Thanks! ${email} is now subscribed`);
    subscribeInput.value = '';
  });
  subscribeInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') subscribeBtn.click();
  });

  /* ---------------- misc buttons ---------------- */
  signInBtn.addEventListener('click', () =>
    showToast('Sign-in is coming soon — stay tuned!', 'fa-user')
  );

  scrollTopBtn.addEventListener('click', () =>
    window.scrollTo({ top: 0, behavior: 'smooth' })
  );

  /* ---------------- scroll reveal ---------------- */
  const revealTargets = $$('.service-card, .order-card, .review-card, .contact-card, .section-head');
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('show');
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
    );
    revealTargets.forEach((el) => {
      el.classList.add('reveal');
      io.observe(el);
    });
  }

  /* ---------------- reviews slider ---------------- */
  if (typeof Swiper !== 'undefined') {
    new Swiper('.mySwiper', {
      loop: true,
      slidesPerView: 1,
      spaceBetween: 24,
      autoplay: { delay: 4200, disableOnInteraction: false },
      navigation: { nextEl: '#next', prevEl: '#prev' },
    });
  }

  /* ---------------- init ---------------- */
  function init() {
    loadCart();
    updateCartUI();
    applyFilters();
    updateActiveNav();
    if (yearEl) yearEl.textContent = new Date().getFullYear();
  }

  init();
})();
