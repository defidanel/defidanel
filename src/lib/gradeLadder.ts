import type { PriceChartingProduct } from './priceCharting'

// A single rung of the comp ladder: one grade and its market value.
export type GradeRung = {
  key: GradeKey
  label: string
  // PriceCharting API field this grade maps to for trading cards (see note).
  pcField: string
  // Market value in dollars — from PriceCharting, or manually entered. null = unknown.
  market: number | null
}

export type GradeKey = 'raw' | 'g7' | 'g8' | 'g9' | 'g95' | 'psa10'

// PriceCharting reuses its video-game price field names for trading cards.
// The documented mapping for graded cards is:
//   loose-price        → Ungraded
//   cib-price          → Grade 7
//   new-price          → Grade 8
//   graded-price       → Grade 9
//   box-only-price     → Grade 9.5
//   manual-only-price  → PSA 10
// (BGS 10 / CGC 10 / SGC 10 live in bgs-10-price / condition-17-price /
// condition-18-price.) This mapping is stable for cards but SHOULD be
// re-confirmed against a live API response once a key is wired — the build
// environment can't reach pricecharting.com to verify it (see README).
export const GRADE_LADDER: readonly Omit<GradeRung, 'market'>[] = [
  { key: 'raw', label: 'Ungraded', pcField: 'loose-price' },
  { key: 'g7', label: 'PSA 7', pcField: 'cib-price' },
  { key: 'g8', label: 'PSA 8', pcField: 'new-price' },
  { key: 'g9', label: 'PSA 9', pcField: 'graded-price' },
  { key: 'g95', label: 'Grade 9.5', pcField: 'box-only-price' },
  { key: 'psa10', label: 'PSA 10', pcField: 'manual-only-price' },
] as const

// Build a full ladder, filling market values from a PriceCharting product where
// its known card fields are present (and > 0), leaving the rest null.
export function ladderFromProduct(product: PriceChartingProduct): GradeRung[] {
  return GRADE_LADDER.map((rung) => {
    const v = product.prices[rung.pcField]
    return { ...rung, market: typeof v === 'number' && v > 0 ? v : null }
  })
}

export function emptyLadder(): GradeRung[] {
  return GRADE_LADDER.map((rung) => ({ ...rung, market: null }))
}

// Round to a sensible increment for the price band so offers look like real
// offers ($5 steps under $1k, $25 under $10k, $100 above).
export function roundOffer(n: number): number {
  const step = n < 1000 ? 5 : n < 10000 ? 25 : 100
  return Math.round(n / step) * step
}

// A disciplined offer is a touch under the sold/market value; the walk-away is
// at market (never chase above sold on a liquid card). Both tunable via the
// discount the caller passes.
export function suggestOffer(market: number, discountPct: number): number {
  return roundOffer(market * (1 - discountPct / 100))
}

// Multiple of this rung's value versus a chosen anchor rung.
export function multipleVs(market: number | null, anchor: number | null): number | null {
  if (market === null || anchor === null || anchor <= 0) return null
  return market / anchor
}
