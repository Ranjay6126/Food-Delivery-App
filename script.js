 var swiper = new Swiper(".mySwiper", {
      loop: true,
      navigation: {
        nextEl: "#prev",
        prevEl: "#next",
      },
    });



    // ---------------------- CART VALUE INCREASE ----------------------
const cartBtn = document.querySelector(".order-card .btn");
const cartValue = document.querySelector(".cart-value");

let count = 0;

if (cartBtn) {
  cartBtn.addEventListener("click", (e) => {
    e.preventDefault();
    count++;
    cartValue.textContent = count;
  });
}

// ---------------------- MOBILE MENU TOGGLE ----------------------
const hamburger = document.querySelector(".hamburg");
const mobileMenu = document.querySelector(".mobile-menu");

if (hamburger) {
  hamburger.addEventListener("click", (e) => {
    e.preventDefault();
    mobileMenu.classList.toggle("active");
  });
}

// ---------------------- SWIPER JS ----------------------
const swiper = new Swiper(".mySwiper", {
  loop: true,
  slidesPerView: 1,
  spaceBetween: 20,
  autoplay: {
    delay: 3000,
    disableOnInteraction: false,
  },
});

// ---------------------- CUSTOM ARROW BUTTONS ----------------------
const nextBtn = document.getElementById("next");
const prevBtn = document.getElementById("prev");

if (nextBtn && prevBtn) {
  nextBtn.addEventListener("click", (e) => {
    e.preventDefault();
    swiper.slidePrev();
  });

  prevBtn.addEventListener("click", (e) => {
    e.preventDefault();
    swiper.slideNext();
  });
}

// ---------------------- PREVENT LINKS PAGE REFRESH ----------------------
document.querySelectorAll("a[href='#']").forEach((link) => {
  link.addEventListener("click", (e) => {
    e.preventDefault();
  });
});
