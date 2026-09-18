import { Callout, Card, Grid, PageHeader, Section, Table } from '../components/ui'

const RISKS = [
  {
    name: 'Liquidity risk',
    detail: 'Even a well-known card can take weeks to sell at a fair price, and moving a large position quickly usually means accepting a discount. Unlike public equities, there is no continuous two-sided market.',
  },
  {
    name: 'Authentication & alteration risk',
    detail: 'Counterfeit cards, trimmed edges, recolored borders, and pressed surfaces exist across both hobbies. Third-party grading reduces but does not eliminate this risk.',
  },
  {
    name: 'Condition/custody risk',
    detail: 'Physical cards can be damaged, lost, or degrade (sun-fading, humidity, bent corners) in storage or transit — a risk with no equivalent for a purely financial asset.',
  },
  {
    name: 'Concentration risk',
    detail: 'A collection is often concentrated in a handful of cards, sets, players, or eras. A narrative shift (injury, scandal, a set falling out of favor) can hit a large share of the portfolio at once.',
  },
  {
    name: 'Price volatility & reflexivity',
    detail: 'Prices are set by a relatively small number of active buyers and sellers, so sentiment swings translate into large price moves — and rising prices themselves often attract more speculative buying, amplifying the cycle in both directions.',
  },
  {
    name: 'Carrying costs',
    detail: 'Grading fees, shipping/insurance in transit, secure storage, and insurance premiums are all real, recurring costs that erode returns and are easy to underestimate.',
  },
  {
    name: 'Transaction costs',
    detail: 'Auction house buyer’s and seller’s premiums, marketplace fees, and payment processing fees commonly total 15–25% round-trip on a sale — a meaningful hurdle rate before any position is even profitable.',
  },
  {
    name: 'Regulatory & tax complexity',
    detail: 'Collectibles are frequently taxed differently from securities in many jurisdictions (e.g., higher long-term capital gains rates in the U.S.), and record-keeping for cost basis is entirely on the collector.',
  },
]

const COMPARISON = [
  ['Public equities', 'Very high', 'None (electronic)', 'Low (regulated exchange)', 'High'],
  ['Gold / bullion', 'High', 'Low–moderate (vaulting)', 'Low (assay standards)', 'Low'],
  ['Fine art', 'Low', 'High (climate control, insurance)', 'High (provenance research)', 'Very low'],
  ['Graded trading cards', 'Low–moderate', 'Moderate (safe/vault, insurance)', 'Moderate (grading helps, not perfect)', 'Very low'],
  ['Raw (ungraded) cards', 'Low', 'Low', 'High (buyer must judge authenticity)', 'Very low'],
]

const REDFLAGS = [
  'A "graded" card offered outside its official holder, or a holder that looks scratched, reglued, or mismatched to the label.',
  'Edges that look unnaturally sharp or a border that looks slightly too wide/narrow versus known genuine examples — signs of trimming.',
  'Colors that look too vivid or a surface that looks artificially glossy — signs of recoloring or pressing.',
  'A price dramatically below recent comps with pressure to buy immediately, especially off-platform.',
  'Autographs without any certification (no on-card grading authentication and no separate letter of authenticity) on a high-value signed card.',
  'Serial numbers, patch descriptions, or set details in the listing that don’t match what’s documented for that product.',
]

export default function Risk() {
  return (
    <div>
      <PageHeader
        eyebrow="Pillar 5"
        title="Risk, Reward & Cards as an Alternative Asset"
        lede="Collectible cards share some structural features with other alternative assets — but the risk profile is closer to fine art or rare wine than to gold or equities. This page lays out the risks explicitly so 'alternative asset' isn't just a marketing phrase."
      />

      <Section
        title="The risk taxonomy"
        subtitle="Most of these risks don't show up in a price chart, but they show up in realized returns."
      >
        <Grid cols={2}>
          {RISKS.map((r) => (
            <Card key={r.name}>
              <h3 className="text-base font-semibold text-white">{r.name}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-400">{r.detail}</p>
            </Card>
          ))}
        </Grid>
      </Section>

      <Section
        title="How cards compare to other assets"
        subtitle="A rough, directional comparison — actual figures vary a lot by specific card, set, and market conditions."
      >
        <Table
          head={['Asset', 'Liquidity', 'Storage/insurance cost', 'Authentication complexity', 'Price transparency']}
          rows={COMPARISON}
        />
      </Section>

      <Section
        title="Thinking about portfolio allocation"
        subtitle="If cards are held with investment intent (rather than purely as a hobby), a few principles from alternative-asset allocation carry over directly."
      >
        <Grid cols={2}>
          <Card>
            <h3 className="text-base font-semibold text-white">Size it like a speculative satellite position</h3>
            <p className="mt-2 text-sm leading-relaxed text-ink-400">
              Given the illiquidity, authentication risk, and concentration typical of a card
              collection, most allocation frameworks for alternative and speculative assets treat
              this bucket as a small satellite position sized to what you could fully lose without
              affecting your financial plan — not a core holding.
            </p>
          </Card>
          <Card>
            <h3 className="text-base font-semibold text-white">Diversify within the collection</h3>
            <p className="mt-2 text-sm leading-relaxed text-ink-400">
              Spreading exposure across multiple players/characters, sets, and eras reduces the
              risk that a single narrative shift (an injury, a set falling out of favor) impairs
              the whole collection at once — the same logic as not holding a single stock.
            </p>
          </Card>
          <Card>
            <h3 className="text-base font-semibold text-white">Underwrite the full round-trip cost</h3>
            <p className="mt-2 text-sm leading-relaxed text-ink-400">
              Grading fees, shipping/insurance, marketplace or auction fees on both the buy and
              sell side, and storage/insurance while holding can easily total 20–30% of a card's
              value over a full buy-hold-sell cycle. A position only makes sense once expected
              appreciation clears that bar.
            </p>
          </Card>
          <Card>
            <h3 className="text-base font-semibold text-white">Expect low or unstable correlation to markets</h3>
            <p className="mt-2 text-sm leading-relaxed text-ink-400">
              Card prices are driven by hobby-specific supply/demand and by discretionary spending
              capacity, which tends to track broader risk appetite loosely rather than move
              independently — don't assume cards are a reliable hedge against equity drawdowns.
            </p>
          </Card>
        </Grid>
      </Section>

      <Section
        title="Authenticity red flags"
        subtitle="Before a high-value purchase, especially of a raw or independently-slabbed card, check for these warning signs."
      >
        <Callout tone="danger" title="Checklist before buying">
          <ul className="space-y-2">
            {REDFLAGS.map((f, i) => (
              <li key={i} className="flex gap-2">
                <span className="mt-1 h-1 w-1 flex-none rounded-full bg-bad-500" />
                <span>{f}</span>
              </li>
            ))}
          </ul>
        </Callout>
      </Section>

      <Callout tone="info" title="The honest summary">
        Grading and population reports give the card market more structure and price transparency
        than most collectibles have ever had, which is a real improvement in market quality. But
        structure is not the same as safety: illiquidity, authentication risk, and sentiment-driven
        volatility are permanent features of this market, not temporary inefficiencies waiting to
        be arbitraged away. Size positions, diversify, and underwrite costs accordingly.
      </Callout>
    </div>
  )
}
