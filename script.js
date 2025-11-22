 var swiper = new Swiper(".mySwiper", {
      loop: true,
      navigation: {
        nextEl: "#prev",
        prevEl: "#next",
      },
    });





    // =========================
//  GLOBAL SELECTORS
// =========================

const hamburger = document.querySelector(".hamburg");
const mobileMenu = document.querySelector(".mobile-menu");
const cartValue = document.querySelector(".cart-value");
const addToCartBtns = document.querySelectorAll(".order-card .btn");
const navbar = document.querySelector("header");
const navLinks = document.querySelectorAll("nav ul li a");

// =========================
// 1️⃣ MOBILE MENU TOGGLE
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
// 2️⃣ STICKY NAVBAR ON SCROLL
// =========================
window.addEventListener("scroll", () => {
  if (window.scrollY > 80) navbar.classList.add("sticky");
  else navbar.classList.remove("sticky");
});

// =========================
// 3️⃣ SMOOTH SCROLL FOR MENU LINKS
// =========================
navLinks.forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
    const targetId = link.getAttribute("href");

    if (targetId && targetId !== "#") {
      document.querySelector(targetId)?.scrollIntoView({
        behavior: "smooth",
      });
    }
  });
});

// =========================
// 4️⃣ DYNAMIC CART COUNTER
// =========================
let cartCount = 0;

addToCartBtns.forEach((btn) => {
  btn.addEventListener("click", (e) => {
    e.preventDefault();
    cartCount++;
    cartValue.textContent = ` ${cartCount} `;
    cartValue.classList.add("bump");

    setTimeout(() => cartValue.classList.remove("bump"), 300);
  });
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
// 6️⃣ SCROLL ANIMATION USING INTERSECTION OBSERVER
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
  { threshold: 0.2 }
);

observeItems.forEach((item) => observer.observe(item));

// =========================
// 7️⃣ EMAIL SUBSCRIBE VALIDATION
// =========================
const subscribeInput = document.querySelector("#email-input");
const subscribeBtn = document.querySelector("#subscribe-btn");

if (subscribeBtn) {
  subscribeBtn.addEventListener("click", (e) => {
    e.preventDefault();

    const email = subscribeInput.value.trim();
    const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

    if (!regex.test(email)) {
      alert("❌ Please enter a valid email!");
      subscribeInput.style.border = "2px solid red";
    } else {
      alert("✅ Thank you for subscribing!");
      subscribeInput.style.border = "2px solid green";
      subscribeInput.value = "";
    }
  });
}

// =========================
// 8️⃣ ACTIVE MENU HIGHLIGHT BASED ON SCROLL
// =========================
const sections = document.querySelectorAll("section, selection");

window.addEventListener("scroll", () => {
  let scrollPos = window.scrollY + 150;

  sections.forEach((sec) => {
    if (scrollPos > sec.offsetTop && scrollPos < sec.offsetTop + sec.offsetHeight) {
      const id = sec.getAttribute("id");
      navLinks.forEach((link) => link.classList.remove("active"));

      if (id) {
        document
          .querySelector(`a[href="#${id}"]`)
          ?.classList.add("active");
      }
    }
  });
});
