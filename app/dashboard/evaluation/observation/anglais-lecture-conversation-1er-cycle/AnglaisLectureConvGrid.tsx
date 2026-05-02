'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import {
  addStudent, removeStudent, setScore, resetAllScores,
  updateStudentName, syncStudentsFromGradebooks, deleteGrid,
} from './actions'

const CRITERIA = [
  { key: 'understanding', label: 'Understanding' },
  { key: 'vocabulary',    label: 'Vocabulary' },
  { key: 'characters',    label: 'Characters & Setting' },
  { key: 'connection',    label: 'Personal Connection' },
  { key: 'retelling',     label: 'Retelling' },
  { key: 'prediction',    label: 'Prediction' },
] as const

const LEVEL_COLORS: Record<number, { bg: string; border: string; label: string }> = {
  1: { bg: 'bg-red-300',    border: 'border-red-400',    label: 'Emerging' },
  2: { bg: 'bg-yellow-200', border: 'border-yellow-400', label: 'Developing' },
  3: { bg: 'bg-green-200',  border: 'border-green-300',  label: 'Achieved' },
  4: { bg: 'bg-green-400',  border: 'border-green-500',  label: 'Remarkable' },
}

type Student  = { id: string; name: string; sort_order: number }
type ScoreMap = Record<string, Record<string, number>>

interface Props {
  gridId:     string
  gridNumber: number
  totalGrids: number
  etape:      number | null
  students:   Student[]
  scores:     ScoreMap
}

function ScoreCell({
  studentId, criterion, initialScore, separator,
}: {
  studentId:    string
  criterion:    string
  initialScore?: number
  separator?:   boolean
}) {
  const [score, setLocalScore] = useState<number | undefined>(initialScore)
  const [input, setInput]      = useState('')
  const [editing, setEditing]  = useState(false)
  const [, startTransition]    = useTransition()

  const colors = score ? LEVEL_COLORS[score] : null

  function commit(raw: string) {
    const n = parseInt(raw, 10)
    const next = n >= 1 && n <= 4 ? n : null
    setLocalScore(next ?? undefined)
    setInput('')
    setEditing(false)
    startTransition(() => setScore(studentId, criterion, next))
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (['1', '2', '3', '4'].includes(e.key)) { e.preventDefault(); commit(e.key) }
    else if (e.key === 'Backspace' || e.key === 'Delete' || e.key === '0') { e.preventDefault(); commit('') }
    else if (e.key === 'Escape') { setEditing(false); setInput('') }
  }

  return (
    <td
      className={`border border-gray-200 text-center align-middle cursor-pointer select-none transition-colors
        ${colors ? `${colors.bg} ${colors.border}` : 'bg-white hover:bg-gray-50'}`}
      style={{
        width: separator ? 88 : 72,
        height: 44,
        ...(separator ? { borderLeft: '2px solid #a5b4fc' } : {}),
      }}
      onClick={() => { if (!editing) { setEditing(true); setInput('') } }}
    >
      {editing && (
        <input
          autoFocus
          value={input}
          onChange={() => {}}
          onKeyDown={handleKeyDown}
          onBlur={() => { setEditing(false); setInput('') }}
          className="w-full h-full text-center text-sm bg-transparent outline-none caret-transparent"
          readOnly
        />
      )}
    </td>
  )
}

function toUrl(etape: number | null, grille: number) {
  const p = new URLSearchParams()
  if (etape !== null) p.set('etape', String(etape))
  p.set('grille', String(grille))
  return `?${p}`
}

export default function AnglaisLectureConvGrid({
  gridId, gridNumber, totalGrids, etape,
  students: initial, scores: initialScores,
}: Props) {
  const [students, setStudents]       = useState<Student[]>(initial)
  const [scores]                      = useState<ScoreMap>(initialScores)
  const [newName, setNewName]         = useState('')
  const [editingId, setEditingId]     = useState<string | null>(null)
  const [editName, setEditName]       = useState('')
  const [isPending, startTransition]  = useTransition()
  const [showReset, setShowReset]     = useState(false)
  const [isSyncing, setIsSyncing]     = useState(false)
  const [showDelete, setShowDelete]   = useState(false)
  const router = useRouter()

  function handleAddStudent() {
    if (!newName.trim()) return
    const name = newName.trim()
    setNewName('')
    startTransition(async () => {
      await addStudent(gridId, name)
      setStudents(prev => [...prev, {
        id: crypto.randomUUID(),
        name,
        sort_order: (prev[prev.length - 1]?.sort_order ?? 0) + 1,
      }])
    })
  }

  function handleRemoveStudent(id: string) {
    setStudents(prev => prev.filter(s => s.id !== id))
    startTransition(() => removeStudent(id))
  }

  function startEditName(student: Student) {
    setEditingId(student.id)
    setEditName(student.name)
  }

  function commitEditName(studentId: string) {
    setStudents(prev => prev.map(s => s.id === studentId ? { ...s, name: editName } : s))
    setEditingId(null)
    startTransition(() => updateStudentName(studentId, editName))
  }

  function handleReset() {
    setShowReset(false)
    resetAllScores(gridId).then(() => window.location.reload())
  }

  async function handleSync() {
    setIsSyncing(true)
    await syncStudentsFromGradebooks(gridId)
    window.location.reload()
  }

  async function handleDelete() {
    setShowDelete(false)
    await deleteGrid(gridId)
    const prev = gridNumber > 1 ? gridNumber - 1 : null
    router.push(prev ? toUrl(etape, prev) : etape !== null ? `?etape=${etape}&grille=1` : '?grille=1')
    router.refresh()
  }

  return (
    <div>
      <style>{`
        @media print {
          * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
          @page { size: A4 landscape; margin: 1.5cm; }
          .print-table-wrap { overflow: visible !important; }
          .print-table-wrap table { min-width: 0 !important; width: 100% !important; font-size: 9px !important; }
          .print-table-wrap th,
          .print-table-wrap td { padding: 3px 4px !important; }
        }
      `}</style>

      <div className="hidden print:block mb-4">
        <h2 className="text-lg font-bold">English — Reading — Oral Conversation — Cycle 1</h2>
        <p className="text-sm text-gray-600">
          {etape ? `Étape ${etape} — ` : ''}Grille {gridNumber}
        </p>
      </div>

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
            Toutes les grilles
          </button>
        )}
      </div>

      {(totalGrids > 1 || etape !== null) && (
        <div className="print:hidden flex items-center gap-1.5 mb-5 flex-wrap">
          {Array.from({ length: totalGrids }, (_, i) => i + 1).map(n => (
            <button
              key={n}
              onClick={() => router.push(toUrl(etape, n))}
              className={`text-xs px-3 py-1.5 rounded-full font-medium border transition ${
                n === gridNumber
                  ? 'bg-indigo-600 text-white border-indigo-600'
                  : 'bg-white text-gray-600 border-gray-200 hover:border-indigo-300'
              }`}
            >
              Grille {n}
            </button>
          ))}
          {etape !== null && (
            <button
              onClick={() => router.push(`?etape=${etape}&vue=ensemble`)}
              className="text-xs px-3 py-1.5 rounded-full font-medium border bg-white text-gray-600 border-gray-200 hover:border-blue-300 hover:text-blue-600 transition"
            >
              Vue d&apos;ensemble
            </button>
          )}
        </div>
      )}

      <div className="print:hidden flex items-center gap-2 mb-5 flex-wrap">
        <input
          type="text"
          value={newName}
          onChange={e => setNewName(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && handleAddStudent()}
          placeholder="Add student…"
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
          title="Ajouter les élèves du carnet de notes manquants dans cette grille"
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
                Supprimer la grille
              </button>
            </>
          ) : showDelete ? (
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-600">Supprimer cette grille?</span>
              <button onClick={handleDelete} className="text-xs text-red-600 font-medium hover:underline">Confirmer</button>
              <button onClick={() => setShowDelete(false)} className="text-xs text-gray-400 hover:underline">Annuler</button>
            </div>
          ) : (
            <div className="flex items-center gap-2">
              <span className="text-xs text-gray-600">Effacer tous les scores?</span>
              <button onClick={handleReset} className="text-xs text-red-600 font-medium hover:underline">Confirmer</button>
              <button onClick={() => setShowReset(false)} className="text-xs text-gray-400 hover:underline">Annuler</button>
            </div>
          )}
          <button
            onClick={() => router.push(toUrl(etape, gridNumber + 1))}
            className="text-xs text-indigo-500 hover:text-indigo-700 font-medium transition whitespace-nowrap"
          >
            Grille suivante →
          </button>
        </div>
      </div>

      <div className="print:hidden flex justify-end mb-3">
        <button
          onClick={() => window.print()}
          className="text-xs px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-600 hover:bg-gray-50 hover:border-gray-400 transition flex items-center gap-1.5 shadow-sm"
        >
          <span>🖨</span> Imprimer / PDF
        </button>
      </div>

      <div className="print-table-wrap overflow-x-auto rounded-2xl border border-gray-200 shadow-sm mb-10">
        <table className="border-collapse text-sm" style={{ minWidth: 700 }}>
          <thead>
            <tr>
              <th className="p-3 bg-gray-100 border-b border-r border-gray-200 text-left font-semibold text-gray-700 sticky left-0 z-10" style={{ minWidth: 180 }}>
                Nom de l&apos;élève
              </th>
              {CRITERIA.map(c => (
                <th key={c.key} className="p-3 bg-gray-100 border-b border-r border-gray-200 font-semibold text-gray-700 text-center" style={{ width: 72 }}>
                  <span className="block text-xs leading-tight">{c.label}</span>
                </th>
              ))}
              <th
                className="p-3 bg-indigo-50 border-b border-r border-gray-200 font-semibold text-indigo-700 text-center"
                style={{ width: 88, borderLeft: '2px solid #a5b4fc' }}
              >
                <span className="block text-xs leading-tight">Global<br />Result</span>
              </th>
              <th className="print:hidden p-3 bg-gray-100 border-b border-gray-200 w-8" />
            </tr>
          </thead>
          <tbody>
            {students.length === 0 && (
              <tr>
                <td colSpan={CRITERIA.length + 3} className="p-6 text-center text-gray-400 text-sm">
                  Ajoutez des élèves pour commencer.
                </td>
              </tr>
            )}
            {students.map((student, idx) => (
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
                      onClick={() => startEditName(student)}
                    >
                      {student.name || <span className="text-gray-300 italic">Sans nom</span>}
                    </span>
                  )}
                </td>
                {CRITERIA.map(c => (
                  <ScoreCell
                    key={c.key}
                    studentId={student.id}
                    criterion={c.key}
                    initialScore={scores[student.id]?.[c.key]}
                  />
                ))}
                <ScoreCell
                  studentId={student.id}
                  criterion="global"
                  initialScore={scores[student.id]?.['global']}
                  separator
                />
                <td className="print:hidden border-b border-gray-200 px-2 text-center">
                  <button
                    onClick={() => handleRemoveStudent(student.id)}
                    title="Supprimer cet élève"
                    className="text-gray-300 hover:text-red-400 text-base leading-none transition"
                  >
                    ✕
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <div className="print:hidden bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
        <h3 className="text-sm font-semibold text-gray-700 mb-4">Level Legend</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          {([1, 2, 3, 4] as const).map(n => {
            const c = LEVEL_COLORS[n]
            return (
              <div key={n} className={`flex items-start gap-3 p-3 rounded-xl border ${c.bg} ${c.border}`}>
                <span className={`shrink-0 w-8 h-8 flex items-center justify-center rounded-lg text-sm font-bold border ${c.border} bg-white/70`}>
                  {n}
                </span>
                <div>
                  <p className="text-sm font-semibold text-gray-800">Level {n} — {c.label}</p>
                </div>
              </div>
            )
          })}
        </div>

        <h3 className="text-sm font-semibold text-gray-700 mb-4">Observation Criteria</h3>
        <div className="space-y-6">
          {CRITERIA_FULL.map((c, i) => (
            <div key={c.key}>
              <p className="text-sm font-semibold text-gray-800 mb-0.5">{i + 1}. {c.label}</p>
              {c.sub && <p className="text-xs text-gray-500 italic mb-2">{c.sub}</p>}
              <div className="space-y-1">
                {([4, 3, 2, 1] as const).map(n => {
                  const lc = LEVEL_COLORS[n]
                  return (
                    <div key={n} className={`flex items-start gap-2 px-3 py-2 rounded-lg border ${lc.bg} ${lc.border}`}>
                      <span className={`shrink-0 w-5 h-5 flex items-center justify-center rounded text-xs font-bold border ${lc.border} bg-white/70`}>{n}</span>
                      <span className="text-xs text-gray-700">{c.levels[n]}</span>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

const CRITERIA_FULL: {
  key: string
  label: string
  sub: string
  levels: Record<1 | 2 | 3 | 4, string>
}[] = [
  {
    key: 'understanding',
    label: 'Understanding',
    sub: 'Show overall understanding of the text',
    levels: {
      4: 'Clearly explains what the text is about in simple English sentences, with accurate details about the main idea.',
      3: 'Shows overall understanding with some hesitation or minor inaccuracies.',
      2: 'Shows partial understanding; can name one or two elements but misses the main idea.',
      1: 'Cannot show understanding of the text in English.',
    },
  },
  {
    key: 'vocabulary',
    label: 'Vocabulary',
    sub: 'Use key words from the text',
    levels: {
      4: 'Spontaneously uses several key words from the text correctly and can explain what they mean with gestures or simple words.',
      3: 'Uses some key words with occasional errors or hesitation.',
      2: 'Repeats a word from the text but cannot explain it.',
      1: 'Does not use or recognize key vocabulary from the text.',
    },
  },
  {
    key: 'characters',
    label: 'Characters & Setting',
    sub: 'Identify characters and setting',
    levels: {
      4: 'Names the main character(s) and setting clearly, using simple descriptive words (e.g., "The bear is big and lives in the forest").',
      3: 'Identifies the character(s) or setting with some support or minor inaccuracies.',
      2: 'Names a character but cannot describe them or the setting.',
      1: 'Cannot identify characters or the setting.',
    },
  },
  {
    key: 'connection',
    label: 'Personal Connection',
    sub: 'Make a personal connection to the text',
    levels: {
      4: 'Makes a clear personal connection to the text using simple English (e.g., "I have a dog too" or "I felt like that one time").',
      3: 'Makes a connection with some hesitation or partial expression.',
      2: 'Indicates a connection (nod, smile) but cannot express it in English.',
      1: 'Does not make a personal connection to the text.',
    },
  },
  {
    key: 'retelling',
    label: 'Retelling',
    sub: 'Retell the story in simple sentences',
    levels: {
      4: 'Retells the main events in sequence using simple English sentences (beginning, middle, end).',
      3: 'Retells most events with some gaps or out of order.',
      2: 'Names one event from the story.',
      1: 'Cannot retell the story in English.',
    },
  },
  {
    key: 'prediction',
    label: 'Prediction',
    sub: 'Make a simple prediction',
    levels: {
      4: 'Makes a logical prediction about what will happen and explains why in simple English (e.g., "I think he will find his friend because…").',
      3: 'Makes a prediction with some support or limited explanation.',
      2: 'Makes a prediction without explanation (e.g., "He will be happy").',
      1: 'Cannot make a prediction about the text.',
    },
  },
]
