// Serverless proxy for the Collector Crypt marketplace API (Vercel Node convention).
//
// Pulls tokenized-card listings so the client can cross-reference them against
// physical sold comps for arbitrage. Keeps any API key server-side.
//
// ⚠️ ENDPOINT IS A SCAFFOLD. The exact base URL, path, query params, auth
// header, and response shape were NOT confirmed against the live docs
// (docs.collectorcrypt.com/marketplace/api) — that site is unreachable from
// the build environment. Fill in the specifics below from the real docs:
//   - COLLECTORCRYPT_API_BASE : the API origin (default guessed below)
//   - the listings path + query params for a card-name search
//   - the auth scheme (bearer? x-api-key? none?) — wired as Bearer by default
// The client (src/lib/arbScanner.ts) parses the response defensively, so it
// tolerates a range of field names, but confirm the shape once you have a key.

const DEFAULT_BASE = 'https://api.collectorcrypt.com'

export default async function handler(req, res) {
  const base = process.env.COLLECTORCRYPT_API_BASE || DEFAULT_BASE
  const key = process.env.COLLECTORCRYPT_API_KEY // optional depending on the API

  const q = typeof req.query.q === 'string' ? req.query.q.trim() : ''
  const limit = Math.min(Math.max(Number(req.query.limit) || 30, 1), 100)

  // TODO: replace `path` + params with the real listings/search endpoint.
  const params = new URLSearchParams({ limit: String(limit) })
  if (q) params.set('search', q)
  const upstreamUrl = `${base}/v1/marketplace/listings?${params.toString()}`

  const headers = { Accept: 'application/json' }
  if (key) headers.Authorization = `Bearer ${key}`

  try {
    const upstream = await fetch(upstreamUrl, { headers })
    const data = await upstream.json().catch(() => null)

    if (!upstream.ok) {
      // 501 tells the client "scaffold not wired / not configured yet" so it
      // degrades to the manual evaluator instead of erroring.
      res.status(501).json({
        error: 'not_configured',
        message:
          'Collector Crypt endpoint is a scaffold — set COLLECTORCRYPT_API_BASE and the real listings path from docs.collectorcrypt.com. See README.',
      })
      return
    }

    // Pass through; the client normalizes whatever fields come back.
    const listings = Array.isArray(data)
      ? data
      : (data && (data.listings || data.results || data.items)) || []
    res.setHeader('Cache-Control', 'public, s-maxage=120, stale-while-revalidate=600')
    res.status(200).json({ listings })
  } catch {
    res.status(501).json({
      error: 'not_configured',
      message: 'Could not reach the Collector Crypt API. Confirm the endpoint from the docs.',
    })
  }
}
