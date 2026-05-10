'use server'

import { createClient } from '@/lib/supabase/server'

// ─── Text matching helpers ────────────────────────────────────────────────────

const STOP_WORDS = new Set([
  'le', 'la', 'les', 'de', 'du', 'des', 'un', 'une', 'et', 'ou', 'par', 'pour',
  'dans', 'en', 'a', 'au', 'aux', 'sur', 'sous', 'avec', 'sans', 'se', 'ce',
  'cet', 'cette', 'ces', 'il', 'elle', 'ils', 'elles', 'on', 'que', 'qui',
  'dont', 'si', 'est', 'sont', 'pas', 'ne', 'plus', 'tres', 'bien', 'tout',
  'tous', 'toute', 'toutes', 'leur', 'leurs', 'mon', 'ton', 'son', 'ma', 'ta',
  'sa', 'nos', 'vos', 'ses', 'je', 'tu', 'nous', 'vous', 'y', 'aussi', 'comme',
])

function normalizeText(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD').replace(/[̀-ͯ]/g, '')
    .replace(/[^a-z0-9\s]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
}

function tokenize(text: string): string[] {
  return normalizeText(text)
    .split(' ')
    .filter(w => w.length > 2 && !STOP_WORDS.has(w))
}

function scoreMatch(activityTokens: string[], contentName: string): number {
  const contentTokens = tokenize(contentName)
  if (contentTokens.length === 0) return 0
  let matches = 0
  for (const ct of contentTokens) {
    if (activityTokens.some(at => at === ct || at.includes(ct) || ct.includes(at))) {
      matches++
    }
  }
  return matches / contentTokens.length
}

async function autoMatchContentItems(
  supabase: Awaited<ReturnType<typeof createClient>>,
  subjectId: number,
  gradeLevelIds: number[],
  activityText: string,
): Promise<number[]> {
  if (gradeLevelIds.length === 0) return []
  const activityTokens = tokenize(activityText)
  if (activityTokens.length === 0) return []

  const { data: items } = await supabase
    .from('content_items')
    .select('id, name_fr, competencies!inner(subject_id)')
    .in('grade_level_id', gradeLevelIds)
    .eq('competencies.subject_id', subjectId)

  if (!items || items.length === 0) return []

  const THRESHOLD = 0.5
  return items
    .filter((item: any) => scoreMatch(activityTokens, item.name_fr) >= THRESHOLD)
    .map((item: any) => item.id as number)
}

// ─────────────────────────────────────────────────────────────────────────────

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

  let finalContentItemIds = contentItemIds
  if (finalContentItemIds.length === 0 && subjectId && gradeLevelIds.length > 0) {
    const activityText = [title, description, pdaLink, triggerText, openQuestion, expectedStrategies, observationCriteria]
      .filter(Boolean).join(' ')
    finalContentItemIds = await autoMatchContentItems(supabase, subjectId, gradeLevelIds, activityText)
  }

  if (finalContentItemIds.length > 0) {
    const { error: ciError } = await supabase.from('activity_content_items').insert(
      finalContentItemIds.map(cid => ({ activity_id: id, content_item_id: cid }))
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

export async function getSuggestedActivitiesForContent(
  contentItemId: number,
  excludeActivityIds: string[],
  excludeTemplateIds: string[],
): Promise<{ id: string; title: string; type_tag: string | null; duration_min: number | null; is_template: boolean }[]> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data: contentItem } = await supabase
    .from('content_items').select('name_fr').eq('id', contentItemId).single()
  if (!contentItem) return []

  const contentTokens = tokenize(contentItem.name_fr)
  if (contentTokens.length === 0) return []

  const THRESHOLD = 0.4

  const [{ data: userActivities }, { data: templates }] = await Promise.all([
    supabase.from('activities')
      .select('id, title, description, pda_link, trigger_text, open_question, type_tag, duration_min')
      .eq('user_id', user.id)
      .not('id', 'in', excludeActivityIds.length > 0 ? `(${excludeActivityIds.map(id => `"${id}"`).join(',')})` : '("")'),
    supabase.from('activity_templates')
      .select('id, title, description, pda_link, trigger_text, open_question, type_tag, duration_min')
      .not('id', 'in', excludeTemplateIds.length > 0 ? `(${excludeTemplateIds.map(id => `"${id}"`).join(',')})` : '("")'),
  ])

  const results: { id: string; title: string; type_tag: string | null; duration_min: number | null; is_template: boolean }[] = []

  for (const act of userActivities ?? []) {
    const text = [act.title, act.description, act.pda_link, act.trigger_text, act.open_question].filter(Boolean).join(' ')
    if (scoreMatch(tokenize(text), contentItem.name_fr) >= THRESHOLD) {
      results.push({ id: act.id, title: act.title, type_tag: act.type_tag, duration_min: act.duration_min, is_template: false })
    }
  }

  for (const tpl of templates ?? []) {
    const text = [tpl.title, tpl.description, tpl.pda_link, tpl.trigger_text, tpl.open_question].filter(Boolean).join(' ')
    if (scoreMatch(tokenize(text), contentItem.name_fr) >= THRESHOLD) {
      results.push({ id: tpl.id, title: tpl.title, type_tag: tpl.type_tag, duration_min: tpl.duration_min, is_template: true })
    }
  }

  return results.slice(0, 8)
}

export async function autoMatchAllActivities(): Promise<{ matched: number; skipped: number }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Non authentifié')

  // Fetch all user activities that have no content associations yet
  const { data: activities } = await supabase
    .from('activities')
    .select('id, title, description, subject_id, pda_link, trigger_text, open_question, expected_strategies, observation_criteria, activity_grade_levels(grade_level_id), activity_content_items(content_item_id)')
    .eq('user_id', user.id)

  if (!activities) return { matched: 0, skipped: 0 }

  let matched = 0
  let skipped = 0

  for (const activity of activities) {
    if ((activity.activity_content_items as any[]).length > 0) { skipped++; continue }
    if (!activity.subject_id) { skipped++; continue }

    const gradeLevelIds = (activity.activity_grade_levels as any[]).map((gl: any) => gl.grade_level_id)
    if (gradeLevelIds.length === 0) { skipped++; continue }

    const activityText = [
      activity.title, activity.description, activity.pda_link,
      activity.trigger_text, activity.open_question,
      activity.expected_strategies, activity.observation_criteria,
    ].filter(Boolean).join(' ')

    const matchedIds = await autoMatchContentItems(supabase, activity.subject_id, gradeLevelIds, activityText)

    if (matchedIds.length > 0) {
      await supabase.from('activity_content_items').insert(
        matchedIds.map(cid => ({ activity_id: activity.id, content_item_id: cid }))
      )
      matched++
    } else {
      skipped++
    }
  }

  return { matched, skipped }
}

export async function deleteAttachment(attachmentId: string, filePath: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Non authentifié')

  await supabase.storage.from('activity-files').remove([filePath])
  await supabase.from('activity_attachments').delete()
    .eq('id', attachmentId).eq('user_id', user.id)
}

export async function getTemplateFiles(templateId: string): Promise<{
  attachments: { id: string; file_name: string; file_path: string; file_type: string | null; file_size: number | null }[]
  documents:   { id: string; name: string; url: string }[]
}> {
  const supabase = await createClient()
  const [{ data: atts, error: attsErr }, { data: docs, error: docsErr }] = await Promise.all([
    supabase.from('activity_attachments').select('id, file_name, file_path, file_type, file_size').eq('template_id', templateId),
    supabase.from('template_documents').select('id, name, url').eq('template_id', templateId),
  ])
  return {
    attachments: (atts ?? []).map((a: any) => ({ id: a.id, file_name: a.file_name, file_path: a.file_path, file_type: a.file_type, file_size: a.file_size })),
    documents:   (docs ?? []).map((d: any) => ({ id: d.id, name: d.name, url: d.url })),
  }
}

export async function deleteTemplateDocument(docId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Non authentifié')

  await supabase.from('template_documents').delete().eq('id', docId)
}
