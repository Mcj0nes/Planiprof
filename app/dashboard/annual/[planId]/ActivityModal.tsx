'use client'

import { useState, useEffect } from 'react'
import { createClient } from '@/lib/supabase/client'
import { getSuggestedActivitiesForContent } from '@/app/dashboard/activities/actions'
import { createPrivateActivity, addActivityToBank } from './actions'

export type PlanContentActivity = {
  content_item_id: number
  activity_id: string | null
  template_id: string | null
}

type ContentItem = {
  id: number
  name_fr: string
  competencies: { name_fr: string; color: string | null } | null
}

type ActivityEntry = {
  id: string
  title: string
  type_tag: string | null
  duration_min: number | null
  is_template: boolean
  is_mine: boolean
  is_public: boolean
}

type Props = {
  planId: string
  contentItem: ContentItem
  assignedPca: PlanContentActivity[]
  onClose: () => void
  onTogglePca: (actId: string | null, tplId: string | null) => void
  onPcaAdded?: (activityId: string) => void
  assignButtonLabel?: string
  onAssign?: () => void
}

const ACTIVITY_TYPES = [
  'Discussion mathématique', 'Atelier', 'Jeu', 'Projet',
  'Résolution de problèmes', 'Évaluation', 'Autre',
]

export default function ActivityModal({
  planId, contentItem, assignedPca, onClose, onTogglePca, onPcaAdded, assignButtonLabel, onAssign,
}: Props) {
  const accentColor = contentItem.competencies?.color ?? '#6366F1'

  const isAssigned = (actId: string | null, tplId: string | null) =>
    assignedPca.some(p => p.activity_id === actId && p.template_id === tplId)

  const [loading, setLoading] = useState(true)
  const [activities, setActivities] = useState<ActivityEntry[]>([])
  const [suggestions, setSuggestions] = useState<ActivityEntry[]>([])
  const [showCreate, setShowCreate] = useState(false)
  const [creating, setCreating] = useState(false)
  const [createError, setCreateError] = useState<string | null>(null)
  const [form, setForm] = useState({ title: '', description: '', type_tag: '', duration_min: '', is_public: false })
  const [links, setLinks] = useState([{ url: '', label: '' }])
  const [bankLoading, setBankLoading] = useState<string | null>(null)
  const [publicIds, setPublicIds] = useState<Set<string>>(new Set())

  useEffect(() => { load() }, [contentItem.id])

  async function load() {
    setLoading(true)
    const supabase = createClient()
    const { data: { user } } = await supabase.auth.getUser()

    const assignedActIds = assignedPca.filter(p => p.activity_id).map(p => p.activity_id!)
    const assignedTplIds = assignedPca.filter(p => p.template_id).map(p => p.template_id!)

    const [actLinksRes, tplLinksRes] = await Promise.all([
      supabase.from('activity_content_items').select('activity_id').eq('content_item_id', contentItem.id),
      supabase.from('template_content_items').select('template_id').eq('content_item_id', contentItem.id),
    ])
    const linkedActIds = (actLinksRes.data ?? []).map((l: any) => l.activity_id)
    const linkedTplIds = (tplLinksRes.data ?? []).map((l: any) => l.template_id)
    const allActIds = [...new Set([...linkedActIds, ...assignedActIds])]
    const allTplIds = [...new Set([...linkedTplIds, ...assignedTplIds])]

    const [actsRes, tplsRes, sugg] = await Promise.all([
      allActIds.length > 0
        ? supabase.from('activities').select('id, title, type_tag, duration_min, user_id, is_public').in('id', allActIds)
        : Promise.resolve({ data: [] as any[] }),
      allTplIds.length > 0
        ? supabase.from('activity_templates').select('id, title, type_tag, duration_min').in('id', allTplIds)
        : Promise.resolve({ data: [] as any[] }),
      getSuggestedActivitiesForContent(contentItem.id, allActIds, allTplIds),
    ])

    setActivities([
      ...(actsRes.data ?? []).map((a: any) => ({
        id: a.id, title: a.title, type_tag: a.type_tag, duration_min: a.duration_min,
        is_template: false, is_mine: a.user_id === user?.id, is_public: !!a.is_public,
      })),
      ...(tplsRes.data ?? []).map((t: any) => ({
        id: t.id, title: t.title, type_tag: t.type_tag, duration_min: t.duration_min,
        is_template: true, is_mine: false, is_public: true,
      })),
    ])
    setSuggestions((sugg as any[]).map(s => ({ ...s, is_mine: false, is_public: false })))
    setLoading(false)
  }

  async function handleCreate() {
    if (!form.title.trim()) { setCreateError('Le titre est requis'); return }
    setCreating(true); setCreateError(null)
    try {
      const { activityId } = await createPrivateActivity(
        planId, contentItem.id, form.title, form.description, form.type_tag,
        form.duration_min ? parseInt(form.duration_min) : null,
        links.filter(l => l.url.trim()),
        form.is_public,
      )
      setActivities(prev => [{
        id: activityId, title: form.title.trim(), type_tag: form.type_tag || null,
        duration_min: form.duration_min ? parseInt(form.duration_min) : null,
        is_template: false, is_mine: true, is_public: form.is_public,
      }, ...prev])
      if (form.is_public) setPublicIds(prev => new Set([...prev, activityId]))
      onPcaAdded?.(activityId)
      setForm({ title: '', description: '', type_tag: '', duration_min: '', is_public: false })
      setLinks([{ url: '', label: '' }])
      setShowCreate(false)
    } catch (err: any) {
      setCreateError(err.message ?? 'Erreur')
    } finally {
      setCreating(false)
    }
  }

  async function handleAddToBank(actId: string) {
    setBankLoading(actId)
    try {
      await addActivityToBank(actId)
      setActivities(prev => prev.map(a => a.id === actId ? { ...a, is_public: true } : a))
      setPublicIds(prev => new Set([...prev, actId]))
    } finally {
      setBankLoading(null)
    }
  }

  function renderActivityRow(act: ActivityEntry, bgClass: string, hoverClass: string, borderHover: string) {
    const actId = act.is_template ? null : act.id
    const tplId = act.is_template ? act.id : null
    const assigned = isAssigned(actId, tplId)
    const isPublicNow = act.is_public || publicIds.has(act.id)
    return (
      <div key={act.id} className="flex items-center gap-2">
        <a
          href={`/dashboard/activities/present/${act.id}`}
          target="_blank" rel="noopener noreferrer"
          className={`flex-1 flex items-center gap-2.5 p-2.5 rounded-xl ${bgClass} border border-transparent ${borderHover} ${hoverClass} transition group min-w-0`}
        >
          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5 flex-wrap mb-0.5">
              {act.is_template && (
                <span className="text-[0.6rem] font-bold px-1.5 py-0.5 rounded-full bg-teal-50 text-teal-600 shrink-0">Causerie</span>
              )}
              {isPublicNow && !act.is_template && (
                <span className="text-[0.6rem] font-bold px-1.5 py-0.5 rounded-full bg-indigo-50 text-indigo-500 shrink-0">Banque</span>
              )}
              <p className="text-sm font-semibold text-gray-800 truncate group-hover:text-indigo-600">{act.title}</p>
            </div>
            {(act.type_tag || act.duration_min) && (
              <p className="text-xs text-gray-400">
                {[act.type_tag, act.duration_min ? `${act.duration_min} min` : null].filter(Boolean).join(' · ')}
              </p>
            )}
          </div>
        </a>
        {act.is_mine && !act.is_template && (
          <button
            onClick={() => handleAddToBank(act.id)}
            disabled={isPublicNow || bankLoading === act.id}
            title={isPublicNow ? 'Déjà dans la banque' : 'Ajouter à la banque publique'}
            className="shrink-0 h-7 px-2 rounded-lg text-[0.65rem] font-bold transition disabled:opacity-50"
            style={isPublicNow
              ? { backgroundColor: '#EEF2FF', color: '#4F46E5' }
              : { backgroundColor: '#F3F4F6', color: '#6B7280' }}
          >
            {bankLoading === act.id ? '…' : isPublicNow ? '✓ Banque' : '→ Banque'}
          </button>
        )}
        <button
          onClick={() => onTogglePca(actId, tplId)}
          title={assigned ? 'Retirer de la planification' : 'Ajouter à la planification'}
          className="shrink-0 w-7 h-7 rounded-full flex items-center justify-center text-sm font-bold transition"
          style={assigned
            ? { backgroundColor: '#EEF2FF', color: '#4F46E5' }
            : { backgroundColor: '#F3F4F6', color: '#9CA3AF' }}
        >
          {assigned ? '✓' : '+'}
        </button>
      </div>
    )
  }

  const selectedActivities = activities.filter(a =>
    isAssigned(a.is_template ? null : a.id, a.is_template ? a.id : null)
  )
  const unselectedActivities = activities.filter(a =>
    !isAssigned(a.is_template ? null : a.id, a.is_template ? a.id : null)
  )
  const filteredSuggestions = suggestions.filter(s =>
    !isAssigned(s.is_template ? null : s.id, s.is_template ? s.id : null)
  )

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-2xl shadow-2xl w-full max-w-md overflow-hidden flex flex-col max-h-[90vh]"
        onClick={e => e.stopPropagation()}
      >
        {/* Header */}
        <div className="px-5 py-4 border-b shrink-0" style={{ backgroundColor: `${accentColor}12` }}>
          <div className="flex items-start justify-between gap-3">
            <div>
              {contentItem.competencies && (
                <p className="text-[0.65rem] font-bold uppercase tracking-wider mb-0.5" style={{ color: accentColor }}>
                  {contentItem.competencies.name_fr}
                </p>
              )}
              <p className="text-sm font-bold text-gray-800 leading-snug">{contentItem.name_fr}</p>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none shrink-0 mt-0.5">×</button>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5 space-y-4">
          {loading ? (
            <p className="text-sm text-gray-400 text-center py-6">Chargement…</p>
          ) : (
            <>
              {/* ── Activités sélectionnées ── */}
              {selectedActivities.length > 0 && (
                <div>
                  <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: accentColor }}>
                    ✓ Activité{selectedActivities.length > 1 ? 's' : ''} sélectionnée{selectedActivities.length > 1 ? 's' : ''}
                  </p>
                  <div className="space-y-1.5">
                    {selectedActivities.map(a =>
                      renderActivityRow(a, 'bg-indigo-50', 'hover:bg-indigo-100', 'hover:border-indigo-200')
                    )}
                  </div>
                </div>
              )}

              {/* ── Activités associées (non sélectionnées) ── */}
              {unselectedActivities.length > 0 && (
                <div>
                  <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Activités associées</p>
                  <div className="space-y-1.5">
                    {unselectedActivities.map(a =>
                      renderActivityRow(a, 'bg-gray-50', 'hover:bg-indigo-50', 'hover:border-indigo-100')
                    )}
                  </div>
                </div>
              )}

              {/* ── Suggestions ── */}
              {filteredSuggestions.length > 0 && (
                <div>
                  <p className="text-xs font-bold text-amber-500 uppercase tracking-wider mb-2">✦ Suggestions</p>
                  <div className="space-y-1.5">
                    {filteredSuggestions.map(a =>
                      renderActivityRow(a, 'bg-amber-50', 'hover:bg-amber-100', 'hover:border-amber-200')
                    )}
                  </div>
                </div>
              )}

              {/* Empty state */}
              {activities.length === 0 && suggestions.length === 0 && !showCreate && (
                <p className="text-sm text-gray-400 text-center py-2">Aucune activité liée à ce contenu.</p>
              )}

              {/* ── Créer une activité privée ── */}
              {!showCreate ? (
                <button
                  onClick={() => setShowCreate(true)}
                  className="w-full text-left text-xs px-4 py-3 rounded-xl border-2 border-dashed border-gray-200 text-gray-400 hover:border-indigo-300 hover:text-indigo-500 transition flex items-center gap-2"
                >
                  <span className="text-sm font-bold">+</span>
                  <span className="font-semibold">Importer une activité privée…</span>
                </button>
              ) : (
                <div className="border border-indigo-100 rounded-2xl overflow-hidden">
                  <div className="px-4 py-3 border-b" style={{ backgroundColor: '#EEF2FF' }}>
                    <p className="text-xs font-bold text-indigo-700">Nouvelle activité privée</p>
                  </div>
                  <div className="px-4 py-3 space-y-2.5">
                    <input
                      type="text"
                      placeholder="Titre *"
                      value={form.title}
                      onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
                      className="w-full text-sm px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-indigo-300"
                    />
                    <div className="flex gap-2">
                      <select
                        value={form.type_tag}
                        onChange={e => setForm(f => ({ ...f, type_tag: e.target.value }))}
                        className="flex-1 text-sm px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-indigo-300 text-gray-600"
                      >
                        <option value="">Type (optionnel)</option>
                        {ACTIVITY_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                      <input
                        type="number"
                        placeholder="Min."
                        value={form.duration_min}
                        onChange={e => setForm(f => ({ ...f, duration_min: e.target.value }))}
                        className="w-20 text-sm px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-indigo-300"
                        min={1}
                      />
                    </div>
                    <textarea
                      placeholder="Description (optionnel)"
                      value={form.description}
                      onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                      rows={2}
                      className="w-full text-sm px-3 py-2 rounded-lg border border-gray-200 focus:outline-none focus:border-indigo-300 resize-none"
                    />

                    {/* Liens */}
                    <div className="space-y-1.5">
                      <p className="text-xs font-semibold text-gray-500">Liens</p>
                      {links.map((lnk, i) => (
                        <div key={i} className="flex gap-1.5 items-center">
                          <input
                            type="url"
                            placeholder="https://…"
                            value={lnk.url}
                            onChange={e => setLinks(prev => prev.map((l, j) => j === i ? { ...l, url: e.target.value } : l))}
                            className="flex-1 text-xs px-2.5 py-1.5 rounded-lg border border-gray-200 focus:outline-none focus:border-indigo-300"
                          />
                          <input
                            type="text"
                            placeholder="Titre lien"
                            value={lnk.label}
                            onChange={e => setLinks(prev => prev.map((l, j) => j === i ? { ...l, label: e.target.value } : l))}
                            className="w-28 text-xs px-2.5 py-1.5 rounded-lg border border-gray-200 focus:outline-none focus:border-indigo-300"
                          />
                          {i > 0 && (
                            <button
                              onClick={() => setLinks(prev => prev.filter((_, j) => j !== i))}
                              className="text-gray-300 hover:text-red-400 transition text-sm px-1 shrink-0"
                            >×</button>
                          )}
                        </div>
                      ))}
                      {links.length < 5 && (
                        <button
                          onClick={() => setLinks(prev => [...prev, { url: '', label: '' }])}
                          className="text-xs text-indigo-400 hover:text-indigo-600 transition font-medium"
                        >
                          + Ajouter un lien
                        </button>
                      )}
                    </div>

                    {/* Ajouter à la banque au moment de la création */}
                    <label className="flex items-center gap-2 cursor-pointer select-none">
                      <input
                        type="checkbox"
                        checked={form.is_public}
                        onChange={e => setForm(f => ({ ...f, is_public: e.target.checked }))}
                        className="rounded border-gray-300 text-indigo-600"
                      />
                      <span className="text-xs text-gray-600 font-medium">Ajouter à la banque publique d'activités</span>
                    </label>

                    {createError && <p className="text-xs text-red-500">{createError}</p>}

                    <div className="flex gap-2 pt-1">
                      <button
                        onClick={() => { setShowCreate(false); setCreateError(null) }}
                        className="flex-1 py-2 rounded-xl text-xs font-semibold text-gray-500 bg-gray-100 hover:bg-gray-200 transition"
                      >
                        Annuler
                      </button>
                      <button
                        onClick={handleCreate}
                        disabled={creating}
                        className="flex-1 py-2 rounded-xl text-xs font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
                        style={{ backgroundColor: '#4F46E5' }}
                      >
                        {creating ? 'Création…' : 'Créer et assigner'}
                      </button>
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Footer — assign button (optional) */}
        {onAssign && assignButtonLabel && (
          <div className="px-5 py-4 shrink-0 border-t">
            <button
              onClick={onAssign}
              className="w-full py-2.5 rounded-xl text-sm font-semibold text-white transition hover:opacity-90"
              style={{ backgroundColor: accentColor }}
            >
              {assignButtonLabel}
            </button>
          </div>
        )}
      </div>
    </div>
  )
}
