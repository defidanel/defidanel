import { useMemo, useState } from 'react'
import {
  PriceChartingUnavailableError,
  searchPriceCharting,
  type PriceChartingProduct,
} from '../lib/priceCharting'
import {
  MarketSignalUnavailableError,
  fetchMarketSignal,
  type MarketSignal,
} from '../lib/marketSignal'
import { Card } from './ui'

type CardKind = 'pokemon' | 'sports'
type LiveStatus = 'idle' | 'loading' | 'success' | 'empty' | 'unavailable' | 'error'

function buildQuery(cardName: string, grade: string) {
  return [cardName, grade].filter(Boolean).join(' ').trim()
}

const currency = (n: number, code = 'USD') =>
  n.toLocaleString('en-US', { style: 'currency', currency: code, maximumFractionDigits: 0 })

export default function CompSearch() {
  const [cardName, setCardName] = useState('Charizard 1999 Base Set Holo')
  const [grade, setGrade] = useState('PSA 9')
  const [kind, setKind] = useState<CardKind>('pokemon')

  const [priceStatus, setPriceStatus] = useState<LiveStatus>('idle')
  const [priceMessage, setPriceMessage] = useState('')
  const [priceProducts, setPriceProducts] = useState<PriceChartingProduct[]>([])

  const [supplyStatus, setSupplyStatus] = useState<LiveStatus>('idle')
  const [supplyMessage, setSupplyMessage] = useState('')
  const [supply, setSupply] = useState<MarketSignal | null>(null)

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

  async function fetchPrices() {
    if (!cardName.trim()) return
    setPriceStatus('loading')
    setPriceMessage('')
    try {
      const products = await searchPriceCharting(cardName.trim())
      if (products.length === 0) {
        setPriceStatus('empty')
      } else {
        setPriceProducts(products)
        setPriceStatus('success')
      }
    } catch (err) {
      if (err instanceof PriceChartingUnavailableError) {
        setPriceStatus('unavailable')
        setPriceMessage(err.message)
      } else {
        setPriceStatus('error')
        setPriceMessage(err instanceof Error ? err.message : 'Something went wrong.')
      }
    }
  }

  async function fetchSupply() {
    const q = buildQuery(cardName, grade)
    if (!q) return
    setSupplyStatus('loading')
    setSupplyMessage('')
    try {
      // Sports category (212) narrows results; Pokémon relies on the query text.
      const category = kind === 'sports' ? '212' : undefined
      const signal = await fetchMarketSignal(q, category)
      if (signal.sampled === 0) {
        setSupplyStatus('empty')
      } else {
        setSupply(signal)
        setSupplyStatus('success')
      }
    } catch (err) {
      if (err instanceof MarketSignalUnavailableError) {
        setSupplyStatus('unavailable')
        setSupplyMessage(err.message)
      } else {
        setSupplyStatus('error')
        setSupplyMessage(err instanceof Error ? err.message : 'Something went wrong.')
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
            placeholder="e.g., Jaxson Dart 2025 Topps Chrome Refractor, or Charizard 1999 Base Set Holo"
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
            placeholder="e.g., PSA 10, BGS 9.5, raw"
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
          onClick={fetchPrices}
          disabled={priceStatus === 'loading'}
          className="inline-flex items-center gap-2 rounded-lg border border-gold-500/40 bg-gold-500/10 px-4 py-2.5 text-sm font-semibold text-gold-400 transition-colors hover:bg-gold-500/20 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {priceStatus === 'loading' ? 'Fetching…' : 'Fetch live prices'}
        </button>
        <button
          type="button"
          onClick={fetchSupply}
          disabled={supplyStatus === 'loading'}
          className="inline-flex items-center gap-2 rounded-lg border border-brand-400/40 bg-brand-500/10 px-4 py-2.5 text-sm font-semibold text-brand-300 transition-colors hover:bg-brand-500/20 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {supplyStatus === 'loading' ? 'Fetching…' : 'Fetch active eBay supply'}
        </button>
      </div>

      <p className="mt-4 text-xs text-ink-500">
        The search buttons open each site&rsquo;s own search for &ldquo;{links.q || '…'}&rdquo; in
        a new tab. &ldquo;Fetch live prices&rdquo; reads the PriceCharting index; &ldquo;Fetch
        active eBay supply&rdquo; reads current <span className="text-ink-400">active listings</span>{' '}
        (asking prices and how many are for sale &mdash; a liquidity signal, <em>not</em> sold
        comps). Both call this app&rsquo;s own server-side proxy, so any API keys stay off the
        browser.
      </p>

      {/* ---- PriceCharting results ---- */}
      {priceStatus === 'unavailable' && (
        <div className="mt-4 rounded-lg border border-gold-500/30 bg-gold-500/10 p-3 text-xs text-ink-300">
          Live pricing isn&rsquo;t configured on this deployment yet.{' '}
          {priceMessage || 'Set PRICECHARTING_API_KEY (see README) to enable it.'} Use the search
          buttons above in the meantime.
        </div>
      )}
      {priceStatus === 'error' && (
        <div className="mt-4 rounded-lg border border-bad-500/30 bg-bad-500/10 p-3 text-xs text-ink-300">
          Live pricing lookup failed{priceMessage ? `: ${priceMessage}` : '.'} Use the search
          buttons above instead.
        </div>
      )}
      {priceStatus === 'empty' && (
        <div className="mt-4 rounded-lg border border-ink-600 bg-ink-950 p-3 text-xs text-ink-400">
          No matching products came back for &ldquo;{cardName}&rdquo;. Try a shorter or
          differently worded query.
        </div>
      )}
      {priceStatus === 'success' && (
        <div className="mt-4 space-y-3">
          {priceProducts.map((p) => (
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

      {/* ---- eBay active supply signal ---- */}
      {supplyStatus === 'unavailable' && (
        <div className="mt-4 rounded-lg border border-brand-400/30 bg-brand-500/10 p-3 text-xs text-ink-300">
          Live eBay supply isn&rsquo;t configured on this deployment yet.{' '}
          {supplyMessage || 'Set EBAY_CLIENT_ID / EBAY_CLIENT_SECRET (see README) to enable it.'}{' '}
          Use the eBay search button above in the meantime.
        </div>
      )}
      {supplyStatus === 'error' && (
        <div className="mt-4 rounded-lg border border-bad-500/30 bg-bad-500/10 p-3 text-xs text-ink-300">
          eBay supply lookup failed{supplyMessage ? `: ${supplyMessage}` : '.'} Use the eBay search
          button above instead.
        </div>
      )}
      {supplyStatus === 'empty' && (
        <div className="mt-4 rounded-lg border border-ink-600 bg-ink-950 p-3 text-xs text-ink-400">
          No active listings matched &ldquo;{links.q}&rdquo; right now. A thin or zero active
          supply can itself be a signal &mdash; the card rarely trades.
        </div>
      )}
      {supplyStatus === 'success' && supply && (
        <div className="mt-4 rounded-lg border border-brand-400/30 bg-ink-950 p-4">
          <div className="flex items-center justify-between gap-3">
            <p className="text-sm font-semibold text-white">Active eBay supply</p>
            <span className="rounded-full border border-brand-400/30 bg-brand-500/10 px-2 py-0.5 text-[10px] font-medium uppercase tracking-wide text-brand-300">
              Asking prices · not sold
            </span>
          </div>
          <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
            <div>
              <p className="text-[11px] uppercase tracking-wide text-ink-500">Listings</p>
              <p className="mt-0.5 font-mono text-lg text-white">{supply.total}</p>
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-wide text-ink-500">Low ask</p>
              <p className="mt-0.5 font-mono text-lg text-white">
                {currency(supply.priceLow, supply.currency)}
              </p>
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-wide text-ink-500">Median ask</p>
              <p className="mt-0.5 font-mono text-lg text-brand-300">
                {currency(supply.priceMedian, supply.currency)}
              </p>
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-wide text-ink-500">High ask</p>
              <p className="mt-0.5 font-mono text-lg text-white">
                {currency(supply.priceHigh, supply.currency)}
              </p>
            </div>
          </div>
          <p className="mt-3 text-xs text-ink-500">
            {supply.total} active {supply.total === 1 ? 'listing' : 'listings'} matched (sampled{' '}
            {supply.sampled}). Many active listings = liquid, easy to exit; one or two = a thin
            market where your entry price is harder to trust. Asking prices sit <em>above</em>{' '}
            real sale prices &mdash; confirm against sold comps before buying.
          </p>
          <div className="mt-3 space-y-1.5">
            {supply.listings.slice(0, 5).map((l, i) => (
              <div key={i} className="flex items-baseline justify-between gap-3 text-xs">
                <span className="truncate text-ink-400">
                  {l.url ? (
                    <a
                      href={l.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="hover:text-brand-300"
                    >
                      {l.title || 'View listing'}
                    </a>
                  ) : (
                    l.title || 'Listing'
                  )}
                </span>
                <span className="flex-none font-mono text-white">
                  {currency(l.price, l.currency)}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </Card>
  )
}
