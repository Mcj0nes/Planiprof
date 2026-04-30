'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

async function autoImportFromGradebooks(
  supabase: Awaited<ReturnType<typeof createClient>>,
  sessionId: string,
  userId: string,
) {
  const { data: gbBooks } = await supabase.from('grade_books').select('id').eq('user_id', userId)
  const gbIds = (gbBooks ?? []).map((b: any) => b.id)
  if (!gbIds.length) return

  const { data: gbStudents } = await supabase
    .from('gb_students').select('name, sort_order')
    .in('grade_book_id', gbIds).order('sort_order').order('name')
  if (!gbStudents?.length) return

  const { data: existing } = await supabase
    .from('conversation_session_students').select('name').eq('session_id', sessionId)
  const existingNames = new Set((existing ?? []).map((s: any) => s.name.toLowerCase().trim()))

  const { data: lastRow } = await supabase
    .from('conversation_session_students').select('sort_order').eq('session_id', sessionId)
    .order('sort_order', { ascending: false }).limit(1)
  const nextOrder = (lastRow?.[0]?.sort_order ?? 0) + 1

  const seen = new Set<string>()
  const rows = gbStudents
    .filter((s: any) => {
      const k = s.name.toLowerCase().trim()
      if (existingNames.has(k) || seen.has(k)) return false
      seen.add(k)
      return true
    })
    .map((s: any, i: number) => ({ session_id: sessionId, name: s.name, sort_order: nextOrder + i }))

  if (rows.length > 0) await supabase.from('conversation_session_students').insert(rows)
}

export async function loadSession(
  gridId: string,
  sessionNumber = 1,
  etape: number | null = null,
): Promise<{
  sessionId: string
  sessionNumber: number
  totalSessions: number
  etape: number | null
  gridId: string
  gridTitle: string
  criteria: { id: string; label: string; sort_order: number }[]
  levels: { id: number; code: string; label: string; sort_order: number }[]
  students: { id: string; name: string; sort_order: number; comment: string | null }[]
  scores: Record<string, Record<string, number | null>>
} | null> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data: grid } = await supabase
    .from('eval_grids').select('id, title').eq('id', gridId).single()
  if (!grid) return null

  let query = supabase.from('conversation_sessions')
    .select('id').eq('user_id', user.id).eq('grid_id', gridId)
  if (etape !== null) query = query.eq('etape', etape)
  else query = query.is('etape', null)

  const { data: allSessions } = await query.order('created_at', { ascending: true })
  let sessions = allSessions ?? []

  const insertPayload: Record<string, unknown> = { user_id: user.id, grid_id: gridId }
  if (etape !== null) insertPayload.etape = etape

  if (sessions.length === 0) {
    const { data: s } = await supabase
      .from('conversation_sessions').insert(insertPayload).select('id').single()
    if (!s) return null
    await autoImportFromGradebooks(supabase, s.id, user.id)
    sessions = [s]
  }

  const target = Math.max(1, Math.min(sessionNumber, sessions.length + 1))
  if (target > sessions.length) {
    const { data: s } = await supabase
      .from('conversation_sessions').insert(insertPayload).select('id').single()
    if (!s) return null
    await autoImportFromGradebooks(supabase, s.id, user.id)
    sessions = [...sessions, s]
  }

  const sessionId = sessions[target - 1].id

  const [{ data: criteria }, { data: levels }, { data: students }] = await Promise.all([
    supabase.from('eval_grid_criteria')
      .select('id, label, sort_order').eq('grid_id', gridId).order('sort_order'),
    supabase.from('eval_grid_levels')
      .select('id, code, label, sort_order').eq('grid_id', gridId).order('sort_order'),
    supabase.from('conversation_session_students')
      .select('id, name, sort_order, comment').eq('session_id', sessionId).order('sort_order'),
  ])

  const studentIds = (students ?? []).map((s: any) => s.id)
  let scoreRows: { student_id: string; criterion_id: string; level_id: number | null }[] = []
  if (studentIds.length > 0) {
    const { data } = await supabase
      .from('conversation_session_scores')
      .select('student_id, criterion_id, level_id')
      .in('student_id', studentIds)
    scoreRows = (data ?? []) as any[]
  }

  const scores: Record<string, Record<string, number | null>> = {}
  for (const row of scoreRows) {
    if (!scores[row.student_id]) scores[row.student_id] = {}
    scores[row.student_id][row.criterion_id] = row.level_id
  }

  return {
    sessionId,
    sessionNumber: target,
    totalSessions: sessions.length,
    etape,
    gridId,
    gridTitle: grid.title,
    criteria: (criteria ?? []) as any[],
    levels: (levels ?? []) as any[],
    students: (students ?? []) as any[],
    scores,
  }
}

export async function addStudent(sessionId: string, name: string): Promise<void> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return
  const { data: last } = await supabase
    .from('conversation_session_students').select('sort_order').eq('session_id', sessionId)
    .order('sort_order', { ascending: false }).limit(1)
  const nextOrder = (last?.[0]?.sort_order ?? 0) + 1
  await supabase.from('conversation_session_students').insert({ session_id: sessionId, name, sort_order: nextOrder })
}

export async function updateStudentName(studentId: string, name: string): Promise<void> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return
  await supabase.from('conversation_session_students').update({ name }).eq('id', studentId)
}

export async function removeStudent(studentId: string): Promise<void> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return
  await supabase.from('conversation_session_students').delete().eq('id', studentId)
}

export async function syncStudentsFromGradebooks(sessionId: string): Promise<void> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return
  await autoImportFromGradebooks(supabase, sessionId, user.id)
  revalidatePath('/dashboard/evaluation/conversations')
}

export async function setScore(studentId: string, criterionId: string, levelId: number | null): Promise<void> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return
  if (levelId === null) {
    await supabase.from('conversation_session_scores')
      .delete().eq('student_id', studentId).eq('criterion_id', criterionId)
  } else {
    await supabase.from('conversation_session_scores')
      .upsert({ student_id: studentId, criterion_id: criterionId, level_id: levelId })
  }
}

export async function setComment(studentId: string, comment: string): Promise<void> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return
  await supabase.from('conversation_session_students').update({ comment: comment || null }).eq('id', studentId)
}

export async function deleteSession(sessionId: string): Promise<void> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return
  await supabase.from('conversation_sessions').delete().eq('id', sessionId).eq('user_id', user.id)
}

export async function resetAllScores(sessionId: string): Promise<void> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return
  const { data: students } = await supabase
    .from('conversation_session_students').select('id').eq('session_id', sessionId)
  if (students?.length) {
    await supabase.from('conversation_session_scores')
      .delete().in('student_id', students.map((s: any) => s.id))
  }
}

export async function saveJugement(
  gridId: string,
  etape: number | null,
  studentName: string,
  type: 'lecture' | 'oral',
  jugement: string,
): Promise<void> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  let q = supabase.from('conversation_jugements').select('id')
    .eq('user_id', user.id).eq('grid_id', gridId)
    .eq('student_name', studentName).eq('type', type)
  if (etape !== null) q = (q as any).eq('etape', etape)
  else q = (q as any).is('etape', null)
  const { data: existing } = await (q as any).maybeSingle()

  if (existing) {
    await supabase.from('conversation_jugements')
      .update({ jugement: jugement || null }).eq('id', existing.id)
  } else {
    await supabase.from('conversation_jugements')
      .insert({ user_id: user.id, grid_id: gridId, etape, student_name: studentName, type, jugement: jugement || null })
  }
  revalidatePath('/dashboard/gradebook', 'layout')
}

export async function loadAllSessionsForPrint(
  gridId: string,
  etape: number | null,
): Promise<{
  gridTitle: string
  criteria: { id: string; label: string; sort_order: number }[]
  levels: { id: number; code: string; label: string; sort_order: number }[]
  sessions: {
    sessionNumber: number
    students: { name: string; sort_order: number; scores: Record<string, number | null> }[]
  }[]
} | null> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data: grid } = await supabase.from('eval_grids').select('title').eq('id', gridId).single()
  if (!grid) return null

  let q = supabase.from('conversation_sessions')
    .select('id').eq('user_id', user.id).eq('grid_id', gridId)
  if (etape !== null) q = q.eq('etape', etape)
  else q = q.is('etape', null)
  const { data: sessions } = await q.order('created_at', { ascending: true })
  if (!sessions?.length) return { gridTitle: grid.title, criteria: [], levels: [], sessions: [] }

  const [{ data: criteria }, { data: levels }] = await Promise.all([
    supabase.from('eval_grid_criteria').select('id, label, sort_order').eq('grid_id', gridId).order('sort_order'),
    supabase.from('eval_grid_levels').select('id, code, label, sort_order').eq('grid_id', gridId).order('sort_order'),
  ])

  const sessionIds = sessions.map((s: any) => s.id)
  const { data: allStudents } = await supabase
    .from('conversation_session_students').select('id, name, sort_order, session_id')
    .in('session_id', sessionIds).order('sort_order')

  const studentIds = (allStudents ?? []).map((s: any) => s.id)
  let allScores: { student_id: string; criterion_id: string; level_id: number | null }[] = []
  if (studentIds.length > 0) {
    const { data } = await supabase
      .from('conversation_session_scores').select('student_id, criterion_id, level_id').in('student_id', studentIds)
    allScores = (data ?? []) as any[]
  }

  const scoreMap = new Map<string, Record<string, number | null>>()
  for (const row of allScores) {
    if (!scoreMap.has(row.student_id)) scoreMap.set(row.student_id, {})
    scoreMap.get(row.student_id)![row.criterion_id] = row.level_id
  }

  const result = (sessions as any[]).map((session: any, i: number) => {
    const sessionStudents = (allStudents ?? []).filter((s: any) => s.session_id === session.id)
    return {
      sessionNumber: i + 1,
      students: (sessionStudents as any[]).map((s: any) => ({
        name: s.name as string,
        sort_order: s.sort_order as number,
        scores: scoreMap.get(s.id) ?? {},
      })),
    }
  })

  return {
    gridTitle: grid.title,
    criteria: (criteria ?? []) as any[],
    levels: (levels ?? []) as any[],
    sessions: result,
  }
}

export async function loadOverview(
  gridId: string,
  etape: number | null,
): Promise<{
  gridTitle:  string
  sessions:   { id: string; sessionNumber: number }[]
  rows:       { name: string; lectureAvgs: (number | null)[]; oralAvgs: (number | null)[] }[]
  jugements:  Record<string, { lecture: string; oral: string }>
} | null> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data: grid } = await supabase.from('eval_grids').select('title').eq('id', gridId).single()
  if (!grid) return null

  let q = supabase.from('conversation_sessions')
    .select('id').eq('user_id', user.id).eq('grid_id', gridId)
  if (etape !== null) q = q.eq('etape', etape)
  else q = q.is('etape', null)
  const { data: sessions } = await q.order('created_at', { ascending: true })
  if (!sessions?.length) return { gridTitle: grid.title, sessions: [], rows: [], jugements: {} }

  const [{ data: criteria }, { data: levels }] = await Promise.all([
    supabase.from('eval_grid_criteria').select('id, sort_order').eq('grid_id', gridId).order('sort_order'),
    supabase.from('eval_grid_levels').select('id, sort_order').eq('grid_id', gridId),
  ])

  const sortedCrit   = (criteria ?? []).sort((a: any, b: any) => a.sort_order - b.sort_order)
  const lectureCount = Math.max(0, sortedCrit.length - 2)
  const lectureCritIds = new Set(sortedCrit.slice(0, lectureCount).map((c: any) => c.id))
  const oralCritIds    = new Set(sortedCrit.slice(lectureCount).map((c: any) => c.id))
  const levelOrderMap  = new Map((levels ?? []).map((l: any) => [l.id, l.sort_order as number]))

  const sessionIds = sessions.map((s: any) => s.id)
  const { data: allStudents } = await supabase
    .from('conversation_session_students').select('id, name, session_id').in('session_id', sessionIds)

  const studentIds = (allStudents ?? []).map((s: any) => s.id)
  let allScores: { student_id: string; criterion_id: string; level_id: number }[] = []
  if (studentIds.length > 0) {
    const { data } = await supabase
      .from('conversation_session_scores').select('student_id, criterion_id, level_id').in('student_id', studentIds)
    allScores = (data ?? []) as any[]
  }

  const scoreMap = new Map<string, Map<string, number>>()
  for (const row of allScores) {
    if (!scoreMap.has(row.student_id)) scoreMap.set(row.student_id, new Map())
    const order = levelOrderMap.get(row.level_id)
    if (order != null) scoreMap.get(row.student_id)!.set(row.criterion_id, order)
  }

  const sessionIndex = new Map(sessions.map((s: any, i: number) => [s.id, i]))
  const studentData  = new Map<string, { name: string; lectureAvgs: (number | null)[]; oralAvgs: (number | null)[] }>()

  for (const student of (allStudents ?? []) as any[]) {
    const key  = student.name.trim().toLowerCase()
    const sidx = sessionIndex.get(student.session_id)!
    if (!studentData.has(key)) {
      studentData.set(key, {
        name:        student.name.trim(),
        lectureAvgs: new Array(sessions.length).fill(null),
        oralAvgs:    new Array(sessions.length).fill(null),
      })
    }
    const scores = scoreMap.get(student.id) ?? new Map()
    const lVals  = [...lectureCritIds].map(id => scores.get(id) ?? null).filter((v): v is number => v !== null)
    const oVals  = [...oralCritIds].map(id => scores.get(id) ?? null).filter((v): v is number => v !== null)
    const row    = studentData.get(key)!
    if (lVals.length) row.lectureAvgs[sidx] = lVals.reduce((a, b) => a + b, 0) / lVals.length
    if (oVals.length) row.oralAvgs[sidx]    = oVals.reduce((a, b) => a + b, 0) / oVals.length
  }

  let jugQ = supabase.from('conversation_jugements')
    .select('student_name, type, jugement')
    .eq('user_id', user.id).eq('grid_id', gridId)
  if (etape !== null) jugQ = (jugQ as any).eq('etape', etape)
  else jugQ = (jugQ as any).is('etape', null)
  const { data: jugData } = await jugQ

  const jugements: Record<string, { lecture: string; oral: string }> = {}
  for (const j of (jugData ?? []) as any[]) {
    const key = j.student_name.trim().toLowerCase()
    if (!jugements[key]) jugements[key] = { lecture: '', oral: '' }
    jugements[key][j.type as 'lecture' | 'oral'] = j.jugement ?? ''
  }

  return {
    gridTitle:  grid.title,
    sessions:   sessions.map((s: any, i: number) => ({ id: s.id, sessionNumber: i + 1 })),
    rows:       [...studentData.values()].sort((a, b) => a.name.localeCompare(b.name, 'fr')),
    jugements,
  }
}
