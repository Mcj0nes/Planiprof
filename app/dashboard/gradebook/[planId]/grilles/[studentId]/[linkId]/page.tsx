import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { ensureAssessment } from './assessment-actions'
import AssessmentView from './AssessmentView'

export default async function AssessmentPage({
  params,
}: {
  params: Promise<{ planId: string; studentId: string; linkId: string }>
}) {
  const { planId, studentId, linkId } = await params

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Verify plan ownership
  const { data: plan } = await supabase
    .from('annual_plans').select('id, subjects(name_fr), grade_levels(label_fr)')
    .eq('id', planId).eq('user_id', user.id).single()
  if (!plan) redirect('/dashboard/gradebook')

  const { data: gb } = await supabase
    .from('grade_books').select('id').eq('annual_plan_id', planId).single()
  if (!gb) redirect(`/dashboard/gradebook/${planId}`)

  const [{ data: student }, { data: link }, { data: allStudents }] = await Promise.all([
    supabase.from('gb_students').select('id, name').eq('id', studentId).eq('grade_book_id', gb.id).single(),
    supabase.from('plan_eval_links')
      .select('id, etape_id, eval_grid_id, eval_grids(id, title, competency, grid_type), gb_etapes(name)')
      .eq('id', linkId).eq('annual_plan_id', planId).single(),
    supabase.from('gb_students').select('id, name, sort_order').eq('grade_book_id', gb.id).order('sort_order').order('name'),
  ])

  if (!student || !link) redirect(`/dashboard/gradebook/${planId}/grilles`)

  const gridId = (link as any).eval_grids?.id ?? link.eval_grid_id

  // Load grid structure
  const [{ data: levels }, { data: criteria }] = await Promise.all([
    supabase.from('eval_grid_levels').select('id, code, label, sort_order').eq('grid_id', gridId).order('sort_order'),
    supabase.from('eval_grid_criteria').select('id, label, weight, sort_order').eq('grid_id', gridId).order('sort_order'),
  ])

  // Load cell descriptors
  const criteriaIds = (criteria ?? []).map(c => c.id)
  const { data: cells } = criteriaIds.length
    ? await supabase
        .from('eval_grid_cells')
        .select('criterion_id, level_id, descriptor')
        .in('criterion_id', criteriaIds)
    : { data: [] }

  // Ensure assessment row exists, get its id
  const assessmentId = await ensureAssessment(planId, linkId, studentId)

  // Load existing marks + comment
  const { data: assessment } = await supabase
    .from('plan_eval_assessments')
    .select('comment, overall_result')
    .eq('id', assessmentId)
    .single()

  const { data: marks } = await supabase
    .from('plan_eval_marks')
    .select('criterion_id, level_id')
    .eq('assessment_id', assessmentId)

  const initialMarks: Record<string, number> = {}
  for (const m of marks ?? []) initialMarks[m.criterion_id] = m.level_id

  // Build cell descriptor map for AssessmentView
  const cellMap: Record<string, Record<number, string>> = {}
  for (const cell of cells ?? []) {
    if (!cellMap[cell.criterion_id]) cellMap[cell.criterion_id] = {}
    cellMap[cell.criterion_id][cell.level_id] = cell.descriptor ?? ''
  }

  const linkData = link as any
  const etapeName = linkData.gb_etapes?.name ?? null
  const gridTitle = linkData.eval_grids?.title ?? ''

  const studentList = allStudents ?? []
  const currentIdx = studentList.findIndex(s => s.id === studentId)
  const prevStudent = currentIdx > 0 ? studentList[currentIdx - 1] : null
  const nextStudent = currentIdx < studentList.length - 1 ? studentList[currentIdx + 1] : null

  return (
    <main className="min-h-screen bg-gray-50 print:bg-white">
      <nav className="px-6 py-4 flex items-center gap-3 flex-wrap print:hidden" style={{ backgroundColor: 'var(--color-nav)' }}>
        <Link href={`/dashboard/gradebook/${planId}/grilles/${studentId}`} className="text-white/70 hover:text-white text-sm">
          ← {student.name}
        </Link>
        <span className="text-white/40">/</span>
        <h1 className="text-sm font-semibold text-white truncate max-w-xs">{gridTitle}</h1>
        {etapeName && <span className="text-white/60 text-sm">· {etapeName}</span>}
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-8 print:px-0 print:py-0">
        <div className="mb-6 print:hidden">
          <h2 className="text-2xl font-bold text-gray-800">{gridTitle}</h2>
          <div className="flex items-center gap-3 mt-1 flex-wrap text-sm text-gray-500">
            <span className="font-medium text-blue-700">{student.name}</span>
            {etapeName && <><span>·</span><span>{etapeName}</span></>}
            {linkData.eval_grids?.competency && (
              <span className="bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full text-xs">
                {linkData.eval_grids.competency}
              </span>
            )}
          </div>
        </div>

        <AssessmentView
          planId={planId}
          linkId={linkId}
          assessmentId={assessmentId}
          studentName={student.name}
          gridTitle={gridTitle}
          etapeName={etapeName}
          levels={levels ?? []}
          criteria={criteria ?? []}
          cellMap={cellMap}
          initialMarks={initialMarks}
          initialComment={assessment?.comment ?? ''}
          initialOverallResult={assessment?.overall_result ?? null}
          prevStudent={prevStudent ? { id: prevStudent.id, name: prevStudent.name } : null}
          nextStudent={nextStudent ? { id: nextStudent.id, name: nextStudent.name } : null}
          studentPosition={{ current: currentIdx + 1, total: studentList.length }}
        />
      </div>
    </main>
  )
}
