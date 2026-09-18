import { Callout, Card, Grid, PageHeader, Section, Table } from '../components/ui'

const SCALES = [
  {
    grader: 'PSA',
    top: 'PSA 10 (Gem Mint)',
    notes: 'Largest submission volume and deepest population data. The de facto benchmark scale for both sports and Pokémon; "PSA 10" is used informally even for cards graded elsewhere.',
  },
  {
    grader: 'BGS / Beckett',
    top: 'BGS 10 Pristine / BGS 9.5 Gem Mint',
    notes: 'Grades four sub-categories (centering, corners, edges, surface) and prints them on the label. A "Black Label" 10 requires 10s in all four subgrades and is rarer than a plain 10.',
  },
  {
    grader: 'CGC',
    top: 'CGC 10 Pristine / CGC 9.5 Gem Mint',
    notes: 'Newer entrant that has taken meaningful share in Pokémon grading; also grades comics. Uses a similar half-point scale and subgrades to BGS.',
  },
  {
    grader: 'SGC',
    top: 'SGC 10 Pristine / SGC 9.5 Gem Mint',
    notes: 'Historically strong for vintage cards; known for tamper-evident holders and a grading approach some collectors view as stricter on vintage paper stock.',
  },
]

const FACTORS = [
  {
    name: 'Centering',
    detail: 'How evenly the image is framed within the border, usually judged front and back (e.g., 55/45 vs 60/40). The single most common reason a card misses Gem Mint.',
  },
  {
    name: 'Corners',
    detail: 'Sharpness of all four corners under magnification. Factory cutting, pack-fresh handling, and case/box wear all affect this before a card ever reaches a collector.',
  },
  {
    name: 'Edges',
    detail: 'Whiteness and smoothness along all four edges. Chipping shows as small white or dark flecks and is common on dark-bordered cards where any wear is highly visible.',
  },
  {
    name: 'Surface',
    detail: 'Print lines, scratches, indentations, and gloss/finish integrity. Holographic and foil cards are especially prone to visible surface flaws under raking light.',
  },
]

const ECONOMICS = [
  {
    tier: 'Bulk / Value',
    turnaround: 'Weeks to months',
    costRange: '$15–$25 / card',
    fit: 'Cards with modest raw value where grading is mainly about authentication or long-term storage, not a big price jump.',
  },
  {
    tier: 'Regular',
    turnaround: '~1–2 months',
    costRange: '$25–$50 / card',
    fit: 'Mid-value cards where the grade materially changes the sale price and the wait is acceptable.',
  },
  {
    tier: 'Express / Premium',
    turnaround: 'Days to a few weeks',
    costRange: '$100+ / card, often scaled to declared value',
    fit: 'High-value or time-sensitive cards (e.g., ahead of a specific sale) where speed and often a value guarantee justify the premium.',
  },
]

export default function Grading() {
  return (
    <div>
      <PageHeader
        eyebrow="Pillar 1"
        title="Grading Systems & Population Reports"
        lede="Third-party grading turns a subjective 'how nice is this card' into a standardized, publicly tracked number. That standardization is what makes cards liquid enough to trade like an asset — and understanding how it works is the foundation for everything else in this guide."
      />

      <Section
        title="The major grading companies"
        subtitle="Each company uses its own scale and holder, and the market prices the same nominal grade differently depending on which company issued it."
      >
        <Table
          head={['Company', 'Top grade', 'What to know']}
          rows={SCALES.map((s) => [s.grader, s.top, s.notes])}
        />
        <Callout tone="info" title="Grades aren't fungible across companies" className="mt-4">
          A PSA 10 and a BGS 9.5 can sell for very different prices even when the physical card
          condition is comparable, because collectors trust and demand each label differently by
          category (PSA dominates modern sports and vintage; BGS Black Label carries its own
          premium; CGC has grown fast in Pokémon). Always compare comps within the same grading
          company and grade, not just "graded" vs. "raw."
        </Callout>
      </Section>

      <Section
        title="What actually separates a 9 from a 10"
        subtitle="Graders evaluate four core factors. A flaw in any one of them can cap the overall grade, even if the other three are flawless."
      >
        <Grid cols={2}>
          {FACTORS.map((f) => (
            <Card key={f.name}>
              <h3 className="text-base font-semibold text-white">{f.name}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-400">{f.detail}</p>
            </Card>
          ))}
        </Grid>
      </Section>

      <Section
        title="Population reports"
        subtitle="Every grading company publishes a population (“pop”) report showing how many copies of a given card have received each grade."
      >
        <Card>
          <p className="text-sm leading-relaxed text-ink-300">
            A pop report is the closest thing the hobby has to a real-time supply gauge for
            graded copies. Two numbers matter more than the raw pop count:
          </p>
          <ul className="mt-4 space-y-3 text-sm text-ink-300">
            <li>
              <span className="font-semibold text-white">Gem rate</span> — the share of graded
              copies that hit the top grade. A card with a naturally low gem rate (bad factory
              centering, a fragile foil pattern, dark borders) makes true Gem Mint copies scarce
              even from a huge print run.
            </li>
            <li>
              <span className="font-semibold text-white">Pop growth over time</span> — pop counts
              only go up as more raw copies get submitted. A card that looked scarce in a PSA 10
              at launch can see its population triple within a year as the hype cycle drives more
              submissions, which is a headwind on price even if demand stays flat.
            </li>
          </ul>
        </Card>
      </Section>

      <Section
        title="The economics of submitting a card"
        subtitle="Grading is a bet: you're paying money and waiting months for a company to tell you a number that determines most of the card's resale value."
      >
        <Table
          head={['Service tier', 'Typical turnaround', 'Typical cost', 'Best fit']}
          rows={ECONOMICS.map((e) => [e.tier, e.turnaround, e.costRange, e.fit])}
        />
        <Grid cols={2} className="mt-4">
          <Callout tone="warn" title="Crossover and regrade risk">
            Submitting a card already graded by one company to another ("crossover"), or
            resubmitting a card hoping for a higher grade ("regrade"), both carry the risk the
            card comes back with a lower grade, a body bag (no grade due to alteration or
            damage), or crosses into a holder that breaks even if it doesn&rsquo;t requalify at
            the original number.
          </Callout>
          <Callout tone="danger" title="Altered and trimmed cards">
            Trimming, recoloring, and pressing are used to disguise damage or artificially sharpen
            corners and edges. Reputable graders detect most of it, but altered cards that slip
            through — or get "body bagged" and then reappear raw — are a real authenticity risk in
            the vintage market especially.
          </Callout>
        </Grid>
      </Section>

      <Callout tone="good" title="Rule of thumb before submitting">
        Estimate the price delta between the raw card and each likely grade outcome, weight by
        your honest probability of hitting each grade, subtract grading cost + shipping +
        insurance + the time value of waiting, and only submit if the expected value is clearly
        positive. The Grading ROI Calculator in this guide does exactly this math.
      </Callout>
    </div>
  )
}
