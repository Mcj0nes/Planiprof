'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import { updateCells, addCriterion, removeCriterion, addLevel, removeLevel } from './actions'

type Level     = { id: number; code: string; label: string; sort_order: number }
type Criterion = { id: string; label: string; weight: number; sort_order: number }
type Cell      = { id: string; criterion_id: string; level_id: number; descriptor: string }

const LEVEL_COLORS: Record<number, { bg: string; border: string; header: string }> = {
  1: { bg: 'bg-red-50',     border: 'border-red-200',    header: 'bg-red-200' },
  2: { bg: 'bg-yellow-50',  border: 'border-yellow-200', header: 'bg-yellow-100' },
  3: { bg: 'bg-green-50',   border: 'border-green-200',  header: 'bg-green-100' },
  4: { bg: 'bg-green-100',  border: 'border-green-300',  header: 'bg-green-200' },
}

interface GridViewProps {
  levels:     Level[]
  criteria:   Criterion[]
  cells:      Cell[]
  isEditable: boolean
  gridId:     string
}

function CriterionLabel({ label }: { label: string }) {
  const lines = label.split('\n')
  return (
    <div className="leading-snug">
      {lines.map((line, i) => {
        if (i === 0) return <p key={i} className="font-semibold text-gray-800">{line}</p>
        if (line.startsWith('↳')) return <p key={i} className="text-xs text-blue-500 mt-0.5">{line}</p>
        return <p key={i} className="text-xs text-gray-500 italic mt-0.5">{line}</p>
      })}
    </div>
  )
}

export default function GridView({ levels, criteria, cells, isEditable, gridId }: GridViewProps) {
  const router = useRouter()

  const cellMap: Record<string, Record<number, Cell>> = {}
  for (const cell of cells) {
    if (!cellMap[cell.criterion_id]) cellMap[cell.criterion_id] = {}
    cellMap[cell.criterion_id][cell.level_id] = cell
  }

  const [isEditing, setIsEditing]               = useState(false)
  const [edited, setEdited]                     = useState<Record<string, string>>({})
  const [criterionLabels, setCriterionLabels]   = useState<Record<string, string>>({})
  const [newCriterionLabel, setNewCriterionLabel] = useState('')
  const [showAddCriterion, setShowAddCriterion] = useState(false)
  const [newLevelCode, setNewLevelCode]         = useState('')
  const [newLevelLabel, setNewLevelLabel]       = useState('')
  const [showAddLevel, setShowAddLevel]         = useState(false)
  const [saved, setSaved]                       = useState(false)
  const [isPending, startTransition]            = useTransition()

  function getCellValue(criterionId: string, levelId: number): string {
    const cell = cellMap[criterionId]?.[levelId]
    if (!cell) return ''
    return edited[cell.id] !== undefined ? edited[cell.id] : cell.descriptor
  }

  function getCriterionLabel(criterion: Criterion): string {
    return criterionLabels[criterion.id] !== undefined ? criterionLabels[criterion.id] : criterion.label
  }

  function handleSave() {
    const cellUpdates = cells
      .filter(c => edited[c.id] !== undefined)
      .map(c => ({ id: c.id, descriptor: edited[c.id] }))

    const labelUpdates = Object.entries(criterionLabels).map(([id, label]) => ({ id, label }))

    startTransition(async () => {
      await updateCells(gridId, cellUpdates, labelUpdates)
      setSaved(true)
      setIsEditing(false)
      setEdited({})
      setCriterionLabels({})
      setTimeout(() => setSaved(false), 3000)
      router.refresh()
    })
  }

  function handleCancel() {
    setIsEditing(false)
    setEdited({})
    setCriterionLabels({})
    setShowAddCriterion(false)
    setShowAddLevel(false)
    setNewCriterionLabel('')
    setNewLevelCode('')
    setNewLevelLabel('')
  }

  function handleAddCriterion() {
    if (!newCriterionLabel.trim()) return
    startTransition(async () => {
      await addCriterion(gridId, newCriterionLabel.trim())
      setNewCriterionLabel('')
      setShowAddCriterion(false)
      router.refresh()
    })
  }

  function handleRemoveCriterion(criterionId: string) {
    if (!confirm('Supprimer ce critère et tous ses descripteurs ?')) return
    startTransition(async () => {
      await removeCriterion(gridId, criterionId)
      router.refresh()
    })
  }

  function handleAddLevel() {
    if (!newLevelCode.trim() || !newLevelLabel.trim()) return
    startTransition(async () => {
      await addLevel(gridId, newLevelCode.trim(), newLevelLabel.trim())
      setNewLevelCode('')
      setNewLevelLabel('')
      setShowAddLevel(false)
      router.refresh()
    })
  }

  function handleRemoveLevel(levelId: number) {
    if (!confirm('Supprimer cette colonne et tous ses descripteurs ?')) return
    startTransition(async () => {
      await removeLevel(gridId, levelId)
      router.refresh()
    })
  }

  return (
    <div>
      {isEditable && (
        <div className="flex items-center gap-3 mb-5 flex-wrap">
          {!isEditing ? (
            <button
              onClick={() => setIsEditing(true)}
              className="text-sm px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
              Modifier
            </button>
          ) : (
            <>
              <button
                onClick={handleSave}
                disabled={isPending}
                className="text-sm px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition disabled:opacity-60"
              >
                {isPending ? 'Enregistrement...' : 'Enregistrer'}
              </button>
              <button
                onClick={handleCancel}
                disabled={isPending}
                className="text-sm px-4 py-2 border border-gray-200 text-gray-600 rounded-lg hover:bg-gray-50 transition"
              >
                Annuler
              </button>
              <span className="text-gray-300">|</span>
              <button
                onClick={() => { setShowAddCriterion(v => !v); setShowAddLevel(false) }}
                disabled={isPending}
                className="text-sm px-3 py-2 border border-dashed border-blue-300 text-blue-600 rounded-lg hover:bg-blue-50 transition"
              >
                + Critère
              </button>
              <button
                onClick={() => { setShowAddLevel(v => !v); setShowAddCriterion(false) }}
                disabled={isPending}
                className="text-sm px-3 py-2 border border-dashed border-blue-300 text-blue-600 rounded-lg hover:bg-blue-50 transition"
              >
                + Colonne
              </button>
            </>
          )}
          {saved && <span className="text-sm text-green-600">Modifications enregistrées</span>}
        </div>
      )}

      {showAddCriterion && (
        <div className="mb-4 flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-xl p-3">
          <input
            type="text"
            value={newCriterionLabel}
            onChange={e => setNewCriterionLabel(e.target.value)}
            placeholder="Nom du nouveau critère..."
            className="flex-1 text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
            onKeyDown={e => e.key === 'Enter' && handleAddCriterion()}
          />
          <button
            onClick={handleAddCriterion}
            disabled={isPending || !newCriterionLabel.trim()}
            className="text-sm px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition"
          >
            Ajouter
          </button>
          <button
            onClick={() => { setShowAddCriterion(false); setNewCriterionLabel('') }}
            className="text-sm px-3 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
          >
            Annuler
          </button>
        </div>
      )}

      {showAddLevel && (
        <div className="mb-4 flex items-center gap-2 bg-blue-50 border border-blue-200 rounded-xl p-3">
          <input
            type="text"
            value={newLevelCode}
            onChange={e => setNewLevelCode(e.target.value)}
            placeholder="Code (ex : F)"
            className="w-20 text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
          <input
            type="text"
            value={newLevelLabel}
            onChange={e => setNewLevelLabel(e.target.value)}
            placeholder="Libellé (ex : En développement)"
            className="flex-1 text-sm border border-gray-200 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-300"
            onKeyDown={e => e.key === 'Enter' && handleAddLevel()}
          />
          <button
            onClick={handleAddLevel}
            disabled={isPending || !newLevelCode.trim() || !newLevelLabel.trim()}
            className="text-sm px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition"
          >
            Ajouter
          </button>
          <button
            onClick={() => { setShowAddLevel(false); setNewLevelCode(''); setNewLevelLabel('') }}
            className="text-sm px-3 py-2 border border-gray-200 rounded-lg hover:bg-gray-50 transition"
          >
            Annuler
          </button>
        </div>
      )}

      <div className="overflow-x-auto rounded-2xl border border-gray-200 shadow-sm">
        <table className="w-full border-collapse text-sm" style={{ tableLayout: 'auto' }}>
          <thead>
            <tr>
              <th className="text-left p-4 bg-gray-100 border-b border-r border-gray-200 font-semibold text-gray-700 min-w-52">
                Critère
              </th>
              {levels.map(level => {
                const lc = LEVEL_COLORS[level.sort_order]
                return (
                  <th key={level.id} className={`p-4 border-b border-r border-gray-200 font-semibold text-gray-700 min-w-40 text-center last:border-r-0 ${lc?.header ?? 'bg-gray-100'}`}>
                    <span className="block text-base font-bold text-gray-800">{level.code}</span>
                    <span className="block text-xs font-normal text-gray-500 mt-0.5">{level.label}</span>
                    {isEditing && (
                      <button
                        onClick={() => handleRemoveLevel(level.id)}
                        disabled={isPending}
                        title="Supprimer cette colonne"
                        className="mt-1 text-red-400 hover:text-red-600 text-xs disabled:opacity-40"
                      >
                        ✕ supprimer
                      </button>
                    )}
                  </th>
                )
              })}
            </tr>
          </thead>
          <tbody>
            {criteria.map((criterion, idx) => (
              <tr key={criterion.id} className={idx % 2 === 0 ? 'bg-white' : 'bg-gray-50/60'}>
                <td className="p-4 border-b border-r border-gray-200 align-top">
                  {isEditing ? (
                    <div className="flex items-start gap-2">
                      <textarea
                        value={getCriterionLabel(criterion)}
                        onChange={e => setCriterionLabels(prev => ({ ...prev, [criterion.id]: e.target.value }))}
                        className="flex-1 text-sm font-semibold text-gray-800 leading-snug resize-none rounded-lg p-2 border border-blue-300 focus:outline-none focus:ring-1 focus:ring-blue-400 bg-white"
                        rows={2}
                      />
                      <button
                        onClick={() => handleRemoveCriterion(criterion.id)}
                        disabled={isPending}
                        title="Supprimer ce critère"
                        className="mt-1 text-red-400 hover:text-red-600 text-lg leading-none disabled:opacity-40 shrink-0"
                      >
                        ✕
                      </button>
                    </div>
                  ) : (
                    <>
                      <CriterionLabel label={getCriterionLabel(criterion)} />
                      {criterion.weight != null && (
                        <p className="text-xs text-gray-400 mt-1">{criterion.weight}%</p>
                      )}
                    </>
                  )}
                </td>
                {levels.map(level => {
                  const cell  = cellMap[criterion.id]?.[level.id]
                  const value = getCellValue(criterion.id, level.id)
                  const lc    = LEVEL_COLORS[level.sort_order]
                  return (
                    <td key={level.id} className={`p-4 border-b border-r border-gray-200 align-top last:border-r-0 ${!isEditing && lc ? lc.bg : ''}`}>
                      {isEditing && cell ? (
                        <textarea
                          value={value}
                          onChange={e => setEdited(prev => ({ ...prev, [cell.id]: e.target.value }))}
                          className="w-full text-sm text-gray-700 leading-relaxed resize-none rounded-lg p-2 border border-blue-300 focus:outline-none focus:ring-1 focus:ring-blue-400 bg-white"
                          rows={6}
                        />
                      ) : (
                        <p className="text-sm text-gray-700 leading-relaxed whitespace-pre-wrap">{value}</p>
                      )}
                    </td>
                  )
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {levels.some(l => LEVEL_COLORS[l.sort_order]) && (
        <div className="mt-4 flex flex-wrap gap-3">
          {levels.filter(l => LEVEL_COLORS[l.sort_order]).map(level => {
            const lc = LEVEL_COLORS[level.sort_order]!
            return (
              <div key={level.id} className={`flex items-center gap-2 px-3 py-1.5 rounded-full border ${lc.bg} ${lc.border}`}>
                <span className="text-xs font-semibold text-gray-700">{level.code}</span>
                <span className="text-xs text-gray-600">{level.label}</span>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
