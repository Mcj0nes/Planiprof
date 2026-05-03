import { createClient } from '@/lib/supabase/server'
import { ensureGradeBook, fetchAvailableGrids } from './eval-links-actions'
import AddEvalGridPanel from './AddEvalGridPanel'
import RemoveEvalLinkButton from './RemoveEvalLinkButton'
import EtapeSelector from './EtapeSelector'
import WeightInput from './WeightInput'
import Link from 'next/link'

interface Props {
  planId:    string
  gradeId:   number
  subjectId: number | null
  section?:  string
}

export default async function EvalLinksSection({ planId, gradeId, subjectId, section }: Props) {
  const supabase = await createClient()
  const gb = await ensureGradeBook(planId)

  const [{ data: links }, { data: etapes }, grids] = await Promise.all([
    supabase
      .from('plan_eval_links')
      .select('id, eval_grid_id, etape_id, weight_pct, eval_grids(title, competency, grid_type, subjects(name_fr)), gb_etapes(name)')
      .eq('annual_plan_id', planId)
      .order('created_at'),
    supabase
      .from('gb_etapes')
      .select('id, name, sort_order')
      .eq('grade_book_id', gb.id)
      .order('sort_order'),
    fetchAvailableGrids(gradeId, planId, subjectId),
  ])

  const evalLinks  = (links ?? []).filter(l => (l.eval_grids as any)?.grid_type !== 'conversation')
  const convLinks  = (links ?? []).filter(l => (l.eval_grids as any)?.grid_type === 'conversation')
  const evalGrids  = grids.filter(g => g.grid_type !== 'conversation')
  const convGrids  = grids.filter(g => g.grid_type === 'conversation')

  const hubHref      = `/dashboard/annual/${planId}?tab=evaluation`
  const gradebookHref = `/dashboard/gradebook/${planId}/grilles`

  // ── SECTION: Grilles d'évaluation ────────────────────────────
  if (section === 'grilles') {
    return (
      <div className="max-w-3xl mx-auto px-8 py-8">
        <div className="flex items-center gap-3 mb-6">
          <Link href={hubHref} className="text-sm text-gray-400 hover:text-gray-600 transition">← Retour</Link>
          <span className="text-gray-300">/</span>
          <h3 className="text-lg font-semibold text-gray-800">Grilles d&apos;évaluation</h3>
          <div className="ml-auto flex items-center gap-3">
            <Link href={gradebookHref} className="text-sm px-4 py-2 border border-gray-200 text-gray-600 rounded-xl hover:bg-gray-50 transition">
              Carnet de notes →
            </Link>
            <AddEvalGridPanel planId={planId} etapes={etapes ?? []} grids={evalGrids} />
          </div>
        </div>
        <LinksList links={evalLinks} planId={planId} etapes={etapes ?? []} />
      </div>
    )
  }

  // ── SECTION: Conversations ────────────────────────────────────
  if (section === 'conversations') {
    return (
      <div className="max-w-3xl mx-auto px-8 py-8">
        <div className="flex items-center gap-3 mb-6">
          <Link href={hubHref} className="text-sm text-gray-400 hover:text-gray-600 transition">← Retour</Link>
          <span className="text-gray-300">/</span>
          <h3 className="text-lg font-semibold text-gray-800">Conversations</h3>
          <div className="ml-auto">
            <AddEvalGridPanel planId={planId} etapes={etapes ?? []} grids={convGrids} />
          </div>
        </div>
        <LinksList links={convLinks} planId={planId} etapes={etapes ?? []} />
      </div>
    )
  }

  // ── HUB : 3 cartes ───────────────────────────────────────────
  return (
    <div className="max-w-4xl mx-auto px-8 py-10">
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">

        <Link
          href={`${hubHref}&section=grilles`}
          className="flex flex-col items-center text-center gap-4 p-8 bg-white rounded-3xl border-2 border-blue-100 hover:border-blue-300 hover:shadow-md transition group"
        >
          <div className="w-16 h-16 rounded-2xl bg-blue-100 flex items-center justify-center text-3xl group-hover:bg-blue-200 transition">
            📊
          </div>
          <div>
            <h3 className="font-bold text-gray-800 text-base mb-1">Grilles d&apos;évaluation</h3>
            <p className="text-sm text-gray-500 leading-snug">Attribuer une grille d&apos;évaluation à une étape du plan</p>
          </div>
          {evalLinks.length > 0 && (
            <span className="text-xs bg-blue-100 text-blue-700 font-semibold px-2.5 py-1 rounded-full">
              {evalLinks.length} grille{evalLinks.length > 1 ? 's' : ''} liée{evalLinks.length > 1 ? 's' : ''}
            </span>
          )}
        </Link>

        <Link
          href="/dashboard/evaluation/observation"
          className="flex flex-col items-center text-center gap-4 p-8 bg-white rounded-3xl border-2 border-indigo-100 hover:border-indigo-300 hover:shadow-md transition group"
        >
          <div className="w-16 h-16 rounded-2xl bg-indigo-100 flex items-center justify-center text-3xl group-hover:bg-indigo-200 transition">
            🔍
          </div>
          <div>
            <h3 className="font-bold text-gray-800 text-base mb-1">Grilles d&apos;observation</h3>
            <p className="text-sm text-gray-500 leading-snug">Accéder aux grilles d&apos;observation à remplir pendant les activités</p>
          </div>
          <span className="text-xs text-indigo-500 font-medium">Accéder →</span>
        </Link>

        <Link
          href={`${hubHref}&section=conversations`}
          className="flex flex-col items-center text-center gap-4 p-8 bg-white rounded-3xl border-2 border-emerald-100 hover:border-emerald-300 hover:shadow-md transition group"
        >
          <div className="w-16 h-16 rounded-2xl bg-emerald-100 flex items-center justify-center text-3xl group-hover:bg-emerald-200 transition">
            💬
          </div>
          <div>
            <h3 className="font-bold text-gray-800 text-base mb-1">Conversations</h3>
            <p className="text-sm text-gray-500 leading-snug">Attribuer une grille de conversation à une étape du plan</p>
          </div>
          {convLinks.length > 0 && (
            <span className="text-xs bg-emerald-100 text-emerald-700 font-semibold px-2.5 py-1 rounded-full">
              {convLinks.length} grille{convLinks.length > 1 ? 's' : ''} liée{convLinks.length > 1 ? 's' : ''}
            </span>
          )}
        </Link>

      </div>
    </div>
  )
}

function LinksList({ links, planId, etapes }: {
  links: any[]
  planId: string
  etapes: { id: string; name: string; sort_order: number }[]
}) {
  if (links.length === 0) {
    return (
      <div className="bg-white border border-dashed border-gray-200 rounded-2xl p-10 text-center text-gray-400">
        <p className="text-sm">Aucune grille liée à ce plan.</p>
        <p className="text-xs mt-1">Cliquez sur &quot;Ajouter une grille&quot; pour commencer.</p>
      </div>
    )
  }
  return (
    <div className="space-y-3">
      {links.map((link: any) => {
        const grid = link.eval_grids
        return (
          <div key={link.id} className="bg-white border border-gray-200 rounded-2xl p-4 flex items-start gap-4 shadow-sm">
            <div className="flex-1 min-w-0">
              <p className="font-medium text-gray-800 leading-snug">{grid?.title}</p>
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                {grid?.subjects?.name_fr && <span className="text-xs text-gray-500">{grid.subjects.name_fr}</span>}
                {grid?.competency && <span className="text-xs bg-blue-50 text-blue-600 px-1.5 py-0.5 rounded">{grid.competency}</span>}
                <span className="text-xs text-gray-400">{grid?.grid_type === 'conversation' ? 'Discussion' : 'Évaluation'}</span>
              </div>
            </div>
            <WeightInput planId={planId} linkId={link.id} current={link.weight_pct ?? null} />
            <EtapeSelector planId={planId} linkId={link.id} currentEtapeId={link.etape_id ?? ''} etapes={etapes} />
            <RemoveEvalLinkButton planId={planId} linkId={link.id} />
          </div>
        )
      })}
    </div>
  )
}
