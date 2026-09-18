import { useMemo, useState } from 'react'
import {
  PriceChartingUnavailableError,
  searchPriceCharting,
  type PriceChartingProduct,
} from '../lib/priceCharting'
import { Card } from './ui'

type CardKind = 'pokemon' | 'sports'
type LiveStatus = 'idle' | 'loading' | 'success' | 'empty' | 'unavailable' | 'error'

function buildQuery(cardName: string, grade: string) {
  return [cardName, grade].filter(Boolean).join(' ').trim()
}

export default function CompSearch() {
  const [cardName, setCardName] = useState('Charizard 1999 Base Set Holo')
  const [grade, setGrade] = useState('PSA 9')
  const [kind, setKind] = useState<CardKind>('pokemon')

  const [liveStatus, setLiveStatus] = useState<LiveStatus>('idle')
  const [liveMessage, setLiveMessage] = useState('')
  const [liveProducts, setLiveProducts] = useState<PriceChartingProduct[]>([])

  const links = useMemo(() => {
    const q = buildQuery(cardName, grade)
    const encoded = encodeURIComponent(q)
    const ebaySold = `https://www.ebay.com/sch/i.html?_nkw=${encoded}&LH_Sold=1&LH_Complete=1`
    const priceGuide =
      kind === 'pokemon'
        ? `https://www.pricecharting.com/search-products?q=${encoded}&type=prices`
        : `https://www.sportscardspro.com/search-products?q=${encoded}&type=prices`
    return { q, ebaySold, priceGuide }
  }, [cardName, grade, kind])

  async function fetchLive() {
    if (!cardName.trim()) return
    setLiveStatus('loading')
    setLiveMessage('')
    try {
      const products = await searchPriceCharting(cardName.trim())
      if (products.length === 0) {
        setLiveStatus('empty')
      } else {
        setLiveProducts(products)
        setLiveStatus('success')
      }
    } catch (err) {
      if (err instanceof PriceChartingUnavailableError) {
        setLiveStatus('unavailable')
        setLiveMessage(err.message)
      } else {
        setLiveStatus('error')
        setLiveMessage(err instanceof Error ? err.message : 'Something went wrong.')
      }
    }
  }

  return (
    <Card>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <label className="block sm:col-span-2">
          <span className="text-xs font-medium uppercase tracking-wide text-ink-400">
            Card name / set / player
          </span>
          <input
            type="text"
            value={cardName}
            onChange={(e) => setCardName(e.target.value)}
            placeholder="e.g., Charizard 1999 Base Set Holo, or Mike Trout 2011 Topps Update"
            className="mt-1.5 w-full rounded-lg border border-ink-600 bg-ink-950 px-3 py-2 text-sm text-white placeholder:text-ink-500 outline-none focus:border-brand-400"
          />
        </label>

        <label className="block">
          <span className="text-xs font-medium uppercase tracking-wide text-ink-400">
            Grade (optional)
          </span>
          <input
            type="text"
            value={grade}
            onChange={(e) => setGrade(e.target.value)}
            placeholder="e.g., PSA 9, BGS 9.5, raw"
            className="mt-1.5 w-full rounded-lg border border-ink-600 bg-ink-950 px-3 py-2 text-sm text-white placeholder:text-ink-500 outline-none focus:border-brand-400"
          />
        </label>

        <label className="block">
          <span className="text-xs font-medium uppercase tracking-wide text-ink-400">
            Card type
          </span>
          <div className="mt-1.5 flex overflow-hidden rounded-lg border border-ink-600">
            {(['pokemon', 'sports'] as const).map((k) => (
              <button
                key={k}
                type="button"
                onClick={() => setKind(k)}
                className={`flex-1 px-3 py-2 text-sm font-medium transition-colors ${
                  kind === k ? 'bg-brand-500/20 text-brand-300' : 'bg-ink-950 text-ink-400 hover:text-ink-200'
                }`}
              >
                {k === 'pokemon' ? 'Pokémon' : 'Sports'}
              </button>
            ))}
          </div>
        </label>
      </div>

      <div className="mt-5 flex flex-wrap gap-3">
        <a
          href={links.ebaySold}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-lg bg-brand-500 px-4 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-400"
        >
          Search eBay sold listings
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
            <path d="M6 3h7v7M13 3 3 13" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </a>
        <a
          href={links.priceGuide}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 rounded-lg border border-ink-600 px-4 py-2.5 text-sm font-semibold text-ink-100 transition-colors hover:bg-ink-800"
        >
          Search {kind === 'pokemon' ? 'PriceCharting' : 'SportsCardsPro'} index
          <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
            <path d="M6 3h7v7M13 3 3 13" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </a>
        <button
          type="button"
          onClick={fetchLive}
          disabled={liveStatus === 'loading'}
          className="inline-flex items-center gap-2 rounded-lg border border-gold-500/40 bg-gold-500/10 px-4 py-2.5 text-sm font-semibold text-gold-400 transition-colors hover:bg-gold-500/20 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {liveStatus === 'loading' ? 'Fetching…' : 'Fetch live prices'}
        </button>
      </div>

      <p className="mt-4 text-xs text-ink-500">
        The two search buttons just open each site&rsquo;s own search for &ldquo;{links.q || '…'}
        &rdquo; in a new tab. &ldquo;Fetch live prices&rdquo; calls the PriceCharting API through
        this app&rsquo;s own server-side proxy (your API key, if configured, never reaches the
        browser) and reads whatever price fields it returns for matching products.
      </p>

      {liveStatus === 'unavailable' && (
        <div className="mt-4 rounded-lg border border-gold-500/30 bg-gold-500/10 p-3 text-xs text-ink-300">
          Live pricing isn&rsquo;t configured on this deployment yet.{' '}
          {liveMessage || 'Set PRICECHARTING_API_KEY (see README) to enable it.'} Use the search
          buttons above in the meantime.
        </div>
      )}
      {liveStatus === 'error' && (
        <div className="mt-4 rounded-lg border border-bad-500/30 bg-bad-500/10 p-3 text-xs text-ink-300">
          Live lookup failed{liveMessage ? `: ${liveMessage}` : '.'} Use the search buttons above
          instead.
        </div>
      )}
      {liveStatus === 'empty' && (
        <div className="mt-4 rounded-lg border border-ink-600 bg-ink-950 p-3 text-xs text-ink-400">
          No matching products came back for &ldquo;{cardName}&rdquo;. Try a shorter or
          differently worded query, or use the search buttons above.
        </div>
      )}
      {liveStatus === 'success' && (
        <div className="mt-4 space-y-3">
          {liveProducts.map((p) => (
            <div key={p.id} className="rounded-lg border border-ink-700/70 bg-ink-950 p-3">
              <p className="text-sm font-semibold text-white">
                {p.name}
                {p.consoleName && <span className="ml-2 text-xs text-ink-500">{p.consoleName}</span>}
              </p>
              <div className="mt-2 flex flex-wrap gap-x-5 gap-y-1">
                {p.entries.map((e) => (
                  <span key={e.label} className="text-xs text-ink-300">
                    <span className="text-ink-500">{e.label}:</span>{' '}
                    <span className="font-mono text-white">${e.amount.toFixed(2)}</span>
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </Card>
  )
}
