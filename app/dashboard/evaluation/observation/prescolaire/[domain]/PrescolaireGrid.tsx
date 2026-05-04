'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import {
  addStudent, removeStudent, setScore, resetAllScores,
  updateStudentName, syncStudentsFromGradebooks, deleteGrid,
} from '../actions'

type Criterion = { key: string; label: string; description: string }

const DOMAIN_CONFIG: Record<string, {
  title: string
  criteria: Criterion[]
  levelDescriptions: Record<number, string>
}> = {
  physique: {
    title: 'Développement physique et moteur',
    criteria: [
      { key: 'motricite_globale', label: 'Motricité globale',   description: 'Effectue des mouvements locomoteurs et non locomoteurs avec aisance.' },
      { key: 'motricite_fine',    label: 'Motricité fine',      description: 'Contrôle ses gestes dans des tâches de précision (découpage, coloriage…).' },
      { key: 'corps_espace',      label: 'Corps et espace',     description: "Se repère dans l'espace et coordonne ses mouvements." },
      { key: 'habitudes',         label: 'Saines habitudes',    description: "Adopte des habitudes de vie saines (hygiène, alimentation, repos)." },
      { key: 'engagement',        label: 'Engagement physique', description: 'Participe avec enthousiasme aux activités physiques.' },
    ],
    levelDescriptions: {
      1: "L'élève a besoin d'un soutien constant pour accomplir les tâches motrices.",
      2: "L'élève progresse avec encouragement et modelage de l'adulte.",
      3: "L'élève réalise les tâches motrices de façon autonome.",
      4: "L'élève dépasse les attentes et fait preuve d'une grande aisance physique.",
    },
  },
  affectif: {
    title: 'Développement affectif',
    criteria: [
      { key: 'emotions',         label: 'Expression des émotions', description: 'Nomme et exprime ses émotions de façon appropriée.' },
      { key: 'connaissance_soi', label: 'Connaissance de soi',     description: 'Démontre une conscience de ses forces et limites.' },
      { key: 'autonomie',        label: 'Autonomie',               description: 'Prend des initiatives et assume ses responsabilités.' },
      { key: 'perseverance',     label: 'Persévérance',            description: 'Maintient ses efforts face aux défis.' },
    ],
    levelDescriptions: {
      1: "L'élève a besoin d'un soutien constant pour gérer ses émotions et agir de façon autonome.",
      2: "L'élève progresse dans la gestion de ses émotions avec l'aide de l'adulte.",
      3: "L'élève gère ses émotions et agit de façon autonome.",
      4: "L'élève fait preuve d'une grande maturité affective et d'une belle confiance en soi.",
    },
  },
  social: {
    title: 'Développement social',
    criteria: [
      { key: 'relations',     label: 'Relations',            description: 'Établit des liens positifs avec ses pairs et les adultes.' },
      { key: 'participation', label: 'Participation',        description: "S'implique activement dans les activités collectives." },
      { key: 'regles',        label: 'Règles et limites',    description: 'Comprend et respecte les règles de vie de la classe.' },
      { key: 'cooperation',   label: 'Coopération',          description: 'Collabore et partage avec ses camarades.' },
    ],
    levelDescriptions: {
      1: "L'élève a besoin d'un soutien constant pour s'intégrer au groupe.",
      2: "L'élève développe ses habiletés sociales avec l'accompagnement de l'adulte.",
      3: "L'élève interagit positivement avec ses pairs de façon autonome.",
      4: "L'élève fait preuve d'un leadership naturel et enrichit la dynamique du groupe.",
    },
  },
  langage: {
    title: 'Communication et langage',
    criteria: [
      { key: 'expression_orale', label: 'Expression orale',          description: "S'exprime clairement à l'oral en utilisant des phrases complètes." },
      { key: 'comprehension',    label: 'Compréhension',             description: 'Comprend les consignes et les messages entendus.' },
      { key: 'phonologique',     label: 'Conscience phonologique',   description: 'Identifie les sons, les syllabes et les rimes.' },
      { key: 'ecrit',            label: "Éveil à l'écrit",           description: 'Reconnaît des lettres, son prénom et des mots fréquents.' },
      { key: 'ecriture',         label: "Émergence de l'écriture",   description: 'Produit des traces écrites (dessin, lettres, mots).' },
    ],
    levelDescriptions: {
      1: "L'élève a besoin d'un soutien constant en communication et en langage.",
      2: "L'élève progresse en communication avec l'accompagnement de l'adulte.",
      3: "L'élève communique de façon autonome et efficace.",
      4: "L'élève fait preuve d'une grande aisance langagière et d'une belle curiosité pour l'écrit.",
    },
  },
  monde: {
    title: 'Découverte du monde',
    criteria: [
      { key: 'curiosite',    label: 'Curiosité',               description: 'Pose des questions et explore son environnement avec intérêt.' },
      { key: 'raisonnement', label: 'Raisonnement',            description: 'Observe, compare et tire des conclusions simples.' },
      { key: 'mathematique', label: 'Mathématique',            description: 'Dénombre, compare et résout de simples problèmes.' },
      { key: 'sciences',     label: 'Sciences et technologie', description: 'Expérimente et décrit des phénomènes naturels simples.' },
      { key: 'milieu',       label: 'Milieu et culture',       description: "Se situe dans son milieu et s'intéresse à sa communauté." },
    ],
    levelDescriptions: {
      1: "L'élève a besoin d'un soutien constant pour explorer et comprendre son monde.",
      2: "L'élève développe sa curiosité et son raisonnement avec l'aide de l'adulte.",
      3: "L'élève explore et raisonne de façon autonome.",
      4: "L'élève fait preuve d'une grande curiosité intellectuelle et d'un raisonnement remarquable.",
    },
  },
  global: {
    title: 'Portrait global — 5 domaines de développement',
    criteria: [
      { key: 'physique', label: 'Dév. physique et moteur', description: 'Motricité globale et fine, saines habitudes de vie et engagement.' },
      { key: 'affectif', label: 'Dév. affectif',           description: 'Gestion des émotions, autonomie et persévérance.' },
      { key: 'social',   label: 'Dév. social',              description: 'Relations, participation, règles et coopération.' },
      { key: 'langage',  label: 'Communication et langage', description: "Expression orale, compréhension et éveil à l'écrit." },
      { key: 'monde',    label: 'Découverte du monde',      description: 'Curiosité, raisonnement, mathématique et sciences.' },
    ],
    levelDescriptions: {
      1: "L'élève a besoin d'un soutien constant dans ce domaine de développement.",
      2: "L'élève progresse dans ce domaine avec l'accompagnement de l'adulte.",
      3: "L'élève démontre les comportements attendus de façon autonome.",
      4: "L'élève dépasse les attentes et fait preuve d'un développement remarquable.",
    },
  },
}

const LEVEL_COLORS: Record<number, { bg: string; border: string; label: string }> = {
  1: { bg: 'bg-red-300',    border: 'border-red-400',    label: 'DA — Début d\'apprentissage' },
  2: { bg: 'bg-yellow-200', border: 'border-yellow-400', label: 'EA — En apprentissage' },
  3: { bg: 'bg-green-200',  border: 'border-green-300',  label: 'EC — En consolidation' },
  4: { bg: 'bg-green-400',  border: 'border-green-500',  label: 'A — Acquis' },
}

type Student  = { id: string; name: string; sort_order: number }
type ScoreMap = Record<string, Record<string, number>>

interface Props {
  domain:     string
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

  const scoreLabel = score ? ['DA', 'EA', 'EC', 'A'][score - 1] : ''

  return (
    <td
      className={`border border-gray-200 text-center align-middle cursor-pointer select-none transition-colors text-xs font-semibold
        ${colors ? `${colors.bg} ${colors.border}` : 'bg-white hover:bg-gray-50'}`}
      style={{
        width: separator ? 88 : 72,
        height: 44,
        ...(separator ? { borderLeft: '2px solid #a5b4fc' } : {}),
      }}
      onClick={() => { if (!editing) { setEditing(true); setInput('') } }}
    >
      {editing ? (
        <input
          autoFocus
          value={input}
          onChange={() => {}}
          onKeyDown={handleKeyDown}
          onBlur={() => { setEditing(false); setInput('') }}
          className="w-full h-full text-center text-xs bg-transparent outline-none caret-transparent"
          readOnly
        />
      ) : (
        <span>{scoreLabel}</span>
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

export default function PrescolaireGrid({
  domain, gridId, gridNumber, totalGrids, etape,
  students: initial, scores: initialScores,
}: Props) {
  const config = DOMAIN_CONFIG[domain] ?? DOMAIN_CONFIG.global
  const CRITERIA = config.criteria

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
      await addStudent(domain, gridId, name)
      setStudents(prev => [...prev, {
        id: crypto.randomUUID(),
        name,
        sort_order: (prev[prev.length - 1]?.sort_order ?? 0) + 1,
      }])
    })
  }

  function handleRemoveStudent(id: string) {
    setStudents(prev => prev.filter(s => s.id !== id))
    startTransition(() => removeStudent(domain, id))
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
    resetAllScores(domain, gridId).then(() => window.location.reload())
  }

  async function handleSync() {
    setIsSyncing(true)
    await syncStudentsFromGradebooks(domain, gridId)
    window.location.reload()
  }

  async function handleDelete() {
    setShowDelete(false)
    await deleteGrid(domain, gridId)
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
        <h2 className="text-lg font-bold">{config.title}</h2>
        <p className="text-sm text-gray-600">
          {etape ? `Étape ${etape} — ` : ''}Grille {gridNumber}
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
            Toutes les grilles
          </button>
        )}
      </div>

      {/* Grid tabs */}
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

      {/* Print button */}
      <div className="print:hidden flex justify-end mb-3">
        <button
          onClick={() => window.print()}
          className="text-xs px-4 py-2 rounded-lg border border-gray-300 bg-white text-gray-600 hover:bg-gray-50 hover:border-gray-400 transition flex items-center gap-1.5 shadow-sm"
        >
          <span>🖨</span> Imprimer / PDF
        </button>
      </div>

      {/* Grid */}
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

      {/* Legend */}
      <div className="print:hidden bg-white border border-gray-200 rounded-2xl p-6 shadow-sm">
        <h3 className="text-sm font-semibold text-gray-700 mb-4">Légende des niveaux</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          {([1, 2, 3, 4] as const).map(n => {
            const c = LEVEL_COLORS[n]
            const code = ['DA', 'EA', 'EC', 'A'][n - 1]
            return (
              <div key={n} className={`flex items-start gap-3 p-3 rounded-xl border ${c.bg} ${c.border}`}>
                <span className={`shrink-0 w-10 h-8 flex items-center justify-center rounded-lg text-xs font-bold border ${c.border} bg-white/70`}>
                  {code}
                </span>
                <div>
                  <p className="text-sm font-semibold text-gray-800">{c.label}</p>
                  <p className="text-xs text-gray-600 mt-0.5">{config.levelDescriptions[n]}</p>
                </div>
              </div>
            )
          })}
        </div>

        <h3 className="text-sm font-semibold text-gray-700 mb-3">Critères d&apos;observation</h3>
        <div className="space-y-2">
          {CRITERIA.map((c, i) => (
            <div key={c.key} className="flex gap-3 text-sm">
              <span className="shrink-0 font-semibold text-gray-500 w-4">{i + 1}.</span>
              <div>
                <span className="font-semibold text-gray-700">{c.label}</span>
                <span className="text-gray-500"> — {c.description}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
