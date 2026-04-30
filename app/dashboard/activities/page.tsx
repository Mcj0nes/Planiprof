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
    .select('id, name_fr, color')
    .eq('is_active', true)
    .order('name_fr')

  // Grade levels (primaire) for the multi-level picker
  const { data: gradeLevels } = await supabase
    .from('grade_levels')
    .select('id, label_fr')
    .eq('education_level', 'primaire')
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
    .select('id, title, description, subject_id, type_tag, duration_min, grade_level_tag, created_at, subjects(id, name_fr, color), activity_content_items(content_item_id), activity_grade_levels(grade_level_id)')
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
    created_at:      a.created_at,
    is_template:     false,
    category:        null as string | null,
    trigger_text:         null as string | null,
    open_question:        null as string | null,
    expected_strategies:  null as string | null,
    observation_criteria: null as string | null,
    pda_link:             null as string | null,
  }))

  // Pre-loaded activity templates (with pedagogical detail fields)
  const { data: rawTemplates } = await supabase
    .from('activity_templates')
    .select('id, title, description, subject_id, type_tag, duration_min, grade_level_tag, category, trigger_text, open_question, expected_strategies, observation_criteria, pda_link, created_at, subjects(id, name_fr, color)')
    .order('category')
    .order('created_at')

  // Attachments for templates
  const templateIds = (rawTemplates ?? []).map((t: any) => t.id)
  const [rawTplAttachmentsRes, rawTplContentLinks] = await Promise.all([
    templateIds.length > 0
      ? supabase.from('activity_attachments')
          .select('id, template_id, file_name, file_path, file_type, file_size')
          .in('template_id', templateIds)
      : Promise.resolve({ data: [] }),
    templateIds.length > 0
      ? supabase.from('template_content_items')
          .select('template_id, content_item_id')
          .in('template_id', templateIds)
          .eq('user_id', user.id)
      : Promise.resolve({ data: [] }),
  ])

  const rawTplAttachments = rawTplAttachmentsRes.data ?? []

  const attachmentsByTemplate: Record<string, any[]> = {}
  for (const att of rawTplAttachments) {
    if (!attachmentsByTemplate[(att as any).template_id]) attachmentsByTemplate[(att as any).template_id] = []
    attachmentsByTemplate[(att as any).template_id].push(att)
  }

  const contentItemsByTemplate: Record<string, number[]> = {}
  for (const link of (rawTplContentLinks.data ?? []) as any[]) {
    if (!contentItemsByTemplate[link.template_id]) contentItemsByTemplate[link.template_id] = []
    contentItemsByTemplate[link.template_id].push(link.content_item_id)
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
    attachments:     (attachmentsByTemplate[t.id] ?? []).map((att: any) => ({
      id: att.id, file_name: att.file_name, file_path: att.file_path,
      file_type: att.file_type, file_size: att.file_size,
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
