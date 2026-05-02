'use client'
export default function PrintButton() {
  return (
    <button onClick={() => window.print()} className="text-xs px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 transition">
      🖨 Imprimer / PDF
    </button>
  )
}
