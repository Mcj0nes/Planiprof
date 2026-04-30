'use client'

import { useState, useTransition, useRef } from 'react'
import Link from 'next/link'
import { saveMark, saveComment, saveOverallResult } from './assessment-actions'

type Level    = { id: number; code: string; label: string; sort_order: number }
type Criterion = { id: string; label: string; weight: number | null; sort_order: number }

interface Props {
  planId:          string
  linkId:          string
  assessmentId:    string
  studentName:     string
  gridTitle:       string
  etapeName:       string | null
  levels:          Level[]
  criteria:        Criterion[]
  cellMap:         Record<string, Record<number, string>>
  initialMarks:         Record<string, number>
  initialComment:       string
  initialOverallResult: string | null
  prevStudent:          { id: string; name: string } | null
  nextStudent:     { id: string; name: string } | null
  studentPosition: { current: number; total: number }
}

// Color per level position (0-indexed by sort_order)
const LEVEL_BG = [
  'bg-green-500 text-white border-green-600',
  'bg-green-300 text-green-900 border-green-400',
  'bg-yellow-300 text-yellow-900 border-yellow-400',
  'bg-orange-300 text-orange-900 border-orange-400',
  'bg-red-300 text-red-900 border-red-400',
]

function levelColor(idx: number) {
  return LEVEL_BG[idx] ?? 'bg-blue-400 text-white border-blue-500'
}

// Render multi-line criterion label (same logic as GridView)
function CriterionLabel({ label }: { label: string }) {
  const lines = label.split('\n')
  return (
    <div className="leading-snug">
      {lines.map((line, i) => {
        if (i === 0) return <p key={i} className="font-semibold text-gray-800 text-sm">{line}</p>
        if (line.startsWith('↳')) return <p key={i} className="text-xs text-blue-500 mt-0.5">{line}</p>
        return <p key={i} className="text-xs text-gray-500 italic mt-0.5">{line}</p>
      })}
    </div>
  )
}

const LETTER_GRADES = [
  ['A+', 'A', 'A-'],
  ['B+', 'B', 'B-'],
  ['C+', 'C', 'C-'],
  ['D+', 'D', 'D-'],
  ['E'],
] as const

const LETTER_COLORS: Record<string, { active: string; inactive: string }> = {
  'A+': { active: 'bg-emerald-600 text-white shadow-lg scale-110',  inactive: 'bg-emerald-100 text-emerald-700 hover:bg-emerald-200' },
  'A':  { active: 'bg-emerald-500 text-white shadow-lg scale-110',  inactive: 'bg-emerald-50  text-emerald-600 hover:bg-emerald-100' },
  'A-': { active: 'bg-green-400   text-white shadow-lg scale-110',  inactive: 'bg-green-50    text-green-600   hover:bg-green-100' },
  'B+': { active: 'bg-lime-500    text-white shadow-lg scale-110',  inactive: 'bg-lime-100    text-lime-700    hover:bg-lime-200' },
  'B':  { active: 'bg-lime-400    text-lime-900 shadow-lg scale-110', inactive: 'bg-lime-50   text-lime-600    hover:bg-lime-100' },
  'B-': { active: 'bg-yellow-400  text-yellow-900 shadow-lg scale-110', inactive: 'bg-yellow-50 text-yellow-700 hover:bg-yellow-100' },
  'C+': { active: 'bg-yellow-400  text-yellow-900 shadow-lg scale-110', inactive: 'bg-yellow-50 text-yellow-700 hover:bg-yellow-100' },
  'C':  { active: 'bg-amber-400   text-white shadow-lg scale-110',  inactive: 'bg-amber-50    text-amber-700   hover:bg-amber-100' },
  'C-': { active: 'bg-amber-500   text-white shadow-lg scale-110',  inactive: 'bg-amber-100   text-amber-700   hover:bg-amber-200' },
  'D+': { active: 'bg-orange-400  text-white shadow-lg scale-110',  inactive: 'bg-orange-50   text-orange-700  hover:bg-orange-100' },
  'D':  { active: 'bg-orange-500  text-white shadow-lg scale-110',  inactive: 'bg-orange-100  text-orange-700  hover:bg-orange-200' },
  'D-': { active: 'bg-red-400     text-white shadow-lg scale-110',  inactive: 'bg-red-50      text-red-600     hover:bg-red-100' },
  'E':  { active: 'bg-red-600     text-white shadow-lg scale-110',  inactive: 'bg-red-100     text-red-700     hover:bg-red-200' },
}

function isNumericResult(v: string | null) {
  return v !== null && /^\d+(\.\d+)?$/.test(v)
}

export default function AssessmentView({
  planId, linkId, assessmentId, studentName, gridTitle, etapeName,
  levels, criteria, cellMap, initialMarks, initialComment, initialOverallResult,
  prevStudent, nextStudent, studentPosition,
}: Props) {
  const [marks, setMarks]               = useState<Record<string, number>>(initialMarks)
  const [comment, setComment]           = useState(initialComment)
  const [overallResult, setOverallResult] = useState<string | null>(initialOverallResult)
  const [resultMode, setResultMode]     = useState<'letter' | 'numeric'>(isNumericResult(initialOverallResult) ? 'numeric' : 'letter')
  const [numericInput, setNumericInput] = useState(isNumericResult(initialOverallResult) ? (initialOverallResult ?? '') : '')
  const [, startTransition]             = useTransition()
  const commentTimer                    = useRef<ReturnType<typeof setTimeout> | null>(null)
  const numericTimer                    = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Sort levels by sort_order
  const sortedLevels = [...levels].sort((a, b) => a.sort_order - b.sort_order)

  function handleMark(criterionId: string, levelId: number) {
    const current = marks[criterionId]
    const next = current === levelId ? null : levelId  // toggle off if same
    setMarks(prev => {
      const updated = { ...prev }
      if (next === null) delete updated[criterionId]
      else updated[criterionId] = next
      return updated
    })
    startTransition(() => saveMark(planId, assessmentId, criterionId, next))
  }

  function handleComment(value: string) {
    setComment(value)
    if (commentTimer.current) clearTimeout(commentTimer.current)
    commentTimer.current = setTimeout(() => {
      startTransition(() => saveComment(planId, assessmentId, value))
    }, 800)
  }

  function handleOverallResult(code: string | null) {
    setOverallResult(code)
    startTransition(() => saveOverallResult(planId, assessmentId, code))
  }

  function handlePrint() {
    window.print()
  }

  const markedCount = Object.keys(marks).length

  return (
    <>
      {/* Student navigation — hidden when printing */}
      <div className="flex items-center justify-between mb-4 print:hidden">
        {prevStudent
          ? <Link
              href={`/dashboard/gradebook/${planId}/grilles/${prevStudent.id}/${linkId}`}
              className="flex items-center gap-2 text-sm px-4 py-2 border border-gray-200 rounded-xl hover:bg-gray-50 transition text-gray-600"
            >
              ← {prevStudent.name}
            </Link>
          : <div />
        }
        <span className="text-xs text-gray-400">
          {studentPosition.current} / {studentPosition.total}
        </span>
        {nextStudent
          ? <Link
              href={`/dashboard/gradebook/${planId}/grilles/${nextStudent.id}/${linkId}`}
              className="flex items-center gap-2 text-sm px-4 py-2 border border-gray-200 rounded-xl hover:bg-gray-50 transition text-gray-600"
            >
              {nextStudent.name} →
            </Link>
          : <div />
        }
      </div>

      {/* Print button — hidden when printing */}
      <div className="flex items-center justify-between mb-6 print:hidden">
        <div className="text-sm text-gray-500">
          {markedCount === 0
            ? 'Cliquez sur une cellule pour évaluer chaque critère.'
            : `${markedCount} / ${criteria.length} critère${markedCount > 1 ? 's' : ''} évalué${markedCount > 1 ? 's' : ''}`}
        </div>
        <button
          onClick={handlePrint}
          className="flex items-center gap-2 text-sm px-4 py-2 border border-gray-200 rounded-xl hover:bg-gray-50 transition text-gray-600"
        >
          <span>🖨</span> Imprimer / PDF
        </button>
      </div>

      {/* Print header — only visible when printing */}
      <div className="hidden print:block print-header">
        <p className="font-bold">{studentName} — {gridTitle}{etapeName ? ` · ${etapeName}` : ''}</p>
      </div>

      {/* Rubric table */}
      <div className="overflow-x-auto rounded-2xl border border-gray-200 shadow-sm mb-6 print:shadow-none print:border-0 print:rounded-none print:overflow-visible">
        <table className="w-full border-collapse text-sm print:w-full">
          <thead>
            <tr>
              <th className="text-left p-3 bg-gray-50 border-b border-r border-gray-200 font-semibold text-gray-700 min-w-48 print:min-w-0 print:w-auto">
                Critère
              </th>
              {sortedLevels.map((level, idx) => (
                <th
                  key={level.id}
                  className="p-3 bg-gray-50 border-b border-r border-gray-200 font-semibold text-gray-700 text-center last:border-r-0 min-w-32 print:min-w-0"
                >
                  <span className={`inline-block px-2 py-0.5 rounded text-xs font-bold border print-level-badge-${idx} ${levelColor(idx)}`}>
                    {level.code}
                  </span>
                  <span className="block text-xs font-normal text-gray-500 mt-0.5">{level.label}</span>
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {[...criteria].sort((a, b) => a.sort_order - b.sort_order).map((criterion, rowIdx) => {
              const selectedLevelId = marks[criterion.id]
              return (
                <tr key={criterion.id} className={rowIdx % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}>
                  <td className="p-3 border-b border-r border-gray-200 align-top">
                    <CriterionLabel label={criterion.label} />
                    {criterion.weight != null && (
                      <p className="text-xs text-gray-400 mt-1">{criterion.weight}%</p>
                    )}
                  </td>
                  {sortedLevels.map((level, idx) => {
                    const isSelected = selectedLevelId === level.id
                    return (
                      <td
                        key={level.id}
                        onClick={() => handleMark(criterion.id, level.id)}
                        className={`p-3 border-b border-r border-gray-200 align-top last:border-r-0 cursor-pointer transition-colors
                          ${isSelected
                            ? `${levelColor(idx)} ring-2 ring-inset ring-current`
                            : 'hover:bg-blue-50'
                          }`}
                      >
                        {(() => {
                          const descriptor = cellMap[criterion.id]?.[level.id]
                          return descriptor
                            ? <p className={`text-xs leading-snug whitespace-pre-wrap ${isSelected ? 'font-medium' : 'text-gray-600'}`}>{descriptor}</p>
                            : isSelected
                              ? <span className="block text-center text-lg font-bold">✓</span>
                              : null
                        })()}
                      </td>
                    )
                  })}
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Comment — interactive (screen) */}
      <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm print:hidden">
        <label className="text-sm font-semibold text-gray-700 block mb-2">Commentaire</label>
        <textarea
          value={comment}
          onChange={e => handleComment(e.target.value)}
          rows={4}
          placeholder="Observations, points forts, pistes d'amélioration..."
          className="w-full text-sm text-gray-700 border border-gray-200 rounded-xl px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300 resize-none"
        />
      </div>

      {/* Overall result — screen */}
      <div className="bg-white border border-gray-200 rounded-2xl p-5 shadow-sm mt-4 print:hidden">
        <div className="flex items-center justify-between mb-1">
          <p className="text-sm font-semibold text-gray-700">Résultat global</p>
          <div className="flex rounded-lg border border-gray-200 overflow-hidden text-xs font-medium">
            <button
              onClick={() => { setResultMode('letter'); if (isNumericResult(overallResult)) { setOverallResult(null); startTransition(() => saveOverallResult(planId, assessmentId, null)) } }}
              className={`px-3 py-1 transition ${resultMode === 'letter' ? 'bg-gray-700 text-white' : 'text-gray-500 hover:bg-gray-50'}`}>
              Lettre
            </button>
            <button
              onClick={() => { setResultMode('numeric'); if (!isNumericResult(overallResult)) { setOverallResult(null); startTransition(() => saveOverallResult(planId, assessmentId, null)) } }}
              className={`px-3 py-1 transition ${resultMode === 'numeric' ? 'bg-gray-700 text-white' : 'text-gray-500 hover:bg-gray-50'}`}>
              Chiffre
            </button>
          </div>
        </div>
        <p className="text-xs text-gray-400 mb-4">Ce résultat apparaîtra dans le carnet de notes.</p>

        {resultMode === 'letter' ? (
          <div className="flex flex-wrap items-center gap-3">
            {LETTER_GRADES.map((group, gi) => (
              <div key={gi} className={`flex gap-1.5 ${gi < LETTER_GRADES.length - 1 ? 'pr-3 border-r border-gray-200' : ''}`}>
                {group.map(grade => {
                  const isSelected = overallResult === grade
                  const colors = LETTER_COLORS[grade]
                  return (
                    <button
                      key={grade}
                      onClick={() => handleOverallResult(isSelected ? null : grade)}
                      className={`w-12 h-12 rounded-2xl font-bold text-base transition-all duration-150
                        ${isSelected ? colors.active : colors.inactive}`}
                    >
                      {grade}
                    </button>
                  )
                })}
              </div>
            ))}
          </div>
        ) : (
          <div className="flex items-center gap-4">
            <div className="relative w-28 h-28 flex items-center justify-center rounded-full border-4 border-indigo-200 bg-indigo-50 shadow-inner">
              <input
                type="number" min="0" max="100" step="0.5"
                value={numericInput}
                onChange={e => {
                  const val = e.target.value
                  setNumericInput(val)
                  if (numericTimer.current) clearTimeout(numericTimer.current)
                  numericTimer.current = setTimeout(() => {
                    const v = val.trim()
                    const result = v === '' ? null : v
                    setOverallResult(result)
                    startTransition(() => saveOverallResult(planId, assessmentId, result))
                  }, 600)
                }}
                placeholder="—"
                className="w-full text-center text-3xl font-bold text-indigo-700 bg-transparent focus:outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
              />
            </div>
            <div className="flex flex-col gap-1">
              <span className="text-3xl font-bold text-gray-300">%</span>
              {overallResult && isNumericResult(overallResult) && (
                <button onClick={() => { setNumericInput(''); setOverallResult(null); startTransition(() => saveOverallResult(planId, assessmentId, null)) }}
                  className="text-xs text-gray-400 hover:text-red-400 transition">
                  Effacer
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Comment — print only */}
      <div className="hidden print:block print-comment">
        <p className="font-semibold">Commentaire</p>
        <p className="print-comment-text">{comment || '—'}</p>
      </div>

      {/* Overall result — print only */}
      {overallResult && (
        <div className="hidden print:block print-overall">
          <span className="print-overall-label">Résultat global : </span>
          <span className="print-overall-value">{overallResult}</span>
        </div>
      )}

      {/* Print styles */}
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

          .print-header {
            font-size: 9px !important;
            font-weight: bold;
            margin-bottom: 4px !important;
          }

          table {
            width: 100% !important;
            border-collapse: collapse !important;
            table-layout: fixed !important;
            font-size: 7.5px !important;
            line-height: 1.2 !important;
            page-break-inside: avoid !important;
          }
          col, colgroup { display: none; }
          th {
            padding: 3px 4px !important;
            font-size: 7.5px !important;
            word-break: break-word;
          }
          td {
            padding: 3px 4px !important;
            vertical-align: top !important;
            line-height: 1.2 !important;
            word-break: break-word;
          }
          /* First column (criterion) narrower, level columns equal */
          th:first-child, td:first-child { width: 18% !important; }

          .print-comment {
            margin-top: 5px !important;
            font-size: 7.5px !important;
            border-top: 1px solid #ccc;
            padding-top: 3px !important;
          }
          .print-comment-text {
            font-size: 7.5px !important;
            line-height: 1.25 !important;
            margin-top: 2px !important;
          }
          .print-overall {
            margin-top: 4px !important;
            font-size: 8px !important;
            border-top: 1px solid #ccc;
            padding-top: 3px !important;
          }
          .print-overall-label { font-weight: 600; }
          .print-overall-value { font-size: 11px !important; font-weight: 700; }
        }
      `}</style>
    </>
  )
}
