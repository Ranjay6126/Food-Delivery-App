# 🍔 Foodie — Food Delivery App

A modern, responsive **Food Delivery Web App** built with pure **HTML, CSS, and JavaScript** — no frameworks, no build tools. Browse a menu of delicious dishes, filter and search in real time, manage your basket, and place an order through a slick checkout flow.

## ✨ Features

### Menu & Discovery
- 8 dishes across 5 categories (Burgers, Pizza, Chicken, Rolls & Wraps, Pasta)
- **Live search** — matches dish names *and* keywords (try "spicy" or "crispy")
- **Category filter pills** that combine with search
- Result counter + friendly empty state with one-click **Reset Filters**
- Ratings, descriptions, and badges (Hot!, Popular, New, Chef's Pick) on every card

### Basket & Checkout
- Add to cart from any card, with an animated badge bump
- Quantity steppers (+ / −) and per-item remove inside the basket sidebar
- Cart **persists across page reloads** via `localStorage`
- Smart delivery note: *"Add $X more for free delivery"* → unlocks at **$35** ($2.99 fee below it)
- **Checkout modal**: itemized order summary → subtotal / delivery fee / total → animated "Order Placed!" success screen

### UI Polish
- Glassmorphism sticky header with scroll-spy nav highlighting
- Animated hero: floating rider over a morphing gradient blob + floating info chips
- Scroll-reveal animations on cards and section headings
- Auto-playing reviews slider (Swiper) with prev/next controls
- Toast notifications for every action
- Newsletter signup with email validation (Enter key supported)
- Back-to-top button, ESC closes modal/basket/menu
- Fully responsive: desktop → tablet → mobile breakpoints
- Respects `prefers-reduced-motion`

## 🛠 Tech Stack
| Layer | Tech |
|---|---|
| Structure | HTML5 (semantic sections, ARIA labels) |
| Styling | Modern CSS (custom properties, grid/flexbox, keyframe animations) |
| Logic | Vanilla JavaScript (ES6+ IIFE, event delegation, IntersectionObserver) |
| Libraries via CDN | Font Awesome 6.6 · Swiper 12 |

## 🚀 Run It
No build step required — just open `index.html` in any modern browser:

```
double-click index.html
```
or use VS Code's **Live Server** extension for auto-reload during development.

## 📁 Project Structure
```
Food-Delivery-App/
├── index.html      # Page structure (hero, services, menu, reviews, contact…)
├── style.css       # Design system + components + responsive rules
├── script.js       # Cart, search/filter, checkout modal, UI behaviors
└── assets/         # Food images, hero art, profile photos, icons
```

## 🔮 Future Improvements
- User authentication & saved addresses
- Order history screen
- Real backend integration
- Payment gateway simulation
