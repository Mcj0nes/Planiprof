'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { setEtapeJugement } from './actions'

const LEVEL_COLORS: Record<number, { bg: string; border: string }> = {
  1: { bg: 'bg-red-300',    border: 'border-red-400' },
  2: { bg: 'bg-yellow-200', border: 'border-yellow-400' },
  3: { bg: 'bg-green-200',  border: 'border-green-300' },
  4: { bg: 'bg-green-400',  border: 'border-green-500' },
}

const LEVEL_LABELS: Record<number, string> = {
  1: 'En émergence', 2: 'En développement', 3: 'Assuré', 4: 'Remarquable',
}

interface Props {
  etape:  number
  grids:  { id: string; gridNumber: number }[]
  rows:   { name: string; scores: (number | null)[]; jugement: number | null }[]
}

function toUrl(etape: number | null, grille?: number, vue?: string) {
  const p = new URLSearchParams()
  if (etape !== null) p.set('etape', String(etape))
  if (vue) p.set('vue', vue)
  else if (grille != null) p.set('grille', String(grille))
  return `?${p}`
}

function calcAverage(scores: (number | null)[]): number | null {
  const valid = scores.filter(s => s !== null) as number[]
  if (!valid.length) return null
  return Math.round((valid.reduce((a, b) => a + b, 0) / valid.length) * 10) / 10
}

function ScoreColor({ score, separator }: { score: number | null; separator?: boolean }) {
  const c = score !== null ? LEVEL_COLORS[Math.round(score) as 1 | 2 | 3 | 4] : null
  return (
    <td
      className={`border border-gray-200 text-center align-middle text-sm font-semibold ${c ? `${c.bg} ${c.border}` : 'text-gray-300'}`}
      style={{ height: 44, ...(separator ? { borderLeft: '2px solid #c7d2fe' } : {}) }}
    >
      {score !== null ? score : '—'}
    </td>
  )
}

function JugementCell({ etape, studentName, initialScore }: { etape: number; studentName: string; initialScore: number | null }) {
  const [score, setLocalScore] = useState<number | null>(initialScore)
  const [editing, setEditing]  = useState(false)
  const [input, setInput]      = useState('')
  const [, startTransition]    = useTransition()

  const c = score !== null ? LEVEL_COLORS[score as 1 | 2 | 3 | 4] : null

  function commit(raw: string) {
    const n = parseInt(raw, 10)
    const next = n >= 1 && n <= 4 ? n : null
    setLocalScore(next)
    setEditing(false)
    setInput('')
    startTransition(() => setEtapeJugement(etape, studentName, next))
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (['1', '2', '3', '4'].includes(e.key)) { e.preventDefault(); commit(e.key) }
    else if (e.key === 'Backspace' || e.key === 'Delete' || e.key === '0') { e.preventDefault(); commit('') }
    else if (e.key === 'Escape') { setEditing(false); setInput('') }
  }

  return (
    <td
      className={`border border-gray-200 text-center align-middle cursor-pointer select-none transition-colors ${c ? `${c.bg} ${c.border}` : 'bg-white hover:bg-gray-50'}`}
      style={{ height: 44, borderLeft: '2px solid #a5b4fc' }}
      onClick={() => { if (!editing) { setEditing(true); setInput('') } }}
    >
      {editing ? (
        <input autoFocus value={input} onChange={() => {}} onKeyDown={handleKeyDown} onBlur={() => { setEditing(false); setInput('') }}
          className="w-full h-full text-center text-sm bg-transparent outline-none caret-transparent" readOnly />
      ) : null}
    </td>
  )
}

export default function EtapeOverview({ etape, grids, rows }: Props) {
  const router = useRouter()
  const [showPrintMenu, setShowPrintMenu] = useState(false)
  const printAllUrl = `/dashboard/evaluation/observation/educ-physique-conversation-2e-cycle/print-all?etape=${etape}`

  return (
    <div>
      <div className="flex items-center gap-2 mb-6 flex-wrap">
        <span className="text-xs font-medium text-gray-500 shrink-0">Étape :</span>
        {([1, 2, 3] as const).map(n => (
          <button key={n} onClick={() => router.push(toUrl(n, undefined, 'ensemble'))}
            className={`text-xs px-3 py-1.5 rounded-full font-medium border transition ${etape === n ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300'}`}>
            Étape {n}
          </button>
        ))}
        <button onClick={() => router.push('?grille=1')} className="text-xs text-gray-400 hover:text-gray-600 underline transition ml-1">Toutes les grilles</button>
      </div>

      <div className="flex items-center gap-1.5 mb-5 flex-wrap">
        {grids.map(g => (
          <button key={g.id} onClick={() => router.push(toUrl(etape, g.gridNumber))}
            className="text-xs px-3 py-1.5 rounded-full font-medium border bg-white text-gray-600 border-gray-200 hover:border-indigo-300 transition">
            Grille {g.gridNumber}
          </button>
        ))}
        <button className="text-xs px-3 py-1.5 rounded-full font-medium border bg-blue-600 text-white border-blue-600 cursor-default">Vue d&apos;ensemble</button>
      </div>

      <div className="print:hidden flex justify-end mb-3 relative">
        <button onClick={() => setShowPrintMenu(v => !v)}
          className="text-xs px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-600 hover:bg-gray-50 hover:border-gray-400 transition flex items-center gap-1.5 shadow-sm">
          🖨 Imprimer / PDF
        </button>
        {showPrintMenu && (
          <>
            <div className="fixed inset-0 z-10" onClick={() => setShowPrintMenu(false)} />
            <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-20 overflow-hidden min-w-48">
              <button onClick={() => { setShowPrintMenu(false); window.print() }}
                className="w-full text-left text-xs px-4 py-2.5 hover:bg-gray-50 text-gray-700 border-b border-gray-100">
                Imprimer la vue d&apos;ensemble
              </button>
              <a href={printAllUrl} target="_blank" rel="noreferrer" onClick={() => setShowPrintMenu(false)}
                className="block text-xs px-4 py-2.5 hover:bg-gray-50 text-gray-700">
                Imprimer toutes les grilles
              </a>
            </div>
          </>
        )}
      </div>

      {rows.length === 0 ? (
        <p className="text-sm text-gray-400 py-8 text-center">Aucune donnée pour cette étape.</p>
      ) : (
        <div className="print-table-wrap overflow-x-auto rounded-2xl border border-gray-200 shadow-sm mb-10">
          <table className="border-collapse text-sm" style={{ minWidth: 500 }}>
            <thead>
              <tr>
                <th className="p-3 bg-gray-100 border-b border-r border-gray-200 text-left font-semibold text-gray-700 sticky left-0 z-10" style={{ minWidth: 180 }}>Nom de l&apos;élève</th>
                {grids.map(g => (
                  <th key={g.id} className="p-3 bg-indigo-50 border-b border-r border-gray-200 font-semibold text-indigo-700 text-center" style={{ width: 90 }}>
                    <span className="block text-xs leading-tight">Grille {g.gridNumber}</span>
                    <span className="block text-[10px] font-normal text-indigo-400 mt-0.5">Résultat global</span>
                  </th>
                ))}
                <th className="p-3 bg-blue-50 border-b border-r border-gray-200 font-semibold text-blue-700 text-center" style={{ width: 90, borderLeft: '2px solid #c7d2fe' }}>
                  <span className="block text-xs leading-tight">Moyenne des</span>
                  <span className="block text-xs leading-tight">résultats globaux</span>
                </th>
                <th className="p-3 bg-indigo-50 border-b border-r border-gray-200 font-semibold text-indigo-700 text-center" style={{ width: 110, borderLeft: '2px solid #a5b4fc' }}>
                  <span className="block text-xs leading-tight">Jugement</span>
                  <span className="block text-xs leading-tight">professionnel</span>
                </th>
              </tr>
            </thead>
            <tbody>
              {rows.map((row, idx) => {
                const avg = calcAverage(row.scores)
                return (
                  <tr key={row.name} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/60'}>
                    <td className="border-b border-r border-gray-200 px-3 py-2 sticky left-0 z-10 bg-inherit text-sm text-gray-800">{row.name}</td>
                    {row.scores.map((score, i) => <ScoreColor key={i} score={score} />)}
                    <ScoreColor score={avg} separator />
                    <JugementCell etape={etape} studentName={row.name} initialScore={row.jugement} />
                  </tr>
                )
              })}
            </tbody>
          </table>
        </div>
      )}

      <div className="print:hidden bg-white border border-gray-200 rounded-2xl p-5 shadow-sm">
        <h3 className="text-sm font-semibold text-gray-700 mb-3">Légende</h3>
        <div className="flex flex-wrap gap-3 mb-2">
          {([1, 2, 3, 4] as const).map(n => {
            const c = LEVEL_COLORS[n]
            return (
              <div key={n} className={`flex items-center gap-2 px-3 py-1.5 rounded-xl border ${c.bg} ${c.border}`}>
                <span className={`w-6 h-6 flex items-center justify-center rounded-md text-xs font-bold border ${c.border} bg-white/70`}>{n}</span>
                <span className="text-xs font-medium text-gray-700">{LEVEL_LABELS[n]}</span>
              </div>
            )
          })}
        </div>
        <p className="text-xs text-gray-400 mt-2">
          La colonne <span className="font-medium">Jugement professionnel</span> est modifiable — cliquez sur une cellule et tapez 1, 2, 3 ou 4.
          La <span className="font-medium">Moyenne</span> est calculée automatiquement à partir des résultats globaux de chaque grille.
        </p>
      </div>
    </div>
  )
}
