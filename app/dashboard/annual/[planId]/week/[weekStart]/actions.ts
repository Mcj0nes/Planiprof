'use server'

import { createClient } from '@/lib/supabase/server'

async function verifyPlan(supabase: Awaited<ReturnType<typeof createClient>>, planId: string, userId: string) {
  const { data } = await supabase.from('annual_plans').select('id').eq('id', planId).eq('user_id', userId).single()
  return !!data
}

export async function assignToPeriod(
  id: string,
  planId: string,
  weekStart: string,
  dayOfWeek: number,
  periodNumber: number,
  contentItemId: number | null,
  isSpecialActivity = false
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Non authentifié')
  if (!await verifyPlan(supabase, planId, user.id)) throw new Error('Plan introuvable')

  await supabase.from('day_periods').insert({
    id,
    annual_plan_id: planId,
    week_start: weekStart,
    day_of_week: dayOfWeek,
    period_number: periodNumber,
    content_item_id: isSpecialActivity ? null : contentItemId,
    is_special_activity: isSpecialActivity,
  })
}

export async function removeFromPeriod(slotId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Non authentifié')

  await supabase.from('day_periods').delete().eq('id', slotId)
}

export async function createWeekSticker(
  id: string,
  planId: string,
  weekStart: string,
  stickerName: string,
  x: number,
  y: number,
  width: number
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Non authentifié')
  if (!await verifyPlan(supabase, planId, user.id)) throw new Error('Plan introuvable')

  await supabase.from('week_stickers').insert({ id, annual_plan_id: planId, week_start: weekStart, sticker_name: stickerName, x, y, width })
}

export async function updateStickerPosition(stickerId: string, x: number, y: number) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Non authentifié')

  await supabase.from('week_stickers').update({ x, y }).eq('id', stickerId)
}

export async function updateStickerWidth(stickerId: string, width: number) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Non authentifié')

  await supabase.from('week_stickers').update({ width }).eq('id', stickerId)
}

export async function deleteWeekSticker(stickerId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Non authentifié')

  await supabase.from('week_stickers').delete().eq('id', stickerId)
}

export async function savePeriodTime(planId: string, periodNumber: number, timeLabel: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Non authentifié')
  if (!await verifyPlan(supabase, planId, user.id)) throw new Error('Plan introuvable')

  await supabase.from('plan_period_times').upsert(
    { annual_plan_id: planId, period_number: periodNumber, time_label: timeLabel },
    { onConflict: 'annual_plan_id,period_number' }
  )
}

export async function addWeekActivity(
  id: string,
  planId: string,
  weekStart: string,
  activityId: string | null,
  templateId: string | null,
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Non authentifié')
  if (!await verifyPlan(supabase, planId, user.id)) throw new Error('Plan introuvable')
  await supabase.from('week_activities').insert({
    id, annual_plan_id: planId, week_start: weekStart,
    activity_id: activityId, template_id: templateId,
  })
}

export async function removeWeekActivity(waId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Non authentifié')
  await supabase.from('week_activities').delete().eq('id', waId)
}

export async function saveWeekendNote(
  planId: string,
  weekStart: string,
  dayOfWeek: 6 | 7,
  value: string
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Non authentifié')
  if (!await verifyPlan(supabase, planId, user.id)) throw new Error('Plan introuvable')

  await supabase.from('day_notes').upsert(
    { annual_plan_id: planId, week_start: weekStart, day_of_week: dayOfWeek, note: value },
    { onConflict: 'annual_plan_id,week_start,day_of_week' }
  )
}


export async function updatePeriodCount(planId: string, count: number) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Non authentifié')
  await supabase.from('annual_plans')
    .update({ period_count: Math.max(1, Math.min(12, count)) })
    .eq('id', planId).eq('user_id', user.id)
}
