import { redirect } from 'next/navigation'
import { loadAllGridsForPrint } from '../actions'
import AutoPrint from './AutoPrint'
import PrintButton from './PrintButton'

const CRITERIA = [
  { key: 'reperage',      label: 'Repérage' },
  { key: 'temps',         label: 'Temps' },
  { key: 'espace',        label: 'Espace' },
  { key: 'sources',       label: 'Sources' },
  { key: 'analyse',       label: 'Analyse' },
  { key: 'communication', label: 'Communication' },
  { key: 'collaboration', label: 'Collaboration' },
  { key: 'global',        label: 'Résultat global' },
]

const LEVEL_BG: Record<number, string> = {
  1: '#fca5a5',
  2: '#fde68a',
  3: '#bbf7d0',
  4: '#4ade80',
}

export default async function UniversSocial2eCyclePrintAllPage({
  searchParams,
}: {
  searchParams: Promise<{ etape?: string }>
}) {
  const sp = await searchParams
  const etapeRaw = sp.etape ? parseInt(sp.etape) : null
  const etape = etapeRaw && [1, 2, 3].includes(etapeRaw) ? etapeRaw : null
  if (!etape) redirect('/dashboard/evaluation/observation/univers-social-2e-cycle')

  const data = await loadAllGridsForPrint(etape)

  return (
    <>
      <style>{`
        * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
        @page { size: A4 landscape; margin: 1.5cm; }
        @media print {
          .no-print { display: none !important; }
          table { width: 100% !important; font-size: 9px !important; }
          th, td { padding: 3px 4px !important; }
        }
      `}</style>

      <AutoPrint />

      <div className="no-print flex items-center gap-3 px-6 py-3 border-b border-gray-200 bg-white sticky top-0 z-10">
        <PrintButton />
        <span className="text-xs text-gray-500">Ctrl+P ou ⌘+P pour imprimer / enregistrer en PDF</span>
      </div>

      <div className="p-8 bg-white min-h-screen">
        <h1 className="text-2xl font-bold text-gray-900 mb-1">Univers social</h1>
        <p className="text-sm text-gray-500 mb-8">
          Étape {etape} — {data.grids.length} grille{data.grids.length !== 1 ? 's' : ''}
        </p>

        {data.grids.map((grid, gi) => (
          <div key={gi} style={{ pageBreakBefore: gi > 0 ? 'always' : 'auto', marginBottom: 48 }}>
            <h2 className="text-lg font-bold text-gray-800 mb-4">Grille {grid.gridNumber}</h2>
            {grid.students.length === 0 ? (
              <p className="text-sm text-gray-400">Aucun élève dans cette grille.</p>
            ) : (
              <table style={{ borderCollapse: 'collapse', width: '100%', fontSize: 11 }}>
                <thead>
                  <tr>
                    <th style={{ border: '1px solid #d1d5db', padding: '6px 10px', background: '#f3f4f6', textAlign: 'left', minWidth: 160 }}>
                      Nom de l&apos;élève
                    </th>
                    {CRITERIA.map(c => (
                      <th key={c.key} style={{
                        border: '1px solid #d1d5db', padding: '6px 8px',
                        background: c.key === 'global' ? '#eef2ff' : '#f3f4f6',
                        textAlign: 'center', width: 80,
                        borderLeft: c.key === 'global' ? '2px solid #a5b4fc' : undefined,
                      }}>
                        {c.label}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {grid.students.map((student, idx) => (
                    <tr key={idx} style={{ background: idx % 2 === 0 ? '#ffffff' : '#f9fafb' }}>
                      <td style={{ border: '1px solid #d1d5db', padding: '6px 10px', fontWeight: 500 }}>
                        {student.name}
                      </td>
                      {CRITERIA.map(c => {
                        const score = student.scores[c.key] ?? null
                        const bg = score !== null ? (LEVEL_BG[score] ?? '#f9fafb') : '#f9fafb'
                        return (
                          <td key={c.key} style={{
                            border: '1px solid #d1d5db', padding: '6px 8px',
                            textAlign: 'center', backgroundColor: bg, width: 80,
                            borderLeft: c.key === 'global' ? '2px solid #a5b4fc' : undefined,
                          }}>
                            {score ?? ''}
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
