import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import LinkOverviewView from './LinkOverviewView'

export default async function LinkOverviewPage({
  params,
}: {
  params: Promise<{ planId: string; linkId: string }>
}) {
  const { planId, linkId } = await params

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: plan } = await supabase
    .from('annual_plans').select('id')
    .eq('id', planId).eq('user_id', user.id).single()
  if (!plan) redirect('/dashboard/gradebook')

  const { data: gb } = await supabase
    .from('grade_books').select('id').eq('annual_plan_id', planId).single()
  if (!gb) redirect(`/dashboard/gradebook/${planId}`)

  const { data: link } = await supabase
    .from('plan_eval_links')
    .select('id, etape_id, eval_grid_id, eval_grids(id, title, competency), gb_etapes(name)')
    .eq('id', linkId).eq('annual_plan_id', planId).single()
  if (!link) redirect(`/dashboard/gradebook/${planId}/grilles`)

  const linkData = link as any
  const gridId = linkData.eval_grids?.id ?? link.eval_grid_id
  const gridTitle = linkData.eval_grids?.title ?? ''
  const etapeName = linkData.gb_etapes?.name ?? null

  const [{ data: students }, { data: levels }, { data: criteria }] = await Promise.all([
    supabase.from('gb_students').select('id, name, sort_order').eq('grade_book_id', gb.id).order('sort_order').order('name'),
    supabase.from('eval_grid_levels').select('id, code, label, sort_order').eq('grid_id', gridId).order('sort_order'),
    supabase.from('eval_grid_criteria').select('id, label, weight, sort_order').eq('grid_id', gridId).order('sort_order'),
  ])

  const criteriaIds = (criteria ?? []).map(c => c.id)
  const { data: cells } = criteriaIds.length
    ? await supabase.from('eval_grid_cells').select('criterion_id, level_id, descriptor').in('criterion_id', criteriaIds)
    : { data: [] }

  const studentIds = (students ?? []).map(s => s.id)
  const { data: assessments } = studentIds.length
    ? await supabase
        .from('plan_eval_assessments')
        .select('id, student_id, comment, overall_result')
        .eq('link_id', linkId)
        .in('student_id', studentIds)
    : { data: [] }

  const assessmentIds = (assessments ?? []).map(a => a.id)
  const { data: marks } = assessmentIds.length
    ? await supabase
        .from('plan_eval_marks')
        .select('assessment_id, criterion_id, level_id')
        .in('assessment_id', assessmentIds)
    : { data: [] }

  // Build per-student data
  const assessmentByStudent: Record<string, { id: string; comment: string; overallResult: string | null }> = {}
  for (const a of assessments ?? []) assessmentByStudent[a.student_id] = { id: a.id, comment: a.comment, overallResult: (a as any).overall_result ?? null }

  const marksByAssessment: Record<string, Record<string, number>> = {}
  for (const m of marks ?? []) {
    if (!marksByAssessment[m.assessment_id]) marksByAssessment[m.assessment_id] = {}
    marksByAssessment[m.assessment_id][m.criterion_id] = m.level_id
  }

  const cellMap: Record<string, Record<number, string>> = {}
  for (const cell of cells ?? []) {
    if (!cellMap[cell.criterion_id]) cellMap[cell.criterion_id] = {}
    cellMap[cell.criterion_id][cell.level_id] = cell.descriptor ?? ''
  }

  const studentData = (students ?? []).map(s => {
    const a = assessmentByStudent[s.id]
    return {
      id: s.id,
      name: s.name,
      assessmentId: a?.id ?? null,
      marks: a ? (marksByAssessment[a.id] ?? {}) : {},
      comment: a?.comment ?? '',
      overallResult: a?.overallResult ?? null,
    }
  })

  return (
    <main className="min-h-screen bg-gray-50 print:bg-white">
      <nav className="px-6 py-4 flex items-center gap-3 flex-wrap print:hidden" style={{ backgroundColor: 'var(--color-nav)' }}>
        <Link href={`/dashboard/gradebook/${planId}/grilles`} className="text-white/70 hover:text-white text-sm">
          ← Grilles d&apos;évaluation
        </Link>
        <span className="text-white/40">/</span>
        <h1 className="text-sm font-semibold text-white truncate max-w-xs">{gridTitle}</h1>
        {etapeName && <span className="text-white/60 text-sm">· {etapeName}</span>}
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-8 print:px-0 print:py-0 print:max-w-none">
        <LinkOverviewView
          planId={planId}
          linkId={linkId}
          gridTitle={gridTitle}
          etapeName={etapeName}
          competency={(linkData.eval_grids as any)?.competency ?? null}
          levels={levels ?? []}
          criteria={criteria ?? []}
          cellMap={cellMap}
          studentData={studentData}
        />
      </div>
    </main>
  )
}
