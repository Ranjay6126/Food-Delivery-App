// =========================
//  GLOBAL SELECTORS
// =========================

const hamburger = document.querySelector(".hamburg");
const mobileMenu = document.querySelector(".mobile-menu");
const cartValue = document.querySelector(".cart-value");
const navbar = document.querySelector("header");
const navLinks = document.querySelectorAll("nav ul li a");
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

// Load cart from localStorage if exists
const savedCart = localStorage.getItem('foodieCart');
if (savedCart) {
  cart = JSON.parse(savedCart);
  updateCartUI();
}

function updateCartUI() {
  // Update counter
  const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartValue.textContent = ` ${totalCount} `;
  
  // Update sidebar
  cartItemsContainer.innerHTML = '';
  let totalPrice = 0;

  cart.forEach((item, index) => {
    totalPrice += item.price * item.quantity;
    const cartItem = document.createElement('div');
    cartItem.classList.add('cart-item');
    cartItem.innerHTML = `
      <img src="${item.img}" alt="${item.name}">
      <div class="cart-item-info">
        <h4>${item.name}</h4>
        <p>$${item.price.toFixed(2)}</p>
        <div class="cart-item-qty">
          <button class="qty-btn minus" data-index="${index}">-</button>
          <span>${item.quantity}</span>
          <button class="qty-btn plus" data-index="${index}">+</button>
        </div>
      </div>
      <i class="fa-solid fa-trash remove-item" data-index="${index}"></i>
    `;
    cartItemsContainer.appendChild(cartItem);
  });

  totalPriceElement.textContent = `$${totalPrice.toFixed(2)}`;
  localStorage.setItem('foodieCart', JSON.stringify(cart));
}

// Add to Cart
document.querySelectorAll(".add-to-cart").forEach(btn => {
  btn.addEventListener("click", (e) => {
    e.preventDefault();
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
    
    // Show cart sidebar briefly or just notify
    // cartSidebar.classList.add("open");
    // cartOverlay.classList.add("show");
  });
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

// Toggle Sidebar
cartBtn.addEventListener("click", (e) => {
  e.preventDefault();
  cartSidebar.classList.add("open");
  cartOverlay.classList.add("show");
});

closeCart.addEventListener("click", () => {
  cartSidebar.classList.remove("open");
  cartOverlay.classList.remove("show");
});

cartOverlay.addEventListener("click", () => {
  cartSidebar.classList.remove("open");
  cartOverlay.classList.remove("show");
});

// Checkout Button
document.querySelector(".checkout-btn").addEventListener("click", () => {
  if (cart.length === 0) {
    alert("Your cart is empty!");
    return;
  }
  alert("🎉 Thank you for your order! It's on the way.");
  cart = [];
  updateCartUI();
  cartSidebar.classList.remove("open");
  cartOverlay.classList.remove("show");
});

// =========================
// 2️⃣ FILTERING LOGIC
// =========================
filterBtns.forEach(btn => {
  btn.addEventListener("click", () => {
    // Active class toggle
    filterBtns.forEach(b => b.classList.remove("active"));
    btn.classList.add("active");

    const category = btn.getAttribute("data-category");
    
    foodCards.forEach(card => {
      if (category === "all" || card.getAttribute("data-category") === category) {
        card.classList.remove("hide");
      } else {
        card.classList.add("hide");
      }
    });
  });
});

// =========================
// 3️⃣ MOBILE MENU TOGGLE
// =========================
hamburger.addEventListener("click", (e) => {
  e.preventDefault();
  mobileMenu.classList.toggle("open");
});

// Close menu when any mobile link is clicked
document.querySelectorAll(".mobile-menu a").forEach((link) => {
  link.addEventListener("click", () => {
    mobileMenu.classList.remove("open");
  });
});

// =========================
// 4️⃣ STICKY NAVBAR ON SCROLL
// =========================
window.addEventListener("scroll", () => {
  if (window.scrollY > 80) navbar.classList.add("sticky");
  else navbar.classList.remove("sticky");
});

// =========================
// 5️⃣ SWIPER SLIDER INITIALIZATION
// =========================
const swiper = new Swiper(".mySwiper", {
  slidesPerView: 1,
  spaceBetween: 20,
  loop: true,
  autoplay: {
    delay: 3000,
  },
});

// Custom Arrow Control
document.querySelector("#next").addEventListener("click", (e) => {
  e.preventDefault();
  swiper.slidePrev();
});

document.querySelector("#prev").addEventListener("click", (e) => {
  e.preventDefault();
  swiper.slideNext();
});

// =========================
// 6️⃣ SCROLL ANIMATION
// =========================
const observeItems = document.querySelectorAll(
  ".service-card, .order-card, .app-container, .review-container"
);

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("show");
      }
    });
  },
  { threshold: 0.1 }
);

observeItems.forEach((item) => observer.observe(item));

// =========================
// 7️⃣ EMAIL SUBSCRIBE
// =========================
const subscribeBtn = document.querySelector("#subscribe-btn");
const subscribeInput = document.querySelector("#email-input");

if (subscribeBtn) {
  subscribeBtn.addEventListener("click", (e) => {
    e.preventDefault();
    const email = subscribeInput.value.trim();
    if (email === "" || !email.includes("@")) {
      alert("Please enter a valid email!");
    } else {
      alert("✅ Thank you for subscribing!");
      subscribeInput.value = "";
    }
  });
}

// =========================
// 8️⃣ ACTIVE MENU HIGHLIGHT & SMOOTH SCROLL
// =========================
const sections = document.querySelectorAll("section, selection");

window.addEventListener("scroll", () => {
  let scrollPos = window.scrollY + 150;

  sections.forEach((sec) => {
    if (scrollPos > sec.offsetTop && scrollPos < sec.offsetTop + sec.offsetHeight) {
      const id = sec.getAttribute("id");
      if (id) {
        navLinks.forEach((link) => {
          link.classList.remove("active");
          if (link.getAttribute("href") === `#${id}`) {
            link.classList.add("active");
          }
        });
      }
    }
  });
});

// Smooth Scroll for all anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const targetId = this.getAttribute('href');
    if (targetId === '#') return;
    
    e.preventDefault();
    const targetElement = document.querySelector(targetId);
    
    if (targetElement) {
      window.scrollTo({
        top: targetElement.offsetTop - 70, // Adjust for sticky header
        behavior: 'smooth'
      });
    }
  });
});

