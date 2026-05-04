import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function PlanningModelPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  return (
    <main className="min-h-screen">
      <nav className="px-6 py-4 flex items-center gap-3" style={{ backgroundColor: 'var(--color-nav)' }}>
        <Link href="/dashboard" className="text-white/70 hover:text-white text-sm">&#x2190; Tableau de bord</Link>
        <span className="text-white/40">/</span>
        <h1 className="text-lg font-bold text-white">Modèle de planification</h1>
      </nav>

      <div className="max-w-4xl mx-auto px-8 py-12">
        <h2 className="text-3xl font-bold text-gray-800 mb-2">Choisir votre modèle de planification</h2>
        <p className="text-gray-500 mb-10">Quelle approche correspond le mieux à votre façon d&apos;organiser votre enseignement&nbsp;?</p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">

          {/* Branche 1 — Par étape */}
          <div className="flex flex-col gap-4">
            <div className="rounded-2xl px-6 py-4 border-2 text-center font-bold text-lg text-gray-800"
              style={{ borderColor: 'var(--color-nav)', backgroundColor: 'color-mix(in srgb, var(--color-nav) 8%, white)' }}>
              Par étape
            </div>
            <p className="text-sm text-gray-500 text-center px-2">
              Organisez votre enseignement par étapes du bulletin. Chaque étape a ses propres contenus et évaluations.
            </p>

            {/* Mensuelle */}
            <Link
              href="/dashboard/planning-model/mensuelle"
              className="rounded-2xl p-6 flex flex-col gap-2 shadow-sm hover:shadow-md hover:scale-[1.02] transition-all duration-200 border"
              style={{ backgroundColor: 'color-mix(in srgb, var(--color-nav) 68%, black)' }}
            >
              <p className="font-bold text-white text-xl">Mensuelle</p>
              <p className="text-white/70 text-sm">Planification globale, mensuelle et hebdomadaire structurées par étape.</p>
              <span className="text-white/50 text-sm mt-2 self-end">→</span>
            </Link>
          </div>

          {/* Branche 2 — Par thèmes */}
          <div className="flex flex-col gap-4">
            <div className="rounded-2xl px-6 py-4 border-2 text-center font-bold text-lg text-gray-800"
              style={{ borderColor: 'var(--color-nav)', backgroundColor: 'color-mix(in srgb, var(--color-nav) 8%, white)' }}>
              Par thèmes
            </div>
            <p className="text-sm text-gray-500 text-center px-2">
              Organisez votre enseignement autour de thèmes intégrateurs ou de projets interdisciplinaires.
            </p>

            {/* Concevoir son modèle */}
            <div
              className="rounded-2xl p-6 flex flex-col gap-2 border border-dashed border-gray-300 bg-gray-50 opacity-60 cursor-not-allowed select-none"
            >
              <p className="font-bold text-gray-600 text-xl">Concevoir son modèle</p>
              <p className="text-gray-400 text-sm">Construisez votre propre structure de planification selon vos thèmes.</p>
              <span className="text-xs text-gray-400 mt-2 self-end italic">Bientôt disponible</span>
            </div>
          </div>

        </div>
      </div>
    </main>
  )
}
