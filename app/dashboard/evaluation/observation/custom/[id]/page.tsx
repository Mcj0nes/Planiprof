import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { loadGrid, loadEtapeOverview } from './actions'
import CustomGrid from './CustomGrid'
import EtapeOverview from './EtapeOverview'

export default async function CustomObsGridPage({
  params,
  searchParams,
}: {
  params:       Promise<{ id: string }>
  searchParams: Promise<{ grille?: string; etape?: string; vue?: string }>
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { id: definitionId } = await params
  const sp = await searchParams

  const etapeRaw = parseInt(sp?.etape ?? '', 10)
  const etape    = [1, 2, 3].includes(etapeRaw) ? etapeRaw : null
  const vue      = sp?.vue

  if (!sp.etape && !sp.grille && !sp.vue) redirect('?etape=1')

  const nav = (
    <nav className="px-6 py-4 flex items-center gap-3 flex-wrap" style={{ backgroundColor: 'var(--color-nav)' }}>
      <Link href="/dashboard" className="text-white/70 hover:text-white text-sm">&#x2190; Tableau de bord</Link>
      <span className="text-white/40">/</span>
      <Link href="/dashboard/evaluation" className="text-white/70 hover:text-white text-sm">Outils d&apos;évaluation</Link>
      <span className="text-white/40">/</span>
      <Link href="/dashboard/evaluation/observation" className="text-white/70 hover:text-white text-sm">Grilles d&apos;observation</Link>
      <span className="text-white/40">/</span>
      <h1 className="text-sm font-semibold text-white">Grille personnalisée</h1>
    </nav>
  )

  if (vue === 'ensemble' && etape !== null) {
    const gridData = await loadGrid(definitionId, 1, etape)
    if (!gridData) redirect('/dashboard/evaluation/observation')
    const overview = await loadEtapeOverview(definitionId, etape)

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
          <div className="print:hidden mb-8">
            <h2 className="text-2xl font-bold text-gray-800">{gridData.definition.title}</h2>
            <p className="text-sm text-gray-500 mt-1">Grille d&apos;observation personnalisée — Vue d&apos;ensemble</p>
          </div>
          <div className="hidden print:block mb-4">
            <h2 className="text-xl font-bold text-gray-900">{gridData.definition.title} — Vue d&apos;ensemble</h2>
            <p className="text-sm text-gray-600">Étape {etape}</p>
          </div>
          <EtapeOverview
            key={`overview-etape-${etape}`}
            definitionId={definitionId}
            etape={etape}
            grids={overview.grids}
            rows={overview.rows}
          />
        </div>
      </main>
    )
  }

  const gridNum  = Math.max(1, parseInt(sp?.grille ?? '1', 10) || 1)
  const gridData = await loadGrid(definitionId, gridNum, etape)
  if (!gridData) redirect('/dashboard/evaluation/observation')

  return (
    <main className="min-h-screen">
      {nav}
      <div className="max-w-5xl mx-auto px-8 py-10">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800">{gridData.definition.title}</h2>
          <p className="text-sm text-gray-500 mt-1">
            Grille d&apos;observation personnalisée — {gridData.definition.criteria.length} critère{gridData.definition.criteria.length !== 1 ? 's' : ''}
          </p>
          <p className="text-sm text-gray-700 font-medium mt-2">
            Cliquez sur une cellule et tapez 1, 2, 3 ou 4 pour enregistrer le niveau.
          </p>
        </div>
        <CustomGrid
          key={gridData.sessionId}
          definitionId={definitionId}
          definitionTitle={gridData.definition.title}
          criteria={gridData.definition.criteria}
          sessionId={gridData.sessionId}
          gridNumber={gridData.gridNumber}
          totalGrids={gridData.totalGrids}
          etape={gridData.etape}
          students={gridData.students}
          scores={gridData.scores}
        />
      </div>
    </main>
  )
}
