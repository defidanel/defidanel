import { ChartCard } from '../components/ChartCard'
import { Callout, Card, Grid, PageHeader, Section } from '../components/ui'
import { hypeCycle, popGrowth } from '../data/marketCharts'

export default function Market() {
  return (
    <div>
      <PageHeader
        eyebrow="Pillar 3"
        title="Market Dynamics: Supply, Demand & Hype Cycles"
        lede="A single card's print run is fixed the day it's printed, but the effective supply that trades in the market changes constantly — driven by submission rates, sealed product breaks, and demand that swings with hype."
      />

      <Section
        title="Three kinds of supply"
        subtitle="'Supply' means different things depending on which layer of the market you're looking at."
      >
        <Grid cols={3}>
          <Card>
            <h3 className="text-base font-semibold text-white">Print run supply</h3>
            <p className="mt-2 text-sm leading-relaxed text-ink-400">
              The total number of physical copies printed. Fixed at production time, rarely
              disclosed precisely, and the least useful number for day-to-day pricing decisions.
            </p>
          </Card>
          <Card>
            <h3 className="text-base font-semibold text-white">Graded supply</h3>
            <p className="mt-2 text-sm leading-relaxed text-ink-400">
              The population that has actually been submitted and graded at each grade tier.
              This grows continuously as owners submit more raw copies, and is the number that
              shows up in pop reports.
            </p>
          </Card>
          <Card>
            <h3 className="text-base font-semibold text-white">Float / liquid supply</h3>
            <p className="mt-2 text-sm leading-relaxed text-ink-400">
              Copies actually offered for sale at a given time. Usually a small fraction of
              graded supply — most graded copies sit in collections or safe deposit boxes and
              never list.
            </p>
          </Card>
        </Grid>
      </Section>

      <Section
        title="Population growth is a slow headwind on high-grade prices"
        subtitle="Because submission volume rises whenever hype rises, a card's graded population tends to grow fastest exactly when demand is also peaking — masking the long-run dilution until hype cools."
      >
        <ChartCard
          title="Graded population over time (illustrative)"
          subtitle="Pop-10 count for a single card after release, as more raw copies get submitted"
          data={popGrowth}
          dataKey="pop10"
          color="#8b7cf0"
          yLabel="Pop-10 count"
        />
        <Callout tone="warn" title="Why this catches new collectors off guard" className="mt-4">
          A card that looks scarce with 40 PSA 10s at release can have 2,000+ within a few years.
          If demand stays flat while supply grows 50x, price per copy falls even though the card
          is objectively still "rare" relative to the world's population of collectors — the
          right comparison is supply growth versus demand growth, not the absolute pop count.
        </Callout>
      </Section>

      <Section
        title="Hype cycles"
        subtitle="Most breakout cards follow a recognizable shape: a rapid run-up driven by attention, a correction once new supply and cooler heads catch up, and a lower, more stable long-run level set by durable collector demand."
      >
        <ChartCard
          title="Hype cycle price path (illustrative)"
          subtitle="A typical shape for a card that catches a wave of attention"
          data={hypeCycle}
          dataKey="price"
          color="#e8c158"
          yLabel="Price (index)"
        />
        <Grid cols={2} className="mt-4">
          <Card>
            <h3 className="text-base font-semibold text-white">What drives the run-up</h3>
            <ul className="mt-2 space-y-2 text-sm leading-relaxed text-ink-400">
              <li>A new set or product launch with limited early supply.</li>
              <li>A breakout on-field/in-game performance for a rookie or young player.</li>
              <li>Broader risk-on conditions that push speculative money into collectibles.</li>
              <li>Social and financial media attention creating a feedback loop of new buyers.</li>
            </ul>
          </Card>
          <Card>
            <h3 className="text-base font-semibold text-white">What drives the correction</h3>
            <ul className="mt-2 space-y-2 text-sm leading-relaxed text-ink-400">
              <li>Manufacturers and sellers responding to demand with more print runs and reprints.</li>
              <li>Graded population catching up as submission backlogs clear.</li>
              <li>Short-term buyers exiting once price momentum stalls.</li>
              <li>Broader liquidity tightening (higher rates, less speculative capital generally).</li>
            </ul>
          </Card>
        </Grid>
      </Section>

      <Section
        title="Sealed product and the singles market are linked"
        subtitle="Sealed wax (packs and boxes) behaves like a call option on pulling a chase card, and its supply dynamics feed directly into singles prices."
      >
        <Card>
          <p className="text-sm leading-relaxed text-ink-300">
            When a product is actively being manufactured, sealed supply is elastic — if prices
            rise, more gets printed (for modern sports and Pokémon product) or more sealed
            inventory gets released from distributor warehouses. Once a product is discontinued,
            sealed supply becomes fixed and can only shrink, as boxes get opened for the singles
            inside. That creates two linked but distinct markets:
          </p>
          <ul className="mt-4 space-y-2 text-sm text-ink-300">
            <li>
              <span className="font-semibold text-white">Sealed collectors</span> bet on the box
              itself becoming scarce and valuable as a time capsule, independent of what&rsquo;s
              inside any single pack.
            </li>
            <li>
              <span className="font-semibold text-white">Box breakers</span> open sealed product
              specifically to pull and sell the valuable singles, which increases the supply of
              raw and graded singles while decreasing the supply of sealed product — the price of
              chase singles and the price of sealed boxes tend to move together because breakers
              do this math constantly and stop breaking when it's no longer profitable.
            </li>
          </ul>
        </Card>
      </Section>
    </div>
  )
}
