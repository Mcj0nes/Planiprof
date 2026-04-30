'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export async function acceptInvitation(token: string, ownerId: string, ownerEmail: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Non authentifie')

  await supabase
    .from('collaboration_invitations')
    .update({ status: 'accepted' })
    .eq('id', token)
    .eq('invited_email', user.email!)

  await supabase
    .from('user_collaborators')
    .upsert({ owner_id: ownerId, collaborator_id: user.id, owner_email: ownerEmail })

  const { data: profile } = await supabase
    .from('profiles')
    .select('collaboration_mode')
    .eq('id', user.id)
    .single()

  if (!profile?.collaboration_mode) {
    await supabase
      .from('profiles')
      .update({ collaboration_mode: 'collaborative' })
      .eq('id', user.id)
  }

  redirect('/dashboard')
}

export async function declineInvitation(token: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Non authentifie')

  await supabase
    .from('collaboration_invitations')
    .update({ status: 'declined' })
    .eq('id', token)
    .eq('invited_email', user.email!)

  redirect('/dashboard')
}