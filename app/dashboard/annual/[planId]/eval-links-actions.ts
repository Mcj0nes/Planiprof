'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

async function assertPlanOwner(planId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Non authentifié')
  const { data: plan } = await supabase
    .from('annual_plans').select('id').eq('id', planId).eq('user_id', user.id).single()
  if (!plan) throw new Error('Accès refusé')
  return { supabase, userId: user.id }
}

export async function ensureGradeBook(planId: string): Promise<{ id: string }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Non authentifié')

  await supabase.from('grade_books')
    .upsert({ annual_plan_id: planId, user_id: user.id }, { onConflict: 'annual_plan_id', ignoreDuplicates: true })

  const { data: gb } = await supabase
    .from('grade_books').select('id').eq('annual_plan_id', planId).single()
  if (!gb) throw new Error('Carnet introuvable')

  const { data: etapes } = await supabase.from('gb_etapes').select('id').eq('grade_book_id', gb.id)
  if (!etapes?.length) {
    await supabase.from('gb_etapes').insert([
      { grade_book_id: gb.id, name: 'Étape 1', weight: 20, sort_order: 1 },
      { grade_book_id: gb.id, name: 'Étape 2', weight: 30, sort_order: 2 },
      { grade_book_id: gb.id, name: 'Étape 3', weight: 50, sort_order: 3 },
    ])
  }
  return gb
}

export async function addEvalLink(
  planId: string, gridId: string, etapeId: string | null, weightPct?: number | null
): Promise<void> {
  const { supabase } = await assertPlanOwner(planId)

  const { data: link } = await supabase.from('plan_eval_links').insert({
    annual_plan_id: planId,
    eval_grid_id: gridId,
    etape_id: etapeId || null,
    weight_pct: weightPct ?? null,
  }).select('id').single()

  // Auto-create a gb_evaluations entry when an étape is selected
  if (link && etapeId) {
    const { data: grid } = await supabase
      .from('eval_grids').select('title').eq('id', gridId).single()

    if (grid) {
      const { data: existing } = await supabase
        .from('gb_evaluations').select('sort_order')
        .eq('etape_id', etapeId)
        .order('sort_order', { ascending: false }).limit(1)

      const { data: newEval } = await supabase.from('gb_evaluations').insert({
        etape_id:     etapeId,
        name:         grid.title,
        weight:       weightPct ?? 100,
        grading_type: 'letter',
        sort_order:   ((existing?.[0]?.sort_order) ?? 0) + 1,
      }).select('id').single()

      // Set link_id via a separate UPDATE so schema-cache timing never blocks it
      if (newEval) {
        await supabase.from('gb_evaluations')
          .update({ link_id: link.id })
          .eq('id', newEval.id)
      }
    }
  }

  revalidatePath(`/dashboard/annual/${planId}`)
  revalidatePath(`/dashboard/gradebook/${planId}`)
}

export async function updateLinkWeight(planId: string, linkId: string, weightPct: number | null): Promise<void> {
  const { supabase } = await assertPlanOwner(planId)
  await supabase.from('plan_eval_links')
    .update({ weight_pct: weightPct })
    .eq('id', linkId).eq('annual_plan_id', planId)
  // Keep gb_evaluations.weight in sync
  if (weightPct != null) {
    await supabase.from('gb_evaluations').update({ weight: weightPct }).eq('link_id', linkId)
  }
  revalidatePath(`/dashboard/annual/${planId}`)
  revalidatePath(`/dashboard/gradebook/${planId}`)
}

export async function removeEvalLink(planId: string, linkId: string): Promise<void> {
  const { supabase } = await assertPlanOwner(planId)
  // CASCADE on gb_evaluations.link_id auto-deletes the linked evaluation and its grades
  await supabase.from('plan_eval_links').delete().eq('id', linkId).eq('annual_plan_id', planId)
  revalidatePath(`/dashboard/annual/${planId}`)
  revalidatePath(`/dashboard/gradebook/${planId}`)
}

export async function updateLinkEtape(planId: string, linkId: string, etapeId: string | null): Promise<void> {
  const { supabase } = await assertPlanOwner(planId)
  await supabase.from('plan_eval_links')
    .update({ etape_id: etapeId || null })
    .eq('id', linkId)
    .eq('annual_plan_id', planId)
  revalidatePath(`/dashboard/annual/${planId}`)
}

export async function fetchAvailableGrids(
  gradeId: number, planId: string, subjectId?: number | null
): Promise<{
  id: string; title: string; competency: string | null; grid_type: string;
  is_baseline: boolean; subject_name: string | null
}[]> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data: gradeRows } = await supabase
    .from('eval_grid_grades').select('grid_id').eq('grade_level_id', gradeId)
  const gridIds = gradeRows?.map(r => r.grid_id) ?? []
  if (!gridIds.length) return []

  // Already linked grid IDs
  const { data: linked } = await supabase
    .from('plan_eval_links').select('eval_grid_id').eq('annual_plan_id', planId)
  const linkedIds = new Set(linked?.map(l => l.eval_grid_id) ?? [])

  let query = supabase
    .from('eval_grids')
    .select('id, title, competency, grid_type, is_baseline, subjects(name_fr)')
    .in('id', gridIds)
    .or(`is_baseline.eq.true,created_by.eq.${user.id}`)

  if (subjectId) query = query.eq('subject_id', subjectId)

  const { data } = await query.order('title')

  return (data ?? [])
    .filter(g => !linkedIds.has(g.id))
    .map(g => ({
      id: g.id,
      title: g.title,
      competency: g.competency ?? null,
      grid_type: g.grid_type,
      is_baseline: g.is_baseline,
      subject_name: (g.subjects as any)?.name_fr ?? null,
    }))
}
