'use client'

import { CYCLES } from './nouveauProgrammeData'

const GLOBAL_CHANGES = [
  { icon: '📚', text: '10 textes/discours minimum par année en réception ET en production (tous niveaux)' },
  { icon: '🎭', text: '5 expériences culturelles minimum par année (théâtre, musée, rencontre d\'auteur, salon du livre…)' },
  { icon: '🪶', text: 'Au moins 2 textes autochtones (Premières Nations, Inuit) obligatoires par année' },
  { icon: '💻', text: 'Compétence numérique intégrée à tous les niveaux (correcticiels, balados, IA, hypertextualité)' },
  { icon: '📄', text: 'Document unique regroupant le programme, la PDA et le cadre d\'évaluation' },
  { icon: '🗓', text: 'Implantation obligatoire : 2027-2028 · Mise à l\'essai dans 55 classes en 2025-2026' },
]

export default function NouveauProgrammePanel() {
  return (
    <div className="flex flex-col h-[calc(100vh-65px)] overflow-hidden">

      {/* Top banner */}
      <div className="px-6 py-4 border-b bg-white flex flex-col gap-3">
        <div className="flex items-start gap-4 flex-wrap">
          <div>
            <h2 className="text-lg font-bold text-gray-900">Nouveau programme de français, langue d'enseignement (2025)</h2>
            <p className="text-sm text-gray-500 mt-0.5">Comparaison avec l'ancien programme PFEQ · Implantation obligatoire en 2027-2028</p>
          </div>
        </div>
        <div className="flex flex-wrap gap-2">
          {GLOBAL_CHANGES.map((c, i) => (
            <span key={i} className="inline-flex items-center gap-1.5 text-xs px-2.5 py-1.5 rounded-lg font-medium"
              style={{ backgroundColor: '#FEF3C7', color: '#78350F' }}>
              <span>{c.icon}</span>
              {c.text}
            </span>
          ))}
        </div>
      </div>

      {/* Columns */}
      <div className="flex-1 overflow-auto" style={{ backgroundColor: '#F1F5F9' }}>
        <div className="flex gap-4 p-5" style={{ minWidth: `${CYCLES.length * 310 + 80}px` }}>
          {CYCLES.map(cycle => (
            <div key={cycle.id} className="flex flex-col gap-3" style={{ width: 300, flexShrink: 0 }}>

              {/* Cycle header */}
              <div className="rounded-xl px-4 py-3" style={{ backgroundColor: cycle.bg, border: `1px solid ${cycle.border}` }}>
                <p className="font-bold text-sm" style={{ color: cycle.color }}>{cycle.label}</p>
                <p className="text-xs mt-0.5 font-medium" style={{ color: cycle.color, opacity: 0.7 }}>{cycle.years}</p>
              </div>

              {/* Nouveaux éléments */}
              <div className="rounded-xl p-4 flex flex-col gap-1.5" style={{ backgroundColor: '#F0FDF4', border: '1px solid #BBF7D0' }}>
                <p className="text-[0.65rem] font-bold uppercase tracking-wider text-emerald-700 mb-1.5 flex items-center gap-1">
                  <span className="w-4 h-4 rounded-full bg-emerald-100 flex items-center justify-center text-emerald-600 font-bold text-xs">+</span>
                  Nouveaux éléments
                </p>
                {cycle.nouveau.map((item, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <span className="shrink-0 w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5" />
                    <p className="text-[0.78rem] text-gray-700 leading-snug">{item}</p>
                  </div>
                ))}
              </div>

              {/* Éléments retirés */}
              <div className="rounded-xl p-4 flex flex-col gap-1.5" style={{ backgroundColor: '#FFF1F2', border: '1px solid #FECDD3' }}>
                <p className="text-[0.65rem] font-bold uppercase tracking-wider text-rose-600 mb-1.5 flex items-center gap-1">
                  <span className="w-4 h-4 rounded-full bg-rose-100 flex items-center justify-center text-rose-500 font-bold text-xs">−</span>
                  Éléments retirés ou déplacés
                </p>
                {cycle.retire.map((item, i) => (
                  <div key={i} className="flex items-start gap-2">
                    <span className="shrink-0 w-1.5 h-1.5 rounded-full bg-rose-400 mt-1.5" />
                    <p className="text-[0.78rem] text-gray-700 leading-snug">{item}</p>
                  </div>
                ))}
              </div>

            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
