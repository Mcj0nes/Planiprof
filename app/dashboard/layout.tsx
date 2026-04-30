import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = await createClient()
  // getSession reads from the cookie only — no network round-trip, fine for this UX gate
  const { data: { session } } = await supabase.auth.getSession()
  if (!session) redirect('/login')

  const { data: profile, error } = await supabase
    .from('profiles')
    .select('collaboration_mode')
    .eq('id', session.user.id)
    .single()

  // Only gate if the column exists and the mode hasn't been set yet
  if (!error && !profile?.collaboration_mode) redirect('/onboarding')

  return <>{children}</>
}