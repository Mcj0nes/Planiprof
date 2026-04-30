import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function StudentGrillesPage({
  params,
  searchParams,
}: {
  params: Promise<{ planId: string; studentId: string }>
  searchParams: Promise<{ etape?: string }>
}) {
  const { planId, studentId } = await params
  const sp = await searchParams
  const filterEtape = sp.etape ?? 'all'

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: plan } = await supabase
    .from('annual_plans')
    .select('id, school_year, subjects(name_fr), grade_levels(label_fr)')
    .eq('id', planId).eq('user_id', user.id).single()
  if (!plan) redirect('/dashboard/gradebook')

  const { data: gb } = await supabase
    .from('grade_books').select('id').eq('annual_plan_id', planId).single()
  if (!gb) redirect(`/dashboard/gradebook/${planId}`)

  const [{ data: student }, { data: etapes }, { data: links }] = await Promise.all([
    supabase.from('gb_students').select('id, name').eq('id', studentId).eq('grade_book_id', gb.id).single(),
    supabase.from('gb_etapes').select('id, name, sort_order').eq('grade_book_id', gb.id).order('sort_order'),
    supabase.from('plan_eval_links')
      .select('id, etape_id, eval_grids(id, title, competency, grid_type)')
      .eq('annual_plan_id', planId)
      .order('created_at'),
  ])

  if (!student) redirect(`/dashboard/gradebook/${planId}/grilles`)

  const allLinks = links ?? []
  const filteredLinks = filterEtape === 'all'
    ? allLinks
    : allLinks.filter(l => (filterEtape === 'none' ? !l.etape_id : l.etape_id === filterEtape))

  // Fetch assessments for this student
  const linkIds = filteredLinks.map(l => l.id)
  const { data: assessments } = linkIds.length
    ? await supabase
        .from('plan_eval_assessments')
        .select('id, link_id, comment')
        .eq('student_id', studentId)
        .in('link_id', linkIds)
    : { data: [] }

  // Count marks per assessment
  const assessmentIds = (assessments ?? []).map(a => a.id)
  const { data: marks } = assessmentIds.length
    ? await supabase
        .from('plan_eval_marks')
        .select('assessment_id')
        .in('assessment_id', assessmentIds)
    : { data: [] }

  const markCountMap: Record<string, number> = {}
  for (const m of marks ?? []) {
    markCountMap[m.assessment_id] = (markCountMap[m.assessment_id] ?? 0) + 1
  }

  const assessmentByLink: Record<string, { id: string; comment: string; markCount: number }> = {}
  for (const a of assessments ?? []) {
    assessmentByLink[a.link_id] = { id: a.id, comment: a.comment ?? '', markCount: markCountMap[a.id] ?? 0 }
  }

  // Group links by étape
  const etapeMap: Record<string, typeof allLinks> = { none: [] }
  for (const e of etapes ?? []) etapeMap[e.id] = []
  for (const link of filteredLinks) {
    const key = link.etape_id ?? 'none'
    if (!etapeMap[key]) etapeMap[key] = []
    etapeMap[key].push(link)
  }

  const p = plan as any

  return (
    <main className="min-h-screen bg-gray-50">
      <nav className="px-6 py-4 flex items-center gap-3 flex-wrap" style={{ backgroundColor: 'var(--color-nav)' }}>
        <Link href={`/dashboard/gradebook/${planId}/grilles`} className="text-white/70 hover:text-white text-sm">
          ← Grilles
        </Link>
        <span className="text-white/40">/</span>
        <h1 className="text-lg font-bold text-white">{student.name}</h1>
        <span className="text-sm text-white/60 ml-auto">
          {p.subjects?.name_fr ?? 'Toutes les matières'} · {p.grade_levels?.label_fr}
        </span>
      </nav>

      <div className="max-w-3xl mx-auto px-6 py-8">

        {/* Vue filter */}
        <div className="flex items-center gap-2 mb-8 flex-wrap">
          {[
            { key: 'all', label: 'Toute l\'année' },
            { key: 'none', label: 'Sans étape' },
            ...(etapes ?? []).map(e => ({ key: e.id, label: e.name })),
          ].map(opt => (
            <Link
              key={opt.key}
              href={`/dashboard/gradebook/${planId}/grilles/${studentId}${opt.key !== 'all' ? `?etape=${opt.key}` : ''}`}
              className={`px-3 py-1.5 rounded-full text-sm font-medium transition border ${
                filterEtape === opt.key
                  ? 'bg-blue-600 text-white border-blue-600'
                  : 'bg-white text-gray-600 border-gray-200 hover:bg-gray-50'
              }`}
            >
              {opt.label}
            </Link>
          ))}
        </div>

        {filteredLinks.length === 0 ? (
          <div className="bg-white border border-dashed border-gray-200 rounded-2xl p-12 text-center text-gray-400 text-sm">
            Aucune grille pour cette sélection.
          </div>
        ) : (
          <div className="space-y-8">
            {(filterEtape === 'all' ? [
              ...(etapes ?? []).map(e => ({ id: e.id, label: e.name })),
              { id: 'none', label: 'Sans étape' },
            ] : [
              filterEtape === 'none'
                ? { id: 'none', label: 'Sans étape' }
                : { id: filterEtape, label: (etapes ?? []).find(e => e.id === filterEtape)?.name ?? '' }
            ]).map(group => {
              const groupLinks = etapeMap[group.id] ?? []
              if (!groupLinks.length) return null
              return (
                <section key={group.id}>
                  <h2 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-3">{group.label}</h2>
                  <div className="space-y-3">
                    {groupLinks.map((link: any) => {
                      const a = assessmentByLink[link.id]
                      const grid = link.eval_grids
                      return (
                        <Link
                          key={link.id}
                          href={`/dashboard/gradebook/${planId}/grilles/${studentId}/${link.id}`}
                          className="block bg-white border border-gray-200 rounded-2xl p-5 hover:border-blue-300 hover:shadow-sm transition group"
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1 min-w-0">
                              <p className="font-semibold text-gray-800 group-hover:text-blue-700 transition leading-snug">
                                {grid?.title}
                              </p>
                              <div className="flex items-center gap-2 mt-1 flex-wrap">
                                {grid?.competency && (
                                  <span className="text-xs bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded">{grid.competency}</span>
                                )}
                                <span className="text-xs text-gray-400">
                                  {grid?.grid_type === 'conversation' ? 'Discussion' : 'Évaluation'}
                                </span>
                              </div>
                              {a?.comment && (
                                <p className="text-xs text-gray-500 mt-2 line-clamp-1 italic">{a.comment}</p>
                              )}
                            </div>
                            <div className="shrink-0 text-right">
                              {a ? (
                                <span className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full ${
                                  a.markCount > 0
                                    ? 'bg-green-100 text-green-700'
                                    : 'bg-yellow-100 text-yellow-700'
                                }`}>
                                  {a.markCount > 0 ? `${a.markCount} critère${a.markCount > 1 ? 's' : ''} évalué${a.markCount > 1 ? 's' : ''}` : 'Commentaire seulement'}
                                </span>
                              ) : (
                                <span className="inline-flex items-center text-xs text-gray-400 px-2.5 py-1 rounded-full bg-gray-100">
                                  Non évalué
                                </span>
                              )}
                            </div>
                          </div>
                        </Link>
                      )
                    })}
                  </div>
                </section>
              )
            })}
          </div>
        )}
      </div>
    </main>
  )
}
