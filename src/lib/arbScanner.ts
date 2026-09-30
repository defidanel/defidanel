// Cross-market arbitrage signal for tokenized cards (Collector Crypt / Phygitals)
// vs the physical market (eBay/PriceCharting sold comps).
//
// The edge is REAL but friction-sensitive: a token is only a buy when its price
// is below the physical comp NET of every round-trip cost. This models the
// robust "redeem-to-physical" path (the valuation floor); a token-to-token flip
// has lower friction (~platform fee only) but needs a live higher token bid, so
// it's an upside, not the anchor.

export type ArbFriction = {
  /** Vault withdrawal fee to redeem the token, as a fraction of insured value. */
  vaultWithdrawalPct: number
  /** Flat cost to ship the redeemed card out of the vault to you (USD). */
  redemptionShipping: number
  /** Marketplace seller fees to resell the physical (eBay ~0.13), as a fraction. */
  resaleFeePct: number
  /** Flat cost to ship the physical to your buyer (USD). */
  resaleShipping: number
}

// Defaults sourced from platform docs (Collector Crypt: 2% vault withdrawal) and
// typical eBay seller economics (~13% + shipping). Tune per platform/category.
export const DEFAULT_FRICTION: ArbFriction = {
  vaultWithdrawalPct: 0.02,
  redemptionShipping: 20,
  resaleFeePct: 0.13,
  resaleShipping: 15,
}

export type ArbVerdict = 'buy' | 'thin' | 'pass'

export type ArbResult = {
  /** Net profit if you buy the token, redeem, and resell the physical. */
  edge: number
  /** Edge as a fraction of the token price paid. */
  edgePct: number
  /** The most you can pay for the token and still break even after all friction. */
  breakevenTokenPrice: number
  /** Recommended max bid to hit the requested margin. */
  maxBidForMargin: number
  verdict: ArbVerdict
  breakdown: {
    tokenCost: number
    withdrawalFee: number
    redemptionShipping: number
    resaleProceeds: number // physical comp net of resale fee + shipping
    totalFriction: number
  }
}

export type EvaluateOptions = {
  friction?: Partial<ArbFriction>
  /** Minimum edge fraction (of token price) to call it a clean "buy". Default 8%. */
  buyThresholdPct?: number
  /** Target margin fraction used for the recommended max bid. Default 15%. */
  targetMarginPct?: number
}

function clampNonNeg(n: number): number {
  return Number.isFinite(n) && n > 0 ? n : 0
}

/**
 * Evaluate a single token listing against its exact-match physical comp.
 *
 * IMPORTANT: physicalComp must be the sold comp for the EXACT card — same set,
 * card number, grader, and grade. Mispricing runs both ways on token markets
 * (a reprint priced like the original looks "cheap" but isn't), so the comp
 * discipline is what makes this signal safe.
 */
export function evaluateArb(
  tokenPrice: number,
  physicalComp: number,
  options: EvaluateOptions = {},
): ArbResult {
  const f = { ...DEFAULT_FRICTION, ...(options.friction ?? {}) }
  const buyThresholdPct = options.buyThresholdPct ?? 0.08
  const targetMarginPct = options.targetMarginPct ?? 0.15

  const tp = clampNonNeg(tokenPrice)
  const pc = clampNonNeg(physicalComp)

  const withdrawalFee = pc * f.vaultWithdrawalPct
  const resaleProceeds = pc * (1 - f.resaleFeePct) - f.resaleShipping
  const totalFriction = withdrawalFee + f.redemptionShipping + f.resaleShipping + pc * f.resaleFeePct

  // Net proceeds after redeeming and reselling, minus what you paid for the token.
  const edge = resaleProceeds - withdrawalFee - f.redemptionShipping - tp
  const edgePct = tp > 0 ? edge / tp : 0

  // The token price at which edge == 0.
  const breakevenTokenPrice = resaleProceeds - withdrawalFee - f.redemptionShipping
  // The most to bid to still clear the target margin on the token outlay.
  const maxBidForMargin = breakevenTokenPrice / (1 + targetMarginPct)

  let verdict: ArbVerdict
  if (edge > 0 && edgePct >= buyThresholdPct) verdict = 'buy'
  else if (edge > 0) verdict = 'thin'
  else verdict = 'pass'

  return {
    edge,
    edgePct,
    breakevenTokenPrice,
    maxBidForMargin,
    verdict,
    breakdown: {
      tokenCost: tp,
      withdrawalFee,
      redemptionShipping: f.redemptionShipping,
      resaleProceeds,
      totalFriction,
    },
  }
}

// ---- Collector Crypt listing normalization (schema-flexible) ----
// The exact API response shape isn't pinned here (fill in from
// docs.collectorcrypt.com); this reads the fields defensively so the client
// renders whatever the proxy returns.

export type TokenListing = {
  id: string
  name: string
  grade?: string
  price: number
  currency: string
  url?: string
}

function isRecord(v: unknown): v is Record<string, unknown> {
  return typeof v === 'object' && v !== null
}

function firstNumber(obj: Record<string, unknown>, keys: string[]): number | null {
  for (const k of keys) {
    const v = obj[k]
    const n = typeof v === 'number' ? v : Number(v)
    if (Number.isFinite(n) && n > 0) return n
  }
  return null
}

function firstString(obj: Record<string, unknown>, keys: string[]): string | undefined {
  for (const k of keys) {
    const v = obj[k]
    if (typeof v === 'string' && v) return v
  }
  return undefined
}

export function parseTokenListing(raw: unknown): TokenListing | null {
  if (!isRecord(raw)) return null
  const price = firstNumber(raw, ['price', 'listPrice', 'ask', 'priceUsd', 'usdPrice'])
  if (price === null) return null
  return {
    id: firstString(raw, ['id', 'mint', 'tokenId', 'assetId']) ?? String(raw.id ?? ''),
    name: firstString(raw, ['name', 'title', 'cardName']) ?? 'Untitled token',
    grade: firstString(raw, ['grade', 'gradeLabel', 'condition']),
    price,
    currency: firstString(raw, ['currency', 'unit']) ?? 'USD',
    url: firstString(raw, ['url', 'permalink', 'link']),
  }
}
