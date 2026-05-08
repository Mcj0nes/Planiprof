import { NextResponse } from 'next/server'
import { createClient } from '@/lib/supabase/server'
import * as XLSX from 'xlsx'

const MONTH_LEGEND = [
  [8, 'Août'], [9, 'Septembre'], [10, 'Octobre'], [11, 'Novembre'], [12, 'Décembre'],
  [1, 'Janvier'], [2, 'Février'], [3, 'Mars'], [4, 'Avril'], [5, 'Mai'], [6, 'Juin'],
]

export async function GET(
  _req: Request,
  { params }: { params: Promise<{ planId: string }> },
) {
  const { planId } = await params
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return new NextResponse('Unauthorized', { status: 401 })

  const { data: plan } = await supabase
    .from('annual_plans')
    .select('id, school_year, subject_id, grade_level_id, planning_model, subjects(name_fr), grade_levels(label_fr)')
    .eq('id', planId)
    .eq('user_id', user.id)
    .single()
  if (!plan) return new NextResponse('Not found', { status: 404 })

  const model = (plan as any).planning_model ?? 'mensuel'

  let contentQuery = supabase
    .from('content_items')
    .select('id, name_fr, sort_order, competency_id, competencies(id, name_fr, sort_order)')
    .eq('grade_level_id', plan.grade_level_id)
    .order('sort_order')
  if (plan.subject_id) contentQuery = contentQuery.eq('competencies.subject_id', plan.subject_id)

  const { data: contentItems } = await contentQuery

  const wb = XLSX.utils.book_new()

  // ── Main sheet ──────────────────────────────────────────────────────────────
  let valueHeader = 'Mois (chiffre : 9=sept, 10=oct…)'
  let valueHint   = ''
  if (model === 'par-etape') {
    valueHeader = 'Étape (1, 2 ou 3)'
    valueHint   = 'Inscrire 1, 2 ou 3 → voir feuille «Étapes»'
  } else if (model === 'par-theme') {
    valueHeader = 'Thème (nom exact)'
    valueHint   = 'Copier le nom exact depuis la feuille «Thèmes»'
  }

  const headers = ['__id', 'Compétence', 'Contenu', valueHeader]
  const hintRow  = ['', '(ne pas modifier)', '(ne pas modifier)', valueHint]
  const dataRows = (contentItems ?? []).map(item => [
    item.id,
    (item.competencies as any)?.name_fr ?? '',
    item.name_fr,
    '',
  ])

  const ws = XLSX.utils.aoa_to_sheet([headers, hintRow, ...dataRows])
  ws['!cols'] = [{ hidden: true }, { wch: 36 }, { wch: 46 }, { wch: 28 }]

  // Style header row (bold) — SheetJS CE supports limited styling
  XLSX.utils.book_append_sheet(wb, ws, 'Planification')

  // ── Legend sheet ────────────────────────────────────────────────────────────
  if (model === 'par-etape') {
    const { data: etapeConfigs } = await supabase
      .from('etape_configs')
      .select('etape_number, start_date, end_date')
      .eq('user_id', user.id)
      .eq('school_year', plan.school_year)
      .order('etape_number')

    const rows = [
      ['Valeur à inscrire', 'Étape', 'Début', 'Fin'],
      ...(etapeConfigs ?? []).map(e => [e.etape_number, `Étape ${e.etape_number}`, e.start_date, e.end_date]),
    ]
    if (!etapeConfigs?.length) {
      rows.push([1, 'Étape 1', '—', '—'])
      rows.push([2, 'Étape 2', '—', '—'])
      rows.push([3, 'Étape 3', '—', '—'])
    }
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(rows), 'Étapes')

  } else if (model === 'par-theme') {
    const { data: themeConfigs } = await supabase
      .from('theme_configs')
      .select('name, start_date, end_date, sort_order')
      .eq('user_id', user.id)
      .eq('school_year', plan.school_year)
      .order('sort_order')

    const rows = [
      ['Valeur à inscrire (nom exact)', 'Début', 'Fin'],
      ...(themeConfigs ?? []).map(t => [t.name, t.start_date, t.end_date]),
    ]
    XLSX.utils.book_append_sheet(wb, XLSX.utils.aoa_to_sheet(rows), 'Thèmes')

  } else {
    XLSX.utils.book_append_sheet(
      wb,
      XLSX.utils.aoa_to_sheet([['Chiffre', 'Mois'], ...MONTH_LEGEND]),
      'Légende des mois',
    )
  }

  const buf = XLSX.write(wb, { type: 'buffer', bookType: 'xlsx' })
  const subjectName = (plan.subjects as any)?.name_fr ?? 'planification'
  const filename = `gabarit-${subjectName.toLowerCase().replace(/\s+/g, '-')}-${plan.school_year}.xlsx`

  return new NextResponse(buf, {
    headers: {
      'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'Content-Disposition': `attachment; filename="${filename}"`,
    },
  })
}
