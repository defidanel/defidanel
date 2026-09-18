import CompSearch from '../components/CompSearch'
import { Callout, Card, Grid, PageHeader, Section, Table } from '../components/ui'

const SOURCES = [
  {
    source: 'eBay sold / completed listings',
    strength: 'The most-used comp source in the hobby by volume. Filtering to "Sold Items" + "Completed Listings" shows actual transaction prices, not asking prices, close to real-time and across every grade tier and condition.',
    watch: 'Titles can misstate grade/centering/edition; includes best-offer and relisted items that can understate or overstate the real clearing price; thin for very high-end or very obscure cards.',
  },
  {
    source: 'SportsCardsPro / PriceCharting',
    strength: 'A price-guide index built by aggregating marketplace sales (mainly eBay) into grade-bucketed historical charts — SportsCardsPro for sports cards, PriceCharting for Pokémon and other TCGs. Good for seeing the trend line and the price ratio between grades at a glance.',
    watch: 'It is a smoothed index, not a live order book — it can lag a fast move (up or down) and thin out on low-population or newly released cards where it has few underlying sales to work from.',
  },
  {
    source: 'Major auction houses (Heritage, Goldin, PWCC, etc.)',
    strength: 'Best data for the true high end — vetted consignments, public bidding, buyer’s premium disclosed.',
    watch: 'Only covers the top slice of the market; auction fever and marketing pushes can inflate single results.',
  },
]

const CHECKLIST = [
  'Same grading company and exact grade as the comp, not just "graded."',
  'Recency — weight sales from the last 30–90 days far more than a comp from a year ago in a fast-moving market.',
  'Sample size — one sale is an anecdote; look for at least several recent, consistent sales before trusting a number.',
  'Venue — auction hammer price plus buyer’s premium vs. marketplace buy-it-now can differ meaningfully for the same grade.',
  'Eye appeal within grade — centering, color strike, and print quality vary between copies of the same numeric grade.',
  'Outlier awareness — a single inflated or crashed sale (bidding war, panic sale) should not reset your whole mental model.',
]

const DRIVERS = [
  { factor: 'Subject significance', detail: 'Hall-of-Fame or all-time-great player; flagship/iconic Pokémon character.' },
  { factor: 'Card status', detail: 'Rookie card, first-edition print, a documented "first" of some kind.' },
  { factor: 'Grade & subgrades', detail: 'Numeric grade plus, where available, centering/corners/edges/surface subgrades.' },
  { factor: 'Population scarcity', detail: 'How many exist at this grade or higher, from the grading company’s own pop report.' },
  { factor: 'Visual appeal', detail: 'Art quality, color strike, pattern (for holos/refractors) — subjective but consistently priced into premiums.' },
  { factor: 'Autograph / relic quality', detail: 'On-card vs. sticker auto, patch size and color count, for sports memorabilia cards.' },
  { factor: 'Set & era significance', detail: 'Flagship sets and historically important releases hold value better than filler products from the same period.' },
  { factor: 'Liquidity of this exact card/grade', detail: 'Some grade tiers trade weekly; others might not trade for a year, which widens the realistic bid/ask spread.' },
]

export default function Pricing() {
  return (
    <div>
      <PageHeader
        eyebrow="Pillar 4"
        title="Pricing Framework: Reading Comps & Guides"
        lede="There is no central exchange for trading cards, so 'the price' is really a distribution of recent comparable sales. Learning to read that distribution — and to discount stale guide numbers — is the core skill for pricing any card."
      />

      <Section title="Where price data actually comes from">
        <Table
          head={['Source', 'Strength', 'What to watch for']}
          rows={SOURCES.map((s) => [s.source, s.strength, s.watch])}
        />
        <Callout tone="info" title="How practitioners actually combine the two" className="mt-4">
          The standard workflow is: use SportsCardsPro/PriceCharting to see the shape — the trend
          over time and the price ratio between grades (how much more a 10 is worth than a 9 for
          this specific card) — then confirm the current number against a handful of the most
          recent eBay sold comps at your exact grade, since the index can lag a fast-moving card.
          Neither source alone is enough; the index can be stale, and any single eBay sale can be
          an outlier.
        </Callout>
      </Section>

      <Section
        title="Look up real comps"
        subtitle="Type a card and grade below to open a pre-filled search on eBay's sold listings and on the matching PriceCharting-network price guide. Nothing here is fetched, cached, or scraped — it just builds the search URL for you."
      >
        <CompSearch />
      </Section>

      <Section
        title="Why price guides lag reality"
        subtitle="Guides are a convenient anchor, never a live price."
      >
        <Grid cols={2}>
          <Card>
            <h3 className="text-base font-semibold text-white">Update cadence</h3>
            <p className="mt-2 text-sm leading-relaxed text-ink-400">
              Most guides refresh on a periodic schedule, not continuously. In a fast-moving
              market (hype spike or crash), the published number can trail real trading prices by
              weeks or months.
            </p>
          </Card>
          <Card>
            <h3 className="text-base font-semibold text-white">Thin data on the long tail</h3>
            <p className="mt-2 text-sm leading-relaxed text-ink-400">
              For anything outside the most popular cards and grades, guides may extrapolate from
              very few actual sales — sometimes a single outlier sale defines the listed price for
              months.
            </p>
          </Card>
        </Grid>
        <Callout tone="warn" title="Guide price is a floor for research, not a ceiling for negotiation" className="mt-4">
          Treat a guide number as a starting hypothesis to be checked against recent actual comps
          — never as proof of what a card will sell for today, in either direction.
        </Callout>
      </Section>

      <Section
        title="Comp-reading checklist"
        subtitle="Before trusting a comparable sale as a basis for pricing, run it through this list."
      >
        <Card>
          <ol className="space-y-3 text-sm text-ink-300">
            {CHECKLIST.map((c, i) => (
              <li key={i} className="flex gap-3">
                <span className="mt-0.5 flex h-5 w-5 flex-none items-center justify-center rounded-full bg-brand-500/20 text-xs font-semibold text-brand-300">
                  {i + 1}
                </span>
                <span>{c}</span>
              </li>
            ))}
          </ol>
        </Card>
      </Section>

      <Section
        title="What actually drives a card's price"
        subtitle="A working checklist of the factors that separate a $20 card from a $20,000 card, independent of any single price guide."
      >
        <Table head={['Factor', 'What it means']} rows={DRIVERS.map((d) => [d.factor, d.detail])} />
      </Section>
    </div>
  )
}
