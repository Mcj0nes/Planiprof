import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import GridView from './GridView'
import GridTitleInput from './GridTitleInput'
import CopyGridButton from './CopyGridButton'
import DeleteGridButton from './DeleteGridButton'

export default async function GridDetailPage({
  params,
  searchParams,
}: {
  params:       Promise<{ gridId: string }>
  searchParams: Promise<{ subjectId?: string; gradeId?: string }>
}) {
  const { gridId } = await params
  const sp         = await searchParams
  const supabase   = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [{ data: grid }, { data: levels }, { data: criteria }] = await Promise.all([
    supabase
      .from('eval_grids')
      .select('id, title, cycle_label, source, is_baseline, created_by, base_grid_id')
      .eq('id', gridId)
      .single(),
    supabase
      .from('eval_grid_levels')
      .select('id, code, label, sort_order')
      .eq('grid_id', gridId)
      .order('sort_order'),
    supabase
      .from('eval_grid_criteria')
      .select('id, label, weight, sort_order')
      .eq('grid_id', gridId)
      .order('sort_order'),
  ])

  if (!grid) redirect('/dashboard/evaluation/grilles')

  const criteriaIds = criteria?.map(c => c.id) ?? []
  const { data: cells } = criteriaIds.length
    ? await supabase
        .from('eval_grid_cells')
        .select('id, criterion_id, level_id, descriptor')
        .in('criterion_id', criteriaIds)
    : { data: [] }

  const isOwned     = !grid.is_baseline && grid.created_by === user.id
  const queryString = sp.subjectId && sp.gradeId ? `?subjectId=${sp.subjectId}&gradeId=${sp.gradeId}` : ''

  return (
    <main className="min-h-screen">
      <nav className="px-6 py-4 flex items-center gap-3 flex-wrap" style={{ backgroundColor: 'var(--color-nav)' }}>
        <Link href="/dashboard" className="text-white/70 hover:text-white text-sm">&#x2190; Tableau de bord</Link>
        <span className="text-white/40">/</span>
        <Link href="/dashboard/evaluation" className="text-white/70 hover:text-white text-sm">Outils d&apos;évaluation</Link>
        <span className="text-white/40">/</span>
        <Link href={`/dashboard/evaluation/grilles${queryString}`} className="text-white/70 hover:text-white text-sm">Grilles d&apos;évaluation</Link>
        <span className="text-white/40">/</span>
        <h1 className="text-sm font-semibold text-white truncate max-w-xs">{grid.title}</h1>
      </nav>

      <div className="max-w-7xl mx-auto px-8 py-10">
        <div className="flex items-start justify-between gap-6 mb-8">
          <div>
            {isOwned
              ? <GridTitleInput gridId={gridId} initial={grid.title} />
              : <h2 className="text-2xl font-bold text-gray-800">{grid.title}</h2>
            }
            {grid.cycle_label && <p className="text-sm text-gray-500 mt-1">{grid.cycle_label}</p>}
            {grid.source      && <p className="text-xs text-gray-400 mt-1">Source : {grid.source}</p>}
            {isOwned && (
              <span className="inline-block mt-2 text-xs bg-blue-100 text-blue-700 px-2.5 py-0.5 rounded-full font-medium">
                Version personnalisée
              </span>
            )}
          </div>
          {grid.is_baseline && <CopyGridButton gridId={gridId} />}
          {isOwned && (
            <DeleteGridButton gridId={gridId} returnUrl={`/dashboard/evaluation/grilles${queryString}`} />
          )}
        </div>

        <GridView
          levels={levels ?? []}
          criteria={criteria ?? []}
          cells={cells ?? []}
          isEditable={isOwned}
          gridId={gridId}
        />
      </div>
    </main>
  )
}
