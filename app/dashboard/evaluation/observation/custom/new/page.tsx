import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import NewGridForm from './NewGridForm'

export default async function NewCustomObsGridPage({
  searchParams,
}: {
  searchParams: Promise<{ subjectId?: string; gradeId?: string }>
}) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const params = await searchParams

  const [{ data: subjects }, { data: gradeLevels }] = await Promise.all([
    supabase.from('subjects').select('id, name_fr').eq('is_active', true).order('name_fr'),
    supabase.from('grade_levels').select('id, label_fr').in('education_level', ['primaire', 'préscolaire']).order('grade'),
  ])

  return (
    <main className="min-h-screen">
      <nav className="px-6 py-4 flex items-center gap-3 flex-wrap" style={{ backgroundColor: 'var(--color-nav)' }}>
        <Link href="/dashboard" className="text-white/70 hover:text-white text-sm">&#x2190; Tableau de bord</Link>
        <span className="text-white/40">/</span>
        <Link href="/dashboard/evaluation" className="text-white/70 hover:text-white text-sm">Outils d&apos;évaluation</Link>
        <span className="text-white/40">/</span>
        <Link href="/dashboard/evaluation/observation" className="text-white/70 hover:text-white text-sm">Grilles d&apos;observation</Link>
        <span className="text-white/40">/</span>
        <h1 className="text-sm font-semibold text-white">Nouvelle grille personnalisée</h1>
      </nav>

      <div className="max-w-2xl mx-auto px-8 py-10">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-800">Nouvelle grille d&apos;observation</h2>
          <p className="text-sm text-gray-500 mt-1">
            Définissez vos propres critères. La grille aura le même format interactif que les grilles existantes.
          </p>
        </div>
        <NewGridForm
          subjects={subjects ?? []}
          gradeLevels={gradeLevels ?? []}
          defaultSubjectId={params.subjectId ?? ''}
          defaultGradeId={params.gradeId ?? ''}
        />
      </div>
    </main>
  )
}
