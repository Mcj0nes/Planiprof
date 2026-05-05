'use client'

import { useState, useTransition } from 'react'
import { saveEtapeConfigs } from './actions'

const SCHOOL_YEAR_OPTIONS = (() => {
  const now = new Date()
  const y = now.getFullYear()
  const base = now.getMonth() >= 8 ? y : y - 1
  return Array.from({ length: 4 }, (_, i) => {
    const s = base - 1 + i
    return `${s}-${s + 1}`
  })
})()

const CURRENT_SCHOOL_YEAR = SCHOOL_YEAR_OPTIONS[1]

function defaultDates(schoolYear: string) {
  const [startYear] = schoolYear.split('-').map(Number)
  return [
    { start: `${startYear}-09-02`, end: `${startYear}-11-10` },
    { start: `${startYear}-11-11`, end: `${startYear + 1}-03-01` },
    { start: `${startYear + 1}-03-02`, end: `${startYear + 1}-06-23` },
  ]
}

type Props = {
  existingConfigs?: { school_year: string; etape_number: number; start_date: string; end_date: string }[]
}

export default function EtapeSetupForm({ existingConfigs = [] }: Props) {
  const [schoolYear, setSchoolYear] = useState(CURRENT_SCHOOL_YEAR)
  const [saved, setSaved] = useState(false)
  const [, startTransition] = useTransition()

  const existing = existingConfigs.filter(c => c.school_year === schoolYear)
  const defaults = defaultDates(schoolYear)

  const [dates, setDates] = useState(() => defaults.map((d, i) => {
    const ex = existing.find(c => c.etape_number === i + 1)
    return { start: ex?.start_date ?? d.start, end: ex?.end_date ?? d.end }
  }))

  function handleYearChange(year: string) {
    setSchoolYear(year)
    const ex = existingConfigs.filter(c => c.school_year === year)
    const def = defaultDates(year)
    setDates(def.map((d, i) => {
      const found = ex.find(c => c.etape_number === i + 1)
      return { start: found?.start_date ?? d.start, end: found?.end_date ?? d.end }
    }))
    setSaved(false)
  }

  function handleSave() {
    startTransition(async () => {
      await saveEtapeConfigs(schoolYear, [
        { etape_number: 1, start_date: dates[0].start, end_date: dates[0].end },
        { etape_number: 2, start_date: dates[1].start, end_date: dates[1].end },
        { etape_number: 3, start_date: dates[2].start, end_date: dates[2].end },
      ])
      setSaved(true)
    })
  }

  const ETAPE_COLORS = [
    { bg: '#EDE9FE', text: '#5B21B6', border: '#7C3AED' },
    { bg: '#DBEAFE', text: '#1E40AF', border: '#3B82F6' },
    { bg: '#D1FAE5', text: '#065F46', border: '#10B981' },
  ]

  return (
    <div className="bg-white rounded-2xl border shadow-sm p-6 mb-8">
      <h3 className="text-lg font-bold text-gray-800 mb-1">Configurer les étapes</h3>
      <p className="text-sm text-gray-500 mb-5">Définissez les dates de début et de fin de chacune des 3 étapes du bulletin.</p>

      <div className="mb-5">
        <label className="block text-sm font-medium text-gray-700 mb-1">Année scolaire</label>
        <select
          value={schoolYear}
          onChange={e => handleYearChange(e.target.value)}
          className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
        >
          {SCHOOL_YEAR_OPTIONS.map(y => <option key={y} value={y}>{y}</option>)}
        </select>
      </div>

      <div className="flex flex-col gap-3">
        {[0, 1, 2].map(i => {
          const { bg, text, border } = ETAPE_COLORS[i]
          return (
            <div key={i} className="flex items-center gap-4 p-4 rounded-xl" style={{ backgroundColor: bg }}>
              <span className="text-sm font-bold w-16 shrink-0" style={{ color: text }}>Étape {i + 1}</span>
              <div className="flex items-center gap-2 flex-1">
                <input
                  type="date"
                  value={dates[i].start}
                  onChange={e => setDates(prev => prev.map((d, j) => j === i ? { ...d, start: e.target.value } : d))}
                  className="border rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2"
                  style={{ borderColor: border, color: text }}
                />
                <span className="text-sm" style={{ color: text }}>→</span>
                <input
                  type="date"
                  value={dates[i].end}
                  onChange={e => setDates(prev => prev.map((d, j) => j === i ? { ...d, end: e.target.value } : d))}
                  className="border rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2"
                  style={{ borderColor: border, color: text }}
                />
              </div>
            </div>
          )
        })}
      </div>

      <div className="flex items-center gap-3 mt-5">
        <button
          onClick={handleSave}
          className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition hover:opacity-90"
          style={{ backgroundColor: 'var(--color-nav)' }}
        >
          Enregistrer les dates
        </button>
        {saved && <span className="text-sm text-green-600 font-medium">✓ Enregistré</span>}
      </div>
    </div>
  )
}
