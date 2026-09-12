# CoffeScan

> Un menu numérique pour cafés — premium, mobile-first, pensé pour un accès par QR-code.

CoffeScan turns a coffee shop's menu into a fast, beautiful mobile experience.
Instead of a long scrolling page, guests land on an interactive discovery screen
with organic category bubbles, and expand any bubble into that category's full
product sheet.

## Highlights

- **Bubble discovery** — categories as organic, seeded blob shapes (deterministic,
  stable across renders) with varied size, tilt, and silhouette. No two cafés feel alike.
- **Category sheets** — tapping a bubble expands it into a full-screen sheet that
  zooms from the tapped bubble (CSS `transform-origin`), with staggered product cards.
- **Deep-link friendly** — each category is addressable (`#c-coffee`) so browser back,
  refresh, and sharing a link all restore the right sheet.
- **French-first** — UI copy, product names, and prices in French, locale `fr-TN`,
  prices rendered in Tunisian dinars with three fraction digits (e.g. `2,200 DT`).
- **QR-optimized** — zero friction for a phone's first visit: tiny hero, no horizontal
  overflow, one-handed layout, reduced-motion support, full keyboard/AT
  accessibility (focus return, `Escape` to close, `aria` dialogs).
- **Lightweight by design** — no CSS framework, no runtime image dependencies.
  Products are rendered as gradient art unless an optional `image` URL is provided.

## Tech stack

| Layer      | Choice                              |
| ---------- | ----------------------------------- |
| Framework  | Next.js 16 (App Router, Turbopack)  |
| UI         | React 19                            |
| Language   | TypeScript (strict)                 |
| Styling    | Plain CSS modules-free `globals.css` using design tokens |
| Fonts      | Fraunces + Inter (`next/font`, self-hosted) |

## Getting started

```bash
npm install        # install dependencies
npm run dev        # start the dev server on http://localhost:3000
npm run build      # production build
npm run start      # serve the production build
npm run lint       # eslint
npm run typecheck  # tsc --noEmit
```

## Project structure

```
frontend/
├── public/                 # icons + PWA manifest (fr)
├── src/
│   ├── app/                # layout, metadata, page, globals.css
│   ├── components/
│   │   ├── layout/         # Header, Footer, BackToTop
│   │   └── menu/           # BrandIntro, bubbles, sheet, item cards…
│   ├── config/             # site metadata
│   ├── data/menu.ts        # ← the menu itself (categories, items, prices)
│   ├── i18n/               # typed Dictionary + French strings
│   ├── lib/                # blob geometry/layout, price formatting, utils
│   └── types/menu.ts       # Menu / Category / Item / Price types
└── package.json
```

## Customizing the menu

Everything is data-driven from `src/data/menu.ts`.

- **Prices** are stored in the smallest currency unit (millimes): `price: { value: 220 }`
  renders as `2,200 DT`. TND always uses three fraction digits; other currencies fall
  back to two.
- **Categories** accept an optional `size` (`xl | lg | md | sm`) that controls the
  relative width/aspect of their bubble. The row layout packs them greedily, so a menu
  will re-flow naturally when you add or resize categories.
- **Products** take `name`, `description`, `price`, optional `image`, `accent`,
  `tags` (`Populaire`, `Nouveau`, `Végan`, …) and `featured`. Without an `image` the
  item renders as a gradient placeholder using its accent color.
- **Copy** lives in `src/i18n/fr.ts` (typography-agnostic keys), and the brand/tagline
  in `src/config/site.ts`.

> Run `npm run lint` and `npm run typecheck` before pushing changes.

## License

Private — © CoffeScan.