# Omega — Admin Dashboard

A dark-themed admin dashboard for managing products and tracking inventory analytics. Built as part of the front-end internship assessment.

**Live:** https://omega-rho-khaki.vercel.app  
**Repo:** https://github.com/sakshamkoul05-jpg/omega

---

### Tech

React 18 · Vite · React Router v6 · TanStack Query v5 · Zustand · Recharts · Framer Motion · Tailwind CSS v4

### What's inside

- Collapsible sidebar with active nav pill animation, mobile overlay drawer, and user profile section
- Product listing with table/grid toggle — search, category pills, sort by name/price/rating, paginated
- Product detail page with image carousel (keyboard nav + thumbnails), discount badge, specs grid, and stock status
- Analytics dashboard with animated stat counters (total products, avg rating, inventory value, categories) and three Recharts bar charts
- Everything synced to URL — /products?search=xyz&category=beauty&sort=price-desc&page=2&view=grid
- Live update simulation with toast notifications — price changes, stock movements, new reviews, restocks fire every 12–22 seconds
- Column customizer — show/hide columns, drag to reorder
- Polling every 30s with a flash effect on stat cards when data refreshes
- Skeleton loaders on every page while data loads
- Error boundary with retry button, 404 handling on invalid product IDs

### Running locally

```bash
npm install
npm run dev
```

Opens at http://localhost:5173.
