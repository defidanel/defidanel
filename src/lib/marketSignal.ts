export type MarketListing = {
  title: string
  price: number
  currency: string
  condition?: string
  url?: string
}

// A normalized snapshot of ACTIVE eBay supply for one query. This is the raw
// material a "buy strength" score would consume — asking prices and how many
// copies are currently offered, NOT sold-comp data (see api/ebay.js).
export type MarketSignal = {
  query: string
  /** eBay's reported total matches (can exceed the sampled listings). */
  total: number
  /** Number of listings actually sampled and priced in this snapshot. */
  sampled: number
  currency: string
  priceLow: number
  priceHigh: number
  priceMedian: number
  listings: MarketListing[]
}

export class MarketSignalUnavailableError extends Error {}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

function median(sortedAsc: number[]): number {
  const n = sortedAsc.length
  if (n === 0) return 0
  const mid = Math.floor(n / 2)
  return n % 2 === 0 ? (sortedAsc[mid - 1] + sortedAsc[mid]) / 2 : sortedAsc[mid]
}

function parseListing(raw: unknown): MarketListing | null {
  if (!isRecord(raw)) return null
  const price = typeof raw.price === 'number' ? raw.price : Number(raw.price)
  if (!Number.isFinite(price)) return null
  return {
    title: typeof raw.title === 'string' ? raw.title : '',
    price,
    currency: typeof raw.currency === 'string' ? raw.currency : 'USD',
    condition: typeof raw.condition === 'string' ? raw.condition : undefined,
    url: typeof raw.url === 'string' ? raw.url : undefined,
  }
}

// category: eBay category id. Sports Mem/Cards = 212, Collectible Card Games
// (Pokémon singles) = 183454. Passed through to narrow the search.
export async function fetchMarketSignal(query: string, category?: string): Promise<MarketSignal> {
  const params = new URLSearchParams({ q: query })
  if (category) params.set('category', category)

  const res = await fetch(`/api/ebay?${params.toString()}`)

  if (res.status === 501) {
    const body = await res.json().catch(() => null)
    throw new MarketSignalUnavailableError(
      (isRecord(body) && typeof body.message === 'string' && body.message) ||
        'Live eBay supply is not configured on this deployment.',
    )
  }

  if (!res.ok) {
    throw new Error(`eBay supply lookup failed (${res.status})`)
  }

  let data: unknown
  try {
    data = await res.json()
  } catch {
    // Most likely /api/ebay isn't served at all (plain `vite dev`, or a static
    // host with no serverless backend) and this response is HTML.
    throw new MarketSignalUnavailableError(
      'No API backend responded at /api/ebay on this deployment.',
    )
  }

  const rawListings = isRecord(data) && Array.isArray(data.listings) ? data.listings : []
  const listings = rawListings
    .map(parseListing)
    .filter((l): l is MarketListing => l !== null)
    .sort((a, b) => a.price - b.price)

  const prices = listings.map((l) => l.price)

  return {
    query,
    total: isRecord(data) && typeof data.total === 'number' ? data.total : listings.length,
    sampled: listings.length,
    currency: listings[0]?.currency ?? 'USD',
    priceLow: prices[0] ?? 0,
    priceHigh: prices[prices.length - 1] ?? 0,
    priceMedian: median(prices),
    listings,
  }
}
