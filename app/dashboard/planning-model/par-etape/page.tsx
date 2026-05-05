import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import EtapeSetupForm from './EtapeSetupForm'

export default async function ParEtapePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: etapeConfigs } = await supabase
    .from('etape_configs')
    .select('school_year, etape_number, start_date, end_date')
    .eq('user_id', user.id)
    .order('school_year', { ascending: false })
    .order('etape_number')

  const hasConfig = (etapeConfigs ?? []).length > 0

  return (
    <main className="min-h-screen">
      <nav className="px-6 py-4 flex items-center gap-3 flex-wrap" style={{ backgroundColor: 'var(--color-nav)' }}>
        <Link href="/dashboard" className="text-white/70 hover:text-white text-sm">&#x2190; Tableau de bord</Link>
        <span className="text-white/40">/</span>
        <Link href="/dashboard/planning-model" className="text-white/70 hover:text-white text-sm">Modèle de planification</Link>
        <span className="text-white/40">/</span>
        <h1 className="text-lg font-bold text-white">Planification par étape</h1>
      </nav>

      <div className="max-w-4xl mx-auto px-8 py-12">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Planification par étape</h2>
        <p className="text-gray-500 mb-8">
          Structurez vos contenus selon les trois étapes du bulletin scolaire. Configurez vos dates d&apos;étapes, assignez vos contenus à chaque étape, puis détaillez semaine par semaine.
        </p>

        <EtapeSetupForm existingConfigs={etapeConfigs ?? []} />

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <Link
            href="/dashboard/annual?model=par-etape"
            className="rounded-3xl p-10 flex flex-col justify-between min-h-56 shadow-md hover:shadow-xl hover:scale-[1.02] transition-all duration-200"
            style={{ backgroundColor: 'color-mix(in srgb, var(--color-nav) 68%, black)' }}
          >
            <div>
              <h3 className="text-2xl font-bold text-white mb-3 leading-tight">Planification globale</h3>
              <p className="text-white/70 text-sm leading-relaxed">Assignez vos contenus à chacune des 3 étapes du bulletin.</p>
            </div>
            <span className="text-white/50 text-sm mt-6 self-end">→</span>
          </Link>

          {hasConfig ? (
            <Link
              href="/dashboard/annual?model=par-etape"
              className="rounded-3xl p-10 flex flex-col justify-between min-h-56 shadow-md hover:shadow-xl hover:scale-[1.02] transition-all duration-200"
              style={{ backgroundColor: 'color-mix(in srgb, var(--color-nav) 80%, black)' }}
            >
              <div>
                <h3 className="text-2xl font-bold text-white mb-3 leading-tight">Planification par étape</h3>
                <p className="text-white/70 text-sm leading-relaxed">Planifiez semaine par semaine à l&apos;intérieur de chaque étape.</p>
              </div>
              <span className="text-white/50 text-sm mt-6 self-end">→</span>
            </Link>
          ) : (
            <div className="rounded-3xl p-10 flex flex-col justify-between min-h-56 border-2 border-dashed border-gray-200 bg-gray-50/60 select-none">
              <div>
                <h3 className="text-2xl font-bold text-gray-400 mb-3 leading-tight">Planification par étape</h3>
                <p className="text-gray-400 text-sm leading-relaxed">Configurez vos dates d&apos;étapes ci-dessus pour activer cette section.</p>
              </div>
              <span className="text-xs text-gray-400 italic mt-6 self-end">Configurer d&apos;abord</span>
            </div>
          )}

          <Link
            href="/dashboard/weekly"
            className="rounded-3xl p-10 flex flex-col justify-between min-h-56 shadow-md hover:shadow-xl hover:scale-[1.02] transition-all duration-200"
            style={{ backgroundColor: 'color-mix(in srgb, var(--color-nav) 90%, white)' }}
          >
            <div>
              <h3 className="text-2xl font-bold text-white mb-3 leading-tight">Planification hebdomadaire</h3>
              <p className="text-white/70 text-sm leading-relaxed">Organisez chaque semaine avec précision.</p>
            </div>
            <span className="text-white/50 text-sm mt-6 self-end">→</span>
          </Link>
        </div>
      </div>
    </main>
  )
}
