import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { Suspense } from 'react'
import EvaluationSelector from '../EvaluationSelector'

type ConvObsTool = {
  label:          string
  href:           string
  cycle:          string
  description:    string
  educationLevel: string
  grades:         number[]
}

const CONVERSATION_OBS_TOOLS: Record<string, ConvObsTool[]> = {
  maths: [
    {
      label:          'Conversation orale — Mathématique',
      href:           '/dashboard/evaluation/observation/maths-conversation-1er-cycle',
      cycle:          '1er cycle du primaire (1re et 2e année)',
      description:    'Grille d\'observation — 5 critères, niveaux 1 à 4',
      educationLevel: 'primaire',
      grades:         [1, 2],
    },
    {
      label:          'Conversation orale — Mathématique',
      href:           '/dashboard/evaluation/observation/maths-conversation-2e-cycle',
      cycle:          '2e cycle du primaire (3e et 4e année)',
      description:    'Grille d\'observation — 5 critères, niveaux 1 à 4',
      educationLevel: 'primaire',
      grades:         [3, 4],
    },
    {
      label:          'Conversation orale — Mathématique',
      href:           '/dashboard/evaluation/observation/maths-conversation-3e-cycle',
      cycle:          '3e cycle du primaire (5e et 6e année)',
      description:    'Grille d\'observation — 5 critères, niveaux 1 à 4',
      educationLevel: 'primaire',
      grades:         [5, 6],
    },
  ],
  sciences: [
    {
      label:          'Conversation orale — Sciences',
      href:           '/dashboard/evaluation/observation/sciences-conversation-2e-cycle',
      cycle:          '2e cycle du primaire (3e et 4e année)',
      description:    'Grille d\'observation — 6 critères, niveaux 1 à 4',
      educationLevel: 'primaire',
      grades:         [3, 4],
    },
    {
      label:          'Conversation orale — Sciences',
      href:           '/dashboard/evaluation/observation/sciences-conversation-3e-cycle',
      cycle:          '3e cycle du primaire (5e et 6e année)',
      description:    'Grille d\'observation — 6 critères, niveaux 1 à 4',
      educationLevel: 'primaire',
      grades:         [5, 6],
    },
  ],
  'univers-social': [
    {
      label:          'Conversation orale — Univers social',
      href:           '/dashboard/evaluation/observation/univers-social-conversation-2e-cycle',
      cycle:          '2e cycle du primaire (3e et 4e année)',
      description:    'Grille d\'observation — 6 critères, niveaux 1 à 4',
      educationLevel: 'primaire',
      grades:         [3, 4],
    },
    {
      label:          'Conversation orale — Univers social',
      href:           '/dashboard/evaluation/observation/univers-social-conversation-3e-cycle',
      cycle:          '3e cycle du primaire (5e et 6e année)',
      description:    'Grille d\'observation — 6 critères, niveaux 1 à 4',
      educationLevel: 'primaire',
      grades:         [5, 6],
    },
  ],
  'arts-plastiques': [
    {
      label:          'Conversation orale — Arts plastiques (Apprécier)',
      href:           '/dashboard/evaluation/observation/arts-plastiques-apprecier-conversation-1er-cycle',
      cycle:          '1er cycle du primaire (1re et 2e année)',
      description:    "Grille d'observation — 6 critères, niveaux 1 à 4",
      educationLevel: 'primaire',
      grades:         [1, 2],
    },
    {
      label:          'Conversation orale — Arts plastiques (Apprécier)',
      href:           '/dashboard/evaluation/observation/arts-plastiques-apprecier-conversation-2e-cycle',
      cycle:          '2e cycle du primaire (3e et 4e année)',
      description:    'Grille d\'observation — 6 critères, niveaux 1 à 4',
      educationLevel: 'primaire',
      grades:         [3, 4],
    },
    {
      label:          'Conversation orale — Arts plastiques (Apprécier)',
      href:           '/dashboard/evaluation/observation/arts-plastiques-apprecier-conversation-3e-cycle',
      cycle:          '3e cycle du primaire (5e et 6e année)',
      description:    'Grille d\'observation — 6 critères, niveaux 1 à 4',
      educationLevel: 'primaire',
      grades:         [5, 6],
    },
    {
      label:          'Conversation orale — Arts plastiques (Créer)',
      href:           '/dashboard/evaluation/observation/arts-plastiques-creer-conversation-1er-cycle',
      cycle:          '1er cycle du primaire (1re et 2e année)',
      description:    "Grille d'observation — 6 critères, niveaux 1 à 4",
      educationLevel: 'primaire',
      grades:         [1, 2],
    },
    {
      label:          'Conversation orale — Arts plastiques (Créer)',
      href:           '/dashboard/evaluation/observation/arts-plastiques-creer-conversation-2e-cycle',
      cycle:          '2e cycle du primaire (3e et 4e année)',
      description:    'Grille d\'observation — 6 critères, niveaux 1 à 4',
      educationLevel: 'primaire',
      grades:         [3, 4],
    },
    {
      label:          'Conversation orale — Arts plastiques (Créer)',
      href:           '/dashboard/evaluation/observation/arts-plastiques-creer-conversation-3e-cycle',
      cycle:          '3e cycle du primaire (5e et 6e année)',
      description:    'Grille d\'observation — 6 critères, niveaux 1 à 4',
      educationLevel: 'primaire',
      grades:         [5, 6],
    },
  ],
  'educ-physique': [
    {
      label:          'Conversation orale — Éducation physique',
      href:           '/dashboard/evaluation/observation/educ-physique-conversation-1er-cycle',
      cycle:          '1er cycle du primaire (1re et 2e année)',
      description:    'Grille d\'observation — 6 critères, niveaux 1 à 4',
      educationLevel: 'primaire',
      grades:         [1, 2],
    },
    {
      label:          'Conversation orale — Éducation physique',
      href:           '/dashboard/evaluation/observation/educ-physique-conversation-2e-cycle',
      cycle:          '2e cycle du primaire (3e et 4e année)',
      description:    'Grille d\'observation — 6 critères, niveaux 1 à 4',
      educationLevel: 'primaire',
      grades:         [3, 4],
    },
    {
      label:          'Conversation orale — Éducation physique',
      href:           '/dashboard/evaluation/observation/educ-physique-conversation-3e-cycle',
      cycle:          '3e cycle du primaire (5e et 6e année)',
      description:    'Grille d\'observation — 6 critères, niveaux 1 à 4',
      educationLevel: 'primaire',
      grades:         [5, 6],
    },
  ],
  ccq: [
    {
      label:          'Conversation orale — Culture et citoyenneté québécoise',
      href:           '/dashboard/evaluation/observation/ccq-conversation-1er-cycle',
      cycle:          '1er cycle du primaire (1re et 2e année)',
      description:    'Grille d\'observation — 6 critères, niveaux 1 à 4',
      educationLevel: 'primaire',
      grades:         [1, 2],
    },
    {
      label:          'Conversation orale — Culture et citoyenneté québécoise',
      href:           '/dashboard/evaluation/observation/ccq-conversation-2e-cycle',
      cycle:          '2e cycle du primaire (3e et 4e année)',
      description:    'Grille d\'observation — 6 critères, niveaux 1 à 4',
      educationLevel: 'primaire',
      grades:         [3, 4],
    },
    {
      label:          'Conversation orale — Culture et citoyenneté québécoise',
      href:           '/dashboard/evaluation/observation/ccq-conversation-3e-cycle',
      cycle:          '3e cycle du primaire (5e et 6e année)',
      description:    'Grille d\'observation — 6 critères, niveaux 1 à 4',
      educationLevel: 'primaire',
      grades:         [5, 6],
    },
  ],
  musique: [
    {
      label:          'Conversation orale — Musique (Apprécier)',
      href:           '/dashboard/evaluation/observation/musique-apprecier-conversation-1er-cycle',
      cycle:          '1er cycle du primaire (1re et 2e année)',
      description:    'Grille d\'observation — 6 critères, niveaux 1 à 4',
      educationLevel: 'primaire',
      grades:         [1, 2],
    },
    {
      label:          'Conversation orale — Musique (Apprécier)',
      href:           '/dashboard/evaluation/observation/musique-apprecier-conversation-2e-cycle',
      cycle:          '2e cycle du primaire (3e et 4e année)',
      description:    'Grille d\'observation — 7 critères, niveaux 1 à 4',
      educationLevel: 'primaire',
      grades:         [3, 4],
    },
    {
      label:          'Conversation orale — Musique (Apprécier)',
      href:           '/dashboard/evaluation/observation/musique-apprecier-conversation-3e-cycle',
      cycle:          '3e cycle du primaire (5e et 6e année)',
      description:    'Grille d\'observation — 6 critères, niveaux 1 à 4',
      educationLevel: 'primaire',
      grades:         [5, 6],
    },
    {
      label:          'Conversation orale — Musique (Créer)',
      href:           '/dashboard/evaluation/observation/musique-creer-conversation-1er-cycle',
      cycle:          '1er cycle du primaire (1re et 2e année)',
      description:    'Grille d\'observation — 6 critères, niveaux 1 à 4',
      educationLevel: 'primaire',
      grades:         [1, 2],
    },
    {
      label:          'Conversation orale — Musique (Créer)',
      href:           '/dashboard/evaluation/observation/musique-creer-conversation-2e-cycle',
      cycle:          '2e cycle du primaire (3e et 4e année)',
      description:    'Grille d\'observation — 6 critères, niveaux 1 à 4',
      educationLevel: 'primaire',
      grades:         [3, 4],
    },
    {
      label:          'Conversation orale — Musique (Créer)',
      href:           '/dashboard/evaluation/observation/musique-creer-conversation-3e-cycle',
      cycle:          '3e cycle du primaire (5e et 6e année)',
      description:    'Grille d\'observation — 6 critères, niveaux 1 à 4',
      educationLevel: 'primaire',
      grades:         [5, 6],
    },
  ],
}

const NAME_TO_KEY: Record<string, string> = {
  'Mathématique': 'maths',
  'Sciences et technologie': 'sciences',
  'Sciences': 'sciences',
  'Univers social': 'univers-social',
  'Musique': 'musique',
  'Arts plastiques': 'arts-plastiques',
  'Culture et citoyenneté québécoise': 'ccq',
  'Éducation physique': 'educ-physique',
}

function getConvObsTools(
  slug: string | null | undefined,
  nameFr: string | null | undefined,
  grade: { education_level: string; grade: number } | undefined,
): ConvObsTool[] {
  if (!grade) return []
  const key = (slug && CONVERSATION_OBS_TOOLS[slug]) ? slug
    : (nameFr ? NAME_TO_KEY[nameFr] : undefined)
  if (!key) return []
  return (CONVERSATION_OBS_TOOLS[key] ?? []).filter(
    t => t.educationLevel === grade.education_level && t.grades.includes(grade.grade),
  )
}

export default async function ConversationsPage({
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

  let grids: { id: string; title: string; cycle_label: string | null; competency: string | null; is_baseline: boolean }[] = []

  if (subjectId && gradeId) {
    const { data: gradeRows } = await supabase
      .from('eval_grid_grades').select('grid_id').eq('grade_level_id', gradeId)
    const gridIds = [...new Set(gradeRows?.map(r => r.grid_id) ?? [])]

    if (gridIds.length > 0) {
      const { data } = await supabase
        .from('eval_grids')
        .select('id, title, cycle_label, competency, is_baseline')
        .in('id', gridIds)
        .eq('grid_type', 'conversation')
        .eq('subject_id', subjectId)
        .order('is_baseline', { ascending: false })
        .order('title')
      const all = (data ?? []) as typeof grids
      // Keep user versions first; deduplicate by title (user version wins over baseline)
      const seen = new Set<string>()
      grids = [
        ...all.filter(g => !g.is_baseline),
        ...all.filter(g => g.is_baseline),
      ].filter(g => {
        const key = g.title.trim().toLowerCase()
        if (seen.has(key)) return false
        seen.add(key)
        return true
      })
    }
  }

  const selectedSubject = (subjects as any[])?.find((s: any) => s.id === subjectId)
  const selectedGrade   = gradeLevels?.find(g => g.id === gradeId)
  const convObsTools    = getConvObsTools(selectedSubject?.slug, selectedSubject?.name_fr, selectedGrade as any)

  return (
    <main className="min-h-screen">
      <nav className="px-6 py-4 flex items-center gap-3" style={{ backgroundColor: 'var(--color-nav)' }}>
        <Link href="/dashboard" className="text-white/70 hover:text-white text-sm">&#x2190; Tableau de bord</Link>
        <span className="text-white/40">/</span>
        <Link href="/dashboard/evaluation" className="text-white/70 hover:text-white text-sm">Outils d&apos;évaluation</Link>
        <span className="text-white/40">/</span>
        <h1 className="text-lg font-bold text-white">Conversations</h1>
      </nav>

      <div className="max-w-4xl mx-auto px-8 py-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">Conversations</h2>

        <Suspense>
          <EvaluationSelector
            subjects={subjects ?? []}
            gradeLevels={gradeLevels ?? []}
            basePath="/dashboard/evaluation/conversations"
          />
        </Suspense>

        {selectedSubject && selectedGrade && (
          <div className="mt-8">
            <div className="flex items-center gap-2 text-sm text-gray-500 mb-6">
              <span className="font-semibold text-gray-700">{selectedSubject.name_fr}</span>
              <span>·</span>
              <span>{selectedGrade.label_fr}</span>
            </div>

            {convObsTools.length === 0 && grids.length === 0 ? (
              <div className="bg-white border rounded-2xl p-8 text-center text-gray-400">
                <p>Aucune grille de conversation disponible pour cette sélection.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {convObsTools.map(tool => (
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
                {grids.map(g => (
                  <div key={g.id} className="bg-white border rounded-2xl p-5 flex items-center justify-between shadow-sm">
                    <div>
                      <p className="font-semibold text-gray-800">{g.title}</p>
                      <div className="flex items-center gap-3 mt-1">
                        {g.cycle_label && <span className="text-xs text-gray-400">{g.cycle_label}</span>}
                        {g.competency  && <span className="text-xs bg-blue-50 text-blue-600 px-2 py-0.5 rounded-full">{g.competency}</span>}
                        {!g.is_baseline && <span className="text-xs bg-indigo-50 text-indigo-600 px-2 py-0.5 rounded-full">Ma version</span>}
                      </div>
                    </div>
                    <Link
                      href={`/dashboard/evaluation/conversations/${g.id}/session`}
                      className="text-sm px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition shrink-0"
                    >
                      Remplir →
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {!selectedSubject && (
          <p className="mt-8 text-gray-400 text-sm">Sélectionnez une matière et un niveau pour afficher les grilles.</p>
        )}
      </div>
    </main>
  )
}
