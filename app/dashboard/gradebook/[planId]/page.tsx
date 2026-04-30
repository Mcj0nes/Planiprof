import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import GradebookClient from './GradebookClient'

export default async function GradebookPage({ params }: { params: Promise<{ planId: string }> }) {
  const { planId } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: plan } = await supabase
    .from('annual_plans')
    .select('id, school_year, title, subject_id, subjects(name_fr, color, slug), grade_levels(label_fr, grade)')
    .eq('id', planId).eq('user_id', user.id).single()

  if (!plan) redirect('/dashboard/gradebook')

  // Ensure grade book exists (idempotent)
  await supabase.from('grade_books')
    .upsert({ annual_plan_id: planId, user_id: user.id },
      { onConflict: 'annual_plan_id', ignoreDuplicates: true })

  const { data: gradeBook } = await supabase
    .from('grade_books').select('id').eq('annual_plan_id', planId).single()

  if (!gradeBook) redirect('/dashboard/gradebook')

  // Seed default étapes if none exist
  const { data: existingEtapes } = await supabase
    .from('gb_etapes').select('id').eq('grade_book_id', gradeBook.id)

  if (!existingEtapes?.length) {
    await supabase.from('gb_etapes').insert([
      { grade_book_id: gradeBook.id, name: 'Étape 1', weight: 20, sort_order: 1 },
      { grade_book_id: gradeBook.id, name: 'Étape 2', weight: 30, sort_order: 2 },
      { grade_book_id: gradeBook.id, name: 'Étape 3', weight: 50, sort_order: 3 },
    ])
  }

  // Step 1: Remove duplicate students in this gradebook (keep first by sort_order)
  const { data: allMyStudents } = await supabase
    .from('gb_students').select('id, name, sort_order')
    .eq('grade_book_id', gradeBook.id).order('sort_order').order('id')
  if (allMyStudents?.length) {
    const seenNames = new Set<string>()
    const dupIds: string[] = []
    for (const s of allMyStudents as any[]) {
      const k = s.name.trim().toLowerCase()
      if (seenNames.has(k)) dupIds.push(s.id)
      else seenNames.add(k)
    }
    if (dupIds.length > 0) await supabase.from('gb_students').delete().in('id', dupIds)
  }

  // Step 2: Sync missing students from sibling gradebooks (same grade level + school year)
  const { data: currentPlan } = await supabase
    .from('annual_plans').select('grade_level_id, school_year').eq('id', planId).single()

  if (currentPlan) {
    const { data: siblingPlans } = await supabase
      .from('annual_plans').select('id')
      .eq('user_id', user.id)
      .eq('grade_level_id', currentPlan.grade_level_id)
      .eq('school_year', currentPlan.school_year)
      .neq('id', planId)

    if (siblingPlans?.length) {
      const { data: siblingBooks } = await supabase
        .from('grade_books').select('id')
        .in('annual_plan_id', siblingPlans.map((p: any) => p.id))

      if (siblingBooks?.length) {
        const { data: siblingStudents } = await supabase
          .from('gb_students').select('name')
          .in('grade_book_id', siblingBooks.map((b: any) => b.id))

        if (siblingStudents?.length) {
          // Re-read current list after dedup
          const { data: freshMine } = await supabase
            .from('gb_students').select('name, sort_order').eq('grade_book_id', gradeBook.id)
          const myNames = new Set((freshMine ?? []).map((s: any) => s.name.trim().toLowerCase()))
          const maxOrder = Math.max(-1, ...(freshMine ?? []).map((s: any) => s.sort_order ?? 0))

          const seen = new Set<string>()
          const toInsert = (siblingStudents as any[])
            .filter(s => {
              const k = s.name.trim().toLowerCase()
              if (myNames.has(k) || seen.has(k)) return false
              seen.add(k)
              return true
            })
            .map((s, i) => ({
              grade_book_id: gradeBook.id,
              name: s.name.trim(),
              sort_order: maxOrder + 1 + i,
            }))

          if (toInsert.length > 0) await supabase.from('gb_students').insert(toInsert)
        }
      }
    }
  }

  const [studentsRes, etapesRes] = await Promise.all([
    supabase.from('gb_students').select('*').eq('grade_book_id', gradeBook.id)
      .order('sort_order').order('name'),
    supabase.from('gb_etapes').select('*').eq('grade_book_id', gradeBook.id).order('sort_order'),
  ])

  const students = studentsRes.data ?? []
  const etapes = etapesRes.data ?? []
  const etapeIds = etapes.map(e => e.id)
  const studentIds = students.map(s => s.id)

  const [evaluationsRes, gradesRes, overridesRes, obsJugRes, convJugRes] = await Promise.all([
    etapeIds.length
      ? supabase.from('gb_evaluations').select('id, etape_id, name, weight, grading_type, sort_order, link_id')
          .in('etape_id', etapeIds).order('sort_order')
      : { data: [] },
    studentIds.length
      ? supabase.from('gb_grades').select('student_id, evaluation_id, grade')
          .in('student_id', studentIds)
      : { data: [] },
    studentIds.length
      ? supabase.from('gb_etape_overrides').select('student_id, etape_id, grade')
          .in('student_id', studentIds)
      : { data: [] },
    supabase.from('observation_jugements')
      .select('grid_type, student_name, etape, score')
      .eq('user_id', user.id),
    supabase.from('conversation_jugements')
      .select('student_name, etape, type, jugement')
      .eq('user_id', user.id)
      .not('etape', 'is', null),
  ])

  const GRID_TYPE_GRADES: Record<string, number[]> = {
    'Causeries':                [5, 6],
    'Exposés 1er cycle':        [1, 2],
    'Exposés 2e cycle':         [3, 4],
    'Exposés':                  [5, 6],
    'Arts plastiques 2e cycle': [3, 4],
    'Arts plastiques 3e cycle': [5, 6],
    'Sciences 2e cycle':        [3, 4],
    'Sciences 3e cycle':        [5, 6],
    'Univers social 2e cycle':  [3, 4],
    'Univers social 3e cycle':  [5, 6],
  }

  const GRID_TYPE_SUBJECT: Record<string, string> = {
    'Causeries':                'maths',
    'Exposés':                  'francais',
    'Exposés 1er cycle':        'francais',
    'Exposés 2e cycle':         'francais',
    'Arts plastiques 2e cycle': 'arts-plastiques',
    'Arts plastiques 3e cycle': 'arts-plastiques',
    'Sciences 2e cycle':        'sciences',
    'Sciences 3e cycle':        'sciences',
    'Univers social 2e cycle':  'univers-social',
    'Univers social 3e cycle':  'univers-social',
  }

  const subjectSlug = (plan as any).subjects?.slug ?? null
  const gradeNumber: number | null = (plan as any).grade_levels?.grade ?? null

  const observationJugements: Record<string, Record<string, Record<number, number>>> = {}
  for (const row of (obsJugRes.data ?? []) as any[]) {
    const mappedSubject = GRID_TYPE_SUBJECT[row.grid_type]
    if (subjectSlug && mappedSubject && mappedSubject !== subjectSlug) continue
    const mappedGrades = GRID_TYPE_GRADES[row.grid_type]
    if (gradeNumber && mappedGrades && !mappedGrades.includes(gradeNumber)) continue
    if (!observationJugements[row.grid_type]) observationJugements[row.grid_type] = {}
    if (!observationJugements[row.grid_type][row.student_name]) observationJugements[row.grid_type][row.student_name] = {}
    observationJugements[row.grid_type][row.student_name][row.etape] = row.score
  }
  const observationTypes = Object.keys(observationJugements).sort()

  const showConversations = !subjectSlug || subjectSlug === 'francais'
  const convJugements: Record<string, Record<number, { lecture: string; oral: string }>> = {}
  if (showConversations) {
    for (const row of (convJugRes.data ?? []) as any[]) {
      const key = row.student_name.trim().toLowerCase()
      if (!convJugements[key]) convJugements[key] = {}
      if (!convJugements[key][row.etape]) convJugements[key][row.etape] = { lecture: '', oral: '' }
      convJugements[key][row.etape][row.type as 'lecture' | 'oral'] = row.jugement ?? ''
    }
  }

  const p = plan as any

  return (
    <main className="min-h-screen bg-gray-50 flex flex-col">
      <nav className="px-6 py-4 flex items-center gap-3" style={{ backgroundColor: 'var(--color-nav)' }}>
        <Link href="/dashboard/gradebook" className="text-white/70 hover:text-white text-sm">← Carnet de notes</Link>
        <span className="text-white/40">/</span>
        <h1 className="text-lg font-bold text-white">
          {p.subjects?.name_fr ?? 'Toutes les matières'} · {p.grade_levels?.label_fr} · {plan.school_year}
        </h1>
      </nav>

      <div className="flex-1 p-6">
        <GradebookClient
          planId={planId}
          gradeBookId={gradeBook.id}
          initialStudents={students}
          initialEtapes={etapes}
          initialEvaluations={evaluationsRes.data ?? []}
          initialGrades={gradesRes.data ?? []}
          initialOverrides={overridesRes.data ?? []}
          observationTypes={observationTypes}
          observationJugements={observationJugements}
          convJugements={convJugements}
        />
      </div>
    </main>
  )
}
