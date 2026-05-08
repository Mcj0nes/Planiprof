'use client'

import { useState, useTransition, useRef, useEffect } from 'react'
import {
  assignToPeriod, removeFromPeriod, saveWeekendNote,
  createWeekSticker, updateStickerPosition, updateStickerWidth, deleteWeekSticker,
  savePeriodTime, addWeekActivity, removeWeekActivity, updatePeriodCount,
} from './actions'

const DAY_STYLES = [
  { label: 'Lundi',    bg: '#EDE9FE', text: '#5B21B6' },
  { label: 'Mardi',    bg: '#DBEAFE', text: '#1E40AF' },
  { label: 'Mercredi', bg: '#D1FAE5', text: '#065F46' },
  { label: 'Jeudi',    bg: '#FEF3C7', text: '#92400E' },
  { label: 'Vendredi', bg: '#FCE7F3', text: '#9D174D' },
]

const MONTH_ABBR: Record<number, string> = {
  8: 'août', 9: 'sept.', 10: 'oct.', 11: 'nov.', 12: 'déc.',
  1: 'jan.', 2: 'fév.', 3: 'mars', 4: 'avr.', 5: 'mai', 6: 'juin',
}

const SPECIAL_COLOR = '#F59E0B'
const SPECIAL_BG    = '#FEF3C7'
const SPECIAL_TEXT  = '#92400E'

const AUTOCOLLANTS_CLASSIQUES = [
  'Anglais', 'Art dramatique', 'Arts plastiques', 'CCQ', 'Congé', 'Danse',
  'Formation', 'Français', 'Géographie', 'Histoire', 'Journée pédagogique',
  'Mathémtique', 'Musique', 'Orthophonie (2)', 'Orthopédagogie', 'Psychoéducation',
  'Période libre', 'Rencontre pédagogique', 'Sciences et technologies',
  'Surveillance', 'TES', 'Éducation physique',
  'coeurs', 'Stickers cute',
]

const AUTOCOLLANTS_NOUVEAUX = [
  'Arc-en-ciel', 'Soleil', 'Copilot_20260427_175131',
  'Splat amoureux', 'Splat arts plastiques', 'Splat coeur', 'Splat confus',
  'Splat fatigué', 'Splat fâché', 'Splat génial', 'Splat heureux',
  'Splat infomatique', 'Splat magnifique', 'Splat mathématiques', 'Splat musique',
  'Splat rêveur', 'Splat stressé', 'Splat triste',
  'Splat éducation physique', 'Splat éducation',
  'Splat_français', 'Splat_géographie', 'Splat_histoire', 'Splat_sciences',
]

const NOUVEAUX_SET = new Set(AUTOCOLLANTS_NOUVEAUX)

function stickerSrc(name: string): string {
  if (NOUVEAUX_SET.has(name)) return `/Nouveaux stickers/${encodeURIComponent(name)}.png`
  return `/Stickers/${encodeURIComponent(name)}.png`
}

function getDayDate(weekStart: string, offset: number): Date {
  const [y, m, d] = weekStart.split('-').map(Number)
  return new Date(y, m - 1, d + offset)
}

function hexToRgb(hex: string) {
  const r = parseInt(hex.slice(1, 3), 16)
  const g = parseInt(hex.slice(3, 5), 16)
  const b = parseInt(hex.slice(5, 7), 16)
  return `${r}, ${g}, ${b}`
}

function fileIcon(type: string | null): string {
  if (!type) return '📎'
  if (type.startsWith('image/')) return '🖼'
  if (type === 'application/pdf') return '📄'
  if (type.includes('word')) return '📝'
  if (type.includes('excel') || type.includes('spreadsheet')) return '📊'
  if (type.includes('powerpoint') || type.includes('presentation')) return '📑'
  return '📎'
}

// ── Types ──────────────────────────────────────────────────────

type Subject      = { id: number; name_fr: string; color: string | null }
type Competency   = { id: number; name_fr: string; color: string | null; sort_order: number; subject_id?: number; subjects?: Subject | null }
type ContentItem  = { id: number; name_fr: string; sort_order: number; competency_id: number; competencies: Competency | null }
type DayPeriod    = { id: string; day_of_week: number; period_number: number; content_item_id: number | null; is_special_activity: boolean }
type DayNote      = { day_of_week: number; note: string | null }
type WeekSticker  = { id: string; sticker_name: string; x: number; y: number; width: number }

type WeekActivity = {
  id: string
  activity_id: string | null
  template_id: string | null
  title: string
  type_tag: string | null
  duration_min: number | null
  attachments: { id: string; file_name: string; file_path: string; file_type: string | null }[]
  is_template: boolean
}

type AvailableActivity = {
  id: string
  title: string
  type_tag: string | null
  duration_min: number | null
  is_template: boolean
}

type Selected  = { kind: 'item'; item: ContentItem } | { kind: 'special' }
type Popup     = { slotId: string; x: number; y: number; toLeft: boolean }
type DragState = { id: string; kind: 'move' | 'resize'; startX: number; startY: number; origX: number; origY: number; origWidth: number }

type PlanContentActivity = {
  content_item_id: number
  activity_id: string | null
  template_id: string | null
}

type Props = {
  planId: string
  weekStart: string
  contentItems: ContentItem[]
  dayPeriods: DayPeriod[]
  dayNotes: DayNote[]
  weekStickers: WeekSticker[]
  periodTimes: { period_number: number; time_label: string }[]
  weekActivities: WeekActivity[]
  availableActivities: AvailableActivity[]
  planContentActivities?: PlanContentActivity[]
  periodCount?: number
  planLabel?: string
}

function getSubjectInfo(item: ContentItem) {
  const subj  = item.competencies?.subjects
  const color = subj?.color ?? item.competencies?.color ?? '#6366F1'
  return { name: subj?.name_fr ?? item.competencies?.name_fr ?? 'Contenu', color, bg: `rgba(${hexToRgb(color)}, 0.12)` }
}

export default function WeeklyGrid({ planId, weekStart, contentItems, dayPeriods, dayNotes, weekStickers, periodTimes, weekActivities: weekActivitiesInit, availableActivities, planContentActivities = [], periodCount: periodCountInit = 6, planLabel = '' }: Props) {
  const [localPeriods, setLocalPeriods]           = useState<DayPeriod[]>(dayPeriods.map(p => ({ ...p, is_special_activity: p.is_special_activity ?? false })))
  const [selected, setSelected]                   = useState<Selected | null>(null)
  const [selectedSticker, setSelectedSticker]     = useState<string | null>(null)
  const [sidebarTab, setSidebarTab]               = useState<'contents' | 'autocollants' | 'activites'>('contents')
  const [popup, setPopup]                         = useState<Popup | null>(null)
  const [localStickers, setLocalStickers]         = useState<WeekSticker[]>(weekStickers)
  const [hoveredSticker, setHoveredSticker]       = useState<string | null>(null)
  const [localWeekActivities, setLocalWeekActivities] = useState<WeekActivity[]>(weekActivitiesInit)
  const [showActivityModal, setShowActivityModal] = useState(false)
  const [activitySearch, setActivitySearch]       = useState('')
  const [localPeriodTimes, setLocalPeriodTimes]   = useState<Record<number, string>>(
    () => Object.fromEntries(periodTimes.map(pt => [pt.period_number, pt.time_label]))
  )
  const [weekendNotes, setWeekendNotes] = useState<Record<number, string>>(
    () => Object.fromEntries(dayNotes.map(n => [n.day_of_week, n.note ?? '']))
  )
  const [localPeriodCount, setLocalPeriodCount] = useState(periodCountInit)
  const [, startTransition] = useTransition()
  const debounceTimers   = useRef<Record<string, ReturnType<typeof setTimeout>>>({})
  const dragRef          = useRef<DragState | null>(null)
  const localStickersRef = useRef<WeekSticker[]>(localStickers)
  const gridRef          = useRef<HTMLDivElement>(null)

  useEffect(() => { localStickersRef.current = localStickers }, [localStickers])

  useEffect(() => {
    if (!popup) return
    const close = () => setPopup(null)
    document.addEventListener('click', close)
    return () => document.removeEventListener('click', close)
  }, [popup])

  // Placement count per content item (for sidebar badges)
  const placementCounts = new Map<number, number>()
  for (const p of localPeriods) {
    if (p.content_item_id !== null && !p.is_special_activity) {
      placementCounts.set(p.content_item_id, (placementCounts.get(p.content_item_id) ?? 0) + 1)
    }
  }

  const subjectGroups = (() => {
    const map = new Map<string, { id: number | string; name: string; color: string; items: ContentItem[] }>()
    for (const item of contentItems) {
      const subj = item.competencies?.subjects
      const key  = subj ? String(subj.id) : `comp-${item.competency_id}`
      if (!map.has(key)) map.set(key, {
        id: subj?.id ?? item.competency_id,
        name: subj?.name_fr ?? item.competencies?.name_fr ?? 'Autres',
        color: subj?.color ?? item.competencies?.color ?? '#94A3B8',
        items: [],
      })
      map.get(key)!.items.push(item)
    }
    return Array.from(map.values())
  })()

  // Activities suggested from the annual plan (linked to this week's content items)
  const suggestedActIds = new Set(planContentActivities.map(p => p.activity_id).filter(Boolean) as string[])
  const suggestedTplIds = new Set(planContentActivities.map(p => p.template_id).filter(Boolean) as string[])
  const suggestedActivities = availableActivities.filter(act =>
    act.is_template ? suggestedTplIds.has(act.id) : suggestedActIds.has(act.id)
  )

  const filteredAvailable = availableActivities.filter(act => {
    if (!activitySearch) return true
    const q = activitySearch.toLowerCase()
    return act.title.toLowerCase().includes(q) || (act.type_tag ?? '').toLowerCase().includes(q)
  })

  function getSlots(day: number, period: number) {
    return localPeriods.filter(p => p.day_of_week === day && p.period_number === period)
  }

  function handleClickPeriod(day: number, period: number) {
    if (!selected) return
    const isSpecial = selected.kind === 'special'
    const itemId    = selected.kind === 'item' ? selected.item.id : null
    const id        = crypto.randomUUID()
    setLocalPeriods(prev => [
      ...prev,
      { id, day_of_week: day, period_number: period, content_item_id: itemId, is_special_activity: isSpecial },
    ])
    startTransition(async () => { await assignToPeriod(id, planId, weekStart, day, period, itemId, isSpecial) })
  }

  function handleRemoveSlot(slotId: string) {
    const slot = localPeriods.find(p => p.id === slotId)
    if (!slot) return
    if (slot.content_item_id) {
      const item = contentItems.find(i => i.id === slot.content_item_id)
      if (item) setSelected({ kind: 'item', item })
    }
    setLocalPeriods(prev => prev.filter(p => p.id !== slotId))
    setPopup(null)
    startTransition(async () => { await removeFromPeriod(slotId) })
  }

  function openPopup(e: React.MouseEvent, slot: DayPeriod) {
    e.stopPropagation()
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
    setPopup({ slotId: slot.id, x: rect.left, y: rect.bottom + 6, toLeft: rect.left > window.innerWidth / 2 })
  }

  function handleWeekendNote(dayOfWeek: 6 | 7, value: string) {
    setWeekendNotes(prev => ({ ...prev, [dayOfWeek]: value }))
    const key = String(dayOfWeek)
    clearTimeout(debounceTimers.current[key])
    debounceTimers.current[key] = setTimeout(() => {
      startTransition(async () => { await saveWeekendNote(planId, weekStart, dayOfWeek, value) })
    }, 800)
  }

  function handlePeriodCountChange(delta: number) {
    const next = Math.max(1, Math.min(12, localPeriodCount + delta))
    setLocalPeriodCount(next)
    startTransition(async () => { await updatePeriodCount(planId, next) })
  }

  function handlePeriodTimeChange(periodNum: number, value: string) {
    setLocalPeriodTimes(prev => ({ ...prev, [periodNum]: value }))
    const key = `pt-${periodNum}`
    clearTimeout(debounceTimers.current[key])
    debounceTimers.current[key] = setTimeout(() => {
      startTransition(async () => { await savePeriodTime(planId, periodNum, value) })
    }, 800)
  }

  function handleGridClick(e: React.MouseEvent<HTMLDivElement>) {
    if (!selectedSticker || dragRef.current) return
    const el   = e.currentTarget
    const rect = el.getBoundingClientRect()
    const x    = Math.max(0, e.clientX - rect.left + el.scrollLeft - 40)
    const y    = Math.max(0, e.clientY - rect.top  + el.scrollTop  - 40)
    const id   = crypto.randomUUID()
    setLocalStickers(prev => [...prev, { id, sticker_name: selectedSticker, x, y, width: 80 }])
    startTransition(async () => { await createWeekSticker(id, planId, weekStart, selectedSticker, x, y, 80) })
  }

  function handleAddWeekActivity(act: AvailableActivity) {
    const id: string = crypto.randomUUID()
    const newWa: WeekActivity = {
      id,
      activity_id:  act.is_template ? null : act.id,
      template_id:  act.is_template ? act.id : null,
      title:        act.title,
      type_tag:     act.type_tag,
      duration_min: act.duration_min,
      attachments:  [],
      is_template:  act.is_template,
    }
    setLocalWeekActivities(prev => [...prev, newWa])
    startTransition(async () => {
      await addWeekActivity(id, planId, weekStart, act.is_template ? null : act.id, act.is_template ? act.id : null)
    })
  }

  function handleRemoveWeekActivity(waId: string) {
    setLocalWeekActivities(prev => prev.filter(wa => wa.id !== waId))
    startTransition(async () => { await removeWeekActivity(waId) })
  }

  const isAssignMode  = !!selected
  const isStickerMode = !!selectedSticker
  const selectedColor = selected?.kind === 'item'
    ? (selected.item.competencies?.subjects?.color ?? selected.item.competencies?.color ?? '#6366F1')
    : selected?.kind === 'special' ? SPECIAL_COLOR : '#6366F1'

  const popupSlot    = popup ? localPeriods.find(p => p.id === popup.slotId) : null
  const popupItem    = popupSlot?.content_item_id ? contentItems.find(i => i.id === popupSlot.content_item_id) ?? null : null
  const popupSpecial = popupSlot?.is_special_activity ?? false

  return (
    <>
    <div className="flex h-[calc(100vh-65px)] print:hidden">

      {/* ── Sidebar ──────────────────────────────────────────── */}
      <aside className="w-64 shrink-0 bg-white border-r flex flex-col">
        <div className="px-3 py-3 border-b">
          {/* 3-tab bar */}
          <div className="flex gap-0.5 mb-3 bg-gray-100 rounded-xl p-1">
            <button
              onClick={() => setSidebarTab('contents')}
              className={`flex-1 text-xs py-2.5 rounded-lg font-bold transition ${sidebarTab === 'contents' ? 'bg-white shadow text-gray-800' : 'text-gray-400 hover:text-gray-600'}`}
            >
              Contenus
            </button>
            <button
              onClick={() => setSidebarTab('activites')}
              className={`flex-1 text-xs py-2.5 rounded-lg font-bold transition flex items-center justify-center gap-1 ${sidebarTab === 'activites' ? 'bg-white shadow text-gray-800' : 'text-gray-400 hover:text-gray-600'}`}
            >
              Activités
              {localWeekActivities.length > 0 && (
                <span className={`text-[0.6rem] px-1.5 py-0.5 rounded-full font-bold ${sidebarTab === 'activites' ? 'bg-indigo-100 text-indigo-600' : 'bg-gray-200 text-gray-500'}`}>
                  {localWeekActivities.length}
                </span>
              )}
            </button>
            <button
              onClick={() => setSidebarTab('autocollants')}
              className={`flex-1 text-xs py-2.5 rounded-lg font-bold transition ${sidebarTab === 'autocollants' ? 'bg-white shadow text-gray-800' : 'text-gray-400 hover:text-gray-600'}`}
            >
              Autocollant
            </button>
          </div>

          {sidebarTab === 'contents' && (
            <>
              <button
                onClick={() => { setSelectedSticker(null); setSelected(selected?.kind === 'special' ? null : { kind: 'special' }) }}
                className="w-full text-left text-xs px-3 py-2 rounded-lg border font-semibold transition-all mb-2"
                style={selected?.kind === 'special'
                  ? { backgroundColor: SPECIAL_COLOR, borderColor: 'transparent', color: '#fff' }
                  : { backgroundColor: SPECIAL_BG, borderColor: SPECIAL_COLOR, color: SPECIAL_TEXT }}
              >
                ⭐ Activité spéciale
              </button>
              {selected?.kind === 'item' && (
                <div className="flex items-center gap-2 px-3 py-2 rounded-lg" style={{ backgroundColor: `${selectedColor}15` }}>
                  <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: selectedColor }} />
                  <p className="text-xs text-gray-700 flex-1 truncate font-medium">{selected.item.name_fr}</p>
                  <button onClick={() => setSelected(null)} className="text-gray-400 hover:text-gray-600 text-xs shrink-0">✕</button>
                </div>
              )}
            </>
          )}

          {sidebarTab === 'autocollants' && selectedSticker && (
            <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-purple-50 border border-purple-200">
              <img src={stickerSrc(selectedSticker)} className="w-6 h-6 object-contain shrink-0" alt={selectedSticker} />
              <p className="text-xs text-purple-700 flex-1 truncate font-semibold">{selectedSticker}</p>
              <button onClick={() => setSelectedSticker(null)} className="text-purple-400 hover:text-purple-600 text-xs shrink-0">✕</button>
            </div>
          )}
        </div>

        {/* ── Contenus tab ── */}
        {sidebarTab === 'contents' && (
          <div className="flex-1 overflow-y-auto">
            {subjectGroups.map(group => (
              <div key={String(group.id)} className="border-b last:border-0">
                <div className="flex items-center gap-2 px-4 py-2.5" style={{ borderLeft: `3px solid ${group.color}` }}>
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: group.color }} />
                  <p className="text-xs font-bold flex-1" style={{ color: group.color }}>{group.name}</p>
                  <span className="text-xs rounded-full px-1.5 py-0.5 font-medium tabular-nums"
                    style={{ backgroundColor: `${group.color}20`, color: group.color }}>
                    {group.items.length}
                  </span>
                </div>
                <ul className="px-3 pb-2 flex flex-col gap-1">
                  {group.items.map(item => {
                    const isSelected = selected?.kind === 'item' && selected.item.id === item.id
                    const count      = placementCounts.get(item.id) ?? 0
                    const color      = group.color
                    return (
                      <li key={item.id}>
                        <button
                          onClick={() => { setSelectedSticker(null); setSelected(isSelected ? null : { kind: 'item', item }) }}
                          className="w-full text-left text-xs px-3 py-2 rounded-lg border transition-all flex items-center gap-1"
                          style={isSelected
                            ? { backgroundColor: color, borderColor: 'transparent', color: '#fff', fontWeight: 600 }
                            : { backgroundColor: '#fff', borderColor: '#E5E7EB', color: '#374151', fontWeight: 500 }}
                          onMouseEnter={e => { if (!isSelected) (e.currentTarget as HTMLElement).style.borderColor = color }}
                          onMouseLeave={e => { if (!isSelected) (e.currentTarget as HTMLElement).style.borderColor = '#E5E7EB' }}
                        >
                          <span className="flex-1 truncate">{item.name_fr}</span>
                          {count > 0 && (
                            <span className="shrink-0 text-[0.6rem] font-bold px-1.5 py-0.5 rounded-full tabular-nums"
                              style={{ backgroundColor: isSelected ? 'rgba(255,255,255,0.25)' : `${color}20`, color: isSelected ? '#fff' : color }}>
                              ×{count}
                            </span>
                          )}
                        </button>
                      </li>
                    )
                  })}
                </ul>
              </div>
            ))}
            {contentItems.length === 0 && (
              <div className="py-10 px-4 text-center">
                <p className="text-sm text-gray-500">Aucun contenu assigné à cette semaine.</p>
                <p className="text-xs text-gray-400 mt-1">Assignez des contenus depuis la vue mensuelle d'abord.</p>
              </div>
            )}
          </div>
        )}

        {/* ── Activités tab ── */}
        {sidebarTab === 'activites' && (
          <div className="flex-1 overflow-y-auto flex flex-col">
            <div className="p-3 border-b">
              <button
                onClick={() => setShowActivityModal(true)}
                className="w-full text-xs py-2 rounded-xl border border-dashed border-indigo-300 text-indigo-500 hover:bg-indigo-50 transition font-semibold"
              >
                + Ajouter une activité
              </button>
            </div>

            {suggestedActivities.length > 0 && (
              <div className="px-3 pt-3 pb-2 border-b">
                <p className="text-[0.65rem] font-bold uppercase tracking-wider text-indigo-400 mb-2">Depuis la planification</p>
                <div className="flex flex-col gap-1.5">
                  {suggestedActivities.map(act => {
                    const isAdded = localWeekActivities.some(wa =>
                      (wa.activity_id === act.id && !act.is_template) ||
                      (wa.template_id === act.id && act.is_template)
                    )
                    return (
                      <button
                        key={act.id}
                        disabled={isAdded}
                        onClick={() => { if (!isAdded) handleAddWeekActivity(act) }}
                        className={`w-full text-left px-2.5 py-2 rounded-xl border transition flex items-center gap-2 ${
                          isAdded
                            ? 'border-gray-100 bg-gray-50 opacity-50 cursor-not-allowed'
                            : 'border-indigo-100 bg-indigo-50 hover:border-indigo-300 hover:bg-indigo-100 cursor-pointer'
                        }`}
                      >
                        <div className="flex-1 min-w-0">
                          {act.is_template && (
                            <span className="text-[0.55rem] font-bold text-teal-600 bg-teal-50 px-1 py-0.5 rounded-full mr-1">Causerie</span>
                          )}
                          <span className="text-xs font-semibold text-gray-800">{act.title}</span>
                        </div>
                        {isAdded
                          ? <span className="text-[0.65rem] text-green-500 shrink-0">✓</span>
                          : <span className="text-[0.65rem] text-indigo-500 shrink-0 font-bold">+</span>
                        }
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {localWeekActivities.length === 0 ? (
              <div className="py-10 px-4 text-center flex-1">
                <p className="text-sm text-gray-400">Aucune activité cette semaine.</p>
                <p className="text-xs text-gray-400 mt-1">Ajoutez des activités depuis la banque pour y accéder en classe.</p>
              </div>
            ) : (
              <div className="p-2 flex flex-col gap-2 flex-1 overflow-y-auto">
                {localWeekActivities.map(wa => (
                  <div key={wa.id} className="bg-white rounded-xl border overflow-hidden">
                    {/* Color bar */}
                    <div className="h-0.5" style={{ backgroundColor: wa.is_template ? '#0d9488' : '#6366F1' }} />
                    <div className="p-2.5">
                      <div className="flex items-start gap-1 mb-1.5">
                        <div className="flex-1 min-w-0">
                          {wa.is_template && (
                            <span className="text-[0.55rem] font-bold text-teal-600 bg-teal-50 px-1 py-0.5 rounded-full">Causerie</span>
                          )}
                          <p className="text-xs font-semibold text-gray-800 leading-snug mt-0.5 line-clamp-2">{wa.title}</p>
                          <div className="flex items-center gap-1.5 mt-0.5">
                            {wa.type_tag && <span className="text-[0.6rem] text-gray-400">{wa.type_tag}</span>}
                            {wa.duration_min && <span className="text-[0.6rem] text-gray-400">· {wa.duration_min} min</span>}
                          </div>
                        </div>
                        <button
                          onClick={() => handleRemoveWeekActivity(wa.id)}
                          className="text-gray-300 hover:text-red-400 transition text-xs shrink-0 mt-0.5"
                        >×</button>
                      </div>

                      {/* File attachments */}
                      {wa.attachments.length > 0 && (
                        <div className="space-y-1 mb-2">
                          {wa.attachments.map(att => (
                            <div key={att.id} className="flex items-center gap-1 text-[0.65rem] text-gray-500">
                              <span>{fileIcon(att.file_type)}</span>
                              <span className="truncate flex-1">{att.file_name}</span>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Present link */}
                      <a
                        href={`/dashboard/activities/present/${wa.activity_id ?? wa.template_id}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-center gap-1.5 w-full text-[0.65rem] font-bold text-indigo-600 hover:text-indigo-800 bg-indigo-50 hover:bg-indigo-100 transition rounded-lg py-1.5"
                      >
                        <span>▶</span> Présenter en classe
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* ── Autocollants tab ── */}
        {sidebarTab === 'autocollants' && (
          <div className="flex-1 overflow-y-auto p-3">
            <p className="text-xs text-gray-400 mb-3 leading-snug">Sélectionnez un autocollant, puis cliquez n'importe où sur le tableau pour le placer. Faites-le glisser pour le déplacer.</p>
            {[
              { label: 'Classiques', items: AUTOCOLLANTS_CLASSIQUES },
              { label: 'Nouveaux', items: AUTOCOLLANTS_NOUVEAUX },
            ].map(({ label, items }) => (
              <div key={label} className="mb-4">
                <p className="text-[0.65rem] font-bold text-gray-400 uppercase tracking-wider mb-2">{label}</p>
                <div className="grid grid-cols-3 gap-2">
                  {items.map(name => (
                    <button
                      key={name}
                      onClick={() => { setSelected(null); setSelectedSticker(selectedSticker === name ? null : name) }}
                      className={`flex flex-col items-center gap-1 p-2 rounded-xl border-2 transition ${
                        selectedSticker === name ? 'border-purple-500 bg-purple-50' : 'border-transparent hover:border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      <img src={stickerSrc(name)} className="w-10 h-10 object-contain" alt={name} />
                      <span className="text-[0.6rem] text-gray-600 text-center leading-tight line-clamp-2">{name}</span>
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </div>
        )}
      </aside>

      {/* ── Grid ─────────────────────────────────────────────── */}
      <div className="flex-1 overflow-auto" style={{ backgroundColor: '#C8D8F0' }}>

        {isAssignMode && !isStickerMode && (
          <div className="sticky top-0 z-10 flex items-center gap-3 px-6 py-2.5 text-sm font-medium text-white shadow-sm" style={{ backgroundColor: selectedColor }}>
            <span>👆</span>
            {selected?.kind === 'special'
              ? <span className="flex-1">Cliquez sur une période pour marquer une <em>Activité spéciale</em></span>
              : <span className="flex-1">Cliquez sur une période pour y assigner <em>«{(selected as { kind: 'item'; item: ContentItem }).item.name_fr}»</em></span>
            }
            <button onClick={() => setSelected(null)} className="text-white/80 hover:text-white text-xs font-semibold px-2 py-1 rounded bg-white/20 shrink-0">Terminer</button>
          </div>
        )}
        {isStickerMode && (
          <div className="sticky top-0 z-10 flex items-center gap-3 px-6 py-2.5 text-sm font-medium text-white shadow-sm bg-purple-600">
            <img src={stickerSrc(selectedSticker!)} className="w-5 h-5 object-contain shrink-0" alt={selectedSticker!} />
            <span className="flex-1">Cliquez n'importe où sur le tableau pour placer <em>«{selectedSticker}»</em></span>
            <button onClick={() => setSelectedSticker(null)} className="text-white/80 hover:text-white text-xs font-semibold px-2 py-1 rounded bg-white/20 shrink-0">Terminer</button>
          </div>
        )}

        <div
          ref={gridRef}
          className="flex gap-2 p-3 min-h-full"
          style={{ position: 'relative', cursor: isStickerMode ? 'copy' : 'default' }}
          onClick={handleGridClick}
        >

          {/* ── Time column ── */}
          <div className="w-14 shrink-0 flex flex-col gap-2">
            <div className="rounded-xl px-3 py-2.5" style={{ visibility: 'hidden', flexShrink: 0 }}>
              <p className="text-sm font-bold">·</p>
              <p className="text-xs mt-0.5">·</p>
            </div>
            {Array.from({ length: localPeriodCount }, (_, i) => {
              const periodNum = i + 1
              return (
                <div key={periodNum} className="flex-1 flex items-center" style={{ minHeight: 52 }}>
                  <input
                    value={localPeriodTimes[periodNum] ?? ''}
                    onChange={e => handlePeriodTimeChange(periodNum, e.target.value)}
                    placeholder="–"
                    onClick={e => e.stopPropagation()}
                    className="w-full text-center text-[0.65rem] text-gray-500 bg-white rounded-lg border border-gray-100 hover:border-gray-300 focus:border-indigo-300 focus:outline-none px-1 py-1.5 placeholder-gray-300 transition"
                  />
                </div>
              )
            })}
            {/* +/- period buttons */}
            <div className="flex flex-col gap-1 pt-1" onClick={e => e.stopPropagation()}>
              <button
                onClick={() => handlePeriodCountChange(1)}
                disabled={localPeriodCount >= 12}
                title="Ajouter une période"
                className="w-full text-xs py-1 rounded-lg bg-white border border-gray-200 text-gray-500 hover:border-indigo-400 hover:text-indigo-600 disabled:opacity-30 disabled:cursor-not-allowed transition font-bold"
              >+</button>
              <button
                onClick={() => handlePeriodCountChange(-1)}
                disabled={localPeriodCount <= 1}
                title="Retirer une période"
                className="w-full text-xs py-1 rounded-lg bg-white border border-gray-200 text-gray-500 hover:border-red-400 hover:text-red-500 disabled:opacity-30 disabled:cursor-not-allowed transition font-bold"
              >−</button>
            </div>
          </div>

          {/* ── Weekday columns ── */}
          {DAY_STYLES.map(({ label, bg, text }, idx) => {
            const dayOfWeek = idx + 1
            const date      = getDayDate(weekStart, idx)
            const dateLabel = `${date.getDate()} ${MONTH_ABBR[date.getMonth() + 1] ?? ''}`

            return (
              <div key={dayOfWeek} className="flex-1 flex flex-col gap-2 min-w-28">
                <div className="rounded-xl px-3 py-2.5" style={{ backgroundColor: bg }}>
                  <p className="text-sm font-bold" style={{ color: text }}>{label}</p>
                  <p className="text-xs mt-0.5" style={{ color: text, opacity: 0.7 }}>{dateLabel}</p>
                </div>

                {Array.from({ length: localPeriodCount }, (_, i) => {
                  const periodNumber = i + 1
                  const slots        = getSlots(dayOfWeek, periodNumber)
                  const isEmpty      = slots.length === 0

                  return (
                    <div
                      key={periodNumber}
                      onClick={e => {
                        if (!isStickerMode) e.stopPropagation()
                        if (!isStickerMode && isAssignMode) handleClickPeriod(dayOfWeek, periodNumber)
                      }}
                      className="rounded-xl flex-1 flex flex-col overflow-visible transition-all duration-100"
                      style={{
                        backgroundColor: '#fff',
                        minHeight: '52px',
                        ...(isAssignMode && !isStickerMode ? {
                          cursor: 'pointer',
                          outline: isEmpty
                            ? `2px dashed ${selectedColor}`
                            : `1px dashed ${selectedColor}80`,
                          outlineOffset: '2px',
                        } : {}),
                      }}
                      onMouseEnter={e => { if (isAssignMode && !isStickerMode) (e.currentTarget as HTMLElement).style.backgroundColor = `${selectedColor}0D` }}
                      onMouseLeave={e => { if (isAssignMode && !isStickerMode) (e.currentTarget as HTMLElement).style.backgroundColor = '#fff' }}
                    >
                      <div className="px-2 pt-1.5 pb-0.5">
                        <p className="text-[0.6rem] font-bold uppercase tracking-wide" style={{ color: text, opacity: 0.4 }}>P{periodNumber}</p>
                      </div>
                      <div className="flex-1 px-2 pb-2 flex flex-col gap-1">
                        {slots.map(slot => {
                          if (slot.is_special_activity) return (
                            <button
                              key={slot.id}
                              onClick={e => { e.stopPropagation(); openPopup(e, slot) }}
                              className="w-full text-left text-xs px-2 py-1.5 rounded-lg font-semibold"
                              style={{ backgroundColor: SPECIAL_BG, color: SPECIAL_TEXT, borderLeft: `3px solid ${SPECIAL_COLOR}` }}
                            >
                              ⭐ Activité spéciale
                            </button>
                          )
                          const item = contentItems.find(ci => ci.id === slot.content_item_id) ?? null
                          if (!item) return null
                          const subj = getSubjectInfo(item)
                          return (
                            <button
                              key={slot.id}
                              onClick={e => { e.stopPropagation(); openPopup(e, slot) }}
                              className="w-full text-left text-xs px-2 py-1.5 rounded-lg font-semibold leading-snug"
                              style={{ backgroundColor: subj.bg, color: subj.color, borderLeft: `3px solid ${subj.color}` }}
                            >
                              {subj.name}
                            </button>
                          )
                        })}
                        {isEmpty && !isAssignMode && <p className="text-[0.65rem] text-gray-300 text-center mt-1">—</p>}
                      </div>
                    </div>
                  )
                })}
              </div>
            )
          })}

          {/* ── Weekend column ── */}
          <div className="w-44 shrink-0 flex flex-col gap-2">
            <div className="rounded-xl px-3 py-2.5" style={{ backgroundColor: '#F3F4F6' }}>
              <p className="text-sm font-bold text-gray-500">Week-end</p>
            </div>
            {([6, 7] as const).map(dow => {
              const date = getDayDate(weekStart, dow - 1)
              return (
                <div key={dow} className="bg-white rounded-xl flex-1 flex flex-col px-3 py-2.5">
                  <p className="text-xs font-bold text-gray-500 mb-0.5">{dow === 6 ? 'Samedi' : 'Dimanche'}</p>
                  <p className="text-[0.65rem] text-gray-400 mb-2">{date.getDate()} {MONTH_ABBR[date.getMonth() + 1] ?? ''}</p>
                  <textarea
                    rows={4}
                    value={weekendNotes[dow] ?? ''}
                    onChange={e => handleWeekendNote(dow, e.target.value)}
                    onClick={e => e.stopPropagation()}
                    placeholder="Notes..."
                    className="flex-1 w-full text-xs rounded-lg border border-gray-100 px-2 py-1.5 resize-none focus:outline-none focus:border-indigo-300 text-gray-700 placeholder-gray-300"
                    style={{ backgroundColor: '#F9FAFB' }}
                  />
                </div>
              )
            })}
          </div>

          {/* ── Floating stickers ── */}
          {localStickers.map(sticker => (
            <div
              key={sticker.id}
              className="absolute select-none"
              style={{
                left:        sticker.x,
                top:         sticker.y,
                width:       sticker.width,
                zIndex:      20,
                cursor:      dragRef.current?.id === sticker.id && dragRef.current.kind === 'move' ? 'grabbing' : 'grab',
                touchAction: 'none',
              }}
              onMouseEnter={() => setHoveredSticker(sticker.id)}
              onMouseLeave={() => setHoveredSticker(null)}
              onClick={e => e.stopPropagation()}
              onPointerDown={e => {
                if ((e.target as HTMLElement).closest('[data-handle]')) return
                e.stopPropagation()
                e.currentTarget.setPointerCapture(e.pointerId)
                dragRef.current = { id: sticker.id, kind: 'move', startX: e.clientX, startY: e.clientY, origX: sticker.x, origY: sticker.y, origWidth: sticker.width }
              }}
              onPointerMove={e => {
                const dr = dragRef.current
                if (!dr || dr.id !== sticker.id || dr.kind !== 'move') return
                setLocalStickers(prev => prev.map(s =>
                  s.id === sticker.id ? { ...s, x: dr.origX + (e.clientX - dr.startX), y: dr.origY + (e.clientY - dr.startY) } : s
                ))
              }}
              onPointerUp={() => {
                const dr = dragRef.current
                if (!dr || dr.id !== sticker.id || dr.kind !== 'move') return
                dragRef.current = null
                const cur = localStickersRef.current.find(s => s.id === sticker.id)
                if (cur) startTransition(async () => { await updateStickerPosition(cur.id, cur.x, cur.y) })
              }}
            >
              <img
                src={stickerSrc(sticker.sticker_name)}
                draggable={false}
                style={{ width: '100%', height: 'auto', display: 'block', pointerEvents: 'none' }}
                alt={sticker.sticker_name}
              />
              {hoveredSticker === sticker.id && (
                <button
                  data-handle="delete"
                  className="absolute -top-2.5 -right-2.5 w-5 h-5 bg-red-500 text-white rounded-full text-[11px] font-bold flex items-center justify-center shadow z-10"
                  onClick={e => {
                    e.stopPropagation()
                    setLocalStickers(prev => prev.filter(s => s.id !== sticker.id))
                    startTransition(async () => { await deleteWeekSticker(sticker.id) })
                  }}
                >×</button>
              )}
              {hoveredSticker === sticker.id && (
                <div
                  data-handle="resize"
                  className="absolute bottom-0 right-0 w-4 h-4 rounded-sm z-10"
                  style={{ background: 'rgba(0,0,0,0.25)', cursor: 'se-resize', touchAction: 'none' }}
                  onPointerDown={e => {
                    e.stopPropagation()
                    e.currentTarget.setPointerCapture(e.pointerId)
                    dragRef.current = { id: sticker.id, kind: 'resize', startX: e.clientX, startY: e.clientY, origX: sticker.x, origY: sticker.y, origWidth: sticker.width }
                  }}
                  onPointerMove={e => {
                    const dr = dragRef.current
                    if (!dr || dr.id !== sticker.id || dr.kind !== 'resize') return
                    const newWidth = Math.max(40, dr.origWidth + (e.clientX - dr.startX))
                    setLocalStickers(prev => prev.map(s => s.id === sticker.id ? { ...s, width: newWidth } : s))
                  }}
                  onPointerUp={() => {
                    const dr = dragRef.current
                    if (!dr || dr.id !== sticker.id || dr.kind !== 'resize') return
                    dragRef.current = null
                    const cur = localStickersRef.current.find(s => s.id === sticker.id)
                    if (cur) startTransition(async () => { await updateStickerWidth(cur.id, cur.width) })
                  }}
                />
              )}
            </div>
          ))}

        </div>
      </div>

      {/* ── Period popup ─────────────────────────────────────── */}
      {popup && (popupItem || popupSpecial) && (
        <div
          onClick={e => e.stopPropagation()}
          className="fixed z-50 bg-white rounded-2xl shadow-xl border p-4 w-56"
          style={{ top: popup.y, left: popup.toLeft ? popup.x - 224 + 48 : popup.x }}
        >
          {popupSpecial ? (
            <>
              <p className="text-xs font-bold mb-1" style={{ color: SPECIAL_TEXT }}>⭐ Activité spéciale</p>
              <p className="text-xs text-gray-400 mb-3">Période réservée pour une activité hors programme.</p>
            </>
          ) : popupItem ? (
            <>
              <p className="text-[0.65rem] font-bold uppercase tracking-wide mb-0.5" style={{ color: getSubjectInfo(popupItem).color }}>
                {getSubjectInfo(popupItem).name}
              </p>
              <p className="text-xs font-semibold text-gray-800 mb-1 leading-snug">{popupItem.name_fr}</p>
              {popupItem.competencies && <p className="text-[0.65rem] text-gray-400 mb-3">{popupItem.competencies.name_fr}</p>}
            </>
          ) : null}
          <button
            onClick={() => popup && handleRemoveSlot(popup.slotId)}
            className="w-full text-xs py-1.5 rounded-lg border border-red-200 text-red-500 hover:bg-red-50 transition font-medium"
          >
            Retirer de la période
          </button>
        </div>
      )}

      {/* ── Activity suggestion modal ─────────────────────────── */}
      {showActivityModal && (
        <div
          className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4"
          onClick={() => { setShowActivityModal(false); setActivitySearch('') }}
        >
          <div
            className="bg-white rounded-2xl shadow-2xl w-full max-w-lg flex flex-col"
            style={{ maxHeight: '80vh' }}
            onClick={e => e.stopPropagation()}
          >
            <div className="px-5 py-4 border-b flex items-center justify-between shrink-0">
              <h2 className="text-sm font-bold text-gray-800">Ajouter une activité à la semaine</h2>
              <button onClick={() => { setShowActivityModal(false); setActivitySearch('') }}
                className="text-gray-400 hover:text-gray-600 text-xl leading-none">×</button>
            </div>
            <div className="px-4 py-3 border-b shrink-0">
              <input
                value={activitySearch}
                onChange={e => setActivitySearch(e.target.value)}
                placeholder="Rechercher une activité…"
                className="w-full text-sm rounded-xl border border-gray-200 px-3 py-2 focus:outline-none focus:border-indigo-300"
                autoFocus
              />
            </div>
            <div className="flex-1 overflow-y-auto p-3 space-y-1.5">
              {filteredAvailable.length === 0 && (
                <p className="text-sm text-center text-gray-400 py-8">Aucune activité trouvée.</p>
              )}
              {filteredAvailable.map(act => {
                const isAdded = localWeekActivities.some(wa =>
                  (wa.activity_id === act.id && !act.is_template) ||
                  (wa.template_id === act.id && act.is_template)
                )
                return (
                  <button
                    key={act.id}
                    disabled={isAdded}
                    onClick={() => { if (!isAdded) handleAddWeekActivity(act) }}
                    className={`w-full text-left px-3 py-2.5 rounded-xl border transition flex items-center gap-3 ${
                      isAdded
                        ? 'border-gray-100 bg-gray-50 opacity-50 cursor-not-allowed'
                        : 'border-gray-200 hover:border-indigo-300 hover:bg-indigo-50 cursor-pointer'
                    }`}
                  >
                    <div className="flex-1 min-w-0">
                      {act.is_template && (
                        <span className="text-[0.6rem] font-bold text-teal-600 bg-teal-50 px-1.5 py-0.5 rounded-full mr-1.5">Causerie</span>
                      )}
                      <span className="text-xs font-semibold text-gray-800">{act.title}</span>
                      {act.type_tag && <span className="ml-1.5 text-[0.6rem] text-gray-400">{act.type_tag}</span>}
                      {act.duration_min && <span className="ml-1 text-[0.6rem] text-gray-400">· {act.duration_min} min</span>}
                    </div>
                    {isAdded
                      ? <span className="text-xs text-green-500 shrink-0 font-medium">✓ Ajoutée</span>
                      : <span className="text-xs text-indigo-500 shrink-0 font-medium">+ Ajouter</span>
                    }
                  </button>
                )
              })}
            </div>
          </div>
        </div>
      )}

    </div>

    {/* ── Print layout ─────────────────────────────────────────── */}
    <div className="hidden print:block p-8">
      <style>{`@media print { @page { size: A4 landscape; margin: 1.5cm; } body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }`}</style>
      <h1 className="text-base font-bold text-gray-900 mb-5">{planLabel}</h1>
      <div className="grid grid-cols-5 gap-3">
        {DAY_STYLES.map((day, dayIdx) => {
          const dayNum = dayIdx + 1
          const note = weekendNotes[dayNum]
          return (
            <div key={dayNum} className="border rounded-lg overflow-hidden">
              <div className="px-2 py-1.5" style={{ backgroundColor: day.bg }}>
                <p className="font-bold text-xs" style={{ color: day.text }}>{day.label}</p>
              </div>
              <div className="divide-y">
                {Array.from({ length: localPeriodCount }, (_, i) => {
                  const period = localPeriods.find(p => p.day_of_week === dayNum && p.period_number === i + 1)
                  const item = period?.content_item_id ? contentItems.find(ci => ci.id === period.content_item_id) : null
                  return (
                    <div key={i} className="px-2 py-1">
                      <p className="text-[0.6rem] text-gray-400">P{i + 1}</p>
                      {period?.is_special_activity
                        ? <p className="text-[0.7rem] text-amber-700">Activité spéciale</p>
                        : item
                          ? <p className="text-[0.7rem] leading-snug text-gray-700">{item.name_fr}</p>
                          : <p className="text-[0.7rem] text-gray-300">—</p>
                      }
                    </div>
                  )
                })}
              </div>
              {note && <p className="px-2 py-1 text-[0.65rem] text-gray-500 border-t italic">{note}</p>}
            </div>
          )
        })}
      </div>
    </div>
    </>
  )
}
