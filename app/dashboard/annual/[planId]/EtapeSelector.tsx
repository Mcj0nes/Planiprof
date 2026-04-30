'use client'

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { updateLinkEtape } from './eval-links-actions'

type Etape = { id: string; name: string; sort_order: number }

export default function EtapeSelector({
  planId, linkId, currentEtapeId, etapes,
}: {
  planId: string; linkId: string; currentEtapeId: string; etapes: Etape[]
}) {
  const router = useRouter()
  const [, start] = useTransition()

  return (
    <select
      defaultValue={currentEtapeId}
      onChange={e => {
        const val = e.target.value
        start(async () => { await updateLinkEtape(planId, linkId, val || null); router.refresh() })
      }}
      className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-1 focus:ring-blue-300 text-gray-600 shrink-0"
    >
      <option value="">Aucune étape</option>
      {etapes.map(e => <option key={e.id} value={e.id}>{e.name}</option>)}
    </select>
  )
}
