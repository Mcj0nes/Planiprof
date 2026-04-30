'use client'

import { createContext, useContext, useEffect, useState } from 'react'

export type SkinId =
  | 'default' | 'bleu-profond' | 'sarcelle' | 'violet' | 'rose'
  | 'ambre' | 'foret' | 'ardoise' | 'indigo' | 'ciel'

export const SKINS: { id: SkinId; label: string; nav: string; bg: string }[] = [
  { id: 'default',      label: 'Bleu ardoise',  nav: '#8BADD6', bg: '#ADBEE5' },
  { id: 'bleu-profond', label: 'Bleu profond',  nav: '#3B5FA0', bg: '#C5D5E8' },
  { id: 'sarcelle',     label: 'Sarcelle',       nav: '#0D8C7C', bg: '#B2D8D4' },
  { id: 'violet',       label: 'Violet',         nav: '#7C3AED', bg: '#DDD6FE' },
  { id: 'rose',         label: 'Rose',           nav: '#BE4178', bg: '#F9C6DC' },
  { id: 'ambre',        label: 'Ambre',          nav: '#D97706', bg: '#FDE7C2' },
  { id: 'foret',        label: 'Forêt',          nav: '#16A34A', bg: '#C6E8D3' },
  { id: 'ardoise',      label: 'Ardoise',        nav: '#475569', bg: '#CBD5E1' },
  { id: 'indigo',       label: 'Indigo',         nav: '#4338CA', bg: '#D1D5FE' },
  { id: 'ciel',         label: 'Ciel',           nav: '#0284C7', bg: '#BAE6FD' },
]

const SKIN_MAP = Object.fromEntries(SKINS.map(s => [s.id, s])) as Record<SkinId, typeof SKINS[0]>

const SkinContext = createContext<{
  skin: SkinId
  setSkin: (id: SkinId) => void
}>({ skin: 'default', setSkin: () => {} })

export function useSkin() { return useContext(SkinContext) }

function applyPalette(id: SkinId) {
  const palette = SKIN_MAP[id] ?? SKINS[0]
  document.documentElement.style.setProperty('--color-nav', palette.nav)
  document.documentElement.style.setProperty('--color-body-bg', palette.bg)
}

export default function SkinProvider({ children }: { children: React.ReactNode }) {
  const [skin, setSkinState] = useState<SkinId>('default')

  useEffect(() => {
    const saved = localStorage.getItem('planiprof-skin') as SkinId | null
    if (saved && SKIN_MAP[saved]) {
      applyPalette(saved)
      setSkinState(saved)
    }
  }, [])

  function setSkin(id: SkinId) {
    localStorage.setItem('planiprof-skin', id)
    applyPalette(id)
    setSkinState(id)
  }

  return (
    <SkinContext.Provider value={{ skin, setSkin }}>
      {children}
    </SkinContext.Provider>
  )
}
