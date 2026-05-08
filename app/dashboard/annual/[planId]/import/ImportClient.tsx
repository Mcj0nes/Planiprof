'use client'

import { useState, useRef } from 'react'
import Link from 'next/link'
import { parseImportFile, confirmImport, type ImportRow, type ParseResult } from './actions'

const MODEL_LABELS: Record<string, string> = {
  mensuel:    'Planification mensuelle',
  'par-etape': 'Par étape',
  'par-theme': 'Par thème/projet',
}

const MONTH_NAMES: Record<string, string> = {
  '8': 'Août', '9': 'Septembre', '10': 'Octobre', '11': 'Novembre', '12': 'Décembre',
  '1': 'Janvier', '2': 'Février', '3': 'Mars', '4': 'Avril', '5': 'Mai', '6': 'Juin',
}

function groupRows(rows: ImportRow[], model: string, themeMap: Record<string, string>) {
  const groups = new Map<string, ImportRow[]>()
  for (const row of rows.filter(r => r.valid)) {
    let key = row.value
    if (model === 'mensuel') key = MONTH_NAMES[row.value] ?? row.value
    else if (model === 'par-etape') key = `Étape ${row.value}`
    if (!groups.has(key)) groups.set(key, [])
    groups.get(key)!.push(row)
  }
  return groups
}

type Props = {
  planId: string
  planLabel: string
  model: string
}

export default function ImportClient({ planId, planLabel, model }: Props) {
  const [step, setStep] = useState<'upload' | 'preview' | 'done'>('upload')
  const [result, setResult] = useState<ParseResult | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [importedCount, setImportedCount] = useState(0)
  const fileRef = useRef<HTMLInputElement>(null)

  async function handleAnalyze(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const file = fileRef.current?.files?.[0]
    if (!file) { setError('Sélectionnez un fichier .xlsx'); return }
    setLoading(true); setError(null)
    try {
      const fd = new FormData()
      fd.append('file', file)
      const res = await parseImportFile(planId, fd)
      if (res.rows.length === 0) { setError('Aucune ligne avec une valeur trouvée dans le fichier.'); setLoading(false); return }
      setResult(res)
      setStep('preview')
    } catch (err: any) {
      setError(err.message ?? 'Erreur lors de la lecture du fichier')
    } finally {
      setLoading(false)
    }
  }

  async function handleConfirm() {
    if (!result) return
    setLoading(true); setError(null)
    try {
      const { count } = await confirmImport(planId, result.rows, result.model, result.themeMap)
      setImportedCount(count)
      setStep('done')
    } catch (err: any) {
      setError(err.message ?? 'Erreur lors de l\'importation')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-3xl mx-auto px-6 py-8">

      {/* Step indicators */}
      <div className="flex items-center gap-3 mb-8">
        {(['upload', 'preview', 'done'] as const).map((s, i) => {
          const labels = ['1. Gabarit & fichier', '2. Aperçu', '3. Terminé']
          const active = s === step
          const done   = (['upload', 'preview', 'done'].indexOf(step) > i)
          return (
            <div key={s} className="flex items-center gap-2">
              {i > 0 && <div className="w-8 h-px bg-gray-200" />}
              <span className={`text-sm font-semibold px-3 py-1 rounded-full transition ${
                active ? 'bg-indigo-600 text-white' : done ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-400'
              }`}>
                {done && !active ? '✓ ' : ''}{labels[i]}
              </span>
            </div>
          )
        })}
      </div>

      {/* ── Step 1: download template + upload ──────────────────────── */}
      {step === 'upload' && (
        <div className="space-y-6">
          {/* Download */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b" style={{ backgroundColor: '#EEF2FF' }}>
              <p className="font-bold text-indigo-800">Étape 1 — Télécharger le gabarit</p>
            </div>
            <div className="px-6 py-5">
              <p className="text-sm text-gray-600 mb-4">
                Télécharge ce fichier Excel pré-rempli avec tous les contenus du programme.
                Remplis la colonne <strong>«{model === 'mensuel' ? 'Mois' : model === 'par-etape' ? 'Étape' : 'Thème'}»</strong> pour chaque contenu que tu veux planifier,
                puis remets le fichier ici.
              </p>
              <a
                href={`/api/annual/${planId}/template`}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold text-white transition hover:opacity-90"
                style={{ backgroundColor: '#4F46E5' }}
                download
              >
                ⬇ Télécharger le gabarit Excel
              </a>
              <p className="mt-3 text-xs text-gray-400">
                Modèle : {MODEL_LABELS[model] ?? model} · {planLabel}
              </p>
            </div>
          </div>

          {/* Upload */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="px-6 py-4 border-b" style={{ backgroundColor: '#F0FDF4' }}>
              <p className="font-bold text-green-800">Étape 2 — Importer le fichier rempli</p>
            </div>
            <form onSubmit={handleAnalyze} className="px-6 py-5 space-y-4">
              <div
                className="border-2 border-dashed border-gray-200 rounded-xl p-6 text-center hover:border-indigo-300 transition cursor-pointer"
                onClick={() => fileRef.current?.click()}
              >
                <p className="text-3xl mb-2">📂</p>
                <p className="text-sm font-medium text-gray-600">Cliquer pour choisir un fichier .xlsx</p>
                <p className="text-xs text-gray-400 mt-1">Uniquement le gabarit téléchargé ci-dessus</p>
                <input
                  ref={fileRef}
                  type="file"
                  name="file"
                  accept=".xlsx"
                  className="hidden"
                  onChange={() => setError(null)}
                />
              </div>

              {error && (
                <div className="px-4 py-3 rounded-xl bg-red-50 text-red-700 text-sm">{error}</div>
              )}

              <button
                type="submit"
                disabled={loading}
                className="w-full py-3 rounded-xl text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-50"
                style={{ backgroundColor: '#059669' }}
              >
                {loading ? 'Analyse en cours…' : 'Analyser le fichier →'}
              </button>
            </form>
          </div>
        </div>
      )}

      {/* ── Step 2: Preview ─────────────────────────────────────────── */}
      {step === 'preview' && result && (
        <div className="space-y-5">
          {/* Summary */}
          <div className="flex gap-4">
            <div className="flex-1 bg-green-50 rounded-2xl px-5 py-4 border border-green-100">
              <p className="text-2xl font-bold text-green-700">{result.validCount}</p>
              <p className="text-xs font-semibold text-green-600 mt-0.5">contenus à importer</p>
            </div>
            {result.invalidCount > 0 && (
              <div className="flex-1 bg-red-50 rounded-2xl px-5 py-4 border border-red-100">
                <p className="text-2xl font-bold text-red-600">{result.invalidCount}</p>
                <p className="text-xs font-semibold text-red-500 mt-0.5">lignes invalides (ignorées)</p>
              </div>
            )}
          </div>

          {/* Invalid rows */}
          {result.invalidCount > 0 && (
            <div className="bg-red-50 border border-red-100 rounded-2xl overflow-hidden">
              <div className="px-5 py-3 border-b border-red-100">
                <p className="text-sm font-bold text-red-700">Lignes ignorées</p>
              </div>
              <div className="divide-y divide-red-100 max-h-40 overflow-y-auto">
                {result.rows.filter(r => !r.valid).map((row, i) => (
                  <div key={i} className="px-5 py-2 flex items-center gap-3">
                    <span className="text-xs text-red-500 shrink-0">✕</span>
                    <span className="text-xs text-gray-700 flex-1 truncate">{row.content_name}</span>
                    <span className="text-xs text-red-500">{row.error}</span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Valid rows grouped */}
          {result.validCount > 0 && (
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
              <div className="px-5 py-3 border-b bg-gray-50">
                <p className="text-sm font-bold text-gray-700">Aperçu de l'import</p>
              </div>
              <div className="max-h-80 overflow-y-auto divide-y divide-gray-50">
                {[...groupRows(result.rows, result.model, result.themeMap).entries()].map(([groupLabel, rows]) => (
                  <div key={groupLabel}>
                    <div className="px-5 py-2 bg-indigo-50">
                      <p className="text-xs font-bold text-indigo-700">{groupLabel}</p>
                    </div>
                    {rows.map((row, i) => (
                      <div key={i} className="px-5 py-2 flex items-center gap-2">
                        <span className="text-xs text-green-500 shrink-0">✓</span>
                        <span className="text-xs text-gray-400 shrink-0">{row.competency_name.split('—')[0].trim()}</span>
                        <span className="text-xs text-gray-700 flex-1">{row.content_name}</span>
                      </div>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          )}

          {error && (
            <div className="px-4 py-3 rounded-xl bg-red-50 text-red-700 text-sm">{error}</div>
          )}

          <div className="flex gap-3">
            <button
              onClick={() => { setStep('upload'); setResult(null) }}
              className="flex-1 py-3 rounded-xl text-sm font-semibold text-gray-600 bg-gray-100 hover:bg-gray-200 transition"
            >
              ← Recommencer
            </button>
            <button
              onClick={handleConfirm}
              disabled={loading || result.validCount === 0}
              className="flex-1 py-3 rounded-xl text-sm font-semibold text-white transition hover:opacity-90 disabled:opacity-40"
              style={{ backgroundColor: '#4F46E5' }}
            >
              {loading ? 'Importation…' : `Importer ${result.validCount} contenu${result.validCount > 1 ? 's' : ''}`}
            </button>
          </div>
        </div>
      )}

      {/* ── Step 3: Done ────────────────────────────────────────────── */}
      {step === 'done' && (
        <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden text-center py-12 px-8">
          <p className="text-4xl mb-3">🎉</p>
          <p className="text-xl font-bold text-gray-800 mb-1">Import réussi!</p>
          <p className="text-sm text-gray-500 mb-6">
            {importedCount} contenu{importedCount > 1 ? 's' : ''} ajouté{importedCount > 1 ? 's' : ''} à ta planification.
          </p>
          <Link
            href={`/dashboard/annual/${planId}`}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl text-sm font-semibold text-white transition hover:opacity-90"
            style={{ backgroundColor: '#4F46E5' }}
          >
            Voir ma planification →
          </Link>
        </div>
      )}
    </div>
  )
}
