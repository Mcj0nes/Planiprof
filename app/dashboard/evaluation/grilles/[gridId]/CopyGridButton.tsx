'use client'

import { useTransition } from 'react'
import { copyGrid } from './actions'

export default function CopyGridButton({
  gridId,
  returnBase = '/dashboard/evaluation/grilles',
}: {
  gridId: string
  returnBase?: string
}) {
  const [isPending, startTransition] = useTransition()

  return (
    <button
      onClick={() => startTransition(() => copyGrid(gridId, returnBase))}
      disabled={isPending}
      className="text-sm px-5 py-2.5 bg-blue-600 text-white rounded-xl hover:bg-blue-700 transition shadow-sm disabled:opacity-60 whitespace-nowrap"
    >
      {isPending ? 'Création...' : 'Créer ma version'}
    </button>
  )
}
