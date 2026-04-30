'use server'

import { createClient } from '@/lib/supabase/server'

async function propagateStudents(
  supabase: Awaited<ReturnType<typeof createClient>>,
  sourceGradeBookId: string,
  names: string[],
) {
  const { data: gb } = await supabase
    .from('grade_books').select('annual_plan_id, user_id').eq('id', sourceGradeBookId).single()
  if (!gb) return

  const { data: plan } = await supabase
    .from('annual_plans').select('grade_level_id, school_year')
    .eq('id', gb.annual_plan_id).single()
  if (!plan) return

  const { data: otherPlans } = await supabase
    .from('annual_plans').select('id')
    .eq('user_id', gb.user_id)
    .eq('grade_level_id', plan.grade_level_id)
    .eq('school_year', plan.school_year)
    .neq('id', gb.annual_plan_id)
  if (!otherPlans?.length) return

  const { data: otherBooks } = await supabase
    .from('grade_books').select('id')
    .in('annual_plan_id', otherPlans.map((p: any) => p.id))
  if (!otherBooks?.length) return

  for (const book of otherBooks as any[]) {
    const { data: existing } = await supabase
      .from('gb_students').select('name, sort_order').eq('grade_book_id', book.id)
    const existingNames = new Set((existing ?? []).map((s: any) => s.name.trim().toLowerCase()))
    const maxOrder = Math.max(-1, ...(existing ?? []).map((s: any) => s.sort_order ?? 0))
    const toInsert = names
      .filter(n => !existingNames.has(n.trim().toLowerCase()))
      .map((n, i) => ({ grade_book_id: book.id, name: n.trim(), sort_order: maxOrder + 1 + i }))
    if (toInsert.length > 0) await supabase.from('gb_students').insert(toInsert)
  }
}

export async function addStudent(gradeBookId: string, name: string) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('gb_students')
    .insert({ grade_book_id: gradeBookId, name: name.trim() })
    .select().single()
  if (error) throw error
  await propagateStudents(supabase, gradeBookId, [name.trim()])
  return data
}

export async function addStudentsBulk(gradeBookId: string, names: string[]) {
  const supabase = await createClient()
  const rows = names.map((name, i) => ({ grade_book_id: gradeBookId, name, sort_order: i }))
  const { data, error } = await supabase.from('gb_students').insert(rows).select()
  if (error) throw error
  await propagateStudents(supabase, gradeBookId, names)
  return data ?? []
}

export async function removeStudent(studentId: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('gb_students').delete().eq('id', studentId)
  if (error) throw error
}

export async function updateEtape(etapeId: string, updates: { name?: string; weight?: number }) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('gb_etapes').update(updates).eq('id', etapeId).select().single()
  if (error) throw error
  return data
}

export async function addEtape(gradeBookId: string, name: string, sortOrder: number) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('gb_etapes')
    .insert({ grade_book_id: gradeBookId, name, weight: 0, sort_order: sortOrder })
    .select().single()
  if (error) throw error
  return data
}

export async function removeEtape(etapeId: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('gb_etapes').delete().eq('id', etapeId)
  if (error) throw error
}

export async function addEvaluation(
  etapeId: string, name: string, weight: number,
  gradingType: 'numeric' | 'letter', sortOrder: number
) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('gb_evaluations')
    .insert({ etape_id: etapeId, name, weight, grading_type: gradingType, sort_order: sortOrder })
    .select().single()
  if (error) throw error
  return data
}

export async function updateEvaluation(
  evaluationId: string,
  updates: { name?: string; weight?: number; grading_type?: 'numeric' | 'letter' }
) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('gb_evaluations').update(updates).eq('id', evaluationId).select().single()
  if (error) throw error
  return data
}

export async function removeEvaluation(evaluationId: string) {
  const supabase = await createClient()
  const { error } = await supabase.from('gb_evaluations').delete().eq('id', evaluationId)
  if (error) throw error
}

export async function saveGrade(studentId: string, evaluationId: string, grade: string) {
  const supabase = await createClient()
  if (!grade) {
    await supabase.from('gb_grades')
      .delete().eq('student_id', studentId).eq('evaluation_id', evaluationId)
    return
  }
  const { error } = await supabase.from('gb_grades')
    .upsert({ student_id: studentId, evaluation_id: evaluationId, grade },
      { onConflict: 'student_id,evaluation_id' })
  if (error) throw error
}

export async function saveOverride(studentId: string, etapeId: string, grade: string) {
  const supabase = await createClient()
  if (!grade) {
    await supabase.from('gb_etape_overrides')
      .delete().eq('student_id', studentId).eq('etape_id', etapeId)
    return
  }
  const { error } = await supabase.from('gb_etape_overrides')
    .upsert({ student_id: studentId, etape_id: etapeId, grade },
      { onConflict: 'student_id,etape_id' })
  if (error) throw error
}
