# Book Worm — AI Specialist Capstone Project

> An enterprise e-commerce bookstore built with **Next-Generation Agentic AI IDEs** (IBM Bob / AWS Kiro / Antigravity).  
> Features 100% **US Dollar ($)** pricing, 12 complete customer journey steps, full-stack architecture specs, and an interactive presentation deck.

---

## 📚 Project Overview

**Book Worm** is an online bookstore application developed from the architectural and UI specifications outlined in `AI Specialist - Front end and Mobile - Capstone instructions.pptx`.

By leveraging autonomous Agentic AI pair programming, the complete customer journey from catalog discovery to checkout, 48-hour order cancellation, and 1-click reordering was designed, implemented, and validated.

### Core Features & Highlights
- **100% US Dollar ($) Pricing:** All books, discounts, taxes, gift points, and order records are formatted in USD (`$`).
- **12 Customer Journey Steps:**
  1. Member Authentication & Registration with Gift Points balance.
  2. Dynamic Category Navigation with live book counts.
  3. Real-Time Search & Multi-Filter Bar (Category, Language, Format, Price Ranges under/above $35, Sort).
  4. Curated Home Page Sections (*"Recommended for You"*, *"Bestsellers this Month"*, *"New Launches"*).
  5. Interactive Product Detail Page with front & back cover preview toggle.
  6. Verified Customer Reviews & dynamic star ratings.
  7. Author Biography & Related Reads recommendations.
  8. Responsive Shopping Cart with quantity increment/decrement controls.
  9. Coupon Code Engine (supports `WELCOME10` for 10% discount).
  10. Multi-Rail Payment Modal (Credit Card, Debit Card, UPI, Digital Wallet).
  11. Order Confirmation with order summary and active 48-hour cancellation countdown timer.
  12. Order History with 1-click **"Buy It Again"** reordering and self-serve order cancellation.

---

## 🏛️ Domain Architecture

Following the capstone domain blueprint (Slide 6), the system decouples responsibilities across bounded contexts:

```
                         ┌─────────────────────────┐
                         │   Book Worm Clients     │
                         │ (Web: React 19 / Vite)  │
                         └────────────┬────────────┘
                                      │ REST / JSON
                                      ▼
                         ┌─────────────────────────┐
                         │      API Gateway        │
                         │  (OpenAPI 3.0 Standard) │
                         └────────────┬────────────┘
        ┌──────────────┬──────────────┼──────────────┬──────────────┐
        ▼              ▼              ▼              ▼              ▼
┌──────────────┐┌──────────────┐┌──────────────┐┌──────────────┐┌──────────────┐
│Catalog Domain││Member Domain ││ Order Domain ││Payment Domain││Shipping Domain
│• Books & ISBN││• Auth & Roles││• Cart State  ││• Credit/Debit││• Addresses   │
│• Categories  ││• Gift Points ││• 48h Cancel  ││• UPI / Wallet││• Tracking    │
│• Publishers  ││• Preferences ││• Buy It Again││• USD Currency││• Dispatch    │
└──────────────┘└──────────────┘└──────────────┘└──────────────┘└──────────────┘
```

---

## 📁 Repository Structure

The repository is kept clean, organized, and focused on deliverables:

```
├── AI Specialist - Front end and Mobile - Capstone instructions.pptx # Original specification
├── README.md                                                         # Top-level documentation
├── backend-spec/                                                     # Backend architecture deliverables
│   ├── openapi.yaml                                                  # OpenAPI 3.0 REST API specification
│   └── schema.sql                                                    # Normalized PostgreSQL DDL database schema
├── bookstore-app/                                                    # Production frontend application
│   ├── dist/                                                         # Production build bundle
│   ├── public/                                                       # Cover art, author photos & assets
│   ├── src/
│   │   ├── components/                                               # 11 Modular React components
│   │   │   ├── AuthModal.jsx                                         # Member login & signup modal
│   │   │   ├── BookCard.jsx                                          # Book card with USD price & cart action
│   │   │   ├── CategorySidebar.jsx                                   # 20 book categories with badge counts
│   │   │   ├── ConfirmationView.jsx                                  # Order confirmation & 48h cancel banner
│   │   │   ├── FilterBar.jsx                                         # Search, Language, Format, Price dropdowns
│   │   │   ├── HomePage.jsx                                          # 3 wireframe homepage sections
│   │   │   ├── Navbar.jsx                                            # Navigation, Gift Points pill & Cart badge
│   │   │   ├── OrdersView.jsx                                        # Order history & 1-click Buy It Again
│   │   │   ├── PaymentModal.jsx                                      # Credit, Debit, UPI, Wallet modal in USD
│   │   │   ├── ProductDetail.jsx                                     # Front/Back 3D preview & reviews
│   │   │   └── WishlistView.jsx                                      # Wishlist manager
│   │   ├── context/
│   │   │   └── StoreContext.jsx                                      # Central state provider (Cart, Orders, Auth)
│   │   ├── data/
│   │   │   └── booksData.js                                          # Seed catalog, reviews, and categories
│   │   ├── App.jsx                                                   # Main routing container
│   │   ├── index.css                                                 # Obsidian dark-mode design system
│   │   └── main.jsx                                                  # React 19 entrypoint
│   └── package.json                                                  # Dependencies & build scripts
└── presentation/                                                     # Capstone defense presentation
    ├── assets/                                                       # Wireframes & architectural diagrams
    ├── index.html                                                    # Interactive HTML5 presentation deck
    └── PRESENTATION.md                                               # 3-minute video presentation script
```

---

## 🚀 Running the Project Locally

### 1. Start the Frontend Web App
```bash
cd bookstore-app
npm install
npm run dev
```
Open **`http://localhost:5173/`** in your browser.

To verify the production build:
```bash
npm run build
npm run preview
```

### 2. View the Presentation Deck
Open `presentation/index.html` in any web browser, or launch it with a simple HTTP server:
```bash
open presentation/index.html
```
- Press `Space` or `→` to advance slides.
- Press `N` to toggle the Speaker Notes drawer (includes exact 3-minute video voiceover timestamps).
- Press `F` for fullscreen mode.
- Click **"▶ Start Timer"** to rehearse with the 3-minute presentation countdown.

---

## 🛠️ Backend Specifications

Located in the [`backend-spec/`](file:///Users/yassinebeldi/Projects/web/Ai%20specialist%20project/backend-spec/) directory:

- **[`schema.sql`](file:///Users/yassinebeldi/Projects/web/Ai%20specialist%20project/backend-spec/schema.sql):**
  - Fully normalized PostgreSQL schema.
  - Tables: `members`, `addresses`, `categories`, `publishers`, `authors`, `books`, `orders`, `order_items`, `payments`, `reviews`.
  - Enforces constraints, indexes, foreign keys, and dollar-denominated prices (`NUMERIC(10,2)`).
- **[`openapi.yaml`](file:///Users/yassinebeldi/Projects/web/Ai%20specialist%20project/backend-spec/openapi.yaml):**
  - OpenAPI 3.0 contract.
  - Endpoints for Book Search, Book Details, Cart operations, Checkout, Order Tracking, the **48-Hour Order Cancellation endpoint** (`POST /api/orders/{id}/cancel`), and **1-Click Buy It Again** (`POST /api/orders/{id}/buy-again`).

---

## 🤖 How AI Was Used (Agentic AI Engineering)

The development followed the 9-step Agentic AI workflow described in Slides 18 and 19:
1. **Multimodal Analysis:** Analyzed PowerPoint wireframes (Slides 6–15) directly through the Agentic IDE.
2. **Schema & Contract First:** Defined the PostgreSQL DDL and OpenAPI contracts before UI scaffolding to ensure strict data consistency.
3. **Autonomous Component Generation:** Generated modern React 19 components with zero runtime warnings.
4. **Visual Synthesis:** Converted rough wireframes into a high-aesthetic, obsidian-themed UI with custom scrollbars and smooth micro-transitions.
5. **Interactive Business Logic:** Implemented dynamic 48-hour order cancellation timers and 1-click reordering in global state.
6. **Automated Verification:** Utilized autonomous browser subagents to test the live application end-to-end (adding books to cart, applying coupons, testing payment modalities, and canceling orders).
7. **Consistency Overhaul:** Ensured all currency representations were uniformly denominated in US Dollars (`$`).
