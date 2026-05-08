'use client'

const CYCLES = [
  {
    id: 'c1p',
    label: '1er cycle primaire',
    years: '1re – 2e année',
    color: '#7C3AED',
    bg: '#EDE9FE',
    border: '#C4B5FD',
    nouveau: [
      'Communication orale repositionnée en 1re compétence — fondement de l\'écrit',
      'Constituants de la phrase (sujet, prédicat, compl. de phrase) dès la 1re année',
      'Annexe officielle des correspondances graphèmes-phonèmes et phonèmes-graphèmes',
      'Écriture manuscrite prescrite (annexe des tracés de lettres)',
      'Écriture quotidienne obligatoire, même avant maîtrise de l\'orthographe',
      'Liste orthographique (~500 mots) devient OBLIGATOIRE (anciennement facultative)',
      '10 textes/discours minimum par an en réception (dont 5 québécois et 2 autochtones)',
      '10 textes/discours minimum par an en production',
      '5 expériences culturelles minimum par année (cercles de lecture, rencontres d\'auteurs, etc.)',
      'Genres textuels associés aux 3 intentions de communication introduits dès le 1er cycle',
      'Compétence numérique — sensibilisation à l\'environnement numérique',
      'Section explicite «Conscience langagière» avec composantes définies',
    ],
    retire: [
      'Compétence «Apprécier des œuvres littéraires» — fusionnée dans la compétence Lire',
      '4 compétences réduites à 3 (réorganisation structurelle)',
      'Aucun seuil prescriptif pour les lectures, productions ou activités culturelles',
    ],
  },
  {
    id: 'c2p',
    label: '2e cycle primaire',
    years: '3e – 4e année',
    color: '#1D4ED8',
    bg: '#DBEAFE',
    border: '#93C5FD',
    nouveau: [
      'Concept de genre introduit (légende, anecdote, recette, texte d\'opinion)',
      'Concept de forme (bande dessinée, roman, lettre)',
      'Infinitif présent des 21 verbes modèles obligatoires dès la 3e année',
      '3 intentions de communication formalisées en taxonomie explicite',
      'Écriture tapuscrite introduite après stabilisation de l\'écriture manuscrite',
      'Numérique : pages Web, balados, livres audio comme supports pédagogiques',
      '10 textes/an minimum et 5 activités culturelles minimum',
      'Oral diversifié : causeries, cercles de lecture, rencontres avec artistes québécois',
      'Éléments verbaux, paraverbaux et non verbaux de la communication explicités',
      'Modernisation de la liste orthographique (retrait : prêtre, messe, Esquimau, Amérindien ; ajout : autochtone, québécois)',
    ],
    retire: [
      'Passé simple → déplacé en 1re secondaire (allègement du 2e cycle)',
      'Apprentissage progressif sans liste fixée remplacé par les 21 verbes modèles',
    ],
  },
  {
    id: 'c3p',
    label: '3e cycle primaire',
    years: '5e – 6e année',
    color: '#065F46',
    bg: '#D1FAE5',
    border: '#6EE7B7',
    nouveau: [
      'Grammaire du texte — 5 principes de cohérence textuelle : unité du sujet, organisation et progression, reprise de l\'information, non-contradiction, constance du point de vue',
      'Liste orthographique OBLIGATOIRE (~2700 mots au total au primaire, modernisée, hébergée sur Usito)',
      'Concept de genre et de forme maîtrisés (consolidation)',
      'Plusieurs notions du secondaire descendues pour adoucir la transition (grammaire du texte, genres)',
      'Numérique : correcticiels, production multimodale, écriture tapuscrite',
      '10 textes/an, 5 activités culturelles min., 5 genres différents en production',
      'Oral diversifié : débats, discussions, jeux de rôle ; rencontres avec créateurs',
    ],
    retire: [
      'Passé simple (3e p. sing./plur.) → déplacé en 1re secondaire',
      'Grammaire du texte était exclusivement réservée au secondaire',
      'Liste orthographique (~3000 mots) était facultative → réduite à 2700 mots et obligatoire',
    ],
  },
  {
    id: 'c1s',
    label: '1er cycle secondaire',
    years: 'Sec 1 – Sec 2',
    color: '#9A3412',
    bg: '#FFEDD5',
    border: '#FED7AA',
    nouveau: [
      'Passé simple INTRODUIT (n\'est plus enseigné au primaire — nouveau pour les enseignants du sec.)',
      'Organisation par dominantes textuelles : narrative, descriptive, explicative, justificative, argumentative',
      'Genre justificatif clairement distinct du genre argumentatif',
      'Théâtre = FORME (et non genre)',
      'Poésie = statut particulier (ni genre ni forme)',
      '5 principes de cohérence textuelle systématisés',
      'Composantes de lecture : décodage ajouté (5 composantes au lieu de 4)',
      'Composantes d\'écriture revues : Idéer, Énoncer, Encoder, Matérialiser',
      'Compétence numérique intégrée : IA, fiabilité de l\'information, balados, livres audio',
      '10 textes/an, 5 activités culturelles min., ≥2 textes autochtones obligatoires',
      'Document unique secondaire Sec 1–5 (fusionne les anciens programmes séparés)',
    ],
    retire: [
      'Organisation par modes de discours (narratif, descriptif, explicatif, argumentatif)',
      'Exposé oral traditionnel devant la classe → remplacé par débats, discussions, jeux de rôle',
      'Cadre d\'évaluation dans un document séparé → intégré au document unique',
    ],
  },
  {
    id: 'c2s',
    label: '2e cycle secondaire',
    years: 'Sec 3 – Sec 4 – Sec 5',
    color: '#9D174D',
    bg: '#FCE7F3',
    border: '#F9A8D4',
    nouveau: [
      'Distinction justificative vs argumentative formellement établie',
      'Constance du point de vue en RÉCEPTION et en PRODUCTION (au lieu de réception seulement)',
      'Répertoire culturel PRESCRIPTIF (plus seulement suggéré)',
      '≥2 textes/discours des Premières Nations ou Inuit obligatoires par année',
      'Compétence numérique pleinement intégrée : IA, hypertextualité, intertextualité, multimodalité, culture informationnelle',
      'Sensibilisation à la crédibilité et fiabilité de l\'information (incluant l\'IA générative)',
      'Au moins 5 textes COMPLETS parmi les 10 minimum — seuil prescrit',
      'Continuum cohérent Sec 1 → Sec 5 (rupture entre cycles éliminée)',
    ],
    retire: [
      'Programme distinct pour le 2e cycle (PFEQ 2009) → fusionné dans le document unique Sec 1–5',
      'Organisation par modes de discours → remplacée par les dominantes textuelles',
      'Exposé oral traditionnel → débats, discussions, jeux de rôle',
      'Seuils de lecture et de production variables selon l\'enseignant → désormais prescrits',
    ],
  },
]

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
