'use client'

import { useState } from 'react'
import { acceptInvitation, declineInvitation } from './actions'

export default function InviteActions({
  token,
  ownerId,
  ownerEmail,
}: {
  token: string
  ownerId: string
  ownerEmail: string
}) {
  const [loading, setLoading] = useState<'accept' | 'decline' | null>(null)

  async function handleAccept() {
    setLoading('accept')
    await acceptInvitation(token, ownerId, ownerEmail)
  }

  async function handleDecline() {
    setLoading('decline')
    await declineInvitation(token)
  }

  return (
    <div className="flex flex-col gap-3">
      <button
        onClick={handleAccept}
        disabled={!!loading}
        className="w-full bg-blue-600 text-white rounded-xl py-3 font-semibold hover:bg-blue-700 transition disabled:opacity-50"
      >
        {loading === 'accept' ? 'En cours...' : "Accepter l'invitation"}
      </button>
      <button
        onClick={handleDecline}
        disabled={!!loading}
        className="w-full border border-gray-200 text-gray-600 rounded-xl py-3 text-sm hover:bg-gray-50 transition disabled:opacity-50"
      >
        {loading === 'decline' ? 'En cours...' : 'Refuser'}
      </button>
    </div>
  )
}