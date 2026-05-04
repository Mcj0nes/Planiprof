import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function MensuellePage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  return (
    <main className="min-h-screen">
      <nav className="px-6 py-4 flex items-center gap-3 flex-wrap" style={{ backgroundColor: 'var(--color-nav)' }}>
        <Link href="/dashboard" className="text-white/70 hover:text-white text-sm">&#x2190; Tableau de bord</Link>
        <span className="text-white/40">/</span>
        <Link href="/dashboard/planning-model" className="text-white/70 hover:text-white text-sm">Modèle de planification</Link>
        <span className="text-white/40">/</span>
        <h1 className="text-lg font-bold text-white">Mensuelle — Par étape</h1>
      </nav>

      <div className="max-w-4xl mx-auto px-8 py-12">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Planification par étape — Mensuelle</h2>
        <p className="text-gray-500 mb-10">
          Trois outils complémentaires pour planifier votre année, vos mois et vos semaines.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <Link
            href="/dashboard/annual"
            className="rounded-3xl p-10 flex flex-col justify-between min-h-56 shadow-md hover:shadow-xl hover:scale-[1.02] transition-all duration-200"
            style={{ backgroundColor: 'color-mix(in srgb, var(--color-nav) 68%, black)' }}
          >
            <div>
              <h3 className="text-2xl font-bold text-white mb-3 leading-tight">Planification globale</h3>
              <p className="text-white/70 text-sm leading-relaxed">Vue d&apos;ensemble de l&apos;année par étape et par matière.</p>
            </div>
            <span className="text-white/50 text-sm mt-6 self-end">→</span>
          </Link>

          <Link
            href="/dashboard/monthly"
            className="rounded-3xl p-10 flex flex-col justify-between min-h-56 shadow-md hover:shadow-xl hover:scale-[1.02] transition-all duration-200"
            style={{ backgroundColor: 'color-mix(in srgb, var(--color-nav) 82%, black)' }}
          >
            <div>
              <h3 className="text-2xl font-bold text-white mb-3 leading-tight">Planification mensuelle</h3>
              <p className="text-white/70 text-sm leading-relaxed">Détaillez vos contenus semaine par semaine.</p>
            </div>
            <span className="text-white/50 text-sm mt-6 self-end">→</span>
          </Link>

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
