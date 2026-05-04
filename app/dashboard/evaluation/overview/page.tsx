import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Suspense } from 'react'
import EvaluationSelector from '../EvaluationSelector'

function ToolPanel({
  title,
  color,
  href,
}: {
  title: string
  color: string
  href: string
}) {
  return (
    <div className="bg-white border rounded-2xl overflow-hidden shadow-sm flex flex-col">
      <div className="px-5 py-3 flex items-center justify-between" style={{ backgroundColor: color }}>
        <h3 className="font-bold text-white text-sm">{title}</h3>
        <Link href={href} className="text-white/70 hover:text-white text-xs underline">
          Ouvrir
        </Link>
      </div>
      <div className="p-5 flex-1 text-center text-gray-400 text-sm py-10">
        Aucun élément pour l&apos;instant.
      </div>
    </div>
  )
}

export default async function OverviewPage({
  searchParams,
}: {
  searchParams: Promise<{ subjectId?: string; gradeId?: string; competency?: string }>
}) {
  const params   = await searchParams
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [{ data: subjects }, { data: gradeLevels }] = await Promise.all([
    supabase.from('subjects').select('id, name_fr, slug').eq('is_active', true).order('name_fr'),
    supabase.from('grade_levels').select('id, label_fr, education_level, grade').in('education_level', ['primaire', 'préscolaire']).order('grade'),
  ])

  const subjectIdParam      = params.subjectId ?? null
  const isInterdisciplinary = subjectIdParam === 'interdisciplinaire'
  const selectedSubject     = isInterdisciplinary
    ? { id: 'interdisciplinaire', name_fr: 'Grilles interdisciplinaires' }
    : subjects?.find(s => s.id === Number(subjectIdParam))
  const selectedGrade = gradeLevels?.find(g => g.id === Number(params.gradeId))

  let queryString = ''
  if (subjectIdParam && params.gradeId) {
    queryString = `?subjectId=${subjectIdParam}&gradeId=${params.gradeId}`
    if (params.competency) queryString += `&competency=${encodeURIComponent(params.competency)}`
  }

  return (
    <main className="min-h-screen">
      <nav className="px-6 py-4 flex items-center gap-3" style={{ backgroundColor: 'var(--color-nav)' }}>
        <Link href="/dashboard" className="text-white/70 hover:text-white text-sm">&#x2190; Tableau de bord</Link>
        <span className="text-white/40">/</span>
        <Link href="/dashboard/evaluation" className="text-white/70 hover:text-white text-sm">Outils d&apos;évaluation</Link>
        <span className="text-white/40">/</span>
        <h1 className="text-lg font-bold text-white">Vue d&apos;ensemble</h1>
      </nav>

      <div className="max-w-6xl mx-auto px-8 py-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Vue d&apos;ensemble</h2>

        <Suspense>
          <EvaluationSelector
            subjects={subjects ?? []}
            gradeLevels={gradeLevels ?? []}
            basePath="/dashboard/evaluation/overview"
          />
        </Suspense>

        {selectedSubject && selectedGrade && (
          <div className="mt-8">
            <div className="flex items-center gap-2 flex-wrap text-sm mb-6">
              <span className="text-lg font-semibold text-gray-800">{selectedSubject.name_fr}</span>
              <span className="text-gray-400">·</span>
              <span className="text-gray-600">{selectedGrade.label_fr}</span>
              {params.competency && (
                <>
                  <span className="text-gray-400">·</span>
                  <span className="text-blue-600 font-medium">{params.competency}</span>
                </>
              )}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              <ToolPanel
                title="Grilles d'évaluation"
                color="#5B7FBF"
                href={`/dashboard/evaluation/grilles${queryString}`}
              />
              <ToolPanel
                title="Grilles d'observation"
                color="#6B8FCC"
                href={`/dashboard/evaluation/observation${queryString}`}
              />
              <ToolPanel
                title="Conversations"
                color="#7BA0D9"
                href={`/dashboard/evaluation/conversations${queryString}`}
              />
            </div>
          </div>
        )}

        {!selectedSubject && (
          <p className="mt-8 text-gray-400 text-sm">Sélectionnez une matière et un niveau pour afficher les outils.</p>
        )}
      </div>
    </main>
  )
}