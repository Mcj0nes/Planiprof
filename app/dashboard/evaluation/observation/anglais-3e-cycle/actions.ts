'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

const PATH = '/dashboard/evaluation/observation/anglais-3e-cycle'

async function autoImportFromGradebooks(
  supabase: Awaited<ReturnType<typeof createClient>>,
  gridId: string,
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
    .from('anglais3_obs_students').select('name').eq('grid_id', gridId)
  const existingNames = new Set((existing ?? []).map((s: any) => s.name.toLowerCase().trim()))

  const { data: lastRow } = await supabase
    .from('anglais3_obs_students').select('sort_order').eq('grid_id', gridId)
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
    .map((s: any, i: number) => ({ grid_id: gridId, name: s.name, sort_order: nextOrder + i }))

  if (rows.length > 0) await supabase.from('anglais3_obs_students').insert(rows)
}

export async function loadGrid(gridNumber = 1, etape: number | null = null): Promise<{
  gridId: string
  gridNumber: number
  totalGrids: number
  etape: number | null
  students: { id: string; name: string; sort_order: number }[]
  scores: Record<string, Record<string, number>>
} | null> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return null

  let query = supabase.from('anglais3_obs_grids').select('id').eq('user_id', user.id)
  if (etape !== null) query = query.eq('etape', etape)
  else query = query.is('etape', null)

  const { data: allGrids } = await query.order('created_at', { ascending: true })
  let grids = allGrids ?? []

  const insertPayload: Record<string, unknown> = { user_id: user.id }
  if (etape !== null) insertPayload.etape = etape

  if (grids.length === 0) {
    const { data: g } = await supabase.from('anglais3_obs_grids').insert(insertPayload).select('id').single()
    if (!g) return null
    await autoImportFromGradebooks(supabase, g.id, user.id)
    grids = [g]
  }

  const target = Math.max(1, Math.min(gridNumber, grids.length + 1))
  if (target > grids.length) {
    const { data: g } = await supabase.from('anglais3_obs_grids').insert(insertPayload).select('id').single()
    if (!g) return null
    await autoImportFromGradebooks(supabase, g.id, user.id)
    grids = [...grids, g]
  }

  const gridId = grids[target - 1].id
  const totalGrids = grids.length

  const { data: students } = await supabase
    .from('anglais3_obs_students').select('id, name, sort_order')
    .eq('grid_id', gridId).order('sort_order')

  const studentIds = (students ?? []).map(s => s.id)
  let scoreRows: { student_id: string; criterion: string; score: number }[] = []
  if (studentIds.length > 0) {
    const { data } = await supabase
      .from('anglais3_obs_scores').select('student_id, criterion, score').in('student_id', studentIds)
    scoreRows = data ?? []
  }

  const scoreMap: Record<string, Record<string, number>> = {}
  for (const s of scoreRows) {
    if (!scoreMap[s.student_id]) scoreMap[s.student_id] = {}
    scoreMap[s.student_id][s.criterion] = s.score
  }

  return { gridId, gridNumber: target, totalGrids, etape, students: students ?? [], scores: scoreMap }
}

export async function loadEtapeOverview(etape: number): Promise<{
  grids: { id: string; gridNumber: number }[]
  rows: { name: string; scores: (number | null)[]; jugement: number | null }[]
}> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { grids: [], rows: [] }

  const { data: allGrids } = await supabase
    .from('anglais3_obs_grids').select('id')
    .eq('user_id', user.id).eq('etape', etape)
    .order('created_at', { ascending: true })
  if (!allGrids?.length) return { grids: [], rows: [] }

  const gridIds = allGrids.map(g => g.id)

  const [{ data: allStudents }, { data: jugData }] = await Promise.all([
    supabase.from('anglais3_obs_students').select('id, name, sort_order, grid_id')
      .in('grid_id', gridIds).order('sort_order'),
    supabase.from('observation_jugements').select('student_name, score')
      .eq('user_id', user.id).eq('grid_type', 'Anglais langue seconde 3e cycle').eq('etape', etape),
  ])

  const studentIds = (allStudents ?? []).map(s => s.id)
  let globalScores: { student_id: string; score: number }[] = []
  if (studentIds.length > 0) {
    const { data } = await supabase
      .from('anglais3_obs_scores').select('student_id, score')
      .in('student_id', studentIds).eq('criterion', 'global')
    globalScores = (data ?? []) as any[]
  }

  const scoreById = new Map(globalScores.map(s => [s.student_id, s.score]))
  const jugByName = new Map((jugData ?? []).map((j: any) => [j.student_name as string, j.score as number]))

  const gridMaps = gridIds.map(gridId => {
    const m = new Map<string, number | null>()
    for (const s of (allStudents ?? []).filter(s => s.grid_id === gridId)) {
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
    grids: allGrids.map((g, i) => ({ id: g.id, gridNumber: i + 1 })),
    rows: allNames.map(name => ({
      name,
      scores: gridMaps.map(m => m.has(name) ? (m.get(name) ?? null) : null),
      jugement: jugByName.get(name) ?? null,
    })),
  }
}

export async function loadAllGridsForPrint(etape: number): Promise<{
  grids: { gridNumber: number; students: { name: string; scores: Record<string, number | null> }[] }[]
}> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { grids: [] }

  const { data: allGrids } = await supabase
    .from('anglais3_obs_grids').select('id')
    .eq('user_id', user.id).eq('etape', etape)
    .order('created_at', { ascending: true })
  if (!allGrids?.length) return { grids: [] }

  const gridIds = allGrids.map(g => g.id)
  const { data: allStudents } = await supabase
    .from('anglais3_obs_students').select('id, name, sort_order, grid_id')
    .in('grid_id', gridIds).order('sort_order')

  const studentIds = (allStudents ?? []).map(s => s.id)
  let allScores: { student_id: string; criterion: string; score: number }[] = []
  if (studentIds.length > 0) {
    const { data } = await supabase
      .from('anglais3_obs_scores').select('student_id, criterion, score').in('student_id', studentIds)
    allScores = (data ?? []) as any[]
  }

  const scoreMap = new Map<string, Record<string, number>>()
  for (const s of allScores) {
    if (!scoreMap.has(s.student_id)) scoreMap.set(s.student_id, {})
    scoreMap.get(s.student_id)![s.criterion] = s.score
  }

  return {
    grids: allGrids.map((g, i) => {
      const students = (allStudents ?? []).filter(s => s.grid_id === g.id)
      return {
        gridNumber: i + 1,
        students: students.map(s => ({ name: s.name, scores: scoreMap.get(s.id) ?? {} })),
      }
    }),
  }
}

export async function setEtapeJugement(etape: number, studentName: string, score: number | null): Promise<void> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return

  if (score === null) {
    await supabase.from('observation_jugements').delete()
      .eq('user_id', user.id).eq('grid_type', 'Anglais langue seconde 3e cycle').eq('etape', etape).eq('student_name', studentName)
  } else {
    await supabase.from('observation_jugements')
      .upsert(
        { user_id: user.id, grid_type: 'Anglais langue seconde 3e cycle', etape, student_name: studentName, score },
        { onConflict: 'user_id,grid_type,etape,student_name' }
      )
  }
}

export async function addStudent(gridId: string, name: string): Promise<void> {
  const supabase = await createClient()
  const { data: existing } = await supabase
    .from('anglais3_obs_students').select('sort_order').eq('grid_id', gridId)
    .order('sort_order', { ascending: false }).limit(1)
  const nextOrder = ((existing?.[0]?.sort_order) ?? 0) + 1
  await supabase.from('anglais3_obs_students').insert({ grid_id: gridId, name, sort_order: nextOrder })
  revalidatePath(PATH)
}

export async function updateStudentName(studentId: string, name: string): Promise<void> {
  const supabase = await createClient()
  await supabase.from('anglais3_obs_students').update({ name }).eq('id', studentId)
}

export async function removeStudent(studentId: string): Promise<void> {
  const supabase = await createClient()
  await supabase.from('anglais3_obs_students').delete().eq('id', studentId)
  revalidatePath(PATH)
}

export async function setScore(studentId: string, criterion: string, score: number | null): Promise<void> {
  const supabase = await createClient()
  if (score === null) {
    await supabase.from('anglais3_obs_scores').delete().eq('student_id', studentId).eq('criterion', criterion)
  } else {
    await supabase.from('anglais3_obs_scores').upsert({ student_id: studentId, criterion, score })
  }
}

export async function resetAllScores(gridId: string): Promise<void> {
  const supabase = await createClient()
  const { data: students } = await supabase.from('anglais3_obs_students').select('id').eq('grid_id', gridId)
  if (students?.length) {
    await supabase.from('anglais3_obs_scores').delete().in('student_id', students.map(s => s.id))
  }
  revalidatePath(PATH)
}

export async function deleteGrid(gridId: string): Promise<void> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return
  await supabase.from('anglais3_obs_grids').delete().eq('id', gridId).eq('user_id', user.id)
  revalidatePath(PATH)
}

export async function syncStudentsFromGradebooks(gridId: string): Promise<void> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return
  const { data: grid } = await supabase.from('anglais3_obs_grids').select('id').eq('id', gridId).eq('user_id', user.id).single()
  if (!grid) return
  await autoImportFromGradebooks(supabase, gridId, user.id)
  revalidatePath(PATH)
}
