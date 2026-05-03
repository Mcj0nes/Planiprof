import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Suspense } from 'react'
import EvaluationSelector from '../EvaluationSelector'
import AddToGradebookButton from './AddToGradebookButton'

export default async function GrillesPage({
  searchParams,
}: {
  searchParams: Promise<{ subjectId?: string; gradeId?: string; competency?: string }>
}) {
  const params   = await searchParams
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [{ data: subjects }, { data: gradeLevels }] = await Promise.all([
    supabase.from('subjects').select('id, name_fr').eq('is_active', true).order('name_fr'),
    supabase.from('grade_levels').select('id, label_fr, education_level, grade').eq('education_level', 'primaire').order('grade'),
  ])

  const subjectIdParam      = params.subjectId ?? null
  const isInterdisciplinary = subjectIdParam === 'interdisciplinaire'
  const subjectId           = !isInterdisciplinary && subjectIdParam ? Number(subjectIdParam) : null
  const gradeId             = params.gradeId ? Number(params.gradeId) : null
  const competencyFilter    = params.competency ?? null

  let baseGrids:            any[] = []
  let myGrids:              any[] = []
  let availableCompetencies: string[] = []
  let userPlans:            { id: string; label: string; etapes: { id: string; name: string }[] }[] = []
  let alreadyLinkedGridIds: Record<string, string[]> = {} // gridId → planIds already linked

  const hasSelection = (isInterdisciplinary || subjectId) && gradeId

  if (hasSelection) {
    const { data: gradeRows } = await supabase
      .from('eval_grid_grades')
      .select('grid_id')
      .eq('grade_level_id', gradeId)

    const gridIds = gradeRows?.map(r => r.grid_id) ?? []

    if (gridIds.length > 0) {
      let baseQuery = supabase
        .from('eval_grids')
        .select('id, title, cycle_label, source, competency')
        .in('id', gridIds)
        .eq('is_baseline', true)
        .eq('grid_type', 'evaluation')
        .order('title')

      let myQuery = supabase
        .from('eval_grids')
        .select('id, title, cycle_label, competency, base_grid_id')
        .in('id', gridIds)
        .eq('is_baseline', false)
        .eq('grid_type', 'evaluation')
        .eq('created_by', user.id)
        .order('title')

      if (isInterdisciplinary) {
        baseQuery = baseQuery.is('subject_id', null)
        myQuery   = myQuery.is('subject_id', null)
      } else {
        baseQuery = baseQuery.eq('subject_id', subjectId!)
        myQuery   = myQuery.eq('subject_id', subjectId!)
      }

      const [{ data: allBase }, { data: allMine }] = await Promise.all([baseQuery, myQuery])

      // Collect distinct competencies from all available grids
      const all = [...(allBase ?? []), ...(allMine ?? [])]
      availableCompetencies = [...new Set(all.map(g => g.competency).filter(Boolean) as string[])]

      // Apply competency filter
      baseGrids = (allBase ?? []).filter(g => !competencyFilter || g.competency === competencyFilter)
      myGrids   = (allMine ?? []).filter(g => !competencyFilter || g.competency === competencyFilter)
    }

    // Fetch user's annual plans for this grade (with their étapes)
    const plansQuery = supabase
      .from('annual_plans')
      .select('id, school_year, subjects(name_fr), grade_levels(label_fr), grade_books(id, gb_etapes(id, name, sort_order))')
      .eq('user_id', user.id)
      .eq('grade_level_id', gradeId)

    const { data: rawPlans } = isInterdisciplinary
      ? await plansQuery.is('subject_id', null)
      : await plansQuery.eq('subject_id', subjectId!)

    userPlans = (rawPlans ?? []).map((p: any) => {
      const gb     = Array.isArray(p.grade_books) ? p.grade_books[0] : p.grade_books
      const etapes = (gb?.gb_etapes ?? []).sort((a: any, b: any) => a.sort_order - b.sort_order)
      return {
        id:     p.id,
        label:  `${p.subjects?.name_fr ?? 'Toutes'} · ${p.grade_levels?.label_fr} · ${p.school_year}`,
        etapes,
      }
    })

    // Which grids are already linked to which plans?
    if (userPlans.length > 0) {
      const { data: links } = await supabase
        .from('plan_eval_links')
        .select('annual_plan_id, eval_grid_id')
        .in('annual_plan_id', userPlans.map(p => p.id))
      for (const l of links ?? []) {
        if (!alreadyLinkedGridIds[l.eval_grid_id]) alreadyLinkedGridIds[l.eval_grid_id] = []
        alreadyLinkedGridIds[l.eval_grid_id].push(l.annual_plan_id)
      }
    }
  }

  const selectedSubject = isInterdisciplinary
    ? { name_fr: 'Grilles interdisciplinaires' }
    : subjects?.find(s => s.id === subjectId)
  const selectedGrade   = gradeLevels?.find(g => g.id === gradeId)

  let queryString = ''
  if (subjectIdParam && gradeId) {
    queryString = `?subjectId=${subjectIdParam}&gradeId=${gradeId}`
    if (competencyFilter) queryString += `&competency=${encodeURIComponent(competencyFilter)}`
  }

  return (
    <main className="min-h-screen">
      <nav className="px-6 py-4 flex items-center gap-3" style={{ backgroundColor: 'var(--color-nav)' }}>
        <Link href="/dashboard" className="text-white/70 hover:text-white text-sm">&#x2190; Tableau de bord</Link>
        <span className="text-white/40">/</span>
        <Link href="/dashboard/evaluation" className="text-white/70 hover:text-white text-sm">Outils d&apos;évaluation</Link>
        <span className="text-white/40">/</span>
        <h1 className="text-lg font-bold text-white">Grilles d&apos;évaluation</h1>
      </nav>

      <div className="max-w-4xl mx-auto px-8 py-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Grilles d&apos;évaluation</h2>

        <Suspense>
          <EvaluationSelector
            subjects={subjects ?? []}
            gradeLevels={gradeLevels ?? []}
            basePath="/dashboard/evaluation/grilles"
            availableCompetencies={availableCompetencies}
          />
        </Suspense>

        {selectedSubject && selectedGrade && (
          <div className="mt-8 space-y-8">
            <div className="flex items-center gap-2 flex-wrap text-sm text-gray-500">
              <span className="font-semibold text-gray-700">{selectedSubject.name_fr}</span>
              <span>·</span>
              <span>{selectedGrade.label_fr}</span>
              {competencyFilter && (
                <>
                  <span>·</span>
                  <span className="text-blue-600 font-medium">{competencyFilter}</span>
                </>
              )}
            </div>

            {/* Base grids */}
            <section>
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Grilles de base</h3>
              {baseGrids.length === 0 ? (
                <p className="text-gray-400 text-sm bg-white border rounded-2xl p-6">Aucune grille de base disponible pour cette sélection.</p>
              ) : (
                <div className="space-y-3">
                  {baseGrids.map((g: any) => (
                    <div key={g.id} className="bg-white border rounded-2xl p-5 flex items-center justify-between gap-3 shadow-sm">
                      <div className="min-w-0">
                        <p className="font-semibold text-gray-800">{g.title}</p>
                        <div className="flex items-center gap-3 mt-1">
                          {g.cycle_label  && <span className="text-xs text-gray-400">{g.cycle_label}</span>}
                          {g.competency   && <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">{g.competency}</span>}
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <AddToGradebookButton
                          gridId={g.id}
                          plans={userPlans}
                          alreadyLinkedPlanIds={alreadyLinkedGridIds[g.id] ?? []}
                        />
                        <Link
                          href={`/dashboard/evaluation/grilles/${g.id}${queryString}`}
                          className="text-sm px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                        >
                          Voir
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>

            {/* My versions */}
            <section>
              <h3 className="text-sm font-semibold text-gray-500 uppercase tracking-wide mb-3">Mes versions</h3>
              {myGrids.length === 0 ? (
                <p className="text-gray-400 text-sm bg-white border border-dashed rounded-2xl p-6">
                  Aucune version personnalisée. Ouvrez une grille de base et cliquez sur &quot;Créer ma version&quot;.
                </p>
              ) : (
                <div className="space-y-3">
                  {myGrids.map((g: any) => (
                    <div key={g.id} className="bg-white border border-blue-200 rounded-2xl p-5 flex items-center justify-between gap-3 shadow-sm">
                      <div className="min-w-0">
                        <p className="font-semibold text-gray-800">{g.title}</p>
                        <div className="flex items-center gap-3 mt-1">
                          {g.competency && <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">{g.competency}</span>}
                          <span className="text-xs text-blue-400">Version personnalisée</span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <AddToGradebookButton
                          gridId={g.id}
                          plans={userPlans}
                          alreadyLinkedPlanIds={alreadyLinkedGridIds[g.id] ?? []}
                        />
                        <Link
                          href={`/dashboard/evaluation/grilles/${g.id}${queryString}`}
                          className="text-sm px-4 py-2 border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition"
                        >
                          Voir / Modifier
                        </Link>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </section>
          </div>
        )}

        {!selectedSubject && (
          <p className="mt-8 text-gray-400 text-sm">Sélectionnez une matière et un niveau pour afficher les grilles.</p>
        )}
      </div>
    </main>
  )
}
