'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import {
  addStudent, removeStudent, setScore, resetAllScores,
  updateStudentName, syncStudentsFromGradebooks, deleteGrid,
} from './actions'

const CRITERIA = [
  { key: 'description', label: 'Sons entendus' },
  { key: 'reaction',    label: 'Réaction personnelle' },
  { key: 'caractere',   label: 'Caractère' },
  { key: 'lien',        label: 'Lien avec son vécu' },
  { key: 'vocabulaire', label: 'Vocabulaire' },
  { key: 'interaction', label: "Participer à l'échange" },
] as const

const LEVEL_COLORS: Record<number, { bg: string; border: string; label: string }> = {
  1: { bg: 'bg-red-300',    border: 'border-red-400',    label: 'En émergence' },
  2: { bg: 'bg-yellow-200', border: 'border-yellow-400', label: 'En développement' },
  3: { bg: 'bg-green-200',  border: 'border-green-300',  label: 'Assuré' },
  4: { bg: 'bg-green-400',  border: 'border-green-500',  label: 'Remarquable' },
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

export default function MusicApprConvGrid({
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
        <h2 className="text-lg font-bold">Musique — Apprécier, conversation orale</h2>
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
        <table className="border-collapse text-sm" style={{ minWidth: 800 }}>
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
                <span className="block text-xs leading-tight">Résultat<br />global</span>
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
        <h3 className="text-sm font-semibold text-gray-700 mb-4">Légende des niveaux</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          {([1, 2, 3, 4] as const).map(n => {
            const c = LEVEL_COLORS[n]
            return (
              <div key={n} className={`flex items-start gap-3 p-3 rounded-xl border ${c.bg} ${c.border}`}>
                <span className={`shrink-0 w-8 h-8 flex items-center justify-center rounded-lg text-sm font-bold border ${c.border} bg-white/70`}>
                  {n}
                </span>
                <div>
                  <p className="text-sm font-semibold text-gray-800">Niveau {n} — {c.label}</p>
                </div>
              </div>
            )
          })}
        </div>

        <h3 className="text-sm font-semibold text-gray-700 mb-4">Critères d&apos;observation</h3>
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
    key: 'description',
    label: "Décrire les sons entendus (oral)",
    sub: "fort/doux, rapide/lent, instruments, grave/aigu",
    levels: {
      4: "Décrit plusieurs éléments musicaux avec des mots précis pour son niveau (ex. fort, lent, tambour, aigu).",
      3: "Décrit deux éléments ou plus.",
      2: "Nomme un seul élément (ex. « c'est fort »).",
      1: "Description vague ou absente.",
    },
  },
  {
    key: 'reaction',
    label: "Exprimer sa réaction personnelle",
    sub: "j'aime / j'aime pas, avec une raison",
    levels: {
      4: "Exprime une réaction claire et donne une raison liée à la musique.",
      3: "Exprime une réaction avec une raison simple.",
      2: "Exprime une réaction sans raison.",
      1: "Réaction absente ou hors sujet.",
    },
  },
  {
    key: 'caractere',
    label: "Identifier le caractère de l'œuvre",
    sub: "joyeux, triste, calme, effrayant, énergique…",
    levels: {
      4: "Identifie le caractère et l'explique avec un élément musical (ex. « c'est triste parce que c'est lent »).",
      3: "Identifie le caractère avec une explication simple.",
      2: "Identifie un caractère sans explication.",
      1: "Caractère mal identifié ou absent.",
    },
  },
  {
    key: 'lien',
    label: "Faire un lien avec son vécu",
    sub: "image mentale, histoire, souvenir, expérience",
    levels: {
      4: "Fait un lien clair et l'explique (ex. « ça me fait penser à… parce que… »).",
      3: "Fait un lien simple et compréhensible.",
      2: "Lien vague ou peu développé.",
      1: "Aucun lien exprimé.",
    },
  },
  {
    key: 'vocabulaire',
    label: "Vocabulaire musical de base",
    sub: "fort/doux, rapide/lent, noms d'instruments",
    levels: {
      4: "Utilise plusieurs mots du vocabulaire musical de base de façon appropriée.",
      3: "Utilise quelques mots musicaux corrects.",
      2: "Utilise un ou deux mots simples.",
      1: "Vocabulaire musical absent.",
    },
  },
  {
    key: 'interaction',
    label: "Participer à l'échange oral",
    sub: "répondre aux questions, s'exprimer spontanément",
    levels: {
      4: "Participe activement; répond aux questions avec des phrases complètes et développées.",
      3: "Répond aux questions avec des réponses claires.",
      2: "Répond brièvement aux questions.",
      1: "Peu ou pas de participation; répond de façon minimale.",
    },
  },
]
