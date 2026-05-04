import { redirect } from 'next/navigation'
import Link from 'next/link'
import { loadSession, loadOverview } from './actions'
import SessionGrid from './SessionGrid'
import OverviewTable from './OverviewTable'

export default async function ConversationSessionPage({
  params,
  searchParams,
}: {
  params:       Promise<{ gridId: string }>
  searchParams: Promise<{ session?: string; etape?: string; vue?: string }>
}) {
  const { gridId } = await params
  const sp         = await searchParams
  const etapeRaw   = sp.etape ? parseInt(sp.etape) : null
  const etape      = etapeRaw && [1, 2, 3].includes(etapeRaw) ? etapeRaw : null

  if (!sp.etape && !sp.session && !sp.vue) redirect(`?etape=1`)

  function navLink(label: string, href: string) {
    return (
      <>
        <Link href={href} className="text-white/70 hover:text-white text-sm">{label}</Link>
        <span className="text-white/40">/</span>
      </>
    )
  }

  if (sp.vue === 'ensemble') {
    const overview = await loadOverview(gridId, etape)
    if (!overview) redirect('/dashboard/evaluation/conversations')

    const overviewUrl = (e: number | null) =>
      `/dashboard/evaluation/conversations/${gridId}/session?vue=ensemble${e ? `&etape=${e}` : ''}`
    const backUrl = `/dashboard/evaluation/conversations/${gridId}/session${etape ? `?etape=${etape}` : ''}`

    return (
      <main className="min-h-screen">
        <style>{`
          @media print {
            * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
            @page { size: A4 landscape; margin: 1.5cm; }
            .overview-table-wrap { overflow: visible !important; }
            .overview-table-wrap table { min-width: 0 !important; width: 100% !important; font-size: 10px !important; }
            .overview-table-wrap th,
            .overview-table-wrap td { padding: 4px 5px !important; }
          }
        `}</style>
        <nav className="print:hidden px-6 py-4 flex items-center gap-3 flex-wrap" style={{ backgroundColor: 'var(--color-nav)' }}>
          {navLink('← Conversations', '/dashboard/evaluation/conversations')}
          {navLink(overview.gridTitle, `/dashboard/evaluation/conversations/${gridId}/session`)}
          <h1 className="text-sm font-semibold text-white">Vue d&apos;ensemble</h1>
        </nav>

        <div className="max-w-5xl mx-auto px-8 py-10">
          <div className="print:hidden flex items-center justify-between mb-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-800">{overview.gridTitle}</h2>
              <p className="text-sm text-gray-500 mt-1">Vue d&apos;ensemble — résultats par élève</p>
            </div>
            <Link href={backUrl} className="text-sm text-indigo-600 hover:text-indigo-800 font-medium transition">
              ← Retour à la grille
            </Link>
          </div>

          {/* Print-only title */}
          <div className="hidden print:block mb-4">
            <h2 className="text-xl font-bold text-gray-900">{overview.gridTitle}</h2>
            <p className="text-sm text-gray-600">Vue d&apos;ensemble{etape ? ` — Étape ${etape}` : ''}</p>
          </div>

          {/* Étape tabs */}
          <div className="print:hidden flex items-center gap-2 mb-6 flex-wrap">
            <span className="text-xs font-medium text-gray-500 shrink-0">Étape :</span>
            {([1, 2, 3] as const).map(n => (
              <Link
                key={n}
                href={overviewUrl(n)}
                className={`text-xs px-3 py-1.5 rounded-full font-medium border transition ${
                  etape === n
                    ? 'bg-blue-600 text-white border-blue-600'
                    : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300'
                }`}
              >
                Étape {n}
              </Link>
            ))}
            {etape !== null && (
              <Link
                href={overviewUrl(null)}
                className="text-xs text-gray-400 hover:text-gray-600 underline transition ml-1"
              >
                Toutes les séances
              </Link>
            )}
          </div>

          <OverviewTable
            gridId={gridId}
            etape={etape}
            sessions={overview.sessions}
            rows={overview.rows}
            jugements={overview.jugements}
            prescolaire={overview.prescolaire}
          />
        </div>
      </main>
    )
  }

  const sessionNum = Math.max(1, parseInt(sp.session ?? '1') || 1)
  const data = await loadSession(gridId, sessionNum, etape)
  if (!data) redirect('/dashboard/evaluation/conversations')

  return (
    <main className="min-h-screen">
      <nav className="px-6 py-4 flex items-center gap-3 flex-wrap" style={{ backgroundColor: 'var(--color-nav)' }}>
        {navLink('← Conversations', '/dashboard/evaluation/conversations')}
        <h1 className="text-sm font-semibold text-white">{data.gridTitle}</h1>
      </nav>

      <div className="max-w-5xl mx-auto px-8 py-10">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800">{data.gridTitle}</h2>
          <p className="text-sm text-gray-700 font-medium mt-2">
            Cliquez sur une cellule et tapez 1, 2, 3 ou 4 pour enregistrer le niveau. Cliquez sur le nom d&apos;un élève pour le modifier.
          </p>
        </div>

        <SessionGrid
          key={data.sessionId}
          sessionId={data.sessionId}
          sessionNumber={data.sessionNumber}
          totalSessions={data.totalSessions}
          etape={data.etape}
          gridId={gridId}
          gridTitle={data.gridTitle}
          lectureCount={data.cycleLabel === 'Éducation préscolaire' ? 0 : Math.max(0, data.criteria.length - 2)}
          criteria={data.criteria}
          levels={data.levels}
          students={data.students}
          scores={data.scores}
        />
      </div>
    </main>
  )
}
