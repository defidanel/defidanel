import { Link } from 'react-router-dom'
import { Card, Pill } from '../components/ui'

const PILLARS = [
  {
    to: '/grading',
    tag: 'Grading',
    title: 'Grading Systems & Population',
    body: 'PSA, BGS, CGC, and SGC scales, what actually moves a card from a 9 to a 10, population reports, and the economics of submitting a card for grading.',
  },
  {
    to: '/rarity',
    tag: 'Rarity',
    title: 'Print Runs & Rarity Mechanics',
    body: 'How Pokémon rarity symbols and eras work, how sports card parallels and serial numbering create scarcity, and why "rare" on the card is not the same as rare in the market.',
  },
  {
    to: '/market',
    tag: 'Market Dynamics',
    title: 'Supply, Demand & Hype Cycles',
    body: 'Why population reports grow over time, how sealed product supply feeds singles prices, and what drives boom/bust cycles in the hobby.',
  },
  {
    to: '/pricing',
    tag: 'Pricing',
    title: 'Reading Comps & Price Guides',
    body: 'Why guide prices lag reality, how to weight recent sold comps by grade and venue, and the checklist of factors that actually move a card’s price.',
  },
  {
    to: '/risk',
    tag: 'Risk & Asset Class',
    title: 'Cards as an Alternative Asset',
    body: 'Liquidity, authentication risk, volatility, storage and insurance costs, and how collectibles compare to stocks, bonds, and other alternative assets.',
  },
  {
    to: '/calculator',
    tag: 'Tool',
    title: 'Grading ROI Calculator',
    body: 'Model the expected value of submitting a raw card for grading given your own grade-probability estimates, fees, and turnaround time.',
  },
]

export default function Home() {
  return (
    <div>
      <div className="mb-16 max-w-3xl">
        <Pill tone="brand">Pokémon &amp; Sports Cards</Pill>
        <h1 className="mt-4 text-4xl font-bold tracking-tight text-white sm:text-5xl">
          A collector&rsquo;s field guide to grading, rarity, and market risk.
        </h1>
        <p className="mt-5 text-lg leading-relaxed text-ink-300">
          Slab &amp; Set breaks down how the trading card market actually works &mdash; the
          grading systems, the rarity mechanics printed into the cards themselves, the supply
          and demand forces behind price swings, and the risk profile of treating cards as an
          alternative asset class.
        </p>
        <div className="mt-8 flex flex-wrap gap-3">
          <Link
            to="/grading"
            className="rounded-lg bg-brand-500 px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-brand-400"
          >
            Start with grading
          </Link>
          <Link
            to="/calculator"
            className="rounded-lg border border-ink-600 px-5 py-2.5 text-sm font-semibold text-ink-100 transition-colors hover:bg-ink-800"
          >
            Try the ROI calculator
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {PILLARS.map((p) => (
          <Link key={p.to} to={p.to} className="group">
            <Card className="h-full transition-colors group-hover:border-brand-400/50 group-hover:bg-ink-900">
              <Pill>{p.tag}</Pill>
              <h3 className="mt-3 text-lg font-semibold text-white">{p.title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-400">{p.body}</p>
              <span className="mt-4 inline-flex items-center gap-1 text-sm font-medium text-brand-400">
                Explore
                <svg width="14" height="14" viewBox="0 0 16 16" fill="none" className="transition-transform group-hover:translate-x-0.5">
                  <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </span>
            </Card>
          </Link>
        ))}
      </div>

      <div className="mt-16 rounded-2xl border border-ink-700/70 bg-gradient-to-br from-ink-900 to-ink-950 p-8">
        <h2 className="text-xl font-semibold text-white">Why treat cards like an asset class at all?</h2>
        <p className="mt-3 max-w-3xl text-sm leading-relaxed text-ink-300">
          High-end trading cards behave like a niche collectible market with some properties of
          an alternative asset: fixed or shrinking supply for a given card, a public (if noisy)
          price history, third-party authentication and grading that standardizes condition,
          and enough transaction volume in the top of the market to observe trends. They also
          carry real risks that don&rsquo;t show up in a chart &mdash; illiquidity, counterfeit
          and alteration risk, storage and insurance costs, and prices driven as much by
          nostalgia and hype as by fundamentals. The rest of this guide walks through both
          sides.
        </p>
      </div>
    </div>
  )
}
