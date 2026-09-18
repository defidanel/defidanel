export type PriceChartingEntry = { label: string; amount: number }

export type PriceChartingProduct = {
  id: string
  name: string
  consoleName?: string
  entries: PriceChartingEntry[]
}

export class PriceChartingUnavailableError extends Error {}

function humanizeLabel(key: string) {
  return key
    .replace(/-price$/, '')
    .replace(/-/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase())
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

// Deliberately schema-flexible: renders whatever "*-price" fields the API
// returns rather than assuming fixed grade buckets, since the exact field
// names for trading cards vs. other product types aren't pinned down here.
function parseProduct(raw: unknown): PriceChartingProduct | null {
  if (!isRecord(raw)) return null

  const entries: PriceChartingEntry[] = Object.entries(raw)
    .filter(
      (entry): entry is [string, number] =>
        entry[0].endsWith('-price') && typeof entry[1] === 'number' && entry[1] > 0,
    )
    .map(([key, cents]) => ({ label: humanizeLabel(key), amount: cents / 100 }))

  return {
    id: typeof raw.id === 'string' ? raw.id : String(raw.id ?? ''),
    name: typeof raw['product-name'] === 'string' ? raw['product-name'] : 'Unknown product',
    consoleName: typeof raw['console-name'] === 'string' ? raw['console-name'] : undefined,
    entries,
  }
}

export async function searchPriceCharting(query: string): Promise<PriceChartingProduct[]> {
  const res = await fetch(`/api/pricecharting?q=${encodeURIComponent(query)}`)

  if (res.status === 501) {
    const body = await res.json().catch(() => null)
    throw new PriceChartingUnavailableError(
      (isRecord(body) && typeof body.message === 'string' && body.message) ||
        'Live pricing is not configured on this deployment.',
    )
  }

  if (!res.ok) {
    throw new Error(`PriceCharting lookup failed (${res.status})`)
  }

  let data: unknown
  try {
    data = await res.json()
  } catch {
    // Most likely /api/pricecharting isn't served at all (e.g. plain `vite
    // dev`, or a static host with no serverless backend) and this is HTML.
    throw new PriceChartingUnavailableError(
      'No API backend responded at /api/pricecharting on this deployment.',
    )
  }
  const list = isRecord(data)
    ? Array.isArray(data.products)
      ? data.products
      : data.product
        ? [data.product]
        : []
    : []

  return list.map(parseProduct).filter((p): p is PriceChartingProduct => p !== null && p.entries.length > 0)
}
