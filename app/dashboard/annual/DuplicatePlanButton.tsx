'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { duplicatePlan } from './actions'

function generateYears(excludeYear: string): string[] {
  const currentYear = new Date().getFullYear()
  const years: string[] = []
  for (let y = currentYear - 1; y <= currentYear + 3; y++) {
    const yearStr = `${y}-${y + 1}`
    if (yearStr !== excludeYear) years.push(yearStr)
  }
  return years
}

export default function DuplicatePlanButton({ planId, planYear }: { planId: string; planYear: string }) {
  const [open, setOpen] = useState(false)
  const [selectedYear, setSelectedYear] = useState('')
  const [isPending, startTransition] = useTransition()
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const years = generateYears(planYear)

  function handleDuplicate() {
    if (!selectedYear) return
    setError(null)
    startTransition(async () => {
      try {
        await duplicatePlan(planId, selectedYear)
        setOpen(false)
        setSelectedYear('')
        router.refresh()
      } catch (e: any) {
        setError(e.message ?? 'Erreur')
      }
    })
  }

  return (
    <>
      <button
        onClick={e => { e.preventDefault(); setOpen(true) }}
        className="text-gray-300 hover:text-blue-400 transition-colors text-sm"
        title="Dupliquer cette planification"
      >
        ⧉
      </button>

      {open && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/40"
          onClick={() => setOpen(false)}
        >
          <div
            className="bg-white rounded-2xl p-6 shadow-xl w-80 max-w-[90vw]"
            onClick={e => e.stopPropagation()}
          >
            <h3 className="text-lg font-bold text-gray-800 mb-2">Dupliquer la planification</h3>
            <p className="text-sm text-gray-500 mb-4">
              Les contenus seront remappés à partir de la rentrée de l&apos;année cible — les dates ne sont pas copiées littéralement.
            </p>

            <label className="text-sm font-medium text-gray-700 mb-1.5 block">Année scolaire cible</label>
            <select
              value={selectedYear}
              onChange={e => setSelectedYear(e.target.value)}
              className="w-full border rounded-lg px-3 py-2 text-sm mb-4 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">— Choisir une année —</option>
              {years.map(y => <option key={y} value={y}>{y}</option>)}
            </select>

            {error && <p className="text-red-500 text-xs mb-3">{error}</p>}

            <div className="flex gap-2 justify-end">
              <button
                onClick={() => { setOpen(false); setSelectedYear('') }}
                className="px-4 py-2 text-sm text-gray-600 hover:text-gray-800 rounded-lg transition"
              >
                Annuler
              </button>
              <button
                onClick={handleDuplicate}
                disabled={!selectedYear || isPending}
                className="px-4 py-2 text-sm bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition"
              >
                {isPending ? 'Duplication…' : 'Dupliquer'}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
