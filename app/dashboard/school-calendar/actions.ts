'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export type CalendarEvent = {
  id: string
  school_year: string
  event_date: string
  event_type: string
  label: string
}

export async function getCalendarEvents(schoolYear: string): Promise<CalendarEvent[]> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data } = await supabase
    .from('school_calendar_events')
    .select('id, school_year, event_date, event_type, label')
    .eq('user_id', user.id)
    .eq('school_year', schoolYear)
    .order('event_date')

  return (data ?? []) as CalendarEvent[]
}

export async function getCalendarEventsInRange(
  startDate: string,
  endDate: string,
): Promise<CalendarEvent[]> {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return []

  const { data } = await supabase
    .from('school_calendar_events')
    .select('id, school_year, event_date, event_type, label')
    .eq('user_id', user.id)
    .gte('event_date', startDate)
    .lte('event_date', endDate)
    .order('event_date')

  return (data ?? []) as CalendarEvent[]
}

export async function addCalendarEvent(
  schoolYear: string,
  eventDate: string,
  eventType: string,
  label: string,
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Non authentifié')

  await supabase.from('school_calendar_events').insert({
    user_id: user.id,
    school_year: schoolYear,
    event_date: eventDate,
    event_type: eventType,
    label,
  })

  revalidatePath('/dashboard/school-calendar')
}

export async function deleteCalendarEvent(id: string) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Non authentifié')

  await supabase.from('school_calendar_events').delete()
    .eq('id', id).eq('user_id', user.id)

  revalidatePath('/dashboard/school-calendar')
}

export async function importParsedEvents(
  events: { event_date: string; event_type: string; label: string }[],
  schoolYear: string,
) {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Non authentifié')
  if (events.length === 0) return

  await supabase.from('school_calendar_events').insert(
    events.map(e => ({ user_id: user.id, school_year: schoolYear, ...e }))
  )

  revalidatePath('/dashboard/school-calendar')
}

// ─── PDF parsing ─────────────────────────────────────────────────────────────

function norm(text: string): string {
  return text.toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').trim()
}

const MONTH_MAP: Record<string, number> = {
  janvier: 1,  jan: 1,
  fevrier: 2,  fev: 2,
  mars: 3,
  avril: 4,    avr: 4,
  mai: 5,
  juin: 6,
  juillet: 7,  juil: 7,
  aout: 8,
  septembre: 9, sept: 9, sep: 9,
  octobre: 10, oct: 10,
  novembre: 11, nov: 11,
  decembre: 12, dec: 12,
}

// Abbreviated day names used in Quebec school calendars
const DAY_ABBR = 'lu|ma|me|je|ve|sa|di|lun|mar|mer|jeu|ven|sam|dim|lundi|mardi|mercredi|jeudi|vendredi|samedi|dimanche'
// Ordinal suffix for day 1: 1er, 1re; other days may have e/ième
const ORD = '(?:er|re|ieme|ieme|e)?'

function findMonth(word: string): number | undefined {
  const w = norm(word).replace(/\.$/, '')
  for (const [key, val] of Object.entries(MONTH_MAP)) {
    if (w === key || w.startsWith(key) || key.startsWith(w)) return val
  }
  return undefined
}

function classifyEvent(text: string): string {
  const t = norm(text)
  if (/\b(conge|ferie|fete nationale|vacances|relache|aucun service|action de grace|noel|paques|toussaint|construction|victoria|canada|saint-jean|action)\b/.test(t)) return 'conge'
  if (/\b(pedagogique|pedagog|journee de formation|formation continue|perfectionnement)\b/.test(t)) return 'journee_pedagogique'
  if (/\b(rencontre|parents?|bulletin|soiree|remise de bulletin|remise des bulletins)\b/.test(t)) return 'rencontre_parents'
  if (/\b(rentree|debut (de l.)?etape|debut etape|premier jour|debut de l.annee)\b/.test(t)) return 'debut_etape'
  if (/\b(fin (de l.)?etape|fin etape|cloture|dernier jour|fin de l.annee)\b/.test(t)) return 'fin_etape'
  if (/\b(examen|evaluation|bilan|composition)\b/.test(t)) return 'examen'
  return 'autre'
}

function fmtDate(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}-${String(date.getDate()).padStart(2, '0')}`
}

function datesInRange(start: Date, end: Date): Date[] {
  const dates: Date[] = []
  const cur = new Date(start)
  while (cur <= end) { dates.push(new Date(cur)); cur.setDate(cur.getDate() + 1) }
  return dates
}

// ─── Legend parsing ──────────────────────────────────────────────────────────

type LegendEntry = { description: string; eventType: string }

function parseLegend(lines: string[]): Map<string, LegendEntry> {
  const legend = new Map<string, LegendEntry>()
  let inLegend = false

  for (const line of lines) {
    const n = norm(line)

    // Detect "Légende" / "LÉGENDE" / "Légende :" section header
    if (/^l[eé]gende[s:]*$/.test(n)) {
      inLegend = true
      continue
    }

    if (!inLegend) continue

    // Stop at month headers or known section titles
    if (findMonth(n.split(/\s+/)[0]) !== undefined) { inLegend = false; continue }
    if (/^(calendrier|horaire|note|information|janvier|aout|septembre)/i.test(n)) { inLegend = false; continue }

    // Parse "CODE – description" / "CODE - description" / "CODE : description" / "CODE\tdescription"
    // Code = 1–6 letters, possibly uppercase only
    const m = line.match(/^([A-Za-zÀ-ÿ]{1,6})\s*[-–:]\s*(.+)$/) ??
              line.match(/^([A-Za-zÀ-ÿ]{1,6})\t(.+)$/)
    if (m) {
      const code = m[1].toUpperCase()
      const description = m[2].trim()
      legend.set(code, { description, eventType: classifyEvent(description) })
    }
  }

  return legend
}

// Resolve a raw description against the legend; expand codes, improve classification
function resolveDescription(
  raw: string,
  legend: Map<string, LegendEntry>,
): { label: string; eventType: string } {
  const upper = raw.trim().toUpperCase()

  // 1. Exact match with a legend code
  const exact = legend.get(upper)
  if (exact) return { label: exact.description.substring(0, 100), eventType: exact.eventType }

  // 2. Legend code appears as a word inside the description
  let label = raw
  let eventType = classifyEvent(raw)

  for (const [code, entry] of legend.entries()) {
    if (new RegExp(`(?:^|\\s)${code}(?:\\s|$)`, 'i').test(raw)) {
      label = raw.replace(new RegExp(`\\b${code}\\b`, 'i'), entry.description).trim()
      eventType = entry.eventType
      break
    }
  }

  return { label: label.substring(0, 100), eventType }
}

// ─── Strip date portion from front of line to get the description ─────────────
function stripDate(line: string): string {
  // Remove leading day-name, day-number, ordinal, month, year, separators
  return line
    .replace(/^(?:lundi|mardi|mercredi|jeudi|vendredi|samedi|dimanche|lu|ma|me|je|ve|sa|di)[.,\s]*/i, '')
    .replace(/^\d{1,2}(?:er|re|ième|e)?\s+(?:janvier|février|fevrier|mars|avril|mai|juin|juillet|août|aout|septembre|octobre|novembre|décembre|decembre|jan|fév|fev|avr|juil|sept|oct|nov|déc|dec)\.?\s*(?:\d{4})?\s*[-–:]\s*/i, '')
    .replace(/^\d{1,2}(?:er|re|ième|e)?\s+[-–:]\s*/i, '')
    .replace(/^\d{1,2}(?:er|re|ième|e)?\s+/i, '')
    .trim()
}

function parsePdfText(
  text: string,
  startYear: number,
): { event_date: string; event_type: string; label: string }[] {
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean)
  const events: { event_date: string; event_type: string; label: string }[] = []

  // First pass: extract legend mappings (e.g. "JP – Journée pédagogique")
  const legend = parseLegend(lines)

  let ctxMonth: number | null = null
  let ctxYear = startYear

  function inferYear(month: number) {
    return month >= 8 ? startYear : startYear + 1
  }

  function addEvent(dateObj: Date, description: string) {
    if (isNaN(dateObj.getTime())) return
    const { label, eventType } = resolveDescription(description || '(sans description)', legend)
    events.push({ event_date: fmtDate(dateObj), event_type: eventType, label })
  }

  // ── Patterns ──────────────────────────────────────────────────────────────
  // R1: Range with explicit month — "du 20 au 24 janvier 2025", "20-24 janvier"
  const R_RANGE_FULL = new RegExp(
    `(?:du\\s+)?(?:${DAY_ABBR})[.,\\s]*` +
    `(\\d{1,2})${ORD}\\s*(?:au|-)\\s*(?:${DAY_ABBR})?[.,\\s]*(\\d{1,2})${ORD}\\s+([a-z\\.]+)(?:\\s+(\\d{4}))?`,
    'i'
  )
  const R_RANGE_FULL2 = new RegExp(
    `(?:du\\s+)?(\\d{1,2})${ORD}\\s*(?:au|-)\\s*(\\d{1,2})${ORD}\\s+([a-z\\.]+)(?:\\s+(\\d{4}))?`,
    'i'
  )
  // R2: Single date with explicit month — "4 novembre 2025", "lundi 4 novembre"
  const R_DATE_FULL = new RegExp(
    `(?:(?:${DAY_ABBR})[.,\\s]+)?(\\d{1,2})${ORD}\\s+([a-z\\.]{3,})(?:\\s+(\\d{4}))?(?:[\\s\\-–:]+(.+))?`,
    'i'
  )
  // R3: Day-only (requires ctxMonth) — "Ma 3 Rentrée scolaire", "3 Rentrée"
  const R_DAY_ONLY = new RegExp(
    `^(?:(?:${DAY_ABBR})[.,\\s]+)?(\\d{1,2})${ORD}(?:[\\s\\t]+(.+))?$`,
    'i'
  )
  // R4: Month header — "Septembre 2025", "OCTOBRE", "septembre"
  const R_MONTH_HEADER = /^([a-zA-ZÀ-ÿ]+)(?:\s+(\d{4}))?$/

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i]
    const n = norm(line)

    // ── Month header ──────────────────────────────────────────────
    const mh = line.match(R_MONTH_HEADER)
    if (mh) {
      const m = findMonth(mh[1])
      if (m) {
        ctxMonth = m
        ctxYear = mh[2] ? parseInt(mh[2]) : inferYear(m)
        continue
      }
    }

    // ── Range with explicit month ─────────────────────────────────
    const rf = n.match(R_RANGE_FULL) ?? n.match(R_RANGE_FULL2)
    if (rf) {
      const d1 = parseInt(rf[1]), d2 = parseInt(rf[2])
      const m = findMonth(rf[3])
      if (m && d1 >= 1 && d2 >= d1 && d2 <= 31) {
        const y = rf[4] ? parseInt(rf[4]) : inferYear(m)
        ctxMonth = m; ctxYear = y
        const desc = stripDate(line) || line
        const { label, eventType } = resolveDescription(desc, legend)
        for (const d of datesInRange(new Date(y, m - 1, d1), new Date(y, m - 1, d2))) {
          events.push({ event_date: fmtDate(d), event_type: eventType, label })
        }
        continue
      }
    }

    // ── Single date with explicit month ──────────────────────────
    const df = n.match(R_DATE_FULL)
    if (df) {
      const day = parseInt(df[1])
      const m = findMonth(df[2])
      if (m && day >= 1 && day <= 31) {
        const y = df[3] ? parseInt(df[3]) : inferYear(m)
        ctxMonth = m; ctxYear = y
        // Description: capture group 4, or rest of line, or next line
        let desc = df[4]?.trim() ?? stripDate(line)
        if (!desc && i + 1 < lines.length && !lines[i + 1].match(R_MONTH_HEADER)) {
          desc = lines[i + 1].trim()
        }
        addEvent(new Date(y, m - 1, day), desc || line)
        continue
      }
    }

    // ── Day-only (uses context month) ─────────────────────────────
    if (ctxMonth) {
      const dOnly = n.match(R_DAY_ONLY)
      if (dOnly) {
        const day = parseInt(dOnly[1])
        if (day >= 1 && day <= 31) {
          let desc = dOnly[2]?.trim() ?? ''
          if (!desc && i + 1 < lines.length) desc = lines[i + 1].trim()
          if (desc) addEvent(new Date(ctxYear, ctxMonth - 1, day), desc)
        }
      }
    }
  }

  // Deduplicate by date+label
  const seen = new Set<string>()
  return events.filter(e => {
    const key = `${e.event_date}|${e.label}`
    if (seen.has(key)) return false
    seen.add(key)
    return true
  })
}

export async function parsePdfCalendar(
  formData: FormData,
  schoolYear: string,
): Promise<{ event_date: string; event_type: string; label: string }[]> {
  const file = formData.get('file') as File | null
  if (!file) throw new Error('Aucun fichier fourni')

  // Lazy-load pdf-parse and pdfjs-dist only when actually parsing a PDF,
  // so importing this module elsewhere doesn't spawn the PDF worker process.
  const { PDFParse } = await import('pdf-parse')
  const { GlobalWorkerOptions } = await import('pdfjs-dist')
  const { createRequire } = await import('module')
  const { pathToFileURL } = await import('url')
  const _require = createRequire(import.meta.url)
  GlobalWorkerOptions.workerSrc = pathToFileURL(
    _require.resolve('pdfjs-dist/build/pdf.worker.mjs')
  ).href

  const data = new Uint8Array(await file.arrayBuffer())
  const parser = new PDFParse({ data })
  const pdfData = await parser.getText()

  const [startYearStr] = schoolYear.split('-')
  const startYear = parseInt(startYearStr)

  return parsePdfText(pdfData.text, startYear)
}
