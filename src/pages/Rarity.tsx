import { Callout, Card, Grid, PageHeader, Section, Table } from '../components/ui'

const POKEMON_SYMBOLS = [
  ['●  Circle', 'Common', 'Most cards in any set. Baseline value unless the character or art drives demand.'],
  ['◆  Diamond', 'Uncommon', 'Slightly scarcer print slot than common; rarely a price driver on its own.'],
  ['★  Star', 'Rare (non-holo)', 'One rare slot per pack in most eras; still mass-produced relative to chase cards.'],
  ['★ (holo)', 'Rare Holo', 'Foil rare — the classic "hit" slot collectors opened packs for pre-2010s.'],
  ['Full Art / EX / GX / V', 'Modern holo rare tiers', 'Extended artwork bleeding past the normal frame; sits above standard holo rares.'],
  ['Rainbow / Alt Art / Secret Rare', 'Secret / chase rare', 'Numbered above the set’s stated card count (e.g., 215/203) — the modern chase slot.',],
]

const POKEMON_ERAS = [
  {
    era: 'Base Set (1999)',
    notes: '1st Edition (shadowless, stamped) > Shadowless (no shadow behind the artwork box) > Unlimited. The 1st Edition stamp and shadowless printing were only used for a short early print window, making them the scarcest and most valuable of the three otherwise-identical prints.',
  },
  {
    era: 'WOTC era (1999–2003)',
    notes: 'Wizards of the Coast printed the earliest English sets in smaller, less predictable runs than the modern era; many WOTC holos are genuinely scarcer in top grade due to print/centering issues, not just nostalgia.',
  },
  {
    era: 'EX / Diamond & Pearl / Black & White (2003–2013)',
    notes: 'Introduced EX, LV.X, and full-art trainer/secret rares; still smaller overall print runs than the modern boom era.',
  },
  {
    era: 'Sun & Moon (2017–2019)',
    notes: 'Rainbow Rares debuted here, a highly collected secret-rare treatment that became a template for later sets.',
  },
  {
    era: 'Sword & Shield / Scarlet & Violet (2020–present)',
    notes: 'Print runs scaled dramatically to meet pandemic-era and post-boom demand; the same nominal rarity tier (e.g., Alternate Art) is printed in far larger quantities than a 2003 equivalent, which matters for long-run scarcity even when short-term hype is high.',
  },
]

const SPORTS_TYPES = [
  {
    type: 'Base card',
    detail: 'The standard card for a player in a set, no special treatment. Usually the least valuable version unless it’s a notable rookie card.',
  },
  {
    type: 'Parallel',
    detail: 'A reprint of the base design in a different color, finish, or material (Prizm silver/gold/color scales, Chrome refractors, etc.), often serial numbered.',
  },
  {
    type: 'Insert',
    detail: 'A separate subset with its own design, inserted at a set ratio per box/case rather than one per player per set.',
  },
  {
    type: 'Autograph',
    detail: 'On-card autographs (signed directly on the card) generally command a premium over sticker autographs (signed on a separate sticker, then applied) because on-card is seen as harder to produce cleanly and more traditional.',
  },
  {
    type: 'Relic / patch',
    detail: 'Includes a swatch of game-worn or event-worn material. Patch size, color, and whether it includes a logo or multiple colors materially affects value versus a plain single-color swatch.',
  },
  {
    type: 'Rookie card (RC)',
    detail: 'A player’s first licensed card. Because a rookie card is issued once and demand can grow for years afterward if the player becomes a star, RCs of eventual Hall of Famers carry outsized long-run premiums versus later-year cards of the same player.',
  },
]

export default function Rarity() {
  return (
    <div>
      <PageHeader
        eyebrow="Pillar 2"
        title="Rarity Mechanics: Pokémon & Sports Cards"
        lede="Rarity printed on a card and rarity in the market are two different things. This page covers how each hobby encodes scarcity into the product, and where that signal is reliable versus misleading."
      />

      <Callout tone="warn" title="The core trap: printed rarity ≠ market scarcity">
        A modern Pokémon secret rare can still be printed in the millions if the set had a huge
        run; a sports insert numbered to /99 can be worthless if the player never mattered. Rarity
        tier is one input into value — it has to be multiplied by demand for that specific card,
        not read as a value on its own.
      </Callout>

      <Section
        id="pokemon"
        title="Pokémon: rarity symbols and set eras"
        subtitle="Rarity symbols tell you the print slot within a pack, not the print run of the set — those are two independent variables."
      >
        <Table
          head={['Symbol / label', 'Tier', 'What it signals']}
          rows={POKEMON_SYMBOLS}
        />
        <h3 className="mt-8 text-base font-semibold text-white">Era matters as much as the symbol</h3>
        <div className="mt-4 space-y-4">
          {POKEMON_ERAS.map((e) => (
            <Card key={e.era}>
              <p className="font-semibold text-white">{e.era}</p>
              <p className="mt-1.5 text-sm leading-relaxed text-ink-400">{e.notes}</p>
            </Card>
          ))}
        </div>
        <Callout tone="info" title="Promos are their own category" className="mt-6">
          Promotional cards (tournament prizes, event exclusives, staff/employee cards) sidestep
          the normal rarity system entirely. Distribution can range from thousands (a mail-in
          promo) to single digits (tournament trophy cards), so promos require researching actual
          distribution numbers rather than reading a symbol.
        </Callout>
      </Section>

      <Section
        id="sports"
        title="Sports cards: parallels, inserts, and serial numbering"
        subtitle="Unlike Pokémon, modern sports cards usually print the exact scarcity on the card itself as a serial number — a more verifiable signal, but still only half the picture."
      >
        <Grid cols={2}>
          {SPORTS_TYPES.map((s) => (
            <Card key={s.type}>
              <h3 className="text-base font-semibold text-white">{s.type}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink-400">{s.detail}</p>
            </Card>
          ))}
        </Grid>

        <h3 className="mt-8 text-base font-semibold text-white">Reading a serial number</h3>
        <Card className="mt-4">
          <p className="text-sm leading-relaxed text-ink-300">
            A card marked <span className="font-mono text-white">7/10</span> means it is the 7th
            of exactly 10 copies printed in that parallel — a hard, verifiable cap, unlike
            Pokémon print runs which are rarely disclosed. But low serial numbers only command a
            premium when paired with demand: a /5 parallel of a bench player is still a /5
            parallel of a bench player. The tightest, most liquid combination is a star or
            rookie-year player with both a low serial number and an on-card autograph or
            meaningful patch.
          </p>
        </Card>

        <h3 className="mt-8 text-base font-semibold text-white">Vintage short prints</h3>
        <Card className="mt-4">
          <p className="text-sm leading-relaxed text-ink-300">
            Older sets have their own scarcity quirks unrelated to modern parallels. The classic
            example is the 1952 Topps set, where the high-numbered series (cards printed later in
            the season, including Mickey Mantle&rsquo;s card) sold more slowly and were produced
            in smaller quantities, making that entire number range scarcer today regardless of
            any explicit rarity marking.
          </p>
        </Card>
      </Section>

      <Section title="Synthesis: what rarity actually predicts">
        <Grid cols={2}>
          <Callout tone="good" title="Rarity signal tends to be reliable when...">
            It comes with a verifiable, hard cap (serial numbering, a documented short print, a
            one-time promo distribution) and is paired with durable demand for the subject
            (a star player, a flagship Pokémon, a widely collected set).
          </Callout>
          <Callout tone="danger" title="Rarity signal tends to mislead when...">
            It&rsquo;s a named tier with an unknown or large print run, the subject has thin or
            speculative demand (a rookie who hasn&rsquo;t proven anything yet, a set riding a
            short-term hype wave), or the &ldquo;rare&rdquo; treatment was itself printed at high
            volume to meet a demand spike.
          </Callout>
        </Grid>
      </Section>
    </div>
  )
}
