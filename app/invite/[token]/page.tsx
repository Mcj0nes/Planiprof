import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import InviteActions from './InviteActions'

export default async function InvitePage({
  params,
}: {
  params: Promise<{ token: string }>
}) {
  const { token } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect(`/login?next=/invite/${token}`)

  const { data: invitation } = await supabase
    .from('collaboration_invitations')
    .select('id, owner_id, owner_email, invited_email, status, expires_at')
    .eq('id', token)
    .single()

  if (!invitation) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white rounded-2xl shadow p-8 max-w-md w-full text-center">
          <p className="text-gray-500">Invitation introuvable ou expirée.</p>
          <a href="/dashboard" className="text-blue-500 underline text-sm mt-4 block">Retour au tableau de bord</a>
        </div>
      </main>
    )
  }

  if (invitation.status !== 'pending') {
    const messages: Record<string, string> = {
      accepted: 'Cette invitation a déjà été acceptée.',
      declined: 'Cette invitation a été refusée.',
      expired: 'Cette invitation est expirée.',
    }
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white rounded-2xl shadow p-8 max-w-md w-full text-center">
          <p className="text-gray-500">{messages[invitation.status] ?? 'Invitation non disponible.'}</p>
          <a href="/dashboard" className="text-blue-500 underline text-sm mt-4 block">Retour au tableau de bord</a>
        </div>
      </main>
    )
  }

  if (invitation.invited_email !== user.email) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white rounded-2xl shadow p-8 max-w-md w-full text-center">
          <p className="text-red-500 font-medium">Cette invitation n&apos;est pas destinée à votre compte.</p>
          <p className="text-gray-400 text-sm mt-2">Elle a été envoyée à {invitation.invited_email}.</p>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="bg-white rounded-2xl shadow-md p-8 max-w-md w-full">
        <div className="text-5xl mb-4 text-center">&#x1F465;</div>
        <h1 className="text-2xl font-bold text-gray-800 mb-2 text-center">Invitation à collaborer</h1>
        <p className="text-gray-600 text-center mb-6">
          <strong>{invitation.owner_email}</strong> vous invite à collaborer sur sa planification globale et mensuelle dans Planiprof.
        </p>
        <InviteActions token={token} ownerId={invitation.owner_id} ownerEmail={invitation.owner_email} />
      </div>
    </main>
  )
}