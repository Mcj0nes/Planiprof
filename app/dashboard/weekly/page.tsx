import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

function getCurrentWeekStart(): string {
  const now = new Date()
  const dow = now.getDay()
  const daysBack = dow === 0 ? 6 : dow - 1
  const monday = new Date(now.getFullYear(), now.getMonth(), now.getDate() - daysBack)
  return `${monday.getFullYear()}-${String(monday.getMonth() + 1).padStart(2, '0')}-${String(monday.getDate()).padStart(2, '0')}`
}

function getWeekLabel(weekStart: string): string {
  const MONTH_ABBR: Record<number, string> = {
    8: 'août', 9: 'sept.', 10: 'oct.', 11: 'nov.', 12: 'déc.',
    1: 'jan.', 2: 'fév.', 3: 'mars', 4: 'avr.', 5: 'mai', 6: 'juin',
  }
  const [y, m, d] = weekStart.split('-').map(Number)
  const mon = new Date(y, m - 1, d)
  const sun = new Date(y, m - 1, d + 6)
  const monAbbr = MONTH_ABBR[mon.getMonth() + 1] ?? ''
  const sunAbbr = MONTH_ABBR[sun.getMonth() + 1] ?? ''
  return mon.getMonth() === sun.getMonth()
    ? `${mon.getDate()}–${sun.getDate()} ${monAbbr}`
    : `${mon.getDate()} ${monAbbr}–${sun.getDate()} ${sunAbbr}`
}

export default async function WeeklyPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: plans } = await supabase
    .from('annual_plans')
    .select('id, school_year, title, subjects(name_fr, color), grade_levels(label_fr)')
    .eq('user_id', user.id)
    .order('school_year', { ascending: false })

  const currentWeek = getCurrentWeekStart()
  const weekLabel = getWeekLabel(currentWeek)

  return (
    <main className="min-h-screen">
      <nav className="px-6 py-4 flex items-center gap-3" style={{ backgroundColor: 'var(--color-nav)' }}>
        <Link href="/dashboard" className="text-white/70 hover:text-white text-sm">← Tableau de bord</Link>
        <span className="text-white/40">/</span>
        <h1 className="text-lg font-bold text-white">Planification hebdomadaire</h1>
      </nav>

      <div className="max-w-5xl mx-auto px-6 py-10">
        {plans && plans.length > 0 ? (
          <div className="flex flex-col gap-5">
            {plans.map((plan: any) => (
              <div key={plan.id} className="bg-white rounded-2xl border shadow-sm p-5">
                <div className="mb-4">
                  <p className="font-semibold text-gray-800">
                    {plan.subjects?.name_fr ?? '🔗 Toutes les matières'}
                  </p>
                  <p className="text-sm text-gray-500">
                    {plan.grade_levels?.label_fr} · {plan.school_year}
                    {plan.title && ` · ${plan.title}`}
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <Link
                    href={`/dashboard/annual/${plan.id}/week/${currentWeek}`}
                    className="px-4 py-2 rounded-xl text-sm font-semibold text-white transition hover:opacity-90"
                    style={{ backgroundColor: 'var(--color-nav)' }}
                  >
                    Semaine en cours · {weekLabel}
                  </Link>
                  <Link
                    href={`/dashboard/annual/${plan.id}/month/${new Date().getMonth() + 1 < 7 ? new Date().getMonth() + 1 : new Date().getMonth() + 1}`}
                    className="px-4 py-2 rounded-xl text-sm font-medium text-gray-600 border border-gray-200 hover:border-gray-400 transition"
                  >
                    Choisir une semaine →
                  </Link>
                </div>
              </div>
            ))}
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
