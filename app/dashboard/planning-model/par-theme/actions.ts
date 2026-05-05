'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export type ThemeConfigInput = {
  id: string | null
  name: string
  start_date: string
  end_date: string
  sort_order: number
}

export async function saveThemeConfigs(schoolYear: string, themes: ThemeConfigInput[]) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Non authentifié')

  const rows = themes.map((t, i) => ({
    user_id: user.id,
    school_year: schoolYear,
    sort_order: i,
    name: t.name,
    start_date: t.start_date,
    end_date: t.end_date,
  }))

  await supabase
    .from('theme_configs')
    .upsert(rows, { onConflict: 'user_id,school_year,sort_order' })

  revalidatePath('/dashboard/planning-model/par-theme')
}
