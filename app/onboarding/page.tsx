import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Image from 'next/image'
import { Nunito } from 'next/font/google'
import OnboardingForm from './OnboardingForm'

const nunito = Nunito({ subsets: ['latin'], weight: ['400', '700', '800'] })

export default async function OnboardingPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const { data: profile } = await supabase
    .from('profiles')
    .select('collaboration_mode')
    .eq('id', user.id)
    .single()

  if (profile?.collaboration_mode) redirect('/dashboard')

  return (
    <main className={`${nunito.className} min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center px-4`}>
      <div className="max-w-2xl w-full">
        <div className="text-center mb-10">
          <div className="flex flex-col items-center mb-6">
            <Image src="/logo.png" alt="Planiprof" width={384} height={384} className="h-96 w-96 rounded-full object-cover" />
          </div>
          <h1 className="text-4xl font-extrabold text-gray-800 mb-3">Bienvenue sur Planiprof ✨</h1>
          <p className="text-gray-500 text-lg">Comment souhaitez-vous utiliser l&apos;application ?</p>
        </div>
        <OnboardingForm />
      </div>
    </main>
  )
}