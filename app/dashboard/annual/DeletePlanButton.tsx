'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { deletePlan } from './actions'

export default function DeletePlanButton({ planId }: { planId: string }) {
  const [confirming, setConfirming] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleDelete() {
    setLoading(true)
    await deletePlan(planId)
    router.refresh()
  }

  if (confirming) {
    return (
      <div className="flex items-center gap-1" onClick={e => e.preventDefault()}>
        <span className="text-xs text-gray-500">Supprimer ?</span>
        <button
          onClick={handleDelete}
          disabled={loading}
          className="text-xs px-2 py-0.5 bg-red-500 text-white rounded hover:bg-red-600 disabled:opacity-50"
        >
          {loading ? '…' : 'Oui'}
        </button>
        <button
          onClick={() => setConfirming(false)}
          className="text-xs px-2 py-0.5 bg-gray-200 text-gray-600 rounded hover:bg-gray-300"
        >
          Non
        </button>
      </div>
    )
  }

  return (
    <button
      onClick={e => { e.preventDefault(); setConfirming(true) }}
      className="text-gray-300 hover:text-red-400 transition-colors text-sm"
      title="Supprimer cette planification"
    >
      ✕
    </button>
  )
}
