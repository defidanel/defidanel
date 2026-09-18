import type { ReactNode } from 'react'

export function PageHeader({
  eyebrow,
  title,
  lede,
}: {
  eyebrow: string
  title: string
  lede: string
}) {
  return (
    <div className="mb-10 max-w-3xl">
      <p className="text-xs font-semibold uppercase tracking-widest text-brand-400">{eyebrow}</p>
      <h1 className="mt-2 text-3xl font-bold tracking-tight text-white sm:text-4xl">{title}</h1>
      <p className="mt-4 text-base leading-relaxed text-ink-300">{lede}</p>
    </div>
  )
}

export function Section({
  id,
  title,
  subtitle,
  children,
}: {
  id?: string
  title: string
  subtitle?: string
  children: ReactNode
}) {
  return (
    <section id={id} className="scroll-mt-nav mb-14">
      <h2 className="text-xl font-semibold tracking-tight text-white sm:text-2xl">{title}</h2>
      {subtitle && <p className="mt-2 max-w-3xl text-sm text-ink-400">{subtitle}</p>}
      <div className="mt-6">{children}</div>
    </section>
  )
}

export function Card({ children, className = '' }: { children: ReactNode; className?: string }) {
  return (
    <div
      className={`rounded-xl border border-ink-700/70 bg-ink-900/60 p-5 shadow-[0_1px_0_0_rgba(255,255,255,0.03)_inset] ${className}`}
    >
      {children}
    </div>
  )
}

export function Callout({
  tone = 'info',
  title,
  children,
  className = '',
}: {
  tone?: 'info' | 'warn' | 'danger' | 'good'
  title: string
  children: ReactNode
  className?: string
}) {
  const styles = {
    info: 'border-brand-400/30 bg-brand-500/10',
    warn: 'border-gold-500/30 bg-gold-500/10',
    danger: 'border-bad-500/30 bg-bad-500/10',
    good: 'border-good-500/30 bg-good-500/10',
  }[tone]

  const dot = {
    info: 'bg-brand-400',
    warn: 'bg-gold-500',
    danger: 'bg-bad-500',
    good: 'bg-good-500',
  }[tone]

  return (
    <div className={`rounded-xl border p-5 ${styles} ${className}`}>
      <div className="flex items-center gap-2">
        <span className={`h-1.5 w-1.5 rounded-full ${dot}`} />
        <p className="text-sm font-semibold text-white">{title}</p>
      </div>
      <div className="mt-2 text-sm leading-relaxed text-ink-300">{children}</div>
    </div>
  )
}

export function Grid({
  children,
  cols = 3,
  className = '',
}: {
  children: ReactNode
  cols?: 2 | 3 | 4
  className?: string
}) {
  const colsClass = {
    2: 'sm:grid-cols-2',
    3: 'sm:grid-cols-2 lg:grid-cols-3',
    4: 'sm:grid-cols-2 lg:grid-cols-4',
  }[cols]
  return <div className={`grid grid-cols-1 gap-4 ${colsClass} ${className}`}>{children}</div>
}

export function Table({
  head,
  rows,
}: {
  head: string[]
  rows: (string | ReactNode)[][]
}) {
  return (
    <div className="overflow-x-auto rounded-xl border border-ink-700/70">
      <table className="w-full min-w-[560px] border-collapse text-left text-sm">
        <thead>
          <tr className="bg-ink-800/70">
            {head.map((h) => (
              <th key={h} className="px-4 py-3 font-semibold text-ink-200">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, i) => (
            <tr key={i} className="border-t border-ink-700/60 odd:bg-ink-900/40">
              {row.map((cell, j) => (
                <td key={j} className="px-4 py-3 align-top text-ink-300">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export function Pill({ children, tone = 'default' }: { children: ReactNode; tone?: 'default' | 'brand' | 'gold' }) {
  const styles = {
    default: 'bg-ink-800 text-ink-300 border-ink-600',
    brand: 'bg-brand-500/15 text-brand-300 border-brand-400/30',
    gold: 'bg-gold-500/15 text-gold-400 border-gold-500/30',
  }[tone]
  return (
    <span className={`inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-medium ${styles}`}>
      {children}
    </span>
  )
}

export function StatCard({ label, value, hint }: { label: string; value: string; hint?: string }) {
  return (
    <Card>
      <p className="text-xs font-medium uppercase tracking-wide text-ink-400">{label}</p>
      <p className="mt-1.5 text-2xl font-bold text-white">{value}</p>
      {hint && <p className="mt-1 text-xs text-ink-400">{hint}</p>}
    </Card>
  )
}
