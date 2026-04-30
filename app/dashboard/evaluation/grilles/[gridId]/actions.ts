'use server'

import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

async function assertOwner(gridId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Non authentifié')

  const { data: grid } = await supabase
    .from('eval_grids')
    .select('created_by, is_baseline')
    .eq('id', gridId)
    .single()
  if (!grid || grid.is_baseline || grid.created_by !== user.id) throw new Error('Accès refusé')

  return { supabase, userId: user.id }
}

export async function copyGrid(
  originalId: string,
  returnBase = '/dashboard/evaluation/grilles'
): Promise<void> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Non authentifié')

  const { data: original } = await supabase
    .from('eval_grids')
    .select('title, subject_id, cycle_label, source, competency, grid_type')
    .eq('id', originalId)
    .single()
  if (!original) throw new Error('Grille introuvable')

  const { data: newGrid } = await supabase
    .from('eval_grids')
    .insert({
      title:        original.title,
      subject_id:   original.subject_id,
      cycle_label:  original.cycle_label,
      source:       original.source,
      competency:   original.competency,
      grid_type:    original.grid_type,
      is_baseline:  false,
      base_grid_id: originalId,
      created_by:   user.id,
    })
    .select('id')
    .single()
  if (!newGrid) throw new Error('Erreur lors de la création de la grille')

  const [{ data: grades }, { data: levels }, { data: criteria }] = await Promise.all([
    supabase.from('eval_grid_grades').select('grade_level_id').eq('grid_id', originalId),
    supabase.from('eval_grid_levels').select('id, code, label, sort_order').eq('grid_id', originalId).order('sort_order'),
    supabase.from('eval_grid_criteria').select('id, label, weight, sort_order').eq('grid_id', originalId).order('sort_order'),
  ])

  if (grades?.length) {
    await supabase.from('eval_grid_grades').insert(
      grades.map(g => ({ grid_id: newGrid.id, grade_level_id: g.grade_level_id }))
    )
  }

  const levelIdMap: Record<number, number> = {}
  for (const level of levels ?? []) {
    const { data: newLevel } = await supabase
      .from('eval_grid_levels')
      .insert({ grid_id: newGrid.id, code: level.code, label: level.label, sort_order: level.sort_order })
      .select('id')
      .single()
    if (newLevel) levelIdMap[level.id] = newLevel.id
  }

  const criteriaIdMap: Record<string, string> = {}
  for (const criterion of criteria ?? []) {
    const { data: newCrit } = await supabase
      .from('eval_grid_criteria')
      .insert({ grid_id: newGrid.id, label: criterion.label, weight: criterion.weight, sort_order: criterion.sort_order })
      .select('id')
      .single()
    if (newCrit) criteriaIdMap[criterion.id] = newCrit.id
  }

  const originalCriteriaIds = Object.keys(criteriaIdMap)
  if (originalCriteriaIds.length) {
    const { data: cells } = await supabase
      .from('eval_grid_cells')
      .select('criterion_id, level_id, descriptor')
      .in('criterion_id', originalCriteriaIds)

    if (cells?.length) {
      await supabase.from('eval_grid_cells').insert(
        cells.map(cell => ({
          criterion_id: criteriaIdMap[cell.criterion_id],
          level_id:     levelIdMap[cell.level_id],
          descriptor:   cell.descriptor,
        }))
      )
    }
  }

  redirect(`${returnBase}/${newGrid.id}`)
}

export async function updateGridTitle(gridId: string, title: string): Promise<void> {
  const { supabase } = await assertOwner(gridId)
  const trimmed = title.trim()
  if (!trimmed) return
  await supabase.from('eval_grids').update({ title: trimmed }).eq('id', gridId)
}

export async function updateCells(
  gridId: string,
  cells: { id: string; descriptor: string }[],
  criterionLabels?: { id: string; label: string }[]
): Promise<void> {
  const { supabase } = await assertOwner(gridId)

  await Promise.all([
    ...( cells ?? []).map(cell =>
      supabase.from('eval_grid_cells').update({ descriptor: cell.descriptor }).eq('id', cell.id)
    ),
    ...(criterionLabels ?? []).map(c =>
      supabase.from('eval_grid_criteria').update({ label: c.label }).eq('id', c.id)
    ),
  ])
}

export async function addCriterion(gridId: string, label: string): Promise<void> {
  const { supabase } = await assertOwner(gridId)

  const { data: existing } = await supabase
    .from('eval_grid_criteria')
    .select('sort_order')
    .eq('grid_id', gridId)
    .order('sort_order', { ascending: false })
    .limit(1)

  const nextOrder = ((existing?.[0]?.sort_order) ?? 0) + 1

  const { data: newCrit } = await supabase
    .from('eval_grid_criteria')
    .insert({ grid_id: gridId, label, sort_order: nextOrder })
    .select('id')
    .single()

  if (!newCrit) return

  const { data: levels } = await supabase
    .from('eval_grid_levels')
    .select('id')
    .eq('grid_id', gridId)

  if (levels?.length) {
    await supabase.from('eval_grid_cells').insert(
      levels.map(l => ({ criterion_id: newCrit.id, level_id: l.id, descriptor: '' }))
    )
  }
}

export async function removeCriterion(gridId: string, criterionId: string): Promise<void> {
  const { supabase } = await assertOwner(gridId)
  await supabase.from('eval_grid_criteria').delete().eq('id', criterionId).eq('grid_id', gridId)
}

export async function addLevel(gridId: string, code: string, label: string): Promise<void> {
  const { supabase } = await assertOwner(gridId)

  const { data: existing } = await supabase
    .from('eval_grid_levels')
    .select('sort_order')
    .eq('grid_id', gridId)
    .order('sort_order', { ascending: false })
    .limit(1)

  const nextOrder = ((existing?.[0]?.sort_order) ?? 0) + 1

  const { data: newLevel } = await supabase
    .from('eval_grid_levels')
    .insert({ grid_id: gridId, code, label, sort_order: nextOrder })
    .select('id')
    .single()

  if (!newLevel) return

  const { data: criteria } = await supabase
    .from('eval_grid_criteria')
    .select('id')
    .eq('grid_id', gridId)

  if (criteria?.length) {
    await supabase.from('eval_grid_cells').insert(
      criteria.map(c => ({ criterion_id: c.id, level_id: newLevel.id, descriptor: '' }))
    )
  }
}

export async function removeLevel(gridId: string, levelId: number): Promise<void> {
  const { supabase } = await assertOwner(gridId)
  await supabase.from('eval_grid_levels').delete().eq('id', levelId).eq('grid_id', gridId)
}

export async function deleteGrid(gridId: string, returnUrl: string): Promise<void> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Non authentifié')

  const { data: grid } = await supabase
    .from('eval_grids')
    .select('created_by, is_baseline')
    .eq('id', gridId)
    .single()
  if (!grid || grid.is_baseline || grid.created_by !== user.id) throw new Error('Accès refusé')

  await supabase.from('eval_grids').delete().eq('id', gridId)
  redirect(returnUrl)
}
