'use client'

export default function PrintButton() {
  return (
    <button
      onClick={() => window.print()}
      className="px-4 py-1.5 rounded-lg text-sm font-medium bg-white/15 text-white hover:bg-white/25 transition print:hidden"
    >
      🖨️ Imprimer
    </button>
  )
}
