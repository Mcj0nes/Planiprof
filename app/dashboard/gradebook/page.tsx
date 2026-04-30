import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function GradebookHubPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: plans } = await supabase
    .from('annual_plans')
    .select('id, school_year, title, subjects(name_fr), grade_levels(label_fr)')
    .eq('user_id', user.id)
    .order('school_year', { ascending: false })

  return (
    <main className="min-h-screen">
      <nav className="px-6 py-4 flex items-center gap-3" style={{ backgroundColor: 'var(--color-nav)' }}>
        <Link href="/dashboard" className="text-white/70 hover:text-white text-sm">← Tableau de bord</Link>
        <span className="text-white/40">/</span>
        <h1 className="text-lg font-bold text-white">Carnet de notes</h1>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-10">
        <h2 className="text-xl font-bold text-gray-800 mb-6">Choisir une planification</h2>

        {!plans?.length && (
          <p className="text-gray-500">
            Aucune planification trouvée.{' '}
            <Link href="/dashboard/annual" className="text-indigo-600 underline">Créez-en une d'abord.</Link>
          </p>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {plans?.map((plan: any) => (
            <Link
              key={plan.id}
              href={`/dashboard/gradebook/${plan.id}`}
              className="bg-white rounded-2xl p-5 border shadow-sm hover:shadow-md transition"
            >
              <p className="text-xs text-gray-400 mb-1">{plan.school_year}</p>
              <p className="font-semibold text-gray-800">{plan.subjects?.name_fr ?? 'Toutes les matières'}</p>
              <p className="text-sm text-gray-500">{plan.grade_levels?.label_fr}</p>
              {plan.title && <p className="text-xs text-indigo-500 mt-1">{plan.title}</p>}
            </Link>
          ))}
        </div>
      </div>
    </main>
  )
}
