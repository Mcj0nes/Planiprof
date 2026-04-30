'use client'

import Link from 'next/link'

type Level     = { id: number; code: string; label: string; sort_order: number }
type Criterion = { id: string; label: string; weight: number | null; sort_order: number }
type StudentData = {
  id: string
  name: string
  assessmentId: string | null
  marks: Record<string, number>
  comment: string
  overallResult: string | null
}

interface Props {
  planId:      string
  linkId:      string
  gridTitle:   string
  etapeName:   string | null
  competency:  string | null
  levels:      Level[]
  criteria:    Criterion[]
  cellMap:     Record<string, Record<number, string>>
  studentData: StudentData[]
}

const LEVEL_BG = [
  'bg-green-500 text-white',
  'bg-green-300 text-green-900',
  'bg-yellow-300 text-yellow-900',
  'bg-orange-300 text-orange-900',
  'bg-red-300 text-red-900',
]
const LEVEL_PRINT = [
  'print-level-0',
  'print-level-1',
  'print-level-2',
  'print-level-3',
  'print-level-4',
]

function levelColor(idx: number) {
  return LEVEL_BG[idx] ?? 'bg-blue-400 text-white'
}
function levelPrint(idx: number) {
  return LEVEL_PRINT[idx] ?? 'print-level-0'
}

function firstLine(label: string) {
  return label.split('\n')[0]
}


export default function LinkOverviewView({
  planId, linkId, gridTitle, etapeName, competency,
  levels, criteria, cellMap, studentData,
}: Props) {
  const sortedLevels   = [...levels].sort((a, b) => a.sort_order - b.sort_order)
  const sortedCriteria = [...criteria].sort((a, b) => a.sort_order - b.sort_order)

  const levelIdxMap: Record<number, number> = {}
  sortedLevels.forEach((l, i) => { levelIdxMap[l.id] = i })

  const evaluatedCount = studentData.filter(s => Object.keys(s.marks).length > 0).length

  return (
    <>
      {/* ── Screen header ── */}
      <div className="flex items-start justify-between mb-6 print:hidden">
        <div>
          <p className="text-xs font-semibold uppercase tracking-widest text-blue-500 mb-1">Vue globale de l'évaluation</p>
          <h2 className="text-2xl font-bold text-gray-800">{gridTitle}</h2>
          <div className="flex items-center gap-3 mt-1 text-sm text-gray-500 flex-wrap">
            {etapeName && <span>{etapeName}</span>}
            {competency && (
              <span className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full text-xs">{competency}</span>
            )}
            <span className="text-gray-400">
              {evaluatedCount} / {studentData.length} élève{studentData.length > 1 ? 's' : ''} évalué{studentData.length > 1 ? 's' : ''}
            </span>
          </div>
        </div>
        <button
          onClick={() => window.print()}
          className="flex items-center gap-2 text-sm px-4 py-2 border border-gray-200 rounded-xl hover:bg-gray-50 transition text-gray-600 shrink-0 ml-4"
        >
          <span>🖨</span> Imprimer toutes les grilles
        </button>
      </div>

      {/* ── Screen: summary table ── */}
      <div className="overflow-x-auto rounded-2xl border border-gray-200 shadow-sm bg-white mb-8 print:hidden">
        <table className="border-collapse text-sm w-full">
          <thead>
            <tr>
              <th className="text-left px-4 py-3 bg-gray-50 border-b border-r border-gray-200 font-semibold text-gray-700 sticky left-0 z-10 min-w-40">
                Élève
              </th>
              {sortedCriteria.map(c => (
                <th key={c.id} className="px-3 py-3 bg-gray-50 border-b border-r border-gray-200 font-medium text-gray-600 text-center last:border-r-0 min-w-24">
                  <span className="block text-xs leading-snug">{firstLine(c.label)}</span>
                  {c.weight != null && <span className="block text-xs font-normal text-gray-400">{c.weight}%</span>}
                </th>
              ))}
              <th className="px-3 py-3 bg-gray-50 border-b border-r border-gray-200 font-medium text-gray-600 text-center min-w-24 text-xs">
                Résultat global
              </th>
              <th className="px-3 py-3 bg-gray-50 border-b border-gray-200 font-medium text-gray-600 text-center min-w-20 text-xs">
                Détail
              </th>
            </tr>
          </thead>
          <tbody>
            {studentData.map((student, rowIdx) => (
              <tr key={student.id} className={rowIdx % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}>
                <td className="px-4 py-3 border-b border-r border-gray-200 sticky left-0 z-10 bg-inherit font-medium text-gray-800">
                  {student.name}
                </td>
                {sortedCriteria.map(c => {
                  const levelId = student.marks[c.id]
                  const levelIdx = levelId != null ? (levelIdxMap[levelId] ?? -1) : -1
                  const level = levelId != null ? sortedLevels.find(l => l.id === levelId) : null
                  return (
                    <td key={c.id} className="px-3 py-3 border-b border-r border-gray-200 text-center last:border-r-0">
                      {level
                        ? <span className={`inline-block px-2 py-0.5 rounded text-xs font-bold ${levelColor(levelIdx)}`}>{level.code}</span>
                        : <span className="text-gray-300 text-xs">—</span>
                      }
                    </td>
                  )
                })}
                <td className="px-3 py-3 border-b border-r border-gray-200 text-center">
                  {student.overallResult
                    ? (() => {
                        const idx = sortedLevels.findIndex(l => l.code === student.overallResult)
                        return <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold ${levelColor(idx >= 0 ? idx : 0)}`}>{student.overallResult}</span>
                      })()
                    : <span className="text-gray-300 text-xs">—</span>
                  }
                </td>
                <td className="px-3 py-3 border-b border-gray-200 text-center">
                  <Link
                    href={`/dashboard/gradebook/${planId}/grilles/${student.id}/${linkId}`}
                    className="text-xs text-blue-500 hover:underline"
                  >
                    Ouvrir →
                  </Link>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* ── Print: one full grid per student ── */}
      <div className="hidden print:block">
        {studentData.map((student, sIdx) => (
          <div key={student.id} className={`student-print-page${sIdx < studentData.length - 1 ? ' page-break' : ''}`}>
            {/* Student header */}
            <div className="print-student-header">
              <span className="print-student-name">{student.name}</span>
              <span className="print-grid-title"> — {gridTitle}{etapeName ? ` · ${etapeName}` : ''}</span>
            </div>

            {/* Grid */}
            <table>
              <thead>
                <tr>
                  <th className="crit-col">Critère</th>
                  {sortedLevels.map((level, idx) => (
                    <th key={level.id} className={`level-col ${levelPrint(idx)}-header`}>
                      <span className={`level-badge ${levelPrint(idx)}`}>{level.code}</span>
                      <span className="level-label">{level.label}</span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {sortedCriteria.map((criterion, rowIdx) => {
                  const selectedLevelId = student.marks[criterion.id]
                  return (
                    <tr key={criterion.id} className={rowIdx % 2 === 0 ? 'row-even' : 'row-odd'}>
                      <td className="crit-cell">
                        <span className="crit-name">{firstLine(criterion.label)}</span>
                        {criterion.weight != null && <span className="crit-weight">{criterion.weight}%</span>}
                      </td>
                      {sortedLevels.map((level, idx) => {
                        const isSelected = selectedLevelId === level.id
                        const descriptor = cellMap[criterion.id]?.[level.id]
                        return (
                          <td key={level.id} className={`desc-cell${isSelected ? ` selected ${levelPrint(idx)}` : ''}`}>
                            {isSelected && !descriptor && <span className="check-mark">✓</span>}
                            {descriptor && <span className="descriptor">{descriptor}</span>}
                          </td>
                        )
                      })}
                    </tr>
                  )
                })}
              </tbody>
            </table>

            {/* Comment + overall result */}
            <div className="print-comment-section">
              {student.overallResult && (
                <div className="print-overall-section">
                  <span className="print-comment-label">Résultat global : </span>
                  {(() => {
                    const idx = sortedLevels.findIndex(l => l.code === student.overallResult)
                    return (
                      <span className={`print-overall-badge ${levelPrint(idx >= 0 ? idx : 0)}`}>
                        {student.overallResult}
                      </span>
                    )
                  })()}
                </div>
              )}
              <div>
                <span className="print-comment-label">Commentaire : </span>
                <span className="print-comment-text">{student.comment || '—'}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Print styles ── */}
      <style>{`
        @media print {
          @page {
            size: A4 landscape;
            margin: 0.7cm 0.8cm;
          }
          * {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
          html, body {
            font-size: 8px !important;
            line-height: 1.25 !important;
          }
          nav, header, footer { display: none !important; }

          .page-break { break-after: page; }

          .print-student-header {
            font-size: 9px !important;
            font-weight: bold;
            margin-bottom: 4px !important;
          }
          .print-student-name { font-size: 10px !important; }
          .print-grid-title   { font-size: 8px !important; font-weight: normal; color: #555; }

          table {
            width: 100% !important;
            border-collapse: collapse !important;
            table-layout: fixed !important;
            font-size: 7.5px !important;
            line-height: 1.2 !important;
          }
          th, td {
            padding: 3px 4px !important;
            vertical-align: top !important;
            border: 1px solid #d1d5db !important;
            word-break: break-word;
          }
          th { font-size: 7.5px !important; text-align: center; background: #f9fafb !important; }
          .crit-col, .crit-cell { width: 18% !important; text-align: left !important; }

          .crit-name   { display: block; font-weight: 600; }
          .crit-weight { display: block; color: #9ca3af; font-size: 6.5px !important; }
          .level-label { display: block; font-size: 6.5px !important; font-weight: normal; color: #6b7280; margin-top: 1px; }

          .level-badge {
            display: inline-block;
            padding: 0 3px;
            border-radius: 3px;
            font-weight: 700;
            font-size: 7px !important;
          }
          .descriptor { font-size: 7px !important; line-height: 1.2 !important; }
          .check-mark { font-size: 11px !important; font-weight: bold; }

          .row-even { background: #fff !important; }
          .row-odd  { background: #f9fafb !important; }

          /* Selected cell colors */
          .selected.print-level-0 { background-color: #22c55e !important; color: #fff !important; }
          .selected.print-level-1 { background-color: #86efac !important; color: #14532d !important; }
          .selected.print-level-2 { background-color: #fde047 !important; color: #713f12 !important; }
          .selected.print-level-3 { background-color: #fdba74 !important; color: #7c2d12 !important; }
          .selected.print-level-4 { background-color: #fca5a5 !important; color: #7f1d1d !important; }

          /* Level header badge colors */
          .print-level-0 { background-color: #22c55e !important; color: #fff !important; }
          .print-level-1 { background-color: #86efac !important; color: #14532d !important; }
          .print-level-2 { background-color: #fde047 !important; color: #713f12 !important; }
          .print-level-3 { background-color: #fdba74 !important; color: #7c2d12 !important; }
          .print-level-4 { background-color: #fca5a5 !important; color: #7f1d1d !important; }

          .print-comment-section {
            margin-top: 4px !important;
            font-size: 7.5px !important;
            border-top: 1px solid #d1d5db;
            padding-top: 3px !important;
          }
          .print-overall-section { margin-bottom: 2px !important; }
          .print-overall-badge {
            display: inline-block;
            padding: 0 4px;
            border-radius: 3px;
            font-weight: 700;
            font-size: 7px !important;
          }
          .print-comment-label { font-weight: 600; }
          .print-comment-text  { color: #374151; }
        }
      `}</style>
    </>
  )
}
