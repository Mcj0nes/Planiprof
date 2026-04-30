'use client'

import { SKINS, useSkin, type SkinId } from '@/app/components/SkinProvider'

export default function SkinPicker() {
  const { skin, setSkin } = useSkin()

  return (
    <div className="flex items-center gap-1.5" title="Palette de couleurs">
      {SKINS.map(s => (
        <button
          key={s.id}
          onClick={() => setSkin(s.id as SkinId)}
          title={s.label}
          className={`w-6 h-6 rounded-full border-2 transition-all duration-150 ${
            skin === s.id
              ? 'border-white scale-125 shadow-md'
              : 'border-white/40 hover:border-white hover:scale-110'
          }`}
          style={{ backgroundColor: s.nav }}
        />
      ))}
    </div>
  )
}
