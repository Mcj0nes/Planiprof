'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function assignToWeek(
  planId: string,
  contentItemId: number,
  month: number,
  weekStart: string
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Non authentifié')

  const { data: plan } = await supabase
    .from('annual_plans')
    .select('id')
    .eq('id', planId)
    .eq('user_id', user.id)
    .single()
  if (!plan) throw new Error('Plan introuvable')

  // If a month-level assignment exists (no week yet), upgrade it to week-level
  const { data: existing } = await supabase
    .from('plan_assignments')
    .select('id')
    .eq('annual_plan_id', planId)
    .eq('content_item_id', contentItemId)
    .eq('month', month)
    .is('week_start', null)
    .maybeSingle()

  if (existing) {
    await supabase
      .from('plan_assignments')
      .update({ week_start: weekStart })
      .eq('id', existing.id)
  } else {
    await supabase
      .from('plan_assignments')
      .insert({ annual_plan_id: planId, content_item_id: contentItemId, month, week_start: weekStart })
  }

  revalidatePath(`/dashboard/annual/${planId}/month/${month}`)
}

export async function removeFromWeek(assignmentId: string, planId: string, month: number) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Non authentifié')

  // Set week_start back to null (keeps the month-level assignment)
  await supabase
    .from('plan_assignments')
    .update({ week_start: null })
    .eq('id', assignmentId)

  revalidatePath(`/dashboard/annual/${planId}/month/${month}`)
}

export async function toggleTaught(assignmentId: string, isTaught: boolean) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Non authentifié')

  await supabase
    .from('plan_assignments')
    .update({ is_taught: isTaught })
    .eq('id', assignmentId)
}

export async function saveWeekNote(
  planId: string,
  weekStart: string,
  field: 'special_activities' | 'reflective_review',
  value: string
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Non authentifié')

  const { data: plan } = await supabase
    .from('annual_plans')
    .select('id')
    .eq('id', planId)
    .eq('user_id', user.id)
    .single()
  if (!plan) throw new Error('Plan introuvable')

  await supabase
    .from('week_notes')
    .upsert(
      { annual_plan_id: planId, week_start: weekStart, [field]: value },
      { onConflict: 'annual_plan_id,week_start' }
    )
}
