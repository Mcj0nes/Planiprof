'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter } from 'next/navigation'
import Link from 'next/link'

export default function SignupPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [error, setError] = useState('')
  const [success, setSuccess] = useState(false)
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const supabase = createClient()

  async function handleSignup(e: React.FormEvent) {
    e.preventDefault()
    if (password !== confirm) {
      setError('Les mots de passe ne correspondent pas. / Passwords do not match.')
      return
    }
    setLoading(true)
    setError('')

    const { error } = await supabase.auth.signUp({ email, password })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      setSuccess(true)
    }
  }

  if (success) {
    return (
      <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
        <div className="bg-white rounded-2xl shadow-sm p-8 w-full max-w-md text-center">
          <div className="text-5xl mb-4">✉️</div>
          <h2 className="text-xl font-bold text-indigo-700 mb-2">Vérifiez votre courriel!</h2>
          <p className="text-gray-500">Check your email to confirm your account, then log in.</p>
          <Link href="/login" className="mt-6 inline-block text-indigo-600 font-medium hover:underline">
            Aller à la connexion →
          </Link>
        </div>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-sm p-8 w-full max-w-md">
        <h1 className="text-2xl font-bold text-indigo-700 mb-1">Créer un compte</h1>
        <p className="text-gray-500 mb-6">Sign up for Planiprof</p>

        <form onSubmit={handleSignup} className="flex flex-col gap-4">
          <input
            type="email"
            placeholder="Courriel / Email"
            value={email}
            onChange={e => setEmail(e.target.value)}
            required
            className="border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-300"
          />
          <input
            type="password"
            placeholder="Mot de passe / Password"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            className="border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-300"
          />
          <input
            type="password"
            placeholder="Confirmer le mot de passe / Confirm password"
            value={confirm}
            onChange={e => setConfirm(e.target.value)}
            required
            className="border border-gray-200 rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-300"
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            disabled={loading}
            className="bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 transition disabled:opacity-50"
          >
            {loading ? 'Création...' : 'Créer un compte / Sign up'}
          </button>
        </form>

        <p className="text-center text-gray-500 mt-6 text-sm">
          Déjà un compte?{' '}
          <Link href="/login" className="text-indigo-600 font-medium hover:underline">
            Se connecter
          </Link>
        </p>
        <p className="text-center mt-2">
          <Link href="/" className="text-gray-400 text-sm hover:underline">← Retour</Link>
        </p>
      </div>
    </main>
  )
}
