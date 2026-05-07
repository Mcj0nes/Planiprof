'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { assignToEtape, unassignFromEtape, assignActivityToContent, unassignActivityFromContent } from './actions'
import { getSuggestedActivitiesForContent } from '../../activities/actions'
import { createClient } from '@/lib/supabase/client'

function domainEmoji(name: string): string {
  if (name.includes('Arithm')) return '➕'
  if (name.includes('Mesure'))  return '📏'
  if (name.includes('Géom'))    return '📐'
  if (name.includes('Statist')) return '📊'
  if (name.includes('Probab'))  return '🎲'
  return '📚'
}

const ETAPE_COLORS = [
  { bg: '#EDE9FE', text: '#5B21B6', border: '#7C3AED', label: 'Étape 1' },
  { bg: '#DBEAFE', text: '#1E40AF', border: '#3B82F6', label: 'Étape 2' },
  { bg: '#D1FAE5', text: '#065F46', border: '#10B981', label: 'Étape 3' },
]

type Competency = {
  id: number; name_fr: string; color: string | null; sort_order: number
}
type ContentItem = {
  id: number; name_fr: string; sort_order: number; competency_id: number
  progression_type: 'finalite' | 'progression' | null
  competencies: Competency | null
}
type EtapeAssignment = {
  id: string; etape_number: number | null; content_item_id: number
}
type EtapeConfig = {
  etape_number: number; start_date: string; end_date: string
}
type PlanContentActivity = {
  content_item_id: number; activity_id: string | null; template_id: string | null
}

type CalendarEvent = { id: string; event_date: string; event_type: string; label: string }

type Props = {
  planId: string
  contentItems: ContentItem[]
  assignments: EtapeAssignment[]
  etapeConfigs: EtapeConfig[]
  planContentActivities?: PlanContentActivity[]
  calendarEvents?: CalendarEvent[]
}

function formatDateRange(start: string, end: string) {
  const fmt = (d: string) => {
    const [, m, day] = d.split('-')
    const months = ['', 'jan', 'fév', 'mars', 'avr', 'mai', 'juin', 'juil', 'août', 'sep', 'oct', 'nov', 'déc']
    return `${parseInt(day)} ${months[parseInt(m)]}`
  }
  return `${fmt(start)} – ${fmt(end)}`
}

export default function EtapePlanningGrid({ planId, contentItems, assignments, etapeConfigs, planContentActivities = [], calendarEvents = [] }: Props) {
  const [localAssignments, setLocalAssignments] = useState<EtapeAssignment[]>(assignments)
  const [localPca, setLocalPca] = useState<PlanContentActivity[]>(planContentActivities)
  const [selected, setSelected] = useState<ContentItem | null>(null)
  const [, startTransition] = useTransition()
  type ActivityEntry = { id: string; title: string; type_tag: string | null; duration_min: number | null; is_template: boolean }
  const [activityModal, setActivityModal] = useState<{
    contentItem: ContentItem
    loading: boolean
    activities: ActivityEntry[]
    suggestions: ActivityEntry[]
  } | null>(null)

  async function openActivityModal(item: ContentItem) {
    setActivityModal({ contentItem: item, loading: true, activities: [], suggestions: [] })
    const supabase = createClient()
    const [actLinksRes, tplLinksRes] = await Promise.all([
      supabase.from('activity_content_items').select('activity_id').eq('content_item_id', item.id),
      supabase.from('template_content_items').select('template_id').eq('content_item_id', item.id),
    ])
    const actIds = (actLinksRes.data ?? []).map((l: any) => l.activity_id)
    const tplIds = (tplLinksRes.data ?? []).map((l: any) => l.template_id)
    const [actsRes, tplsRes, suggestions] = await Promise.all([
      actIds.length > 0 ? supabase.from('activities').select('id, title, type_tag, duration_min').in('id', actIds) : Promise.resolve({ data: [] as any[] }),
      tplIds.length > 0 ? supabase.from('activity_templates').select('id, title, type_tag, duration_min').in('id', tplIds) : Promise.resolve({ data: [] as any[] }),
      getSuggestedActivitiesForContent(item.id, actIds, tplIds),
    ])
    setActivityModal(prev => prev ? {
      ...prev, loading: false,
      activities: [
        ...(actsRes.data ?? []).map((a: any) => ({ ...a, is_template: false })),
        ...(tplsRes.data ?? []).map((t: any) => ({ ...t, is_template: true })),
      ],
      suggestions,
    } : null)
  }

  function isPcaAssigned(contentItemId: number, actId: string | null, tplId: string | null) {
    return localPca.some(p => p.content_item_id === contentItemId && p.activity_id === actId && p.template_id === tplId)
  }

  function handleTogglePca(contentItemId: number, actId: string | null, tplId: string | null) {
    if (isPcaAssigned(contentItemId, actId, tplId)) {
      setLocalPca(prev => prev.filter(p => !(p.content_item_id === contentItemId && p.activity_id === actId && p.template_id === tplId)))
      startTransition(async () => { await unassignActivityFromContent(planId, contentItemId, actId, tplId) })
    } else {
      setLocalPca(prev => [...prev, { content_item_id: contentItemId, activity_id: actId, template_id: tplId }])
      startTransition(async () => { await assignActivityToContent(planId, contentItemId, actId, tplId) })
    }
  }

  const assignableItems = contentItems.filter(i => i.progression_type !== null)
  const assignedIds = new Set(localAssignments.map(a => a.content_item_id))
  const unassignedItems = assignableItems.filter(i => !assignedIds.has(i.id))
  const totalAssignable = assignableItems.length
  const totalAssigned = assignableItems.filter(i => assignedIds.has(i.id)).length
  const progress = totalAssignable ? (totalAssigned / totalAssignable) * 100 : 0

  const competencies = Array.from(
    new Map(contentItems.filter(i => i.competencies).map(i => [i.competency_id, i.competencies!])).values()
  ).sort((a, b) => a.sort_order - b.sort_order)

  function handleAssignToEtape(etapeNumber: number) {
    if (!selected) return
    const tempId = `temp-${Date.now()}`
    setLocalAssignments(prev => [...prev, { id: tempId, etape_number: etapeNumber, content_item_id: selected.id }])
    const captured = selected
    setSelected(null)
    startTransition(async () => { await assignToEtape(planId, captured.id, etapeNumber) })
  }

  function handleUnassign(assignmentId: string, item: ContentItem) {
    setLocalAssignments(prev => prev.filter(a => a.id !== assignmentId))
    setSelected(item)
    startTransition(async () => { await unassignFromEtape(assignmentId, planId) })
  }

  function getItemsForEtape(etapeNumber: number) {
    return localAssignments
      .filter(a => a.etape_number === etapeNumber)
      .map(a => ({ assignment: a, item: contentItems.find(i => i.id === a.content_item_id) }))
      .filter((x): x is { assignment: EtapeAssignment; item: ContentItem } => !!x.item)
  }

  const selectedColor = selected?.competencies?.color ?? '#6366F1'
  const isAssignMode = !!selected

  return (
    <div className="flex h-[calc(100vh-65px)]">

      {/* Sidebar */}
      <aside className="w-72 shrink-0 bg-white border-r flex flex-col">
        <div className="px-5 py-4 border-b">
          <div className="flex justify-between items-baseline mb-2">
            <p className="text-xs font-bold text-gray-700 uppercase tracking-wider">Contenus</p>
            <p className="text-xs text-gray-400 tabular-nums">{totalAssigned} / {totalAssignable}</p>
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
            const items = unassignedItems.filter(i => i.competency_id === comp.id)
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
                          onClick={() => openActivityModal(item)}
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
          {unassignedItems.length === 0 && totalAssignable > 0 && (
            <div className="flex flex-col items-center justify-center py-10 px-6 text-center">
              <div className="text-3xl mb-2">🎉</div>
              <p className="text-sm font-semibold text-gray-700">Tout est planifié!</p>
            </div>
          )}
        </div>
      </aside>

      {/* Activity modal */}
      {activityModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4" onClick={() => setActivityModal(null)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden" onClick={e => e.stopPropagation()}>
            <div className="px-5 py-4 border-b" style={{ backgroundColor: `${activityModal.contentItem.competencies?.color ?? '#6366F1'}12` }}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  {activityModal.contentItem.competencies && (
                    <p className="text-[0.65rem] font-bold uppercase tracking-wider mb-0.5" style={{ color: activityModal.contentItem.competencies.color ?? '#6366F1' }}>
                      {activityModal.contentItem.competencies.name_fr}
                    </p>
                  )}
                  <p className="text-sm font-bold text-gray-800 leading-snug">{activityModal.contentItem.name_fr}</p>
                </div>
                <button onClick={() => setActivityModal(null)} className="text-gray-400 hover:text-gray-600 text-xl leading-none shrink-0 mt-0.5">×</button>
              </div>
            </div>
            <div className="p-5">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Activités associées</p>
              {activityModal.loading && <p className="text-sm text-gray-400 text-center py-4">Chargement…</p>}
              {!activityModal.loading && activityModal.activities.length === 0 && activityModal.suggestions.length === 0 && (
                <div className="text-center py-4">
                  <p className="text-sm text-gray-400 mb-2">Aucune activité liée à ce contenu.</p>
                  <a href="/dashboard/activities" className="text-xs text-indigo-500 hover:text-indigo-700 font-medium">Créer une activité →</a>
                </div>
              )}
              {!activityModal.loading && activityModal.activities.length > 0 && (
                <div className="space-y-1.5 max-h-40 overflow-y-auto">
                  {activityModal.activities.map(act => {
                    const actId = act.is_template ? null : act.id
                    const tplId = act.is_template ? act.id : null
                    const assigned = isPcaAssigned(activityModal.contentItem.id, actId, tplId)
                    return (
                      <div key={act.id} className="flex items-center gap-2">
                        <a href={`/dashboard/activities/present/${act.id}`} target="_blank" rel="noopener noreferrer"
                          className="flex-1 flex items-center gap-2.5 p-2.5 rounded-xl bg-gray-50 hover:bg-indigo-50 border border-transparent hover:border-indigo-100 transition group min-w-0">
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-gray-800 truncate group-hover:text-indigo-600">{act.title}</p>
                            {(act.type_tag || act.duration_min) && (
                              <p className="text-xs text-gray-400">{[act.type_tag, act.duration_min ? `${act.duration_min} min` : null].filter(Boolean).join(' · ')}</p>
                            )}
                          </div>
                        </a>
                        <button
                          onClick={() => handleTogglePca(activityModal.contentItem.id, actId, tplId)}
                          className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold transition"
                          style={assigned ? { backgroundColor: '#EEF2FF', color: '#4F46E5' } : { backgroundColor: '#F3F4F6', color: '#9CA3AF' }}
                        >
                          {assigned ? '✓' : '+'}
                        </button>
                      </div>
                    )
                  })}
                </div>
              )}
              {!activityModal.loading && activityModal.suggestions.length > 0 && (
                <div className="mt-3">
                  <p className="text-xs font-bold text-amber-500 uppercase tracking-wider mb-2">✦ Suggestions</p>
                  <div className="space-y-1.5 max-h-40 overflow-y-auto">
                    {activityModal.suggestions.map(act => {
                      const actId = act.is_template ? null : act.id
                      const tplId = act.is_template ? act.id : null
                      const assigned = isPcaAssigned(activityModal.contentItem.id, actId, tplId)
                      return (
                        <div key={act.id} className="flex items-center gap-2">
                          <a href={`/dashboard/activities/present/${act.id}`} target="_blank" rel="noopener noreferrer"
                            className="flex-1 flex items-center gap-2.5 p-2.5 rounded-xl bg-amber-50 hover:bg-amber-100 border border-transparent hover:border-amber-200 transition group min-w-0">
                            <div className="flex-1 min-w-0">
                              <p className="text-sm font-semibold text-gray-800 truncate group-hover:text-amber-700">{act.title}</p>
                              {(act.type_tag || act.duration_min) && (
                                <p className="text-xs text-gray-400">{[act.type_tag, act.duration_min ? `${act.duration_min} min` : null].filter(Boolean).join(' · ')}</p>
                              )}
                            </div>
                          </a>
                          <button
                            onClick={() => handleTogglePca(activityModal.contentItem.id, actId, tplId)}
                            className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold transition"
                            style={assigned ? { backgroundColor: '#FEF3C7', color: '#B45309' } : { backgroundColor: '#F3F4F6', color: '#9CA3AF' }}
                          >
                            {assigned ? '✓' : '+'}
                          </button>
                        </div>
                      )
                    })}
                  </div>
                </div>
              )}
            </div>
            <div className="px-5 pb-5">
              <button
                onClick={() => { setSelected(activityModal.contentItem); setActivityModal(null) }}
                className="w-full py-2.5 rounded-xl text-sm font-semibold text-white transition hover:opacity-90"
                style={{ backgroundColor: activityModal.contentItem.competencies?.color ?? '#6366F1' }}
              >
                Assigner à une étape →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Étape grid */}
      <div className="flex-1 overflow-auto" style={{ backgroundColor: '#C8D8F0' }}>
        {isAssignMode && (
          <div className="sticky top-0 z-10 flex items-center gap-3 px-6 py-2.5 text-sm font-medium text-white shadow-sm" style={{ backgroundColor: selectedColor }}>
            <span className="text-base">👆</span>
            <span>Cliquez sur une étape pour y assigner <em>«{selected!.name_fr}»</em></span>
          </div>
        )}

        <div className="flex gap-4 p-6 min-w-[600px]">
          {ETAPE_COLORS.map(({ bg, text, border, label }, i) => {
            const etapeNumber = i + 1
            const config = etapeConfigs.find(c => c.etape_number === etapeNumber)
            const etapeItems = getItemsForEtape(etapeNumber)

            return (
              <div
                key={etapeNumber}
                onClick={isAssignMode ? () => handleAssignToEtape(etapeNumber) : undefined}
                className="flex-1 bg-white rounded-2xl shadow-sm flex flex-col overflow-hidden transition-all duration-150 min-w-48"
                style={isAssignMode ? { cursor: 'pointer', outline: `2px dashed ${selectedColor}`, outlineOffset: '2px' } : {}}
                onMouseEnter={e => { if (isAssignMode) (e.currentTarget as HTMLElement).style.backgroundColor = `${selectedColor}0D` }}
                onMouseLeave={e => { if (isAssignMode) (e.currentTarget as HTMLElement).style.backgroundColor = '#fff' }}
              >
                {/* Header */}
                <div className="px-4 py-3 flex items-start justify-between" style={{ backgroundColor: bg }}>
                  <div>
                    <p className="text-base font-bold" style={{ color: text }}>{label}</p>
                    {config && (
                      <p className="text-xs mt-0.5" style={{ color: text, opacity: 0.7 }}>
                        {formatDateRange(config.start_date, config.end_date)}
                      </p>
                    )}
                    {etapeItems.length > 0 && (
                      <p className="text-xs mt-0.5" style={{ color: text, opacity: 0.7 }}>
                        {etapeItems.length} contenu{etapeItems.length !== 1 ? 's' : ''}
                      </p>
                    )}
                  </div>
                  {!isAssignMode && (
                    <Link
                      href={`/dashboard/annual/${planId}/etape/${etapeNumber}`}
                      className="text-sm shrink-0 mt-0.5 hover:opacity-100 opacity-40 transition-opacity"
                      style={{ color: text }}
                      title="Planifier les semaines"
                      onClick={e => e.stopPropagation()}
                    >
                      →
                    </Link>
                  )}
                </div>

                {/* Calendar events for this étape */}
                {config && (() => {
                  const evs = calendarEvents.filter(ev => ev.event_date >= config.start_date && ev.event_date <= config.end_date)
                  const unique = evs.filter((e, i, a) => a.findIndex(x => x.label === e.label) === i)
                  return unique.length > 0 ? (
                    <div className="px-3 py-1.5 border-b flex flex-wrap gap-1" style={{ backgroundColor: '#FFFBEB' }}>
                      {unique.map(ev => (
                        <span key={ev.id} title={ev.label}
                          className="text-[0.62rem] px-1.5 py-0.5 rounded font-medium"
                          style={{ backgroundColor: '#FEF3C7', color: '#92400E' }}>
                          {ev.label.length > 25 ? ev.label.slice(0, 23) + '…' : ev.label}
                        </span>
                      ))}
                    </div>
                  ) : null
                })()}

                {/* Items */}
                <div className="flex-1 p-3 flex flex-col gap-1.5 min-h-64">
                  {etapeItems.map(({ assignment, item }) => {
                    const pcaCount = localPca.filter(p => p.content_item_id === item.id).length
                    return (
                      <div
                        key={assignment.id}
                        className="flex items-start gap-1.5 text-xs px-2.5 py-2 rounded-lg cursor-pointer"
                        style={{ backgroundColor: bg, borderLeft: `3px solid ${border}` }}
                        onClick={e => { e.stopPropagation(); handleUnassign(assignment.id, item) }}
                        title="Cliquer pour retirer"
                      >
                        <span className="shrink-0 text-xs">{domainEmoji(item.competencies?.name_fr ?? '')}</span>
                        <span className="flex-1 leading-snug font-medium text-[0.8rem]" style={{ color: text }}>{item.name_fr}</span>
                        {pcaCount > 0 && (
                          <span className="shrink-0 text-[0.6rem] font-bold px-1 py-0.5 rounded-full" style={{ backgroundColor: `${text}25`, color: text }}>{pcaCount}</span>
                        )}
                      </div>
                    )
                  })}
                  {etapeItems.length === 0 && !isAssignMode && (
                    <p className="text-xs text-gray-300 text-center mt-4">—</p>
                  )}
                </div>

                {/* Footer link */}
                {!isAssignMode && (
                  <div className="border-t px-4 py-2.5" style={{ backgroundColor: `${bg}60` }}>
                    <Link
                      href={`/dashboard/annual/${planId}/etape/${etapeNumber}`}
                      className="text-xs font-medium hover:underline"
                      style={{ color: text }}
                    >
                      Planifier semaine par semaine →
                    </Link>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
