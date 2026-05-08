import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'
import ImportClient from './ImportClient'

const MODEL_LABELS: Record<string, string> = {
  mensuel:     'Planification mensuelle',
  'par-etape': 'Par étape',
  'par-theme': 'Par thème/projet',
}

export default async function ImportPage({
  params,
}: {
  params: Promise<{ planId: string }>
}) {
  const { planId } = await params

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: plan } = await supabase
    .from('annual_plans')
    .select('id, school_year, planning_model, subject_id, grade_level_id, subjects(name_fr), grade_levels(label_fr)')
    .eq('id', planId)
    .eq('user_id', user.id)
    .single()
  if (!plan) notFound()

  const model = (plan as any).planning_model ?? 'mensuel'
  const subjectLabel = plan.subject_id ? (plan.subjects as any)?.name_fr : 'Toutes les matières'
  const planLabel = `${subjectLabel} · ${(plan.grade_levels as any)?.label_fr} · ${plan.school_year}`

  return (
    <main className="min-h-screen">
      <nav className="px-6 py-4 flex items-center gap-3" style={{ backgroundColor: 'var(--color-nav)' }}>
        <Link href={`/dashboard/annual/${planId}`} className="text-white/70 hover:text-white text-sm">
          ← {subjectLabel}
        </Link>
        <span className="text-white/40">/</span>
        <span className="text-lg font-bold text-white flex-1">Importer une planification</span>
        <span className="text-sm text-white/60">{MODEL_LABELS[model] ?? model}</span>
      </nav>

      <ImportClient planId={planId} planLabel={planLabel} model={model} />
    </main>
  )
}
