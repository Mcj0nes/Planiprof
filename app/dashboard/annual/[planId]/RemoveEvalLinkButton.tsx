'use client'

import { useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { removeEvalLink } from './eval-links-actions'

export default function RemoveEvalLinkButton({ planId, linkId }: { planId: string; linkId: string }) {
  const router = useRouter()
  const [isPending, start] = useTransition()

  return (
    <button
      onClick={() => {
        if (!confirm('Retirer cette grille de la planification ?')) return
        start(async () => { await removeEvalLink(planId, linkId); router.refresh() })
      }}
      disabled={isPending}
      className="text-gray-300 hover:text-red-400 text-lg leading-none transition disabled:opacity-40 shrink-0 pt-0.5"
      title="Retirer"
    >
      ✕
    </button>
  )
}
