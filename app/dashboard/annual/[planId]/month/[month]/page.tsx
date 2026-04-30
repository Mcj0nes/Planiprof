import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { Suspense } from 'react'
import MonthlyGrid from './MonthlyGrid'
import EvalLinksSection from '../../EvalLinksSection'

const MONTH_LABELS: Record<number, string> = {
  8: 'Août', 9: 'Septembre', 10: 'Octobre', 11: 'Novembre', 12: 'Décembre',
  1: 'Janvier', 2: 'Février', 3: 'Mars', 4: 'Avril', 5: 'Mai', 6: 'Juin',
}

export default async function MonthPage({
  params,
  searchParams,
}: {
  params: Promise<{ planId: string; month: string }>
  searchParams: Promise<{ tab?: string }>
}) {
  const { planId, month: monthStr } = await params
  const sp = await searchParams
  const activeTab = sp.tab === 'evaluation' ? 'evaluation' : 'contenu'
  const month = parseInt(monthStr, 10)
  if (!MONTH_LABELS[month]) notFound()

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: plan } = await supabase
    .from('annual_plans')
    .select('id, school_year, title, subject_id, grade_level_id, subjects(name_fr, color), grade_levels(label_fr)')
    .eq('id', planId)
    .eq('user_id', user.id)
    .single()

  if (!plan) notFound()

  // All content items for this plan's grade (and subject if single-subject)
  let contentQuery = supabase
    .from('content_items')
    .select('id, name_fr, sort_order, competency_id, competencies(id, name_fr, color, sort_order, subject_id, subjects(id, name_fr, color, slug))')
    .eq('grade_level_id', plan.grade_level_id)
    .order('sort_order')

  if (plan.subject_id) {
    contentQuery = contentQuery.eq('competencies.subject_id', plan.subject_id)
  }

  const [{ data: contentItems }, { data: monthAssignments }, { data: weekNotes }, { data: planContentActivities }] = await Promise.all([
    contentQuery,
    supabase
      .from('plan_assignments')
      .select('id, month, week_start, content_item_id')
      .eq('annual_plan_id', planId)
      .eq('month', month),
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

  const subjectLabel = plan.subject_id
    ? (plan.subjects as any)?.name_fr
    : 'Toutes les matières'

  const SCHOOL_MONTHS = [8, 9, 10, 11, 12, 1, 2, 3, 4, 5, 6]
  const currentIdx = SCHOOL_MONTHS.indexOf(month)
  const prevMonth = currentIdx > 0 ? SCHOOL_MONTHS[currentIdx - 1] : null
  const nextMonth = currentIdx < SCHOOL_MONTHS.length - 1 ? SCHOOL_MONTHS[currentIdx + 1] : null

  const baseHref = `/dashboard/annual/${planId}/month/${month}`

  return (
    <main className="min-h-screen">
      <nav className="px-6 py-4 flex items-center gap-3" style={{ backgroundColor: 'var(--color-nav)' }}>
        <Link href="/dashboard/monthly" className="text-white/70 hover:text-white text-sm">← Mensuel</Link>
        <span className="text-white/40">/</span>
        <Link href={`/dashboard/annual/${planId}`} className="text-white/70 hover:text-white text-sm">
          {subjectLabel}
        </Link>
        <span className="text-white/40">/</span>
        <div className="flex items-center gap-3 flex-1">
          {prevMonth ? (
            <Link href={`/dashboard/annual/${planId}/month/${prevMonth}`} className="text-white/60 hover:text-white text-sm">‹</Link>
          ) : <span className="text-white/20 text-sm">‹</span>}
          <span className="text-lg font-bold text-white">{MONTH_LABELS[month]}</span>
          {nextMonth ? (
            <Link href={`/dashboard/annual/${planId}/month/${nextMonth}`} className="text-white/60 hover:text-white text-sm">›</Link>
          ) : <span className="text-white/20 text-sm">›</span>}
        </div>
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
        <MonthlyGrid
          planId={planId}
          schoolYear={plan.school_year}
          month={month}
          contentItems={(contentItems ?? []) as any[]}
          monthAssignments={(monthAssignments ?? []) as any[]}
          weekNotes={(weekNotes ?? []) as any[]}
          planContentActivities={(planContentActivities ?? []) as any[]}
        />
      )}
    </main>
  )
}
