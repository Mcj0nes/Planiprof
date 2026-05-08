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

export async function createPrivateActivity(
  planId: string,
  contentItemId: number,
  title: string,
  description: string,
  typeTag: string,
  durationMin: number | null,
  links: Array<{ url: string; label: string }>,
  isPublic: boolean,
): Promise<{ activityId: string }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Non authentifié')

  const { data: act, error } = await supabase.from('activities').insert({
    user_id: user.id,
    title: title.trim(),
    description: description.trim() || null,
    type_tag: typeTag.trim() || null,
    duration_min: durationMin,
    is_public: isPublic,
  } as any).select('id').single()
  if (error || !act) throw new Error('Erreur lors de la création de l\'activité')

  await supabase.from('activity_content_items').insert({ activity_id: act.id, content_item_id: contentItemId })

  await supabase.from('plan_content_activities').insert({
    plan_id: planId,
    content_item_id: contentItemId,
    activity_id: act.id,
    template_id: null,
    user_id: user.id,
  })

  const validLinks = links.filter(l => l.url.trim())
  if (validLinks.length > 0) {
    await supabase.from('activity_links' as any).insert(
      validLinks.map((l, i) => ({
        activity_id: act.id,
        user_id: user.id,
        url: l.url.trim(),
        label: l.label.trim() || null,
        sort_order: i,
      }))
    )
  }

  return { activityId: act.id }
}

export async function addActivityToBank(activityId: string): Promise<void> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Non authentifié')

  await supabase.from('activities').update({ is_public: true } as any)
    .eq('id', activityId).eq('user_id', user.id)
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
