'use client'

import { useState, useRef, useEffect } from 'react'
import { createClient as createBrowserClient } from '@/lib/supabase/client'
import { createActivity, updateActivity, deleteActivity, addAttachment, deleteAttachment, addTemplateContentItem, removeTemplateContentItem } from './actions'

// ── Types ──────────────────────────────────────────────────────

type Subject = { id: number; name_fr: string; color: string | null }
type GradeLevel = { id: number; label_fr: string }

type ContentItem = {
  id: number
  name_fr: string
  sort_order: number
  competency_id: number
  grade_level_id: number | null
  competencies: { id: number; name_fr: string; subject_id: number | null; subjects?: { id: number; name_fr: string; color: string | null } | null } | null
  grade_levels: { id: number; label_fr: string } | null
}

type Attachment = {
  id: string
  file_name: string
  file_path: string
  file_type: string | null
  file_size: number | null
}

type Activity = {
  id: string
  title: string
  description: string | null
  subject_id: number | null
  subject: Subject | null
  type_tag: string | null
  duration_min: number | null
  grade_level_tag: string | null
  grade_level_ids: number[]
  content_item_ids: number[]
  attachments: Attachment[]
  created_at: string
  is_template: boolean
  category: string | null
  trigger_text: string | null
  open_question: string | null
  expected_strategies: string | null
  observation_criteria: string | null
  pda_link: string | null
}

type FormData = {
  title: string
  description: string
  subject_id: string
  type_tag: string
  duration_min: string
  grade_level_tags: string[]
  trigger_text: string
  open_question: string
  expected_strategies: string
  observation_criteria: string
  pda_link: string
}

type Props = {
  activities: Activity[]
  templates: Activity[]
  subjects: Subject[]
  contentItems: ContentItem[]
  gradeLevels: GradeLevel[]
  userId: string
}

// ── Constants ──────────────────────────────────────────────────

const EMPTY_FORM: FormData = {
  title: '', description: '', subject_id: '', type_tag: '', duration_min: '', grade_level_tags: [],
  trigger_text: '', open_question: '', expected_strategies: '', observation_criteria: '', pda_link: '',
}

const GRADE_LEVELS = [
  'Maternelle 4 ans', 'Maternelle 5 ans',
  '1re année', '2e année', '3e année', '4e année', '5e année', '6e année',
]

function gradeMatches(activityTag: string | null, filterTag: string): boolean {
  if (!activityTag) return false
  if (activityTag === filterTag) return true
  if (activityTag === '3e-4e année' && (filterTag === '3e année' || filterTag === '4e année')) return true
  if (activityTag === '5e-6e année' && (filterTag === '5e année' || filterTag === '6e année')) return true
  return false
}

const BUCKET = 'activity-files'

const FILE_ACCEPT = '.pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.jpg,.jpeg,.png,.gif,.webp'

function pickFiles(multiple: boolean, onFiles: (files: File[]) => void) {
  const input = document.createElement('input')
  input.type = 'file'
  input.multiple = multiple
  input.accept = FILE_ACCEPT
  input.onchange = () => onFiles(Array.from(input.files ?? []))
  input.click()
}

// ── Pure helpers ───────────────────────────────────────────────

function subjectColor(subject: Subject | null): string {
  return subject?.color ?? '#94A3B8'
}

function sanitizeFilename(name: string): string {
  return name.replace(/[^a-zA-Z0-9._-]/g, '_')
}

function formatSize(bytes: number | null): string {
  if (!bytes) return ''
  if (bytes < 1024) return `${bytes} o`
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} Ko`
  return `${(bytes / (1024 * 1024)).toFixed(1)} Mo`
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

// ── Activity form ──────────────────────────────────────────────

function ActivityForm({
  data, contentItemIds, subjects, contentItems,
  onFieldChange, onContentIdsChange, onSubmit, onCancel, submitLabel, disabled,
}: {
  data: FormData
  contentItemIds: number[]
  subjects: Subject[]
  contentItems: ContentItem[]
  onFieldChange: (field: keyof FormData, value: string | string[]) => void
  onContentIdsChange: (ids: number[]) => void
  onSubmit: () => void
  onCancel: () => void
  submitLabel: string
  disabled?: boolean
}) {
  const [touched, setTouched] = useState(false)
  const titleMissing = touched && !data.title.trim()
  const selectedSubjectId = data.subject_id ? parseInt(data.subject_id) : null
  const filteredItems = selectedSubjectId
    ? contentItems.filter(ci =>
        ci.competencies?.subject_id === selectedSubjectId &&
        (data.grade_level_tags.length === 0 || data.grade_level_tags.some(t => ci.grade_levels?.label_fr === t))
      )
    : []

  function toggleContent(id: number) {
    onContentIdsChange(
      contentItemIds.includes(id) ? contentItemIds.filter(x => x !== id) : [...contentItemIds, id]
    )
  }

  return (
    <div className="space-y-3">
      <div>
        <input value={data.title} onChange={e => onFieldChange('title', e.target.value)}
          placeholder="Titre de l'activité *"
          className={`w-full text-sm rounded-xl border px-3 py-2.5 focus:outline-none bg-gray-50 ${titleMissing ? 'border-red-400 focus:border-red-400' : 'border-gray-200 focus:border-indigo-300'}`} />
        {titleMissing && <p className="text-xs text-red-500 mt-1">Le titre est obligatoire.</p>}
      </div>
      <div>
        <select value={data.subject_id}
          onChange={e => { onFieldChange('subject_id', e.target.value); onContentIdsChange([]) }}
          className="w-full text-sm rounded-xl border border-gray-200 px-3 py-2 focus:outline-none focus:border-indigo-300 bg-gray-50 text-gray-600">
          <option value="">Toutes les matières</option>
          {subjects.map(s => <option key={s.id} value={s.id}>{s.name_fr}</option>)}
        </select>
      </div>
      <div>
        <p className="text-xs text-gray-400 mb-1.5">Niveaux scolaires</p>
        <div className="flex flex-wrap gap-1.5">
          {GRADE_LEVELS.map(level => {
            const active = data.grade_level_tags.includes(level)
            return (
              <button key={level} type="button"
                onClick={() => onFieldChange('grade_level_tags', active
                  ? data.grade_level_tags.filter(l => l !== level)
                  : [...data.grade_level_tags, level]
                )}
                className={`text-xs px-2.5 py-1 rounded-full border transition ${active ? 'bg-indigo-600 text-white border-indigo-600' : 'bg-white text-gray-500 border-gray-200 hover:border-indigo-300'}`}>
                {level}
              </button>
            )
          })}
        </div>
      </div>
      {filteredItems.length > 0 && (
        <div>
          <p className="text-xs font-semibold text-gray-500 mb-1.5">
            Contenus associés
            {contentItemIds.length > 0 && (
              <span className="ml-2 font-bold text-indigo-600">{contentItemIds.length} sélectionné{contentItemIds.length > 1 ? 's' : ''}</span>
            )}
          </p>
          <div className="border border-gray-200 rounded-xl overflow-hidden max-h-40 overflow-y-auto divide-y divide-gray-50 bg-white">
            {filteredItems.map(item => (
              <label key={item.id} className="flex items-center gap-2.5 px-3 py-2 hover:bg-indigo-50 cursor-pointer transition">
                <input type="checkbox" checked={contentItemIds.includes(item.id)} onChange={() => toggleContent(item.id)}
                  className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-400" />
                <span className="text-xs text-gray-700 leading-snug">{item.name_fr}</span>
              </label>
            ))}
          </div>
          {contentItemIds.length > 0 && (
            <button onClick={() => onContentIdsChange([])} className="text-[0.65rem] text-gray-400 hover:text-gray-600 mt-1 transition">
              Tout désélectionner
            </button>
          )}
        </div>
      )}
      <div className="grid grid-cols-2 gap-2">
        <input value={data.type_tag} onChange={e => onFieldChange('type_tag', e.target.value)}
          placeholder="Type (Number Talk, Atelier…)"
          className="text-sm rounded-xl border border-gray-200 px-3 py-2 focus:outline-none focus:border-indigo-300 bg-gray-50" />
        <input type="number" min="1" value={data.duration_min} onChange={e => onFieldChange('duration_min', e.target.value)}
          placeholder="Durée (min)"
          className="text-sm rounded-xl border border-gray-200 px-3 py-2 focus:outline-none focus:border-indigo-300 bg-gray-50" />
      </div>
      <textarea value={data.description} onChange={e => onFieldChange('description', e.target.value)}
        placeholder="Description, notes, matériel nécessaire…" rows={3}
        className="w-full text-sm rounded-xl border border-gray-200 px-3 py-2.5 focus:outline-none focus:border-indigo-300 resize-none bg-gray-50" />

      <details className="group">
        <summary className="text-xs font-semibold text-indigo-500 cursor-pointer select-none list-none flex items-center gap-1 hover:text-indigo-700 transition">
          <span className="group-open:rotate-90 inline-block transition-transform">▶</span> Détails pédagogiques (optionnel)
        </summary>
        <div className="mt-3 space-y-2.5">
          {([
            ['trigger_text', 'Amorce / Déclencheur'],
            ['open_question', 'Question ouverte'],
            ['expected_strategies', 'Stratégies attendues'],
            ['observation_criteria', "Critères d'observation"],
            ['pda_link', 'Lien avec le PDA'],
          ] as [keyof FormData, string][]).map(([field, label]) => (
            <textarea key={field} value={data[field] as string} onChange={e => onFieldChange(field, e.target.value)}
              placeholder={label} rows={2}
              className="w-full text-sm rounded-xl border border-gray-200 px-3 py-2.5 focus:outline-none focus:border-indigo-300 resize-none bg-gray-50" />
          ))}
        </div>
      </details>

      <div className="flex justify-end gap-2 pt-1">
        <button type="button" onClick={onCancel}
          className="px-4 py-2 rounded-xl text-sm text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition font-medium">
          Annuler
        </button>
        <button type="button" disabled={disabled}
          onClick={() => { setTouched(true); if (data.title.trim()) onSubmit() }}
          className="px-4 py-2 rounded-xl text-sm font-semibold text-white transition disabled:opacity-50"
          style={{ backgroundColor: 'var(--color-nav)' }}>
          {submitLabel}
        </button>
      </div>
    </div>
  )
}

// ── Content multi-select dropdown ──────────────────────────────

function ContentDropdown({ items, selected, onChange }: {
  items: ContentItem[]
  selected: number[]
  onChange: (ids: number[]) => void
}) {
  const [open, setOpen] = useState(false)
  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (!open) return
    function onMouseDown(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) setOpen(false)
    }
    document.addEventListener('mousedown', onMouseDown)
    return () => document.removeEventListener('mousedown', onMouseDown)
  }, [open])

  function toggle(id: number) {
    onChange(selected.includes(id) ? selected.filter(x => x !== id) : [...selected, id])
  }

  const label = selected.length === 0
    ? 'Tous les contenus'
    : selected.length === 1
      ? (items.find(i => i.id === selected[0])?.name_fr ?? '1 contenu')
      : `${selected.length} contenus sélectionnés`

  return (
    <div ref={containerRef} className="relative">
      <button
        onClick={() => setOpen(v => !v)}
        className="flex items-center gap-2 px-4 py-2 text-sm rounded-xl border border-gray-200 bg-white shadow-sm hover:border-indigo-300 transition w-full max-w-xs"
      >
        <span className={`flex-1 text-left truncate ${selected.length > 0 ? 'text-indigo-600 font-medium' : 'text-gray-400'}`}>
          {label}
        </span>
        <span className="text-gray-400 text-xs shrink-0">{open ? '▲' : '▼'}</span>
      </button>
      {open && (
        <div className="absolute top-full left-0 mt-1 z-30 bg-white rounded-xl border border-gray-200 shadow-xl w-max min-w-full max-w-sm max-h-72 overflow-y-auto">
          <label className="flex items-center gap-2.5 px-4 py-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100">
            <input type="checkbox" checked={selected.length === 0} onChange={() => onChange([])}
              className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-400" />
            <span className="text-sm text-gray-700 font-semibold">Tous les contenus</span>
          </label>
          {items.map(item => (
            <label key={item.id} className="flex items-center gap-2.5 px-4 py-2.5 hover:bg-gray-50 cursor-pointer">
              <input type="checkbox" checked={selected.includes(item.id)} onChange={() => toggle(item.id)}
                className="rounded border-gray-300 text-indigo-600 focus:ring-indigo-400" />
              <span className="text-sm text-gray-700 leading-snug">{item.name_fr}</span>
            </label>
          ))}
        </div>
      )}
    </div>
  )
}

// ── Activity detail modal (unified dark format) ────────────────

function ActivityDetailModal({ activity, onClose, onUploadFile, onDeleteAtt, isUploading, onOpenFile, onEdit, contentItems, gradeLevels }: {
  activity: Activity
  onClose: () => void
  onUploadFile: (file: File) => void
  onDeleteAtt: (attId: string, filePath: string) => void
  isUploading: boolean
  onOpenFile: (filePath: string) => void
  onEdit: () => void
  contentItems: ContentItem[]
  gradeLevels: GradeLevel[]
}) {
  const color = activity.subject?.color ?? '#6366f1'
  const linkedItems = contentItems.filter(ci => activity.content_item_ids.includes(ci.id))

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto backdrop-blur-sm p-4 pt-8"
      style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div className="relative w-full max-w-2xl rounded-2xl shadow-2xl mb-8" style={{ backgroundColor: '#111827', border: '1px solid rgba(255,255,255,0.08)' }}>

        <div className="flex items-start gap-4 p-6" style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap gap-1.5 mb-2">
              {activity.subject && (
                <span className="text-[0.65rem] font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: `${color}25`, color }}>
                  {activity.subject.name_fr}
                </span>
              )}
              {activity.type_tag && (
                <span className="text-[0.65rem] font-medium px-2 py-0.5 rounded-full" style={{ backgroundColor: 'rgba(255,255,255,0.08)', color: '#9ca3af' }}>
                  {activity.type_tag}
                </span>
              )}
              {(activity.grade_level_ids.length > 0 ? gradeLevels.filter(gl => activity.grade_level_ids.includes(gl.id)).map(gl => gl.label_fr) : activity.grade_level_tag ? [activity.grade_level_tag] : []).map(label => (
                <span key={label} className="text-[0.65rem] font-medium px-2 py-0.5 rounded-full" style={{ backgroundColor: 'rgba(99,102,241,0.2)', color: '#a5b4fc' }}>
                  {label}
                </span>
              ))}
              {activity.duration_min != null && (
                <span className="text-[0.65rem] ml-auto" style={{ color: '#6b7280' }}>⏱ {activity.duration_min} min</span>
              )}
            </div>
            <h2 className="text-xl font-bold leading-snug" style={{ color: '#f9fafb' }}>{activity.title}</h2>
          </div>
          <button onClick={onClose} className="shrink-0 transition text-2xl leading-none mt-0.5" style={{ color: '#6b7280' }}>×</button>
        </div>

        <div className="p-6 space-y-5">
          <DetailSection label="Description" content={activity.description} />
          <DetailSection label="Amorce / Déclencheur" content={activity.trigger_text} />
          <DetailSection label="Question ouverte" content={activity.open_question} />
          <DetailSection label="Stratégies attendues" content={activity.expected_strategies} />
          <DetailSection label="Critères d'observation" content={activity.observation_criteria} />
          {activity.pda_link && (
            <div>
              <p className="text-xs font-bold uppercase tracking-widest mb-1.5" style={{ color: '#6b7280' }}>Lien avec le PDA</p>
              <p className="text-xs leading-relaxed italic" style={{ color: '#5eead4' }}>{activity.pda_link}</p>
            </div>
          )}

          {linkedItems.length > 0 && (
            <div className="pt-5" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
              <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#6b7280' }}>Contenus associés</p>
              <div className="space-y-1">
                {linkedItems.map(ci => (
                  <div key={ci.id} className="flex items-start gap-2">
                    {ci.grade_levels?.label_fr && (
                      <span className="text-[0.6rem] font-semibold px-1 py-0.5 rounded shrink-0 mt-0.5" style={{ backgroundColor: 'rgba(99,102,241,0.2)', color: '#a5b4fc' }}>{ci.grade_levels.label_fr}</span>
                    )}
                    <span className="text-xs leading-snug" style={{ color: '#d1d5db' }}>{ci.name_fr}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="pt-5" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-bold uppercase tracking-widest" style={{ color: '#6b7280' }}>Matériel joint</p>
              {isUploading
                ? <span className="text-xs font-medium" style={{ color: '#6b7280' }}>Chargement…</span>
                : <button type="button"
                    onClick={() => pickFiles(true, files => files.forEach(f => onUploadFile(f)))}
                    className="text-xs font-medium transition"
                    style={{ color: '#2dd4bf' }}>
                    + Joindre un fichier
                  </button>
              }
            </div>
            {activity.attachments.length === 0 && (
              <p className="text-xs" style={{ color: '#4b5563' }}>Aucun fichier joint · PDF, PowerPoint, Word, images (max 50 Mo)</p>
            )}
            {activity.attachments.map(att => (
              <div key={att.id} className="flex items-center gap-2 group py-1">
                <span className="text-sm">{fileIcon(att.file_type)}</span>
                <button onClick={() => onOpenFile(att.file_path)}
                  className="flex-1 text-left text-sm truncate transition" style={{ color: '#d1d5db' }}>
                  {att.file_name}
                </button>
                {att.file_size != null && <span className="text-xs shrink-0" style={{ color: '#4b5563' }}>{formatSize(att.file_size)}</span>}
                <button onClick={() => onDeleteAtt(att.id, att.file_path)}
                  className="hover:text-red-400 transition opacity-0 group-hover:opacity-100 shrink-0 text-base leading-none" style={{ color: '#374151' }}>×</button>
              </div>
            ))}
          </div>
        </div>

        <div className="flex items-center justify-between px-6 pb-6">
          <button onClick={() => { onClose(); onEdit() }}
            className="px-4 py-2 rounded-xl text-sm font-medium transition" style={{ color: '#9ca3af', backgroundColor: 'rgba(255,255,255,0.06)' }}>
            Modifier
          </button>
          <a href={`/dashboard/activities/present/${activity.id}`} target="_blank" rel="noopener noreferrer"
            className="px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-teal-600 hover:bg-teal-500 transition">
            ▶ Présenter en classe
          </a>
        </div>
      </div>
    </div>
  )
}

// ── Causerie detail modal ──────────────────────────────────────

function DetailSection({ label, content }: { label: string; content: string | null }) {
  if (!content) return null
  return (
    <div>
      <p className="text-xs font-bold uppercase tracking-widest mb-1.5" style={{ color: '#6b7280' }}>{label}</p>
      <p className="text-sm leading-relaxed whitespace-pre-wrap" style={{ color: '#e5e7eb' }}>{content}</p>
    </div>
  )
}

function CauserieDetailModal({ activity, onClose, onUploadFile, onDeleteAtt, isUploading, onOpenFile, contentItems, onAddContent, onRemoveContent }: {
  activity: Activity
  onClose: () => void
  onUploadFile: (file: File) => void
  onDeleteAtt: (attId: string, filePath: string) => void
  isUploading: boolean
  onOpenFile: (filePath: string) => void
  contentItems: ContentItem[]
  onAddContent: (contentItemId: number) => void
  onRemoveContent: (contentItemId: number) => void
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center overflow-y-auto backdrop-blur-sm p-4 pt-8" style={{ backgroundColor: 'rgba(0,0,0,0.7)' }}
      onClick={e => { if (e.target === e.currentTarget) onClose() }}>
      <div className="relative w-full max-w-2xl rounded-2xl shadow-2xl mb-8" style={{ backgroundColor: '#111827', border: '1px solid rgba(255,255,255,0.08)' }}>

        <div className="flex items-start gap-4 p-6" style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          <div className="flex-1 min-w-0">
            <div className="flex flex-wrap gap-1.5 mb-2">
              <span className="text-[0.65rem] font-bold px-2 py-0.5 rounded-full" style={{ backgroundColor: 'rgba(45,212,191,0.15)', color: '#2dd4bf' }}>Causerie</span>
              {activity.category && (
                <span className="text-[0.65rem] font-medium px-2 py-0.5 rounded-full" style={{ backgroundColor: 'rgba(255,255,255,0.08)', color: '#9ca3af' }}>
                  {activity.category.replace('Causerie — ', '')}
                </span>
              )}
              {activity.grade_level_tag && (
                <span className="text-[0.65rem] font-medium px-2 py-0.5 rounded-full" style={{ backgroundColor: 'rgba(99,102,241,0.2)', color: '#a5b4fc' }}>
                  {activity.grade_level_tag}
                </span>
              )}
              {activity.duration_min != null && (
                <span className="text-[0.65rem] ml-auto" style={{ color: '#6b7280' }}>⏱ {activity.duration_min} min</span>
              )}
            </div>
            <h2 className="text-xl font-bold leading-snug" style={{ color: '#f9fafb' }}>{activity.title}</h2>
          </div>
          <button onClick={onClose} className="shrink-0 transition text-2xl leading-none mt-0.5" style={{ color: '#6b7280' }}>×</button>
        </div>

        <div className="p-6 space-y-5">
          {activity.description && <DetailSection label="Description" content={activity.description} />}
          <DetailSection label="Amorce / Déclencheur" content={activity.trigger_text} />
          <DetailSection label="Question ouverte" content={activity.open_question} />
          <DetailSection label="Stratégies attendues" content={activity.expected_strategies} />
          <DetailSection label="Critères d'observation" content={activity.observation_criteria} />
          {activity.pda_link && (
            <div>
              <p className="text-xs font-bold uppercase tracking-widest mb-1.5" style={{ color: '#6b7280' }}>Lien avec le PDA</p>
              <p className="text-xs leading-relaxed italic" style={{ color: '#5eead4' }}>{activity.pda_link}</p>
            </div>
          )}
          {(() => {
            const GRADE_ORDER = ['Maternelle 4 ans','Maternelle 5 ans','1re année','2e année','3e année','4e année','3e-4e année','5e année','6e année','5e-6e année']
            const gradeIdx = (ci: ContentItem) => { const i = GRADE_ORDER.indexOf(ci.grade_levels?.label_fr ?? ''); return i === -1 ? 99 : i }
            const subjectItems = contentItems.filter(ci => ci.competencies?.subject_id === activity.subject_id)
            const linkedItems  = subjectItems.filter(ci => activity.content_item_ids.includes(ci.id))
            const available    = subjectItems.filter(ci => !activity.content_item_ids.includes(ci.id))
            if (subjectItems.length === 0) return null

            // Group available items by grade level for the dropdown
            const gradeGroups = new Map<string, ContentItem[]>()
            available.sort((a, b) => gradeIdx(a) - gradeIdx(b) || a.sort_order - b.sort_order)
              .forEach(ci => {
                const g = ci.grade_levels?.label_fr ?? 'Autre'
                if (!gradeGroups.has(g)) gradeGroups.set(g, [])
                gradeGroups.get(g)!.push(ci)
              })

            return (
              <div className="pt-5" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
                <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#6b7280' }}>Contenus associés</p>
                {linkedItems.length === 0 && (
                  <p className="text-xs mb-2" style={{ color: '#4b5563' }}>Aucun contenu associé</p>
                )}
                <div className="space-y-1 mb-3">
                  {linkedItems.map(ci => (
                    <div key={ci.id} className="flex items-center gap-2 group">
                      <span className="flex-1 text-xs leading-snug" style={{ color: '#d1d5db' }}>
                        {ci.grade_levels?.label_fr && <span className="mr-1.5 text-[0.6rem] font-semibold px-1 py-0.5 rounded" style={{ backgroundColor: 'rgba(99,102,241,0.2)', color: '#a5b4fc' }}>{ci.grade_levels.label_fr}</span>}
                        {ci.name_fr}
                      </span>
                      <button onClick={() => onRemoveContent(ci.id)}
                        className="hover:text-red-400 transition opacity-0 group-hover:opacity-100 text-sm leading-none shrink-0" style={{ color: '#4b5563' }}>×</button>
                    </div>
                  ))}
                </div>
                {gradeGroups.size > 0 && (
                  <select
                    onChange={e => { if (e.target.value) { onAddContent(parseInt(e.target.value)); e.target.value = '' } }}
                    className="w-full text-xs rounded-lg px-2 py-2 focus:outline-none cursor-pointer"
                    style={{ backgroundColor: '#1e293b', border: '1px solid #334155', color: '#cbd5e1' }}>
                    <option value="">+ Associer un contenu…</option>
                    {[...gradeGroups.entries()].map(([grade, items]) => (
                      <optgroup key={grade} label={grade}>
                        {items.map(ci => <option key={ci.id} value={ci.id}>{ci.name_fr}</option>)}
                      </optgroup>
                    ))}
                  </select>
                )}
              </div>
            )
          })()}
          <div className="pt-5" style={{ borderTop: '1px solid rgba(255,255,255,0.08)' }}>
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs font-bold uppercase tracking-widest" style={{ color: '#6b7280' }}>Matériel joint</p>
              {isUploading
                ? <span className="text-xs font-medium" style={{ color: '#6b7280' }}>Chargement…</span>
                : <button type="button"
                    onClick={() => pickFiles(false, files => { if (files[0]) onUploadFile(files[0]) })}
                    className="text-xs font-medium transition"
                    style={{ color: '#2dd4bf' }}>
                    + Joindre un fichier
                  </button>
              }
            </div>
            {activity.attachments.length === 0 && (
              <p className="text-xs" style={{ color: '#4b5563' }}>Aucun fichier joint · PDF, PowerPoint, Word, images (max 50 Mo)</p>
            )}
            {activity.attachments.map(att => (
              <div key={att.id} className="flex items-center gap-2 group py-1">
                <span className="text-sm">{fileIcon(att.file_type)}</span>
                <button onClick={() => onOpenFile(att.file_path)}
                  className="flex-1 text-left text-sm truncate transition" style={{ color: '#d1d5db' }}>
                  {att.file_name}
                </button>
                {att.file_size != null && <span className="text-xs shrink-0" style={{ color: '#4b5563' }}>{formatSize(att.file_size)}</span>}
                <button onClick={() => onDeleteAtt(att.id, att.file_path)}
                  className="hover:text-red-400 transition opacity-0 group-hover:opacity-100 shrink-0 text-base leading-none" style={{ color: '#374151' }}>×</button>
              </div>
            ))}
          </div>
        </div>

        <div className="flex justify-end px-6 pb-6">
          <a href={`/dashboard/activities/present/${activity.id}`} target="_blank" rel="noopener noreferrer"
            className="px-5 py-2.5 rounded-xl text-sm font-bold text-white bg-teal-600 hover:bg-teal-500 transition">
            ▶ Présenter en classe
          </a>
        </div>
      </div>
    </div>
  )
}

// ── Main component ─────────────────────────────────────────────

export default function ActivitiesClient({ activities: initial, templates: initialTemplates, subjects, contentItems, gradeLevels, userId }: Props) {
  const [activities, setActivities]         = useState<Activity[]>(initial)
  const [localTemplates, setLocalTemplates] = useState<Activity[]>(initialTemplates)
  const [showCreate, setShowCreate]             = useState(false)
  const [editingId, setEditingId]               = useState<string | null>(null)
  const [createForm, setCreateForm]             = useState<FormData>(EMPTY_FORM)
  const [createContentIds, setCreateContentIds] = useState<number[]>([])
  const [createPendingFiles, setCreatePendingFiles] = useState<File[]>([])
  const [editForms, setEditForms]               = useState<Record<string, FormData>>({})
  const [editContentIds, setEditContentIds]     = useState<Record<string, number[]>>({})
  const [search, setSearch]                     = useState('')
  const [subjectFilter, setSubjectFilterRaw]    = useState<number | null>(null)
  const [niveauFilter, setNiveauFilter]         = useState<string | null>(null)
  const [selectedContents, setSelectedContents] = useState<number[]>([])
  const [confirmDelete, setConfirmDelete]       = useState<string | null>(null)
  const [uploadingFor, setUploadingFor]         = useState<Set<string>>(new Set())
  const [isCreating, setIsCreating]             = useState(false)
  const [detailActivity, setDetailActivity]     = useState<Activity | null>(null)
  const [detailRegular, setDetailRegular]       = useState<Activity | null>(null)
  const [uploadError, setUploadError]           = useState<string | null>(null)

  function setSubjectFilter(id: number | null) {
    setSubjectFilterRaw(id)
    setSelectedContents([])
    setNiveauFilter(null)
  }

  // ── Upload helpers ─────────────────────────────────────────

  async function uploadFile(entityId: string, isTemplate: boolean, file: File): Promise<Attachment> {
    const supabase = createBrowserClient()
    const folder   = isTemplate ? `${userId}/templates/${entityId}` : `${userId}/${entityId}`
    const path     = `${folder}/${crypto.randomUUID()}_${sanitizeFilename(file.name)}`
    const { error } = await supabase.storage.from(BUCKET).upload(path, file)
    if (error) throw new Error(`Téléversement impossible : ${error.message}`)
    const attId = await addAttachment(
      isTemplate ? null : entityId,
      isTemplate ? entityId : null,
      file.name, path, file.type || null, file.size || null,
    )
    return { id: attId, file_name: file.name, file_path: path, file_type: file.type || null, file_size: file.size || null }
  }

  async function handleAddFile(activityId: string, file: File) {
    setUploadingFor(prev => new Set([...prev, activityId]))
    try {
      const att = await uploadFile(activityId, false, file)
      setActivities(prev => prev.map(a => a.id === activityId ? { ...a, attachments: [...a.attachments, att] } : a))
      setDetailRegular(prev => prev?.id === activityId ? { ...prev, attachments: [...prev.attachments, att] } : prev)
    } catch (e: any) {
      setUploadError(e.message ?? 'Erreur lors du téléversement')
    } finally {
      setUploadingFor(prev => { const s = new Set(prev); s.delete(activityId); return s })
    }
  }

  async function handleAddFileToTemplate(templateId: string, file: File) {
    setUploadingFor(prev => new Set([...prev, templateId]))
    try {
      const att = await uploadFile(templateId, true, file)
      setLocalTemplates(prev => prev.map(t => t.id === templateId ? { ...t, attachments: [...t.attachments, att] } : t))
      setDetailActivity(prev => prev?.id === templateId ? { ...prev, attachments: [...prev.attachments, att] } : prev)
    } catch (e: any) {
      setUploadError(e.message ?? 'Erreur lors du téléversement')
    } finally {
      setUploadingFor(prev => { const s = new Set(prev); s.delete(templateId); return s })
    }
  }

  async function handleToggleTemplateContent(templateId: string, contentItemId: number, remove: boolean) {
    const updater = (a: Activity): Activity => a.id === templateId
      ? { ...a, content_item_ids: remove
          ? a.content_item_ids.filter(id => id !== contentItemId)
          : [...a.content_item_ids, contentItemId] }
      : a
    setLocalTemplates(prev => prev.map(updater))
    setDetailActivity(prev => prev?.id === templateId ? updater(prev) : prev)
    if (remove) await removeTemplateContentItem(templateId, contentItemId)
    else await addTemplateContentItem(templateId, contentItemId)
  }

  async function handleDeleteAttachment(activityId: string, attId: string, filePath: string) {
    setActivities(prev => prev.map(a =>
      a.id === activityId ? { ...a, attachments: a.attachments.filter(att => att.id !== attId) } : a
    ))
    setDetailRegular(prev => prev?.id === activityId ? { ...prev, attachments: prev.attachments.filter(att => att.id !== attId) } : prev)
    await deleteAttachment(attId, filePath)
  }

  async function handleDeleteTemplateAttachment(templateId: string, attId: string, filePath: string) {
    setLocalTemplates(prev => prev.map(t =>
      t.id === templateId ? { ...t, attachments: t.attachments.filter(att => att.id !== attId) } : t
    ))
    setDetailActivity(prev => prev?.id === templateId
      ? { ...prev, attachments: prev.attachments.filter(att => att.id !== attId) } : prev)
    await deleteAttachment(attId, filePath)
  }

  async function handleOpenFile(filePath: string) {
    const supabase = createBrowserClient()
    const { data } = await supabase.storage.from(BUCKET).createSignedUrl(filePath, 3600)
    if (data?.signedUrl) window.open(data.signedUrl, '_blank')
  }

  // ── CRUD ──────────────────────────────────────────────────

  async function handleCreate() {
    if (!createForm.title.trim() || isCreating) return
    setIsCreating(true)
    const filesToUpload = [...createPendingFiles]
    const id     = crypto.randomUUID()
    const subjId = createForm.subject_id ? parseInt(createForm.subject_id) : null
    const activity: Activity = {
      id,
      title:           createForm.title.trim(),
      description:     createForm.description.trim() || null,
      subject_id:      subjId,
      subject:         subjects.find(s => s.id === subjId) ?? null,
      type_tag:        createForm.type_tag.trim() || null,
      grade_level_tag: createForm.grade_level_tags[0] ?? null,
      grade_level_ids: [],
      duration_min:    createForm.duration_min ? parseInt(createForm.duration_min) : null,
      content_item_ids: createContentIds,
      attachments:     [],
      created_at:      new Date().toISOString(),
      is_template:     false, category: null,
      trigger_text: createForm.trigger_text.trim() || null,
      open_question: createForm.open_question.trim() || null,
      expected_strategies: createForm.expected_strategies.trim() || null,
      observation_criteria: createForm.observation_criteria.trim() || null,
      pda_link: createForm.pda_link.trim() || null,
    }
    setActivities(prev => [activity, ...prev])
    setCreateForm(EMPTY_FORM); setCreateContentIds([]); setCreatePendingFiles([]); setShowCreate(false)
    // Auto-navigate to this activity's subject after creating
    if (subjId && subjectFilter === null) setSubjectFilterRaw(subjId)
    try {
      const glIds = gradeLevels.filter(gl => createForm.grade_level_tags.includes(gl.label_fr)).map(gl => gl.id)
      await createActivity(id, activity.title, activity.description, activity.subject_id,
        activity.type_tag, activity.duration_min, activity.grade_level_tag, activity.content_item_ids, glIds,
        activity.trigger_text, activity.open_question, activity.expected_strategies, activity.observation_criteria, activity.pda_link)
      if (glIds.length > 0) setActivities(prev => prev.map(a => a.id === id ? { ...a, grade_level_ids: glIds } : a))
      if (filesToUpload.length > 0) {
        const atts: Attachment[] = []
        for (const f of filesToUpload) {
          try {
            const att = await uploadFile(id, false, f)
            if (att) atts.push(att)
          } catch (e: any) {
            setUploadError(`Fichier "${f.name}" : ${e.message ?? 'Erreur de téléversement'}`)
          }
        }
        if (atts.length > 0) setActivities(prev => prev.map(a => a.id === id ? { ...a, attachments: atts } : a))
      }
    } catch (e: any) {
      setUploadError(e.message ?? 'Erreur lors de la création de l\'activité')
      setActivities(prev => prev.filter(a => a.id !== id))
    } finally { setIsCreating(false) }
  }

  function startEdit(activity: Activity) {
    const existingTags = activity.grade_level_ids.length > 0
      ? gradeLevels.filter(gl => activity.grade_level_ids.includes(gl.id)).map(gl => gl.label_fr)
      : (activity.grade_level_tag ? [activity.grade_level_tag] : [])
    setEditForms(prev => ({
      ...prev,
      [activity.id]: {
        title: activity.title, description: activity.description ?? '',
        subject_id: activity.subject_id != null ? String(activity.subject_id) : '',
        type_tag: activity.type_tag ?? '', grade_level_tags: existingTags,
        duration_min: activity.duration_min != null ? String(activity.duration_min) : '',
        trigger_text: activity.trigger_text ?? '',
        open_question: activity.open_question ?? '',
        expected_strategies: activity.expected_strategies ?? '',
        observation_criteria: activity.observation_criteria ?? '',
        pda_link: activity.pda_link ?? '',
      },
    }))
    setEditContentIds(prev => ({ ...prev, [activity.id]: activity.content_item_ids }))
    setEditingId(activity.id)
  }

  async function handleUpdate(id: string) {
    const form = editForms[id]; if (!form?.title.trim()) return
    const subjId = form.subject_id ? parseInt(form.subject_id) : null
    const ids    = editContentIds[id] ?? []
    const glIds = gradeLevels.filter(gl => form.grade_level_tags.includes(gl.label_fr)).map(gl => gl.id)
    const updates = {
      title: form.title.trim(), description: form.description.trim() || null,
      subject_id: subjId, subject: subjects.find(s => s.id === subjId) ?? null,
      type_tag: form.type_tag.trim() || null,
      grade_level_tag: form.grade_level_tags[0] ?? null,
      grade_level_ids: glIds,
      duration_min: form.duration_min ? parseInt(form.duration_min) : null, content_item_ids: ids,
      trigger_text: form.trigger_text.trim() || null,
      open_question: form.open_question.trim() || null,
      expected_strategies: form.expected_strategies.trim() || null,
      observation_criteria: form.observation_criteria.trim() || null,
      pda_link: form.pda_link.trim() || null,
    }
    setActivities(prev => prev.map(a => a.id === id ? { ...a, ...updates } : a))
    setEditingId(null)
    await updateActivity(id, updates.title, updates.description, updates.subject_id,
      updates.type_tag, updates.duration_min, updates.grade_level_tag, updates.content_item_ids, glIds,
      updates.trigger_text, updates.open_question, updates.expected_strategies, updates.observation_criteria, updates.pda_link)
  }

  async function handleDelete(id: string) {
    setActivities(prev => prev.filter(a => a.id !== id)); setConfirmDelete(null); await deleteActivity(id)
  }

  // ── Derived state ─────────────────────────────────────────

  const allActivities  = [...activities, ...localTemplates]
  const usedSubjectIds = [...new Set(allActivities.map(a => a.subject_id).filter(Boolean) as number[])]
  const usedSubjects   = subjects.filter(s => usedSubjectIds.includes(s.id))
  const subjectObj     = subjectFilter !== null ? usedSubjects.find(s => s.id === subjectFilter) ?? null : null

  const usedNiveaux = GRADE_LEVELS.filter(l =>
    allActivities.some(a => {
      if (subjectFilter !== null && a.subject_id !== subjectFilter) return false
      if (a.grade_level_ids.length > 0)
        return a.grade_level_ids.some(id => gradeLevels.find(gl => gl.id === id)?.label_fr === l)
      return gradeMatches(a.grade_level_tag, l)
    })
  )

  const relevantContentItems = subjectFilter !== null && niveauFilter !== null
    ? contentItems.filter(ci =>
        ci.competencies?.subject_id === subjectFilter &&
        ci.grade_levels?.label_fr === niveauFilter
      )
    : []

  // Only show activities once a subject is chosen; content filter hides causeries
  const filtered = subjectFilter === null ? [] : allActivities.filter(a => {
    if (a.subject_id !== subjectFilter) return false
    if (niveauFilter !== null) {
      if (a.grade_level_ids.length > 0) {
        if (!a.grade_level_ids.some(id => gradeLevels.find(gl => gl.id === id)?.label_fr === niveauFilter)) return false
      } else if (!gradeMatches(a.grade_level_tag, niveauFilter)) return false
    }
    if (selectedContents.length > 0) {
      if (a.is_template) return false
      if (!a.content_item_ids.some(id => selectedContents.includes(id))) return false
    }
    if (search) {
      const q = search.toLowerCase()
      return a.title.toLowerCase().includes(q)
        || (a.type_tag ?? '').toLowerCase().includes(q)
        || (a.category ?? '').toLowerCase().includes(q)
        || (a.description ?? '').toLowerCase().includes(q)
    }
    return true
  })

  // ── Shared card grid (used in both screens) ──────────────

  function renderCards() {
    if (filtered.length === 0 && subjectFilter !== null) {
      return (
        <div className="text-center py-16">
          <p className="text-sm text-gray-400">Aucune activité pour ces filtres.</p>
          {(selectedContents.length > 0 || niveauFilter !== null || search) && (
            <button
              onClick={() => { setSelectedContents([]); setNiveauFilter(null); setSearch('') }}
              className="mt-2 text-xs text-indigo-500 hover:text-indigo-700 font-medium transition">
              Effacer les filtres
            </button>
          )}
        </div>
      )
    }
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map(activity => {
          const color       = subjectColor(activity.subject)
          const isEditing   = editingId === activity.id
          const isUploading = uploadingFor.has(activity.id)
          const linkedItems = contentItems.filter(ci => activity.content_item_ids.includes(ci.id))

          return (
            <div key={activity.id}
              className={`bg-white rounded-2xl shadow border overflow-hidden flex flex-col${!isEditing ? ' cursor-pointer hover:shadow-md transition-shadow' : ''}`}
              onClick={!isEditing ? () => activity.is_template ? setDetailActivity(activity) : setDetailRegular(activity) : undefined}>
              <div className="h-1.5 shrink-0" style={{ backgroundColor: activity.is_template ? '#0d9488' : color }} />
              <div className="p-4 flex flex-col flex-1">
                {isEditing ? (
                  <ActivityForm
                    data={editForms[activity.id] ?? EMPTY_FORM}
                    contentItemIds={editContentIds[activity.id] ?? []}
                    subjects={subjects} contentItems={contentItems}
                    onFieldChange={(f, v) => setEditForms(prev => ({ ...prev, [activity.id]: { ...(prev[activity.id] ?? EMPTY_FORM), [f]: v } }))}
                    onContentIdsChange={ids => setEditContentIds(prev => ({ ...prev, [activity.id]: ids }))}
                    onSubmit={() => handleUpdate(activity.id)}
                    onCancel={() => setEditingId(null)}
                    submitLabel="Enregistrer"
                  />
                ) : (
                  <>
                    <div className="flex flex-wrap items-center gap-1.5 mb-2.5">
                      {activity.is_template && (
                        <span className="text-[0.65rem] font-bold px-2 py-0.5 rounded-full bg-teal-50 text-teal-600">Causerie</span>
                      )}
                      {!activity.is_template && activity.grade_level_ids.length > 0
                        ? activity.grade_level_ids.map(id => {
                            const gl = gradeLevels.find(g => g.id === id)
                            return gl ? <span key={id} className="text-[0.65rem] font-medium px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-500">{gl.label_fr}</span> : null
                          })
                        : activity.grade_level_tag && (
                            <span className="text-[0.65rem] font-medium px-2 py-0.5 rounded-full bg-indigo-50 text-indigo-500">
                              {activity.grade_level_tag}
                            </span>
                          )
                      }
                      {activity.type_tag && (
                        <span className="text-[0.65rem] font-medium px-2 py-0.5 rounded-full bg-gray-100 text-gray-500">
                          {activity.type_tag}
                        </span>
                      )}
                      {activity.duration_min != null && (
                        <span className="text-[0.65rem] text-gray-400 ml-auto">⏱ {activity.duration_min} min</span>
                      )}
                    </div>

                    <h3 className="text-sm font-bold text-gray-800 leading-snug mb-1">{activity.title}</h3>

                    {activity.description && (
                      <p className="text-xs text-gray-500 leading-relaxed line-clamp-2 mb-2">{activity.description}</p>
                    )}

                    {!activity.is_template && linkedItems.length > 0 && (
                      <div className="flex flex-col gap-0.5 mb-2">
                        {linkedItems.slice(0, 3).map(ci => (
                          <span key={ci.id} className="text-[0.65rem] text-gray-500 truncate">· {ci.name_fr}</span>
                        ))}
                        {linkedItems.length > 3 && (
                          <span className="text-[0.65rem] text-gray-400">+ {linkedItems.length - 3} autres</span>
                        )}
                      </div>
                    )}

                    {activity.is_template && (
                      <div className="space-y-1.5 mt-1.5">
                        {activity.category && (
                          <p className="text-[0.65rem] text-teal-500 font-semibold uppercase tracking-wide">
                            {activity.category.replace('Causerie — ', '')}
                          </p>
                        )}
                        {activity.trigger_text && (
                          <p className="text-xs text-gray-500 leading-relaxed line-clamp-2 italic">
                            «{activity.trigger_text}»
                          </p>
                        )}
                        {!activity.trigger_text && activity.open_question && (
                          <p className="text-xs text-gray-500 leading-relaxed line-clamp-2">
                            {activity.open_question}
                          </p>
                        )}
                      </div>
                    )}

                    <div className="mt-auto pt-3 border-t border-gray-100">
                      {activity.is_template ? (
                        <>
                          {activity.attachments.length > 0 && (
                            <div className="space-y-1 mb-2">
                              {activity.attachments.map(att => (
                                <div key={att.id} className="flex items-center gap-1.5 group" onClick={e => e.stopPropagation()}>
                                  <span className="text-xs">{fileIcon(att.file_type)}</span>
                                  <button onClick={() => handleOpenFile(att.file_path)}
                                    className="flex-1 text-left text-xs text-gray-600 hover:text-indigo-600 truncate transition">
                                    {att.file_name}
                                  </button>
                                  {att.file_size != null && <span className="text-[0.6rem] text-gray-400 shrink-0">{formatSize(att.file_size)}</span>}
                                  <button onClick={() => handleDeleteTemplateAttachment(activity.id, att.id, att.file_path)}
                                    className="text-gray-300 hover:text-red-400 transition opacity-0 group-hover:opacity-100 shrink-0 text-xs">×</button>
                                </div>
                              ))}
                            </div>
                          )}
                          <div className="flex items-center justify-between" onClick={e => e.stopPropagation()}>
                            {isUploading
                              ? <span className="text-xs text-gray-400 animate-pulse">Chargement…</span>
                              : <button type="button"
                                  onClick={() => pickFiles(true, files => files.forEach(f => handleAddFileToTemplate(activity.id, f)))}
                                  className="text-xs text-gray-400 hover:text-teal-500 transition flex items-center gap-1">
                                  <span className="text-sm font-medium">+</span> Joindre
                                </button>
                            }
                            <button onClick={() => setDetailActivity(activity)}
                              className="text-xs text-teal-500 hover:text-teal-700 font-medium transition">
                              Voir les détails →
                            </button>
                          </div>
                        </>
                      ) : (
                        <>
                          {activity.attachments.length > 0 && (
                            <div className="space-y-1 mb-2">
                              {activity.attachments.map(att => (
                                <div key={att.id} className="flex items-center gap-1.5 group">
                                  <span className="text-xs">{fileIcon(att.file_type)}</span>
                                  <button onClick={() => handleOpenFile(att.file_path)}
                                    className="flex-1 text-left text-xs text-gray-600 hover:text-indigo-600 truncate transition">
                                    {att.file_name}
                                  </button>
                                  {att.file_size != null && <span className="text-[0.6rem] text-gray-400 shrink-0">{formatSize(att.file_size)}</span>}
                                  <button onClick={() => handleDeleteAttachment(activity.id, att.id, att.file_path)}
                                    className="text-gray-300 hover:text-red-400 transition opacity-0 group-hover:opacity-100 shrink-0 text-xs">×</button>
                                </div>
                              ))}
                            </div>
                          )}
                          <div className="flex items-center justify-between" onClick={e => e.stopPropagation()}>
                            {isUploading
                              ? <span className="text-xs text-gray-400 animate-pulse">Chargement…</span>
                              : <button type="button"
                                  onClick={() => pickFiles(true, files => files.forEach(f => handleAddFile(activity.id, f)))}
                                  className="text-xs text-gray-400 hover:text-indigo-500 transition flex items-center gap-1">
                                  <span className="text-sm font-medium">+</span> Ajouter un fichier
                                </button>
                            }
                            <div className="flex items-center gap-2">
                              <button onClick={() => startEdit(activity)}
                                className="text-xs text-gray-500 hover:text-gray-700 font-medium transition">Modifier</button>
                              {confirmDelete === activity.id ? (
                                <div className="flex items-center gap-1.5">
                                  <button onClick={() => handleDelete(activity.id)} className="text-xs font-semibold text-red-500 hover:text-red-700 transition">Oui</button>
                                  <button onClick={() => setConfirmDelete(null)} className="text-xs text-gray-400 hover:text-gray-600 transition">Non</button>
                                </div>
                              ) : (
                                <button onClick={() => setConfirmDelete(activity.id)}
                                  className="text-xs text-red-400 hover:text-red-600 font-medium transition">Supprimer</button>
                              )}
                            </div>
                          </div>
                        </>
                      )}
                    </div>
                  </>
                )}
              </div>
            </div>
          )
        })}
      </div>
    )
  }

  // ── Render ────────────────────────────────────────────────

  const createFormPanel = showCreate && (
    <div className="mb-6 p-5 bg-white rounded-2xl shadow border">
      <p className="text-sm font-bold text-gray-700 mb-4">Nouvelle activité</p>
      <ActivityForm
        data={createForm} contentItemIds={createContentIds} subjects={subjects} contentItems={contentItems}
        onFieldChange={(f, v) => setCreateForm(prev => ({ ...prev, [f]: v }))}
        onContentIdsChange={setCreateContentIds}
        onSubmit={handleCreate}
        onCancel={() => { setShowCreate(false); setCreateForm(EMPTY_FORM); setCreateContentIds([]); setCreatePendingFiles([]) }}
        submitLabel={isCreating ? 'Création…' : 'Créer'}
        disabled={isCreating}
      />
      <div className="mt-4 pt-4 border-t border-gray-100">
        <div className="flex items-center justify-between mb-2">
          <p className="text-xs font-semibold text-gray-500">Pièces jointes</p>
          <button
            type="button"
            onClick={() => pickFiles(true, files => setCreatePendingFiles(prev => [...prev, ...files]))}
            className="cursor-pointer text-xs text-indigo-500 hover:text-indigo-700 font-medium transition"
          >
            + Ajouter un fichier
          </button>
        </div>
        {createPendingFiles.length > 0 ? (
          <div className="space-y-1">
            {createPendingFiles.map((f, i) => (
              <div key={i} className="flex items-center gap-2 text-xs text-gray-600 bg-gray-50 rounded-lg px-3 py-1.5">
                <span>{fileIcon(f.type)}</span>
                <span className="flex-1 truncate">{f.name}</span>
                <span className="text-gray-400 shrink-0">{formatSize(f.size)}</span>
                <button onClick={() => setCreatePendingFiles(prev => prev.filter((_, j) => j !== i))}
                  className="text-gray-400 hover:text-red-400 transition ml-1">×</button>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-gray-400">PDF, Word, Excel, PowerPoint, images (max 50 Mo)</p>
        )}
      </div>
    </div>
  )

  const errorBanner = uploadError && (
    <div className="mb-4 px-4 py-3 bg-red-50 border border-red-200 rounded-xl text-sm text-red-600 flex items-center justify-between">
      <span>{uploadError}</span>
      <button onClick={() => setUploadError(null)} className="ml-3 text-red-400 hover:text-red-600 text-lg leading-none">×</button>
    </div>
  )

  // ── Landing screen ─────────────────────────────────────────

  if (subjectFilter === null) {
    return (
      <div className="max-w-5xl mx-auto px-8 py-8">

        {errorBanner}
        <div className="flex justify-end mb-6">
          <button onClick={() => setShowCreate(true)}
            className="px-5 py-2.5 rounded-xl text-sm font-semibold text-white shadow-sm hover:opacity-90 transition"
            style={{ backgroundColor: 'var(--color-nav)' }}>
            + Nouvelle activité
          </button>
        </div>
        {createFormPanel}
        <div className="text-center pt-4 pb-8">
          <div className="text-5xl mb-4">📚</div>
          <h2 className="text-xl font-bold text-gray-700 mb-2">Quelle matière souhaitez-vous planifier?</h2>
          <p className="text-sm text-gray-400">Choisissez une matière pour accéder aux activités correspondantes</p>
        </div>
        {subjects.length === 0 ? (
          <div className="text-center py-8 text-sm text-gray-400">
            Aucune matière disponible pour le moment.
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 max-w-4xl mx-auto">
            {subjects.map(s => {
              const count = allActivities.filter(a => a.subject_id === s.id).length
              return (
                <button key={s.id} onClick={() => setSubjectFilter(s.id)}
                  className="flex flex-col items-center gap-3 px-6 py-6 rounded-2xl border-2 hover:shadow-lg transition-all hover:-translate-y-0.5 active:scale-95 w-full"
                  style={{ borderColor: s.color ?? '#94A3B8', backgroundColor: `${s.color ?? '#94A3B8'}0D` }}>
                  <div className="w-10 h-10 rounded-xl shadow-sm" style={{ backgroundColor: s.color ?? '#94A3B8' }} />
                  <span className="text-sm font-bold text-center" style={{ color: s.color ?? '#374151' }}>{s.name_fr}</span>
                  {count > 0 && (
                    <span className="text-[0.65rem] font-medium" style={{ color: s.color ?? '#6b7280' }}>{count} activité{count > 1 ? 's' : ''}</span>
                  )}
                </button>
              )
            })}
          </div>
        )}
        {detailActivity && (
          <CauserieDetailModal
            activity={detailActivity} onClose={() => setDetailActivity(null)}
            onUploadFile={file => handleAddFileToTemplate(detailActivity.id, file)}
            onDeleteAtt={(attId, fp) => handleDeleteTemplateAttachment(detailActivity.id, attId, fp)}
            isUploading={uploadingFor.has(detailActivity.id)} onOpenFile={handleOpenFile}
            contentItems={contentItems}
            onAddContent={id => handleToggleTemplateContent(detailActivity.id, id, false)}
            onRemoveContent={id => handleToggleTemplateContent(detailActivity.id, id, true)}
          />
        )}
        {detailRegular && (
          <ActivityDetailModal
            activity={detailRegular} onClose={() => setDetailRegular(null)}
            onUploadFile={file => handleAddFile(detailRegular.id, file)}
            onDeleteAtt={(attId, fp) => handleDeleteAttachment(detailRegular.id, attId, fp)}
            isUploading={uploadingFor.has(detailRegular.id)} onOpenFile={handleOpenFile}
            onEdit={() => startEdit(detailRegular)}
            contentItems={contentItems} gradeLevels={gradeLevels}
          />
        )}
      </div>
    )
  }

  // ── Browsing screen ────────────────────────────────────────

  return (
    <div className="max-w-5xl mx-auto px-8 py-8">
      {errorBanner}

      {/* Filter bar */}
      <div className="bg-white rounded-2xl border shadow-sm px-5 py-3.5 mb-5 flex items-center gap-3 flex-wrap">
        {/* Subject (colored, clickable to go back) */}
        <div className="flex items-center gap-1.5 shrink-0">
          <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: subjectObj?.color ?? '#94A3B8' }} />
          <select value={subjectFilter}
            onChange={e => setSubjectFilter(parseInt(e.target.value))}
            className="text-sm font-semibold border-0 bg-transparent focus:outline-none cursor-pointer pr-1"
            style={{ color: subjectObj?.color ?? '#374151' }}>
            {usedSubjects.map(s => <option key={s.id} value={s.id}>{s.name_fr}</option>)}
          </select>
        </div>

        <span className="text-gray-200 text-lg shrink-0">|</span>

        {/* Grade */}
        <select value={niveauFilter ?? ''} onChange={e => { setNiveauFilter(e.target.value || null); setSelectedContents([]) }}
          className="text-sm rounded-xl border border-gray-200 px-3 py-1.5 bg-white focus:outline-none focus:border-indigo-300 text-gray-600 shrink-0">
          <option value="">Tous les niveaux</option>
          {usedNiveaux.map(n => <option key={n} value={n}>{n}</option>)}
        </select>

        {/* Content dropdown */}
        {relevantContentItems.length > 0 && (
          <ContentDropdown items={relevantContentItems} selected={selectedContents} onChange={setSelectedContents} />
        )}

        {/* Search */}
        <input value={search} onChange={e => setSearch(e.target.value)}
          placeholder="Rechercher…"
          className="flex-1 min-w-32 text-sm rounded-xl border border-gray-200 px-3 py-1.5 focus:outline-none focus:border-indigo-300" />

        {/* Actions */}
        <button onClick={() => setShowCreate(true)}
          className="shrink-0 px-4 py-1.5 rounded-xl text-sm font-semibold text-white hover:opacity-90 transition"
          style={{ backgroundColor: 'var(--color-nav)' }}>
          + Nouvelle activité
        </button>
        <button onClick={() => setSubjectFilter(null)} className="shrink-0 text-xs text-gray-400 hover:text-gray-600 transition">
          ← Matières
        </button>
      </div>

      {createFormPanel}

      {filtered.length > 0 && (
        <p className="text-xs text-gray-400 mb-3">
          {filtered.length} activité{filtered.length > 1 ? 's' : ''}
        </p>
      )}

      {renderCards()}

      {detailActivity && (
        <CauserieDetailModal
          activity={detailActivity} onClose={() => setDetailActivity(null)}
          onUploadFile={file => handleAddFileToTemplate(detailActivity.id, file)}
          onDeleteAtt={(attId, fp) => handleDeleteTemplateAttachment(detailActivity.id, attId, fp)}
          isUploading={uploadingFor.has(detailActivity.id)} onOpenFile={handleOpenFile}
          contentItems={contentItems}
          onAddContent={id => handleToggleTemplateContent(detailActivity.id, id, false)}
          onRemoveContent={id => handleToggleTemplateContent(detailActivity.id, id, true)}
        />
      )}
      {detailRegular && (
        <ActivityDetailModal
          activity={detailRegular} onClose={() => setDetailRegular(null)}
          onUploadFile={file => handleAddFile(detailRegular.id, file)}
          onDeleteAtt={(attId, fp) => handleDeleteAttachment(detailRegular.id, attId, fp)}
          isUploading={uploadingFor.has(detailRegular.id)} onOpenFile={handleOpenFile}
          onEdit={() => { setDetailRegular(null); startEdit(detailRegular) }}
          contentItems={contentItems} gradeLevels={gradeLevels}
        />
      )}
    </div>
  )
}
