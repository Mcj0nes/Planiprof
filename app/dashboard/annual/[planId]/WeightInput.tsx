'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { updateLinkWeight } from './eval-links-actions'

interface Props {
  planId:    string
  linkId:    string
  current:   number | null
}

export default function WeightInput({ planId, linkId, current }: Props) {
  const router = useRouter()
  const [editing, setEditing]  = useState(false)
  const [value, setValue]      = useState(current?.toString() ?? '')
  const [, start]              = useTransition()

  function handleBlur() {
    setEditing(false)
    const num = value.trim() ? parseInt(value, 10) : null
    const validated = num !== null && num >= 1 && num <= 100 ? num : null
    if (validated !== current) {
      start(async () => {
        await updateLinkWeight(planId, linkId, validated)
        router.refresh()
      })
    }
  }

  if (editing) {
    return (
      <input
        type="number"
        min="1" max="100" step="1"
        value={value}
        onChange={e => setValue(e.target.value)}
        onBlur={handleBlur}
        autoFocus
        className="w-16 text-center text-xs border border-blue-300 rounded-lg px-1 py-0.5 focus:outline-none focus:ring-2 focus:ring-blue-300"
      />
    )
  }

  return (
    <button
      onClick={() => setEditing(true)}
      className="text-xs px-2 py-0.5 rounded-lg border border-dashed border-gray-300 text-gray-500 hover:border-blue-400 hover:text-blue-600 transition"
      title="Modifier la pondération"
    >
      {current != null ? `${current}%` : '— %'}
    </button>
  )
}
