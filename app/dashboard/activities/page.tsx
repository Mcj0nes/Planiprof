import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import ActivitiesClient from './ActivitiesClient'

export default async function ActivitiesPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // All subjects
  const { data: subjects } = await supabase
    .from('subjects')
    .select('id, name_fr, slug, color')
    .eq('is_active', true)
    .order('name_fr')

  // Grade levels (primaire) for the multi-level picker
  const { data: gradeLevels } = await supabase
    .from('grade_levels')
    .select('id, label_fr')
    .in('education_level', ['primaire', 'préscolaire'])
    .order('grade')

  // All content items from the PDA curriculum (filtered client-side by selected subject)
  const { data: contentItemsData } = await supabase
    .from('content_items')
    .select('id, name_fr, sort_order, competency_id, grade_level_id, competencies(id, name_fr, subject_id, subjects(id, name_fr, color)), grade_levels(id, label_fr)')
    .order('sort_order')
  const contentItems: any[] = contentItemsData ?? []

  // User's own activities with subject + content item links + grade level links
  const { data: rawActivities } = await supabase
    .from('activities')
    .select('id, title, description, subject_id, type_tag, duration_min, grade_level_tag, trigger_text, open_question, expected_strategies, observation_criteria, pda_link, created_at, subjects(id, name_fr, color), activity_content_items(content_item_id), activity_grade_levels(grade_level_id)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })

  // Attachments for user's activities
  const { data: rawAttachments } = await supabase
    .from('activity_attachments')
    .select('id, activity_id, file_name, file_path, file_type, file_size')
    .eq('user_id', user.id)
    .not('activity_id', 'is', null)

  const attachmentsByActivity: Record<string, any[]> = {}
  for (const att of rawAttachments ?? []) {
    if (!attachmentsByActivity[att.activity_id]) attachmentsByActivity[att.activity_id] = []
    attachmentsByActivity[att.activity_id].push(att)
  }

  const activities = (rawActivities ?? []).map((a: any) => ({
    id:              a.id,
    title:           a.title,
    description:     a.description,
    subject_id:      a.subject_id,
    subject:         a.subjects ?? null,
    type_tag:        a.type_tag,
    duration_min:    a.duration_min,
    grade_level_tag: a.grade_level_tag,
    grade_level_ids: (a.activity_grade_levels ?? []).map((r: any) => r.grade_level_id),
    content_item_ids: (a.activity_content_items ?? []).map((r: any) => r.content_item_id),
    attachments:     (attachmentsByActivity[a.id] ?? []).map((att: any) => ({
      id: att.id, file_name: att.file_name, file_path: att.file_path,
      file_type: att.file_type, file_size: att.file_size,
    })),
    documents:       [] as { id: string; name: string; url: string }[],
    created_at:      a.created_at,
    is_template:     false,
    category:        null as string | null,
    trigger_text:         a.trigger_text         ?? null,
    open_question:        a.open_question        ?? null,
    expected_strategies:  a.expected_strategies  ?? null,
    observation_criteria: a.observation_criteria ?? null,
    pda_link:             a.pda_link             ?? null,
  }))

  const [
    { data: rawTemplates },
    { data: rawTplContentLinks },
    { data: rawTemplateAtts },
    { data: rawTemplateDocs },
  ] = await Promise.all([
    supabase
      .from('activity_templates')
      .select('id, title, description, subject_id, type_tag, duration_min, grade_level_tag, category, trigger_text, open_question, expected_strategies, observation_criteria, pda_link, created_at, subjects(id, name_fr, slug, color)')
      .order('category')
      .order('created_at'),
    supabase
      .from('template_content_items')
      .select('template_id, content_item_id')
      .eq('user_id', user.id),
    supabase
      .from('activity_attachments')
      .select('id, template_id, file_name, file_path, file_type, file_size')
      .not('template_id', 'is', null),
    supabase
      .from('template_documents')
      .select('id, template_id, name, url'),
  ])

  const contentItemsByTemplate: Record<string, number[]> = {}
  for (const link of (rawTplContentLinks ?? []) as any[]) {
    if (!contentItemsByTemplate[link.template_id]) contentItemsByTemplate[link.template_id] = []
    contentItemsByTemplate[link.template_id].push(link.content_item_id)
  }

  const attsByTemplate: Record<string, any[]> = {}
  for (const att of (rawTemplateAtts ?? []) as any[]) {
    if (!attsByTemplate[att.template_id]) attsByTemplate[att.template_id] = []
    attsByTemplate[att.template_id].push(att)
  }

  const docsByTemplate: Record<string, any[]> = {}
  for (const doc of (rawTemplateDocs ?? []) as any[]) {
    if (!docsByTemplate[doc.template_id]) docsByTemplate[doc.template_id] = []
    docsByTemplate[doc.template_id].push(doc)
  }

  const templates = (rawTemplates ?? []).map((t: any) => ({
    id:              t.id,
    title:           t.title,
    description:     t.description,
    subject_id:      t.subject_id,
    subject:         t.subjects ?? null,
    type_tag:        t.type_tag,
    duration_min:    t.duration_min,
    grade_level_tag: t.grade_level_tag,
    grade_level_ids: [] as number[],
    content_item_ids: (contentItemsByTemplate[t.id] ?? []) as number[],
    attachments:     (attsByTemplate[t.id] ?? []).map((att: any) => ({
      id: att.id, file_name: att.file_name, file_path: att.file_path,
      file_type: att.file_type, file_size: att.file_size,
    })),
    documents:       (docsByTemplate[t.id] ?? []).map((doc: any) => ({
      id: doc.id, name: doc.name, url: doc.url,
    })),
    created_at:      t.created_at,
    is_template:     true,
    category:        t.category as string | null,
    trigger_text:         t.trigger_text         ?? null,
    open_question:        t.open_question        ?? null,
    expected_strategies:  t.expected_strategies  ?? null,
    observation_criteria: t.observation_criteria ?? null,
    pda_link:             t.pda_link             ?? null,
  }))

  return (
    <main className="min-h-screen bg-gray-50">
      <nav className="px-6 py-4 flex items-center gap-3" style={{ backgroundColor: 'var(--color-nav)' }}>
        <Link href="/dashboard" className="text-white/70 hover:text-white text-sm transition">
          ← Tableau de bord
        </Link>
        <span className="text-white/40">/</span>
        <span className="text-lg font-bold text-white flex-1">Banque d&apos;activités</span>
      </nav>

      <ActivitiesClient
        activities={activities}
        templates={templates}
        subjects={subjects ?? []}
        contentItems={contentItems}
        gradeLevels={gradeLevels ?? []}
        userId={user.id}
      />
    </main>
  )
}
