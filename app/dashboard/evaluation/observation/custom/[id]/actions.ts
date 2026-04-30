'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export type Criterion = { key: string; label: string; description: string }

export type Definition = {
  id: string
  title: string
  subject_id: number | null
  grade_level_id: number | null
  criteria: Criterion[]
}

function revalidate(definitionId: string) {
  revalidatePath(`/dashboard/evaluation/observation/custom/${definitionId}`)
}

export async function loadDefinition(id: string): Promise<Definition | null> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const { data } = await supabase
    .from('custom_obs_definitions')
    .select('id, title, subject_id, grade_level_id, criteria')
    .eq('id', id)
    .eq('user_id', user.id)
    .single()

  return data as Definition | null
}

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
    .from('custom_obs_students').select('name').eq('session_id', sessionId)
  const existingNames = new Set((existing ?? []).map((s: any) => s.name.toLowerCase().trim()))

  const { data: lastRow } = await supabase
    .from('custom_obs_students').select('sort_order').eq('session_id', sessionId)
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

  if (rows.length > 0) await supabase.from('custom_obs_students').insert(rows)
}

export async function loadGrid(
  definitionId: string,
  gridNumber = 1,
  etape: number | null = null,
): Promise<{
  definition: Definition
  sessionId: string
  gridNumber: number
  totalGrids: number
  etape: number | null
  students: { id: string; name: string; sort_order: number }[]
  scores: Record<string, Record<string, number>>
} | null> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  const definition = await loadDefinition(definitionId)
  if (!definition) return null

  let query = supabase.from('custom_obs_sessions').select('id')
    .eq('definition_id', definitionId).eq('user_id', user.id)
  if (etape !== null) query = query.eq('etape', etape)
  else query = query.is('etape', null)

  const { data: allSessions } = await query.order('created_at', { ascending: true })
  let sessions = allSessions ?? []

  const insertPayload: Record<string, unknown> = { definition_id: definitionId, user_id: user.id }
  if (etape !== null) insertPayload.etape = etape

  if (sessions.length === 0) {
    const { data: s } = await supabase.from('custom_obs_sessions').insert(insertPayload).select('id').single()
    if (!s) return null
    await autoImportFromGradebooks(supabase, s.id, user.id)
    sessions = [s]
  }

  const target = Math.max(1, Math.min(gridNumber, sessions.length + 1))
  if (target > sessions.length) {
    const { data: s } = await supabase.from('custom_obs_sessions').insert(insertPayload).select('id').single()
    if (!s) return null
    await autoImportFromGradebooks(supabase, s.id, user.id)
    sessions = [...sessions, s]
  }

  const sessionId = sessions[target - 1].id
  const totalGrids = sessions.length

  const { data: students } = await supabase
    .from('custom_obs_students').select('id, name, sort_order')
    .eq('session_id', sessionId).order('sort_order')

  const studentIds = (students ?? []).map(s => s.id)
  let scoreRows: { student_id: string; criterion_key: string; score: number }[] = []
  if (studentIds.length > 0) {
    const { data } = await supabase
      .from('custom_obs_scores').select('student_id, criterion_key, score').in('student_id', studentIds)
    scoreRows = data ?? []
  }

  const scoreMap: Record<string, Record<string, number>> = {}
  for (const s of scoreRows) {
    if (!scoreMap[s.student_id]) scoreMap[s.student_id] = {}
    scoreMap[s.student_id][s.criterion_key] = s.score
  }

  return { definition, sessionId, gridNumber: target, totalGrids, etape, students: students ?? [], scores: scoreMap }
}

export async function loadEtapeOverview(
  definitionId: string,
  etape: number,
): Promise<{
  grids: { id: string; gridNumber: number }[]
  rows: { name: string; scores: (number | null)[]; jugement: number | null }[]
}> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { grids: [], rows: [] }

  const { data: allSessions } = await supabase
    .from('custom_obs_sessions').select('id')
    .eq('definition_id', definitionId).eq('user_id', user.id).eq('etape', etape)
    .order('created_at', { ascending: true })
  if (!allSessions?.length) return { grids: [], rows: [] }

  const sessionIds = allSessions.map(s => s.id)

  const [{ data: allStudents }, { data: jugData }] = await Promise.all([
    supabase.from('custom_obs_students').select('id, name, sort_order, session_id')
      .in('session_id', sessionIds).order('sort_order'),
    supabase.from('custom_obs_jugements').select('student_name, score')
      .eq('definition_id', definitionId).eq('user_id', user.id).eq('etape', etape),
  ])

  const studentIds = (allStudents ?? []).map(s => s.id)
  let globalScores: { student_id: string; score: number }[] = []
  if (studentIds.length > 0) {
    const { data } = await supabase
      .from('custom_obs_scores').select('student_id, score')
      .in('student_id', studentIds).eq('criterion_key', 'global')
    globalScores = (data ?? []) as any[]
  }

  const scoreById = new Map(globalScores.map(s => [s.student_id, s.score]))
  const jugByName = new Map((jugData ?? []).map((j: any) => [j.student_name as string, j.score as number]))

  const gridMaps = sessionIds.map(sessionId => {
    const m = new Map<string, number | null>()
    for (const s of (allStudents ?? []).filter(s => s.session_id === sessionId)) {
      m.set(s.name, scoreById.get(s.id) ?? null)
    }
    return m
  })

  const allNames: string[] = []
  const seen = new Set<string>()
  for (const m of gridMaps) {
    for (const name of m.keys()) {
      if (!seen.has(name)) { seen.add(name); allNames.push(name) }
    }
  }

  return {
    grids: allSessions.map((s, i) => ({ id: s.id, gridNumber: i + 1 })),
    rows: allNames.map(name => ({
      name,
      scores: gridMaps.map(m => m.has(name) ? (m.get(name) ?? null) : null),
      jugement: jugByName.get(name) ?? null,
    })),
  }
}

export async function loadAllGridsForPrint(
  definitionId: string,
  etape: number,
  criteria: Criterion[],
): Promise<{
  grids: { gridNumber: number; students: { name: string; scores: Record<string, number | null> }[] }[]
}> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { grids: [] }

  const { data: allSessions } = await supabase
    .from('custom_obs_sessions').select('id')
    .eq('definition_id', definitionId).eq('user_id', user.id).eq('etape', etape)
    .order('created_at', { ascending: true })
  if (!allSessions?.length) return { grids: [] }

  const sessionIds = allSessions.map(s => s.id)
  const { data: allStudents } = await supabase
    .from('custom_obs_students').select('id, name, sort_order, session_id')
    .in('session_id', sessionIds).order('sort_order')

  const studentIds = (allStudents ?? []).map(s => s.id)
  let allScores: { student_id: string; criterion_key: string; score: number }[] = []
  if (studentIds.length > 0) {
    const { data } = await supabase
      .from('custom_obs_scores').select('student_id, criterion_key, score').in('student_id', studentIds)
    allScores = (data ?? []) as any[]
  }

  const scoreMap = new Map<string, Record<string, number>>()
  for (const s of allScores) {
    if (!scoreMap.has(s.student_id)) scoreMap.set(s.student_id, {})
    scoreMap.get(s.student_id)![s.criterion_key] = s.score
  }

  return {
    grids: allSessions.map((sess, i) => {
      const students = (allStudents ?? []).filter(s => s.session_id === sess.id)
      return {
        gridNumber: i + 1,
        students: students.map(s => ({ name: s.name, scores: scoreMap.get(s.id) ?? {} })),
      }
    }),
  }
}

export async function setEtapeJugement(
  definitionId: string,
  etape: number,
  studentName: string,
  score: number | null,
): Promise<void> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  if (score === null) {
    await supabase.from('custom_obs_jugements').delete()
      .eq('definition_id', definitionId).eq('user_id', user.id).eq('etape', etape).eq('student_name', studentName)
  } else {
    await supabase.from('custom_obs_jugements')
      .upsert(
        { definition_id: definitionId, user_id: user.id, etape, student_name: studentName, score },
        { onConflict: 'definition_id,user_id,etape,student_name' },
      )
  }
}

export async function addStudent(definitionId: string, sessionId: string, name: string): Promise<void> {
  const supabase = await createClient()
  const { data: existing } = await supabase
    .from('custom_obs_students').select('sort_order').eq('session_id', sessionId)
    .order('sort_order', { ascending: false }).limit(1)
  const nextOrder = ((existing?.[0]?.sort_order) ?? 0) + 1
  await supabase.from('custom_obs_students').insert({ session_id: sessionId, name, sort_order: nextOrder })
  revalidate(definitionId)
}

export async function updateStudentName(studentId: string, name: string): Promise<void> {
  const supabase = await createClient()
  await supabase.from('custom_obs_students').update({ name }).eq('id', studentId)
}

export async function removeStudent(definitionId: string, studentId: string): Promise<void> {
  const supabase = await createClient()
  await supabase.from('custom_obs_students').delete().eq('id', studentId)
  revalidate(definitionId)
}

export async function setScore(studentId: string, criterionKey: string, score: number | null): Promise<void> {
  const supabase = await createClient()
  if (score === null) {
    await supabase.from('custom_obs_scores').delete().eq('student_id', studentId).eq('criterion_key', criterionKey)
  } else {
    await supabase.from('custom_obs_scores').upsert({ student_id: studentId, criterion_key: criterionKey, score })
  }
}

export async function resetAllScores(definitionId: string, sessionId: string): Promise<void> {
  const supabase = await createClient()
  const { data: students } = await supabase.from('custom_obs_students').select('id').eq('session_id', sessionId)
  if (students?.length) {
    await supabase.from('custom_obs_scores').delete().in('student_id', students.map(s => s.id))
  }
  revalidate(definitionId)
}

export async function deleteSession(definitionId: string, sessionId: string): Promise<void> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return
  await supabase.from('custom_obs_sessions').delete().eq('id', sessionId).eq('user_id', user.id)
  revalidate(definitionId)
}

export async function deleteDefinition(definitionId: string): Promise<void> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return
  await supabase.from('custom_obs_definitions').delete().eq('id', definitionId).eq('user_id', user.id)
}

export async function syncStudentsFromGradebooks(definitionId: string, sessionId: string): Promise<void> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return
  await autoImportFromGradebooks(supabase, sessionId, user.id)
  revalidate(definitionId)
}
