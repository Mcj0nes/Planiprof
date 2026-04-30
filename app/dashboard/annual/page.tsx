import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import NewPlanForm from './NewPlanForm'
import DeletePlanButton from './DeletePlanButton'

export default async function AnnualPlansPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [{ data: plans }, { data: subjects }, { data: gradeLevels }, { data: collaborators }] = await Promise.all([
    supabase
      .from('annual_plans')
      .select('id, school_year, title, subjects(name_fr), grade_levels(label_fr)')
      .eq('user_id', user.id)
      .order('school_year', { ascending: false }),
    supabase.from('subjects').select('id, name_fr, color').eq('is_active', true).order('name_fr'),
    supabase.from('grade_levels').select('id, label_fr, education_level, grade').eq('education_level', 'primaire').order('grade'),
    supabase.from('user_collaborators').select('owner_id, owner_email').eq('collaborator_id', user.id),
  ])

  const ownerIds = collaborators?.map(c => c.owner_id) ?? []
  let sharedPlans: any[] = []
  if (ownerIds.length > 0) {
    const { data } = await supabase
      .from('annual_plans')
      .select('id, school_year, title, user_id, subjects(name_fr), grade_levels(label_fr)')
      .in('user_id', ownerIds)
      .order('school_year', { ascending: false })
    sharedPlans = data ?? []
  }

  function ownerEmailFor(userId: string) {
    return collaborators?.find(c => c.owner_id === userId)?.owner_email ?? userId
  }

  return (
    <main className="min-h-screen">
      <nav className="px-6 py-4 flex items-center gap-3" style={{ backgroundColor: 'var(--color-nav)' }}>
        <Link href="/dashboard" className="text-white/70 hover:text-white text-sm">&#x2190; Tableau de bord</Link>
        <span className="text-white/40">/</span>
        <h1 className="text-lg font-bold text-white">Planification globale</h1>
      </nav>

      <div className="max-w-4xl mx-auto px-6 py-10">

        {plans && plans.length > 0 && (
          <section className="mb-10">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Mes planifications</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {plans.map((plan: any) => (
                <div key={plan.id} className="relative group bg-white rounded-2xl border shadow-sm hover:shadow-md transition">
                  <Link href={`/dashboard/annual/${plan.id}`} className="block p-5">
                    <p className="text-xs text-gray-400 mb-1">{plan.school_year}</p>
                    <p className="font-semibold text-gray-800">{plan.subjects?.name_fr ?? 'Toutes les matières'}</p>
                    <p className="text-sm text-gray-500">{plan.grade_levels?.label_fr}</p>
                    {plan.title && <p className="text-xs text-indigo-500 mt-1">{plan.title}</p>}
                  </Link>
                  <div className="absolute top-3 right-3">
                    <DeletePlanButton planId={plan.id} />
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {sharedPlans.length > 0 && (
          <section className="mb-10">
            <h2 className="text-xl font-bold text-gray-800 mb-4">Planifications partagées</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {sharedPlans.map((plan: any) => (
                <Link
                  key={plan.id}
                  href={`/dashboard/annual/${plan.id}`}
                  className="block bg-white rounded-2xl border border-dashed border-blue-300 shadow-sm hover:shadow-md transition p-5"
                >
                  <p className="text-xs text-blue-400 mb-1">{plan.school_year} · {ownerEmailFor(plan.user_id)}</p>
                  <p className="font-semibold text-gray-800">{plan.subjects?.name_fr ?? 'Toutes les matières'}</p>
                  <p className="text-sm text-gray-500">{plan.grade_levels?.label_fr}</p>
                  {plan.title && <p className="text-xs text-indigo-500 mt-1">{plan.title}</p>}
                </Link>
              ))}
            </div>
          </section>
        )}

        <section className="bg-white rounded-2xl border shadow-sm p-6">
          <h2 className="text-lg font-bold text-gray-800 mb-5">Créer une nouvelle planification</h2>
          <NewPlanForm subjects={subjects ?? []} gradeLevels={gradeLevels ?? []} />
        </section>

      </div>
    </main>
  )
}