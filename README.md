# MENU SCAN — Frontend

> Un menu numérique pour cafés — premium, mobile-first, pensé pour un accès par QR-code.

**MENU SCAN** turns a coffee shop's menu into a fast, beautiful mobile experience.
It is a multi-tenant platform: every coffee shop gets its own public page
(`https://menuscan.vercel.app/menuscan/:slug`) served from the MENU SCAN backend API.
Instead of a long scrolling page, guests land on an interactive discovery screen
with organic category bubbles, and follow any bubble to that category's dedicated
items page.

## Highlights

- **Single namespace** — everything lives under `/menuscan`: the brand landing
  (`/menuscan`), a coffee's public menu (`/menuscan/[slug]`) and its category items
  pages (`/menuscan/[slug]/[categName]`), plus the backoffice (`/menuscan/admin` and
  `/menuscan/[slug]/admin`). Legacy `/:coffeeSlug` links redirect to the new routes.
- **Bubble discovery** — categories as organic, seeded blob shapes (deterministic,
  stable across renders) with varied size, tilt, and silhouette. No two cafés feel alike.
- **Category pages** — following a bubble opens that category's full item page,
  resolvable by slugified category name strictly within the owning coffee; unknown
  coffees or categories are clean 404s.
- **Deep-link friendly** — every coffee (`/menuscan/:slug`) and category
  (`/menuscan/:slug/:categName`) is addressable directly, so sharing a link and refresh
  always land on the exact view.
- **French-first** — UI copy in French, locale `fr-TN`, prices rendered in Tunisian
  dinars with three fraction digits (e.g. `2,200 DT`).
- **QR-optimized** — zero friction for a phone's first visit: tiny hero, no horizontal
  overflow, one-handed layout, reduced-motion support, full keyboard/AT
  accessibility.
- **Lightweight by design** — no CSS framework, no runtime image dependencies.
  Products are rendered as gradient art unless an optional `image` URL is provided.
- **Backoffice** — app admins manage all coffees; a coffee admin manages their own
  shop's info, categories and items (PIN-gated, short-lived bearer tokens).

## Tech stack

| Layer      | Choice                              |
| ---------- | ----------------------------------- |
| Framework  | Next.js 16 (App Router, Turbopack)  |
| UI         | React 19                            |
| Language   | TypeScript (strict)                 |
| Styling    | Plain CSS modules-free `globals.css` using design tokens |
| Fonts      | Fraunces + Inter (`next/font`, self-hosted) |
| API        | MENU SCAN backend (`/api/v1`, success + error envelopes) |

## Getting started

```bash
npm install        # install dependencies
npm run dev        # start the dev server on http://localhost:3000
npm run build      # production build
npm run start      # serve the production build
npm run lint       # eslint
npm run typecheck  # tsc --noEmit
```

### Environment

| Variable | Default | Description |
| --- | --- | --- |
| `BACKEND_API_URL` | `http://localhost:4000` | The MENU SCAN backend origin, server-only. Proxies `/api/v1/*` through the Next origin and drives server-side data fetching (see `src/config/api.ts` + `next.config.ts`) |

## Project structure

```
frontend/
├── public/                 # icons + PWA manifest (fr)
└── src/
        ├── app/
        │   ├── layout.tsx      # root layout, fonts, metadata
        │   └── menuscan/       # brand landing + [slug] menu/[categName] pages + admin backoffice
        ├── components/
        │   ├── layout/         # Header, Footer, BackToTop
        │   └── menu/           # BrandIntro, bubble links, item cards…
    ├── config/             # site metadata + API base URL
    ├── i18n/               # typed Dictionary + French strings
    ├── lib/                # api client, admin-session, blob geometry/layout, price formatting, adapters
    └── types/              # menu.ts (presentation) + backend.ts (API DTOs)
```

Request paths mirror the backend API (see `backend/ROUTES.md`): public menu via
`/api/v1/coffees/:coffeeSlug` and `/api/v1/categories/:categoryId/items`, backoffice
under `/api/v1/admin/...`. The client lives in `src/lib/api.ts`; API DTOs are mirrored
verbatim in `src/types/backend.ts`.

## Data model

The menu is **not** hard-coded — it comes from the backend for each coffee:

- **Prices** are decimal numbers (e.g. `2.5` TND), stored and displayed as-is.
  `formatPrice` (in `src/lib/menu.ts`) renders them with `Intl.NumberFormat`; TND
  always uses three fraction digits, other currencies two.
- **Categories** carry an optional `icon` emoji and an `accent` color that drives the
  bubble visuals and row layout (`CATEGORY_WEIGHT`, `CATEGORY_ASPECT` in
  `src/lib/blob.ts`).
- **Items** take `name`, `description`, `price`, optional `image` and an `accent`
  seed for the gradient placeholder when no image is provided.
- **Copy** lives in `src/i18n/fr.ts` (typography-agnostic keys), and the brand/tagline
  in `src/config/site.ts`.

> Run `npm run lint` and `npm run typecheck` before pushing changes.

## License

Private — © MenuScan.