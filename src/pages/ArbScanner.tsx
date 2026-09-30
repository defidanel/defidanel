import { useMemo, useState } from 'react'
import {
  DEFAULT_FRICTION,
  evaluateArb,
  parseTokenListing,
  type ArbFriction,
  type TokenListing,
} from '../lib/arbScanner'
import { Callout, Card, PageHeader, Section } from '../components/ui'

const currency = (n: number) =>
  n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })
const currency2 = (n: number) =>
  n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 2 })

function Field({
  label,
  value,
  onChange,
  prefix,
  suffix,
  step = 1,
}: {
  label: string
  value: number
  onChange: (v: number) => void
  prefix?: string
  suffix?: string
  step?: number
}) {
  return (
    <label className="block">
      <span className="text-xs font-medium uppercase tracking-wide text-ink-400">{label}</span>
      <div className="mt-1.5 flex items-center overflow-hidden rounded-lg border border-ink-600 bg-ink-950 focus-within:border-brand-400">
        {prefix && <span className="pl-3 text-sm text-ink-500">{prefix}</span>}
        <input
          type="number"
          value={Number.isFinite(value) ? value : 0}
          step={step}
          onChange={(e) => onChange(e.target.valueAsNumber || 0)}
          className="w-full bg-transparent px-3 py-2 text-sm text-white outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
        />
        {suffix && <span className="pr-3 text-sm text-ink-500">{suffix}</span>}
      </div>
    </label>
  )
}

type FetchStatus = 'idle' | 'loading' | 'success' | 'empty' | 'unavailable' | 'error'

export default function ArbScanner() {
  const [tokenPrice, setTokenPrice] = useState(2500)
  const [physicalComp, setPhysicalComp] = useState(6000)

  const [vaultPct, setVaultPct] = useState(DEFAULT_FRICTION.vaultWithdrawalPct * 100)
  const [redemptionShipping, setRedemptionShipping] = useState(DEFAULT_FRICTION.redemptionShipping)
  const [resaleFeePct, setResaleFeePct] = useState(DEFAULT_FRICTION.resaleFeePct * 100)
  const [resaleShipping, setResaleShipping] = useState(DEFAULT_FRICTION.resaleShipping)

  const [query, setQuery] = useState('')
  const [status, setStatus] = useState<FetchStatus>('idle')
  const [listings, setListings] = useState<TokenListing[]>([])

  const result = useMemo(() => {
    const friction: ArbFriction = {
      vaultWithdrawalPct: vaultPct / 100,
      redemptionShipping,
      resaleFeePct: resaleFeePct / 100,
      resaleShipping,
    }
    return evaluateArb(tokenPrice, physicalComp, { friction })
  }, [tokenPrice, physicalComp, vaultPct, redemptionShipping, resaleFeePct, resaleShipping])

  const verdictStyle = {
    buy: { box: 'border-good-500/40 bg-good-500/10', text: 'text-good-500', label: 'BUY — clears friction' },
    thin: { box: 'border-gold-500/40 bg-gold-500/10', text: 'text-gold-400', label: 'THIN — edge too small' },
    pass: { box: 'border-bad-500/40 bg-bad-500/10', text: 'text-bad-500', label: 'PASS — underwater after friction' },
  }[result.verdict]

  async function fetchListings() {
    if (!query.trim()) return
    setStatus('loading')
    try {
      const res = await fetch(`/api/collectorcrypt?q=${encodeURIComponent(query.trim())}`)
      if (res.status === 501) {
        setStatus('unavailable')
        return
      }
      if (!res.ok) {
        setStatus('error')
        return
      }
      const data: unknown = await res.json().catch(() => null)
      const raw =
        data && typeof data === 'object' && Array.isArray((data as { listings?: unknown[] }).listings)
          ? (data as { listings: unknown[] }).listings
          : []
      const parsed = raw.map(parseTokenListing).filter((l): l is TokenListing => l !== null)
      setListings(parsed)
      setStatus(parsed.length ? 'success' : 'empty')
    } catch {
      setStatus('unavailable')
    }
  }

  return (
    <div>
      <PageHeader
        eyebrow="Tool"
        title="Tokenized-Card Arb Scanner"
        lede="Tokenized marketplaces (Collector Crypt, Phygitals) price with latency, so a token can sit below — or above — its physical value. This tool answers one question: after every round-trip cost, is the token actually cheaper than the physical card? Enter a token price and the exact-match physical sold comp."
      />

      <Callout tone="warn" title="Mispricing runs both ways — comp the EXACT card">
        A token that looks 'cheap' can be a reprint priced like the original (a Base Set 2 #4/130
        valued off Base Set #4/102 comps). The signal is only as good as the physical comp you
        feed it: match set, card number, grader, AND grade. Garbage comp in, garbage signal out.
      </Callout>

      <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-5">
        <div className="space-y-6 lg:col-span-3">
          <Section title="1. The two prices">
            <Card>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field label="Token price (what you'd pay)" value={tokenPrice} onChange={setTokenPrice} prefix="$" />
                <Field
                  label="Physical sold comp (exact match)"
                  value={physicalComp}
                  onChange={setPhysicalComp}
                  prefix="$"
                />
              </div>
            </Card>
          </Section>

          <Section
            title="2. Round-trip friction"
            subtitle="Defaults: 2% vault withdrawal (Collector Crypt) + ~13% eBay resale fee + shipping both ways. Tune per platform/category."
          >
            <Card>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <Field label="Vault withdrawal fee" value={vaultPct} onChange={setVaultPct} suffix="%" step={0.5} />
                <Field label="Redemption shipping" value={redemptionShipping} onChange={setRedemptionShipping} prefix="$" />
                <Field label="Resale (eBay) fee" value={resaleFeePct} onChange={setResaleFeePct} suffix="%" step={0.5} />
                <Field label="Resale shipping" value={resaleShipping} onChange={setResaleShipping} prefix="$" />
              </div>
            </Card>
          </Section>

          <Section
            title="Pull live token listings (optional)"
            subtitle="Wired to a Collector Crypt proxy. It's a scaffold until you add the real endpoint + key (see README) — until then it shows a 'not configured' notice and you use the manual inputs above."
          >
            <Card>
              <div className="flex flex-col gap-3 sm:flex-row">
                <input
                  type="text"
                  value={query}
                  onChange={(e) => setQuery(e.target.value)}
                  placeholder="e.g., Charizard Base Set 2 CGC 10"
                  className="w-full rounded-lg border border-ink-600 bg-ink-950 px-3 py-2 text-sm text-white placeholder:text-ink-500 outline-none focus:border-brand-400"
                />
                <button
                  type="button"
                  onClick={fetchListings}
                  disabled={status === 'loading'}
                  className="shrink-0 rounded-lg border border-brand-400/40 bg-brand-500/10 px-4 py-2 text-sm font-semibold text-brand-300 transition-colors hover:bg-brand-500/20 disabled:opacity-60"
                >
                  {status === 'loading' ? 'Fetching…' : 'Fetch listings'}
                </button>
              </div>

              {status === 'unavailable' && (
                <p className="mt-3 text-xs text-ink-400">
                  Collector Crypt endpoint isn&rsquo;t wired on this deployment yet. Set
                  COLLECTORCRYPT_API_BASE + the real listings path (README) to enable it. Use the
                  manual inputs above meanwhile.
                </p>
              )}
              {status === 'error' && (
                <p className="mt-3 text-xs text-ink-400">Lookup failed — use the manual inputs above.</p>
              )}
              {status === 'empty' && (
                <p className="mt-3 text-xs text-ink-400">No listings matched &ldquo;{query}&rdquo;.</p>
              )}
              {status === 'success' && (
                <div className="mt-3 space-y-1.5">
                  {listings.slice(0, 8).map((l) => (
                    <button
                      key={l.id}
                      type="button"
                      onClick={() => setTokenPrice(l.price)}
                      className="flex w-full items-baseline justify-between gap-3 rounded-md border border-ink-700/60 bg-ink-950 px-3 py-2 text-left text-xs hover:border-brand-400/50"
                    >
                      <span className="truncate text-ink-300">
                        {l.name} {l.grade && <span className="text-ink-500">· {l.grade}</span>}
                      </span>
                      <span className="font-mono text-white">{currency2(l.price)} →</span>
                    </button>
                  ))}
                  <p className="mt-1 text-[11px] text-ink-500">
                    Tap a listing to load its price above, then set the exact physical comp.
                  </p>
                </div>
              )}
            </Card>
          </Section>
        </div>

        <div className="space-y-4 lg:col-span-2">
          <Section title="3. Signal">
            <div className="space-y-3">
              <Card className={verdictStyle.box}>
                <p className="text-xs font-medium uppercase tracking-wide text-ink-300">Verdict</p>
                <p className={`mt-1 text-2xl font-bold ${verdictStyle.text}`}>{verdictStyle.label}</p>
              </Card>
              <Card>
                <p className="text-xs font-medium uppercase tracking-wide text-ink-400">
                  Edge (net profit, redeem &amp; resell)
                </p>
                <p className={`mt-1.5 text-3xl font-bold ${result.edge >= 0 ? 'text-good-500' : 'text-bad-500'}`}>
                  {result.edge >= 0 ? '+' : ''}
                  {currency(result.edge)}
                </p>
                <p className="mt-1 text-xs text-ink-400">
                  {(result.edgePct * 100).toFixed(1)}% on token outlay
                </p>
              </Card>
              <div className="grid grid-cols-2 gap-3">
                <Card>
                  <p className="text-[11px] uppercase tracking-wide text-ink-500">Breakeven token price</p>
                  <p className="mt-1 font-mono text-lg text-white">{currency(result.breakevenTokenPrice)}</p>
                </Card>
                <Card>
                  <p className="text-[11px] uppercase tracking-wide text-ink-500">Max bid (15% margin)</p>
                  <p className="mt-1 font-mono text-lg text-brand-300">{currency(result.maxBidForMargin)}</p>
                </Card>
              </div>
              <Card>
                <p className="text-xs font-medium uppercase tracking-wide text-ink-400">Friction breakdown</p>
                <ul className="mt-2 space-y-1 text-xs text-ink-300">
                  <li className="flex justify-between">
                    <span>Resale proceeds (comp − fee − ship)</span>
                    <span className="font-mono text-white">{currency2(result.breakdown.resaleProceeds)}</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Vault withdrawal fee</span>
                    <span className="font-mono text-white">−{currency2(result.breakdown.withdrawalFee)}</span>
                  </li>
                  <li className="flex justify-between">
                    <span>Redemption shipping</span>
                    <span className="font-mono text-white">−{currency2(result.breakdown.redemptionShipping)}</span>
                  </li>
                  <li className="flex justify-between border-t border-ink-700/60 pt-1">
                    <span>Token cost</span>
                    <span className="font-mono text-white">−{currency2(result.breakdown.tokenCost)}</span>
                  </li>
                </ul>
              </Card>
            </div>
          </Section>

          <Callout tone="info" title="Read the max-bid number">
            The token is a buy only below the <em>breakeven</em>, and a good buy below the
            <em> max-bid</em> line (your target margin baked in). Above breakeven, friction eats
            the trade — that&rsquo;s the overpriced token trap, quantified.
          </Callout>
        </div>
      </div>

      <Callout tone="danger" title="This is a thin, early market — not free money" className="mt-8">
        Token/tokenized-card arbitrage carries platform and smart-contract risk (vault solvency,
        irreversible token burns on redemption), thin liquidity (a 'cheap' token you can&rsquo;t
        resell isn&rsquo;t a win), and an edge that compresses as the market matures. The
        friction model here is a floor, not a guarantee — verify current fees per platform, and
        never skip the exact-match physical comp. Educational tool, not financial advice.
      </Callout>
    </div>
  )
}
