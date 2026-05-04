import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

const MODELS = [
  {
    href:        '/dashboard/planning-model/mensuelle',
    title:       'Planification mensuelle',
    description: 'Organisez votre année avec une vue globale, puis détaillez mois par mois et semaine par semaine.',
    tag:         'Par étape',
    available:   true,
    colorVar:    'color-mix(in srgb, var(--color-nav) 68%, black)',
  },
  {
    href:        '/dashboard/planning-model/par-etape',
    title:       'Planification par étape',
    description: 'Structurez vos contenus et évaluations selon les trois étapes du bulletin scolaire.',
    tag:         'Par étape',
    available:   false,
    colorVar:    'color-mix(in srgb, var(--color-nav) 80%, black)',
  },
  {
    href:        '/dashboard/planning-model/par-theme',
    title:       'Planification par thème / projet',
    description: 'Organisez votre enseignement autour de thèmes intégrateurs ou de projets interdisciplinaires.',
    tag:         'Par thèmes',
    available:   false,
    colorVar:    'color-mix(in srgb, var(--color-nav) 75%, #047857)',
  },
  {
    href:        '/dashboard/planning-model/concevoir',
    title:       'Concevoir son modèle',
    description: 'Créez votre propre structure de planification sur mesure selon votre réalité de classe.',
    tag:         'Personnalisé',
    available:   false,
    colorVar:    'color-mix(in srgb, var(--color-nav) 70%, #3730a3)',
  },
]

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

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {MODELS.map(model => (
            model.available ? (
              <Link
                key={model.href}
                href={model.href}
                className="rounded-3xl p-8 flex flex-col justify-between min-h-52 shadow-md hover:shadow-xl hover:scale-[1.02] transition-all duration-200"
                style={{ backgroundColor: model.colorVar }}
              >
                <div>
                  <span className="inline-block text-xs font-semibold text-white/60 uppercase tracking-wide mb-3">{model.tag}</span>
                  <h3 className="text-2xl font-bold text-white mb-3 leading-tight">{model.title}</h3>
                  <p className="text-white/70 text-sm leading-relaxed">{model.description}</p>
                </div>
                <span className="text-white/50 text-sm mt-6 self-end">→</span>
              </Link>
            ) : (
              <div
                key={model.href}
                className="rounded-3xl p-8 flex flex-col justify-between min-h-52 border-2 border-dashed border-gray-200 bg-gray-50/60 select-none"
              >
                <div>
                  <span className="inline-block text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">{model.tag}</span>
                  <h3 className="text-2xl font-bold text-gray-400 mb-3 leading-tight">{model.title}</h3>
                  <p className="text-gray-400 text-sm leading-relaxed">{model.description}</p>
                </div>
                <span className="text-xs text-gray-400 italic mt-6 self-end">Bientôt disponible</span>
              </div>
            )
          ))}
        </div>
      </div>
    </main>
  )
}
