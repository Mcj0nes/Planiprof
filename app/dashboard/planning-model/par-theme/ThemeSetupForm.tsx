'use client'

import { useState, useTransition } from 'react'
import { saveThemeConfigs } from './actions'

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

const THEME_COLORS = [
  '#7C3AED', '#2563EB', '#059669', '#D97706',
  '#DB2777', '#EA580C', '#16A34A', '#0284C7',
  '#CA8A04', '#475569', '#9333EA', '#DC2626',
]

type ThemeRow = { id: string | null; name: string; start_date: string; end_date: string }

type ExistingConfig = { id: string; school_year: string; sort_order: number; name: string; start_date: string; end_date: string }

type Props = { existingConfigs?: ExistingConfig[] }

export default function ThemeSetupForm({ existingConfigs = [] }: Props) {
  const [schoolYear, setSchoolYear] = useState(CURRENT_SCHOOL_YEAR)
  const [saved, setSaved] = useState(false)
  const [, startTransition] = useTransition()

  function getRowsForYear(year: string): ThemeRow[] {
    const ex = existingConfigs.filter(c => c.school_year === year).sort((a, b) => a.sort_order - b.sort_order)
    if (ex.length > 0) return ex.map(c => ({ id: c.id, name: c.name, start_date: c.start_date, end_date: c.end_date }))
    return [
      { id: null, name: '', start_date: '', end_date: '' },
      { id: null, name: '', start_date: '', end_date: '' },
    ]
  }

  const [themes, setThemes] = useState<ThemeRow[]>(() => getRowsForYear(CURRENT_SCHOOL_YEAR))

  function handleYearChange(year: string) {
    setSchoolYear(year)
    setThemes(getRowsForYear(year))
    setSaved(false)
  }

  function updateTheme(i: number, field: keyof ThemeRow, value: string) {
    setThemes(prev => prev.map((t, j) => j === i ? { ...t, [field]: value } : t))
    setSaved(false)
  }

  function addTheme() {
    setThemes(prev => [...prev, { id: null, name: '', start_date: '', end_date: '' }])
  }

  function handleSave() {
    const valid = themes.filter(t => t.name.trim() && t.start_date && t.end_date)
    if (valid.length === 0) return
    startTransition(async () => {
      await saveThemeConfigs(schoolYear, valid.map((t, i) => ({ ...t, sort_order: i })))
      setSaved(true)
    })
  }

  return (
    <div className="bg-white rounded-2xl border shadow-sm p-6 mb-8">
      <h3 className="text-lg font-bold text-gray-800 mb-1">Configurer les thèmes / projets</h3>
      <p className="text-sm text-gray-500 mb-5">Donnez un nom à chaque thème ou projet et définissez ses dates.</p>

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

      <div className="flex flex-col gap-2 mb-4">
        {themes.map((t, i) => {
          const color = THEME_COLORS[i % THEME_COLORS.length]
          return (
            <div key={i} className="flex items-center gap-3 p-3 rounded-xl border" style={{ borderColor: `${color}40`, backgroundColor: `${color}08` }}>
              <span className="w-6 h-6 rounded-full shrink-0 flex items-center justify-center text-xs font-bold text-white" style={{ backgroundColor: color }}>
                {i + 1}
              </span>
              <input
                type="text"
                value={t.name}
                onChange={e => updateTheme(i, 'name', e.target.value)}
                placeholder="Nom du thème ou projet"
                className="flex-1 border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
              />
              <input
                type="date"
                value={t.start_date}
                onChange={e => updateTheme(i, 'start_date', e.target.value)}
                className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none"
              />
              <span className="text-gray-400 text-sm">→</span>
              <input
                type="date"
                value={t.end_date}
                onChange={e => updateTheme(i, 'end_date', e.target.value)}
                className="border border-gray-200 rounded-lg px-3 py-1.5 text-sm focus:outline-none"
              />
            </div>
          )
        })}
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={addTheme}
          className="px-4 py-2 rounded-xl text-sm font-medium border border-gray-200 text-gray-600 hover:bg-gray-50 transition"
        >
          + Ajouter un thème
        </button>
        <button
          onClick={handleSave}
          className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition hover:opacity-90"
          style={{ backgroundColor: 'var(--color-nav)' }}
        >
          Enregistrer
        </button>
        {saved && <span className="text-sm text-green-600 font-medium">✓ Enregistré</span>}
      </div>
    </div>
  )
}
