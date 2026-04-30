'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

async function assertAccess(planId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Non authentifié')
  const { data: plan } = await supabase
    .from('annual_plans').select('id').eq('id', planId).eq('user_id', user.id).single()
  if (!plan) throw new Error('Accès refusé')
  return { supabase, userId: user.id }
}

export async function ensureAssessment(
  planId: string,
  linkId: string,
  studentId: string
): Promise<string> {
  const { supabase } = await assertAccess(planId)
  await supabase.from('plan_eval_assessments')
    .upsert({ link_id: linkId, student_id: studentId, comment: '' }, { onConflict: 'link_id,student_id', ignoreDuplicates: true })
  const { data } = await supabase
    .from('plan_eval_assessments')
    .select('id')
    .eq('link_id', linkId)
    .eq('student_id', studentId)
    .single()
  if (!data) throw new Error('Impossible de créer l\'évaluation')
  return data.id
}

export async function saveMark(
  planId: string,
  assessmentId: string,
  criterionId: string,
  levelId: number | null
): Promise<void> {
  const { supabase } = await assertAccess(planId)
  if (levelId === null) {
    await supabase.from('plan_eval_marks')
      .delete()
      .eq('assessment_id', assessmentId)
      .eq('criterion_id', criterionId)
  } else {
    await supabase.from('plan_eval_marks')
      .upsert({ assessment_id: assessmentId, criterion_id: criterionId, level_id: levelId })
  }
  await supabase.from('plan_eval_assessments')
    .update({ updated_at: new Date().toISOString() })
    .eq('id', assessmentId)
}

export async function saveComment(
  planId: string,
  assessmentId: string,
  comment: string
): Promise<void> {
  const { supabase } = await assertAccess(planId)
  await supabase.from('plan_eval_assessments')
    .update({ comment, updated_at: new Date().toISOString() })
    .eq('id', assessmentId)
}

export async function saveOverallResult(
  planId: string,
  assessmentId: string,
  result: string | null
): Promise<void> {
  const { supabase } = await assertAccess(planId)

  await supabase.from('plan_eval_assessments')
    .update({ overall_result: result, updated_at: new Date().toISOString() })
    .eq('id', assessmentId)

  // Sync to gb_grades if a linked gb_evaluation exists for this assessment
  const { data: assessment } = await supabase
    .from('plan_eval_assessments').select('link_id, student_id').eq('id', assessmentId).single()

  if (assessment) {
    const { data: gbEval } = await supabase
      .from('gb_evaluations').select('id').eq('link_id', assessment.link_id).single()

    if (gbEval) {
      if (result) {
        await supabase.from('gb_grades').upsert(
          { student_id: assessment.student_id, evaluation_id: gbEval.id, grade: result },
          { onConflict: 'student_id,evaluation_id' }
        )
      } else {
        await supabase.from('gb_grades')
          .delete().eq('student_id', assessment.student_id).eq('evaluation_id', gbEval.id)
      }
      revalidatePath(`/dashboard/gradebook/${planId}`)
    }
  }
}
