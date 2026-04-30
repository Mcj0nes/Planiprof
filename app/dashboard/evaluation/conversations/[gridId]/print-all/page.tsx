import { redirect } from 'next/navigation'
import { loadAllSessionsForPrint } from '../session/actions'
import AutoPrint from './AutoPrint'
import PrintButton from './PrintButton'

const LEVEL_BG: Record<number, string> = {
  1: '#fca5a5',
  2: '#fde68a',
  3: '#bbf7d0',
  4: '#4ade80',
}

export default async function PrintAllPage({
  params,
  searchParams,
}: {
  params: Promise<{ gridId: string }>
  searchParams: Promise<{ etape?: string }>
}) {
  const { gridId } = await params
  const sp = await searchParams
  const etapeRaw = sp.etape ? parseInt(sp.etape) : null
  const etape = etapeRaw && [1, 2, 3].includes(etapeRaw) ? etapeRaw : null

  const data = await loadAllSessionsForPrint(gridId, etape)
  if (!data) redirect('/dashboard/evaluation/conversations')

  const levelMap = new Map(data.levels.map(l => [l.id, l]))

  return (
    <>
      <style>{`
        * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
        @page { size: A4 landscape; margin: 1.5cm; }
        @media print {
          .no-print { display: none !important; }
          table { width: 100% !important; font-size: 10px !important; }
          th, td { padding: 4px 5px !important; }
        }
      `}</style>

      <AutoPrint />

      {/* Screen-only controls */}
      <div className="no-print flex items-center gap-3 px-6 py-3 border-b border-gray-200 bg-white sticky top-0 z-10">
        <PrintButton />
        <span className="text-xs text-gray-500">Ctrl+P ou ⌘+P pour imprimer / enregistrer en PDF</span>
      </div>

      <div className="p-8 bg-white min-h-screen">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">{data.gridTitle}</h1>
        <p className="text-sm text-gray-500 mb-8">
          {etape ? `Étape ${etape} — ` : ''}
          {data.sessions.length} séance{data.sessions.length !== 1 ? 's' : ''}
        </p>

        {data.sessions.map((session, si) => (
          <div
            key={si}
            style={{ pageBreakBefore: si > 0 ? 'always' : 'auto', marginBottom: 48 }}
          >
            <h2 className="text-lg font-bold text-gray-800 mb-4">Séance {session.sessionNumber}</h2>

            {session.students.length === 0 ? (
              <p className="text-sm text-gray-400">Aucun élève dans cette séance.</p>
            ) : (
              <table style={{ borderCollapse: 'collapse', width: '100%', fontSize: 12 }}>
                <thead>
                  <tr>
                    <th style={{ border: '1px solid #d1d5db', padding: '6px 10px', background: '#f3f4f6', textAlign: 'left', minWidth: 160 }}>
                      Nom de l&apos;élève
                    </th>
                    {data.criteria.map(c => (
                      <th key={c.id} style={{ border: '1px solid #d1d5db', padding: '6px 8px', background: '#f3f4f6', textAlign: 'center', width: 80 }}>
                        {c.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {session.students.map((student, idx) => (
                    <tr key={idx} style={{ background: idx % 2 === 0 ? '#ffffff' : '#f9fafb' }}>
                      <td style={{ border: '1px solid #d1d5db', padding: '6px 10px', fontWeight: 500 }}>
                        {student.name}
                      </td>
                      {data.criteria.map(c => {
                        const levelId = student.scores[c.id]
                        const level = levelId != null ? levelMap.get(levelId) : null
                        const bg = level ? (LEVEL_BG[level.sort_order] ?? '#f9fafb') : '#f9fafb'
                        return (
                          <td
                            key={c.id}
                            style={{ border: '1px solid #d1d5db', padding: '6px 8px', textAlign: 'center', backgroundColor: bg, width: 80 }}
                          >
                            {level ? level.sort_order : ''}
                          </td>
                        )
                      })}
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        ))}
      </div>
    </>
  )
}
