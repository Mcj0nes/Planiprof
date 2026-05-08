import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import ThemeGrid from './ThemeGrid'
import PrintButton from '../../PrintButton'
import { getCalendarEventsInRange } from '@/app/dashboard/school-calendar/actions'

function formatDateRange(start: string, end: string) {
  const fmt = (d: string) => {
    const [, m, day] = d.split('-')
    const months = ['', 'jan', 'fév', 'mars', 'avr', 'mai', 'juin', 'juil', 'août', 'sep', 'oct', 'nov', 'déc']
    return `${parseInt(day)} ${months[parseInt(m)]}`
  }
  return `${fmt(start)} – ${fmt(end)}`
}

export default async function ThemeDetailPage({
  params,
}: {
  params: Promise<{ planId: string; themeId: string }>
}) {
  const { planId, themeId } = await params

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: plan } = await supabase
    .from('annual_plans')
    .select('id, school_year, title, subject_id, grade_level_id, planning_model, subjects(name_fr), grade_levels(label_fr)')
    .eq('id', planId)
    .eq('user_id', user.id)
    .single()

  if (!plan || (plan as any).planning_model !== 'par-theme') notFound()

  const { data: themeConfig } = await supabase
    .from('theme_configs')
    .select('id, name, start_date, end_date, sort_order')
    .eq('id', themeId)
    .eq('user_id', user.id)
    .maybeSingle()

  if (!themeConfig) notFound()

  // Fetch sibling themes for prev/next navigation
  const { data: allThemes } = await supabase
    .from('theme_configs')
    .select('id, sort_order')
    .eq('user_id', user.id)
    .eq('school_year', plan.school_year)
    .order('sort_order')

  const themeIndex = (allThemes ?? []).findIndex(t => t.id === themeId)
  const prevTheme = themeIndex > 0 ? (allThemes ?? [])[themeIndex - 1] : null
  const nextTheme = themeIndex < (allThemes ?? []).length - 1 ? (allThemes ?? [])[themeIndex + 1] : null

  let contentQuery = supabase
    .from('content_items')
    .select('id, name_fr, sort_order, competency_id, competencies(id, name_fr, color, sort_order)')
    .eq('grade_level_id', plan.grade_level_id)
    .order('sort_order')

  if (plan.subject_id) {
    contentQuery = contentQuery.eq('competencies.subject_id', plan.subject_id)
  }

  const [{ data: contentItems }, { data: themeAssignments }, { data: weekNotes }, { data: planContentActivities }] = await Promise.all([
    contentQuery as any,
    supabase
      .from('plan_assignments')
      .select('id, theme_id, week_start, content_item_id')
      .eq('annual_plan_id', planId)
      .eq('theme_id', themeId),
    supabase
      .from('week_notes')
      .select('week_start, special_activities, reflective_review')
      .eq('annual_plan_id', planId),
    supabase
      .from('plan_content_activities')
      .select('content_item_id, activity_id, template_id')
      .eq('plan_id', planId)
      .eq('user_id', user.id),
  ])

  const calendarEvents = await getCalendarEventsInRange(themeConfig.start_date, themeConfig.end_date)

  const subjectLabel = plan.subject_id ? (plan.subjects as any)?.name_fr : 'Toutes les matières'

  return (
    <main className="min-h-screen">
      <nav className="px-6 py-4 flex items-center gap-3 flex-wrap print:hidden" style={{ backgroundColor: 'var(--color-nav)' }}>
        <Link href="/dashboard/planning-model/par-theme" className="text-white/70 hover:text-white text-sm">← Par thème</Link>
        <span className="text-white/40">/</span>
        <Link href={`/dashboard/annual/${planId}`} className="text-white/70 hover:text-white text-sm">{subjectLabel}</Link>
        <span className="text-white/40">/</span>
        <div className="flex items-center gap-3 flex-1">
          {prevTheme ? (
            <Link href={`/dashboard/annual/${planId}/theme/${prevTheme.id}`} className="text-white/60 hover:text-white text-sm">‹</Link>
          ) : <span className="text-white/20 text-sm">‹</span>}
          <span className="text-lg font-bold text-white">{themeConfig.name}</span>
          {nextTheme ? (
            <Link href={`/dashboard/annual/${planId}/theme/${nextTheme.id}`} className="text-white/60 hover:text-white text-sm">›</Link>
          ) : <span className="text-white/20 text-sm">›</span>}
        </div>
        <span className="text-sm text-white/60">{formatDateRange(themeConfig.start_date, themeConfig.end_date)}</span>
        <span className="text-sm text-white/50">{(plan.grade_levels as any)?.label_fr} · {plan.school_year}</span>
        <PrintButton />
      </nav>

      <ThemeGrid
        planId={planId}
        themeId={themeId}
        startDate={themeConfig.start_date}
        endDate={themeConfig.end_date}
        contentItems={(contentItems ?? []) as any[]}
        themeAssignments={(themeAssignments ?? []) as any[]}
        weekNotes={(weekNotes ?? []) as any[]}
        planContentActivities={(planContentActivities ?? []) as any[]}
        calendarEvents={calendarEvents}
        planLabel={`${subjectLabel} · ${(plan.grade_levels as any)?.label_fr} · ${plan.school_year} · ${themeConfig.name}`}
      />
    </main>
  )
}
