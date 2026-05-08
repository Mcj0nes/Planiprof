'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'
import * as XLSX from 'xlsx'

export type ImportRow = {
  content_item_id: number
  content_name: string
  competency_name: string
  value: string
  valid: boolean
  error?: string
}

export type ParseResult = {
  rows: ImportRow[]
  model: string
  themeMap: Record<string, string>
  validCount: number
  invalidCount: number
}

export async function parseImportFile(
  planId: string,
  formData: FormData,
): Promise<ParseResult> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Non authentifié')

  const { data: plan } = await supabase
    .from('annual_plans')
    .select('id, school_year, planning_model')
    .eq('id', planId)
    .eq('user_id', user.id)
    .single()
  if (!plan) throw new Error('Planification non trouvée')

  const file = formData.get('file') as File | null
  if (!file) throw new Error('Aucun fichier fourni')

  const model = (plan as any).planning_model ?? 'mensuel'

  // Build theme map if needed
  let themeMap: Record<string, string> = {}
  if (model === 'par-theme') {
    const { data: themes } = await supabase
      .from('theme_configs')
      .select('id, name')
      .eq('user_id', user.id)
      .eq('school_year', (plan as any).school_year)
    for (const t of themes ?? []) themeMap[t.name] = t.id
  }

  const arrayBuffer = await file.arrayBuffer()
  const wb = XLSX.read(new Uint8Array(arrayBuffer), { type: 'array' })
  const ws = wb.Sheets[wb.SheetNames[0]]
  const raw = XLSX.utils.sheet_to_json(ws, { header: 1, defval: '' }) as any[][]

  // Row 0 = headers, Row 1 = hint, Row 2+ = data
  const rows: ImportRow[] = []
  const VALID_MONTHS = new Set([8, 9, 10, 11, 12, 1, 2, 3, 4, 5, 6])

  for (let i = 2; i < raw.length; i++) {
    const row = raw[i]
    const id = row[0]
    const competencyName = String(row[1] ?? '').trim()
    const contentName    = String(row[2] ?? '').trim()
    const value          = String(row[3] ?? '').trim()

    if (!id || !value) continue

    let valid = true
    let error: string | undefined

    if (model === 'par-etape') {
      const n = parseInt(value)
      if (![1, 2, 3].includes(n)) { valid = false; error = `Étape invalide: «${value}» — attendu 1, 2 ou 3` }
    } else if (model === 'par-theme') {
      if (!themeMap[value]) { valid = false; error = `Thème introuvable: «${value}»` }
    } else {
      const n = parseInt(value)
      if (!VALID_MONTHS.has(n)) { valid = false; error = `Mois invalide: «${value}» — attendu 8–12 ou 1–6` }
    }

    rows.push({ content_item_id: Number(id), content_name: contentName, competency_name: competencyName, value, valid, error })
  }

  return {
    rows,
    model,
    themeMap,
    validCount: rows.filter(r => r.valid).length,
    invalidCount: rows.filter(r => !r.valid).length,
  }
}

export async function confirmImport(
  planId: string,
  rows: ImportRow[],
  model: string,
  themeMap: Record<string, string>,
): Promise<{ count: number }> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Non authentifié')

  const validRows = rows.filter(r => r.valid)
  const assignments: any[] = []

  for (const row of validRows) {
    if (model === 'par-etape') {
      assignments.push({
        annual_plan_id: planId,
        content_item_id: row.content_item_id,
        etape_number: parseInt(row.value),
        month: null,
        theme_id: null,
      })
    } else if (model === 'par-theme') {
      assignments.push({
        annual_plan_id: planId,
        content_item_id: row.content_item_id,
        theme_id: themeMap[row.value],
        month: null,
        etape_number: null,
      })
    } else {
      assignments.push({
        annual_plan_id: planId,
        content_item_id: row.content_item_id,
        month: parseInt(row.value),
        etape_number: null,
        theme_id: null,
      })
    }
  }

  if (assignments.length > 0) {
    await supabase.from('plan_assignments').insert(assignments)
  }

  revalidatePath(`/dashboard/annual/${planId}`)
  return { count: assignments.length }
}
