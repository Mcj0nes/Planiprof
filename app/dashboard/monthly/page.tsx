import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import UnplacedBadge from './UnplacedBadge'

const SCHOOL_MONTHS = [
  { month: 8,  label: 'Août',      bg: '#FFF7ED', text: '#C2410C' },
  { month: 9,  label: 'Septembre', bg: '#FEF3C7', text: '#92400E' },
  { month: 10, label: 'Octobre',   bg: '#FFEDD5', text: '#9A3412' },
  { month: 11, label: 'Novembre',  bg: '#EDE9FE', text: '#5B21B6' },
  { month: 12, label: 'Décembre',  bg: '#DBEAFE', text: '#1E40AF' },
  { month: 1,  label: 'Janvier',   bg: '#E0F2FE', text: '#075985' },
  { month: 2,  label: 'Février',   bg: '#FCE7F3', text: '#9D174D' },
  { month: 3,  label: 'Mars',      bg: '#D1FAE5', text: '#065F46' },
  { month: 4,  label: 'Avril',     bg: '#CCFBF1', text: '#134E4A' },
  { month: 5,  label: 'Mai',       bg: '#ECFCCB', text: '#365314' },
  { month: 6,  label: 'Juin',      bg: '#FEF9C3', text: '#713F12' },
]

type UnplacedGroup = {
  id: number
  name: string
  color: string | null
  items: { id: number; name_fr: string }[]
}

function computeUnplacedGroups(
  plan: any,
  allItems: any[],
  allAssignments: any[]
): UnplacedGroup[] {
  const assignedIds = new Set(
    allAssignments
      .filter((a: any) => a.annual_plan_id === plan.id)
      .map((a: any) => a.content_item_id)
  )
  const isMultiSubject = !plan.subject_id
  const planItems = allItems.filter((i: any) =>
    i.grade_level_id === plan.grade_level_id &&
    (isMultiSubject || i.competencies?.subject_id === plan.subject_id)
  )
  const unplaced = planItems.filter((i: any) => !assignedIds.has(i.id))

  const map = new Map<number, UnplacedGroup>()
  for (const item of unplaced) {
    const groupId = isMultiSubject
      ? (item.competencies?.subjects?.id ?? -1)
      : item.competency_id
    const groupName = isMultiSubject
      ? (item.competencies?.subjects?.name_fr ?? 'Autre')
      : (item.competencies?.name_fr ?? 'Autre')
    const groupColor = isMultiSubject
      ? (item.competencies?.subjects?.color ?? null)
      : (item.competencies?.color ?? null)
    if (!map.has(groupId)) map.set(groupId, { id: groupId, name: groupName, color: groupColor, items: [] })
    map.get(groupId)!.items.push({ id: item.id, name_fr: item.name_fr })
  }
  return [...map.values()]
}

export default async function MonthlyPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: plans } = await supabase
    .from('annual_plans')
    .select('id, school_year, title, subject_id, grade_level_id, subjects(name_fr, color), grade_levels(label_fr)')
    .eq('user_id', user.id)
    .order('school_year', { ascending: false })

  const planIds = (plans ?? []).map((p: any) => p.id)
  const gradeIds = [...new Set((plans ?? []).map((p: any) => p.grade_level_id).filter(Boolean))]

  const [{ data: allItems }, { data: allAssignments }] = await Promise.all([
    gradeIds.length > 0
      ? supabase
          .from('content_items')
          .select('id, name_fr, grade_level_id, competency_id, progression_type, competencies(id, name_fr, color, subject_id, subjects(id, name_fr, color, slug))')
          .in('grade_level_id', gradeIds)
          .not('progression_type', 'is', null)
      : Promise.resolve({ data: [] as any[] }),
    planIds.length > 0
      ? supabase
          .from('plan_assignments')
          .select('annual_plan_id, content_item_id')
          .in('annual_plan_id', planIds)
      : Promise.resolve({ data: [] as any[] }),
  ])

  return (
    <main className="min-h-screen">
      <nav className="px-6 py-4 flex items-center gap-3" style={{ backgroundColor: 'var(--color-nav)' }}>
        <Link href="/dashboard" className="text-white/70 hover:text-white text-sm">← Tableau de bord</Link>
        <span className="text-white/40">/</span>
        <h1 className="text-lg font-bold text-white">Planification mensuelle</h1>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-10">

        {plans && plans.length > 0 ? (
          <div className="flex flex-col gap-5">
            {plans.map((plan: any) => {
              const groups = computeUnplacedGroups(plan, allItems ?? [], allAssignments ?? [])
              const unplacedCount = groups.reduce((sum, g) => sum + g.items.length, 0)
              return (
                <div key={plan.id} className="bg-white rounded-2xl border shadow-sm p-5">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <p className="font-semibold text-gray-800">
                        {(plan.subjects as any)?.name_fr ?? '🔗 Toutes les matières'}
                      </p>
                      <p className="text-sm text-gray-500">
                        {(plan.grade_levels as any)?.label_fr} · {plan.school_year}
                        {plan.title && ` · ${plan.title}`}
                      </p>
                    </div>
                    <UnplacedBadge planId={plan.id} groups={groups} count={unplacedCount} />
                  </div>

                  <div className="grid grid-cols-6 gap-2">
                    {SCHOOL_MONTHS.map(({ month, label, bg, text }) => (
                      <Link
                        key={month}
                        href={`/dashboard/annual/${plan.id}/month/${month}`}
                        className="py-2.5 rounded-xl text-sm font-semibold transition hover:opacity-80 shadow-sm text-center"
                        style={{ backgroundColor: bg, color: text }}
                      >
                        {label}
                      </Link>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="bg-white rounded-2xl border shadow-sm p-10 text-center">
            <p className="text-gray-600 mb-4">Aucune planification globale trouvée.</p>
            <Link
              href="/dashboard/annual"
              className="inline-block bg-indigo-600 text-white px-5 py-2 rounded-xl text-sm font-semibold hover:bg-indigo-700 transition"
            >
              Créer une planification globale d'abord
            </Link>
          </div>
        )}
      </div>
    </main>
  )
}
