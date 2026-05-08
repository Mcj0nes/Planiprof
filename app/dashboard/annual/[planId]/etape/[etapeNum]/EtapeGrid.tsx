'use client'

import { useState, useTransition, useRef } from 'react'
import Link from 'next/link'
import { assignToWeekInEtape, removeFromWeekInEtape, saveWeekNoteInEtape } from './actions'
import { assignActivityToContent, unassignActivityFromContent } from '../../actions'
import ActivityModal from '../../ActivityModal'

function domainEmoji(name: string): string {
  if (name.includes('Arithm')) return '➕'
  if (name.includes('Mesure'))  return '📏'
  if (name.includes('Géom'))    return '📐'
  if (name.includes('Statist')) return '📊'
  if (name.includes('Probab'))  return '🎲'
  return '📚'
}

const WEEK_COLORS = [
  { bg: '#EDE9FE', text: '#5B21B6', border: '#7C3AED' },
  { bg: '#DBEAFE', text: '#1E40AF', border: '#3B82F6' },
  { bg: '#D1FAE5', text: '#065F46', border: '#10B981' },
  { bg: '#FEF3C7', text: '#92400E', border: '#F59E0B' },
  { bg: '#FCE7F3', text: '#9D174D', border: '#EC4899' },
]

const MONTH_ABBR: Record<number, string> = {
  8: 'août', 9: 'sept.', 10: 'oct.', 11: 'nov.', 12: 'déc.',
  1: 'jan.', 2: 'fév.', 3: 'mars', 4: 'avr.', 5: 'mai', 6: 'juin',
}

function toDateStr(d: Date): string {
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`
}

function getWeeksForEtape(startDate: string, endDate: string) {
  const start = new Date(startDate + 'T00:00:00')
  const end   = new Date(endDate   + 'T00:00:00')

  // Monday on or before start
  const dow = start.getDay()
  const daysBack = dow === 0 ? 6 : dow - 1
  const cursor = new Date(start)
  cursor.setDate(cursor.getDate() - daysBack)

  const weeks: { weekStart: string; label: string; bg: string; text: string; border: string }[] = []
  let colorIdx = 0

  while (cursor <= end) {
    const sunday = new Date(cursor)
    sunday.setDate(sunday.getDate() + 6)

    const monDay  = cursor.getDate()
    const monAbbr = MONTH_ABBR[cursor.getMonth() + 1] ?? ''
    const sunDay  = sunday.getDate()
    const sunAbbr = MONTH_ABBR[sunday.getMonth() + 1] ?? ''

    const label = cursor.getMonth() === sunday.getMonth()
      ? `${monDay}–${sunDay} ${monAbbr}`
      : `${monDay} ${monAbbr}–${sunDay} ${sunAbbr}`

    weeks.push({ weekStart: toDateStr(cursor), label, ...WEEK_COLORS[colorIdx % WEEK_COLORS.length] })
    cursor.setDate(cursor.getDate() + 7)
    colorIdx++
  }

  return weeks
}

type Competency = { id: number; name_fr: string; color: string | null; sort_order: number }
type ContentItem = { id: number; name_fr: string; sort_order: number; competency_id: number; competencies: Competency | null }
type EtapeAssignment = { id: string; etape_number: number | null; week_start: string | null; content_item_id: number }
type WeekNote = { week_start: string; special_activities: string | null; reflective_review: string | null }
type PlanContentActivity = { content_item_id: number; activity_id: string | null; template_id: string | null }
type CalendarEvent = { id: string; event_date: string; event_type: string; label: string }

function addDays(dateStr: string, days: number): string {
  const [y, m, d] = dateStr.split('-').map(Number)
  const dt = new Date(y, m - 1, d + days)
  return `${dt.getFullYear()}-${String(dt.getMonth() + 1).padStart(2, '0')}-${String(dt.getDate()).padStart(2, '0')}`
}

type Props = {
  planId: string
  etapeNumber: number
  startDate: string
  endDate: string
  contentItems: ContentItem[]
  etapeAssignments: EtapeAssignment[]
  weekNotes: WeekNote[]
  planContentActivities?: PlanContentActivity[]
  calendarEvents?: CalendarEvent[]
}

export default function EtapeGrid({ planId, etapeNumber, startDate, endDate, contentItems, etapeAssignments, weekNotes, planContentActivities = [], calendarEvents = [] }: Props) {
  const [localAssignments, setLocalAssignments] = useState<EtapeAssignment[]>(etapeAssignments)
  const [localPca, setLocalPca] = useState<PlanContentActivity[]>(planContentActivities)
  const [selected, setSelected] = useState<ContentItem | null>(null)
  const [, startTransition] = useTransition()
  const [activityModal, setActivityModal] = useState<ContentItem | null>(null)

  function handleTogglePca(contentItemId: number, actId: string | null, tplId: string | null) {
    const assigned = localPca.some(p => p.content_item_id === contentItemId && p.activity_id === actId && p.template_id === tplId)
    if (assigned) {
      setLocalPca(prev => prev.filter(p => !(p.content_item_id === contentItemId && p.activity_id === actId && p.template_id === tplId)))
      startTransition(async () => { await unassignActivityFromContent(planId, contentItemId, actId, tplId) })
    } else {
      setLocalPca(prev => [...prev, { content_item_id: contentItemId, activity_id: actId, template_id: tplId }])
      startTransition(async () => { await assignActivityToContent(planId, contentItemId, actId, tplId) })
    }
  }

  const [notes, setNotes] = useState<Record<string, { special_activities: string; reflective_review: string }>>(
    () => Object.fromEntries(weekNotes.map(n => [n.week_start, {
      special_activities: n.special_activities ?? '',
      reflective_review: n.reflective_review ?? '',
    }]))
  )
  const debounceTimers = useRef<Record<string, ReturnType<typeof setTimeout>>>({})

  function handleNoteChange(weekStart: string, field: 'special_activities' | 'reflective_review', value: string) {
    setNotes(prev => ({ ...prev, [weekStart]: { ...prev[weekStart] ?? { special_activities: '', reflective_review: '' }, [field]: value } }))
    const key = `${weekStart}-${field}`
    clearTimeout(debounceTimers.current[key])
    debounceTimers.current[key] = setTimeout(() => {
      startTransition(async () => { await saveWeekNoteInEtape(planId, weekStart, field, value) })
    }, 800)
  }

  const weeks = getWeeksForEtape(startDate, endDate)

  const weekAssignedIds = new Set(localAssignments.filter(a => a.week_start).map(a => a.content_item_id))
  const etapeAssignedIds = new Set(localAssignments.map(a => a.content_item_id))
  const sidebarItems = contentItems.filter(i => etapeAssignedIds.has(i.id) && !weekAssignedIds.has(i.id))

  const progress = etapeAssignedIds.size ? (weekAssignedIds.size / etapeAssignedIds.size) * 100 : 0

  const competencies = Array.from(
    new Map(contentItems.filter(i => i.competencies).map(i => [i.competency_id, i.competencies!])).values()
  ).sort((a, b) => a.sort_order - b.sort_order)

  function getItemsForWeek(weekStart: string) {
    return localAssignments
      .filter(a => a.week_start === weekStart)
      .map(a => ({ assignment: a, item: contentItems.find(i => i.id === a.content_item_id) }))
      .filter((x): x is { assignment: EtapeAssignment; item: ContentItem } => !!x.item)
  }

  function handleAssignToWeek(weekStart: string) {
    if (!selected) return
    const tempId = `temp-${Date.now()}`
    const existing = localAssignments.find(a => a.content_item_id === selected.id && !a.week_start)
    if (existing) {
      setLocalAssignments(prev => prev.map(a => a.id === existing.id ? { ...a, week_start: weekStart } : a))
    } else {
      setLocalAssignments(prev => [...prev, { id: tempId, etape_number: etapeNumber, week_start: weekStart, content_item_id: selected.id }])
    }
    const captured = selected
    setSelected(null)
    startTransition(async () => { await assignToWeekInEtape(planId, captured.id, etapeNumber, weekStart) })
  }

  function handleRemoveFromWeek(assignment: EtapeAssignment) {
    setLocalAssignments(prev => prev.map(a => a.id === assignment.id ? { ...a, week_start: null } : a))
    setSelected(contentItems.find(i => i.id === assignment.content_item_id) ?? null)
    startTransition(async () => { await removeFromWeekInEtape(assignment.id, planId, etapeNumber) })
  }

  const selectedColor = selected?.competencies?.color ?? '#6366F1'
  const isAssignMode = !!selected

  return (
    <div className="flex h-[calc(100vh-65px)]">

      {/* Sidebar */}
      <aside className="w-72 shrink-0 bg-white border-r flex flex-col">
        <div className="px-5 py-4 border-b">
          <div className="flex justify-between items-baseline mb-2">
            <p className="text-xs font-bold text-gray-700 uppercase tracking-wider">À planifier</p>
            <p className="text-xs text-gray-400 tabular-nums">{weekAssignedIds.size} / {etapeAssignedIds.size}</p>
          </div>
          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div className="h-full rounded-full transition-all duration-500" style={{ width: `${progress}%`, backgroundColor: '#6366F1' }} />
          </div>
          {selected && (
            <div className="mt-3 flex items-center gap-2 px-3 py-2 rounded-lg" style={{ backgroundColor: `${selectedColor}15` }}>
              <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: selectedColor }} />
              <p className="text-xs text-gray-700 flex-1 truncate font-medium leading-snug">{selected.name_fr}</p>
              <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-600 text-xs shrink-0">✕</button>
            </div>
          )}
        </div>

        <div className="flex-1 overflow-y-auto">
          {competencies.map(comp => {
            const items = sidebarItems.filter(i => i.competency_id === comp.id)
            if (items.length === 0) return null
            return (
              <div key={comp.id} className="border-b last:border-0">
                <div className="flex items-center gap-2.5 px-5 py-2.5" style={{ borderLeft: `3px solid ${comp.color ?? '#94A3B8'}` }}>
                  <span className="text-sm">{domainEmoji(comp.name_fr)}</span>
                  <p className="text-xs font-bold flex-1 leading-snug" style={{ color: comp.color ?? '#6B7280' }}>{comp.name_fr}</p>
                  <span className="text-xs rounded-full px-1.5 py-0.5 font-medium" style={{ backgroundColor: `${comp.color ?? '#94A3B8'}15`, color: comp.color ?? '#6B7280' }}>{items.length}</span>
                </div>
                <ul className="px-3 pb-3 flex flex-col gap-1">
                  {items.map(item => {
                    const isSelected = selected?.id === item.id
                    const color = comp.color ?? '#6366F1'
                    return (
                      <li key={item.id}>
                        <button
                          onClick={() => setActivityModal(item)}
                          className="w-full text-left text-xs px-3 py-2 rounded-lg border transition-all"
                          style={isSelected
                            ? { backgroundColor: color, borderColor: 'transparent', color: '#fff', fontWeight: 600 }
                            : { backgroundColor: '#fff', borderColor: '#E5E7EB', color: '#374151', fontWeight: 500 }
                          }
                          onMouseEnter={e => { if (!isSelected) (e.currentTarget as HTMLElement).style.borderColor = color }}
                          onMouseLeave={e => { if (!isSelected) (e.currentTarget as HTMLElement).style.borderColor = '#E5E7EB' }}
                        >
                          <span className="mr-1.5 opacity-70">{domainEmoji(comp.name_fr)}</span>{item.name_fr}
                        </button>
                      </li>
                    )
                  })}
                </ul>
              </div>
            )
          })}

          {sidebarItems.length === 0 && etapeAssignedIds.size > 0 && (
            <div className="flex flex-col items-center justify-center py-10 px-6 text-center">
              <div className="text-3xl mb-2">🎉</div>
              <p className="text-sm font-semibold text-gray-700">Tout est planifié!</p>
              <p className="text-xs text-gray-400 mt-1">Tous les contenus de cette étape ont été assignés à une semaine.</p>
            </div>
          )}

          {etapeAssignedIds.size === 0 && (
            <div className="flex flex-col items-center justify-center py-10 px-6 text-center">
              <p className="text-sm font-semibold text-gray-700">Aucun contenu dans cette étape</p>
              <p className="text-xs text-gray-400 mt-1">Assignez des contenus à cette étape dans la planification globale d&apos;abord.</p>
            </div>
          )}
        </div>
      </aside>

      {/* Activity modal */}
      {activityModal && (
        <ActivityModal
          planId={planId}
          contentItem={activityModal}
          assignedPca={localPca.filter(p => p.content_item_id === activityModal.id)}
          onClose={() => setActivityModal(null)}
          onTogglePca={(actId, tplId) => handleTogglePca(activityModal.id, actId, tplId)}
          onPcaAdded={activityId => setLocalPca(prev => [...prev, { content_item_id: activityModal.id, activity_id: activityId, template_id: null }])}
          assignButtonLabel={weekAssignedIds.has(activityModal.id) ? undefined : "Assigner à une semaine →"}
          onAssign={weekAssignedIds.has(activityModal.id) ? undefined : () => { setSelected(activityModal); setActivityModal(null) }}
        />
      )}

      {/* Week grid */}
      <div className="flex-1 overflow-auto" style={{ backgroundColor: '#C8D8F0' }}>
        {isAssignMode && (
          <div className="sticky top-0 z-10 flex items-center gap-3 px-6 py-2.5 text-sm font-medium text-white shadow-sm" style={{ backgroundColor: selectedColor }}>
            <span className="text-base">👆</span>
            <span>Cliquez sur une semaine pour y assigner <em>«{selected!.name_fr}»</em></span>
          </div>
        )}

        {(() => {
          const half = Math.ceil(weeks.length / 2)
          const rows = [weeks.slice(0, half), weeks.slice(half)]
          return (
            <div className="flex flex-col gap-3 p-4">
              {rows.map((rowWeeks, rowIdx) => (
                <div key={rowIdx} className="flex gap-3">
                  {rowWeeks.map(({ weekStart, label, bg, text, border }) => {
          const weekItems = getItemsForWeek(weekStart)
          const weekEnd = addDays(weekStart, 6)
          const weekEvents = calendarEvents.filter(ev => ev.event_date >= weekStart && ev.event_date <= weekEnd)
          return (
              <div
                key={weekStart}
                onClick={isAssignMode ? () => handleAssignToWeek(weekStart) : undefined}
                className="flex-1 bg-white rounded-xl shadow-sm flex flex-col overflow-hidden transition-all duration-150 min-w-36"
                style={isAssignMode ? { cursor: 'pointer', outline: `2px dashed ${selectedColor}`, outlineOffset: '2px' } : {}}
                onMouseEnter={e => { if (isAssignMode) (e.currentTarget as HTMLElement).style.backgroundColor = `${selectedColor}0D` }}
                onMouseLeave={e => { if (isAssignMode) (e.currentTarget as HTMLElement).style.backgroundColor = '#fff' }}
              >
                <div className="px-3 py-2.5 flex items-start justify-between" style={{ backgroundColor: bg }}>
                  <div>
                    <p className="text-sm font-bold" style={{ color: text }}>{label}</p>
                    {weekItems.length > 0 && (
                      <p className="text-xs mt-0.5" style={{ color: text, opacity: 0.7 }}>{weekItems.length} contenu{weekItems.length !== 1 ? 's' : ''}</p>
                    )}
                  </div>
                  {!isAssignMode && (
                    <Link
                      href={`/dashboard/annual/${planId}/week/${weekStart}?etape=${etapeNumber}`}
                      className="text-xs shrink-0 mt-0.5 hover:opacity-100 opacity-40 transition-opacity"
                      style={{ color: text }}
                      title="Planification hebdomadaire"
                    >
                      →
                    </Link>
                  )}
                </div>

                {weekEvents.length > 0 && (
                  <div className="px-2 py-1 border-b flex flex-wrap gap-1" style={{ backgroundColor: '#FFFBEB' }}>
                    {weekEvents.map(ev => (
                      <span key={ev.id} title={ev.label}
                        className="text-[0.6rem] px-1.5 py-0.5 rounded font-medium"
                        style={{ backgroundColor: '#FEF3C7', color: '#92400E' }}>
                        {ev.label.length > 22 ? ev.label.slice(0, 20) + '…' : ev.label}
                      </span>
                    ))}
                  </div>
                )}

                <div className="flex-1 p-2 flex flex-col gap-1.5">
                  {weekItems.map(({ assignment, item }) => {
                    const pcaCount = localPca.filter(p => p.content_item_id === item.id).length
                    return (
                      <div
                        key={assignment.id}
                        className="group/item flex items-start gap-1.5 text-xs px-2.5 py-2 rounded-lg cursor-pointer"
                        style={{ backgroundColor: bg, borderLeft: `3px solid ${border}` }}
                        onClick={e => { e.stopPropagation(); if (!isAssignMode) setActivityModal(item) }}
                        title="Cliquer pour voir les activités"
                      >
                        <span className="shrink-0 text-xs">{domainEmoji(item.competencies?.name_fr ?? '')}</span>
                        <span className="flex-1 leading-snug font-medium text-[0.8rem]" style={{ color: text }}>{item.name_fr}</span>
                        {pcaCount > 0 && (
                          <span className="shrink-0 text-[0.6rem] font-bold px-1 py-0.5 rounded-full" style={{ backgroundColor: `${text}25`, color: text }}>{pcaCount}</span>
                        )}
                        {!isAssignMode && (
                          <button
                            onClick={e => { e.stopPropagation(); handleRemoveFromWeek(assignment) }}
                            className="shrink-0 opacity-0 group-hover/item:opacity-50 hover:!opacity-100 text-[0.75rem] leading-none transition-opacity"
                            style={{ color: text }}
                            title="Déplacer"
                          >×</button>
                        )}
                      </div>
                    )
                  })}
                  {weekItems.length === 0 && !isAssignMode && <p className="text-xs text-gray-300 text-center mt-4">—</p>}
                </div>

                <div className="border-t px-2 pb-2 pt-2 flex flex-col gap-1.5">
                  <div>
                    <p className="text-[0.65rem] font-bold uppercase tracking-wide mb-1" style={{ color: text }}>Activités spéciales</p>
                    <textarea
                      rows={2}
                      value={notes[weekStart]?.special_activities ?? ''}
                      onChange={e => handleNoteChange(weekStart, 'special_activities', e.target.value)}
                      placeholder="..."
                      className="w-full text-xs rounded-lg border border-gray-100 px-2 py-1.5 resize-none focus:outline-none focus:border-indigo-300 text-gray-700 placeholder-gray-300"
                      style={{ backgroundColor: `${bg}60` }}
                    />
                  </div>
                  <div>
                    <p className="text-[0.65rem] font-bold uppercase tracking-wide mb-1" style={{ color: text }}>Retour réflexif</p>
                    <textarea
                      rows={2}
                      value={notes[weekStart]?.reflective_review ?? ''}
                      onChange={e => handleNoteChange(weekStart, 'reflective_review', e.target.value)}
                      placeholder="..."
                      className="w-full text-xs rounded-lg border border-gray-100 px-2 py-1.5 resize-none focus:outline-none focus:border-indigo-300 text-gray-700 placeholder-gray-300"
                      style={{ backgroundColor: `${bg}60` }}
                    />
                  </div>
                </div>
              </div>
            )
          })}
                </div>
              ))}
            </div>
          )
        })()}
      </div>
    </div>
  )
}
