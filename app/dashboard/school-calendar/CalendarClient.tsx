'use client'

import { useState, useTransition } from 'react'
import type { CalendarEvent } from './actions'
import { addCalendarEvent, deleteCalendarEvent, parsePdfCalendar, importParsedEvents } from './actions'

type ParsedEvent = { event_date: string; event_type: string; label: string }

const EVENT_META: Record<string, { label: string; color: string }> = {
  conge:               { label: 'Congé',               color: 'bg-red-100 text-red-700' },
  journee_pedagogique: { label: 'Jour. pédagogique',   color: 'bg-blue-100 text-blue-700' },
  rencontre_parents:   { label: 'Rencontre parents',   color: 'bg-purple-100 text-purple-700' },
  debut_etape:         { label: 'Début d\'étape',      color: 'bg-green-100 text-green-700' },
  fin_etape:           { label: 'Fin d\'étape',        color: 'bg-orange-100 text-orange-700' },
  examen:              { label: 'Examen/Éval.',        color: 'bg-yellow-100 text-yellow-700' },
  autre:               { label: 'Autre',               color: 'bg-gray-100 text-gray-600' },
}

const DAYS_FR = ['dim.', 'lun.', 'mar.', 'mer.', 'jeu.', 'ven.', 'sam.']
const MONTHS_FR = ['jan.', 'fév.', 'mars', 'avr.', 'mai', 'juin', 'juil.', 'août', 'sept.', 'oct.', 'nov.', 'déc.']

function formatEventDate(dateStr: string): string {
  const [y, m, d] = dateStr.split('-').map(Number)
  const date = new Date(y, m - 1, d)
  return `${DAYS_FR[date.getDay()]} ${date.getDate()} ${MONTHS_FR[m - 1]}`
}

function EventRow({
  event,
  onDelete,
  disabled,
}: {
  event: ParsedEvent & { id?: string }
  onDelete?: () => void
  disabled?: boolean
}) {
  const meta = EVENT_META[event.event_type] ?? EVENT_META.autre
  return (
    <div className="flex items-center gap-3 px-5 py-3 border-b last:border-b-0 hover:bg-gray-50">
      <span className="text-sm text-gray-500 w-28 shrink-0">{formatEventDate(event.event_date)}</span>
      <span className={`text-xs px-2 py-0.5 rounded-full font-medium shrink-0 ${meta.color}`}>{meta.label}</span>
      <span className="text-sm text-gray-800 flex-1 truncate">{event.label}</span>
      {onDelete && (
        <button
          onClick={onDelete}
          disabled={disabled}
          className="text-gray-300 hover:text-red-500 transition shrink-0"
          title="Supprimer"
        >
          ✕
        </button>
      )}
    </div>
  )
}

export default function CalendarClient({
  initialEvents,
  schoolYear,
}: {
  initialEvents: CalendarEvent[]
  schoolYear: string
}) {
  const [tab, setTab] = useState<'list' | 'add' | 'import'>('list')
  const [events, setEvents] = useState(initialEvents)
  const [isPending, startTransition] = useTransition()

  // Add form state
  const [newDate, setNewDate] = useState('')
  const [newType, setNewType] = useState('conge')
  const [newLabel, setNewLabel] = useState('')

  // Import state
  const [parsedEvents, setParsedEvents] = useState<ParsedEvent[]>([])
  const [isParsing, setIsParsing] = useState(false)
  const [parseError, setParseError] = useState<string | null>(null)
  const [isImporting, setIsImporting] = useState(false)

  function handleAddEvent(e: React.FormEvent) {
    e.preventDefault()
    if (!newDate || !newLabel.trim()) return
    startTransition(async () => {
      await addCalendarEvent(schoolYear, newDate, newType, newLabel.trim())
      setEvents(prev =>
        [...prev, { id: crypto.randomUUID(), school_year: schoolYear, event_date: newDate, event_type: newType, label: newLabel.trim() }]
          .sort((a, b) => a.event_date.localeCompare(b.event_date))
      )
      setNewDate('')
      setNewLabel('')
      setTab('list')
    })
  }

  function handleDelete(id: string) {
    startTransition(async () => {
      await deleteCalendarEvent(id)
      setEvents(prev => prev.filter(e => e.id !== id))
    })
  }

  async function handleParsePdf(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const fd = new FormData(e.currentTarget)
    setIsParsing(true)
    setParseError(null)
    setParsedEvents([])
    try {
      const result = await parsePdfCalendar(fd, schoolYear)
      if (result.length === 0) {
        setParseError('Aucune date détectée dans ce PDF. Vérifiez que le fichier contient du texte sélectionnable.')
      } else {
        setParsedEvents(result)
      }
    } catch (err: unknown) {
      setParseError((err as Error).message ?? 'Erreur lors de la lecture du PDF')
    } finally {
      setIsParsing(false)
    }
  }

  async function handleImportParsed() {
    setIsImporting(true)
    try {
      await importParsedEvents(parsedEvents, schoolYear)
      setEvents(prev =>
        [...prev, ...parsedEvents.map(e => ({ id: crypto.randomUUID(), school_year: schoolYear, ...e }))]
          .sort((a, b) => a.event_date.localeCompare(b.event_date))
      )
      setParsedEvents([])
      setTab('list')
    } finally {
      setIsImporting(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-8">
      <div className="flex gap-2 mb-6">
        <button
          onClick={() => setTab('list')}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition ${tab === 'list' ? 'bg-white shadow text-gray-800' : 'text-gray-500 hover:text-gray-700'}`}
        >
          Calendrier ({events.length})
        </button>
        <button
          onClick={() => setTab('add')}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition ${tab === 'add' ? 'bg-white shadow text-gray-800' : 'text-gray-500 hover:text-gray-700'}`}
        >
          + Ajouter un événement
        </button>
        <button
          onClick={() => setTab('import')}
          className={`px-4 py-2 rounded-xl text-sm font-medium transition ${tab === 'import' ? 'bg-white shadow text-gray-800' : 'text-gray-500 hover:text-gray-700'}`}
        >
          ↑ Importer PDF
        </button>
      </div>

      {tab === 'list' && (
        events.length === 0 ? (
          <div className="bg-white rounded-2xl border shadow-sm p-10 text-center text-gray-500">
            <p className="mb-3">Aucun événement pour l&apos;année {schoolYear}.</p>
            <button onClick={() => setTab('add')} className="text-indigo-600 hover:underline text-sm">Ajouter manuellement</button>
            <span className="mx-2 text-gray-300">ou</span>
            <button onClick={() => setTab('import')} className="text-indigo-600 hover:underline text-sm">importer un PDF</button>
          </div>
        ) : (
          <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
            {events.map(event => (
              <EventRow
                key={event.id}
                event={event}
                onDelete={() => handleDelete(event.id)}
                disabled={isPending}
              />
            ))}
          </div>
        )
      )}

      {tab === 'add' && (
        <form onSubmit={handleAddEvent} className="bg-white rounded-2xl border shadow-sm p-6 flex flex-col gap-4">
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Date</label>
            <input
              type="date"
              value={newDate}
              onChange={e => setNewDate(e.target.value)}
              required
              className="w-full border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Type</label>
            <select
              value={newType}
              onChange={e => setNewType(e.target.value)}
              className="w-full border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
            >
              {Object.entries(EVENT_META).map(([val, { label }]) => (
                <option key={val} value={val}>{label}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium text-gray-700 block mb-1">Description</label>
            <input
              type="text"
              value={newLabel}
              onChange={e => setNewLabel(e.target.value)}
              placeholder="ex. Congé de la Toussaint"
              required
              className="w-full border rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400"
            />
          </div>
          <div className="flex gap-3">
            <button
              type="submit"
              disabled={isPending}
              className="flex-1 bg-indigo-600 text-white rounded-xl py-2 text-sm font-semibold hover:bg-indigo-700 disabled:opacity-50 transition"
            >
              Ajouter
            </button>
            <button
              type="button"
              onClick={() => setTab('list')}
              className="px-4 py-2 rounded-xl text-sm text-gray-600 border hover:bg-gray-50 transition"
            >
              Annuler
            </button>
          </div>
        </form>
      )}

      {tab === 'import' && (
        <div className="flex flex-col gap-4">
          <form onSubmit={handleParsePdf} className="bg-white rounded-2xl border shadow-sm p-6 flex flex-col gap-4">
            <p className="text-sm text-gray-500 leading-relaxed">
              Importez le calendrier scolaire de votre commission scolaire en format PDF
              (le PDF doit contenir du texte sélectionnable, non une image scannée).
              Les dates et événements seront détectés automatiquement.
            </p>
            <div>
              <label className="text-sm font-medium text-gray-700 block mb-1">Fichier PDF</label>
              <input
                type="file"
                name="file"
                accept=".pdf"
                required
                className="w-full text-sm text-gray-600 file:mr-3 file:py-1.5 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-indigo-50 file:text-indigo-700 hover:file:bg-indigo-100"
              />
            </div>
            <button
              type="submit"
              disabled={isParsing}
              className="bg-indigo-600 text-white rounded-xl py-2 text-sm font-semibold hover:bg-indigo-700 disabled:opacity-50 transition"
            >
              {isParsing ? 'Analyse en cours…' : 'Analyser le PDF'}
            </button>
            {parseError && <p className="text-sm text-red-600">{parseError}</p>}
          </form>

          {parsedEvents.length > 0 && (
            <div className="bg-white rounded-2xl border shadow-sm overflow-hidden">
              <div className="px-5 py-3 border-b bg-amber-50 flex items-center justify-between">
                <span className="text-sm font-medium text-amber-800">{parsedEvents.length} événements détectés</span>
                <button
                  onClick={handleImportParsed}
                  disabled={isImporting}
                  className="bg-amber-600 text-white px-4 py-1.5 rounded-lg text-sm font-semibold hover:bg-amber-700 disabled:opacity-50 transition"
                >
                  {isImporting ? 'Import…' : 'Tout importer'}
                </button>
              </div>
              <div className="max-h-96 overflow-y-auto">
                {parsedEvents.map((event, i) => (
                  <EventRow key={i} event={event} />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  )
}
