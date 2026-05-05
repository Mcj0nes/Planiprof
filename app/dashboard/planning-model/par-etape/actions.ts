'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export type EtapeConfigInput = {
  etape_number: 1 | 2 | 3
  start_date: string
  end_date: string
}

export async function saveEtapeConfigs(schoolYear: string, configs: EtapeConfigInput[]) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Non authentifié')

  const rows = configs.map(c => ({
    user_id: user.id,
    school_year: schoolYear,
    etape_number: c.etape_number,
    start_date: c.start_date,
    end_date: c.end_date,
  }))

  await supabase
    .from('etape_configs')
    .upsert(rows, { onConflict: 'user_id,school_year,etape_number' })

  revalidatePath('/dashboard/planning-model/par-etape')
}
