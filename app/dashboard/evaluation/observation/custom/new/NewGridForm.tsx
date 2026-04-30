'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createDefinition } from './actions'

type Subject    = { id: number; name_fr: string }
type GradeLevel = { id: number; label_fr: string }
type CriterionDraft = { id: number; label: string; description: string }

export default function NewGridForm({
  subjects,
  gradeLevels,
  defaultSubjectId = '',
  defaultGradeId   = '',
}: {
  subjects:         Subject[]
  gradeLevels:      GradeLevel[]
  defaultSubjectId?: string
  defaultGradeId?:  string
}) {
  const router = useRouter()
  const [title,        setTitle]        = useState('')
  const [subjectId,    setSubjectId]    = useState(defaultSubjectId)
  const [gradeLevelId, setGradeLevelId] = useState(defaultGradeId)
  const [criteria,     setCriteria]     = useState<CriterionDraft[]>([
    { id: 1, label: '', description: '' },
    { id: 2, label: '', description: '' },
  ])
  const [nextId,   setNextId]   = useState(3)
  const [error,    setError]    = useState('')
  const [loading,  setLoading]  = useState(false)

  function addCriterion() {
    setCriteria(prev => [...prev, { id: nextId, label: '', description: '' }])
    setNextId(n => n + 1)
  }

  function removeCriterion(id: number) {
    setCriteria(prev => prev.filter(c => c.id !== id))
  }

  function updateCriterion(id: number, field: 'label' | 'description', value: string) {
    setCriteria(prev => prev.map(c => c.id === id ? { ...c, [field]: value } : c))
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError('')

    if (!title.trim())  { setError('Veuillez donner un titre à la grille.'); return }

    const validCriteria = criteria.filter(c => c.label.trim())
    if (validCriteria.length < 2) { setError('Ajoutez au moins 2 critères.'); return }

    setLoading(true)
    const result = await createDefinition({
      title,
      subjectId,
      gradeLevelId,
      criteria: validCriteria,
    })

    if ('error' in result) {
      setError(result.error)
      setLoading(false)
      return
    }
    router.push(`/dashboard/evaluation/observation/custom/${result.id}`)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-5">
        <h3 className="text-sm font-semibold text-gray-700">Informations générales</h3>

        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Titre de la grille *</label>
          <input
            type="text"
            value={title}
            onChange={e => setTitle(e.target.value)}
            placeholder="ex: Exposé oral — Projet patrimoine"
            className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
            required
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Matière (optionnel)</label>
            <select
              value={subjectId}
              onChange={e => setSubjectId(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
            >
              <option value="">Aucune</option>
              {subjects.map(s => <option key={s.id} value={s.id}>{s.name_fr}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-xs font-medium text-gray-600 mb-1">Niveau (optionnel)</label>
            <select
              value={gradeLevelId}
              onChange={e => setGradeLevelId(e.target.value)}
              className="w-full border border-gray-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
            >
              <option value="">Aucun</option>
              {gradeLevels.map(g => <option key={g.id} value={g.id}>{g.label_fr}</option>)}
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white border border-gray-200 rounded-2xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-semibold text-gray-700">Critères d&apos;observation</h3>
          <span className="text-xs text-gray-400">{criteria.filter(c => c.label.trim()).length} critère(s)</span>
        </div>

        <div className="space-y-3">
          {criteria.map((c, i) => (
            <div key={c.id} className="flex gap-3 items-start group">
              <span className="shrink-0 w-6 h-6 mt-2.5 flex items-center justify-center rounded-full bg-gray-100 text-xs font-semibold text-gray-500">
                {i + 1}
              </span>
              <div className="flex-1 space-y-1.5">
                <input
                  type="text"
                  value={c.label}
                  onChange={e => updateCriterion(c.id, 'label', e.target.value)}
                  placeholder="Nom du critère (ex: Clarté)"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-300"
                />
                <input
                  type="text"
                  value={c.description}
                  onChange={e => updateCriterion(c.id, 'description', e.target.value)}
                  placeholder="Description (optionnel)"
                  className="w-full border border-gray-200 rounded-lg px-3 py-2 text-xs text-gray-600 focus:outline-none focus:ring-2 focus:ring-indigo-300"
                />
              </div>
              {criteria.length > 1 && (
                <button
                  type="button"
                  onClick={() => removeCriterion(c.id)}
                  className="shrink-0 mt-2.5 text-gray-300 hover:text-red-400 transition text-base leading-none"
                >
                  ✕
                </button>
              )}
            </div>
          ))}
        </div>

        <button
          type="button"
          onClick={addCriterion}
          disabled={criteria.length >= 12}
          className="text-xs px-4 py-2 rounded-lg border border-dashed border-gray-300 text-gray-500 hover:border-indigo-300 hover:text-indigo-600 transition disabled:opacity-40"
        >
          + Ajouter un critère
        </button>
      </div>

      {error && <p className="text-red-500 text-sm">{error}</p>}

      <div className="flex items-center gap-4">
        <button
          type="submit"
          disabled={loading}
          className="bg-indigo-600 text-white px-6 py-2.5 rounded-xl font-semibold text-sm hover:bg-indigo-700 transition disabled:opacity-50"
        >
          {loading ? 'Création…' : 'Créer la grille'}
        </button>
        <a
          href="/dashboard/evaluation/observation"
          className="text-sm text-gray-400 hover:text-gray-600 transition"
        >
          Annuler
        </a>
      </div>
    </form>
  )
}
