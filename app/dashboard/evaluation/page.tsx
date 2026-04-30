import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'

export default async function EvaluationPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  return (
    <main className="min-h-screen">
      <nav className="px-6 py-4 flex items-center gap-3" style={{ backgroundColor: 'var(--color-nav)' }}>
        <Link href="/dashboard" className="text-white/70 hover:text-white text-sm">&#x2190; Tableau de bord</Link>
        <span className="text-white/40">/</span>
        <h1 className="text-lg font-bold text-white">Outils d&apos;évaluation</h1>
      </nav>

      <div className="max-w-5xl mx-auto px-8 py-12">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">Outils d&apos;évaluation</h2>
        <p className="text-gray-500 mb-10">Choisissez un type d&apos;outil d&apos;évaluation.</p>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            <Link
              href="/dashboard/evaluation/grilles"
              className="rounded-3xl p-14 flex flex-col justify-between aspect-square shadow-md hover:shadow-xl hover:scale-[1.02] transition-all duration-200"
              style={{ backgroundColor: '#5B7FBF' }}
            >
              <div>
                <h3 className="text-2xl font-bold text-white mb-3 leading-tight">Grilles d&apos;évaluation</h3>
                <p className="text-white/70 text-sm leading-relaxed">Évaluez les compétences et les apprentissages à l&apos;aide de grilles critériées.</p>
              </div>
              <span className="text-white/50 text-sm mt-6 self-end">&#x2192;</span>
            </Link>

            <Link
              href="/dashboard/evaluation/observation"
              className="rounded-3xl p-14 flex flex-col justify-between aspect-square shadow-md hover:shadow-xl hover:scale-[1.02] transition-all duration-200"
              style={{ backgroundColor: '#6B8FCC' }}
            >
              <div>
                <h3 className="text-2xl font-bold text-white mb-3 leading-tight">Grilles d&apos;observation</h3>
                <p className="text-white/70 text-sm leading-relaxed">Consignez vos observations en classe de façon structurée.</p>
              </div>
              <span className="text-white/50 text-sm mt-6 self-end">&#x2192;</span>
            </Link>

            <Link
              href="/dashboard/evaluation/conversations"
              className="rounded-3xl p-14 flex flex-col justify-between aspect-square shadow-md hover:shadow-xl hover:scale-[1.02] transition-all duration-200"
              style={{ backgroundColor: '#7BA0D9' }}
            >
              <div>
                <h3 className="text-2xl font-bold text-white mb-3 leading-tight">Conversations</h3>
                <p className="text-white/70 text-sm leading-relaxed">Planifiez et documentez vos conversations d&apos;évaluation avec les élèves.</p>
              </div>
              <span className="text-white/50 text-sm mt-6 self-end">&#x2192;</span>
            </Link>
        </div>
      </div>
    </main>
  )
}