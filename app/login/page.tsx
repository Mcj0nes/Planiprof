'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Suspense } from 'react'

function LoginForm() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()
  const searchParams = useSearchParams()
  const supabase = createClient()

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setError('')

    const { error } = await supabase.auth.signInWithPassword({ email, password })

    if (error) {
      setError(error.message)
      setLoading(false)
    } else {
      const next = searchParams.get('next')
      router.push(next ?? '/dashboard')
    }
  }

  return (
    <form onSubmit={handleLogin} className="flex flex-col gap-4">
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
      {error && <p className="text-red-500 text-sm">{error}</p>}
      <button
        type="submit"
        disabled={loading}
        className="bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 transition disabled:opacity-50"
      >
        {loading ? 'Connexion...' : 'Se connecter / Log in'}
      </button>
    </form>
  )
}

export default function LoginPage() {
  return (
    <main className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4">
      <div className="bg-white rounded-2xl shadow-sm p-8 w-full max-w-md">
        <div className="flex flex-col items-center mb-6">
          <Image src="/logo.png" alt="Planiprof" width={384} height={384} className="h-96 w-96 rounded-full object-cover" />
          <span className="text-xl font-bold text-indigo-700 mt-2">Planiprof</span>
        </div>
        <h1 className="text-2xl font-bold text-indigo-700 mb-1">Se connecter</h1>
        <p className="text-gray-500 mb-6">Log in to Planiprof</p>

        <Suspense>
          <LoginForm />
        </Suspense>

        <p className="text-center text-gray-500 mt-6 text-sm">
          Pas encore de compte?{' '}
          <Link href="/signup" className="text-indigo-600 font-medium hover:underline">
            Créer un compte
          </Link>
        </p>
        <p className="text-center mt-2">
          <Link href="/" className="text-gray-400 text-sm hover:underline">&#x2190; Retour</Link>
        </p>
      </div>
    </main>
  )
}