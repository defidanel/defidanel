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
  eBay sold-listings / PriceCharting searches, plus two optional live lookups:
  a PriceCharting price index and an eBay active-supply signal (see below).
- **Risk & Asset Class** — a risk taxonomy, a comparison to other alternative
  assets, portfolio allocation considerations, and authenticity red flags.
- **ROI Calculator** — an interactive tool that computes the expected value of
  grading a card given your own value/probability estimates per grade outcome.
- **Arb Scanner** — a friction-adjusted arbitrage evaluator for tokenized-card
  markets (Collector Crypt, Phygitals): enter a token price and the exact-match
  physical sold comp, and it computes whether the token is actually cheaper than
  the physical card after every round-trip cost (vault withdrawal, resale fees,
  shipping), with a verdict, breakeven, and max bid (see below).
- **Glossary** — searchable reference of terms used throughout.

All prices, population figures, and chart data in the app are illustrative
examples, not live market data. This is an educational reference, not
financial advice.

## Stack

React + TypeScript, Vite, Tailwind CSS v4, React Router, Recharts. `api/`
holds Vercel serverless functions (plain Node, no framework) — everything
else is a static SPA.

## Development

```bash
npm install
npm run dev       # start dev server
npm run build     # typecheck + production build
npm run lint      # oxlint
```

`npm run dev` only serves the Vite frontend, so the `/api/*` functions aren't
reachable that way — the "Fetch live prices" and "Fetch active eBay supply"
buttons show the "unavailable" state locally unless you run it through the
Vercel CLI's `vercel dev` (which serves both the SPA and the `api/` functions
together) or test it after deploying.

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

## Enabling the live eBay supply signal (optional)

The "Fetch active eBay supply" button on the Pricing page reads **current
active listings** — how many copies of an exact card/grade are for sale right
now and the asking-price spread. This is a *liquidity* signal, not sold data:
a card with many active listings is easy to exit; one with one or two is a
thin market where your entry price is hard to trust.

> **Important:** this is **active listings only**. eBay's sold-comp API
> (Marketplace Insights) is a closed, partner-only program that rejects most
> applicants — so active supply is what a normal developer key can read.
> Asking prices sit above real sale prices; always confirm against sold comps.

1. Create an application at https://developer.ebay.com/ and grab your
   **Production** keyset: App ID (Client ID) and Cert ID (Client Secret).
2. As with the PriceCharting key, these are read **server-side only**, inside
   `api/ebay.js`, via `process.env.EBAY_CLIENT_ID` / `EBAY_CLIENT_SECRET` —
   never expose them in frontend code or a `VITE_`-prefixed variable. The
   proxy mints an OAuth application token (client-credentials flow, no user
   login) and caches it across warm invocations.
3. On Vercel, add `EBAY_CLIENT_ID` and `EBAY_CLIENT_SECRET` under Project
   Settings → Environment Variables and redeploy.
4. For local testing, add them to `.env.local` and run `vercel dev`.

The `MarketSignal` shape returned by `src/lib/marketSignal.ts` (total, sampled
count, low/median/high asking price, sampled listings) is deliberately generic
— it's the intended input to a future "buy strength" score that combines
scarcity (print run + population) with liquidity (this signal).

## Arb Scanner & the Collector Crypt proxy

The Arb Scanner (`/arb`) evaluates whether a tokenized card (Collector Crypt,
Phygitals, etc.) is genuinely cheaper than the physical card after every
round-trip cost. **The core math works with zero setup** — enter a token price
and the exact-match physical sold comp, and `src/lib/arbScanner.ts`'s
`evaluateArb()` returns the net edge, breakeven token price, a target-margin max
bid, and a buy/thin/pass verdict. Default friction: 2% vault withdrawal
(Collector Crypt), ~13% eBay resale fee, plus shipping both ways — all tunable
in the UI.

The optional **"Fetch listings"** button pulls live token listings through
`api/collectorcrypt.js`. That proxy is a **scaffold**, not a finished
integration:

> ⚠️ The exact Collector Crypt endpoint, query params, auth scheme, and response
> shape were **not** confirmed against the live docs — that site is unreachable
> from the build environment. Before this button works you must, from
> https://docs.collectorcrypt.com/marketplace/api:
> 1. Set `COLLECTORCRYPT_API_BASE` (and `COLLECTORCRYPT_API_KEY` if required).
> 2. Replace the `/v1/marketplace/listings` path + `search`/`limit` params in
>    `api/collectorcrypt.js` with the real listings/search endpoint.
> 3. Confirm the auth header (the scaffold sends `Authorization: Bearer`).
>
> The client (`parseTokenListing`) reads fields defensively (`price`/`ask`,
> `name`/`title`, etc.), so it tolerates a range of shapes — but verify against
> a real response once you have access. Until wired, the button shows a
> "not configured" notice and the manual inputs carry the tool.

**This is the StrongBuy thesis in code:** token markets are immature (<1% of the
hobby) and price with latency, so tokens sit above *and* below physical value.
The scanner turns "is this stale offer a real deal?" into a friction-adjusted
number — but it is only as good as the exact-match physical comp you feed it
(same set, card number, grader, grade). It's an educational decision-support
tool, not financial advice; tokenized markets carry platform, smart-contract,
and liquidity risk.
