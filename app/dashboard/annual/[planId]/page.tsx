import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import { Suspense } from 'react'
import PlanningGrid from './PlanningGrid'
import EtapePlanningGrid from './EtapePlanningGrid'
import ThemePlanningGrid from './ThemePlanningGrid'
import EvalLinksSection from './EvalLinksSection'
import { getCalendarEvents } from '@/app/dashboard/school-calendar/actions'

export default async function AnnualPlanPage({
  params,
  searchParams,
}: {
  params: Promise<{ planId: string }>
  searchParams: Promise<{ tab?: string; section?: string }>
}) {
  const { planId } = await params
  const sp = await searchParams
  const activeTab = sp.tab === 'evaluation' ? 'evaluation' : 'contenu'
  const section = sp.section

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: plan } = await supabase
    .from('annual_plans')
    .select('id, school_year, title, subject_id, grade_level_id, planning_model, subjects(name_fr, color), grade_levels(label_fr)')
    .eq('id', planId)
    .eq('user_id', user.id)
    .single()

  if (!plan) notFound()

  const isMultiSubject = !plan.subject_id
  const planningModel = (plan as any).planning_model as string
  const isParEtape = planningModel === 'par-etape'
  const isParTheme = planningModel === 'par-theme'

  let contentItemsQuery = supabase
    .from('content_items')
    .select('id, name_fr, sort_order, competency_id, progression_type, competencies(id, name_fr, color, sort_order, subject_id, subjects(id, name_fr, color, slug))')
    .eq('grade_level_id', plan.grade_level_id)
    .order('sort_order')

  if (!isMultiSubject) {
    contentItemsQuery = contentItemsQuery.eq('competencies.subject_id', plan.subject_id)
  }

  const assignmentsQuery: Promise<{ data: any[] | null }> = isParEtape
    ? supabase.from('plan_assignments').select('id, etape_number, content_item_id').eq('annual_plan_id', planId).not('etape_number', 'is', null) as any
    : supabase.from('plan_assignments').select('id, month, content_item_id').eq('annual_plan_id', planId) as any

  const [
    { data: contentItems },
    { data: assignments },
    { data: projects },
    { data: projectAssignments },
    { data: planContentActivities },
    { data: etapeConfigs },
  ] = await Promise.all([
    contentItemsQuery as any,
    assignmentsQuery,
    isMultiSubject
      ? supabase.from('interdisciplinary_projects').select('id, title, description, project_subjects(subject_id, subjects(name_fr, color, slug))').order('title')
      : Promise.resolve({ data: [] }),
    isMultiSubject
      ? supabase.from('project_assignments').select('id, month, project_id').eq('annual_plan_id', planId)
      : Promise.resolve({ data: [] }),
    supabase.from('plan_content_activities').select('content_item_id, activity_id, template_id').eq('plan_id', planId).eq('user_id', user.id),
    isParEtape
      ? supabase.from('etape_configs').select('etape_number, start_date, end_date').eq('user_id', user.id).eq('school_year', plan.school_year).order('etape_number')
      : Promise.resolve({ data: [] }),
  ])

  const { data: themeConfigs } = isParTheme
    ? await supabase.from('theme_configs').select('id, name, start_date, end_date, sort_order').eq('user_id', user.id).eq('school_year', plan.school_year).order('sort_order')
    : { data: [] as any[] }

  const { data: themeAssignments } = isParTheme
    ? await supabase.from('plan_assignments').select('id, theme_id, content_item_id').eq('annual_plan_id', planId).not('theme_id', 'is', null)
    : { data: [] as any[] }

  const calendarEvents = await getCalendarEvents(plan.school_year)

  let importedAssignments: Array<{ id: string; month: number | null; content_item_id: number }> = []
  if (isMultiSubject && !isParEtape) {
    const { data: siblingPlans } = await supabase
      .from('annual_plans')
      .select('id')
      .eq('user_id', user.id)
      .eq('school_year', plan.school_year)
      .eq('grade_level_id', plan.grade_level_id)
      .not('subject_id', 'is', null)
      .neq('id', planId)

    if (siblingPlans && siblingPlans.length > 0) {
      const { data } = await supabase
        .from('plan_assignments')
        .select('id, month, content_item_id')
        .in('annual_plan_id', siblingPlans.map(p => p.id))
      importedAssignments = data ?? []
    }
  }

  const subjectLabel = isMultiSubject ? 'Toutes les matières' : (plan.subjects as any)?.name_fr
  const modelTag = isParEtape ? ' · Par étape' : isParTheme ? ' · Par thème' : ''

  return (
    <main className="min-h-screen">
      <nav className="px-6 py-4 flex items-center gap-3" style={{ backgroundColor: 'var(--color-nav)' }}>
        <Link href="/dashboard/annual" className="text-white/70 hover:text-white text-sm">← Mes planifications</Link>
        <span className="text-white/40">/</span>
        <div className="flex-1">
          <span className="text-lg font-bold text-white">{subjectLabel}</span>
          <span className="text-sm text-white/70 ml-2">
            {(plan.grade_levels as any)?.label_fr} · {plan.school_year}{plan.title && ` · ${plan.title}`}{modelTag}
          </span>
        </div>
        <div className="flex gap-1">
          <Link
            href={`/dashboard/annual/${planId}`}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition ${activeTab === 'contenu' ? 'bg-white/20 text-white' : 'text-white/60 hover:text-white'}`}
          >
            Contenu
          </Link>
          <Link
            href={`/dashboard/annual/${planId}?tab=evaluation`}
            className={`px-4 py-1.5 rounded-lg text-sm font-medium transition ${activeTab === 'evaluation' ? 'bg-white/20 text-white' : 'text-white/60 hover:text-white'}`}
          >
            Évaluation
          </Link>
          <Link
            href={`/dashboard/annual/${planId}/import`}
            className="px-4 py-1.5 rounded-lg text-sm font-medium transition text-white/60 hover:text-white"
            title="Importer depuis un fichier Excel"
          >
            ⬆ Importer
          </Link>
        </div>
      </nav>

      {activeTab === 'evaluation' ? (
        <Suspense>
          <EvalLinksSection planId={planId} gradeId={plan.grade_level_id} subjectId={plan.subject_id ?? null} section={section} />
        </Suspense>
      ) : isParTheme ? (
        <ThemePlanningGrid
          planId={planId}
          contentItems={(contentItems ?? []) as any[]}
          assignments={(themeAssignments ?? []) as any[]}
          themeConfigs={(themeConfigs ?? []) as any[]}
          planContentActivities={(planContentActivities ?? []) as any[]}
          calendarEvents={calendarEvents}
        />
      ) : isParEtape ? (
        <EtapePlanningGrid
          planId={planId}
          contentItems={(contentItems ?? []) as any[]}
          assignments={(assignments ?? []) as any[]}
          etapeConfigs={(etapeConfigs ?? []) as any[]}
          planContentActivities={(planContentActivities ?? []) as any[]}
          calendarEvents={calendarEvents}
        />
      ) : (
        <PlanningGrid
          planId={planId}
          contentItems={(contentItems ?? []) as any[]}
          assignments={(assignments ?? []) as any[]}
          isMultiSubject={isMultiSubject}
          projects={(projects ?? []) as any[]}
          projectAssignments={(projectAssignments ?? []) as any[]}
          importedAssignments={importedAssignments}
          planContentActivities={(planContentActivities ?? []) as any[]}
          calendarEvents={calendarEvents}
        />
      )}
    </main>
  )
}
