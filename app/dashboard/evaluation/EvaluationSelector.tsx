'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'

type Subject    = { id: number; name_fr: string }
type GradeLevel = { id: number; label_fr: string; education_level: string; grade: number }

export default function EvaluationSelector({
  subjects,
  gradeLevels,
  basePath,
  availableCompetencies = [],
}: {
  subjects:               Subject[]
  gradeLevels:            GradeLevel[]
  basePath:               string
  availableCompetencies?: string[]
}) {
  const router       = useRouter()
  const searchParams = useSearchParams()
  const [subjectId,  setSubjectId]  = useState(searchParams.get('subjectId')  ?? '')
  const [gradeId,    setGradeId]    = useState(searchParams.get('gradeId')    ?? '')
  const [competency, setCompetency] = useState(searchParams.get('competency') ?? '')

  function handleSubmit(e: { preventDefault(): void }) {
    e.preventDefault()
    if (!subjectId || !gradeId) return
    let url = `${basePath}?subjectId=${subjectId}&gradeId=${gradeId}`
    if (competency) url += `&competency=${encodeURIComponent(competency)}`
    router.push(url)
  }

  // Reset competency when subject or grade changes
  function handleSubjectChange(val: string) {
    setSubjectId(val)
    setCompetency('')
  }
  function handleGradeChange(val: string) {
    setGradeId(val)
    setCompetency('')
  }


  return (
    <form onSubmit={handleSubmit} className="flex flex-wrap items-end gap-3 bg-white border rounded-2xl p-5 shadow-sm">
      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">Matière</label>
        <select
          value={subjectId}
          onChange={e => handleSubjectChange(e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
        >
          <option value="">Sélectionner...</option>
          <optgroup label="Matières">
            {subjects.map(s => <option key={s.id} value={s.id}>{s.name_fr}</option>)}
          </optgroup>
          <optgroup label="Autre">
            <option value="interdisciplinaire">Grilles interdisciplinaires</option>
          </optgroup>
        </select>
      </div>

      <div>
        <label className="block text-xs font-medium text-gray-600 mb-1">Niveau</label>
        <select
          value={gradeId}
          onChange={e => handleGradeChange(e.target.value)}
          className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
        >
          <option value="">Sélectionner...</option>
          {gradeLevels.map(g => <option key={g.id} value={g.id}>{g.label_fr}</option>)}
        </select>
      </div>

      {availableCompetencies.length > 0 && (
        <div>
          <label className="block text-xs font-medium text-gray-600 mb-1">Compétence</label>
          <select
            value={competency}
            onChange={e => setCompetency(e.target.value)}
            className="border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
          >
            <option value="">Toutes les compétences</option>
            {availableCompetencies.map(c => <option key={c} value={c}>{c}</option>)}
            <option value="multi">Multi-compétences</option>
          </select>
        </div>
      )}

      <button
        type="submit"
        className="bg-blue-600 text-white px-5 py-2 rounded-lg text-sm font-semibold hover:bg-blue-700 transition"
      >
        Voir
      </button>
    </form>
  )
}
