# CakeShop Frontend

Vite + React + Tailwind v4 + lucide-react frontend for the CakeShop cake e-commerce platform.

## Prerequisites
- Node.js 18+
- The CakeShop backend running on `http://localhost:8080` (see `backend/README.md`)

## Setup

```bash
npm install
cp .env.example .env   # adjust VITE_API_BASE_URL if your backend runs elsewhere
```

## Run

```bash
npm run dev
```

Opens on **http://localhost:5173**.

## Build

```bash
npm run build   # outputs to dist/
npm run preview # serve the production build locally
```

## Structure

- `src/pages/auth` — login, register (vendor/customer toggle)
- `src/pages/profile` — shared view/edit profile page (role-aware fields)
- `src/pages/vendor` — product list (search/sort/filter), add/edit product, category & subcategory manager
- `src/pages/customer` — catalog, product detail + cake customization, cart, checkout, orders, public vendor profile
- `src/pages/admin` — pending product approvals, vendor/customer directory
- `src/layouts` — `MainLayout` (global nav) plus per-role dashboard shells (`VendorLayout`, `CustomerLayout`, `AdminLayout`)
- `src/context` — `AuthContext` (memory-only JWT — refreshing the page logs you out by design) and `CartContext`
- `src/services` — one file per backend resource, all built on a shared axios instance in `services/api.js`

## Notes

- JWT is kept in memory only (not localStorage), per the original spec — a page refresh clears
  the session and returns you to the login page.
- The category/subcategory filter dropdowns on the customer catalog are derived client-side
  from a broad product browse call, since category/subcategory listing is only exposed under
  vendor-only backend routes. Fine at small catalog sizes; consider adding a public taxonomy
  endpoint if the catalog grows.
- Editing a vendor product resets its status to `PENDING` (backend behavior) so it re-enters
  the admin approval queue.
