'use client'

import { useState, useTransition } from 'react'
import { deleteGrid } from './actions'

export default function DeleteGridButton({ gridId, returnUrl }: { gridId: string; returnUrl: string }) {
  const [confirming, setConfirming]  = useState(false)
  const [isPending, startTransition] = useTransition()

  if (!confirming) {
    return (
      <button
        onClick={() => setConfirming(true)}
        className="text-sm px-4 py-2 text-red-500 border border-red-200 rounded-lg hover:bg-red-50 transition"
      >
        Supprimer
      </button>
    )
  }

  return (
    <div className="flex items-center gap-2">
      <span className="text-sm text-gray-600">Supprimer cette version ?</span>
      <button
        onClick={() => startTransition(() => deleteGrid(gridId, returnUrl))}
        disabled={isPending}
        className="text-sm px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition disabled:opacity-60"
      >
        {isPending ? 'Suppression...' : 'Confirmer'}
      </button>
      <button
        onClick={() => setConfirming(false)}
        disabled={isPending}
        className="text-sm px-4 py-2 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition"
      >
        Annuler
      </button>
    </div>
  )
}
