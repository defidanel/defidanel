// Serverless proxy for the PriceCharting API (Vercel Node function convention).
//
// Keeps PRICECHARTING_API_KEY server-side — a static SPA has nowhere safe to
// hold a secret, since anything in client JS is readable by any visitor.
export default async function handler(req, res) {
  const key = process.env.PRICECHARTING_API_KEY

  if (!key) {
    res.status(501).json({
      error: 'not_configured',
      message: 'PRICECHARTING_API_KEY is not set on this deployment. See README for setup.',
    })
    return
  }

  const q = typeof req.query.q === 'string' ? req.query.q.trim() : ''
  if (!q) {
    res.status(400).json({ error: 'bad_request', message: 'Missing required query param "q".' })
    return
  }

  const upstream = `https://www.pricecharting.com/api/products?t=${encodeURIComponent(key)}&q=${encodeURIComponent(q)}`

  try {
    const upstreamRes = await fetch(upstream)
    const data = await upstreamRes.json()
    res.setHeader('Cache-Control', 'public, s-maxage=3600, stale-while-revalidate=86400')
    res.status(upstreamRes.ok ? 200 : 502).json(data)
  } catch {
    res.status(502).json({ error: 'upstream_unreachable', message: 'Could not reach PriceCharting.' })
  }
}
