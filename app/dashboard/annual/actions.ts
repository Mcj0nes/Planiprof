'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function deletePlan(planId: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Non authentifié')

  await supabase
    .from('annual_plans')
    .delete()
    .eq('id', planId)
    .eq('user_id', user.id)

  revalidatePath('/dashboard/annual')
}
