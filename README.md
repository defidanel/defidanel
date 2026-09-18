# Slab & Set

A knowledge base for Pokémon and sports card collectors covering grading systems,
rarity mechanics, market dynamics, price-comp reading, and the risk profile of
treating cards as an alternative asset class — plus an interactive grading ROI
calculator.

## Contents

- **Grading** — PSA/BGS/CGC/SGC scales, what separates a 9 from a 10, population
  reports, and the economics of submitting a card.
- **Rarity** — Pokémon rarity symbols/eras and sports card parallels, inserts,
  and serial numbering.
- **Market Dynamics** — supply/demand framework, population growth over time,
  hype cycles, and how sealed product feeds the singles market.
- **Pricing** — where price data comes from, why guides lag reality, a
  checklist for reading comps, and a comp-lookup tool that opens pre-filled
  eBay sold-listings / PriceCharting searches, plus an optional live
  PriceCharting API lookup (see below).
- **Risk & Asset Class** — a risk taxonomy, a comparison to other alternative
  assets, portfolio allocation considerations, and authenticity red flags.
- **ROI Calculator** — an interactive tool that computes the expected value of
  grading a card given your own value/probability estimates per grade outcome.
- **Glossary** — searchable reference of terms used throughout.

All prices, population figures, and chart data in the app are illustrative
examples, not live market data. This is an educational reference, not
financial advice.

## Stack

React + TypeScript, Vite, Tailwind CSS v4, React Router, Recharts. `api/` is a
single Vercel serverless function (plain Node, no framework) — everything
else is a static SPA.

## Development

```bash
npm install
npm run dev       # start dev server
npm run build     # typecheck + production build
npm run lint      # oxlint
```

`npm run dev` only serves the Vite frontend, so `/api/pricecharting` isn't
reachable that way — the "Fetch live prices" button will show the
"unavailable" state locally unless you run it through the Vercel CLI's
`vercel dev` (which serves both the SPA and the `api/` function together) or
test it after deploying.

## Enabling live PriceCharting data (optional)

The Pricing page's comp-lookup tool always works via the two "search" buttons
(they just open eBay/PriceCharting/SportsCardsPro in a new tab). The third
button, "Fetch live prices," calls the real PriceCharting API and is
optional — the app degrades gracefully without it.

1. Get an API token from PriceCharting's API program:
   https://www.pricecharting.com/api-documentation
2. **Never put the key in frontend code or an env var prefixed `VITE_`** —
   anything with that prefix (or anything referenced from `src/`) ships to
   every visitor's browser. The key is read server-side only, inside
   `api/pricecharting.js`, via `process.env.PRICECHARTING_API_KEY`.
3. Deploy this repo to Vercel (zero-config for a Vite app + `api/` function),
   then add `PRICECHARTING_API_KEY` under Project Settings → Environment
   Variables and redeploy.
4. For local testing, copy `.env.example` to `.env.local`, fill in the key,
   and run `vercel dev` instead of `npm run dev`.

The client renders whatever fields the API returns that end in `-price`
(converted from cents), rather than assuming a fixed set of grade buckets —
confirm the exact response shape for trading-card products against
PriceCharting's current docs once you have a key, since it wasn't possible to
inspect a live response while building this (this environment's network
policy blocks outbound requests to pricecharting.com).

If you deploy to a host other than Vercel, port `api/pricecharting.js` to
that platform's serverless/edge function convention — the SPA itself is
static and works anywhere.
