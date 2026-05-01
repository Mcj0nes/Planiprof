import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { loadGrid, loadEtapeOverview } from './actions'
import EcritureGrid from './EcritureGrid'
import EtapeOverview from './EtapeOverview'

export default async function Ecriture3eCyclePage({
  searchParams,
}: {
  searchParams: Promise<{ grille?: string; etape?: string; vue?: string }>
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const params = await searchParams
  const etapeRaw = parseInt(params?.etape ?? '', 10)
  const etape = [1, 2, 3].includes(etapeRaw) ? etapeRaw : null
  const vue = params?.vue

  if (!params.etape && !params.grille && !params.vue) redirect('?etape=1')

  const nav = (
    <nav className="px-6 py-4 flex items-center gap-3 flex-wrap" style={{ backgroundColor: 'var(--color-nav)' }}>
      <Link href="/dashboard" className="text-white/70 hover:text-white text-sm">&#x2190; Tableau de bord</Link>
      <span className="text-white/40">/</span>
      <Link href="/dashboard/evaluation" className="text-white/70 hover:text-white text-sm">Outils d&apos;évaluation</Link>
      <span className="text-white/40">/</span>
      <Link href="/dashboard/evaluation/observation" className="text-white/70 hover:text-white text-sm">Grilles d&apos;observation</Link>
      <span className="text-white/40">/</span>
      <h1 className="text-sm font-semibold text-white">Français — Écriture — 3e cycle</h1>
    </nav>
  )

  const header = (
    <div className="mb-8">
      <h2 className="text-2xl font-bold text-gray-800">Français — Écriture</h2>
      <p className="text-sm text-gray-500 mt-1">
        3e cycle du primaire (5e et 6e année) — Grille d&apos;observation — Niveaux de maîtrise
      </p>
      {vue !== 'ensemble' && (
        <p className="text-sm text-gray-700 font-medium mt-2">
          Cliquez sur une cellule et tapez 1, 2, 3 ou 4 pour enregistrer le niveau. Cliquez sur le nom d&apos;un élève pour le modifier.
        </p>
      )}
    </div>
  )

  if (vue === 'ensemble' && etape !== null) {
    const overview = await loadEtapeOverview(etape)
    return (
      <main className="min-h-screen">
        <style>{`
          @media print {
            * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
            @page { size: A4 landscape; margin: 1.5cm; }
            .print-table-wrap { overflow: visible !important; }
            .print-table-wrap table { min-width: 0 !important; width: 100% !important; font-size: 10px !important; }
            .print-table-wrap th, .print-table-wrap td { padding: 4px 5px !important; }
          }
        `}</style>
        <div className="print:hidden">{nav}</div>
        <div className="max-w-5xl mx-auto px-8 py-10">
          <div className="print:hidden">{header}</div>
          <div className="hidden print:block mb-4">
            <h2 className="text-xl font-bold text-gray-900">Français — Écriture — 3e cycle — Vue d&apos;ensemble</h2>
            <p className="text-sm text-gray-600">Étape {etape}</p>
          </div>
          <EtapeOverview key={`overview-etape-${etape}`} etape={etape} grids={overview.grids} rows={overview.rows} />
        </div>
      </main>
    )
  }

  const gridNum = Math.max(1, parseInt(params?.grille ?? '1', 10) || 1)
  const data = await loadGrid(gridNum, etape)
  if (!data) redirect('/dashboard/evaluation/observation')

  return (
    <main className="min-h-screen">
      {nav}
      <div className="max-w-5xl mx-auto px-8 py-10">
        {header}
        <EcritureGrid
          key={data.gridId}
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
