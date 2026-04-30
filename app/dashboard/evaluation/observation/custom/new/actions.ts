'use server'

import { createClient } from '@/lib/supabase/server'

export type Criterion = { key: string; label: string; description: string }

export async function createDefinition(data: {
  title: string
  subjectId: string
  gradeLevelId: string
  criteria: Omit<Criterion, 'key'>[]
}): Promise<{ id: string } | { error: string }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return { error: 'Non authentifié.' }

  const criteria: Criterion[] = data.criteria.map(c => ({
    key:         crypto.randomUUID(),
    label:       c.label.trim(),
    description: c.description.trim(),
  }))

  const { data: def, error } = await supabase
    .from('custom_obs_definitions')
    .insert({
      user_id:        user.id,
      title:          data.title.trim(),
      subject_id:     data.subjectId ? Number(data.subjectId) : null,
      grade_level_id: data.gradeLevelId ? Number(data.gradeLevelId) : null,
      criteria,
    })
    .select('id')
    .single()

  if (error) return { error: error.message }
  return { id: def.id }
}
