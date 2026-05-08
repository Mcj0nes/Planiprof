'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

function getRentree(year: number): Date {
  const aug27 = new Date(year, 7, 27)
  const dow = aug27.getDay()
  const daysToMonday = dow === 0 ? 1 : dow === 1 ? 0 : 8 - dow
  return new Date(year, 7, 27 + daysToMonday)
}

function mapWeekStart(weekStart: string, sourceRentree: Date, targetRentree: Date): string {
  const [y, m, d] = weekStart.split('-').map(Number)
  const wsDate = new Date(y, m - 1, d)
  const offsetDays = Math.round((wsDate.getTime() - sourceRentree.getTime()) / (1000 * 60 * 60 * 24))
  const t = new Date(targetRentree.getTime() + offsetDays * 24 * 60 * 60 * 1000)
  return `${t.getFullYear()}-${String(t.getMonth() + 1).padStart(2, '0')}-${String(t.getDate()).padStart(2, '0')}`
}

function offsetDateByYears(dateStr: string, years: number): string {
  const [y, m, d] = dateStr.split('-').map(Number)
  return `${y + years}-${String(m).padStart(2, '0')}-${String(d).padStart(2, '0')}`
}

export async function duplicatePlan(sourcePlanId: string, targetYear: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Non authentifié')

  const { data: sourcePlan } = await supabase
    .from('annual_plans')
    .select('*')
    .eq('id', sourcePlanId)
    .eq('user_id', user.id)
    .single()
  if (!sourcePlan) throw new Error('Plan introuvable')

  const sourceStartYear = parseInt(sourcePlan.school_year.split('-')[0])
  const targetStartYear = parseInt(targetYear.split('-')[0])
  const sourceRentree = getRentree(sourceStartYear)
  const targetRentree = getRentree(targetStartYear)
  const yearDiff = targetStartYear - sourceStartYear

  const { data: newPlan } = await supabase
    .from('annual_plans')
    .insert({
      user_id: user.id,
      school_year: targetYear,
      title: sourcePlan.title,
      subject_id: sourcePlan.subject_id,
      grade_level_id: sourcePlan.grade_level_id,
      planning_model: sourcePlan.planning_model,
      period_count: sourcePlan.period_count,
    })
    .select('id')
    .single()
  if (!newPlan) throw new Error('Erreur lors de la création du plan')
  const newPlanId = newPlan.id

  // etape_configs: create for target year if missing
  if (sourcePlan.planning_model === 'par-etape') {
    const [{ data: sourceEtapes }, { data: targetEtapes }] = await Promise.all([
      supabase.from('etape_configs').select('*').eq('user_id', user.id).eq('school_year', sourcePlan.school_year).order('etape_number'),
      supabase.from('etape_configs').select('id').eq('user_id', user.id).eq('school_year', targetYear),
    ])
    if ((targetEtapes ?? []).length === 0) {
      for (const ec of sourceEtapes ?? []) {
        await supabase.from('etape_configs').insert({
          user_id: user.id,
          school_year: targetYear,
          etape_number: ec.etape_number,
          start_date: offsetDateByYears(ec.start_date, yearDiff),
          end_date: offsetDateByYears(ec.end_date, yearDiff),
        })
      }
    }
  }

  // theme_configs: map by position, create if missing
  const themeIdMap: Record<string, string> = {}
  if (sourcePlan.planning_model === 'par-theme') {
    const [{ data: sourceThemes }, { data: targetThemes }] = await Promise.all([
      supabase.from('theme_configs').select('*').eq('user_id', user.id).eq('school_year', sourcePlan.school_year).order('sort_order'),
      supabase.from('theme_configs').select('*').eq('user_id', user.id).eq('school_year', targetYear).order('sort_order'),
    ])
    if ((targetThemes ?? []).length === 0) {
      for (const tc of sourceThemes ?? []) {
        const { data: newTheme } = await supabase.from('theme_configs').insert({
          user_id: user.id,
          school_year: targetYear,
          name: tc.name,
          sort_order: tc.sort_order,
          start_date: offsetDateByYears(tc.start_date, yearDiff),
          end_date: offsetDateByYears(tc.end_date, yearDiff),
        }).select('id').single()
        if (newTheme) themeIdMap[tc.id] = newTheme.id
      }
    } else {
      const src = sourceThemes ?? []
      const tgt = targetThemes ?? []
      for (let i = 0; i < Math.min(src.length, tgt.length); i++) {
        themeIdMap[src[i].id] = tgt[i].id
      }
    }
  }

  // plan_assignments
  const { data: sourceAssignments } = await supabase.from('plan_assignments').select('*').eq('annual_plan_id', sourcePlanId)
  if ((sourceAssignments ?? []).length > 0) {
    await supabase.from('plan_assignments').insert(
      (sourceAssignments ?? []).map((a: any) => ({
        annual_plan_id: newPlanId,
        content_item_id: a.content_item_id,
        month: a.month,
        etape_number: a.etape_number,
        theme_id: a.theme_id ? (themeIdMap[a.theme_id] ?? null) : null,
        week_start: a.week_start ? mapWeekStart(a.week_start, sourceRentree, targetRentree) : null,
      }))
    )
  }

  // week_notes
  const { data: weekNotes } = await supabase.from('week_notes').select('*').eq('annual_plan_id', sourcePlanId)
  if ((weekNotes ?? []).length > 0) {
    await supabase.from('week_notes').insert(
      (weekNotes ?? []).map((n: any) => ({
        annual_plan_id: newPlanId,
        week_start: mapWeekStart(n.week_start, sourceRentree, targetRentree),
        special_activities: n.special_activities,
        reflective_review: n.reflective_review,
      }))
    )
  }

  // day_periods
  const { data: dayPeriods } = await supabase.from('day_periods').select('*').eq('annual_plan_id', sourcePlanId)
  if ((dayPeriods ?? []).length > 0) {
    await supabase.from('day_periods').insert(
      (dayPeriods ?? []).map((p: any) => ({
        annual_plan_id: newPlanId,
        week_start: mapWeekStart(p.week_start, sourceRentree, targetRentree),
        day_of_week: p.day_of_week,
        period_number: p.period_number,
        content_item_id: p.content_item_id,
        is_special_activity: p.is_special_activity,
      }))
    )
  }

  // day_notes
  const { data: dayNotes } = await supabase.from('day_notes').select('*').eq('annual_plan_id', sourcePlanId)
  if ((dayNotes ?? []).length > 0) {
    await supabase.from('day_notes').insert(
      (dayNotes ?? []).map((n: any) => ({
        annual_plan_id: newPlanId,
        week_start: mapWeekStart(n.week_start, sourceRentree, targetRentree),
        day_of_week: n.day_of_week,
        note: n.note,
      }))
    )
  }

  // plan_content_activities
  const { data: pcas } = await supabase.from('plan_content_activities').select('*').eq('plan_id', sourcePlanId).eq('user_id', user.id)
  if ((pcas ?? []).length > 0) {
    await supabase.from('plan_content_activities').insert(
      (pcas ?? []).map((p: any) => ({
        plan_id: newPlanId,
        user_id: user.id,
        content_item_id: p.content_item_id,
        activity_id: p.activity_id,
        template_id: p.template_id,
      }))
    )
  }

  // plan_period_times
  const { data: periodTimes } = await supabase.from('plan_period_times').select('*').eq('annual_plan_id', sourcePlanId)
  if ((periodTimes ?? []).length > 0) {
    await supabase.from('plan_period_times').insert(
      (periodTimes ?? []).map((pt: any) => ({
        annual_plan_id: newPlanId,
        period_number: pt.period_number,
        time_label: pt.time_label,
      }))
    )
  }

  revalidatePath('/dashboard/annual')
  return newPlanId
}

export async function deletePlan(planId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Non authentifié')

  await supabase
    .from('annual_plans')
    .delete()
    .eq('id', planId)
    .eq('user_id', user.id)

  revalidatePath('/dashboard/annual')
}
