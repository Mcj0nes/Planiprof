'use client'

import { useState, useRef } from 'react'
import { saveJugement } from './actions'

type Row = { name: string; lectureAvgs: (number | null)[]; oralAvgs: (number | null)[] }

const JUG_COLORS: Record<number, string> = {
  1: 'bg-red-100 text-red-700',
  2: 'bg-yellow-100 text-yellow-700',
  3: 'bg-green-100 text-green-700',
  4: 'bg-green-200 text-green-800',
}

function JugementCell({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const [editing, setEditing] = useState(false)
  const n = parseInt(value, 10)
  const cls = n >= 1 && n <= 4 ? JUG_COLORS[n] : null

  function commit(raw: string) {
    const num = parseInt(raw, 10)
    onChange(num >= 1 && num <= 4 ? String(num) : '')
    setEditing(false)
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (['1','2','3','4'].includes(e.key)) { e.preventDefault(); commit(e.key) }
    else if (e.key === 'Backspace' || e.key === 'Delete' || e.key === '0') { e.preventDefault(); commit('') }
    else if (e.key === 'Escape') setEditing(false)
  }

  return (
    <td
      className={`border-b border-gray-200 text-center align-middle cursor-pointer select-none transition-colors text-sm font-semibold
        ${cls ?? 'bg-white hover:bg-gray-50 text-gray-300'}`}
      style={{ borderLeft: '2px solid #a5b4fc', width: 120, height: 44 }}
      onClick={() => { if (!editing) setEditing(true) }}
    >
      {editing ? (
        <input
          autoFocus
          value=""
          onChange={() => {}}
          onKeyDown={handleKeyDown}
          onBlur={() => setEditing(false)}
          className="w-full h-full text-center bg-transparent outline-none caret-transparent"
          readOnly
        />
      ) : (cls ? n : '—')}
    </td>
  )
}

function colorCell(avg: number | null) {
  if (avg === null) return { text: '—', cls: 'bg-gray-50 text-gray-300' }
  const t = avg.toFixed(1)
  if (avg < 1.5) return { text: t, cls: 'bg-red-100 text-red-700 font-semibold' }
  if (avg < 2.5) return { text: t, cls: 'bg-yellow-100 text-yellow-700 font-semibold' }
  if (avg < 3.5) return { text: t, cls: 'bg-green-100 text-green-700 font-semibold' }
  return { text: t, cls: 'bg-green-200 text-green-800 font-semibold' }
}

function computeMoy(vals: (number | null)[]): number | null {
  const v = vals.filter((x): x is number => x !== null)
  return v.length ? v.reduce((a, b) => a + b, 0) / v.length : null
}

export default function OverviewTable({
  gridId,
  etape,
  sessions,
  rows,
  jugements: initialJugements,
  prescolaire = false,
}: {
  gridId:       string
  etape:        number | null
  sessions:     { id: string; sessionNumber: number }[]
  rows:         Row[]
  jugements:    Record<string, { lecture: string; oral: string }>
  prescolaire?: boolean
}) {
  const [jugements, setJugements] = useState(initialJugements)
  const [showPrintMenu, setShowPrintMenu] = useState(false)
  const debounce = useRef<Record<string, ReturnType<typeof setTimeout>>>({})

  function handleJugement(name: string, type: 'lecture' | 'oral', value: string) {
    const key = name.trim().toLowerCase()
    setJugements(prev => ({
      ...prev,
      [key]: { ...(prev[key] ?? { lecture: '', oral: '' }), [type]: value },
    }))
    const dKey = `${key}-${type}`
    clearTimeout(debounce.current[dKey])
    debounce.current[dKey] = setTimeout(() => saveJugement(gridId, etape, name, type, value), 600)
  }

  const printAllUrl = `/dashboard/evaluation/conversations/${gridId}/print-all${etape ? `?etape=${etape}` : ''}`

  const printButton = (
    <div className="print:hidden flex justify-end mb-3 relative">
      <button
        onClick={() => setShowPrintMenu(v => !v)}
        className="text-xs px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-600 hover:bg-gray-50 hover:border-gray-400 transition flex items-center gap-1.5 shadow-sm"
      >
        🖨 Imprimer / PDF
      </button>
      {showPrintMenu && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setShowPrintMenu(false)} />
          <div className="absolute right-0 top-full mt-1 bg-white border border-gray-200 rounded-xl shadow-lg z-20 overflow-hidden min-w-48">
            <button
              onClick={() => { setShowPrintMenu(false); window.print() }}
              className="w-full text-left text-xs px-4 py-2.5 hover:bg-gray-50 text-gray-700 border-b border-gray-100"
            >
              Imprimer la vue d&apos;ensemble
            </button>
            <a
              href={printAllUrl}
              target="_blank"
              rel="noreferrer"
              onClick={() => setShowPrintMenu(false)}
              className="block text-xs px-4 py-2.5 hover:bg-gray-50 text-gray-700"
            >
              Imprimer toutes les grilles
            </a>
          </div>
        </>
      )}
    </div>
  )

  if (sessions.length === 0 || rows.length === 0) {
    return (
      <>
        {printButton}
        <div className="bg-white border border-gray-200 rounded-2xl p-10 text-center text-gray-400 text-sm">
          Aucune donnée disponible. Remplissez au moins une séance pour voir la vue d&apos;ensemble.
        </div>
      </>
    )
  }

  return (
    <>
      {printButton}
      <div className="overview-table-wrap overflow-x-auto rounded-2xl border border-gray-200 shadow-sm">
      <table className="border-collapse text-sm" style={{ minWidth: 'max-content' }}>
        <thead>
          <tr>
            <th className="p-3 bg-gray-100 border-b border-r border-gray-200 text-left font-semibold text-gray-700 sticky left-0 z-10" style={{ minWidth: 180 }}>
              Élève
            </th>
            {!prescolaire && (
              <th className="p-3 bg-gray-100 border-b border-r border-gray-200 font-semibold text-gray-500 text-center" style={{ width: 72 }}>
                <span className="text-xs">Type</span>
              </th>
            )}
            {sessions.map(s => (
              <th key={s.id} className="p-3 bg-gray-100 border-b border-r border-gray-200 font-semibold text-gray-700 text-center" style={{ width: 88 }}>
                <span className="text-xs">Séance {s.sessionNumber}</span>
              </th>
            ))}
            <th className="p-3 bg-blue-50 border-b border-r border-gray-200 font-semibold text-blue-700 text-center" style={{ width: 88, borderLeft: '2px solid #93c5fd' }}>
              <span className="text-xs">Moyenne</span>
            </th>
            <th className="p-3 bg-indigo-50 border-b border-gray-200 font-semibold text-indigo-700 text-center" style={{ width: 120, borderLeft: '2px solid #a5b4fc' }}>
              <span className="text-xs">Jugement professionnel</span>
            </th>
          </tr>
        </thead>
        {rows.map((row, ri) => {
            const key     = row.name.trim().toLowerCase()
            const jug     = jugements[key] ?? { lecture: '', oral: '' }
            const lectMoy = colorCell(computeMoy(row.lectureAvgs))
            const oralMoy = colorCell(computeMoy(row.oralAvgs))
            const colCount = sessions.length + 4 // type + sessions + moyenne + jugement

            return (
              <tbody key={ri} style={{ breakInside: 'avoid', pageBreakInside: 'avoid' }}>
                <tr key={`${ri}-name`}>
                  <td
                    colSpan={colCount}
                    className="px-4 py-2 border-b border-t-2 border-gray-300 bg-gray-50 font-semibold text-gray-800 text-sm sticky left-0"
                  >
                    {row.name}
                  </td>
                </tr>

                {prescolaire ? (
                  /* Préscolaire: single oral row, no lecture/oral split */
                  <tr key={`${ri}-oral`} className="bg-white">
                    <td className="border-b border-r border-gray-200 sticky left-0 bg-white" />
                    {row.oralAvgs.map((avg, si) => {
                      const { text, cls } = colorCell(avg)
                      return (
                        <td key={si} className={`border-b border-r border-gray-200 text-center py-2 text-sm ${cls}`} style={{ width: 88 }}>
                          {text}
                        </td>
                      )
                    })}
                    <td className={`border-b border-r border-gray-200 text-center py-2 text-sm ${oralMoy.cls}`} style={{ width: 88, borderLeft: '2px solid #93c5fd' }}>
                      {oralMoy.text}
                    </td>
                    <JugementCell
                      value={jug.oral}
                      onChange={v => handleJugement(row.name, 'oral', v)}
                    />
                  </tr>
                ) : (
                  <>
                    {/* Lecture row */}
                    <tr key={`${ri}-lecture`} className="bg-white">
                      <td className="border-b border-r border-gray-200 sticky left-0 bg-white" />
                      <td className="px-2 py-2 border-b border-r border-gray-200 text-xs font-medium text-blue-600 text-center">
                        Lecture
                      </td>
                      {row.lectureAvgs.map((avg, si) => {
                        const { text, cls } = colorCell(avg)
                        return (
                          <td key={si} className={`border-b border-r border-gray-200 text-center py-2 text-sm ${cls}`} style={{ width: 88 }}>
                            {text}
                          </td>
                        )
                      })}
                      <td className={`border-b border-r border-gray-200 text-center py-2 text-sm ${lectMoy.cls}`} style={{ width: 88, borderLeft: '2px solid #93c5fd' }}>
                        {lectMoy.text}
                      </td>
                      <JugementCell
                        value={jug.lecture}
                        onChange={v => handleJugement(row.name, 'lecture', v)}
                      />
                    </tr>

                    {/* Oral row */}
                    <tr key={`${ri}-oral`} className="bg-gray-50/40">
                      <td className="border-b border-r border-gray-200 sticky left-0 bg-gray-50/40" />
                      <td className="px-2 py-2 border-b border-r border-gray-200 text-xs font-medium text-indigo-600 text-center">
                        Oral
                      </td>
                      {row.oralAvgs.map((avg, si) => {
                        const { text, cls } = colorCell(avg)
                        return (
                          <td key={si} className={`border-b border-r border-gray-200 text-center py-2 text-sm ${cls}`} style={{ width: 88 }}>
                            {text}
                          </td>
                        )
                      })}
                      <td className={`border-b border-r border-gray-200 text-center py-2 text-sm ${oralMoy.cls}`} style={{ width: 88, borderLeft: '2px solid #93c5fd' }}>
                        {oralMoy.text}
                      </td>
                      <JugementCell
                        value={jug.oral}
                        onChange={v => handleJugement(row.name, 'oral', v)}
                      />
                    </tr>
                  </>
                )}
              </tbody>
            )
          })}
      </table>
    </div>
    </>
  )
}
