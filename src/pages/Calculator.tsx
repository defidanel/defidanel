import { useMemo, useState } from 'react'
import { Callout, Card, PageHeader, Section } from '../components/ui'

type Row = { label: string; value: number; probability: number }

const DEFAULT_ROWS: Row[] = [
  { label: 'Grade 10', value: 600, probability: 20 },
  { label: 'Grade 9', value: 220, probability: 45 },
  { label: 'Grade 8', value: 140, probability: 25 },
  { label: 'Grade 7 or lower / no grade', value: 60, probability: 10 },
]

const currency = (n: number) =>
  n.toLocaleString('en-US', { style: 'currency', currency: 'USD', maximumFractionDigits: 0 })

function NumberField({
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

export default function Calculator() {
  const [rawValue, setRawValue] = useState(150)
  const [gradingCost, setGradingCost] = useState(30)
  const [sellingFeePct, setSellingFeePct] = useState(13)
  const [holdingCost, setHoldingCost] = useState(10)
  const [rows, setRows] = useState<Row[]>(DEFAULT_ROWS)

  const probSum = rows.reduce((s, r) => s + (r.probability || 0), 0)

  const { weightedGross, expectedNetGraded, netRawNow, evOfGrading, breakdown } = useMemo(() => {
    const norm = probSum > 0 ? probSum : 1
    const breakdown = rows.map((r) => ({
      ...r,
      weight: (r.probability || 0) / norm,
      contribution: r.value * ((r.probability || 0) / norm),
    }))
    const weightedGross = breakdown.reduce((s, r) => s + r.contribution, 0)
    const expectedNetGraded =
      weightedGross * (1 - sellingFeePct / 100) - gradingCost - holdingCost
    const netRawNow = rawValue * (1 - sellingFeePct / 100)
    const evOfGrading = expectedNetGraded - netRawNow
    return { weightedGross, expectedNetGraded, netRawNow, evOfGrading, breakdown }
  }, [rows, probSum, sellingFeePct, gradingCost, holdingCost, rawValue])

  function updateRow(i: number, patch: Partial<Row>) {
    setRows((prev) => prev.map((r, idx) => (idx === i ? { ...r, ...patch } : r)))
  }

  return (
    <div>
      <PageHeader
        eyebrow="Tool"
        title="Grading ROI Calculator"
        lede="Model whether submitting a raw card for grading is worth it, given your own estimate of the value at each likely grade outcome and the probability of hitting it. This uses your inputs only — it does not look up or predict real prices."
      />

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-5">
        <div className="space-y-6 lg:col-span-3">
          <Section title="1. Baseline & costs">
            <Card>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <NumberField
                  label="Current raw (ungraded) value"
                  value={rawValue}
                  onChange={setRawValue}
                  prefix="$"
                />
                <NumberField
                  label="Grading cost (fee + shipping + insurance)"
                  value={gradingCost}
                  onChange={setGradingCost}
                  prefix="$"
                />
                <NumberField
                  label="Selling fees (marketplace / auction, applied both ways)"
                  value={sellingFeePct}
                  onChange={setSellingFeePct}
                  suffix="%"
                />
                <NumberField
                  label="Holding / time-value cost while waiting"
                  value={holdingCost}
                  onChange={setHoldingCost}
                  prefix="$"
                />
              </div>
            </Card>
          </Section>

          <Section
            title="2. Grade outcomes"
            subtitle="Enter your honest estimate of resale value at each grade, and the probability (as a percentage) you'd assign to landing there. Probabilities don't need to add to exactly 100 — they're normalized automatically."
          >
            <Card>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[480px] border-collapse text-sm">
                  <thead>
                    <tr className="text-left text-xs font-medium uppercase tracking-wide text-ink-400">
                      <th className="pb-3">Outcome</th>
                      <th className="pb-3">Est. value</th>
                      <th className="pb-3">Probability</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((r, i) => (
                      <tr key={r.label} className="border-t border-ink-700/60">
                        <td className="py-3 pr-3 text-ink-200">{r.label}</td>
                        <td className="py-3 pr-3">
                          <div className="flex items-center overflow-hidden rounded-lg border border-ink-600 bg-ink-950 focus-within:border-brand-400">
                            <span className="pl-2.5 text-xs text-ink-500">$</span>
                            <input
                              type="number"
                              value={r.value}
                              onChange={(e) => updateRow(i, { value: e.target.valueAsNumber || 0 })}
                              className="w-full bg-transparent px-2 py-1.5 text-sm text-white outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                            />
                          </div>
                        </td>
                        <td className="py-3">
                          <div className="flex items-center overflow-hidden rounded-lg border border-ink-600 bg-ink-950 focus-within:border-brand-400">
                            <input
                              type="number"
                              value={r.probability}
                              onChange={(e) =>
                                updateRow(i, { probability: e.target.valueAsNumber || 0 })
                              }
                              className="w-full bg-transparent px-2 py-1.5 text-sm text-white outline-none [appearance:textfield] [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
                            />
                            <span className="pr-2.5 text-xs text-ink-500">%</span>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <p className="mt-3 text-xs text-ink-500">
                Probabilities entered sum to {probSum.toFixed(0)}% — normalized to 100% in the
                calculation below.
              </p>
            </Card>
          </Section>

          <Section title="Contribution to expected value">
            <Card>
              <ul className="space-y-2 text-sm">
                {breakdown.map((r) => (
                  <li key={r.label} className="flex items-center justify-between gap-3">
                    <span className="text-ink-300">
                      {r.label}
                      <span className="ml-2 text-xs text-ink-500">
                        ({(r.weight * 100).toFixed(0)}% weight)
                      </span>
                    </span>
                    <span className="font-mono text-white">{currency(r.contribution)}</span>
                  </li>
                ))}
              </ul>
            </Card>
          </Section>
        </div>

        <div className="space-y-6 lg:col-span-2">
          <Section title="3. Result">
            <div className="space-y-3">
              <Card>
                <p className="text-xs font-medium uppercase tracking-wide text-ink-400">
                  Probability-weighted graded value (gross)
                </p>
                <p className="mt-1.5 text-2xl font-bold text-white">{currency(weightedGross)}</p>
              </Card>
              <Card>
                <p className="text-xs font-medium uppercase tracking-wide text-ink-400">
                  Expected net proceeds if you grade
                </p>
                <p className="mt-1.5 text-2xl font-bold text-white">
                  {currency(expectedNetGraded)}
                </p>
                <p className="mt-1 text-xs text-ink-500">
                  After selling fees, grading cost, and holding cost
                </p>
              </Card>
              <Card>
                <p className="text-xs font-medium uppercase tracking-wide text-ink-400">
                  Net proceeds if you sell raw now
                </p>
                <p className="mt-1.5 text-2xl font-bold text-white">{currency(netRawNow)}</p>
                <p className="mt-1 text-xs text-ink-500">After selling fees only</p>
              </Card>
              <Card
                className={
                  evOfGrading >= 0
                    ? 'border-good-500/40 bg-good-500/10'
                    : 'border-bad-500/40 bg-bad-500/10'
                }
              >
                <p className="text-xs font-medium uppercase tracking-wide text-ink-300">
                  Expected value of grading vs. selling raw
                </p>
                <p
                  className={`mt-1.5 text-3xl font-bold ${evOfGrading >= 0 ? 'text-good-500' : 'text-bad-500'}`}
                >
                  {evOfGrading >= 0 ? '+' : ''}
                  {currency(evOfGrading)}
                </p>
                <p className="mt-1 text-xs text-ink-400">
                  {evOfGrading >= 0
                    ? 'Grading has positive expected value at these inputs.'
                    : 'Selling raw now has higher expected value at these inputs.'}
                </p>
              </Card>
            </div>
          </Section>

          <Callout tone="info" title="This is a decision-support tool, not a forecast">
            The output is only as good as your grade-probability estimates — garbage in, garbage
            out. Use realistic pop-report gem rates for similar cards as a starting point for your
            probabilities, and remember expected value can be positive while still carrying real
            variance: you could grade ten similar cards and lose money on most of them while one
            grade-10 pulls the average up.
          </Callout>
        </div>
      </div>
    </div>
  )
}
