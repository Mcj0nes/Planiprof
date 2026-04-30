import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Suspense } from 'react'
import EvaluationSelector from '../EvaluationSelector'

export default async function ConversationsPage({
  searchParams,
}: {
  searchParams: Promise<{ subjectId?: string; gradeId?: string }>
}) {
  const params   = await searchParams
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [{ data: subjects }, { data: gradeLevels }] = await Promise.all([
    supabase.from('subjects').select('id, name_fr').eq('is_active', true).order('name_fr'),
    supabase.from('grade_levels').select('id, label_fr, education_level, grade').eq('education_level', 'primaire').order('grade'),
  ])

  const subjectId = params.subjectId ? Number(params.subjectId) : null
  const gradeId   = params.gradeId   ? Number(params.gradeId)   : null

  let grids: { id: string; title: string; cycle_label: string | null; competency: string | null; is_baseline: boolean }[] = []

  if (subjectId && gradeId) {
    const { data: gradeRows } = await supabase
      .from('eval_grid_grades').select('grid_id').eq('grade_level_id', gradeId)
    const gridIds = [...new Set(gradeRows?.map(r => r.grid_id) ?? [])]

    if (gridIds.length > 0) {
      const { data } = await supabase
        .from('eval_grids')
        .select('id, title, cycle_label, competency, is_baseline')
        .in('id', gridIds)
        .eq('grid_type', 'conversation')
        .eq('subject_id', subjectId)
        .order('is_baseline', { ascending: false })
        .order('title')
      const all = (data ?? []) as typeof grids
      // Keep user versions first; deduplicate by title (user version wins over baseline)
      const seen = new Set<string>()
      grids = [
        ...all.filter(g => !g.is_baseline),
        ...all.filter(g => g.is_baseline),
      ].filter(g => {
        const key = g.title.trim().toLowerCase()
        if (seen.has(key)) return false
        seen.add(key)
        return true
      })
    }
  }

  const selectedSubject = subjects?.find(s => s.id === subjectId)
  const selectedGrade   = gradeLevels?.find(g => g.id === gradeId)

  return (
    <main className="min-h-screen">
      <nav className="px-6 py-4 flex items-center gap-3" style={{ backgroundColor: 'var(--color-nav)' }}>
        <Link href="/dashboard" className="text-white/70 hover:text-white text-sm">&#x2190; Tableau de bord</Link>
        <span className="text-white/40">/</span>
        <Link href="/dashboard/evaluation" className="text-white/70 hover:text-white text-sm">Outils d&apos;évaluation</Link>
        <span className="text-white/40">/</span>
        <h1 className="text-lg font-bold text-white">Conversations</h1>
      </nav>

      <div className="max-w-4xl mx-auto px-8 py-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Conversations</h2>

        <Suspense>
          <EvaluationSelector
            subjects={subjects ?? []}
            gradeLevels={gradeLevels ?? []}
            basePath="/dashboard/evaluation/conversations"
          />
        </Suspense>

        {selectedSubject && selectedGrade && (
          <div className="mt-8">
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
              <span className="font-semibold text-gray-700">{selectedSubject.name_fr}</span>
              <span>·</span>
              <span>{selectedGrade.label_fr}</span>
            </div>

            {grids.length === 0 ? (
              <div className="bg-white border rounded-2xl p-8 text-center text-gray-400">
                <p>Aucune grille de conversation disponible pour cette sélection.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {grids.map(g => (
                  <div key={g.id} className="bg-white border rounded-2xl p-5 flex items-center justify-between shadow-sm">
                    <div>
                      <p className="font-semibold text-gray-800">{g.title}</p>
                      <div className="flex items-center gap-3 mt-1">
                        {g.cycle_label && <span className="text-xs text-gray-400">{g.cycle_label}</span>}
                        {g.competency  && <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">{g.competency}</span>}
                        {!g.is_baseline && <span className="text-xs bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full">Ma version</span>}
                      </div>
                    </div>
                    <Link
                      href={`/dashboard/evaluation/conversations/${g.id}/session`}
                      className="text-sm px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition shrink-0"
                    >
                      Remplir →
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {!selectedSubject && (
          <p className="mt-8 text-gray-400 text-sm">Sélectionnez une matière et un niveau pour afficher les grilles.</p>
        )}
      </div>
    </main>
  )
}
