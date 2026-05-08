import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import EtapeGrid from './EtapeGrid'
import PrintButton from '../../PrintButton'
import { getCalendarEventsInRange } from '@/app/dashboard/school-calendar/actions'

const ETAPE_LABELS = ['', 'Étape 1', 'Étape 2', 'Étape 3']

function formatDateRange(start: string, end: string) {
  const fmt = (d: string) => {
    const [, m, day] = d.split('-')
    const months = ['', 'jan', 'fév', 'mars', 'avr', 'mai', 'juin', 'juil', 'août', 'sep', 'oct', 'nov', 'déc']
    return `${parseInt(day)} ${months[parseInt(m)]}`
  }
  return `${fmt(start)} – ${fmt(end)}`
}

export default async function EtapeDetailPage({
  params,
}: {
  params: Promise<{ planId: string; etapeNum: string }>
}) {
  const { planId, etapeNum: etapeNumStr } = await params
  const etapeNumber = parseInt(etapeNumStr, 10)
  if (![1, 2, 3].includes(etapeNumber)) notFound()

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: plan } = await supabase
    .from('annual_plans')
    .select('id, school_year, title, subject_id, grade_level_id, planning_model, subjects(name_fr), grade_levels(label_fr)')
    .eq('id', planId)
    .eq('user_id', user.id)
    .single()

  if (!plan || (plan as any).planning_model !== 'par-etape') notFound()

  const { data: etapeConfig } = await supabase
    .from('etape_configs')
    .select('start_date, end_date')
    .eq('user_id', user.id)
    .eq('school_year', plan.school_year)
    .eq('etape_number', etapeNumber)
    .maybeSingle()

  if (!etapeConfig) notFound()

  let contentQuery = supabase
    .from('content_items')
    .select('id, name_fr, sort_order, competency_id, competencies(id, name_fr, color, sort_order)')
    .eq('grade_level_id', plan.grade_level_id)
    .order('sort_order')

  if (plan.subject_id) {
    contentQuery = contentQuery.eq('competencies.subject_id', plan.subject_id)
  }

  const [{ data: contentItems }, { data: etapeAssignments }, { data: weekNotes }, { data: planContentActivities }] = await Promise.all([
    contentQuery,
    supabase
      .from('plan_assignments')
      .select('id, etape_number, week_start, content_item_id')
      .eq('annual_plan_id', planId)
      .eq('etape_number', etapeNumber),
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

  const calendarEvents = await getCalendarEventsInRange(etapeConfig.start_date, etapeConfig.end_date)

  const subjectLabel = plan.subject_id ? (plan.subjects as any)?.name_fr : 'Toutes les matières'
  const prevEtape = etapeNumber > 1 ? etapeNumber - 1 : null
  const nextEtape = etapeNumber < 3 ? etapeNumber + 1 : null

  return (
    <main className="min-h-screen">
      <nav className="px-6 py-4 flex items-center gap-3 flex-wrap print:hidden" style={{ backgroundColor: 'var(--color-nav)' }}>
        <Link href="/dashboard/planning-model/par-etape" className="text-white/70 hover:text-white text-sm">← Par étape</Link>
        <span className="text-white/40">/</span>
        <Link href={`/dashboard/annual/${planId}`} className="text-white/70 hover:text-white text-sm">{subjectLabel}</Link>
        <span className="text-white/40">/</span>
        <div className="flex items-center gap-3 flex-1">
          {prevEtape ? (
            <Link href={`/dashboard/annual/${planId}/etape/${prevEtape}`} className="text-white/60 hover:text-white text-sm">‹</Link>
          ) : <span className="text-white/20 text-sm">‹</span>}
          <span className="text-lg font-bold text-white">{ETAPE_LABELS[etapeNumber]}</span>
          {nextEtape ? (
            <Link href={`/dashboard/annual/${planId}/etape/${nextEtape}`} className="text-white/60 hover:text-white text-sm">›</Link>
          ) : <span className="text-white/20 text-sm">›</span>}
        </div>
        <span className="text-sm text-white/60">{formatDateRange(etapeConfig.start_date, etapeConfig.end_date)}</span>
        <span className="text-sm text-white/50">{(plan.grade_levels as any)?.label_fr} · {plan.school_year}</span>
        <PrintButton />
      </nav>

      <EtapeGrid
        planId={planId}
        etapeNumber={etapeNumber}
        startDate={etapeConfig.start_date}
        endDate={etapeConfig.end_date}
        contentItems={(contentItems ?? []) as any[]}
        etapeAssignments={(etapeAssignments ?? []) as any[]}
        weekNotes={(weekNotes ?? []) as any[]}
        planContentActivities={(planContentActivities ?? []) as any[]}
        calendarEvents={calendarEvents}
        planLabel={`${subjectLabel} · ${(plan.grade_levels as any)?.label_fr} · ${plan.school_year} · ${ETAPE_LABELS[etapeNumber]}`}
      />
    </main>
  )
}
