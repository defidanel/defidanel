import { useMemo, useState } from 'react'
import { Card, PageHeader, Pill } from '../components/ui'
import { GLOSSARY } from '../data/glossary'

const CATEGORIES = ['All', ...Array.from(new Set(GLOSSARY.map((t) => t.category)))]

export default function Glossary() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('All')

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase()
    return GLOSSARY.filter((t) => {
      const matchesCategory = category === 'All' || t.category === category
      const matchesQuery =
        !q || t.term.toLowerCase().includes(q) || t.definition.toLowerCase().includes(q)
      return matchesCategory && matchesQuery
    }).sort((a, b) => a.term.localeCompare(b.term))
  }, [query, category])

  return (
    <div>
      <PageHeader
        eyebrow="Reference"
        title="Glossary"
        lede="Every term used across this guide, in one searchable list."
      />

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search terms…"
          className="w-full max-w-sm rounded-lg border border-ink-600 bg-ink-950 px-4 py-2.5 text-sm text-white placeholder:text-ink-500 outline-none focus:border-brand-400"
        />
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCategory(c)}
              className={`rounded-full border px-3 py-1 text-xs font-medium transition-colors ${
                category === c
                  ? 'border-brand-400/50 bg-brand-500/20 text-brand-300'
                  : 'border-ink-600 text-ink-400 hover:text-ink-200'
              }`}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      {filtered.length === 0 ? (
        <Card>
          <p className="text-sm text-ink-400">No terms match &ldquo;{query}&rdquo;.</p>
        </Card>
      ) : (
        <div className="space-y-3">
          {filtered.map((t) => (
            <Card key={t.term}>
              <div className="flex flex-wrap items-center gap-2">
                <h3 className="text-base font-semibold text-white">{t.term}</h3>
                <Pill>{t.category}</Pill>
              </div>
              <p className="mt-2 text-sm leading-relaxed text-ink-400">{t.definition}</p>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}
