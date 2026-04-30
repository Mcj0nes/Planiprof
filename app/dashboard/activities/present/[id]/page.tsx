import { createClient } from '@/lib/supabase/server'
import { redirect, notFound } from 'next/navigation'
import Link from 'next/link'

type Attachment = {
  id: string
  file_name: string
  file_path: string
  file_type: string | null
  file_size: number | null
  signedUrl: string | null
}

function fileLabel(type: string | null, name: string): string {
  if (!type) return name
  if (type.startsWith('image/')) return `🖼 ${name}`
  if (type === 'application/pdf') return `📄 ${name}`
  if (type.includes('word')) return `📝 ${name}`
  if (type.includes('excel') || type.includes('spreadsheet')) return `📊 ${name}`
  if (type.includes('powerpoint') || type.includes('presentation')) return `📑 ${name}`
  return `📎 ${name}`
}

function formatSize(bytes: number | null): string {
  if (!bytes) return ''
  if (bytes < 1024) return `${bytes} o`
  if (bytes < 1024 * 1024) return `${Math.round(bytes / 1024)} Ko`
  return `${(bytes / (1024 * 1024)).toFixed(1)} Mo`
}

function isOfficeFile(type: string | null): boolean {
  if (!type) return false
  return type.includes('word') || type.includes('excel') || type.includes('spreadsheet') ||
         type.includes('powerpoint') || type.includes('presentation')
}

export default async function PresentPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params

  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  // Try user activity first, then template
  let title: string | null = null
  let description: string | null = null
  let type_tag: string | null = null
  let duration_min: number | null = null
  let category: string | null = null
  let is_template = false
  let rawAttachments: any[] = []

  const { data: act } = await supabase
    .from('activities')
    .select('id, title, description, type_tag, duration_min')
    .eq('id', id)
    .eq('user_id', user.id)
    .maybeSingle()

  if (act) {
    title = act.title
    description = act.description
    type_tag = act.type_tag
    duration_min = act.duration_min

    const { data: atts } = await supabase
      .from('activity_attachments')
      .select('id, file_name, file_path, file_type, file_size')
      .eq('activity_id', id)
    rawAttachments = atts ?? []
  } else {
    // Try template
    const { data: tpl } = await supabase
      .from('activity_templates')
      .select('id, title, description, type_tag, duration_min, category')
      .eq('id', id)
      .maybeSingle()

    if (!tpl) notFound()
    title = tpl.title
    description = tpl.description
    type_tag = tpl.type_tag
    duration_min = tpl.duration_min
    category = tpl.category
    is_template = true

    const { data: atts } = await supabase
      .from('activity_attachments')
      .select('id, file_name, file_path, file_type, file_size')
      .eq('template_id', id)
    rawAttachments = atts ?? []
  }

  // Generate signed URLs for all attachments (1-hour expiry)
  const attachments: Attachment[] = await Promise.all(
    rawAttachments.map(async att => {
      const { data } = await supabase.storage
        .from('activity-files')
        .createSignedUrl(att.file_path, 3600)
      return { ...att, signedUrl: data?.signedUrl ?? null }
    })
  )

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">

      {/* Minimal nav */}
      <header className="flex items-center gap-4 px-6 py-4 border-b border-white/10">
        <Link href="/dashboard" className="text-white/50 hover:text-white/80 text-sm transition">
          ← Tableau de bord
        </Link>
        <div className="flex-1" />
        {is_template && category && (
          <span className="text-xs font-semibold text-teal-400 bg-teal-400/10 px-3 py-1 rounded-full">
            {category}
          </span>
        )}
        {type_tag && (
          <span className="text-xs text-white/50 bg-white/10 px-3 py-1 rounded-full">{type_tag}</span>
        )}
        {duration_min != null && (
          <span className="text-xs text-white/50">⏱ {duration_min} min</span>
        )}
      </header>

      {/* Main content */}
      <main className="flex-1 max-w-3xl mx-auto w-full px-6 py-10">

        <h1 className="text-3xl font-bold text-white leading-tight mb-4">{title}</h1>

        {description && (
          <div className="bg-white/5 rounded-2xl px-6 py-5 mb-8 border border-white/10">
            <p className="text-sm text-white/80 leading-relaxed whitespace-pre-wrap">{description}</p>
          </div>
        )}

        {/* File buttons */}
        {attachments.length > 0 && (
          <div>
            <h2 className="text-sm font-bold text-white/50 uppercase tracking-widest mb-4">
              Matériel ({attachments.length} fichier{attachments.length > 1 ? 's' : ''})
            </h2>
            <div className="grid gap-3">
              {attachments.map(att => {
                if (!att.signedUrl) return null
                const isOffice = isOfficeFile(att.file_type)
                const isImage  = att.file_type?.startsWith('image/') ?? false
                const isPdf    = att.file_type === 'application/pdf'

                // Office files: open via Microsoft Office viewer (renders without downloading)
                const href = isOffice
                  ? `https://view.officeapps.live.com/op/view.aspx?src=${encodeURIComponent(att.signedUrl)}`
                  : att.signedUrl

                return (
                  <div key={att.id} className="rounded-2xl border border-white/10 overflow-hidden">
                    {/* Inline image preview */}
                    {isImage && (
                      <img src={att.signedUrl} alt={att.file_name}
                        className="w-full max-h-96 object-contain bg-black" />
                    )}

                    <div className="flex items-center gap-4 px-5 py-4">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-semibold text-white truncate">
                          {fileLabel(att.file_type, att.file_name)}
                        </p>
                        {att.file_size != null && (
                          <p className="text-xs text-white/40 mt-0.5">{formatSize(att.file_size)}</p>
                        )}
                      </div>
                      <a
                        href={href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="shrink-0 px-5 py-2.5 rounded-xl text-sm font-bold transition"
                        style={{
                          backgroundColor: isPdf ? '#EF4444' : isOffice ? '#2563EB' : isImage ? '#8B5CF6' : '#6B7280',
                          color: '#fff',
                        }}
                      >
                        {isPdf ? 'Ouvrir le PDF' : isOffice ? 'Ouvrir le diaporama' : isImage ? 'Plein écran' : 'Ouvrir'}
                      </a>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>
        )}

        {attachments.length === 0 && (
          <div className="text-center py-16">
            <p className="text-white/30 text-sm">Aucun fichier joint à cette activité.</p>
            <p className="text-white/20 text-xs mt-1">Ajoutez des fichiers depuis la banque d'activités.</p>
          </div>
        )}
      </main>
    </div>
  )
}
