'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { addEvalLink } from './eval-links-actions'

type Grid = {
  id: string; title: string; competency: string | null; grid_type: string;
  is_baseline: boolean; subject_name: string | null
}
type Etape = { id: string; name: string; sort_order: number }

interface Props {
  planId:   string
  etapes:   Etape[]
  grids:    Grid[]
}

export default function AddEvalGridPanel({ planId, etapes, grids }: Props) {
  const router = useRouter()
  const [open, setOpen]           = useState(false)
  const [selected, setSelected]   = useState<string | null>(null)
  const [etapeId, setEtapeId]     = useState<string>('')
  const [weight, setWeight]       = useState<string>('')
  const [isPending, start]        = useTransition()
  const [search, setSearch]       = useState('')

  function handleAdd() {
    if (!selected) return
    const weightNum = weight.trim() ? parseInt(weight, 10) : null
    start(async () => {
      await addEvalLink(planId, selected, etapeId || null, weightNum)
      setOpen(false)
      setSelected(null)
      setEtapeId('')
      setWeight('')
      setSearch('')
      router.refresh()
    })
  }

  const filtered = grids.filter(g =>
    !search.trim() ||
    g.title.toLowerCase().includes(search.toLowerCase()) ||
    (g.subject_name?.toLowerCase().includes(search.toLowerCase()))
  )

  if (!open) {
    return (
      <button
        onClick={() => setOpen(true)}
        className="text-sm px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition shadow-sm"
      >
        + Ajouter une grille
      </button>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg mx-4 flex flex-col max-h-[80vh]">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h3 className="font-semibold text-gray-800">Ajouter une grille d&apos;évaluation</h3>
          <button onClick={() => { setOpen(false); setSelected(null); setSearch('') }}
            className="text-gray-400 hover:text-gray-600 text-xl leading-none">✕</button>
        </div>

        <div className="px-6 py-3 border-b border-gray-100">
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Rechercher..."
            className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
        </div>

        <div className="overflow-y-auto flex-1 px-6 py-3">
          {filtered.length === 0 && (
            <p className="text-sm text-gray-400 py-4 text-center">Aucune grille disponible pour ce niveau.</p>
          )}
          {filtered.map(g => (
            <label
              key={g.id}
              className={`flex items-start gap-3 p-3 rounded-xl cursor-pointer mb-2 border transition
                ${selected === g.id ? 'border-blue-400 bg-blue-50' : 'border-gray-200 hover:bg-gray-50'}`}
            >
              <input
                type="radio"
                name="grid"
                value={g.id}
                checked={selected === g.id}
                onChange={() => setSelected(g.id)}
                className="mt-0.5 shrink-0 accent-blue-600"
              />
              <div className="min-w-0">
                <p className="text-sm font-medium text-gray-800 leading-snug">{g.title}</p>
                <div className="flex items-center gap-2 mt-0.5 flex-wrap">
                  {g.subject_name && <span className="text-xs text-gray-500">{g.subject_name}</span>}
                  {g.competency   && <span className="text-xs bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded">{g.competency}</span>}
                  {!g.is_baseline && <span className="text-xs text-purple-500">Ma version</span>}
                  <span className="text-xs text-gray-400">{g.grid_type === 'conversation' ? 'Discussion' : 'Évaluation'}</span>
                </div>
              </div>
            </label>
          ))}
        </div>

        <div className="px-6 py-4 border-t border-gray-100 flex items-end gap-3 flex-wrap">
          <div className="flex-1 min-w-36">
            <label className="text-xs text-gray-500 mb-1 block">Étape (optionnel)</label>
            <select
              value={etapeId}
              onChange={e => setEtapeId(e.target.value)}
              className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
            >
              <option value="">— Aucune étape —</option>
              {etapes.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
            </select>
          </div>
          <div className="w-28">
            <label className="text-xs text-gray-500 mb-1 block">Pondération (%)</label>
            <input
              type="number"
              min="1" max="100" step="1"
              value={weight}
              onChange={e => setWeight(e.target.value)}
              placeholder="ex. 30"
              className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
            />
          </div>
          <button
            onClick={handleAdd}
            disabled={!selected || isPending}
            className="text-sm px-5 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition disabled:opacity-50 shrink-0"
          >
            {isPending ? 'Ajout...' : 'Ajouter'}
          </button>
        </div>
      </div>
    </div>
  )
}
