'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { sendInvitationEmail } from '@/lib/email'

export async function completeOnboarding(
  mode: 'individual' | 'collaborative',
  emails: string[]
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Non authentifie')

  await supabase
    .from('profiles')
    .update({ collaboration_mode: mode })
    .eq('id', user.id)

  if (mode === 'collaborative' && emails.length > 0) {
    for (const email of emails) {
      const normalized = email.toLowerCase()
      const { data: inv } = await supabase
        .from('collaboration_invitations')
        .insert({ owner_id: user.id, owner_email: user.email!, invited_email: normalized })
        .select('id')
        .single()
      if (inv) {
        await sendInvitationEmail({ to: normalized, inviterEmail: user.email!, token: inv.id })
      }
    }
  }

  redirect('/dashboard')
}

export async function sendMoreInvitations(emails: string[]) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Non authentifie')

  for (const email of emails) {
    const normalized = email.toLowerCase()
    const { data: inv } = await supabase
      .from('collaboration_invitations')
      .insert({ owner_id: user.id, owner_email: user.email!, invited_email: normalized })
      .select('id')
      .single()
    if (inv) {
      await sendInvitationEmail({ to: normalized, inviterEmail: user.email!, token: inv.id })
    }
  }
}