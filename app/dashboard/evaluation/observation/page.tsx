import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Suspense } from 'react'
import EvaluationSelector from '../EvaluationSelector'

type ObservationTool = {
  label:          string
  href:           string
  cycle:          string
  description:    string
  educationLevel: string
  grades:         number[]
}

const OBSERVATION_TOOLS: Record<string, ObservationTool[]> = {
  maths: [
    {
      label:          'Causeries mathématiques',
      href:           '/dashboard/evaluation/observation/causeries-mathematiques-1er-cycle',
      cycle:          '1er cycle du primaire (1re et 2e année)',
      description:    'Grille d\'observation interactive — 7 critères, niveaux 1 à 4',
      educationLevel: 'primaire',
      grades:         [1, 2],
    },
    {
      label:          'Causeries mathématiques',
      href:           '/dashboard/evaluation/observation/causeries-mathematiques-2e-cycle',
      cycle:          '2e cycle du primaire (3e et 4e année)',
      description:    'Grille d\'observation interactive — 7 critères, niveaux 1 à 4',
      educationLevel: 'primaire',
      grades:         [3, 4],
    },
    {
      label:          'Causeries mathématiques',
      href:           '/dashboard/evaluation/observation/causeries-mathematiques',
      cycle:          '3e cycle du primaire (5e et 6e année)',
      description:    'Grille d\'observation interactive — 7 critères, niveaux 1 à 4',
      educationLevel: 'primaire',
      grades:         [5, 6],
    },
  ],
  sciences: [
    {
      label:          'Démarche scientifique',
      href:           '/dashboard/evaluation/observation/sciences-2e-cycle',
      cycle:          '2e cycle du primaire (3e et 4e année)',
      description:    'Grille d\'observation interactive — 7 critères, niveaux 1 à 4',
      educationLevel: 'primaire',
      grades:         [3, 4],
    },
    {
      label:          'Démarche scientifique',
      href:           '/dashboard/evaluation/observation/sciences-3e-cycle',
      cycle:          '3e cycle du primaire (5e et 6e année)',
      description:    'Grille d\'observation interactive — 7 critères, niveaux 1 à 4',
      educationLevel: 'primaire',
      grades:         [5, 6],
    },
  ],
  'univers-social': [
    {
      label:          'Univers social',
      href:           '/dashboard/evaluation/observation/univers-social-2e-cycle',
      cycle:          '2e cycle du primaire (3e et 4e année)',
      description:    'Grille d\'observation interactive — 7 critères, niveaux 1 à 4',
      educationLevel: 'primaire',
      grades:         [3, 4],
    },
    {
      label:          'Univers social',
      href:           '/dashboard/evaluation/observation/univers-social-3e-cycle',
      cycle:          '3e cycle du primaire (5e et 6e année)',
      description:    'Grille d\'observation interactive — 6 critères, niveaux 1 à 4',
      educationLevel: 'primaire',
      grades:         [5, 6],
    },
  ],
  'arts-plastiques': [
    {
      label:          'Arts plastiques',
      href:           '/dashboard/evaluation/observation/arts-plastiques-1er-cycle',
      cycle:          '1er cycle du primaire (1re et 2e année)',
      description:    'Grille d\'observation interactive — 6 critères, niveaux 1 à 4',
      educationLevel: 'primaire',
      grades:         [1, 2],
    },
    {
      label:          'Arts plastiques',
      href:           '/dashboard/evaluation/observation/arts-plastiques-2e-cycle',
      cycle:          '2e cycle du primaire (3e et 4e année)',
      description:    'Grille d\'observation interactive — 6 critères, niveaux 1 à 4',
      educationLevel: 'primaire',
      grades:         [3, 4],
    },
    {
      label:          'Arts plastiques',
      href:           '/dashboard/evaluation/observation/arts-plastiques-3e-cycle',
      cycle:          '3e cycle du primaire (5e et 6e année)',
      description:    'Grille d\'observation interactive — 6 critères, niveaux 1 à 4',
      educationLevel: 'primaire',
      grades:         [5, 6],
    },
  ],
  anglais: [
    {
      label:          'Interacts orally in English',
      href:           '/dashboard/evaluation/observation/anglais-1er-cycle',
      cycle:          '1er cycle du primaire (1re et 2e année)',
      description:    'Grille d\'observation interactive — 5 critères, niveaux 1 à 4',
      educationLevel: 'primaire',
      grades:         [1, 2],
    },
    {
      label:          'Interacts orally in English',
      href:           '/dashboard/evaluation/observation/anglais-2e-cycle',
      cycle:          '2e cycle du primaire (3e et 4e année)',
      description:    'Grille d\'observation interactive — 6 critères, niveaux 1 à 4',
      educationLevel: 'primaire',
      grades:         [3, 4],
    },
    {
      label:          'Interacts orally in English',
      href:           '/dashboard/evaluation/observation/anglais-3e-cycle',
      cycle:          '3e cycle du primaire (5e et 6e année)',
      description:    'Grille d\'observation interactive — 6 critères, niveaux 1 à 4',
      educationLevel: 'primaire',
      grades:         [5, 6],
    },
  ],
  'educ-physique': [
    {
      label:          'Éducation physique et à la santé',
      href:           '/dashboard/evaluation/observation/eps-1er-cycle',
      cycle:          '1er cycle du primaire (1re et 2e année)',
      description:    'Grille d\'observation interactive — 6 critères, niveaux 1 à 4',
      educationLevel: 'primaire',
      grades:         [1, 2],
    },
    {
      label:          'Éducation physique et à la santé',
      href:           '/dashboard/evaluation/observation/eps-2e-cycle',
      cycle:          '2e cycle du primaire (3e et 4e année)',
      description:    'Grille d\'observation interactive — 6 critères, niveaux 1 à 4',
      educationLevel: 'primaire',
      grades:         [3, 4],
    },
    {
      label:          'Éducation physique et à la santé',
      href:           '/dashboard/evaluation/observation/eps-3e-cycle',
      cycle:          '3e cycle du primaire (5e et 6e année)',
      description:    'Grille d\'observation interactive — 6 critères, niveaux 1 à 4',
      educationLevel: 'primaire',
      grades:         [5, 6],
    },
  ],
  ccq: [
    {
      label:          'Culture et citoyenneté québécoise',
      href:           '/dashboard/evaluation/observation/ccq-1er-cycle',
      cycle:          '1er cycle du primaire (1re et 2e année)',
      description:    'Grille d\'observation interactive — 6 critères, niveaux 1 à 4',
      educationLevel: 'primaire',
      grades:         [1, 2],
    },
    {
      label:          'Culture et citoyenneté québécoise',
      href:           '/dashboard/evaluation/observation/ccq-2e-cycle',
      cycle:          '2e cycle du primaire (3e et 4e année)',
      description:    'Grille d\'observation interactive — 6 critères, niveaux 1 à 4',
      educationLevel: 'primaire',
      grades:         [3, 4],
    },
    {
      label:          'Culture et citoyenneté québécoise',
      href:           '/dashboard/evaluation/observation/ccq-3e-cycle',
      cycle:          '3e cycle du primaire (5e et 6e année)',
      description:    'Grille d\'observation interactive — 6 critères, niveaux 1 à 4',
      educationLevel: 'primaire',
      grades:         [5, 6],
    },
  ],
  musique: [
    {
      label:          'Interpréter',
      href:           '/dashboard/evaluation/observation/musique-1er-cycle',
      cycle:          '1er cycle du primaire (1re et 2e année)',
      description:    'Grille d\'observation interactive — 6 critères, niveaux 1 à 4',
      educationLevel: 'primaire',
      grades:         [1, 2],
    },
    {
      label:          'Interpréter',
      href:           '/dashboard/evaluation/observation/musique-2e-cycle',
      cycle:          '2e cycle du primaire (3e et 4e année)',
      description:    'Grille d\'observation interactive — 6 critères, niveaux 1 à 4',
      educationLevel: 'primaire',
      grades:         [3, 4],
    },
    {
      label:          'Interpréter',
      href:           '/dashboard/evaluation/observation/musique-3e-cycle',
      cycle:          '3e cycle du primaire (5e et 6e année)',
      description:    'Grille d\'observation interactive — 7 critères, niveaux 1 à 4',
      educationLevel: 'primaire',
      grades:         [5, 6],
    },
  ],
  francais: [
    {
      label:          'Grille : Lecture',
      href:           '/dashboard/evaluation/observation/lecture-1er-cycle',
      cycle:          '1er cycle du primaire (1re et 2e année)',
      description:    'Grille d\'observation interactive — 6 critères, niveaux 1 à 4',
      educationLevel: 'primaire',
      grades:         [1, 2],
    },
    {
      label:          'Grille : Lecture',
      href:           '/dashboard/evaluation/observation/lecture-2e-cycle',
      cycle:          '2e cycle du primaire (3e et 4e année)',
      description:    'Grille d\'observation interactive — 6 critères, niveaux 1 à 4',
      educationLevel: 'primaire',
      grades:         [3, 4],
    },
    {
      label:          'Grille : Lecture',
      href:           '/dashboard/evaluation/observation/lecture-3e-cycle',
      cycle:          '3e cycle du primaire (5e et 6e année)',
      description:    'Grille d\'observation interactive — 6 critères, niveaux 1 à 4',
      educationLevel: 'primaire',
      grades:         [5, 6],
    },
    {
      label:          'Grille : Oral',
      href:           '/dashboard/evaluation/observation/exposes-oraux-1er-cycle',
      cycle:          '1er cycle du primaire (1re et 2e année)',
      description:    'Grille d\'observation interactive — 7 critères, niveaux 1 à 4',
      educationLevel: 'primaire',
      grades:         [1, 2],
    },
    {
      label:          'Grille : Oral',
      href:           '/dashboard/evaluation/observation/exposes-oraux-2e-cycle',
      cycle:          '2e cycle du primaire (3e et 4e année)',
      description:    'Grille d\'observation interactive — 7 critères, niveaux 1 à 4',
      educationLevel: 'primaire',
      grades:         [3, 4],
    },
    {
      label:          'Grille : Oral',
      href:           '/dashboard/evaluation/observation/exposes-oraux',
      cycle:          '3e cycle du primaire (5e et 6e année)',
      description:    'Grille d\'observation interactive — 7 critères, niveaux 1 à 4',
      educationLevel: 'primaire',
      grades:         [5, 6],
    },
  ],
}

function getToolsForGrade(
  subjectSlug: string | undefined,
  grade: { education_level: string; grade: number } | undefined,
) {
  if (!subjectSlug || !grade) return []
  return (OBSERVATION_TOOLS[subjectSlug] ?? []).filter(
    t => t.educationLevel === grade.education_level && t.grades.includes(grade.grade),
  )
}

export default async function ObservationPage({
  searchParams,
}: {
  searchParams: Promise<{ subjectId?: string; gradeId?: string }>
}) {
  const params   = await searchParams
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const [{ data: subjects }, { data: gradeLevels }] = await Promise.all([
    supabase.from('subjects').select('id, name_fr, slug').eq('is_active', true).order('name_fr'),
    supabase.from('grade_levels').select('id, label_fr, education_level, grade').eq('education_level', 'primaire').order('grade'),
  ])

  const subjectId = params.subjectId ? Number(params.subjectId) : null
  const gradeId   = params.gradeId   ? Number(params.gradeId)   : null

  const selectedSubject = (subjects as any[])?.find((s: any) => s.id === subjectId)
  const selectedGrade   = gradeLevels?.find(g => g.id === gradeId)

  const tools = getToolsForGrade(selectedSubject?.slug, selectedGrade as any)

  // Custom grids for the selected subject+grade
  let customDefs: { id: string; title: string; criteria: any[] }[] = []
  if (subjectId && gradeId) {
    const { data } = await supabase
      .from('custom_obs_definitions')
      .select('id, title, criteria')
      .eq('user_id', user.id)
      .eq('subject_id', subjectId)
      .eq('grade_level_id', gradeId)
      .order('created_at', { ascending: false })
    customDefs = data ?? []
  }

  const newGridUrl = `/dashboard/evaluation/observation/custom/new${
    subjectId && gradeId ? `?subjectId=${subjectId}&gradeId=${gradeId}` : ''
  }`

  return (
    <main className="min-h-screen">
      <nav className="px-6 py-4 flex items-center gap-3" style={{ backgroundColor: 'var(--color-nav)' }}>
        <Link href="/dashboard" className="text-white/70 hover:text-white text-sm">&#x2190; Tableau de bord</Link>
        <span className="text-white/40">/</span>
        <Link href="/dashboard/evaluation" className="text-white/70 hover:text-white text-sm">Outils d&apos;évaluation</Link>
        <span className="text-white/40">/</span>
        <h1 className="text-lg font-bold text-white">Grilles d&apos;observation</h1>
      </nav>

      <div className="max-w-4xl mx-auto px-8 py-10">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-800">Grilles d&apos;observation</h2>
          <Link
            href={newGridUrl}
            className="text-xs px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition font-medium"
          >
            + Créer une grille personnalisée
          </Link>
        </div>

        <Suspense>
          <EvaluationSelector
            subjects={(subjects ?? []) as any}
            gradeLevels={gradeLevels ?? []}
            basePath="/dashboard/evaluation/observation"
          />
        </Suspense>

        {selectedSubject && selectedGrade && (
          <div className="mt-8">
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
              <span className="font-semibold text-gray-700">{selectedSubject.name_fr}</span>
              <span>·</span>
              <span>{selectedGrade.label_fr}</span>
            </div>

            {tools.length === 0 && customDefs.length === 0 ? (
              <div className="bg-white border rounded-2xl p-8 text-center text-gray-400">
                <p>Aucun outil disponible pour cette sélection.</p>
                <p className="text-sm mt-2">
                  <Link href={newGridUrl} className="text-indigo-600 hover:underline">
                    Créer une grille personnalisée
                  </Link>
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {tools.map((tool: ObservationTool) => (
                  <div key={tool.href} className="bg-white border rounded-2xl p-5 flex items-center justify-between shadow-sm">
                    <div>
                      <p className="font-semibold text-gray-800">{tool.label}</p>
                      <div className="flex items-center gap-3 mt-1">
                        <span className="text-xs text-gray-400">{tool.cycle}</span>
                        <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">{tool.description}</span>
                      </div>
                    </div>
                    <Link
                      href={tool.href}
                      className="text-sm px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition shrink-0"
                    >
                      Ouvrir
                    </Link>
                  </div>
                ))}

                {customDefs.map(def => (
                  <div key={def.id} className="bg-white border border-indigo-100 rounded-2xl p-5 flex items-center justify-between shadow-sm">
                    <div>
                      <div className="flex items-center gap-2">
                        <p className="font-semibold text-gray-800">{def.title}</p>
                        <span className="text-xs bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full">Personnalisée</span>
                      </div>
                      <p className="text-xs text-gray-400 mt-1">
                        {def.criteria.length} critère{def.criteria.length !== 1 ? 's' : ''} — niveaux 1 à 4
                      </p>
                    </div>
                    <Link
                      href={`/dashboard/evaluation/observation/custom/${def.id}`}
                      className="text-sm px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition shrink-0"
                    >
                      Ouvrir
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {!selectedSubject && (
          <p className="mt-8 text-gray-400 text-sm">Sélectionnez une matière et un niveau pour afficher les outils.</p>
        )}
      </div>
    </main>
  )
}
