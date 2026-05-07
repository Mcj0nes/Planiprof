import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import CalendarClient from './CalendarClient'
import { getCalendarEvents } from './actions'

function getCurrentSchoolYear(): string {
  const now = new Date()
  const month = now.getMonth() + 1
  const year = now.getFullYear()
  return month >= 8 ? `${year}-${year + 1}` : `${year - 1}-${year}`
}

export default async function SchoolCalendarPage({
  searchParams,
}: {
  searchParams: Promise<{ year?: string }>
}) {
  const sp = await searchParams
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const currentYear = getCurrentSchoolYear()
  const schoolYear = sp.year ?? currentYear

  const [sy] = currentYear.split('-').map(Number)
  const yearOptions = [`${sy - 1}-${sy}`, `${sy}-${sy + 1}`, `${sy + 1}-${sy + 2}`]

  const events = await getCalendarEvents(schoolYear)

  return (
    <main className="min-h-screen bg-gray-50">
      <nav className="px-6 py-4 flex items-center gap-3" style={{ backgroundColor: 'var(--color-nav)' }}>
        <Link href="/dashboard" className="text-white/70 hover:text-white text-sm">← Tableau de bord</Link>
        <span className="text-white/40">/</span>
        <h1 className="text-lg font-bold text-white flex-1">Calendrier scolaire</h1>
        <div className="flex gap-1">
          {yearOptions.map(year => (
            <Link
              key={year}
              href={`/dashboard/school-calendar?year=${year}`}
              className={`px-3 py-1 rounded-lg text-sm font-medium transition ${
                schoolYear === year ? 'bg-white/20 text-white' : 'text-white/60 hover:text-white'
              }`}
            >
              {year}
            </Link>
          ))}
        </div>
      </nav>

      <CalendarClient initialEvents={events} schoolYear={schoolYear} />
    </main>
  )
}
