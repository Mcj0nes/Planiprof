'use client'

import { useState, useTransition, useRef } from 'react'
import { useRouter } from 'next/navigation'
import {
  addStudent, removeStudent, setScore, setComment,
  resetAllScores, syncStudentsFromGradebooks, deleteSession,
  updateStudentName,
} from './actions'

const LEVEL_COLORS: Record<number, { bg: string; border: string }> = {
  1: { bg: 'bg-red-300',    border: 'border-red-400' },
  2: { bg: 'bg-yellow-200', border: 'border-yellow-400' },
  3: { bg: 'bg-green-200',  border: 'border-green-300' },
  4: { bg: 'bg-green-400',  border: 'border-green-500' },
}

type Level     = { id: number; code: string; label: string; sort_order: number }
type Criterion = { id: string; label: string; sort_order: number }
type Student   = { id: string; name: string; sort_order: number; comment: string | null }
type ScoreMap  = Record<string, Record<string, number | null>>

interface ScoreCellProps {
  studentId:      string
  criterionId:    string
  initialLevel:   number | null
  sortedLevels:   Level[]
  separator?:     boolean
  onLevelChange:  (levelId: number | null) => void
}

function ScoreCell({ studentId, criterionId, initialLevel, sortedLevels, separator, onLevelChange }: ScoreCellProps) {
  const [levelId, setLevelId] = useState<number | null>(initialLevel)
  const [editing, setEditing] = useState(false)
  const [, startTransition]   = useTransition()

  const level  = sortedLevels.find(l => l.id === levelId) ?? null
  const colors = level ? LEVEL_COLORS[level.sort_order] : null

  function commit(pos: number | null) {
    const next = pos !== null ? (sortedLevels[pos - 1] ?? null) : null
    setLevelId(next?.id ?? null)
    setEditing(false)
    onLevelChange(next?.id ?? null)
    startTransition(() => setScore(studentId, criterionId, next?.id ?? null))
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    const k = e.key
    if (['1','2','3','4'].includes(k)) { e.preventDefault(); commit(parseInt(k)) }
    else if (k === 'Backspace' || k === 'Delete' || k === '0') { e.preventDefault(); commit(null) }
    else if (k === 'Escape') { setEditing(false) }
  }

  return (
    <td
      onClick={() => { if (!editing) setEditing(true) }}
      className={`border border-gray-200 text-center align-middle cursor-pointer select-none transition-colors
        ${colors ? `${colors.bg} ${colors.border}` : 'bg-white hover:bg-gray-50'}`}
      style={{
        width: separator ? 88 : 80,
        height: 44,
        ...(separator ? { borderLeft: '2px solid #a5b4fc' } : {}),
      }}
    >
      {editing && (
        <input
          autoFocus
          value=""
          onChange={() => {}}
          onKeyDown={handleKeyDown}
          onBlur={() => setEditing(false)}
          className="w-full h-full text-center bg-transparent outline-none caret-transparent"
          readOnly
        />
      )}
    </td>
  )
}

interface Props {
  sessionId:     string
  sessionNumber: number
  totalSessions: number
  etape:         number | null
  gridId:        string
  gridTitle:     string
  lectureCount:  number
  criteria:      Criterion[]
  levels:        Level[]
  students:      Student[]
  scores:        ScoreMap
}

export default function SessionGrid({
  sessionId, sessionNumber, totalSessions, etape,
  gridId, gridTitle, lectureCount, criteria, levels, students: initial, scores,
}: Props) {
  const router       = useRouter()
  const sortedLevels = [...levels].sort((a, b) => a.sort_order - b.sort_order)

  const lectureCrit    = criteria.slice(0, lectureCount)
  const oralCrit       = criteria.slice(lectureCount)

  const [students, setStudents]     = useState<Student[]>(initial)
  const [newName, setNewName]       = useState('')
  const [editingId, setEditingId]   = useState<string | null>(null)
  const [editName, setEditName]     = useState('')
  const [comments, setComments]     = useState<Record<string, string>>(() => {
    const m: Record<string, string> = {}
    for (const s of initial) if (s.comment) m[s.id] = s.comment
    return m
  })
  const [liveScores, setLiveScores] = useState<ScoreMap>(scores)
  const [showReset, setShowReset]   = useState(false)
  const [showDelete, setShowDelete] = useState(false)
  const [isSyncing, setIsSyncing]   = useState(false)
  const [isPending, startTransition] = useTransition()
  const debounce = useRef<Record<string, ReturnType<typeof setTimeout>>>({})

  function handleScoreChange(studentId: string, criterionId: string, levelId: number | null) {
    setLiveScores(prev => ({
      ...prev,
      [studentId]: { ...(prev[studentId] ?? {}), [criterionId]: levelId },
    }))
  }

  function levelOrder(levelId: number | null): number | null {
    if (levelId === null) return null
    return sortedLevels.find(l => l.id === levelId)?.sort_order ?? null
  }

  function avgScore(studentId: string, subset: Criterion[]): string {
    const values = subset
      .map(c => levelOrder(liveScores[studentId]?.[c.id] ?? null))
      .filter((v): v is number => v !== null)
    if (values.length === 0) return '—'
    return (values.reduce((a, b) => a + b, 0) / values.length).toFixed(1)
  }

  function toUrl(e: number | null, s: number) {
    const p = new URLSearchParams()
    if (e !== null) p.set('etape', String(e))
    p.set('session', String(s))
    return `/dashboard/evaluation/conversations/${gridId}/session?${p}`
  }

  function handleAddStudent() {
    if (!newName.trim()) return
    const name = newName.trim()
    setNewName('')
    startTransition(async () => {
      await addStudent(sessionId, name)
      setStudents(prev => [...prev, {
        id: crypto.randomUUID(),
        name,
        sort_order: (prev[prev.length - 1]?.sort_order ?? 0) + 1,
        comment: null,
      }])
    })
  }

  function handleRemoveStudent(id: string) {
    setStudents(prev => prev.filter(s => s.id !== id))
    startTransition(() => removeStudent(id))
  }

  function commitEditName(studentId: string) {
    setStudents(prev => prev.map(s => s.id === studentId ? { ...s, name: editName } : s))
    setEditingId(null)
    startTransition(() => updateStudentName(studentId, editName))
  }

  function handleComment(studentId: string, value: string) {
    setComments(prev => ({ ...prev, [studentId]: value }))
    clearTimeout(debounce.current[studentId])
    debounce.current[studentId] = setTimeout(() => setComment(studentId, value), 600)
  }

  function handleReset() {
    setShowReset(false)
    resetAllScores(sessionId).then(() => window.location.reload())
  }

  async function handleSync() {
    setIsSyncing(true)
    await syncStudentsFromGradebooks(sessionId)
    window.location.reload()
  }

  async function handleDelete() {
    setShowDelete(false)
    await deleteSession(sessionId)
    router.push(toUrl(etape, sessionNumber > 1 ? sessionNumber - 1 : 1))
    router.refresh()
  }

  const colCount = criteria.length + 5 // name + criteria + 2 avg cols + comment + delete

  const avgThStyle = {
    width: 90,
    height: 44,
    borderLeft: '2px solid #93c5fd',
  }

  return (
    <div>
      <style>{`
        @media print {
          * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
          @page { size: A4 landscape; margin: 1.5cm; }
          .session-print-wrap { overflow: visible !important; }
          .session-print-wrap table { min-width: 0 !important; width: 100% !important; font-size: 10px !important; }
          .session-print-wrap th,
          .session-print-wrap td { padding: 4px 5px !important; }
        }
      `}</style>

      {/* Print-only title */}
      <div className="hidden print:block mb-4">
        <p className="text-lg font-bold text-gray-900">{gridTitle}</p>
        <p className="text-sm text-gray-600">
          {etape ? `Étape ${etape} — ` : ''}Séance {sessionNumber}
        </p>
      </div>

      {/* Étape selector */}
      <div className="print:hidden flex items-center gap-2 mb-6 flex-wrap">
        <span className="text-xs font-medium text-gray-500 shrink-0">Étape :</span>
        {([1, 2, 3] as const).map(n => (
          <button
            key={n}
            onClick={() => router.push(toUrl(n, 1))}
            className={`text-xs px-3 py-1.5 rounded-full font-medium border transition ${
              etape === n
                ? 'bg-blue-600 text-white border-blue-600'
                : 'bg-white text-gray-600 border-gray-200 hover:border-blue-300'
            }`}
          >
            Étape {n}
          </button>
        ))}
        {etape !== null && (
          <button
            onClick={() => router.push(toUrl(null, 1))}
            className="text-xs text-gray-400 hover:text-gray-600 underline transition ml-1"
          >
            Toutes les séances
          </button>
        )}
      </div>

      {/* Session tabs */}
      {(totalSessions > 1 || etape !== null) && (
        <div className="print:hidden flex items-center gap-1.5 mb-5 flex-wrap">
          {Array.from({ length: totalSessions }, (_, i) => i + 1).map(n => (
            <button
              key={n}
              onClick={() => router.push(toUrl(etape, n))}
              className={`text-xs px-3 py-1.5 rounded-full font-medium border transition ${
                n === sessionNumber
                  ? 'bg-indigo-600 text-white border-indigo-600'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-indigo-300'
              }`}
            >
              Séance {n}
            </button>
          ))}
          <a
            href={`/dashboard/evaluation/conversations/${gridId}/session?vue=ensemble${etape ? `&etape=${etape}` : ''}`}
            className="text-xs px-3 py-1.5 rounded-full font-medium border border-indigo-300 text-indigo-600 bg-white hover:bg-indigo-50 transition"
          >
            Vue d&apos;ensemble
          </a>
        </div>
      )}

      {/* Controls */}
      <div className="print:hidden flex items-center gap-2 mb-5 flex-wrap">
        <input
          type="text"
          value={newName}
          onChange={e => setNewName(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleAddStudent()}
          placeholder="Nom de l'élève..."
          className="text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300 w-64"
        />
        <button
          onClick={handleAddStudent}
          disabled={isPending || !newName.trim()}
          className="text-sm px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition"
        >
          Ajouter
        </button>
        <span className="text-xs text-gray-400 select-none">ou</span>
        <button
          onClick={handleSync}
          disabled={isSyncing}
          className="text-xs px-3 py-1.5 rounded-full font-medium border border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white disabled:opacity-50 transition bg-white"
        >
          {isSyncing ? 'Synchronisation…' : '↺ Synchroniser avec le carnet'}
        </button>
        <div className="ml-auto flex items-center gap-4">
          {!showReset && !showDelete ? (
            <>
              <button onClick={() => setShowReset(true)} className="text-xs text-gray-400 hover:text-red-500 transition">
                Réinitialiser les résultats
              </button>
              <button onClick={() => setShowDelete(true)} className="text-xs text-gray-400 hover:text-red-500 transition">
                Supprimer la séance
              </button>
            </>
          ) : showDelete ? (
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-600">Supprimer cette séance ?</span>
              <button onClick={handleDelete} className="text-xs text-red-600 font-medium hover:underline">Confirmer</button>
              <button onClick={() => setShowDelete(false)} className="text-xs text-gray-400 hover:underline">Annuler</button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-600">Effacer tous les résultats ?</span>
              <button onClick={handleReset} className="text-xs text-red-600 font-medium hover:underline">Confirmer</button>
              <button onClick={() => setShowReset(false)} className="text-xs text-gray-400 hover:underline">Annuler</button>
            </div>
          )}
          <button
            onClick={() => router.push(toUrl(etape, sessionNumber + 1))}
            className="text-xs text-indigo-500 hover:text-indigo-700 font-medium transition whitespace-nowrap"
          >
            Séance suivante →
          </button>
        </div>
      </div>

      {/* Print button */}
      <div className="print:hidden flex justify-end mb-3">
        <button
          onClick={() => window.print()}
          className="text-xs px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-600 hover:bg-gray-50 hover:border-gray-400 transition flex items-center gap-1.5 shadow-sm"
        >
          🖨 Imprimer / PDF
        </button>
      </div>

      {/* Grid */}
      <div className="session-print-wrap overflow-x-auto rounded-2xl border border-gray-200 shadow-sm mb-10">
        <table className="border-collapse text-sm" style={{ minWidth: 'max-content' }}>
          <thead>
            <tr>
              <th className="p-3 bg-gray-100 border-b border-r border-gray-200 text-left font-semibold text-gray-700 sticky left-0 z-10" style={{ minWidth: 180 }}>
                Nom de l&apos;élève
              </th>
              {lectureCrit.map(c => (
                <th key={c.id} className="p-3 bg-gray-100 border-b border-r border-gray-200 font-semibold text-gray-700 text-center" style={{ width: 80 }}>
                  <span className="block text-xs leading-tight">{c.label.split('\n')[0]}</span>
                </th>
              ))}
              {lectureCount > 0 && (
                <th
                  className="p-3 bg-blue-50 border-b border-r border-gray-200 font-semibold text-blue-700 text-center"
                  style={avgThStyle}
                >
                  <span className="block text-xs leading-tight">Résultat global : lecture</span>
                </th>
              )}
              {oralCrit.map(c => (
                <th key={c.id} className="p-3 bg-gray-100 border-b border-r border-gray-200 font-semibold text-gray-700 text-center" style={{ width: 80 }}>
                  <span className="block text-xs leading-tight">{c.label.split('\n')[0]}</span>
                </th>
              ))}
              <th
                className="p-3 bg-blue-50 border-b border-r border-gray-200 font-semibold text-blue-700 text-center"
                style={avgThStyle}
              >
                <span className="block text-xs leading-tight">
                  {lectureCount > 0 ? 'Résultat global : oral' : 'Résultat global'}
                </span>
              </th>
              <th
                className="print:hidden p-3 bg-indigo-50 border-b border-r border-gray-200 font-semibold text-indigo-700 text-left"
                style={{ minWidth: 220, borderLeft: '2px solid #a5b4fc' }}
              >
                <span className="block text-xs leading-tight">Commentaires</span>
              </th>
              <th className="print:hidden p-3 bg-gray-100 border-b border-gray-200 w-8" />
            </tr>
          </thead>
          <tbody>
            {students.length === 0 && (
              <tr>
                <td colSpan={colCount} className="p-6 text-center text-gray-400 text-sm">
                  Ajoutez des élèves pour commencer.
                </td>
              </tr>
            )}
            {students.map((student, idx) => {
              const lectureAvg = avgScore(student.id, lectureCrit)
              const oralAvg    = avgScore(student.id, oralCrit)
              return (
                <tr key={student.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/60'}>
                  <td className="border-b border-r border-gray-200 px-3 py-1 sticky left-0 z-10 bg-inherit">
                    {editingId === student.id ? (
                      <input
                        autoFocus
                        value={editName}
                        onChange={e => setEditName(e.target.value)}
                        onBlur={() => commitEditName(student.id)}
                        onKeyDown={e => e.key === 'Enter' && commitEditName(student.id)}
                        className="w-full text-sm border border-blue-300 rounded px-2 py-1 focus:outline-none focus:ring-1 focus:ring-blue-400"
                      />
                    ) : (
                      <span
                        className="text-sm text-gray-800 cursor-text hover:text-blue-600"
                        onClick={() => { setEditingId(student.id); setEditName(student.name) }}
                      >
                        {student.name || <span className="text-gray-300 italic">Sans nom</span>}
                      </span>
                    )}
                  </td>
                  {lectureCrit.map(c => (
                    <ScoreCell
                      key={c.id}
                      studentId={student.id}
                      criterionId={c.id}
                      initialLevel={scores[student.id]?.[c.id] ?? null}
                      sortedLevels={sortedLevels}
                      onLevelChange={levelId => handleScoreChange(student.id, c.id, levelId)}
                    />
                  ))}
                  {lectureCount > 0 && (
                    <td
                      className="border-b border-r border-gray-200 bg-blue-50 text-center align-middle font-semibold text-blue-800 text-sm select-none"
                      style={{ width: 90, height: 44, borderLeft: '2px solid #93c5fd' }}
                    >
                      {lectureAvg}
                    </td>
                  )}
                  {oralCrit.map(c => (
                    <ScoreCell
                      key={c.id}
                      studentId={student.id}
                      criterionId={c.id}
                      initialLevel={scores[student.id]?.[c.id] ?? null}
                      sortedLevels={sortedLevels}
                      onLevelChange={levelId => handleScoreChange(student.id, c.id, levelId)}
                    />
                  ))}
                  <td
                    className="border-b border-r border-gray-200 bg-blue-50 text-center align-middle font-semibold text-blue-800 text-sm select-none"
                    style={{ width: 90, height: 44, borderLeft: '2px solid #93c5fd' }}
                  >
                    {oralAvg}
                  </td>
                  <td
                    className="print:hidden border-b border-r border-gray-200 px-2 py-1 bg-indigo-50/30"
                    style={{ borderLeft: '2px solid #a5b4fc', minWidth: 220 }}
                  >
                    <textarea
                      value={comments[student.id] ?? ''}
                      onChange={e => handleComment(student.id, e.target.value)}
                      placeholder="Commentaires..."
                      rows={1}
                      className="w-full text-xs text-gray-600 resize-none focus:outline-none focus:ring-1 focus:ring-indigo-200 rounded px-1 py-0.5 bg-transparent"
                    />
                  </td>
                  <td className="print:hidden border-b border-gray-200 px-2 text-center">
                    <button
                      onClick={() => handleRemoveStudent(student.id)}
                      className="text-gray-300 hover:text-red-400 text-base leading-none transition"
                    >
                      ✕
                    </button>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Legend */}
      <div className="print:hidden bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
        <h3 className="text-sm font-semibold text-gray-700 mb-4">Légende des niveaux</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-4">
          {sortedLevels.map((l, i) => {
            const c = LEVEL_COLORS[l.sort_order]
            if (!c) return null
            return (
              <div key={l.id} className={`flex items-center gap-3 p-3 rounded-xl border ${c.bg} ${c.border}`}>
                <span className={`shrink-0 w-8 h-8 flex items-center justify-center rounded-lg text-sm font-bold border ${c.border} bg-white/70`}>
                  {i + 1}
                </span>
                <div>
                  <p className="text-sm font-semibold text-gray-800">{l.code} — {l.label}</p>
                </div>
              </div>
            )
          })}
        </div>
        <p className="text-xs text-gray-400">Appuyez sur 1, 2, 3 ou 4 après avoir cliqué une cellule pour saisir le niveau. Appuyez sur 0 ou ← pour effacer.</p>
      </div>

      {/* Criteria descriptions */}
      {criteria.some(c => c.label.includes('\n')) && (
        <div className="print:hidden bg-white border border-gray-200 rounded-2xl p-6 shadow-sm mt-4">
          <h3 className="text-sm font-semibold text-gray-700 mb-4">Description des critères</h3>
          <div className="space-y-4">
            {criteria.map(c => {
              const lines     = c.label.split('\n')
              const title     = lines[0]
              const hasDim    = lines.length > 1 && lines[1].startsWith('↳')
              const dimension = hasDim ? lines[1] : null
              const desc      = hasDim ? lines.slice(2).join(' ') : lines.slice(1).join(' ')
              return (
                <div key={c.id} className="flex gap-3">
                  <div className="shrink-0 w-6 h-6 mt-0.5 flex items-center justify-center rounded-md bg-indigo-100 text-indigo-700 text-xs font-bold">
                    {c.sort_order}
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-800">{title}</p>
                    {dimension && <p className="text-xs text-indigo-500 mt-0.5">{dimension}</p>}
                    {desc && <p className="text-xs text-gray-500 mt-1">{desc}</p>}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      )}
    </div>
  )
}
