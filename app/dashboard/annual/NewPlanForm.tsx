'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

const CURRENT_SCHOOL_YEAR = (() => {
  const now = new Date()
  const y = now.getFullYear()
  return now.getMonth() >= 8 ? `${y}-${y + 1}` : `${y - 1}-${y}`
})()

const SCHOOL_YEAR_OPTIONS = (() => {
  const now = new Date()
  const y = now.getFullYear()
  const base = now.getMonth() >= 8 ? y : y - 1
  return Array.from({ length: 8 }, (_, i) => {
    const start = base - 1 + i
    return `${start}-${start + 1}`
  })
})()

type Subject = { id: number; name_fr: string; color: string | null; slug?: string | null }

const PRESCOLAIRE_NAMES = new Set([
  'Développement physique et moteur',
  'Développement affectif',
  'Développement social',
  'Communication et langage',
  'Découverte du monde',
])
type GradeLevel = { id: number; label_fr: string; education_level: string; grade: number }

export default function NewPlanForm({
  subjects,
  gradeLevels,
}: {
  subjects: Subject[]
  gradeLevels: GradeLevel[]
}) {
  const router = useRouter()
  const supabase = createClient()

  const [subjectId, setSubjectId] = useState('')
  const [gradeLevelId, setGradeLevelId] = useState('')
  const [schoolYear, setSchoolYear] = useState(CURRENT_SCHOOL_YEAR)
  const [title, setTitle] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)


  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!subjectId || !gradeLevelId) {
      setError('Veuillez sélectionner une matière et un niveau.')
      return
    }
    setLoading(true)
    setError('')

    const { data: { user } } = await supabase.auth.getUser()
    if (!user) { setError('Non authentifié.'); setLoading(false); return }

    const { data, error: dbError } = await supabase
      .from('annual_plans')
      .insert({
        user_id: user.id,
        school_year: schoolYear,
        subject_id: subjectId === 'multi' ? null : Number(subjectId),
        grade_level_id: Number(gradeLevelId),
        title: title || null,
      })
      .select('id')
      .single()

    if (dbError) {
      setError(dbError.message)
      setLoading(false)
    } else {
      router.push(`/dashboard/annual/${data.id}`)
    }
  }

  const primaireSubjects    = subjects.filter(s => !PRESCOLAIRE_NAMES.has(s.name_fr))
  const prescolaireSubjects = subjects.filter(s =>  PRESCOLAIRE_NAMES.has(s.name_fr))

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-4">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Matière</label>
          <select
            value={subjectId}
            onChange={e => setSubjectId(e.target.value)}
            required
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
          >
            <option value="">Sélectionner...</option>
            <option value="multi">🔗 Toutes les matières (interdisciplinaire)</option>
            <optgroup label="Matières">
              {primaireSubjects.map(s => (
                <option key={s.id} value={s.id}>{s.name_fr}</option>
              ))}
            </optgroup>
            {prescolaireSubjects.length > 0 && (
              <optgroup label="Préscolaire — 5 domaines">
                {prescolaireSubjects.map(s => (
                  <option key={s.id} value={s.id}>{s.name_fr}</option>
                ))}
              </optgroup>
            )}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Niveau</label>
          <select
            value={gradeLevelId}
            onChange={e => setGradeLevelId(e.target.value)}
            required
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
          >
            <option value="">Sélectionner...</option>
            {gradeLevels.map(g => <option key={g.id} value={g.id}>{g.label_fr}</option>)}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Année scolaire</label>
          <select
            value={schoolYear}
            onChange={e => setSchoolYear(e.target.value)}
            required
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
          >
            {SCHOOL_YEAR_OPTIONS.map(y => (
              <option key={y} value={y}>{y}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Titre (optionnel)</label>
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="ex: Groupe A"
            className="w-full border border-gray-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
          />
        </div>
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <button
        type="submit"
        disabled={loading}
        className="self-start bg-indigo-600 text-white px-6 py-3 rounded-xl font-semibold text-sm hover:bg-indigo-700 transition disabled:opacity-50"
      >
        {loading ? 'Création...' : 'Créer la planification'}
      </button>
    </form>
  )
}
