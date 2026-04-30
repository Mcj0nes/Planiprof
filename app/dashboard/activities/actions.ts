'use server'

import { createClient } from '@/lib/supabase/server'

export async function createActivity(
  id: string,
  title: string,
  description: string | null,
  subjectId: number | null,
  typeTag: string | null,
  durationMin: number | null,
  gradeLevelTag: string | null,
  contentItemIds: number[],
  gradeLevelIds: number[] = [],
  triggerText: string | null = null,
  openQuestion: string | null = null,
  expectedStrategies: string | null = null,
  observationCriteria: string | null = null,
  pdaLink: string | null = null,
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Non authentifié')

  const { error } = await supabase.from('activities').insert({
    id, user_id: user.id, title, description,
    subject_id: subjectId, type_tag: typeTag,
    duration_min: durationMin, grade_level_tag: gradeLevelTag,
    trigger_text: triggerText, open_question: openQuestion,
    expected_strategies: expectedStrategies, observation_criteria: observationCriteria,
    pda_link: pdaLink,
  })
  if (error) throw new Error(`Impossible de créer l'activité : ${error.message} (code ${error.code})`)

  if (contentItemIds.length > 0) {
    const { error: ciError } = await supabase.from('activity_content_items').insert(
      contentItemIds.map(cid => ({ activity_id: id, content_item_id: cid }))
    )
    if (ciError) throw new Error(`Erreur lors de l'association des contenus : ${ciError.message}`)
  }

  if (gradeLevelIds.length > 0) {
    await supabase.from('activity_grade_levels').insert(
      gradeLevelIds.map(glid => ({ activity_id: id, grade_level_id: glid }))
    )
  }
}

export async function updateActivity(
  id: string,
  title: string,
  description: string | null,
  subjectId: number | null,
  typeTag: string | null,
  durationMin: number | null,
  gradeLevelTag: string | null,
  contentItemIds: number[],
  gradeLevelIds: number[] = [],
  triggerText: string | null = null,
  openQuestion: string | null = null,
  expectedStrategies: string | null = null,
  observationCriteria: string | null = null,
  pdaLink: string | null = null,
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Non authentifié')

  await supabase.from('activities')
    .update({
      title, description, subject_id: subjectId, type_tag: typeTag,
      duration_min: durationMin, grade_level_tag: gradeLevelTag,
      trigger_text: triggerText, open_question: openQuestion,
      expected_strategies: expectedStrategies, observation_criteria: observationCriteria,
      pda_link: pdaLink,
      updated_at: new Date().toISOString(),
    })
    .eq('id', id).eq('user_id', user.id)

  await supabase.from('activity_content_items').delete().eq('activity_id', id)
  if (contentItemIds.length > 0) {
    await supabase.from('activity_content_items').insert(
      contentItemIds.map(cid => ({ activity_id: id, content_item_id: cid }))
    )
  }

  await supabase.from('activity_grade_levels').delete().eq('activity_id', id)
  if (gradeLevelIds.length > 0) {
    await supabase.from('activity_grade_levels').insert(
      gradeLevelIds.map(glid => ({ activity_id: id, grade_level_id: glid }))
    )
  }
}

export async function deleteActivity(id: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Non authentifié')
  // Cascade deletes activity_attachments rows; storage files cleaned up separately
  await supabase.from('activities').delete().eq('id', id).eq('user_id', user.id)
}

export async function addAttachment(
  activityId: string | null,
  templateId: string | null,
  fileName: string,
  filePath: string,
  fileType: string | null,
  fileSize: number | null,
): Promise<string> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Non authentifié')

  const { data, error } = await supabase
    .from('activity_attachments')
    .insert({ activity_id: activityId, template_id: templateId, user_id: user.id, file_name: fileName, file_path: filePath, file_type: fileType, file_size: fileSize })
    .select('id')
    .single()

  if (error) throw error
  return data.id as string
}

export async function addTemplateContentItem(templateId: string, contentItemId: number) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Non authentifié')
  await supabase.from('template_content_items')
    .upsert({ template_id: templateId, content_item_id: contentItemId, user_id: user.id }, { onConflict: 'template_id,content_item_id,user_id' })
}

export async function removeTemplateContentItem(templateId: string, contentItemId: number) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Non authentifié')
  await supabase.from('template_content_items')
    .delete()
    .eq('template_id', templateId).eq('content_item_id', contentItemId).eq('user_id', user.id)
}

export async function deleteAttachment(attachmentId: string, filePath: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Non authentifié')

  await supabase.storage.from('activity-files').remove([filePath])
  await supabase.from('activity_attachments').delete()
    .eq('id', attachmentId).eq('user_id', user.id)
}
