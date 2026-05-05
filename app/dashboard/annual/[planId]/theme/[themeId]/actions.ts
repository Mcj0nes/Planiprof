'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function assignToWeekInTheme(
  planId: string,
  contentItemId: number,
  themeId: string,
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

  // Upgrade existing theme-level assignment to week-level
  const { data: existing } = await supabase
    .from('plan_assignments')
    .select('id')
    .eq('annual_plan_id', planId)
    .eq('content_item_id', contentItemId)
    .eq('theme_id', themeId)
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
      .insert({ annual_plan_id: planId, content_item_id: contentItemId, theme_id: themeId, week_start: weekStart })
  }

  revalidatePath(`/dashboard/annual/${planId}/theme/${themeId}`)
}

export async function removeFromWeekInTheme(assignmentId: string, planId: string, themeId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Non authentifié')

  await supabase
    .from('plan_assignments')
    .update({ week_start: null })
    .eq('id', assignmentId)

  revalidatePath(`/dashboard/annual/${planId}/theme/${themeId}`)
}

export async function saveWeekNoteInTheme(
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
