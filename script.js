// =========================
//  GLOBAL SELECTORS
// =========================
const hamburger = document.querySelector(".hamburg");
const mobileMenu = document.querySelector(".mobile-menu");
const cartValue = document.querySelector(".cart-value");
const navbar = document.querySelector("header");
const navLinks = document.querySelectorAll(".navlist li a");
const cartBtn = document.querySelector("#cart-btn");
const cartSidebar = document.querySelector(".cart-sidebar");
const closeCart = document.querySelector(".close-cart");
const cartOverlay = document.querySelector(".cart-overlay");
const cartItemsContainer = document.querySelector(".cart-items");
const totalPriceElement = document.querySelector(".total-price");
const filterBtns = document.querySelectorAll(".filter-btn");
const foodCards = document.querySelectorAll(".order-card");

// =========================
// 1️⃣ CART LOGIC
// =========================
let cart = [];

// Load cart from localStorage
const savedCart = localStorage.getItem('foodieCart');
if (savedCart) {
  cart = JSON.parse(savedCart);
  updateCartUI();
}

function updateCartUI() {
  const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartValue.textContent = totalCount;
  
  cartItemsContainer.innerHTML = '';
  let totalPrice = 0;

  cart.forEach((item, index) => {
    totalPrice += item.price * item.quantity;
    const cartItem = document.createElement('div');
    cartItem.classList.add('cart-item', 'flex', 'between');
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

// Add to Cart Event
document.addEventListener("click", (e) => {
  if (e.target.classList.contains("add-to-cart")) {
    const btn = e.target;
    const name = btn.getAttribute("data-name");
    const price = parseFloat(btn.getAttribute("data-price"));
    const img = btn.getAttribute("data-img");

    const existingItem = cart.find(item => item.name === name);
    if (existingItem) {
      existingItem.quantity++;
    } else {
      cart.push({ name, price, img, quantity: 1 });
    }

    updateCartUI();
    
    // Animation
    cartValue.classList.add("bump");
    setTimeout(() => cartValue.classList.remove("bump"), 300);
  }
});

// Cart sidebar actions (Qty, Remove)
cartItemsContainer.addEventListener("click", (e) => {
  const index = e.target.getAttribute("data-index");
  if (e.target.classList.contains("plus")) {
    cart[index].quantity++;
  } else if (e.target.classList.contains("minus")) {
    if (cart[index].quantity > 1) cart[index].quantity--;
  } else if (e.target.classList.contains("remove-item")) {
    cart.splice(index, 1);
  }
  updateCartUI();
});

// Sidebar Toggle
const toggleCart = (show) => {
  cartSidebar.classList.toggle("open", show);
  cartOverlay.classList.toggle("show", show);
};

cartBtn.addEventListener("click", (e) => { e.preventDefault(); toggleCart(true); });
closeCart.addEventListener("click", () => toggleCart(false));
cartOverlay.addEventListener("click", () => toggleCart(false));

// Checkout
document.querySelector(".checkout-btn").addEventListener("click", () => {
  if (cart.length === 0) return alert("Your cart is empty!");
  alert("🎉 Order placed successfully! Thank you.");
  cart = [];
  updateCartUI();
  toggleCart(false);
});

// =========================
// 2️⃣ FILTERING LOGIC
// =========================
filterBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    filterBtns.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    const category = btn.getAttribute("data-category");
    foodCards.forEach(card => {
      const show = category === "all" || card.getAttribute("data-category") === category;
      card.style.display = show ? "block" : "none";
    });
  });
});

// =========================
// 3️⃣ NAVIGATION & SCROLL
// =========================
window.addEventListener("scroll", () => {
  navbar.parentElement.classList.toggle("sticky", window.scrollY > 80);
});

// Active Link Highlighting
const sections = document.querySelectorAll("section");
window.addEventListener("scroll", () => {
  let current = "";
  sections.forEach(section => {
    const sectionTop = section.offsetTop;
    if (pageYOffset >= sectionTop - 100) current = section.getAttribute("id");
  });

  navLinks.forEach(link => {
    link.classList.toggle("active", link.getAttribute("href") === `#${current}`);
  });
});

// Smooth Scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      window.scrollTo({
        top: target.offsetTop - 80,
        behavior: 'smooth'
      });
    }
  });
});

// =========================
// 4️⃣ SWIPER & OBSERVER
// =========================
new Swiper(".mySwiper", {
  loop: true,
  autoplay: { delay: 4000 },
  navigation: { nextEl: "#next", prevEl: "#prev" }
});

const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add("show");
  });
}, { threshold: 0.1 });

document.querySelectorAll(".service-card, .order-card, .review-card").forEach(el => observer.observe(el));


