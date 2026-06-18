# PulseShop — SDE-2 E-Commerce Platform

PulseShop is a production-ready, highly polished, and responsive e-commerce application designed to run smoothly on desktop, tablet, and mobile devices. It showcases defensive engineering, performance optimizations, state management split, and premium UX aesthetics.

---

## 🚀 Getting Started

### Prerequisites
Make sure you have **Node.js (v18+)** and **npm** installed on your system.

### Setup & Run
Run the standard setup and execution commands in the root of the project:

```bash
# 1. Install dependencies
npm install

# 2. Run the development server
npm start
```

Once started, the application will be running locally at: **[http://localhost:5173](http://localhost:5173)**.

---

## 🛠️ Tech Stack & Libraries

- **Core Framework**: React 19 (Functional Components, Hooks)
- **Bundler & Build Tool**: Vite (Lightning fast HMR & production builds)
- **Language**: TypeScript (Strict type safety, custom schemas, and clean interfaces)
- **Styling**: Vanilla CSS (CSS Custom Properties/Variables, responsive flexbox/grid layout systems, sleek dark-mode accents)
- **State Management**: 
  - **Redux Toolkit**: Client-side state (Cart, Wishlist)
  - **TanStack React Query (v5)**: Server-side data fetching, caching, cache invalidation, and pagination
- **Routing**: React Router DOM (v7)
- **Icons**: Lucide React

---

## 📐 Folder Structure (FSD-Inspired)

The project layout is based on **Feature-Sliced Design (FSD)** to ensure clear separation of concerns, modularity, and scalability as the codebase grows:

```
src/
├── app/               # Application bootstrapping, global styles, providers, and layout configurations
│   ├── layouts/       # Reusable layout templates (ShopLayout, DashboardLayout, AuthLayout)
│   ├── providers/     # React Context, React Query, and Redux store providers
│   ├── router/        # Route declarations, paths, and router configuration
│   └── store/         # Global Redux Toolkit setup, slices, and persistence middlewares
│
├── features/          # Domain-specific business logic and micro-features
│   ├── auth/          # Authentication flows and user sessions
│   ├── cart/          # Cart drawers, operations, calculation selectors, and slices
│   ├── categories/    # Product category chips, showcase components, and styling
│   ├── dashboard/     # Administrator control panels, overview analytics, and metrics
│   ├── products/      # Catalog grids, product cards, filters, and React Query fetch functions
│   └── wishlist/      # Wishlist drawers, toggle buttons, and Redux slices
│
├── pages/             # Composition layer that connects features and layouts to page routes
│   ├── AllProducts/   # Product listings page with infinite scroll and filters
│   ├── Dashboard/     # Admin control center page
│   ├── Login/         # Auth forms page
│   ├── ProductDetails/# Rich product details page with image carousel and magnifier
│   └── ShopHome/      # Home landing page with banners, categories, and horizontal scroll listings
│
└── shared/            # Generic components, hooks, api instances, and configuration files
    ├── api/           # Basic http/axios configurations
    ├── components/    # Abstract reusables (ErrorBoundary, Shimmer skeletons, PageLoader, SearchBar)
    ├── config/        # Environment configurations and constants
    ├── hooks/         # Reusable custom hooks (useRecentlyViewed, useImageZoom, useProductsFilterSort)
    └── utils/         # Helper functions
```

---

## 💾 State Management Strategy: Client vs. Server

To maximize rendering efficiency and separate concerns, state is divided into **Server State** and **Client State**:

### 1. Server State (TanStack React Query)
All network-dependent data (catalog listings, item details, dashboard data) is handled by React Query:
- **Deduplication**: Minimizes unnecessary network calls by sharing queries across different components.
- **Smart Caching**: Seamless caching ensures pages load instantly when navigating back and forth.
- **Pagination & Scroll**: Handled via `useInfiniteQuery` for clean, windowed data fetching.

### 2. Client State (Redux Toolkit)
Local user choices that require synchronous updates are stored in a centralized Redux store:
- **Cart & Wishlist**: Instantly update badge counters and trigger notification alerts without delay.
- **Selectors**: Encapsulates price calculation and quantity aggregation (e.g. `selectCartTotal`) to prevent redundant renders.

---

## ✨ Key Technical & UX Implementations

### 1. Automatic Local Storage Middleware
To deliver an expected, real-world user experience, cart and wishlist modifications persist across page refreshes. Rather than manually writing boilerplate storage setters inside components, we implemented a custom Redux middleware (`localStorageMiddleware`) in `store.ts`. It subscribes to store events and serializes specific state updates silently in the background.

### 2. Portal-Based Modal HOC (`ModalHOC`)
Modals (such as the Filter & Sort sidebar) are injected directly into `document.body` using a Higher-Order Component and React Portals. This resolves rendering bugs like nested overflow clipping (`overflow: hidden`), manages background scroll-locking when active, and includes accessibility features like Escape key dismissal.

### 3. Sparse List Loop Protection
Infinite scrolling listings can trigger infinite network request loops if active filter conditions decrease the visible items list below the client viewport height (since the scroll observer is constantly exposed to the viewport). 
We resolved this by implementing **Loop Protection** in `AllProducts.tsx`:
- Standard IntersectionObserver queries are disabled when filters are active.
- If more pages exist on the server under the active filter query, the UI swaps out the observer and renders a manual **"Load More Products to Filter"** button.

### 4. Interactive Image Carousel & Magnifier
The product gallery inside `ProductDetails` supports:
- Thumbnail selectors, dot indices, and arrow actions.
- Keyboard-bound controls (Left/Right arrows).
- A custom **image magnifier** hook (`useImageZoom`) that calculates coordinates on mouse hover to apply smooth CSS matrix zoom scaling, preserving pixel clarity.
- **Render-phase resetting**: We avoid redundant renders by resetting the carousel indices during the render phase rather than in a synchronous `useEffect`, addressing React's warning against cascading effect updates.

### 5. Cross-Tab / Cross-Component Recents Sync
The **Recently Viewed** product section uses a specialized hook (`useRecentlyViewed`) that listens to custom window storage events. If a user opens different tabs or views products in another section, the list updates in real-time across all active components.

---

## 🎯 Architectural Decisions & Future Roadmap

### Priority Design Decisions
1. **Vanilla CSS variables**: Utilized a modern, clean CSS variables architecture for theme options. This ensures fast rendering with zero CSS-in-JS runtimes or build steps.
2. **Defensive Layout Skeletons**: Standardized shimmer placeholders are utilized across the entire catalog and details pages to prevent content layout shifts during slower API calls.
3. **Strict TypeScript Compliance**: Avoided wildcard types (`any`). All data objects, API payloads, custom hooks, and Redux actions are strictly typed.

### If Given More Time
1. **Real-time Inventory & Price Updates via WebSockets**: Connect to a WebSocket server to push live stock changes — if a product goes out of stock while the user is browsing, the UI updates instantly without a refresh. Badge the product card with "Only 2 left" in real time.
2. **Optimistic Cart Updates**: Use React Query's `onMutate` + `onError` rollback pattern so add-to-cart, quantity changes, and removals feel instant. No loading spinners on the cart — just immediate feedback with silent background sync.
3. **Prefetching on Hover**: Use `queryClient.prefetchQuery` on product card hover so by the time the user clicks, the product detail page data is already in cache. Near-instant page transitions.
4. **E2E & Component Tests**: Set up a comprehensive unit/integration test suite using Vitest + React Testing Library for custom hooks and Redux reducers, combined with Playwright for drawers and filters.
5. **Advanced Analytics Dashboard**: Add active cart funnel tracking and heat-maps of clicked categories directly inside the admin panel dashboard.
6. **SSR Optimization**: Transition to Next.js App Router to perform server-side rendering on product details pages to optimize SEO meta tag delivery.

---

## 🌐 Deployment

Since this is a static SPA (Single Page Application), it can be deployed for free on several platforms.

### Option 1: Vercel (Recommended)
1. Sign in to [Vercel](https://vercel.com/) using your GitHub account.
2. Click **Add New** > **Project**.
3. Import the `sales-handy-assign` repository.
4. Vercel will automatically detect **Vite** as the framework.
5. Keep default settings (Build command: `tsc -b && vite build`, Output directory: `dist`).
6. Click **Deploy**. Vercel will configure CD (Continuous Delivery) so any future commits pushed to `main` will automatically trigger a new deployment.
> **Note**: We have included `vercel.json` in the root of the project to ensure that client-side SPA routing (React Router) works seamlessly when pages are refreshed.

### Option 2: Netlify
1. Log in to [Netlify](https://www.netlify.com/).
2. Select **Add new site** > **Import an existing project**.
3. Connect your GitHub account and choose the `sales-handy-assign` repository.
4. Configure site settings (Build command: `npm run build`, Publish directory: `dist`).
5. Click **Deploy Site**.
> **Note**: We have included `netlify.toml` in the root of the project to ensure client-side route fallback handles page refreshes.

### Option 3: GitHub Pages
To deploy to GitHub Pages:
1. Install the GitHub Pages deployment helper:
   ```bash
   npm install --save-dev gh-pages
   ```
2. Open `package.json` and add a `homepage` property:
   ```json
   "homepage": "https://<your-username>.github.io/sales-handy-assign",
   ```
3. Add deploy scripts to your `package.json` scripts block:
   ```json
   "predeploy": "npm run build",
   "deploy": "gh-pages -d dist"
   ```
4. Run `npm run deploy`.

