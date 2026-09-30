import { useMemo, useState } from 'react'
import {
  PriceChartingUnavailableError,
  searchPriceCharting,
} from '../lib/priceCharting'
import {
  emptyLadder,
  ladderFromProduct,
  multipleVs,
  suggestOffer,
  type GradeKey,
  type GradeRung,
} from '../lib/gradeLadder'
import { Callout, Card, PageHeader, Section } from '../components/ui'

const currency = (n: number) =>
  n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })

type FetchStatus = 'idle' | 'loading' | 'success' | 'empty' | 'unavailable' | 'error'

export default function CompTable() {
  const [cardName, setCardName] = useState('Charizard 1999 Base Set Holo')
  const [rungs, setRungs] = useState<GradeRung[]>(emptyLadder())
  const [anchorKey, setAnchorKey] = useState<GradeKey>('g7')
  const [discountPct, setDiscountPct] = useState(5)

  const [status, setStatus] = useState<FetchStatus>('idle')
  const [message, setMessage] = useState('')
  const [source, setSource] = useState('')

  const anchor = useMemo(
    () => rungs.find((r) => r.key === anchorKey)?.market ?? null,
    [rungs, anchorKey],
  )

  function setMarket(key: GradeKey, value: number | null) {
    setRungs((prev) => prev.map((r) => (r.key === key ? { ...r, market: value } : r)))
  }

  async function fetchFromPriceCharting() {
    if (!cardName.trim()) return
    setStatus('loading')
    setMessage('')
    try {
      const products = await searchPriceCharting(cardName.trim())
      if (products.length === 0) {
        setStatus('empty')
        return
      }
      const product = products[0]
      setRungs(ladderFromProduct(product))
      setSource(`${product.name}${product.consoleName ? ` · ${product.consoleName}` : ''}`)
      setStatus('success')
    } catch (err) {
      if (err instanceof PriceChartingUnavailableError) {
        setStatus('unavailable')
        setMessage(err.message)
      } else {
        setStatus('error')
        setMessage(err instanceof Error ? err.message : 'Something went wrong.')
      }
    }
  }

  const ebaySold = `https://www.ebay.com/sch/i.html?_nkw=${encodeURIComponent(cardName.trim())}&LH_Sold=1&LH_Complete=1`

  return (
    <div>
      <PageHeader
        eyebrow="Tool"
        title="Grade-Ladder Comp Table"
        lede="Build a full PSA 7→10 comp ladder for one card: market value per grade, each grade's multiple versus your anchor, and a disciplined offer target for every rung. Type the numbers you see while shopping, or auto-fill them from the PriceCharting index once a key is wired."
      />

      <Callout tone="warn" title="Comp the EXACT card — edition traps sink this table">
        A ladder is only valid for one exact printing. Base Set Unlimited (#4/102), Shadowless,
        1st Edition, and Base Set 2 (#4/130) are four different cards with wildly different values —
        free price aggregators routinely blend them, which is why a single card can show a 40×
        spread across sites. Match set, card number, grader, and grade before you trust a row.
      </Callout>

      <div className="mt-8 space-y-6">
        <Section
          title="1. The card"
          subtitle="Auto-fill pulls the first PriceCharting match. Until a key is wired it shows a 'not configured' notice — enter values by hand meanwhile (everything below still works)."
        >
          <Card>
            <label className="block">
              <span className="text-xs font-medium uppercase tracking-wide text-ink-400">
                Card name / set
              </span>
              <input
                type="text"
                value={cardName}
                onChange={(e) => setCardName(e.target.value)}
                placeholder="e.g., Charizard 1999 Base Set Holo"
                className="mt-1.5 w-full rounded-lg border border-ink-600 bg-ink-950 px-3 py-2 text-sm text-white placeholder:text-ink-500 outline-none focus:border-brand-400"
              />
            </label>
            <div className="mt-4 flex flex-wrap gap-3">
              <button
                type="button"
                onClick={fetchFromPriceCharting}
                disabled={status === 'loading'}
                className="inline-flex items-center gap-2 rounded-lg border border-gold-500/40 bg-gold-500/10 px-4 py-2.5 text-sm font-semibold text-gold-400 transition-colors hover:bg-gold-500/20 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {status === 'loading' ? 'Fetching…' : 'Auto-fill from PriceCharting'}
              </button>
              <button
                type="button"
                onClick={() => {
                  setRungs(emptyLadder())
                  setStatus('idle')
                  setSource('')
                }}
                className="inline-flex items-center gap-2 rounded-lg border border-ink-600 px-4 py-2.5 text-sm font-semibold text-ink-200 transition-colors hover:bg-ink-800"
              >
                Clear values
              </button>
              <a
                href={ebaySold}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 rounded-lg border border-ink-600 px-4 py-2.5 text-sm font-semibold text-ink-100 transition-colors hover:bg-ink-800"
              >
                Verify sold comps on eBay
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none">
                  <path d="M6 3h7v7M13 3 3 13" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </a>
            </div>

            {status === 'unavailable' && (
              <p className="mt-3 rounded-lg border border-gold-500/30 bg-gold-500/10 p-3 text-xs text-ink-300">
                PriceCharting isn&rsquo;t wired on this deployment yet.{' '}
                {message || 'Set PRICECHARTING_API_KEY (see README) to enable auto-fill.'} Enter the
                grade values by hand below meanwhile.
              </p>
            )}
            {status === 'error' && (
              <p className="mt-3 rounded-lg border border-bad-500/30 bg-bad-500/10 p-3 text-xs text-ink-300">
                Auto-fill failed{message ? `: ${message}` : '.'} Enter values by hand below.
              </p>
            )}
            {status === 'empty' && (
              <p className="mt-3 rounded-lg border border-ink-600 bg-ink-950 p-3 text-xs text-ink-400">
                No PriceCharting match for &ldquo;{cardName}&rdquo;. Try a shorter query, or enter
                values by hand.
              </p>
            )}
            {status === 'success' && (
              <p className="mt-3 rounded-lg border border-good-500/30 bg-good-500/10 p-3 text-xs text-ink-300">
                Filled from PriceCharting: <span className="text-white">{source}</span>. Confirm the
                edition matches your card, then verify the high grades against real sold comps.
              </p>
            )}
          </Card>
        </Section>

        <Section
          title="2. Offer settings"
          subtitle="Anchor sets what every multiple is measured against. Offer target = market minus your discount, rounded to a clean number."
        >
          <Card>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <label className="block">
                <span className="text-xs font-medium uppercase tracking-wide text-ink-400">
                  Anchor grade (multiples baseline)
                </span>
                <select
                  value={anchorKey}
                  onChange={(e) => setAnchorKey(e.target.value as GradeKey)}
                  className="mt-1.5 w-full rounded-lg border border-ink-600 bg-ink-950 px-3 py-2 text-sm text-white outline-none focus:border-brand-400"
                >
                  {rungs.map((r) => (
                    <option key={r.key} value={r.key}>
                      {r.label}
                    </option>
                  ))}
                </select>
              </label>
              <label className="block">
                <span className="text-xs font-medium uppercase tracking-wide text-ink-400">
                  Offer discount vs market
                </span>
                <div className="mt-1.5 flex items-center overflow-hidden rounded-lg border border-ink-600 bg-ink-950 focus-within:border-brand-400">
                  <input
                    type="number"
                    value={discountPct}
                    step={1}
                    onChange={(e) => setDiscountPct(e.target.valueAsNumber || 0)}
                    className="w-full bg-transparent px-3 py-2 text-sm text-white outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                  />
                  <span className="pr-3 text-sm text-ink-500">%</span>
                </div>
              </label>
            </div>
          </Card>
        </Section>

        <Section title="3. The ladder">
          <Card className="overflow-x-auto">
            <table className="w-full min-w-[560px] text-sm">
              <thead>
                <tr className="border-b border-ink-700/60 text-left text-[11px] uppercase tracking-wide text-ink-500">
                  <th className="pb-2 pr-3 font-medium">Grade</th>
                  <th className="pb-2 pr-3 font-medium">Market value ($)</th>
                  <th className="pb-2 pr-3 font-medium">vs {rungs.find((r) => r.key === anchorKey)?.label}</th>
                  <th className="pb-2 font-medium">Offer target (−{discountPct}%)</th>
                </tr>
              </thead>
              <tbody>
                {rungs.map((r) => {
                  const mult = multipleVs(r.market, anchor)
                  const offer = r.market !== null && r.market > 0 ? suggestOffer(r.market, discountPct) : null
                  const isAnchor = r.key === anchorKey
                  return (
                    <tr key={r.key} className="border-b border-ink-800/60 last:border-0">
                      <td className="py-2.5 pr-3">
                        <span className={`font-medium ${isAnchor ? 'text-brand-300' : 'text-white'}`}>
                          {r.label}
                        </span>
                        {isAnchor && (
                          <span className="ml-2 rounded-full border border-brand-400/30 bg-brand-500/10 px-1.5 py-0.5 text-[9px] uppercase tracking-wide text-brand-300">
                            anchor
                          </span>
                        )}
                      </td>
                      <td className="py-2.5 pr-3">
                        <div className="flex max-w-[160px] items-center overflow-hidden rounded-md border border-ink-700 bg-ink-950 focus-within:border-brand-400">
                          <span className="pl-2.5 text-xs text-ink-500">$</span>
                          <input
                            type="number"
                            value={r.market ?? ''}
                            placeholder="—"
                            onChange={(e) =>
                              setMarket(
                                r.key,
                                e.target.value === '' ? null : e.target.valueAsNumber || 0,
                              )
                            }
                            className="w-full bg-transparent px-2 py-1.5 text-sm text-white outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none placeholder:text-ink-600"
                          />
                        </div>
                      </td>
                      <td className="py-2.5 pr-3 font-mono text-ink-300">
                        {mult !== null ? `${mult.toFixed(2)}×` : '—'}
                      </td>
                      <td className="py-2.5 font-mono text-good-500">
                        {offer !== null ? currency(offer) : '—'}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </Card>
        </Section>
      </div>

      <Callout tone="info" title="How to read the ladder" className="mt-8">
        The <em>multiple</em> column shows where the grade premiums sit. When a higher grade&rsquo;s
        multiple is large but its population is nearly the same as the grade below (e.g. a PSA 8 that
        costs ~1.75× a PSA 7 for a near-identical pop), you&rsquo;re paying for eye appeal, not
        scarcity — usually the worst value on the curve. The <em>offer target</em> is a starting bid
        a touch under sold value; on a liquid card, let it walk rather than chase above market —
        more supply prints constantly.
      </Callout>

      <Callout tone="danger" title="Index values are a starting point, not a sale price" className="mt-6">
        PriceCharting index values approximate recent sold averages, but high grades (PSA 9/10) trade
        thinly and move fast — always confirm the exact-match sold comps on eBay before you act. This
        is a decision-support tool, not financial advice.
      </Callout>
    </div>
  )
}
