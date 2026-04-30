'use client'

import { useState } from 'react'
import Image from 'next/image'
import { Nunito } from 'next/font/google'
import { completeOnboarding } from './actions'

const nunito = Nunito({ subsets: ['latin'], weight: ['400', '700', '800'] })

export default function OnboardingForm() {
  const [mode, setMode] = useState<'individual' | 'collaborative' | null>(null)
  const [emails, setEmails] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleSubmit() {
    if (!mode) return
    setLoading(true)
    const emailList = mode === 'collaborative'
      ? emails.split(/[\n,;]+/).map(e => e.trim()).filter(Boolean)
      : []
    await completeOnboarding(mode, emailList)
  }

  return (
    <div className={`${nunito.className} space-y-4`}>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <button
          onClick={() => setMode('individual')}
          className={`rounded-2xl p-8 text-left border-2 transition-all cursor-pointer ${
            mode === 'individual'
              ? 'border-blue-700 bg-blue-700'
              : 'border-blue-400 bg-blue-500 hover:bg-blue-600 hover:border-blue-600'
          }`}
        >
          <div className="mb-3">
            <Image src="/Individuelle.png" alt="Individuelle" width={144} height={144} className="h-36 w-36 object-contain" />
          </div>
          <h2 className="text-4xl font-bold mb-2 text-white">Individuelle</h2>
          <p className={`text-sm ${mode === 'individual' ? 'text-blue-100' : 'text-blue-100'}`}>Utilisez Planiprof pour votre propre planification. Vos données restent privées.</p>
        </button>

        <button
          onClick={() => setMode('collaborative')}
          className={`rounded-2xl p-8 text-left border-2 transition-all cursor-pointer ${
            mode === 'collaborative'
              ? 'border-blue-700 bg-blue-700'
              : 'border-blue-400 bg-blue-500 hover:bg-blue-600 hover:border-blue-600'
          }`}
        >
          <div className="mb-3">
            <Image src="/collaborative.png" alt="Collaborative" width={144} height={144} className="h-36 w-36 object-contain" />
          </div>
          <h2 className="text-4xl font-bold mb-2 text-white">Collaborative</h2>
          <p className="text-sm text-blue-100">Partagez votre planification globale et mensuelle avec des collègues.</p>
        </button>
      </div>

      {mode === 'collaborative' && (
        <div className="bg-white rounded-2xl border border-gray-200 p-6">
          <label className="block text-sm font-semibold text-gray-700 mb-2">
            Courriels des collaborateurs
          </label>
          <textarea
            value={emails}
            onChange={e => setEmails(e.target.value)}
            placeholder="collaborateur@ecole.qc.ca&#10;collegue@csxx.qc.ca"
            rows={4}
            className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-300"
          />
          <p className="text-xs text-gray-400 mt-1">Séparez par une virgule, un point-virgule ou un retour à la ligne. Vous pourrez en ajouter d&apos;autres plus tard.</p>
        </div>
      )}

      {mode && (
        <button
          onClick={handleSubmit}
          disabled={loading}
          className="w-full bg-blue-600 text-white rounded-xl py-3 font-semibold hover:bg-blue-700 transition disabled:opacity-50"
        >
          {loading ? 'En cours...' : 'Continuer'}
        </button>
      )}
    </div>
  )
}