import { lazy, Suspense } from 'react'
import { HashRouter, Route, Routes } from 'react-router-dom'
import Layout from './components/Layout'

const Home = lazy(() => import('./pages/Home'))
const Grading = lazy(() => import('./pages/Grading'))
const Rarity = lazy(() => import('./pages/Rarity'))
const Market = lazy(() => import('./pages/Market'))
const Pricing = lazy(() => import('./pages/Pricing'))
const Risk = lazy(() => import('./pages/Risk'))
const Calculator = lazy(() => import('./pages/Calculator'))
const Glossary = lazy(() => import('./pages/Glossary'))

export default function App() {
  return (
    <HashRouter>
      <Layout>
        <Suspense fallback={<div className="py-20 text-center text-sm text-ink-400">Loading…</div>}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/grading" element={<Grading />} />
            <Route path="/rarity" element={<Rarity />} />
            <Route path="/market" element={<Market />} />
            <Route path="/pricing" element={<Pricing />} />
            <Route path="/risk" element={<Risk />} />
            <Route path="/calculator" element={<Calculator />} />
            <Route path="/glossary" element={<Glossary />} />
          </Routes>
        </Suspense>
      </Layout>
    </HashRouter>
  )
}
