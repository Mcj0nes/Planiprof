'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { addEvalLink } from '@/app/dashboard/annual/[planId]/eval-links-actions'

type Plan = {
  id: string
  label: string
  etapes: { id: string; name: string }[]
}

export default function AddToGradebookButton({
  gridId,
  plans,
  alreadyLinkedPlanIds,
}: {
  gridId:               string
  plans:                Plan[]
  alreadyLinkedPlanIds: string[]
}) {
  const router = useRouter()
  const [open, setOpen]       = useState(false)
  const [planId, setPlanId]   = useState(plans[0]?.id ?? '')
  const [etapeId, setEtapeId] = useState('')
  const [weight, setWeight]   = useState('')
  const [done, setDone]       = useState(false)
  const [isPending, start]    = useTransition()

  if (plans.length === 0) return null

  const currentPlan   = plans.find(p => p.id === planId) ?? plans[0]
  const linkedPlans   = plans.filter(p => alreadyLinkedPlanIds.includes(p.id))
  const availablePlans = plans.filter(p => !alreadyLinkedPlanIds.includes(p.id))

  if (availablePlans.length === 0) {
    return (
      <span className="text-xs text-green-600 font-medium px-3 py-1.5 bg-green-50 rounded-lg shrink-0">
        ✓ Déjà dans le carnet
      </span>
    )
  }

  if (done) {
    return (
      <span className="text-xs text-green-600 font-medium px-3 py-1.5 bg-green-50 rounded-lg shrink-0">
        ✓ Ajoutée au carnet
      </span>
    )
  }

  function handleAdd() {
    const targetPlanId = availablePlans.length === 1 ? availablePlans[0].id : planId
    if (!targetPlanId) return
    const w = weight.trim() ? parseInt(weight, 10) : null
    start(async () => {
      await addEvalLink(targetPlanId, gridId, etapeId || null, w)
      setDone(true)
      setOpen(false)
      router.refresh()
    })
  }

  if (!open) {
    return (
      <button
        onClick={() => {
          if (availablePlans.length === 1) {
            setPlanId(availablePlans[0].id)
            setEtapeId('')
            setWeight('')
          }
          setOpen(true)
        }}
        className="text-sm px-4 py-2 border border-blue-300 text-blue-700 bg-blue-50 rounded-lg hover:bg-blue-100 transition shrink-0"
      >
        + Carnet de notes
      </button>
    )
  }

  return (
    <>
      <button
        onClick={() => {
          if (availablePlans.length === 1) {
            setPlanId(availablePlans[0].id)
            setEtapeId('')
            setWeight('')
          }
          setOpen(true)
        }}
        className="text-sm px-4 py-2 border border-blue-300 text-blue-700 bg-blue-50 rounded-lg hover:bg-blue-100 transition shrink-0"
      >
        + Carnet de notes
      </button>

      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={() => setOpen(false)}>
        <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm mx-4 p-6" onClick={e => e.stopPropagation()}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-semibold text-gray-800">Ajouter au carnet de notes</h3>
            <button onClick={() => setOpen(false)} className="text-gray-400 hover:text-gray-600 text-xl leading-none">✕</button>
          </div>

          <div className="space-y-4">
            {availablePlans.length > 1 && (
              <div>
                <label className="text-xs text-gray-500 mb-1 block">Plan</label>
                <select
                  value={planId}
                  onChange={e => { setPlanId(e.target.value); setEtapeId('') }}
                  className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
                >
                  {availablePlans.map(p => (
                    <option key={p.id} value={p.id}>{p.label}</option>
                  ))}
                </select>
              </div>
            )}

            {availablePlans.length === 1 && (
              <p className="text-sm text-gray-600 bg-gray-50 rounded-lg px-3 py-2">{availablePlans[0].label}</p>
            )}

            <div>
              <label className="text-xs text-gray-500 mb-1 block">Étape (optionnel)</label>
              <select
                value={etapeId}
                onChange={e => setEtapeId(e.target.value)}
                className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
              >
                <option value="">— Aucune étape —</option>
                {(availablePlans.find(p => p.id === (availablePlans.length === 1 ? availablePlans[0].id : planId))?.etapes ?? []).map(e => (
                  <option key={e.id} value={e.id}>{e.name}</option>
                ))}
              </select>
            </div>

            <div>
              <label className="text-xs text-gray-500 mb-1 block">Pondération % (optionnel)</label>
              <input
                type="number" min="1" max="100" step="1"
                value={weight}
                onChange={e => setWeight(e.target.value)}
                placeholder="ex. 30"
                className="w-full text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
            </div>
          </div>

          <div className="flex gap-3 mt-6">
            <button
              onClick={() => setOpen(false)}
              className="flex-1 text-sm px-4 py-2 border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 transition"
            >
              Annuler
            </button>
            <button
              onClick={handleAdd}
              disabled={isPending}
              className="flex-1 text-sm px-4 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition disabled:opacity-50"
            >
              {isPending ? 'Ajout...' : 'Ajouter'}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}
