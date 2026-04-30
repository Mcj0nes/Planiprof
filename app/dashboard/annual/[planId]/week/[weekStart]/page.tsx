import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { Suspense } from 'react'
import WeeklyGrid from './WeeklyGrid'
import EvalLinksSection from '../../EvalLinksSection'

const MONTH_ABBR: Record<number, string> = {
  8: 'août', 9: 'sept.', 10: 'oct.', 11: 'nov.', 12: 'déc.',
  1: 'jan.', 2: 'fév.', 3: 'mars', 4: 'avr.', 5: 'mai', 6: 'juin',
}

function getWeekLabel(weekStart: string): string {
  const [y, m, d] = weekStart.split('-').map(Number)
  const mon = new Date(y, m - 1, d)
  const sun = new Date(y, m - 1, d + 6)
  const monAbbr = MONTH_ABBR[mon.getMonth() + 1] ?? ''
  const sunAbbr = MONTH_ABBR[sun.getMonth() + 1] ?? ''
  return mon.getMonth() === sun.getMonth()
    ? `${mon.getDate()}–${sun.getDate()} ${monAbbr}`
    : `${mon.getDate()} ${monAbbr}–${sun.getDate()} ${sunAbbr}`
}

export default async function WeekPage({
  params,
  searchParams,
}: {
  params: Promise<{ planId: string; weekStart: string }>
  searchParams: Promise<{ tab?: string }>
}) {
  const { planId, weekStart } = await params
  const sp = await searchParams
  const activeTab = sp.tab === 'evaluation' ? 'evaluation' : 'contenu'
  if (!/^\d{4}-\d{2}-\d{2}$/.test(weekStart)) notFound()

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: plan } = await supabase
    .from('annual_plans')
    .select('id, school_year, subject_id, grade_level_id, subjects(name_fr), grade_levels(label_fr)')
    .eq('id', planId)
    .eq('user_id', user.id)
    .single()
  if (!plan) notFound()

  // Content items assigned to this week in the monthly plan
  const { data: weekAssignmentRows } = await supabase
    .from('plan_assignments')
    .select('content_item_id, month')
    .eq('annual_plan_id', planId)
    .eq('week_start', weekStart)

  const contentItemIds = (weekAssignmentRows ?? []).map(r => r.content_item_id)
  const backMonth = String((weekAssignmentRows ?? [])[0]?.month ?? Number(weekStart.split('-')[1]))

  const [contentItemsRes, dayPeriodsRes, dayNotesRes, weekStickersRes, periodTimesRes] = await Promise.all([
    contentItemIds.length > 0
      ? supabase.from('content_items')
          .select('id, name_fr, sort_order, competency_id, competencies(id, name_fr, color, sort_order, subject_id, subjects(id, name_fr, color))')
          .in('id', contentItemIds)
          .order('sort_order')
      : Promise.resolve({ data: [] }),
    supabase.from('day_periods')
      .select('id, day_of_week, period_number, content_item_id, is_special_activity')
      .eq('annual_plan_id', planId)
      .eq('week_start', weekStart),
    supabase.from('day_notes')
      .select('day_of_week, note')
      .eq('annual_plan_id', planId)
      .eq('week_start', weekStart),
    supabase.from('week_stickers')
      .select('id, sticker_name, x, y, width')
      .eq('annual_plan_id', planId)
      .eq('week_start', weekStart)
      .then(r => r.error ? { data: [] } : r),
    supabase.from('plan_period_times')
      .select('period_number, time_label')
      .eq('annual_plan_id', planId)
      .then(r => r.error ? { data: [] } : r),
  ])

  // ── Week activities ──────────────────────────────────────────
  const { data: waRows } = await supabase
    .from('week_activities')
    .select('id, activity_id, template_id')
    .eq('annual_plan_id', planId)
    .eq('week_start', weekStart)
    .order('created_at')

  const actIds = (waRows ?? []).map(r => r.activity_id).filter(Boolean) as string[]
  const tplIds = (waRows ?? []).map(r => r.template_id).filter(Boolean) as string[]

  const [waActivitiesRes, waTemplatesRes, waAttachmentsRes] = await Promise.all([
    actIds.length > 0
      ? supabase.from('activities').select('id, title, type_tag, duration_min').in('id', actIds)
      : Promise.resolve({ data: [] }),
    tplIds.length > 0
      ? supabase.from('activity_templates').select('id, title, type_tag, duration_min').in('id', tplIds)
      : Promise.resolve({ data: [] }),
    actIds.length > 0
      ? supabase.from('activity_attachments').select('id, activity_id, file_name, file_path, file_type').in('activity_id', actIds)
      : Promise.resolve({ data: [] }),
  ])

  const actMap  = Object.fromEntries((waActivitiesRes.data ?? []).map((a: any) => [a.id, a]))
  const tplMap  = Object.fromEntries((waTemplatesRes.data ?? []).map((t: any) => [t.id, t]))
  const attByAct: Record<string, any[]> = {}
  for (const att of waAttachmentsRes.data ?? []) {
    if (!attByAct[(att as any).activity_id]) attByAct[(att as any).activity_id] = []
    attByAct[(att as any).activity_id].push(att)
  }

  const weekActivities = (waRows ?? []).map((row: any) => {
    const base = row.activity_id ? actMap[row.activity_id] : tplMap[row.template_id]
    if (!base) return null
    return {
      id:          row.id,
      activity_id: row.activity_id ?? null,
      template_id: row.template_id ?? null,
      title:       base.title,
      type_tag:    base.type_tag ?? null,
      duration_min: base.duration_min ?? null,
      attachments: row.activity_id ? (attByAct[row.activity_id] ?? []) : [],
      is_template: !!row.template_id,
    }
  }).filter(Boolean)

  // ── Available activities for suggestion modal ────────────────
  const [userActRes, tplAllRes, pcaRes] = await Promise.all([
    supabase.from('activities').select('id, title, type_tag, duration_min').eq('user_id', user.id),
    supabase.from('activity_templates').select('id, title, type_tag, duration_min'),
    contentItemIds.length > 0
      ? supabase
          .from('plan_content_activities')
          .select('content_item_id, activity_id, template_id')
          .eq('plan_id', planId)
          .eq('user_id', user.id)
          .in('content_item_id', contentItemIds)
      : Promise.resolve({ data: [] }),
  ])

  const availableActivities = [
    ...(userActRes.data ?? []).map((a: any) => ({ id: a.id, title: a.title, type_tag: a.type_tag ?? null, duration_min: a.duration_min ?? null, is_template: false })),
    ...(tplAllRes.data ?? []).map((t: any) => ({ id: t.id, title: t.title, type_tag: t.type_tag ?? null, duration_min: t.duration_min ?? null, is_template: true })),
  ]

  const subjectLabel = plan.subject_id ? (plan.subjects as any)?.name_fr : 'Toutes les matières'
  const baseHref = `/dashboard/annual/${planId}/week/${weekStart}`

  return (
    <main className="min-h-screen">
      <nav className="px-6 py-4 flex items-center gap-3" style={{ backgroundColor: 'var(--color-nav)' }}>
        <Link href={`/dashboard/annual/${planId}/month/${backMonth}`} className="text-white/70 hover:text-white text-sm">
          ← {subjectLabel}
        </Link>
        <span className="text-white/40">/</span>
        <span className="text-lg font-bold text-white flex-1">{getWeekLabel(weekStart)}</span>
        <span className="text-sm text-white/60">{(plan.grade_levels as any)?.label_fr} · {plan.school_year}</span>
        <div className="flex gap-1">
          <Link href={baseHref}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition ${activeTab === 'contenu' ? 'bg-white/20 text-white' : 'text-white/60 hover:text-white'}`}>
            Contenu
          </Link>
          <Link href={`${baseHref}?tab=evaluation`}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition ${activeTab === 'evaluation' ? 'bg-white/20 text-white' : 'text-white/60 hover:text-white'}`}>
            Évaluation
          </Link>
        </div>
      </nav>

      {activeTab === 'evaluation' ? (
        <Suspense>
          <EvalLinksSection planId={planId} gradeId={plan.grade_level_id} subjectId={plan.subject_id ?? null} />
        </Suspense>
      ) : (
        <WeeklyGrid
          planId={planId}
          weekStart={weekStart}
          contentItems={(contentItemsRes.data ?? []) as any[]}
          dayPeriods={(dayPeriodsRes.data ?? []) as any[]}
          dayNotes={(dayNotesRes.data ?? []) as any[]}
          weekStickers={(weekStickersRes.data ?? []) as any[]}
          periodTimes={(periodTimesRes.data ?? []) as any[]}
          weekActivities={weekActivities as any[]}
          availableActivities={availableActivities}
          planContentActivities={(pcaRes.data ?? []) as any[]}
        />
      )}
    </main>
  )
}
