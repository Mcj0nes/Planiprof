import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

type Level = { id: number; code: string; sort_order: number }

const LEVEL_COLORS = [
  'bg-green-500 text-white',
  'bg-green-300 text-green-900',
  'bg-yellow-300 text-yellow-900',
  'bg-orange-300 text-orange-900',
  'bg-red-300 text-red-900',
]
function levelColor(idx: number) {
  return LEVEL_COLORS[idx] ?? 'bg-blue-400 text-white'
}

function computeModalLevel(
  marks: Record<string, number>,
  sortedLevels: Level[]
): { code: string; colorIdx: number } | null {
  const levelIds = Object.values(marks)
  if (!levelIds.length) return null
  const freq: Record<number, number> = {}
  for (const lid of levelIds) freq[lid] = (freq[lid] ?? 0) + 1
  const dominantId = Number(Object.entries(freq).sort((a, b) => b[1] - a[1])[0][0])
  const idx = sortedLevels.findIndex(l => l.id === dominantId)
  const level = sortedLevels[idx]
  if (!level) return null
  return { code: level.code, colorIdx: idx }
}

export default async function CompetencesPage({
  params,
}: {
  params: Promise<{ planId: string }>
}) {
  const { planId } = await params

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: plan } = await supabase
    .from('annual_plans')
    .select('id, subjects(name_fr), grade_levels(label_fr)')
    .eq('id', planId).eq('user_id', user.id).single()
  if (!plan) redirect('/dashboard/gradebook')

  const { data: gb } = await supabase
    .from('grade_books').select('id').eq('annual_plan_id', planId).single()
  if (!gb) redirect(`/dashboard/gradebook/${planId}`)

  const [{ data: students }, { data: links }] = await Promise.all([
    supabase.from('gb_students').select('id, name, sort_order').eq('grade_book_id', gb.id).order('sort_order').order('name'),
    supabase.from('plan_eval_links')
      .select('id, eval_grid_id, etape_id, weight_pct, eval_grids(id, title, competency), gb_etapes(name)')
      .eq('annual_plan_id', planId)
      .order('created_at'),
  ])

  const allLinks = links ?? []
  const allStudents = students ?? []

  // Fetch levels for all grids
  const gridIds = [...new Set(allLinks.map(l => l.eval_grid_id).filter(Boolean))]
  const { data: allLevels } = gridIds.length
    ? await supabase.from('eval_grid_levels').select('id, grid_id, code, sort_order').in('grid_id', gridIds).order('sort_order')
    : { data: [] }

  const levelsByGrid: Record<string, Level[]> = {}
  for (const l of allLevels ?? []) {
    if (!levelsByGrid[l.grid_id]) levelsByGrid[l.grid_id] = []
    levelsByGrid[l.grid_id].push(l)
  }

  // Fetch all assessments + marks
  const linkIds = allLinks.map(l => l.id)
  const studentIds = allStudents.map(s => s.id)
  const { data: assessments } = linkIds.length && studentIds.length
    ? await supabase.from('plan_eval_assessments')
        .select('id, link_id, student_id, overall_result')
        .in('link_id', linkIds).in('student_id', studentIds)
    : { data: [] }

  const assessmentIds = (assessments ?? []).map(a => a.id)
  const { data: marks } = assessmentIds.length
    ? await supabase.from('plan_eval_marks')
        .select('assessment_id, criterion_id, level_id')
        .in('assessment_id', assessmentIds)
    : { data: [] }

  // Build lookup structures
  const marksByAssessment: Record<string, Record<string, number>> = {}
  for (const m of marks ?? []) {
    if (!marksByAssessment[m.assessment_id]) marksByAssessment[m.assessment_id] = {}
    marksByAssessment[m.assessment_id][m.criterion_id] = m.level_id
  }

  // assessmentId + overall_result by studentId::linkId
  const assessmentKey: Record<string, { id: string; overallResult: string | null }> = {}
  for (const a of assessments ?? []) {
    assessmentKey[`${a.student_id}::${a.link_id}`] = { id: a.id, overallResult: (a as any).overall_result ?? null }
  }

  // Group links by competency
  const grouped: Record<string, typeof allLinks> = {}
  for (const link of allLinks) {
    const comp = (link as any).eval_grids?.competency ?? '__none__'
    if (!grouped[comp]) grouped[comp] = []
    grouped[comp].push(link)
  }
  const competencies = Object.keys(grouped).sort((a, b) => {
    if (a === '__none__') return 1
    if (b === '__none__') return -1
    return a.localeCompare(b, 'fr')
  })

  const p = plan as any

  return (
    <main className="min-h-screen bg-gray-50">
      <nav className="px-6 py-4 flex items-center gap-3 flex-wrap" style={{ backgroundColor: 'var(--color-nav)' }}>
        <Link href={`/dashboard/gradebook/${planId}`} className="text-white/70 hover:text-white text-sm">
          ← Carnet de notes
        </Link>
        <span className="text-white/40">/</span>
        <h1 className="text-lg font-bold text-white">
          Résultats par compétence · {p.subjects?.name_fr ?? ''} · {p.grade_levels?.label_fr ?? ''}
        </h1>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-8">

        {allLinks.length === 0 ? (
          <div className="bg-white border border-dashed border-gray-200 rounded-2xl p-12 text-center text-gray-400">
            <p className="text-sm">Aucune grille liée à ce plan.</p>
            <p className="text-xs mt-1">
              Ajoutez des grilles depuis l&apos;onglet{' '}
              <Link href={`/dashboard/annual/${planId}?tab=evaluation`} className="text-blue-500 hover:underline">
                Évaluation de la planification
              </Link>.
            </p>
          </div>
        ) : (
          <div className="space-y-10">
            {competencies.map(comp => (
              <section key={comp}>
                <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-3">
                  <span className="inline-block w-1.5 h-6 rounded-full bg-blue-500" />
                  {comp === '__none__' ? 'Sans compétence' : comp}
                </h2>

                <div className="space-y-5">
                  {grouped[comp].map((link: any) => {
                    const grid     = link.eval_grids
                    const etape    = link.gb_etapes
                    const gridId   = grid?.id ?? link.eval_grid_id
                    const sortedLevels: Level[] = (levelsByGrid[gridId] ?? [])

                    return (
                      <div key={link.id} className="bg-white border border-gray-200 rounded-2xl shadow-sm overflow-hidden">
                        {/* Card header */}
                        <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between gap-4 flex-wrap">
                          <div>
                            <p className="font-semibold text-gray-800">{grid?.title}</p>
                            <div className="flex items-center gap-2 mt-0.5 flex-wrap text-xs text-gray-500">
                              {etape?.name && <span>{etape.name}</span>}
                              {link.weight_pct != null && (
                                <span className="bg-indigo-50 text-indigo-600 px-1.5 py-0.5 rounded font-medium">
                                  {link.weight_pct}% de la compétence
                                </span>
                              )}
                            </div>
                          </div>
                          <Link
                            href={`/dashboard/gradebook/${planId}/grilles/link/${link.id}`}
                            className="text-sm px-4 py-1.5 border border-gray-200 rounded-xl text-gray-600 hover:bg-gray-50 transition shrink-0"
                          >
                            Vue d&apos;ensemble →
                          </Link>
                        </div>

                        {/* Students table */}
                        {allStudents.length === 0 ? (
                          <p className="px-5 py-4 text-sm text-gray-400">Aucun élève dans ce carnet.</p>
                        ) : (
                          <table className="w-full text-sm border-collapse">
                            <thead>
                              <tr className="bg-gray-50 text-left">
                                <th className="px-5 py-2 font-medium text-gray-600 border-b border-gray-100 w-1/2">Élève</th>
                                <th className="px-4 py-2 font-medium text-gray-600 border-b border-gray-100 text-center w-32">Résultat</th>
                                <th className="px-4 py-2 font-medium text-gray-600 border-b border-gray-100 text-center w-28">Grille</th>
                              </tr>
                            </thead>
                            <tbody>
                              {allStudents.map((student, idx) => {
                                const asmt = assessmentKey[`${student.id}::${link.id}`]
                                const studentMarks = asmt ? (marksByAssessment[asmt.id] ?? {}) : {}
                                const overallResult = asmt?.overallResult ?? null
                                const modalResult = computeModalLevel(studentMarks, sortedLevels)
                                // Prefer teacher-chosen result over computed modal
                                const displayResult = overallResult
                                  ? { code: overallResult, colorIdx: sortedLevels.findIndex(l => l.code === overallResult) }
                                  : modalResult

                                return (
                                  <tr key={student.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}>
                                    <td className="px-5 py-2.5 border-b border-gray-100 font-medium text-gray-700">
                                      {student.name}
                                    </td>
                                    <td className="px-4 py-2.5 border-b border-gray-100 text-center">
                                      {displayResult && displayResult.colorIdx >= 0
                                        ? <span className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-bold ${levelColor(displayResult.colorIdx)}`}>
                                            {displayResult.code}
                                          </span>
                                        : displayResult
                                          ? <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800">{displayResult.code}</span>
                                          : <span className="text-gray-300 text-xs">—</span>
                                      }
                                    </td>
                                    <td className="px-4 py-2.5 border-b border-gray-100 text-center">
                                      <Link
                                        href={`/dashboard/gradebook/${planId}/grilles/${student.id}/${link.id}`}
                                        className="text-xs text-blue-500 hover:underline"
                                      >
                                        Voir grille →
                                      </Link>
                                    </td>
                                  </tr>
                                )
                              })}
                            </tbody>
                          </table>
                        )}
                      </div>
                    )
                  })}
                </div>
              </section>
            ))}
          </div>
        )}
      </div>
    </main>
  )
}
