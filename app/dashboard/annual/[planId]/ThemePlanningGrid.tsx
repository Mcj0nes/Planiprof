'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { assignToTheme, unassignFromTheme, assignActivityToContent, unassignActivityFromContent } from './actions'
import type { NouveauCycleItems } from './nouveauProgrammeData'
import ActivityModal from './ActivityModal'

function domainEmoji(name: string): string {
  if (name.includes('Arithm')) return '➕'
  if (name.includes('Mesure'))  return '📏'
  if (name.includes('Géom'))    return '📐'
  if (name.includes('Statist')) return '📊'
  if (name.includes('Probab'))  return '🎲'
  return '📚'
}

const THEME_PALETTE = [
  { bg: '#EDE9FE', text: '#5B21B6', border: '#7C3AED' },
  { bg: '#DBEAFE', text: '#1E40AF', border: '#2563EB' },
  { bg: '#D1FAE5', text: '#065F46', border: '#059669' },
  { bg: '#FEF3C7', text: '#92400E', border: '#D97706' },
  { bg: '#FCE7F3', text: '#9D174D', border: '#DB2777' },
  { bg: '#FFEDD5', text: '#9A3412', border: '#EA580C' },
  { bg: '#DCFCE7', text: '#14532D', border: '#16A34A' },
  { bg: '#E0F2FE', text: '#0C4A6E', border: '#0284C7' },
  { bg: '#FEF9C3', text: '#713F12', border: '#CA8A04' },
  { bg: '#F1F5F9', text: '#1E293B', border: '#475569' },
  { bg: '#F3E8FF', text: '#581C87', border: '#9333EA' },
  { bg: '#FEE2E2', text: '#7F1D1D', border: '#DC2626' },
]

function formatDateRange(start: string, end: string) {
  const fmt = (d: string) => {
    const [, m, day] = d.split('-')
    const months = ['', 'jan', 'fév', 'mars', 'avr', 'mai', 'juin', 'juil', 'août', 'sep', 'oct', 'nov', 'déc']
    return `${parseInt(day)} ${months[parseInt(m)]}`
  }
  return `${fmt(start)} – ${fmt(end)}`
}

type Competency = {
  id: number; name_fr: string; color: string | null; sort_order: number
}
type ContentItem = {
  id: number; name_fr: string; sort_order: number; competency_id: number
  progression_type: 'finalite' | 'progression' | null
  competencies: Competency | null
}
type ThemeAssignment = {
  id: string; theme_id: string | null; content_item_id: number
}
type ThemeConfig = {
  id: string; name: string; start_date: string; end_date: string; sort_order: number
}
type PlanContentActivity = {
  content_item_id: number; activity_id: string | null; template_id: string | null
}

type CalendarEvent = { id: string; event_date: string; event_type: string; label: string }

type Props = {
  planId: string
  contentItems: ContentItem[]
  assignments: ThemeAssignment[]
  themeConfigs: ThemeConfig[]
  planContentActivities?: PlanContentActivity[]
  calendarEvents?: CalendarEvent[]
  nouveauItems?: NouveauCycleItems
}

export default function ThemePlanningGrid({ planId, contentItems, assignments, themeConfigs, planContentActivities = [], calendarEvents = [], nouveauItems }: Props) {
  const [localAssignments, setLocalAssignments] = useState<ThemeAssignment[]>(assignments)
  const [localPca, setLocalPca] = useState<PlanContentActivity[]>(planContentActivities)
  const [selected, setSelected] = useState<ContentItem | null>(null)
  const [, startTransition] = useTransition()
  const [activityModal, setActivityModal] = useState<ContentItem | null>(null)
  const [sidebarTab, setSidebarTab] = useState<'contenu' | 'nouveau'>('contenu')

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

  const assignableItems = contentItems.filter(i => i.progression_type !== null)
  const assignedIds = new Set(localAssignments.map(a => a.content_item_id))
  const unassignedItems = assignableItems.filter(i => !assignedIds.has(i.id))
  const totalAssignable = assignableItems.length
  const totalAssigned = assignableItems.filter(i => assignedIds.has(i.id)).length
  const progress = totalAssignable ? (totalAssigned / totalAssignable) * 100 : 0

  const competencies = Array.from(
    new Map(contentItems.filter(i => i.competencies).map(i => [i.competency_id, i.competencies!])).values()
  ).sort((a, b) => a.sort_order - b.sort_order)

  function handleAssignToTheme(themeId: string) {
    if (!selected) return
    const tempId = `temp-${Date.now()}`
    setLocalAssignments(prev => [...prev, { id: tempId, theme_id: themeId, content_item_id: selected.id }])
    const captured = selected
    setSelected(null)
    startTransition(async () => { await assignToTheme(planId, captured.id, themeId) })
  }

  function handleUnassign(assignmentId: string, item: ContentItem) {
    setLocalAssignments(prev => prev.filter(a => a.id !== assignmentId))
    setSelected(item)
    startTransition(async () => { await unassignFromTheme(assignmentId, planId) })
  }

  function getItemsForTheme(themeId: string) {
    return localAssignments
      .filter(a => a.theme_id === themeId)
      .map(a => ({ assignment: a, item: contentItems.find(i => i.id === a.content_item_id) }))
      .filter((x): x is { assignment: ThemeAssignment; item: ContentItem } => !!x.item)
  }

  const selectedColor = selected?.competencies?.color ?? '#6366F1'
  const isAssignMode = !!selected

  return (
    <div className="flex h-[calc(100vh-65px)]">

      {/* Sidebar */}
      <aside className="w-72 shrink-0 bg-white border-r flex flex-col">
        <div className="px-5 py-4 border-b">
          <div className="flex justify-between items-baseline mb-2">
            {nouveauItems ? (
              <div className="flex gap-1">
                <button onClick={() => setSidebarTab('contenu')} className={`text-xs font-bold uppercase tracking-wider px-2 py-1 rounded transition ${sidebarTab === 'contenu' ? 'bg-indigo-50 text-indigo-700' : 'text-gray-400 hover:text-gray-600'}`}>Contenus</button>
                <button onClick={() => setSidebarTab('nouveau')} className={`text-xs font-bold uppercase tracking-wider px-2 py-1 rounded transition ${sidebarTab === 'nouveau' ? 'bg-yellow-100 text-yellow-800' : 'text-gray-400 hover:text-gray-600'}`}>✨ Nouveau</button>
              </div>
            ) : (
              <p className="text-xs font-bold text-gray-700 uppercase tracking-wider">Contenus</p>
            )}
            {sidebarTab === 'contenu' && <p className="text-xs text-gray-400 tabular-nums">{totalAssigned} / {totalAssignable}</p>}
          </div>
          {sidebarTab === 'contenu' && (
            <>
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
            </>
          )}
        </div>

        {sidebarTab === 'nouveau' && nouveauItems ? (
          <div className="flex-1 overflow-y-auto p-4 flex flex-col gap-2">
            <p className="text-[0.65rem] font-bold uppercase tracking-wider mb-1" style={{ color: nouveauItems.color }}>{nouveauItems.cycleLabel}</p>
            {nouveauItems.nouveau.map((item, i) => (
              <div key={i} className="flex items-start gap-2">
                <span className="shrink-0 w-1.5 h-1.5 rounded-full mt-1.5" style={{ backgroundColor: nouveauItems.color }} />
                <p className="text-[0.78rem] text-gray-700 leading-snug">{item}</p>
              </div>
            ))}
          </div>
        ) : (
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
            {unassignedItems.length === 0 && totalAssignable > 0 && (
              <div className="flex flex-col items-center justify-center py-10 px-6 text-center">
                <div className="text-3xl mb-2">🎉</div>
                <p className="text-sm font-semibold text-gray-700">Tout est planifié!</p>
              </div>
            )}
          </div>
        )}
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
          assignButtonLabel={assignedIds.has(activityModal.id) ? undefined : "Assigner à un thème →"}
          onAssign={assignedIds.has(activityModal.id) ? undefined : () => { setSelected(activityModal); setActivityModal(null) }}
        />
      )}

      {/* Theme grid */}
      <div className="flex-1 overflow-auto" style={{ backgroundColor: '#C8D8F0' }}>
        {isAssignMode && (
          <div className="sticky top-0 z-10 flex items-center gap-3 px-6 py-2.5 text-sm font-medium text-white shadow-sm" style={{ backgroundColor: selectedColor }}>
            <span className="text-base">👆</span>
            <span>Cliquez sur un thème pour y assigner <em>«{selected!.name_fr}»</em></span>
          </div>
        )}

        {themeConfigs.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center px-8">
            <p className="text-gray-500 text-sm mb-2">Aucun thème configuré pour cette année scolaire.</p>
            <a href="/dashboard/planning-model/par-theme" className="text-indigo-500 hover:text-indigo-700 text-sm font-medium">Configurer les thèmes →</a>
          </div>
        ) : (
          <div className="flex gap-4 p-6" style={{ minWidth: `${themeConfigs.length * 220}px` }}>
            {themeConfigs.map((theme, i) => {
              const { bg, text, border } = THEME_PALETTE[i % THEME_PALETTE.length]
              const themeItems = getItemsForTheme(theme.id)

              return (
                <div
                  key={theme.id}
                  onClick={isAssignMode ? () => handleAssignToTheme(theme.id) : undefined}
                  className="flex-1 bg-white rounded-2xl shadow-sm flex flex-col overflow-hidden transition-all duration-150 min-w-48"
                  style={isAssignMode ? { cursor: 'pointer', outline: `2px dashed ${selectedColor}`, outlineOffset: '2px' } : {}}
                  onMouseEnter={e => { if (isAssignMode) (e.currentTarget as HTMLElement).style.backgroundColor = `${selectedColor}0D` }}
                  onMouseLeave={e => { if (isAssignMode) (e.currentTarget as HTMLElement).style.backgroundColor = '#fff' }}
                >
                  {/* Header */}
                  <div className="px-4 py-3 flex items-start justify-between" style={{ backgroundColor: bg }}>
                    <div className="flex-1 min-w-0 mr-2">
                      <p className="text-base font-bold truncate" style={{ color: text }}>{theme.name}</p>
                      <p className="text-xs mt-0.5" style={{ color: text, opacity: 0.7 }}>
                        {formatDateRange(theme.start_date, theme.end_date)}
                      </p>
                      {themeItems.length > 0 && (
                        <p className="text-xs mt-0.5" style={{ color: text, opacity: 0.7 }}>
                          {themeItems.length} contenu{themeItems.length !== 1 ? 's' : ''}
                        </p>
                      )}
                    </div>
                    {!isAssignMode && (
                      <Link
                        href={`/dashboard/annual/${planId}/theme/${theme.id}`}
                        className="text-sm shrink-0 mt-0.5 hover:opacity-100 opacity-40 transition-opacity"
                        style={{ color: text }}
                        title="Planifier les semaines"
                        onClick={e => e.stopPropagation()}
                      >
                        →
                      </Link>
                    )}
                  </div>

                  {/* Calendar events for this theme */}
                  {(() => {
                    const evs = calendarEvents.filter(ev => ev.event_date >= theme.start_date && ev.event_date <= theme.end_date)
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
                    {themeItems.map(({ assignment, item }) => {
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
                              onClick={e => { e.stopPropagation(); handleUnassign(assignment.id, item) }}
                              className="shrink-0 opacity-0 group-hover/item:opacity-50 hover:!opacity-100 text-[0.75rem] leading-none transition-opacity"
                              style={{ color: text }}
                              title="Retirer"
                            >×</button>
                          )}
                        </div>
                      )
                    })}
                    {themeItems.length === 0 && !isAssignMode && (
                      <p className="text-xs text-gray-300 text-center mt-4">—</p>
                    )}
                  </div>

                  {/* Footer link */}
                  {!isAssignMode && (
                    <div className="border-t px-4 py-2.5" style={{ backgroundColor: `${bg}60` }}>
                      <Link
                        href={`/dashboard/annual/${planId}/theme/${theme.id}`}
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
        )}
      </div>
    </div>
  )
}
