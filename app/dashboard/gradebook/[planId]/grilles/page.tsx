import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function GrillesOverviewPage({
  params,
  searchParams,
}: {
  params: Promise<{ planId: string }>
  searchParams: Promise<{ etape?: string }>
}) {
  const { planId } = await params
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

  const [{ data: students }, { data: etapes }, { data: links }] = await Promise.all([
    supabase.from('gb_students').select('id, name, sort_order').eq('grade_book_id', gb.id).order('sort_order').order('name'),
    supabase.from('gb_etapes').select('id, name, sort_order').eq('grade_book_id', gb.id).order('sort_order'),
    supabase.from('plan_eval_links')
      .select('id, etape_id, eval_grids(id, title, competency, grid_type)')
      .eq('annual_plan_id', planId)
      .order('created_at'),
  ])

  // Deduplicate étapes by name (same-name duplicates from double seeding)
  const seenNames = new Set<string>()
  const uniqueEtapes = (etapes ?? []).filter(e => {
    if (seenNames.has(e.name)) return false
    seenNames.add(e.name)
    return true
  })

  const allLinks = links ?? []
  const filteredLinks = filterEtape === 'all'
    ? allLinks
    : allLinks.filter(l => (filterEtape === 'none' ? !l.etape_id : l.etape_id === filterEtape))

  // Fetch assessment completion map: which (linkId, studentId) combos have assessments
  const linkIds = filteredLinks.map(l => l.id)
  const studentIds = (students ?? []).map(s => s.id)
  const { data: assessments } = linkIds.length && studentIds.length
    ? await supabase
        .from('plan_eval_assessments')
        .select('link_id, student_id')
        .in('link_id', linkIds)
        .in('student_id', studentIds)
    : { data: [] }

  const doneSet = new Set((assessments ?? []).map(a => `${a.link_id}::${a.student_id}`))

  const p = plan as any

  return (
    <main className="min-h-screen bg-gray-50">
      <nav className="px-6 py-4 flex items-center gap-3 flex-wrap" style={{ backgroundColor: 'var(--color-nav)' }}>
        <Link href={`/dashboard/gradebook/${planId}`} className="text-white/70 hover:text-white text-sm">
          ← Carnet de notes
        </Link>
        <span className="text-white/40">/</span>
        <h1 className="text-lg font-bold text-white">
          Grilles d&apos;évaluation · {p.subjects?.name_fr ?? 'Toutes les matières'} · {p.grade_levels?.label_fr}
        </h1>
      </nav>

      <div className="max-w-6xl mx-auto px-6 py-8">

        {/* Étape filter */}
        <div className="flex items-center gap-2 mb-6 flex-wrap">
          {[
            { key: 'all',  label: 'Toute l\'année' },
            { key: 'none', label: 'Sans étape' },
            ...uniqueEtapes.map(e => ({ key: e.id, label: e.name })),
          ].map(opt => (
            <Link
              key={opt.key}
              href={`/dashboard/gradebook/${planId}/grilles${opt.key !== 'all' ? `?etape=${opt.key}` : ''}`}
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
          <div className="bg-white border border-dashed border-gray-200 rounded-2xl p-12 text-center text-gray-400">
            <p className="text-sm">Aucune grille liée à ce plan.</p>
            <p className="text-xs mt-1">
              Ajoutez des grilles depuis l&apos;onglet{' '}
              <Link href={`/dashboard/annual/${planId}?tab=evaluation`} className="text-blue-500 hover:underline">
                Évaluation de la planification
              </Link>.
            </p>
          </div>
        ) : (students ?? []).length === 0 ? (
          <div className="bg-white border border-dashed border-gray-200 rounded-2xl p-12 text-center text-gray-400">
            <p className="text-sm">Aucun élève dans ce carnet.</p>
            <p className="text-xs mt-1">
              Ajoutez des élèves depuis{' '}
              <Link href={`/dashboard/gradebook/${planId}`} className="text-blue-500 hover:underline">
                l&apos;onglet Élèves
              </Link>.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-gray-200 shadow-sm bg-white">
            <table className="border-collapse text-sm w-full">
              <thead>
                <tr>
                  <th className="text-left px-5 py-3 bg-gray-50 border-b border-r border-gray-200 font-semibold text-gray-700 sticky left-0 z-10 min-w-44">
                    Élève
                  </th>
                  {filteredLinks.map((link: any) => (
                    <th key={link.id} className="px-4 py-3 bg-gray-50 border-b border-r border-gray-200 font-medium text-gray-700 text-center last:border-r-0 min-w-36">
                      <Link
                        href={`/dashboard/gradebook/${planId}/grilles/link/${link.id}`}
                        className="block text-xs leading-snug hover:text-blue-600 hover:underline"
                      >
                        {link.eval_grids?.title}
                      </Link>
                      {link.etape_id && (
                        <span className="block text-xs text-gray-400 font-normal mt-0.5">
                          {etapes?.find(e => e.id === link.etape_id)?.name}
                        </span>
                      )}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {(students ?? []).map((student, idx) => (
                  <tr key={student.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/50'}>
                    <td className="px-5 py-3 border-b border-r border-gray-200 sticky left-0 z-10 bg-inherit">
                      <Link
                        href={`/dashboard/gradebook/${planId}/grilles/${student.id}`}
                        className="font-medium text-blue-600 hover:underline"
                      >
                        {student.name}
                      </Link>
                    </td>
                    {filteredLinks.map((link: any) => {
                      const done = doneSet.has(`${link.id}::${student.id}`)
                      return (
                        <td key={link.id} className="px-4 py-3 border-b border-r border-gray-200 text-center last:border-r-0">
                          <Link
                            href={`/dashboard/gradebook/${planId}/grilles/${student.id}/${link.id}`}
                            className={`inline-flex items-center justify-center w-7 h-7 rounded-full text-xs font-medium transition
                              ${done
                                ? 'bg-green-100 text-green-700 hover:bg-green-200'
                                : 'bg-gray-100 text-gray-400 hover:bg-blue-50 hover:text-blue-500'
                              }`}
                            title={done ? 'Évaluation complétée' : 'Ouvrir'}
                          >
                            {done ? '✓' : '—'}
                          </Link>
                        </td>
                      )
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </main>
  )
}
