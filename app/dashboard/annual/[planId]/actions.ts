'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function assignToMonth(planId: string, contentItemId: number, month: number) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Non authentifié')

  // Verify the plan belongs to this user
  const { data: plan } = await supabase
    .from('annual_plans')
    .select('id')
    .eq('id', planId)
    .eq('user_id', user.id)
    .single()
  if (!plan) throw new Error('Plan introuvable')

  await supabase.from('plan_assignments').insert({
    annual_plan_id: planId,
    content_item_id: contentItemId,
    month,
  })

  revalidatePath(`/dashboard/annual/${planId}`)
}

export async function unassign(assignmentId: string, planId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Non authentifié')

  await supabase.from('plan_assignments').delete().eq('id', assignmentId)

  revalidatePath(`/dashboard/annual/${planId}`)
}

export async function assignToEtape(planId: string, contentItemId: number, etapeNumber: number) {
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

  await supabase.from('plan_assignments').insert({
    annual_plan_id: planId,
    content_item_id: contentItemId,
    etape_number: etapeNumber,
  })

  revalidatePath(`/dashboard/annual/${planId}`)
}

export async function unassignFromEtape(assignmentId: string, planId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Non authentifié')

  await supabase.from('plan_assignments').delete().eq('id', assignmentId)

  revalidatePath(`/dashboard/annual/${planId}`)
}

export async function assignToTheme(planId: string, contentItemId: number, themeId: string) {
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

  await supabase.from('plan_assignments').insert({
    annual_plan_id: planId,
    content_item_id: contentItemId,
    theme_id: themeId,
  })

  revalidatePath(`/dashboard/annual/${planId}`)
}

export async function unassignFromTheme(assignmentId: string, planId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Non authentifié')

  await supabase.from('plan_assignments').delete().eq('id', assignmentId)

  revalidatePath(`/dashboard/annual/${planId}`)
}

export async function assignProjectToMonth(planId: string, projectId: string, month: number) {
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

  await supabase.from('project_assignments').insert({
    annual_plan_id: planId,
    project_id: projectId,
    month,
  })

  revalidatePath(`/dashboard/annual/${planId}`)
}

export async function unassignProject(assignmentId: string, planId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Non authentifié')

  await supabase.from('project_assignments').delete().eq('id', assignmentId)

  revalidatePath(`/dashboard/annual/${planId}`)
}

export async function setProgressionType(
  contentItemId: number,
  type: 'finalite' | 'progression' | null
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Non authentifié')

  await supabase
    .from('content_items')
    .update({ progression_type: type })
    .eq('id', contentItemId)
}

export async function assignActivityToContent(
  planId: string,
  contentItemId: number,
  activityId: string | null,
  templateId: string | null,
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Non authentifié')

  await supabase.from('plan_content_activities').insert({
    plan_id: planId,
    content_item_id: contentItemId,
    activity_id: activityId ?? null,
    template_id: templateId ?? null,
    user_id: user.id,
  })
}

export async function unassignActivityFromContent(
  planId: string,
  contentItemId: number,
  activityId: string | null,
  templateId: string | null,
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Non authentifié')

  let q = supabase.from('plan_content_activities')
    .delete()
    .eq('plan_id', planId)
    .eq('content_item_id', contentItemId)
    .eq('user_id', user.id)

  if (activityId) q = q.eq('activity_id', activityId)
  if (templateId) q = q.eq('template_id', templateId)

  await q
}
