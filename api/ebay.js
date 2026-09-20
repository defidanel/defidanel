// Serverless proxy for the eBay Browse API (Vercel Node function convention).
//
// Returns ACTIVE listings (asking prices + live supply), NOT sold comps —
// eBay's sold-data API (Marketplace Insights) is a closed, partner-only
// program, so active supply is the signal a normal developer key can read.
//
// Keeps EBAY_CLIENT_ID / EBAY_CLIENT_SECRET server-side: a static SPA has
// nowhere safe to hold a secret, and the OAuth token is minted here.

const OAUTH_URL = 'https://api.ebay.com/identity/v1/oauth2/token'
const BROWSE_URL = 'https://api.ebay.com/buy/browse/v1/item_summary/search'
const SCOPE = 'https://api.ebay.com/oauth/api_scope'

// Cached across warm invocations; refetched on cold start or expiry.
let tokenCache = { token: '', expiresAt: 0 }

async function getAppToken(clientId, clientSecret) {
  const now = Date.now()
  if (tokenCache.token && tokenCache.expiresAt > now + 60_000) {
    return tokenCache.token
  }

  const basic = Buffer.from(`${clientId}:${clientSecret}`).toString('base64')
  const res = await fetch(OAUTH_URL, {
    method: 'POST',
    headers: {
      Authorization: `Basic ${basic}`,
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: `grant_type=client_credentials&scope=${encodeURIComponent(SCOPE)}`,
  })

  if (!res.ok) {
    throw new Error(`eBay OAuth failed (${res.status})`)
  }

  const data = await res.json()
  tokenCache = {
    token: data.access_token,
    expiresAt: now + (Number(data.expires_in) || 7200) * 1000,
  }
  return tokenCache.token
}

export default async function handler(req, res) {
  const clientId = process.env.EBAY_CLIENT_ID
  const clientSecret = process.env.EBAY_CLIENT_SECRET

  if (!clientId || !clientSecret) {
    res.status(501).json({
      error: 'not_configured',
      message:
        'EBAY_CLIENT_ID / EBAY_CLIENT_SECRET are not set on this deployment. See README for setup.',
    })
    return
  }

  const q = typeof req.query.q === 'string' ? req.query.q.trim() : ''
  if (!q) {
    res.status(400).json({ error: 'bad_request', message: 'Missing required query param "q".' })
    return
  }

  const categoryIds = typeof req.query.category === 'string' ? req.query.category.trim() : ''
  const limit = Math.min(Math.max(Number(req.query.limit) || 50, 1), 100)

  const params = new URLSearchParams({ q, limit: String(limit) })
  if (categoryIds) params.set('category_ids', categoryIds)

  try {
    const token = await getAppToken(clientId, clientSecret)
    const upstream = await fetch(`${BROWSE_URL}?${params.toString()}`, {
      headers: {
        Authorization: `Bearer ${token}`,
        'X-EBAY-C-MARKETPLACE-ID': 'EBAY_US',
      },
    })

    const data = await upstream.json()
    if (!upstream.ok) {
      res.status(502).json({ error: 'upstream_error', message: 'eBay Browse API returned an error.' })
      return
    }

    // Trim to just what the client needs, keeping the payload small.
    const items = Array.isArray(data.itemSummaries) ? data.itemSummaries : []
    const listings = items
      .map((item) => ({
        title: typeof item.title === 'string' ? item.title : '',
        price: item.price && item.price.value != null ? Number(item.price.value) : null,
        currency: (item.price && item.price.currency) || 'USD',
        condition: typeof item.condition === 'string' ? item.condition : undefined,
        url: typeof item.itemWebUrl === 'string' ? item.itemWebUrl : undefined,
      }))
      .filter((l) => l.price != null && Number.isFinite(l.price))

    res.setHeader('Cache-Control', 'public, s-maxage=600, stale-while-revalidate=3600')
    res.status(200).json({ total: Number(data.total) || listings.length, listings })
  } catch {
    res.status(502).json({ error: 'upstream_unreachable', message: 'Could not reach eBay.' })
  }
}
