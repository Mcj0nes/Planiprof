import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import SkinPicker from '@/app/components/SkinPicker'
import SignOutButton from '@/app/components/SignOutButton'

export default async function DashboardPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  return (
    <main className="min-h-screen">
      <nav className="px-6 py-2 flex justify-between items-center overflow-visible" style={{ backgroundColor: 'var(--color-nav)' }}>
        <div className="flex items-center gap-3">
          <Image src="/logo.png" alt="Planiprof" width={360} height={360} className="h-80 w-80 rounded-full object-cover -my-6" priority />
          <h1 className="text-8xl font-bold text-white">Planiprof</h1>
        </div>
        <div className="flex flex-col items-end gap-2">
          <span className="text-sm text-white/70">{user.email}</span>
          <SkinPicker />
          <SignOutButton />
        </div>
      </nav>

      <div className="max-w-6xl mx-auto px-8 py-12">
        <div className="flex items-center gap-4 mb-1 flex-wrap">
          <h2 className="text-3xl font-bold text-gray-800">Gagner du temps pour que l&apos;élève redevienne au centre.</h2>
          <Link
            href="/dashboard/planning-model"
            className="shrink-0 text-sm font-semibold px-4 py-2 rounded-xl border-2 hover:bg-gray-50 transition"
            style={{ borderColor: 'var(--color-nav)', color: 'var(--color-nav)' }}
          >
            Modèle de planification
          </Link>
        </div>
        <p className="text-gray-500 mb-10">Bienvenue, {user.user_metadata?.full_name ?? user.user_metadata?.name ?? user.email}</p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 mb-6">
          <Link
            href="/dashboard/annual"
            className="rounded-3xl p-10 flex flex-col justify-between min-h-64 shadow-md hover:shadow-xl hover:scale-[1.02] transition-all duration-200"
            style={{ backgroundColor: 'color-mix(in srgb, var(--color-nav) 68%, black)' }}
          >
            <div>
              <h3 className="text-4xl font-bold text-white mb-4 leading-tight">Planification globale</h3>
              <p className="text-white/70 text-sm leading-relaxed">Organisez tous vos contenus pour l'année scolaire complète.</p>
            </div>
            <span className="text-white/50 text-sm mt-8 self-end">→</span>
          </Link>

          <Link
            href="/dashboard/monthly"
            className="rounded-3xl p-10 flex flex-col justify-between min-h-64 shadow-md hover:shadow-xl hover:scale-[1.02] transition-all duration-200"
            style={{ backgroundColor: 'color-mix(in srgb, var(--color-nav) 82%, black)' }}
          >
            <div>
              <h3 className="text-4xl font-bold text-white mb-4 leading-tight">Planification mensuelle</h3>
              <p className="text-white/70 text-sm leading-relaxed">Planifiez vos contenus semaine par semaine.</p>
            </div>
            <span className="text-white/50 text-sm mt-8 self-end">→</span>
          </Link>

          <Link
            href="/dashboard/weekly"
            className="rounded-3xl p-10 flex flex-col justify-between min-h-64 shadow-md hover:shadow-xl hover:scale-[1.02] transition-all duration-200"
            style={{ backgroundColor: 'color-mix(in srgb, var(--color-nav) 90%, white)' }}
          >
            <div>
              <h3 className="text-4xl font-bold text-white mb-4 leading-tight">Planification hebdomadaire</h3>
              <p className="text-white/70 text-sm leading-relaxed">Organisez vos semaines avec précision.</p>
            </div>
            <span className="text-white/50 text-sm mt-8 self-end">→</span>
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <Link
            href="/dashboard/gradebook"
            className="rounded-3xl p-7 flex flex-col justify-between min-h-36 shadow-md hover:shadow-xl hover:scale-[1.02] transition-all duration-200"
            style={{ backgroundColor: 'color-mix(in srgb, var(--color-nav) 72%, #3730a3)' }}
          >
            <div>
              <h3 className="text-2xl font-bold text-white mb-2 leading-tight">Carnet de notes</h3>
              <p className="text-white/70 text-sm leading-relaxed">Résultats, moyennes et jugement professionnel par étape.</p>
            </div>
            <span className="text-white/50 text-sm mt-4 self-end">→</span>
          </Link>

          <Link
            href="/dashboard/evaluation"
            className="rounded-3xl p-7 flex flex-col justify-between min-h-36 shadow-md hover:shadow-xl hover:scale-[1.02] transition-all duration-200"
            style={{ backgroundColor: 'color-mix(in srgb, var(--color-nav) 75%, black)' }}
          >
            <div>
              <h3 className="text-2xl font-bold text-white mb-2 leading-tight">Outils d&apos;évaluation</h3>
              <p className="text-white/70 text-sm leading-relaxed">Grilles d&apos;évaluation, d&apos;observation et conversations.</p>
            </div>
            <span className="text-white/50 text-sm mt-4 self-end">→</span>
          </Link>

          <Link
            href="/dashboard/activities"
            className="rounded-3xl p-7 flex flex-col justify-between min-h-36 shadow-md hover:shadow-xl hover:scale-[1.02] transition-all duration-200"
            style={{ backgroundColor: 'color-mix(in srgb, var(--color-nav) 68%, #047857)' }}
          >
            <div>
              <h3 className="text-2xl font-bold text-white mb-2 leading-tight">Banque d&apos;activités</h3>
              <p className="text-white/70 text-sm leading-relaxed">Créez et organisez vos activités réutilisables.</p>
            </div>
            <span className="text-white/50 text-sm mt-4 self-end">→</span>
          </Link>
        </div>
      </div>
    </main>
  )
}
