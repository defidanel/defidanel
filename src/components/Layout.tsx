import { useState, type ReactNode } from 'react'
import { NavLink } from 'react-router-dom'

const NAV = [
  { to: '/grading', label: 'Grading' },
  { to: '/rarity', label: 'Rarity' },
  { to: '/market', label: 'Market Dynamics' },
  { to: '/pricing', label: 'Pricing' },
  { to: '/risk', label: 'Risk & Asset Class' },
  { to: '/calculator', label: 'ROI Calculator' },
  { to: '/glossary', label: 'Glossary' },
]

function NavItems({ onClick, className }: { onClick?: () => void; className?: string }) {
  return (
    <>
      {NAV.map((item) => (
        <NavLink
          key={item.to}
          to={item.to}
          onClick={onClick}
          className={({ isActive }) =>
            [
              className,
              'rounded-md px-3 py-2 text-sm font-medium transition-colors',
              isActive
                ? 'bg-brand-500/15 text-white'
                : 'text-ink-300 hover:bg-ink-800 hover:text-white',
            ].join(' ')
          }
        >
          {item.label}
        </NavLink>
      ))}
    </>
  )
}

export default function Layout({ children }: { children: ReactNode }) {
  const [open, setOpen] = useState(false)

  return (
    <div className="flex min-h-screen flex-col text-ink-100">
      <header className="sticky top-0 z-40 border-b border-ink-700/60 bg-ink-950/85 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
          <NavLink to="/" className="flex items-center gap-2 shrink-0">
            <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-gradient-to-br from-brand-400 to-gold-500 text-sm font-bold text-ink-950">
              S
            </span>
            <span className="text-base font-semibold tracking-tight text-white">
              Slab &amp; Set
            </span>
          </NavLink>

          <nav className="hidden items-center gap-1 lg:flex">
            <NavItems />
          </nav>

          <button
            type="button"
            className="rounded-md border border-ink-700 p-2 text-ink-200 lg:hidden"
            onClick={() => setOpen((v) => !v)}
            aria-label="Toggle navigation"
          >
            <svg width="20" height="20" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6">
              <path d="M3 5h14M3 10h14M3 15h14" strokeLinecap="round" />
            </svg>
          </button>
        </div>

        {open && (
          <nav className="flex flex-col gap-1 border-t border-ink-700/60 px-4 py-3 lg:hidden">
            <NavItems onClick={() => setOpen(false)} />
          </nav>
        )}
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10 sm:px-6">{children}</main>

      <footer className="border-t border-ink-700/60 px-4 py-8 text-sm text-ink-400 sm:px-6">
        <div className="mx-auto flex max-w-6xl flex-col gap-3">
          <p>
            <strong className="text-ink-200">Slab &amp; Set</strong> is an educational reference
            for Pokémon and sports card collecting. It is not financial advice, and nothing here
            is an offer or recommendation to buy or sell any card. Card values are volatile,
            illiquid, and can go to zero relative to purchase price — do your own diligence.
          </p>
          <p className="text-ink-500">
            Prices, population figures, and multipliers used in examples are illustrative, not
            live market data.
          </p>
        </div>
      </footer>
    </div>
  )
}
