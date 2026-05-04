import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { loadGrid, loadEtapeOverview } from '../actions'
import PrescolaireGrid from './PrescolaireGrid'
import EtapeOverview from './EtapeOverview'

const DOMAIN_TITLES: Record<string, string> = {
  physique: 'Développement physique et moteur',
  affectif: 'Développement affectif',
  social:   'Développement social',
  langage:  'Communication et langage',
  monde:    'Découverte du monde',
  global:   'Portrait global — 5 domaines',
}

const VALID_DOMAINS = new Set(Object.keys(DOMAIN_TITLES))

export default async function PrescolaireObsPage({
  params,
  searchParams,
}: {
  params:       Promise<{ domain: string }>
  searchParams: Promise<{ grille?: string; etape?: string; vue?: string }>
}) {
  const { domain } = await params
  if (!VALID_DOMAINS.has(domain)) notFound()

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const sp       = await searchParams
  const etapeRaw = parseInt(sp?.etape ?? '', 10)
  const etape    = [1, 2, 3].includes(etapeRaw) ? etapeRaw : null
  const vue      = sp?.vue

  if (!sp.etape && !sp.grille && !sp.vue) redirect('?etape=1')

  const title = DOMAIN_TITLES[domain]

  const nav = (
    <nav className="px-6 py-4 flex items-center gap-3 flex-wrap" style={{ backgroundColor: 'var(--color-nav)' }}>
      <Link href="/dashboard" className="text-white/70 hover:text-white text-sm">&#x2190; Tableau de bord</Link>
      <span className="text-white/40">/</span>
      <Link href="/dashboard/evaluation" className="text-white/70 hover:text-white text-sm">Outils d&apos;évaluation</Link>
      <span className="text-white/40">/</span>
      <Link href="/dashboard/evaluation/observation" className="text-white/70 hover:text-white text-sm">Grilles d&apos;observation</Link>
      <span className="text-white/40">/</span>
      <h1 className="text-sm font-semibold text-white">{title}</h1>
    </nav>
  )

  const header = (
    <div className="mb-8">
      <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
      <p className="text-sm text-gray-500 mt-1">
        Éducation préscolaire — Grille d&apos;observation — Niveaux DA · EA · EC · A
      </p>
      {vue !== 'ensemble' && (
        <p className="text-sm text-gray-700 font-medium mt-2">
          Cliquez sur une cellule et tapez 1, 2, 3 ou 4 pour enregistrer le niveau. Cliquez sur le nom d&apos;un élève pour le modifier.
        </p>
      )}
    </div>
  )

  if (vue === 'ensemble' && etape !== null) {
    const overview = await loadEtapeOverview(domain, etape)
    return (
      <main className="min-h-screen">
        <style>{`
          @media print {
            * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
            @page { size: A4 landscape; margin: 1.5cm; }
            .print-table-wrap { overflow: visible !important; }
            .print-table-wrap table { min-width: 0 !important; width: 100% !important; font-size: 10px !important; }
            .print-table-wrap th,
            .print-table-wrap td { padding: 4px 5px !important; }
          }
        `}</style>
        <div className="print:hidden">{nav}</div>
        <div className="max-w-5xl mx-auto px-8 py-10">
          <div className="print:hidden">{header}</div>
          <div className="hidden print:block mb-4">
            <h2 className="text-xl font-bold text-gray-900">{title} — Vue d&apos;ensemble</h2>
            <p className="text-sm text-gray-600">Étape {etape}</p>
          </div>
          <EtapeOverview
            key={`overview-${domain}-etape-${etape}`}
            domain={domain}
            etape={etape}
            grids={overview.grids}
            rows={overview.rows}
          />
        </div>
      </main>
    )
  }

  const gridNum = Math.max(1, parseInt(sp?.grille ?? '1', 10) || 1)
  const data = await loadGrid(domain, gridNum, etape)
  if (!data) redirect('/dashboard/evaluation/observation')

  return (
    <main className="min-h-screen">
      {nav}
      <div className="max-w-5xl mx-auto px-8 py-10">
        {header}
        <PrescolaireGrid
          key={data.gridId}
          domain={domain}
          gridId={data.gridId}
          gridNumber={data.gridNumber}
          totalGrids={data.totalGrids}
          etape={data.etape}
          students={data.students}
          scores={data.scores}
        />
      </div>
    </main>
  )
}
