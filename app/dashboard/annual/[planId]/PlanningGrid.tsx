'use client'

import { useState, useTransition } from 'react'
import Link from 'next/link'
import { assignToMonth, unassign, assignProjectToMonth, unassignProject, assignActivityToContent, unassignActivityFromContent } from './actions'
import { getSuggestedActivitiesForContent } from '../../activities/actions'
import { createClient } from '@/lib/supabase/client'

const SUBJECT_SYMBOL = 'π'

function domainEmoji(name: string): string {
  if (name.includes('Arithm')) return '➕'
  if (name.includes('Mesure'))  return '📏'
  if (name.includes('Géom'))    return '📐'
  if (name.includes('Statist')) return '📊'
  if (name.includes('Probab'))  return '🎲'
  return '📚'
}

function subjectEmoji(slug: string): string {
  switch (slug) {
    case 'francais':       return '📖'
    case 'maths':          return '🔢'
    case 'sciences':       return '🔬'
    case 'univers-social': return '🌍'
    case 'arts-plastiques':return '🎨'
    case 'musique':        return '🎵'
    case 'educ-physique':  return '⚽'
    case 'ethique':        return '🤝'
    case 'anglais':        return '🔤'
    default:               return '📚'
  }
}

const AOUT_MONTH = { month: 8, label: 'Août', bg: '#FFF7ED', text: '#C2410C' }

const SCHOOL_MONTHS = [
  { month: 9,  label: 'Septembre', bg: '#FEF3C7', text: '#92400E' },
  { month: 10, label: 'Octobre',   bg: '#FFEDD5', text: '#9A3412' },
  { month: 11, label: 'Novembre',  bg: '#EDE9FE', text: '#5B21B6' },
  { month: 12, label: 'Décembre',  bg: '#DBEAFE', text: '#1E40AF' },
  { month: 1,  label: 'Janvier',   bg: '#E0F2FE', text: '#075985' },
  { month: 2,  label: 'Février',   bg: '#FCE7F3', text: '#9D174D' },
  { month: 3,  label: 'Mars',      bg: '#D1FAE5', text: '#065F46' },
  { month: 4,  label: 'Avril',     bg: '#CCFBF1', text: '#134E4A' },
  { month: 5,  label: 'Mai',       bg: '#ECFCCB', text: '#365314' },
  { month: 6,  label: 'Juin',      bg: '#FEF9C3', text: '#713F12' },
]


type SubjectInfo = { id: number; name_fr: string; color: string | null; slug: string }

type Competency = {
  id: number
  name_fr: string
  color: string | null
  sort_order: number
  subject_id?: number
  subjects?: SubjectInfo | null
}

type ProgressionType = 'finalite' | 'progression' | null

type ContentItem = {
  id: number
  name_fr: string
  sort_order: number
  competency_id: number
  progression_type: ProgressionType
  competencies: Competency | null
}

function ProgressionBadge({ type }: { type: ProgressionType }) {
  const base = 'shrink-0 rounded px-1 py-0.5 text-xs font-bold border cursor-default select-none'
  if (type === 'finalite') return (
    <span title="Finalité" className={`${base} bg-amber-50 border-amber-300 text-amber-500`}>★</span>
  )
  if (type === 'progression') return (
    <span title="En progression" className={`${base} bg-blue-50 border-blue-300 text-blue-500`}>→</span>
  )
  return null
}

type Assignment = {
  id: string
  month: number | null
  content_item_id: number
}

type Project = {
  id: string
  title: string
  description: string | null
  project_subjects: Array<{ subject_id: number; subjects: { name_fr: string; color: string | null; slug: string } | null }>
}

type ProjectAssignment = {
  id: string
  month: number | null
  project_id: string
}

type Selected =
  | { kind: 'item'; data: ContentItem }
  | { kind: 'project'; data: Project }

type PlanContentActivity = {
  content_item_id: number
  activity_id: string | null
  template_id: string | null
}

type CalendarEvent = {
  id: string
  event_date: string
  event_type: string
  label: string
}

function calendarEventStyle(type: string): { bg: string; text: string } {
  switch (type) {
    case 'conge': return { bg: '#FEE2E2', text: '#991B1B' }
    case 'journee_pedagogique': return { bg: '#DBEAFE', text: '#1D4ED8' }
    case 'rencontre_parents': return { bg: '#EDE9FE', text: '#5B21B6' }
    case 'debut_etape': case 'fin_etape': return { bg: '#D1FAE5', text: '#065F46' }
    case 'examen': return { bg: '#FEF9C3', text: '#92400E' }
    default: return { bg: '#F3F4F6', text: '#6B7280' }
  }
}

function uniqueEventLabels(events: CalendarEvent[]): CalendarEvent[] {
  const seen = new Set<string>()
  return events.filter(ev => { if (seen.has(ev.label)) return false; seen.add(ev.label); return true })
}

type Props = {
  planId: string
  contentItems: ContentItem[]
  assignments: Assignment[]
  isMultiSubject?: boolean
  projects?: Project[]
  projectAssignments?: ProjectAssignment[]
  importedAssignments?: Assignment[]
  planContentActivities?: PlanContentActivity[]
  calendarEvents?: CalendarEvent[]
}

export default function PlanningGrid({
  planId,
  contentItems,
  assignments,
  isMultiSubject = false,
  projects = [],
  projectAssignments = [],
  importedAssignments = [],
  planContentActivities = [],
  calendarEvents = [],
}: Props) {
  const [localAssignments, setLocalAssignments] = useState<Assignment[]>(assignments)
  const [localProjectAssignments, setLocalProjectAssignments] = useState<ProjectAssignment[]>(projectAssignments)
  const [localPca, setLocalPca] = useState<PlanContentActivity[]>(planContentActivities)
  const [selected, setSelected] = useState<Selected | null>(null)
  const [popover, setPopover] = useState<{ project: Project; x: number; y: number; toLeft: boolean } | null>(null)
  const progressionTypes = Object.fromEntries(
    contentItems.filter(i => i.progression_type).map(i => [i.id, i.progression_type])
  ) as Record<number, ProgressionType>


  function openPopover(proj: Project, e: React.MouseEvent) {
    e.stopPropagation()
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
    if (popover?.project.id === proj.id) { setPopover(null); return }
    const toLeft = rect.left > 400
    setPopover({
      project: proj,
      x: toLeft ? rect.left : rect.right,
      y: Math.min(rect.top, window.innerHeight - 320),
      toLeft,
    })
  }
  const [, startTransition]                   = useTransition()
  const [isDuplicating, setIsDuplicating]     = useState(false)
  const [itemMenu, setItemMenu]               = useState<{ assignmentId: string; item: ContentItem; x: number; y: number } | null>(null)
  const [showUnplacedPanel, setShowUnplacedPanel]           = useState(false)
  const [expandedUnplacedGroup, setExpandedUnplacedGroup]   = useState<number | null>(null)
  const [draggedItem, setDraggedItem]                       = useState<ContentItem | null>(null)
  const [dragOverMonth, setDragOverMonth]                   = useState<number | null>(null)
  type ActivityEntry = { id: string; title: string; type_tag: string | null; duration_min: number | null; is_template: boolean }
  const [activityModal, setActivityModal]     = useState<{
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
      actIds.length > 0
        ? supabase.from('activities').select('id, title, type_tag, duration_min').in('id', actIds)
        : Promise.resolve({ data: [] as any[] }),
      tplIds.length > 0
        ? supabase.from('activity_templates').select('id, title, type_tag, duration_min').in('id', tplIds)
        : Promise.resolve({ data: [] as any[] }),
      getSuggestedActivitiesForContent(item.id, actIds, tplIds),
    ])
    const activities = [
      ...(actsRes.data ?? []).map((a: any) => ({ ...a, is_template: false })),
      ...(tplsRes.data ?? []).map((t: any) => ({ ...t, is_template: true })),
    ]
    setActivityModal(prev => prev ? { ...prev, loading: false, activities, suggestions } : null)
  }

  function isPcaAssigned(contentItemId: number, actId: string | null, tplId: string | null) {
    return localPca.some(p =>
      p.content_item_id === contentItemId &&
      p.activity_id === actId &&
      p.template_id === tplId
    )
  }

  function handleTogglePca(contentItemId: number, actId: string | null, tplId: string | null) {
    if (isPcaAssigned(contentItemId, actId, tplId)) {
      setLocalPca(prev => prev.filter(p => !(
        p.content_item_id === contentItemId &&
        p.activity_id === actId &&
        p.template_id === tplId
      )))
      startTransition(async () => { await unassignActivityFromContent(planId, contentItemId, actId, tplId) })
    } else {
      setLocalPca(prev => [...prev, { content_item_id: contentItemId, activity_id: actId, template_id: tplId }])
      startTransition(async () => { await assignActivityToContent(planId, contentItemId, actId, tplId) })
    }
  }

  // ── Calendar events by month ────────────────────────────────
  const eventsByMonth = new Map<number, CalendarEvent[]>()
  for (const ev of calendarEvents) {
    const m = parseInt(ev.event_date.split('-')[1], 10)
    if (!eventsByMonth.has(m)) eventsByMonth.set(m, [])
    eventsByMonth.get(m)!.push(ev)
  }

  // ── Derived data ────────────────────────────────────────────
  const competencies = Array.from(
    new Map(
      contentItems
        .filter(i => i.competencies)
        .map(i => [i.competency_id, i.competencies!])
    ).values()
  ).sort((a, b) => a.sort_order - b.sort_order)

  const subjectsInPlan: SubjectInfo[] = isMultiSubject
    ? Array.from(
        new Map(
          contentItems
            .filter(i => i.competencies?.subjects)
            .map(i => [i.competencies!.subjects!.id, i.competencies!.subjects!])
        ).values()
      )
    : []

  const assignedContentIds = new Set(localAssignments.map(a => a.content_item_id))
  const assignedProjectIds  = new Set(localProjectAssignments.map(a => a.project_id))
  const importedContentIds  = new Set(importedAssignments.map(a => a.content_item_id))
  // Combined: items hidden from sidebar if assigned locally OR via an imported plan
  const allAssignedContentIds = new Set([...assignedContentIds, ...importedContentIds])

  // Only ★ (finalite) and → (progression) items need to be planned; null = not for this year
  const assignableItems = contentItems.filter(i => i.progression_type !== null)

  const unplacedItems = assignableItems.filter(i => !allAssignedContentIds.has(i.id))
  const unplacedGroups = (() => {
    const map = new Map<number, { id: number; name: string; color: string | null; items: ContentItem[] }>()
    for (const item of unplacedItems) {
      const groupId   = isMultiSubject ? (item.competencies?.subjects?.id ?? -1) : item.competency_id
      const groupName = isMultiSubject ? (item.competencies?.subjects?.name_fr ?? 'Autre') : (item.competencies?.name_fr ?? 'Autre')
      const groupColor = isMultiSubject ? (item.competencies?.subjects?.color ?? null) : (item.competencies?.color ?? null)
      if (!map.has(groupId)) map.set(groupId, { id: groupId, name: groupName, color: groupColor, items: [] })
      map.get(groupId)!.items.push(item)
    }
    return [...map.values()]
  })()

  const totalAssignable = assignableItems.length + projects.length
  const totalAssigned   = new Set(assignableItems.filter(i => allAssignedContentIds.has(i.id)).map(i => i.id)).size + assignedProjectIds.size
  const progress = totalAssignable ? (totalAssigned / totalAssignable) * 100 : 0

  const selectedColor =
    selected?.kind === 'item'
      ? (selected.data.competencies?.color ?? '#6366F1')
      : '#7C3AED'

  // ── Handlers ────────────────────────────────────────────────
  function handleAssign(month: number) {
    if (!selected) return
    if (selected.kind === 'item') {
      const tempId = `temp-${Date.now()}`
      setLocalAssignments(prev => [...prev, { id: tempId, month, content_item_id: selected.data.id }])
      const captured = selected.data
      if (!isDuplicating) setSelected(null)
      startTransition(async () => { await assignToMonth(planId, captured.id, month) })
    } else {
      const tempId = `temp-${Date.now()}`
      setLocalProjectAssignments(prev => [...prev, { id: tempId, month, project_id: selected.data.id }])
      const captured = selected.data
      setSelected(null)
      startTransition(async () => { await assignProjectToMonth(planId, captured.id, month) })
    }
  }

  function handleUnassignContent(assignmentId: string) {
    setLocalAssignments(prev => prev.filter(a => a.id !== assignmentId))
    startTransition(async () => { await unassign(assignmentId, planId) })
  }

  function handleUnassignProject(assignmentId: string) {
    setLocalProjectAssignments(prev => prev.filter(a => a.id !== assignmentId))
    startTransition(async () => { await unassignProject(assignmentId, planId) })
  }

  function openItemMenu(e: React.MouseEvent, assignmentId: string, item: ContentItem) {
    e.stopPropagation()
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
    const x = Math.min(rect.left, window.innerWidth - 220)
    const y = Math.min(rect.bottom + 4, window.innerHeight - 130)
    setItemMenu({ assignmentId, item, x, y })
  }

  function handleMoveItem() {
    if (!itemMenu) return
    handleUnassignContent(itemMenu.assignmentId)
    setSelected({ kind: 'item', data: itemMenu.item })
    setItemMenu(null)
  }

  function handleDuplicateItem() {
    if (!itemMenu) return
    setIsDuplicating(true)
    setSelected({ kind: 'item', data: itemMenu.item })
    setItemMenu(null)
  }

  function handleRemoveItem() {
    if (!itemMenu) return
    handleUnassignContent(itemMenu.assignmentId)
    setItemMenu(null)
  }

  function handleAssignItem(item: ContentItem, month: number) {
    const tempId = `temp-${Date.now()}`
    setLocalAssignments(prev => [...prev, { id: tempId, month, content_item_id: item.id }])
    startTransition(async () => { await assignToMonth(planId, item.id, month) })
  }

  function getContentForMonth(month: number) {
    const local = localAssignments
      .filter(a => a.month === month)
      .map(a => ({ assignment: a, item: contentItems.find(i => i.id === a.content_item_id), imported: false }))
      .filter((x): x is { assignment: Assignment; item: ContentItem; imported: false } => !!x.item)

    const imported = importedAssignments
      .filter(a => a.month === month)
      .map(a => ({ assignment: a, item: contentItems.find(i => i.id === a.content_item_id), imported: true }))
      .filter((x): x is { assignment: Assignment; item: ContentItem; imported: true } => !!x.item)

    return [...local, ...imported]
  }

  function getProjectsForMonth(month: number) {
    return localProjectAssignments
      .filter(a => a.month === month)
      .map(a => ({ assignment: a, project: projects.find(p => p.id === a.project_id) }))
      .filter((x): x is { assignment: ProjectAssignment; project: Project } => !!x.project)
  }

  // ── Sidebar: single-subject ──────────────────────────────────
  function renderSingleSubjectSidebar() {
    const unassignedItems = assignableItems.filter(i => !allAssignedContentIds.has(i.id))
    const allDone = unassignedItems.length === 0

    return (
      <>
        <div className="flex-1 overflow-y-auto">
          {competencies.map(comp => {
            const items = assignableItems.filter(i => i.competency_id === comp.id && !allAssignedContentIds.has(i.id))
            if (items.length === 0) return null
            return (
              <div key={comp.id} className="border-b last:border-0">
                <div
                  className="flex items-center gap-2.5 px-5 py-2.5"
                  style={{ borderLeft: `3px solid ${comp.color ?? '#94A3B8'}` }}
                >
                  <span className="text-sm">{domainEmoji(comp.name_fr)}</span>
                  <p className="text-xs font-bold flex-1 leading-snug" style={{ color: comp.color ?? '#6B7280' }}>
                    {comp.name_fr}
                  </p>
                  <span className="text-xs rounded-full px-1.5 py-0.5 font-medium tabular-nums"
                    style={{ backgroundColor: `${comp.color ?? '#94A3B8'}15`, color: comp.color ?? '#6B7280' }}>
                    {items.length}
                  </span>
                </div>
                <ul className="px-3 pb-3 flex flex-col gap-1">
                  {items.map(item => renderContentItemButton(item, comp.color))}
                </ul>
              </div>
            )
          })}
          {allDone && <CompletionBadge />}
        </div>

        {/* Legend */}
        <div className="border-t px-5 py-3 flex flex-wrap gap-x-3 gap-y-1.5">
          {competencies.map(comp => (
            <div key={comp.id} className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: comp.color ?? '#94A3B8' }} />
              <span className="text-xs text-gray-500">{comp.name_fr.split('—')[0].split('–')[0].trim()}</span>
            </div>
          ))}
        </div>
      </>
    )
  }

  // ── Sidebar: multi-subject ───────────────────────────────────
  function renderMultiSubjectSidebar() {
    const unassignedContent   = assignableItems.filter(i => !allAssignedContentIds.has(i.id))
    const unassignedProjects  = projects.filter(p => !assignedProjectIds.has(p.id))
    const allDone = unassignedContent.length === 0 && unassignedProjects.length === 0

    return (
      <>
        <div className="flex-1 overflow-y-auto">
          {/* Projets interdisciplinaires section */}
          {projects.length > 0 && (
            <div className="border-b">
              <div className="flex items-center gap-2.5 px-5 py-2.5" style={{ borderLeft: '3px solid #7C3AED' }}>
                <span className="text-sm">🔗</span>
                <p className="text-xs font-bold flex-1 leading-snug" style={{ color: '#7C3AED' }}>
                  Projets interdisciplinaires
                </p>
                {unassignedProjects.length > 0 && (
                  <span className="text-xs rounded-full px-1.5 py-0.5 font-medium tabular-nums"
                    style={{ backgroundColor: '#7C3AED15', color: '#7C3AED' }}>
                    {unassignedProjects.length}
                  </span>
                )}
              </div>
              {unassignedProjects.length > 0 && (
                <ul className="px-3 pb-3 flex flex-col gap-1">
                  {unassignedProjects.map(proj => renderProjectButton(proj))}
                </ul>
              )}
              {unassignedProjects.length === 0 && (
                <p className="px-5 pb-3 text-xs text-gray-400">Tous les projets sont planifiés ✓</p>
              )}
            </div>
          )}

          {/* Content grouped by subject → competency */}
          {subjectsInPlan.map(subj => {
            const subjComps = competencies.filter(c => c.subject_id === subj.id)
            const hasUnassigned = assignableItems.some(
              i => i.competencies?.subject_id === subj.id && !allAssignedContentIds.has(i.id)
            )
            if (!hasUnassigned) return null

            return (
              <div key={subj.id} className="border-b last:border-0">
                {/* Subject header */}
                <div className="flex items-center gap-2 px-5 py-2" style={{ backgroundColor: `${subj.color ?? '#94A3B8'}10` }}>
                  <span className="text-sm">{subjectEmoji(subj.slug)}</span>
                  <p className="text-xs font-extrabold flex-1" style={{ color: subj.color ?? '#374151' }}>
                    {subj.name_fr}
                  </p>
                </div>

                {/* Competency sub-groups */}
                {subjComps.map(comp => {
                  const items = assignableItems.filter(
                    i => i.competency_id === comp.id && !allAssignedContentIds.has(i.id)
                  )
                  if (items.length === 0) return null
                  return (
                    <div key={comp.id}>
                      <div
                        className="flex items-center gap-2 px-5 py-2"
                        style={{ borderLeft: `3px solid ${comp.color ?? '#94A3B8'}` }}
                      >
                        <span className="text-xs">{domainEmoji(comp.name_fr)}</span>
                        <p className="text-xs font-semibold flex-1 leading-snug" style={{ color: comp.color ?? '#6B7280' }}>
                          {comp.name_fr}
                        </p>
                        <span className="text-xs rounded-full px-1.5 py-0.5 font-medium tabular-nums"
                          style={{ backgroundColor: `${comp.color ?? '#94A3B8'}15`, color: comp.color ?? '#6B7280' }}>
                          {items.length}
                        </span>
                      </div>
                      <ul className="px-3 pb-2 flex flex-col gap-1">
                        {items.map(item => renderContentItemButton(item, comp.color))}
                      </ul>
                    </div>
                  )
                })}
              </div>
            )
          })}

          {allDone && <CompletionBadge />}
        </div>
      </>
    )
  }

  // ── Reusable item/project buttons ────────────────────────────
  function renderContentItemButton(item: ContentItem, color: string | null | undefined) {
    const comp = item.competencies
    const itemColor = comp?.color ?? color ?? '#6366F1'
    const isSelected = selected?.kind === 'item' && selected.data.id === item.id
    const pt = progressionTypes[item.id] ?? null
    return (
      <li key={item.id} className="flex items-center gap-1">
        <ProgressionBadge type={pt} />
        <button
          onClick={() => openActivityModal(item)}
          className="flex-1 text-left text-xs px-3 py-2 rounded-lg border transition-all"
          style={isSelected
            ? { backgroundColor: itemColor, borderColor: 'transparent', color: '#fff', fontWeight: 600, fontSize: '0.8rem' }
            : { backgroundColor: '#fff', borderColor: '#E5E7EB', color: '#374151', fontWeight: 500, fontSize: '0.8rem' }
          }
          onMouseEnter={e => { if (!isSelected) (e.currentTarget as HTMLElement).style.borderColor = itemColor }}
          onMouseLeave={e => { if (!isSelected) (e.currentTarget as HTMLElement).style.borderColor = '#E5E7EB' }}
        >
          <span className="mr-1.5 opacity-70">{domainEmoji(comp?.name_fr ?? '')}</span>
          {item.name_fr}
        </button>
      </li>
    )
  }

  function renderProjectButton(proj: Project) {
    const isActive = popover?.project.id === proj.id || (selected?.kind === 'project' && selected.data.id === proj.id)
    return (
      <li key={proj.id}>
        <button
          onClick={(e) => openPopover(proj, e)}
          className="w-full text-left text-xs px-3 py-2 rounded-lg border transition-all"
          style={isActive
            ? { backgroundColor: '#7C3AED', borderColor: 'transparent', color: '#fff', fontWeight: 600, fontSize: '0.8rem' }
            : { backgroundColor: '#fff', borderColor: '#E5E7EB', color: '#374151', fontWeight: 500, fontSize: '0.8rem' }
          }
          onMouseEnter={e => { if (!isActive) (e.currentTarget as HTMLElement).style.borderColor = '#7C3AED' }}
          onMouseLeave={e => { if (!isActive) (e.currentTarget as HTMLElement).style.borderColor = '#E5E7EB' }}
        >
          <span className="block font-semibold leading-snug">🔗 {proj.title}</span>
          <span className="block mt-0.5 opacity-60" style={{ fontSize: '0.72rem' }}>
            {proj.project_subjects.map(ps => ps.subjects?.name_fr).filter(Boolean).join(' · ')}
          </span>
        </button>
      </li>
    )
  }

  // ── Main render ──────────────────────────────────────────────
  return (
    <div className="flex h-[calc(100vh-65px)]">

      {/* ── Sidebar ─────────────────────────────────────────── */}
      <aside className={`${isMultiSubject ? 'w-80' : 'w-72'} shrink-0 bg-white border-r flex flex-col`}>

        {/* Progress header */}
        <div className="px-5 py-4 border-b">
          <div className="flex justify-between items-baseline mb-2">
            <p className="text-xs font-bold text-gray-700 uppercase tracking-wider">Contenus</p>
            <p className="text-xs text-gray-400 tabular-nums">{totalAssigned} / {totalAssignable}</p>
          </div>
          <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{ width: `${progress}%`, backgroundColor: '#6366F1' }}
            />
          </div>

          {/* Selected item banner */}
          {selected && (
            <div
              className="mt-3 flex items-center gap-2 px-3 py-2 rounded-lg"
              style={{ backgroundColor: isDuplicating ? '#EFF6FF' : `${selectedColor}15` }}
            >
              {isDuplicating
                ? <span className="text-sm shrink-0">📋</span>
                : <span className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: selectedColor }} />
              }
              <div className="flex-1 min-w-0">
                {isDuplicating && <p className="text-xs font-bold text-blue-600 leading-none mb-0.5">Duplication</p>}
                <p className="text-xs text-gray-700 truncate font-medium leading-snug">
                  {selected.kind === 'item' ? selected.data.name_fr : `🔗 ${selected.data.title}`}
                </p>
              </div>
              <button
                onClick={() => { setSelected(null); setIsDuplicating(false) }}
                className="text-gray-400 hover:text-gray-600 transition text-xs shrink-0"
              >
                ✕
              </button>
            </div>
          )}
        </div>

        {isMultiSubject ? renderMultiSubjectSidebar() : renderSingleSubjectSidebar()}
      </aside>

      {/* ── Project popover ────────────────────────────────────── */}
      {popover && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setPopover(null)} />
          <div
            className="fixed z-50 bg-white rounded-2xl shadow-2xl border border-gray-100 w-72 overflow-hidden"
            style={{
              left: popover.toLeft ? `${popover.x - 296}px` : `${popover.x + 8}px`,
              top: `${popover.y}px`,
            }}
          >
            {/* Arrow — points toward the anchor */}
            {popover.toLeft ? (
              <>
                <div className="absolute -right-2 top-5 border-t-8 border-b-8 border-l-8 border-t-transparent border-b-transparent border-l-gray-100" />
                <div className="absolute -right-1.5 top-5 border-t-8 border-b-8 border-l-8 border-t-transparent border-b-transparent border-l-white" />
              </>
            ) : (
              <>
                <div className="absolute -left-2 top-5 border-t-8 border-b-8 border-r-8 border-t-transparent border-b-transparent border-r-gray-100" />
                <div className="absolute -left-1.5 top-5 border-t-8 border-b-8 border-r-8 border-t-transparent border-b-transparent border-r-white" />
              </>
            )}

            {/* Header */}
            <div className="px-4 py-3" style={{ backgroundColor: '#F3F0FF' }}>
              <p className="font-bold text-sm text-violet-900 leading-snug">🔗 {popover.project.title}</p>
            </div>

            {/* Description */}
            {popover.project.description && (
              <p className="px-4 py-3 text-xs text-gray-500 leading-relaxed border-b">
                {popover.project.description}
              </p>
            )}

            {/* Subjects */}
            <div className="px-4 py-3 border-b">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Matières impliquées</p>
              <div className="flex flex-col gap-1.5">
                {popover.project.project_subjects.map(ps => {
                  const s = ps.subjects
                  if (!s) return null
                  return (
                    <div key={ps.subject_id} className="flex items-center gap-2">
                      <span className="text-sm">{subjectEmoji(s.slug)}</span>
                      <span
                        className="text-xs font-semibold px-2 py-0.5 rounded-full"
                        style={{ backgroundColor: `${s.color ?? '#94A3B8'}18`, color: s.color ?? '#6B7280' }}
                      >
                        {s.name_fr}
                      </span>
                    </div>
                  )
                })}
              </div>
            </div>

            {/* Action */}
            <div className="px-4 py-3">
              <button
                onClick={() => {
                  setSelected({ kind: 'project', data: popover.project })
                  setPopover(null)
                }}
                className="w-full text-xs font-semibold py-2 rounded-xl text-white transition hover:opacity-90"
                style={{ backgroundColor: '#7C3AED' }}
              >
                Assigner à un mois →
              </button>
            </div>
          </div>
        </>
      )}

      {/* ── Item action menu ───────────────────────────────────── */}
      {itemMenu && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setItemMenu(null)} />
          <div
            className="fixed z-50 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden min-w-[210px]"
            style={{ left: `${itemMenu.x}px`, top: `${itemMenu.y}px` }}
          >
            <button
              onClick={handleMoveItem}
              className="flex items-center gap-2.5 w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 transition"
            >
              <span>↔</span> Déplacer
            </button>
            <button
              onClick={handleDuplicateItem}
              className="flex items-center gap-2.5 w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-blue-50 transition"
            >
              <span>📋</span> Dupliquer dans un autre mois
            </button>
            <div className="border-t border-gray-100" />
            <button
              onClick={handleRemoveItem}
              className="flex items-center gap-2.5 w-full text-left px-4 py-2.5 text-sm text-red-500 hover:bg-red-50 transition"
            >
              <span>✕</span> Retirer
            </button>
          </div>
        </>
      )}

      {/* ── Activity suggestion modal ──────────────────────────── */}
      {activityModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
          onClick={() => setActivityModal(null)}>
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-sm overflow-hidden" onClick={e => e.stopPropagation()}>
            {/* Header */}
            <div className="px-5 py-4 border-b"
              style={{ backgroundColor: `${activityModal.contentItem.competencies?.color ?? '#6366F1'}12` }}>
              <div className="flex items-start justify-between gap-3">
                <div>
                  {activityModal.contentItem.competencies && (
                    <p className="text-[0.65rem] font-bold uppercase tracking-wider mb-0.5"
                      style={{ color: activityModal.contentItem.competencies.color ?? '#6366F1' }}>
                      {activityModal.contentItem.competencies.name_fr}
                    </p>
                  )}
                  <p className="text-sm font-bold text-gray-800 leading-snug">{activityModal.contentItem.name_fr}</p>
                </div>
                <button onClick={() => setActivityModal(null)} className="text-gray-400 hover:text-gray-600 text-xl leading-none shrink-0 mt-0.5">×</button>
              </div>
            </div>

            {/* Activities */}
            <div className="p-5">
              <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-3">Activités associées</p>
              {activityModal.loading && (
                <p className="text-sm text-gray-400 text-center py-4">Chargement…</p>
              )}
              {!activityModal.loading && activityModal.activities.length === 0 && activityModal.suggestions.length === 0 && (
                <div className="text-center py-4">
                  <p className="text-sm text-gray-400 mb-2">Aucune activité liée à ce contenu.</p>
                  <a href="/dashboard/activities"
                    className="text-xs text-indigo-500 hover:text-indigo-700 font-medium transition">
                    Créer une activité dans la banque →
                  </a>
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
                        <a href={`/dashboard/activities/present/${act.id}`}
                          target="_blank" rel="noopener noreferrer"
                          className="flex-1 flex items-center gap-2.5 p-2.5 rounded-xl bg-gray-50 hover:bg-indigo-50 border border-transparent hover:border-indigo-100 transition group min-w-0">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5 mb-0.5">
                              {act.is_template && (
                                <span className="text-[0.6rem] font-bold px-1.5 py-0.5 rounded-full bg-teal-50 text-teal-600 shrink-0">Causerie</span>
                              )}
                              <p className="text-sm font-semibold text-gray-800 truncate group-hover:text-indigo-600">{act.title}</p>
                            </div>
                            {(act.type_tag || act.duration_min) && (
                              <p className="text-xs text-gray-400">
                                {[act.type_tag, act.duration_min ? `${act.duration_min} min` : null].filter(Boolean).join(' · ')}
                              </p>
                            )}
                          </div>
                          <span className="text-gray-300 group-hover:text-indigo-400 transition text-xs shrink-0">▶</span>
                        </a>
                        <button
                          onClick={() => handleTogglePca(activityModal.contentItem.id, actId, tplId)}
                          title={assigned ? 'Retirer de la planification' : 'Ajouter à la planification'}
                          className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold transition"
                          style={assigned
                            ? { backgroundColor: '#EEF2FF', color: '#4F46E5' }
                            : { backgroundColor: '#F3F4F6', color: '#9CA3AF' }
                          }
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
                              {act.is_template && (
                                <span className="text-[0.6rem] font-bold px-1.5 py-0.5 rounded-full bg-teal-50 text-teal-600 shrink-0 mr-1">Causerie</span>
                              )}
                              <p className="text-sm font-semibold text-gray-800 truncate group-hover:text-amber-700 inline">{act.title}</p>
                              {(act.type_tag || act.duration_min) && (
                                <p className="text-xs text-gray-400">{[act.type_tag, act.duration_min ? `${act.duration_min} min` : null].filter(Boolean).join(' · ')}</p>
                              )}
                            </div>
                          </a>
                          <button
                            onClick={() => handleTogglePca(activityModal.contentItem.id, actId, tplId)}
                            title={assigned ? 'Retirer' : 'Ajouter à la planification'}
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

            {/* Footer */}
            <div className="px-5 pb-5">
              <button
                onClick={() => { setSelected({ kind: 'item', data: activityModal.contentItem }); setActivityModal(null) }}
                className="w-full py-2.5 rounded-xl text-sm font-semibold text-white transition hover:opacity-90"
                style={{ backgroundColor: activityModal.contentItem.competencies?.color ?? '#6366F1' }}>
                Assigner à un mois →
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Monthly grid ───────────────────────────────────────── */}
      <div className="flex-1 overflow-auto" style={{ backgroundColor: '#C8D8F0' }}>

        {/* Assign / duplicate mode top banner */}
        {selected && (
          <div
            className="sticky top-0 z-10 flex items-center gap-3 px-6 py-2.5 text-sm font-medium text-white shadow-sm"
            style={{ backgroundColor: isDuplicating ? '#2563EB' : selectedColor }}
          >
            <span className="text-base">{isDuplicating ? '📋' : '👆'}</span>
            <span className="flex-1">
              {isDuplicating
                ? <>Mode duplication — cliquez sur un mois pour y ajouter aussi{' '}<em>«{selected.kind === 'item' ? selected.data.name_fr : selected.data.title}»</em></>
                : <>Cliquez sur un mois pour y assigner{' '}<em>«{selected.kind === 'item' ? selected.data.name_fr : selected.data.title}»</em></>
              }
            </span>
            {isDuplicating && (
              <button
                onClick={() => { setIsDuplicating(false); setSelected(null) }}
                className="bg-white/20 hover:bg-white/30 px-3 py-1 rounded-lg text-xs transition whitespace-nowrap"
              >
                Terminer
              </button>
            )}
          </div>
        )}

        {/* Août — pré-rentrée row */}
        {(() => {
          const { month, label, bg, text } = AOUT_MONTH
          const monthContent  = getContentForMonth(month)
          const monthProjects = isMultiSubject ? getProjectsForMonth(month) : []
          const totalInMonth  = monthContent.length + monthProjects.length
          const isAssignMode  = !!selected
          const aoutContent   = getContentForMonth(month)
          const aoutProjects  = isMultiSubject ? getProjectsForMonth(month) : []
          const aoutTotal     = aoutContent.length + aoutProjects.length
          void monthContent; void monthProjects; void totalInMonth
          return (
            <div className="px-4 pt-4 pb-1">
              <div
                className="rounded-xl shadow-sm overflow-hidden transition-all"
                onClick={isAssignMode ? () => handleAssign(month) : (draggedItem ? () => { handleAssignItem(draggedItem, month); setDraggedItem(null) } : undefined)}
                onDragOver={e => { if (draggedItem) { e.preventDefault(); setDragOverMonth(month) } }}
                onDragLeave={() => setDragOverMonth(null)}
                onDrop={e => { e.preventDefault(); if (draggedItem) { handleAssignItem(draggedItem, month); setDraggedItem(null); setDragOverMonth(null) } }}
                style={(isAssignMode || dragOverMonth === month) ? { cursor: 'pointer', outline: `2px dashed ${isAssignMode ? selectedColor : '#F59E0B'}`, outlineOffset: '2px', backgroundColor: isAssignMode ? `${selectedColor}0D` : '#FFFBEB' } : {}}
                onMouseEnter={e => { if (isAssignMode) (e.currentTarget as HTMLElement).style.backgroundColor = `${selectedColor}0D` }}
                onMouseLeave={e => { if (isAssignMode) (e.currentTarget as HTMLElement).style.backgroundColor = '' }}
              >
                <div className="flex items-center gap-3 px-4 py-2.5" style={{ backgroundColor: bg }}>
                  <p className="text-sm font-bold" style={{ color: text }}>{label}</p>
                  <span className="text-xs font-medium px-2 py-0.5 rounded-full" style={{ backgroundColor: `${text}20`, color: text }}>Pré-rentrée</span>
                  {aoutTotal > 0 && <span className="text-xs" style={{ color: text, opacity: 0.7 }}>{aoutTotal} élément{aoutTotal !== 1 ? 's' : ''}</span>}
                  <Link
                    href={`/dashboard/annual/${planId}/month/8`}
                    onClick={e => e.stopPropagation()}
                    title="Planification des semaines"
                    className="ml-auto text-[0.65rem] font-semibold px-2 py-0.5 rounded-full transition opacity-50 hover:opacity-100 hover:bg-black/10"
                    style={{ color: text }}
                  >
                    semaines →
                  </Link>
                </div>
                {uniqueEventLabels(eventsByMonth.get(month) ?? []).length > 0 && (
                  <div className="px-3 py-1.5 flex flex-wrap gap-1 bg-white border-b border-dashed border-gray-100">
                    {uniqueEventLabels(eventsByMonth.get(month) ?? []).map(ev => {
                      const s = calendarEventStyle(ev.event_type)
                      return (
                        <span key={ev.id} title={ev.label}
                          className="text-[0.65rem] px-1.5 py-0.5 rounded font-medium leading-tight"
                          style={{ backgroundColor: s.bg, color: s.text }}>
                          {ev.label.length > 30 ? ev.label.slice(0, 28) + '…' : ev.label}
                        </span>
                      )
                    })}
                  </div>
                )}
                {aoutTotal > 0 && (
                  <div className="px-4 py-2 flex flex-wrap gap-1.5 bg-white">
                    {aoutContent.map(({ assignment, item, imported }) => {
                      const pcaCount = localPca.filter(p => p.content_item_id === item.id).length
                      return (
                        <div key={assignment.id}
                          className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg"
                          style={{ backgroundColor: bg, borderLeft: `3px solid ${text}`, opacity: imported ? 0.55 : 1, cursor: imported ? 'default' : 'pointer' }}
                          onClick={e => { e.stopPropagation(); if (!imported) openItemMenu(e, assignment.id, item) }}
                        >
                          <span className="shrink-0 opacity-60">{SUBJECT_SYMBOL}</span>
                          <span className="shrink-0">{domainEmoji(item.competencies?.name_fr ?? '')}</span>
                          <span className="leading-snug font-medium" style={{ color: text }}>{item.name_fr}</span>
                          {pcaCount > 0 && <span className="text-[0.6rem] font-bold px-1 py-0.5 rounded-full" style={{ backgroundColor: `${text}25`, color: text }}>{pcaCount}</span>}
                        </div>
                      )
                    })}
                    {aoutProjects.map(({ assignment, project }) => (
                      <div key={assignment.id}
                        className="flex items-center gap-1 text-xs px-2.5 py-1 rounded-lg cursor-pointer"
                        style={{ backgroundColor: '#F3F0FF', borderLeft: '3px solid #7C3AED' }}
                        onClick={e => { e.stopPropagation(); handleUnassignProject(assignment.id); setSelected({ kind: 'project', data: project }) }}
                      >
                        <span className="shrink-0">🔗</span>
                        <span className="font-medium" style={{ color: '#5B21B6' }}>{project.title}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )
        })()}

        {/* Sept–Juin — 2 rangées de 5 mois */}
        <div className="grid grid-cols-5 gap-2 p-4 pt-2 min-w-[780px]">
          {SCHOOL_MONTHS.map(({ month, label, bg, text }) => {
            const monthContent  = getContentForMonth(month)
            const monthProjects = isMultiSubject ? getProjectsForMonth(month) : []
            const totalInMonth  = monthContent.length + monthProjects.length
            const isAssignMode  = !!selected

            return (
              <div
                key={month}
                onClick={isAssignMode ? () => handleAssign(month) : (draggedItem ? () => { handleAssignItem(draggedItem, month); setDraggedItem(null) } : undefined)}
                onDragOver={e => { if (draggedItem) { e.preventDefault(); setDragOverMonth(month) } }}
                onDragLeave={e => { if (!(e.currentTarget as HTMLElement).contains(e.relatedTarget as Node)) setDragOverMonth(null) }}
                onDrop={e => { e.preventDefault(); if (draggedItem) { handleAssignItem(draggedItem, month); setDraggedItem(null); setDragOverMonth(null) } }}
                className="bg-white rounded-xl shadow-sm flex flex-col overflow-hidden transition-all duration-150"
                style={(isAssignMode || dragOverMonth === month) ? {
                  cursor: 'pointer',
                  outline: `2px dashed ${isAssignMode ? selectedColor : '#F59E0B'}`,
                  outlineOffset: '2px',
                  backgroundColor: isAssignMode ? `${selectedColor}0D` : '#FFFBEB',
                } : {}}
                onMouseEnter={e => {
                  if (isAssignMode) (e.currentTarget as HTMLElement).style.backgroundColor = `${selectedColor}0D`
                }}
                onMouseLeave={e => {
                  if (isAssignMode) (e.currentTarget as HTMLElement).style.backgroundColor = '#fff'
                }}
              >
                {/* Month header */}
                <div className="px-3 py-2.5 flex items-start justify-between gap-1" style={{ backgroundColor: bg }}>
                  <div>
                    <p className="text-sm font-bold" style={{ color: text }}>{label}</p>
                    {totalInMonth > 0 && (
                      <p className="text-xs mt-0.5" style={{ color: text, opacity: 0.7 }}>
                        {totalInMonth} élément{totalInMonth !== 1 ? 's' : ''}
                      </p>
                    )}
                  </div>
                  <Link
                    href={`/dashboard/annual/${planId}/month/${month}`}
                    onClick={e => e.stopPropagation()}
                    title="Planification des semaines"
                    className="shrink-0 text-[0.65rem] font-semibold px-2 py-0.5 rounded-full transition hover:opacity-100 opacity-50 hover:bg-black/10"
                    style={{ color: text }}
                  >
                    semaines →
                  </Link>
                </div>

                {/* Assigned items */}
                <div className="flex-1 p-2 flex flex-col gap-1.5 min-h-36">
                  {/* Calendar event badges */}
                  {uniqueEventLabels(eventsByMonth.get(month) ?? []).length > 0 && (
                    <div className="flex flex-wrap gap-1 pb-1.5 border-b border-dashed border-gray-100">
                      {uniqueEventLabels(eventsByMonth.get(month) ?? []).map(ev => {
                        const s = calendarEventStyle(ev.event_type)
                        return (
                          <span key={ev.id} title={ev.label}
                            className="text-[0.62rem] px-1.5 py-0.5 rounded font-medium leading-tight"
                            style={{ backgroundColor: s.bg, color: s.text }}>
                            {ev.label.length > 25 ? ev.label.slice(0, 23) + '…' : ev.label}
                          </span>
                        )
                      })}
                    </div>
                  )}
                  {/* Content item chips — click to re-select for moving */}
                  {monthContent.map(({ assignment, item, imported }) => {
                    const pcaCount = localPca.filter(p => p.content_item_id === item.id).length
                    return (
                      <div
                        key={assignment.id}
                        className="flex items-start gap-1.5 text-xs px-2.5 py-2 rounded-lg"
                        style={{
                          backgroundColor: bg,
                          borderLeft: `3px solid ${text}`,
                          opacity: imported ? 0.55 : 1,
                          cursor: imported ? 'default' : 'pointer',
                        }}
                        onClick={e => {
                          e.stopPropagation()
                          if (!imported) openItemMenu(e, assignment.id, item)
                        }}
                        title={imported ? 'Assigné dans une planification par matière' : 'Cliquer pour options'}
                      >
                        <span className="shrink-0 text-xs opacity-60">{SUBJECT_SYMBOL}</span>
                        <span className="shrink-0 text-xs">{domainEmoji(item.competencies?.name_fr ?? '')}</span>
                        <span className="flex-1 leading-snug font-medium text-[0.8rem]" style={{ color: text }}>{item.name_fr}</span>
                        {pcaCount > 0 && (
                          <span
                            className="shrink-0 text-[0.6rem] font-bold px-1 py-0.5 rounded-full"
                            style={{ backgroundColor: `${text}25`, color: text }}
                            title={`${pcaCount} activité${pcaCount > 1 ? 's' : ''} planifiée${pcaCount > 1 ? 's' : ''}`}
                          >
                            {pcaCount}
                          </span>
                        )}
                      </div>
                    )
                  })}

                  {/* Project chips — click to re-select for moving */}
                  {monthProjects.map(({ assignment, project }) => (
                    <div
                      key={assignment.id}
                      className="flex items-start gap-1.5 text-xs px-2.5 py-2 rounded-lg cursor-pointer"
                      style={{ backgroundColor: '#F3F0FF', borderLeft: '3px solid #7C3AED' }}
                      onClick={e => { e.stopPropagation(); handleUnassignProject(assignment.id); setSelected({ kind: 'project', data: project }) }}
                      title="Cliquer pour déplacer"
                    >
                      <span className="shrink-0 text-xs">🔗</span>
                      <span className="flex-1 leading-snug font-medium text-[0.8rem]" style={{ color: '#5B21B6' }}>{project.title}</span>
                    </div>
                  ))}

                  {totalInMonth === 0 && !isAssignMode && (
                    <p className="text-xs text-gray-300 text-center mt-4">—</p>
                  )}
                </div>
              </div>
            )
          })}
        </div>

        {/* ── Unplaced warning badge ──────────────────────────── */}
        {unplacedItems.length > 0 && (
          <div className="sticky bottom-4 z-20 flex justify-end pr-4 pointer-events-none">
            <div className="pointer-events-auto relative">

              {/* Panel */}
              {showUnplacedPanel && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowUnplacedPanel(false)} />
                  <div className="absolute bottom-full right-0 mb-2 w-72 bg-white rounded-2xl shadow-2xl border border-amber-200 overflow-hidden z-20">
                    <div className="flex items-center justify-between px-4 py-3 border-b border-amber-100" style={{ backgroundColor: '#FFFBEB' }}>
                      <p className="text-sm font-bold text-amber-800">Contenus non planifiés</p>
                      <button onClick={() => setShowUnplacedPanel(false)} className="text-amber-400 hover:text-amber-600 text-xl leading-none">×</button>
                    </div>
                    <div className="max-h-80 overflow-y-auto divide-y divide-gray-100">
                      {unplacedGroups.map(group => (
                        <div key={group.id}>
                          <button
                            onClick={() => setExpandedUnplacedGroup(expandedUnplacedGroup === group.id ? null : group.id)}
                            className="w-full flex items-center gap-2.5 px-4 py-2.5 hover:bg-gray-50 transition text-left"
                          >
                            <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: group.color ?? '#94A3B8' }} />
                            <span className="flex-1 text-sm font-medium text-gray-700">{group.name}</span>
                            <span className="text-xs font-bold px-2 py-0.5 rounded-full shrink-0"
                              style={{ backgroundColor: `${group.color ?? '#94A3B8'}20`, color: group.color ?? '#6b7280' }}>
                              {group.items.length}
                            </span>
                            <span className="text-gray-400 text-xs shrink-0">{expandedUnplacedGroup === group.id ? '▲' : '▼'}</span>
                          </button>
                          {expandedUnplacedGroup === group.id && (
                            <ul className="py-1.5 px-2 bg-gray-50">
                              {group.items.map(item => (
                                <li key={item.id}>
                                  <button
                                    draggable
                                    onDragStart={e => { e.dataTransfer.effectAllowed = 'move'; setDraggedItem(item); setShowUnplacedPanel(false) }}
                                    onDragEnd={() => setDraggedItem(null)}
                                    onClick={() => { openActivityModal(item); setShowUnplacedPanel(false) }}
                                    className="w-full text-left text-xs px-3 py-2 rounded-lg hover:bg-amber-50 flex items-center gap-2 transition cursor-grab active:cursor-grabbing"
                                  >
                                    <ProgressionBadge type={item.progression_type} />
                                    <span className="flex-1 leading-snug text-gray-700">{item.name_fr}</span>
                                    <span className="text-gray-300 text-[0.6rem]">⠿</span>
                                  </button>
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      ))}
                    </div>
                    <div className="px-4 py-2.5 border-t border-amber-100 bg-amber-50">
                      <p className="text-xs text-amber-700">Cliquez sur un contenu pour l'assigner à un mois.</p>
                    </div>
                  </div>
                </>
              )}

              {/* Badge button */}
              <button
                onClick={() => setShowUnplacedPanel(v => !v)}
                className="flex items-center gap-2 px-4 py-2.5 rounded-2xl font-bold text-sm shadow-lg transition hover:shadow-xl active:scale-95"
                style={{ backgroundColor: '#F59E0B', color: 'white' }}
              >
                <span>⚠️</span>
                <span>{unplacedItems.length} non planifié{unplacedItems.length > 1 ? 's' : ''}</span>
              </button>

            </div>
          </div>
        )}

      </div>
    </div>
  )
}

function CompletionBadge() {
  return (
    <div className="flex flex-col items-center justify-center py-10 px-6 text-center">
      <div className="text-3xl mb-2">🎉</div>
      <p className="text-sm font-semibold text-gray-700">Tout est planifié!</p>
      <p className="text-xs text-gray-400 mt-1">Tous les contenus ont été assignés à un mois.</p>
    </div>
  )
}
