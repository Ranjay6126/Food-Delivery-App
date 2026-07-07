const hamburger = document.querySelector('.hamburg');
const mobileMenu = document.querySelector('.mobile-menu');
const cartValue = document.querySelector('.cart-value');
const navbar = document.querySelector('header');
const navLinks = document.querySelectorAll('.navlist li a, .mobile-menu a');
const cartBtn = document.querySelector('#cart-btn');
const cartSidebar = document.querySelector('.cart-sidebar');
const closeCart = document.querySelector('.close-cart');
const cartOverlay = document.querySelector('.cart-overlay');
const cartItemsContainer = document.querySelector('.cart-items');
const totalPriceElement = document.querySelector('.total-price');
const filterBtns = document.querySelectorAll('.filter-btn');
const foodCards = document.querySelectorAll('.order-card');
const subscribeButton = document.querySelector('#subscribe-btn');
const subscribeInput = document.querySelector('#email-input');
const toast = document.querySelector('#toast');

let cart = [];

function showToast(message) {
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => toast.classList.remove('show'), 2200);
}

function updateCartUI() {
  const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartValue.textContent = totalCount;

  cartItemsContainer.innerHTML = '';
  let totalPrice = 0;

  if (cart.length === 0) {
    cartItemsContainer.innerHTML = '<p class="empty-cart">Your basket is empty.</p>';
    totalPriceElement.textContent = '$0.00';
    localStorage.setItem('foodieCart', JSON.stringify(cart));
    return;
  }

  cart.forEach((item, index) => {
    totalPrice += item.price * item.quantity;
    const cartItem = document.createElement('div');
    cartItem.classList.add('cart-item');
    cartItem.innerHTML = `
      <div class="flex gap-1">
        <img src="${item.img}" alt="${item.name}">
        <div class="cart-item-info">
          <h4>${item.name}</h4>
          <p>$${item.price.toFixed(2)}</p>
          <div class="cart-item-qty flex gap-1">
            <button class="qty-btn minus" data-index="${index}">-</button>
            <span>${item.quantity}</span>
            <button class="qty-btn plus" data-index="${index}">+</button>
          </div>
        </div>
      </div>
      <i class="fa-solid fa-trash remove-item" data-index="${index}"></i>
    `;
    cartItemsContainer.appendChild(cartItem);
  });

  totalPriceElement.textContent = `$${totalPrice.toFixed(2)}`;
  localStorage.setItem('foodieCart', JSON.stringify(cart));
}

const savedCart = localStorage.getItem('foodieCart');
if (savedCart) {
  cart = JSON.parse(savedCart);
  updateCartUI();
}

document.addEventListener('click', (e) => {
  const addToCartButton = e.target.closest('.add-to-cart');
  if (addToCartButton) {
    const name = addToCartButton.getAttribute('data-name');
    const price = parseFloat(addToCartButton.getAttribute('data-price'));
    const img = addToCartButton.getAttribute('data-img');

    const existingItem = cart.find((item) => item.name === name);
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({ name, price, img, quantity: 1 });
    }

    updateCartUI();
    cartValue.classList.add('bump');
    setTimeout(() => cartValue.classList.remove('bump'), 300);
    showToast(`${name} added to your basket`);
  }
});

cartItemsContainer.addEventListener('click', (e) => {
  const index = e.target.getAttribute('data-index');
  if (!index) return;

  if (e.target.classList.contains('plus')) {
    cart[index].quantity += 1;
  } else if (e.target.classList.contains('minus')) {
    if (cart[index].quantity > 1) cart[index].quantity -= 1;
  } else if (e.target.classList.contains('remove-item')) {
    cart.splice(index, 1);
  }

  updateCartUI();
});

const toggleCart = (show) => {
  cartSidebar.classList.toggle('open', show);
  cartOverlay.classList.toggle('show', show);
};

cartBtn.addEventListener('click', (e) => {
  e.preventDefault();
  toggleCart(true);
});

closeCart.addEventListener('click', () => toggleCart(false));
cartOverlay.addEventListener('click', () => toggleCart(false));

document.querySelector('.checkout-btn').addEventListener('click', () => {
  if (cart.length === 0) {
    showToast('Your basket is empty');
    return;
  }

  showToast('Order placed successfully!');
  cart = [];
  updateCartUI();
  toggleCart(false);
});

filterBtns.forEach((btn) => {
  btn.addEventListener('click', () => {
    filterBtns.forEach((item) => item.classList.remove('active'));
    btn.classList.add('active');

    const category = btn.getAttribute('data-category');
    foodCards.forEach((card) => {
      const show = category === 'all' || card.getAttribute('data-category') === category;
      card.classList.toggle('hidden', !show);
    });
  });
});

hamburger?.addEventListener('click', () => {
  mobileMenu.classList.toggle('open');
  hamburger.setAttribute('aria-expanded', mobileMenu.classList.contains('open'));
});

mobileMenu?.querySelectorAll('a').forEach((link) => {
  link.addEventListener('click', () => {
    mobileMenu.classList.remove('open');
    hamburger?.setAttribute('aria-expanded', 'false');
  });
});

window.addEventListener('scroll', () => {
  navbar.classList.toggle('sticky', window.scrollY > 20);
});

const sections = document.querySelectorAll('section');
window.addEventListener('scroll', () => {
  let current = '';
  sections.forEach((section) => {
    const sectionTop = section.offsetTop;
    if (window.scrollY >= sectionTop - 120) current = section.getAttribute('id');
  });

  navLinks.forEach((link) => {
    const isActive = link.getAttribute('href') === `#${current}`;
    link.classList.toggle('active', isActive);
  });
});

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (!href || href === '#') return;
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      window.scrollTo({ top: target.offsetTop - 80, behavior: 'smooth' });
    }
  });
});

subscribeButton?.addEventListener('click', () => {
  const email = subscribeInput.value.trim();
  if (!email) {
    showToast('Please enter your email address');
    return;
  }

  showToast(`Thanks, ${email} is subscribed!`);
  subscribeInput.value = '';
});

new Swiper('.mySwiper', {
  loop: true,
  autoplay: { delay: 4000 },
  navigation: { nextEl: '#next', prevEl: '#prev' }
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) entry.target.classList.add('show');
  });
}, { threshold: 0.1 });

document.querySelectorAll('.service-card, .order-card, .review-card, .contact-card').forEach((el) => observer.observe(el));


