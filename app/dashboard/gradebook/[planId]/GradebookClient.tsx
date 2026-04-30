'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'
import {
  addStudent, addStudentsBulk, removeStudent,
  updateEtape, addEtape, removeEtape,
  addEvaluation, updateEvaluation, removeEvaluation,
  saveGrade, saveOverride,
} from './actions'

type Tab = 'resultats' | 'eleves' | 'configuration' | 'grilles'

interface Student { id: string; name: string; sort_order: number }
interface Etape { id: string; name: string; weight: number; sort_order: number }
interface Evaluation { id: string; etape_id: string; name: string; weight: number; grading_type: 'numeric' | 'letter'; sort_order: number; link_id?: string | null }
interface GradeRow { student_id: string; evaluation_id: string; grade: string | null }
interface OverrideRow { student_id: string; etape_id: string; grade: string | null }

const LETTER_OPTIONS = ['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D', 'E', 'F']
const LETTER_TO_NUM: Record<string, number> = {
  'A+': 100, 'A': 95, 'A-': 90,
  'B+': 85, 'B': 80, 'B-': 75,
  'C+': 70, 'C': 65, 'C-': 60,
  'D': 55, 'E': 45, 'F': 30,
}
const ETAPE_COLORS = ['#4A8AB8', '#16A34A', '#D97706', '#7C3AED', '#DC2626', '#0891B2']

function gradeToNum(grade: string | undefined, type: 'numeric' | 'letter'): number | null {
  if (!grade) return null
  if (type === 'letter') return LETTER_TO_NUM[grade] ?? null
  const n = parseFloat(grade)
  return isNaN(n) ? null : Math.max(0, Math.min(100, n))
}

function calcEtapeAvg(studentId: string, etapeId: string, evaluations: Evaluation[], grades: Record<string, string>): number | null {
  const evs = evaluations.filter(e => e.etape_id === etapeId)
  let totalW = 0, sum = 0
  for (const ev of evs) {
    const n = gradeToNum(grades[`${studentId}::${ev.id}`], ev.grading_type)
    if (n === null) continue
    sum += n * ev.weight
    totalW += ev.weight
  }
  return totalW === 0 ? null : sum / totalW
}

function calcFinal(studentId: string, etapes: Etape[], evaluations: Evaluation[], grades: Record<string, string>): number | null {
  let totalW = 0, sum = 0
  for (const et of etapes) {
    const avg = calcEtapeAvg(studentId, et.id, evaluations, grades)
    if (avg === null) continue
    sum += avg * et.weight
    totalW += et.weight
  }
  return totalW === 0 ? null : sum / totalW
}

function fmt(n: number | null): string {
  return n === null ? '—' : n.toFixed(1)
}

const OBS_BG: Record<number, string> = {
  1: 'bg-red-300', 2: 'bg-yellow-200', 3: 'bg-green-200', 4: 'bg-green-400',
}

interface Props {
  planId: string
  gradeBookId: string
  initialStudents: Student[]
  initialEtapes: Etape[]
  initialEvaluations: Evaluation[]
  initialGrades: GradeRow[]
  initialOverrides: OverrideRow[]
  observationTypes: string[]
  observationJugements: Record<string, Record<string, Record<number, number>>>
  convJugements: Record<string, Record<number, { lecture: string; oral: string }>>
}

export default function GradebookClient({
  planId,
  gradeBookId,
  initialStudents,
  initialEtapes,
  initialEvaluations,
  initialGrades,
  initialOverrides,
  observationTypes,
  observationJugements,
  convJugements,
}: Props) {
  const [tab, setTab] = useState<Tab>('resultats')
  const [students, setStudents] = useState<Student[]>(initialStudents)
  const [etapes, setEtapes] = useState<Etape[]>(initialEtapes)
  const [evaluations, setEvaluations] = useState<Evaluation[]>(initialEvaluations)

  const [grades, setGrades] = useState<Record<string, string>>(() => {
    const map: Record<string, string> = {}
    for (const g of initialGrades) if (g.grade) map[`${g.student_id}::${g.evaluation_id}`] = g.grade
    return map
  })

  const [overrides, setOverrides] = useState<Record<string, string>>(() => {
    const map: Record<string, string> = {}
    for (const o of initialOverrides) if (o.grade) map[`${o.student_id}::${o.etape_id}`] = o.grade
    return map
  })

  const debounceTimers = useRef<Record<string, ReturnType<typeof setTimeout>>>({})
  const [newName, setNewName] = useState('')
  const [bulkText, setBulkText] = useState('')
  const [showBulk, setShowBulk] = useState(false)

  // ── Grade handlers ────────────────────────────────────────

  function handleGradeChange(studentId: string, evaluationId: string, value: string) {
    const key = `${studentId}::${evaluationId}`
    setGrades(prev => ({ ...prev, [key]: value }))
    clearTimeout(debounceTimers.current[key])
    debounceTimers.current[key] = setTimeout(() => saveGrade(studentId, evaluationId, value), 600)
  }

  function handleGradeBlur(studentId: string, evaluationId: string, value: string) {
    clearTimeout(debounceTimers.current[`${studentId}::${evaluationId}`])
    saveGrade(studentId, evaluationId, value)
  }

  function handleOverrideChange(studentId: string, etapeId: string, value: string) {
    setOverrides(prev => ({ ...prev, [`${studentId}::${etapeId}`]: value }))
    saveOverride(studentId, etapeId, value)
  }

  // ── Student handlers ──────────────────────────────────────

  async function handleAddStudent(e: { preventDefault(): void }) {
    e.preventDefault()
    if (!newName.trim() || students.length >= 45) return
    const s = await addStudent(gradeBookId, newName)
    setStudents(prev => [...prev, s])
    setNewName('')
  }

  async function handleBulkAdd() {
    const names = bulkText.split('\n').map(n => n.trim()).filter(n => n)
    const remaining = 45 - students.length
    const toAdd = names.slice(0, remaining)
    if (!toAdd.length) return
    const added = await addStudentsBulk(gradeBookId, toAdd)
    setStudents(prev => [...prev, ...added])
    setBulkText('')
    setShowBulk(false)
  }

  async function handleRemoveStudent(studentId: string) {
    if (!confirm('Supprimer cet élève et toutes ses notes ?')) return
    await removeStudent(studentId)
    setStudents(prev => prev.filter(s => s.id !== studentId))
    setGrades(prev => { const n = { ...prev }; Object.keys(n).forEach(k => { if (k.startsWith(studentId + '::')) delete n[k] }); return n })
    setOverrides(prev => { const n = { ...prev }; Object.keys(n).forEach(k => { if (k.startsWith(studentId + '::')) delete n[k] }); return n })
  }

  // ── Étape / Evaluation handlers ───────────────────────────

  async function handleAddEtape() {
    const et = await addEtape(gradeBookId, `Étape ${etapes.length + 1}`, etapes.length + 1)
    setEtapes(prev => [...prev, et])
  }

  async function handleRemoveEtape(etapeId: string) {
    if (!confirm('Supprimer cette étape et toutes ses évaluations ?')) return
    await removeEtape(etapeId)
    setEtapes(prev => prev.filter(e => e.id !== etapeId))
    setEvaluations(prev => prev.filter(ev => ev.etape_id !== etapeId))
  }

  async function handleEtapeField(etapeId: string, field: 'name' | 'weight', value: string) {
    const updates = field === 'weight' ? { weight: parseFloat(value) || 0 } : { name: value }
    setEtapes(prev => prev.map(e => e.id === etapeId ? { ...e, ...updates } : e))
    await updateEtape(etapeId, updates)
  }

  async function handleAddEval(etapeId: string) {
    const count = evaluations.filter(e => e.etape_id === etapeId).length
    const ev = await addEvaluation(etapeId, 'Évaluation', 100, 'numeric', count + 1)
    setEvaluations(prev => [...prev, ev])
  }

  async function handleRemoveEval(evalId: string) {
    await removeEvaluation(evalId)
    setEvaluations(prev => prev.filter(e => e.id !== evalId))
  }

  async function handleEvalField(
    evalId: string,
    field: 'name' | 'weight' | 'grading_type',
    value: string
  ) {
    const updates =
      field === 'weight' ? { weight: parseFloat(value) || 0 }
      : field === 'grading_type' ? { grading_type: value as 'numeric' | 'letter' }
      : { name: value }
    setEvaluations(prev => prev.map(e => e.id === evalId ? { ...e, ...updates } as Evaluation : e))
    await updateEvaluation(evalId, updates)
  }

  // ── Render tabs ───────────────────────────────────────────

  const totalEtapeWeight = etapes.reduce((s, e) => s + Number(e.weight), 0)

  return (
    <div className="flex flex-col gap-0">
      {/* Tab bar */}
      <div className="flex gap-1 mb-0 flex-wrap">
        {(['resultats', 'eleves', 'configuration', 'grilles'] as Tab[]).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-5 py-2 rounded-t-xl text-sm font-medium transition border-b-0 ${
              tab === t
                ? 'bg-white text-gray-800 shadow border border-gray-200 border-b-white relative z-10'
                : 'bg-gray-100 text-gray-500 hover:bg-gray-200 border border-transparent'
            }`}
          >
            {t === 'resultats' ? 'Résultats'
              : t === 'eleves' ? `Élèves (${students.length})`
              : t === 'grilles' ? 'Grilles d\'évaluation'
              : 'Configuration'}
          </button>
        ))}
      </div>

      <div className="bg-white rounded-b-2xl rounded-tr-2xl border border-gray-200 shadow-sm">

        {/* ── ÉLÈVES ────────────────────────────────────── */}
        {tab === 'eleves' && (
          <div className="p-6 max-w-lg">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold text-gray-700">Liste des élèves</h2>
              <span className="text-xs text-gray-400">{students.length} / 45</span>
            </div>

            <form onSubmit={handleAddStudent} className="flex gap-2 mb-4">
              <input
                type="text"
                value={newName}
                onChange={e => setNewName(e.target.value)}
                placeholder="Nom de l'élève"
                className="flex-1 border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
              />
              <button
                type="submit"
                disabled={students.length >= 45}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600 disabled:opacity-40"
              >
                Ajouter
              </button>
            </form>

            <button
              onClick={() => setShowBulk(v => !v)}
              className="text-xs text-blue-500 hover:underline mb-3 block"
            >
              {showBulk ? '▲ Masquer' : '▼ Coller une liste (un nom par ligne)'}
            </button>

            {showBulk && (
              <div className="mb-4">
                <textarea
                  value={bulkText}
                  onChange={e => setBulkText(e.target.value)}
                  rows={6}
                  placeholder={"Alice Tremblay\nBob Martin\nClara Dubois"}
                  className="w-full border rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 mb-2"
                />
                <button
                  onClick={handleBulkAdd}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600"
                >
                  Importer
                </button>
              </div>
            )}

            <ul className="divide-y border rounded-xl overflow-hidden">
              {students.map((s, i) => (
                <li key={s.id} className="flex items-center justify-between px-4 py-2 hover:bg-gray-50">
                  <span className="text-sm text-gray-400 w-6">{i + 1}.</span>
                  <span className="flex-1 text-sm text-gray-700">{s.name}</span>
                  <button
                    onClick={() => handleRemoveStudent(s.id)}
                    className="text-red-400 hover:text-red-600 text-xs px-2"
                  >
                    ✕
                  </button>
                </li>
              ))}
              {students.length === 0 && (
                <li className="px-4 py-4 text-sm text-gray-400 text-center">Aucun élève ajouté</li>
              )}
            </ul>
          </div>
        )}

        {/* ── CONFIGURATION ─────────────────────────────── */}
        {tab === 'configuration' && (
          <div className="p-6">
            <div className="flex items-center justify-between mb-1">
              <h2 className="font-semibold text-gray-700">Étapes et évaluations</h2>
              <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${Math.abs(totalEtapeWeight - 100) < 0.1 ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                Total : {totalEtapeWeight.toFixed(0)}%
                {Math.abs(totalEtapeWeight - 100) >= 0.1 && ' ⚠ doit égaler 100%'}
              </span>
            </div>
            <p className="text-xs text-gray-400 mb-6">Les poids (%) déterminent la contribution de chaque étape au résultat final.</p>

            <div className="space-y-6">
              {etapes.map((et, ei) => {
                const color = ETAPE_COLORS[ei % ETAPE_COLORS.length]
                const etEvals = evaluations.filter(ev => ev.etape_id === et.id)
                const totalEvalW = etEvals.reduce((s, ev) => s + Number(ev.weight), 0)
                return (
                  <div key={et.id} className="border rounded-xl overflow-hidden">
                    <div className="flex items-center gap-3 px-4 py-3" style={{ backgroundColor: color + '20', borderBottom: `2px solid ${color}` }}>
                      <input
                        type="text"
                        defaultValue={et.name}
                        onBlur={e => handleEtapeField(et.id, 'name', e.target.value)}
                        className="flex-1 font-semibold bg-transparent border-b border-transparent focus:border-gray-400 focus:outline-none text-sm"
                        style={{ color }}
                      />
                      <div className="flex items-center gap-1">
                        <input
                          type="number"
                          min="0" max="100" step="1"
                          defaultValue={et.weight}
                          onBlur={e => handleEtapeField(et.id, 'weight', e.target.value)}
                          className="w-16 text-center border rounded px-1 py-0.5 text-sm bg-white"
                        />
                        <span className="text-xs text-gray-500">%</span>
                      </div>
                      <button onClick={() => handleRemoveEtape(et.id)} className="text-red-400 hover:text-red-600 text-xs ml-2">✕</button>
                    </div>

                    <div className="p-3 space-y-2">
                      {etEvals.length > 0 && (
                        <div className="flex items-center gap-1 text-xs text-gray-400 px-2 mb-1">
                          <span className="flex-1">Nom de l'évaluation</span>
                          <span className="w-20 text-center">Poids (%)</span>
                          <span className="w-24 text-center">Type</span>
                          <span className="w-6" />
                        </div>
                      )}
                      {etEvals.map(ev => (
                        <div key={ev.id} className={`flex items-center gap-1 ${ev.link_id ? 'bg-blue-50/60 rounded-lg px-2 py-0.5' : ''}`}>
                          {ev.link_id ? (
                            <div className="flex-1 flex items-center gap-2 min-w-0">
                              <span className="text-xs font-medium text-blue-600 bg-blue-100 px-1.5 py-0.5 rounded shrink-0">📊 Grille</span>
                              <span className="text-sm text-gray-700 truncate">{ev.name}</span>
                            </div>
                          ) : (
                            <input
                              type="text"
                              defaultValue={ev.name}
                              onBlur={e => handleEvalField(ev.id, 'name', e.target.value)}
                              className="flex-1 border rounded px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-blue-300"
                            />
                          )}
                          <input
                            type="number"
                            min="0" max="100" step="1"
                            defaultValue={ev.weight}
                            onBlur={e => handleEvalField(ev.id, 'weight', e.target.value)}
                            className="w-20 text-center border rounded px-1 py-1 text-sm"
                          />
                          {ev.link_id ? (
                            <span className="w-24 text-center text-xs text-blue-500">Lettre</span>
                          ) : (
                            <select
                              value={ev.grading_type}
                              onChange={e => handleEvalField(ev.id, 'grading_type', e.target.value)}
                              className="w-24 border rounded px-1 py-1 text-xs"
                            >
                              <option value="numeric">Chiffré</option>
                              <option value="letter">Lettre</option>
                            </select>
                          )}
                          <button onClick={() => handleRemoveEval(ev.id)} className="w-6 text-red-400 hover:text-red-600 text-xs">✕</button>
                        </div>
                      ))}
                      {etEvals.length > 0 && (
                        <p className={`text-xs mt-1 px-1 ${Math.abs(totalEvalW - 100) < 0.1 ? 'text-gray-400' : 'text-orange-500'}`}>
                          Total poids évaluations : {totalEvalW.toFixed(0)}%
                        </p>
                      )}
                      <button
                        onClick={() => handleAddEval(et.id)}
                        className="mt-1 text-xs text-blue-500 hover:underline"
                      >
                        + Ajouter une évaluation
                      </button>
                    </div>
                  </div>
                )
              })}
            </div>

            <button
              onClick={handleAddEtape}
              className="mt-5 px-4 py-2 border-2 border-dashed border-gray-300 text-gray-500 hover:border-blue-400 hover:text-blue-500 rounded-xl text-sm w-full transition"
            >
              + Ajouter une étape
            </button>
          </div>
        )}

        {/* ── RÉSULTATS ─────────────────────────────────── */}
        {tab === 'resultats' && (
          <div className="p-4">
            {students.length === 0 && (
              <p className="text-sm text-gray-400 py-6 text-center">
                Aucun élève.{' '}
                <button onClick={() => setTab('eleves')} className="text-blue-500 underline">Ajoutez des élèves</button>
                {' '}pour commencer.
              </p>
            )}
            {students.length > 0 && evaluations.length === 0 && (
              <p className="text-sm text-gray-400 py-6 text-center">
                Aucune évaluation.{' '}
                <button onClick={() => setTab('configuration')} className="text-blue-500 underline">Configurez des évaluations</button>
                {' '}pour saisir des notes.
              </p>
            )}
            {students.length > 0 && evaluations.length > 0 && (
              <div className="overflow-x-auto">
                <table className="border-collapse text-sm" style={{ minWidth: 'max-content' }}>
                  <thead>
                    {/* Row 1: étape headers */}
                    <tr>
                      <th
                        rowSpan={2}
                        className="sticky left-0 z-20 bg-white border border-gray-200 px-4 py-2 text-left font-semibold text-gray-700 min-w-40"
                      >
                        Nom
                      </th>
                      {etapes.map((et, ei) => {
                        const evs = evaluations.filter(ev => ev.etape_id === et.id)
                        if (evs.length === 0) return null
                        const color = ETAPE_COLORS[ei % ETAPE_COLORS.length]
                        return (
                          <th
                            key={et.id}
                            colSpan={evs.length + 2 + observationTypes.length + 2}
                            className="border border-gray-200 px-2 py-2 text-center font-semibold text-white text-xs"
                            style={{ backgroundColor: color }}
                          >
                            {et.name} ({et.weight}%)
                          </th>
                        )
                      })}
                      <th
                        rowSpan={2}
                        className="border border-gray-200 px-3 py-2 text-center font-semibold text-gray-700 text-xs bg-gray-100 min-w-20"
                      >
                        Résultat final
                      </th>
                    </tr>
                    {/* Row 2: evaluation headers */}
                    <tr>
                      {etapes.map((et, ei) => {
                        const evs = evaluations.filter(ev => ev.etape_id === et.id)
                        if (evs.length === 0) return null
                        const color = ETAPE_COLORS[ei % ETAPE_COLORS.length]
                        return evs.map(ev => (
                          <th
                            key={ev.id}
                            className="border border-gray-200 px-2 py-1 text-center text-xs font-medium max-w-28"
                            style={{ backgroundColor: color + '18', color: '#444' }}
                          >
                            <span className="block truncate max-w-24" title={ev.name}>{ev.name}</span>
                            <span className="text-gray-400 font-normal">{ev.weight}%</span>
                            {ev.link_id && <span className="block text-blue-400 font-normal mt-0.5" title="Liée à une grille d'évaluation">grille ↗</span>}
                          </th>
                        )).concat([
                          <th key={et.id + '-avg'} className="border border-gray-200 px-2 py-1 text-center text-xs font-medium bg-gray-50 text-gray-500 min-w-16">Moy.</th>,
                          <th key={et.id + '-jug'} className="border border-gray-200 px-2 py-1 text-center text-xs font-medium bg-gray-50 text-gray-500 min-w-20">Jugement</th>,
                          ...observationTypes.map(type => (
                            <th key={et.id + '-obs-' + type} className="border border-gray-200 px-2 py-1 text-center text-xs font-medium bg-indigo-50 text-indigo-600 min-w-20">{type}</th>
                          )),
                          <th key={et.id + '-conv-l'} className="border border-gray-200 px-2 py-1 text-center text-xs font-medium bg-violet-50 text-violet-600 min-w-20">Entretien : lecture</th>,
                          <th key={et.id + '-conv-o'} className="border border-gray-200 px-2 py-1 text-center text-xs font-medium bg-violet-50 text-violet-600 min-w-20">Entretien : oral</th>,
                        ])
                      })}
                    </tr>
                  </thead>

                  <tbody>
                    {students.map((s, si) => {
                      const finalGrade = calcFinal(s.id, etapes, evaluations, grades)
                      return (
                        <tr key={s.id} className={si % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                          <td className="sticky left-0 z-10 border border-gray-200 px-4 py-1.5 font-medium text-gray-700 text-sm"
                            style={{ backgroundColor: si % 2 === 0 ? '#fff' : '#f9fafb' }}>
                            {s.name}
                          </td>
                          {etapes.map(et => {
                            const evs = evaluations.filter(ev => ev.etape_id === et.id)
                            if (evs.length === 0) return null
                            const avg = calcEtapeAvg(s.id, et.id, evaluations, grades)
                            const override = overrides[`${s.id}::${et.id}`] ?? ''
                            return [
                              ...evs.map(ev => {
                                const grade = grades[`${s.id}::${ev.id}`]
                                // Linked evaluations: read-only badge set from the rubric grid
                                if (ev.link_id) {
                                  return (
                                    <td key={ev.id} className="border border-gray-200 px-2 py-1 text-center">
                                      {grade
                                        ? <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-100 text-blue-800">{grade}</span>
                                        : <span className="text-gray-300 text-xs">—</span>
                                      }
                                    </td>
                                  )
                                }
                                return (
                                  <td key={ev.id} className="border border-gray-200 px-1 py-1 text-center">
                                    {ev.grading_type === 'letter' ? (
                                      <select
                                        value={grade ?? ''}
                                        onChange={e => handleGradeChange(s.id, ev.id, e.target.value)}
                                        className="w-16 text-center border-0 bg-transparent text-sm focus:outline-none focus:ring-1 focus:ring-blue-300 rounded"
                                      >
                                        <option value="">—</option>
                                        {LETTER_OPTIONS.map(l => <option key={l} value={l}>{l}</option>)}
                                      </select>
                                    ) : (
                                      <input
                                        type="number"
                                        min="0" max="100" step="0.5"
                                        value={grade ?? ''}
                                        onChange={e => handleGradeChange(s.id, ev.id, e.target.value)}
                                        onBlur={e => handleGradeBlur(s.id, ev.id, e.target.value)}
                                        placeholder="—"
                                        className="w-16 text-center border-0 bg-transparent text-sm focus:outline-none focus:ring-1 focus:ring-blue-300 rounded"
                                      />
                                    )}
                                  </td>
                                )
                              }),
                              <td key={et.id + '-avg'} className="border border-gray-200 px-2 py-1 text-center text-sm text-gray-600 bg-blue-50/30 font-medium">
                                {fmt(avg)}
                              </td>,
                              <td key={et.id + '-jug'} className="border border-gray-200 px-1 py-1 text-center">
                                <input
                                  type="text"
                                  value={override}
                                  onChange={e => handleOverrideChange(s.id, et.id, e.target.value)}
                                  placeholder="—"
                                  maxLength={4}
                                  className="w-16 text-center border-0 bg-transparent text-sm font-semibold text-indigo-700 focus:outline-none focus:ring-1 focus:ring-indigo-300 rounded placeholder-gray-300"
                                />
                              </td>,
                              ...observationTypes.map(type => {
                                const score = observationJugements[type]?.[s.name]?.[et.sort_order] ?? null
                                const bg = score ? OBS_BG[score] : ''
                                return (
                                  <td key={et.id + '-obs-' + type} className={`border border-gray-200 px-2 py-1 text-center text-sm font-bold ${bg || 'text-gray-300'}`}>
                                    {score ?? '—'}
                                  </td>
                                )
                              }),
                              (() => {
                                const key = s.name.trim().toLowerCase()
                                const jug = convJugements[key]?.[et.sort_order]
                                function jugCls(val: string | undefined) {
                                  const n = parseInt(val ?? '', 10)
                                  if (n === 1) return 'bg-red-100 text-red-700'
                                  if (n === 2) return 'bg-yellow-100 text-yellow-700'
                                  if (n === 3) return 'bg-green-100 text-green-700'
                                  if (n === 4) return 'bg-green-200 text-green-800'
                                  return 'bg-violet-50/40 text-violet-300'
                                }
                                return [
                                  <td key={et.id + '-conv-l'} className={`border border-gray-200 px-2 py-1 text-center text-sm font-semibold ${jugCls(jug?.lecture)}`}>
                                    {jug?.lecture || '—'}
                                  </td>,
                                  <td key={et.id + '-conv-o'} className={`border border-gray-200 px-2 py-1 text-center text-sm font-semibold ${jugCls(jug?.oral)}`}>
                                    {jug?.oral || '—'}
                                  </td>,
                                ]
                              })(),
                            ]
                          })}
                          <td className="border border-gray-200 px-2 py-1 text-center text-sm font-bold text-gray-700 bg-gray-100">
                            {fmt(finalGrade)}
                          </td>
                        </tr>
                      )
                    })}

                    {/* Class average row */}
                    <tr className="border-t-2 border-gray-400 bg-gray-100">
                      <td className="sticky left-0 z-10 border border-gray-300 px-4 py-1.5 font-bold text-gray-600 text-xs bg-gray-100">
                        Moy. classe
                      </td>
                      {etapes.map(et => {
                        const evs = evaluations.filter(ev => ev.etape_id === et.id)
                        if (evs.length === 0) return null
                        return [
                          ...evs.map(ev => {
                            const vals = students.map(s => gradeToNum(grades[`${s.id}::${ev.id}`], ev.grading_type)).filter(v => v !== null) as number[]
                            const classAvg = vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : null
                            return (
                              <td key={ev.id} className="border border-gray-200 px-2 py-1 text-center text-xs text-gray-500">
                                {fmt(classAvg)}
                              </td>
                            )
                          }),
                          <td key={et.id + '-avg'} className="border border-gray-200 px-2 py-1 text-center text-xs font-semibold text-gray-600 bg-blue-50/30">
                            {fmt((() => {
                              const vals = students.map(s => calcEtapeAvg(s.id, et.id, evaluations, grades)).filter(v => v !== null) as number[]
                              return vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : null
                            })())}
                          </td>,
                          <td key={et.id + '-jug'} className="border border-gray-200 bg-gray-50" />,
                          ...observationTypes.map(type => (
                            <td key={et.id + '-obs-' + type} className="border border-gray-200 bg-gray-50" />
                          )),
                          <td key={et.id + '-conv-l'} className="border border-gray-200 bg-gray-50" />,
                          <td key={et.id + '-conv-o'} className="border border-gray-200 bg-gray-50" />,
                        ]
                      })}
                      <td className="border border-gray-300 px-2 py-1 text-center text-xs font-bold text-gray-600 bg-gray-200">
                        {fmt((() => {
                          const vals = students.map(s => calcFinal(s.id, etapes, evaluations, grades)).filter(v => v !== null) as number[]
                          return vals.length ? vals.reduce((a, b) => a + b, 0) / vals.length : null
                        })())}
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {/* ── GRILLES D'ÉVALUATION ──────────────────────── */}
        {tab === 'grilles' && (
          <div className="p-8 flex flex-col items-center gap-4">
            <p className="text-gray-500 text-sm text-center max-w-sm">
              Consultez et remplissez les grilles d&apos;évaluation par élève, ou visualisez les résultats regroupés par compétence.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 mt-2">
              <Link
                href={`/dashboard/gradebook/${planId}/grilles`}
                className="px-6 py-3 border border-gray-200 text-gray-700 rounded-xl text-sm font-medium hover:bg-gray-50 transition text-center"
              >
                Suivi par élève (matrice)
              </Link>
              <Link
                href={`/dashboard/gradebook/${planId}/competences`}
                className="px-6 py-3 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition shadow-sm text-center"
              >
                Résultats par compétence →
              </Link>
            </div>
            <p className="text-xs text-gray-400 text-center max-w-xs">
              Les grilles sont liées depuis l&apos;onglet &quot;Évaluation&quot; de votre planification.
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
