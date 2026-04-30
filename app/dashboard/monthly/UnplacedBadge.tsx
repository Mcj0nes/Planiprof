'use client'

import { useState } from 'react'

type UnplacedGroup = {
  id: number
  name: string
  color: string | null
  items: { id: number; name_fr: string }[]
}

type Props = {
  planId: string
  groups: UnplacedGroup[]
  count: number
}

export default function UnplacedBadge({ planId, groups, count }: Props) {
  const [open, setOpen] = useState(false)
  const [expandedGroup, setExpandedGroup] = useState<number | null>(null)

  if (count === 0) return null

  return (
    <div className="relative">
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 top-full mt-2 w-72 bg-white rounded-2xl shadow-2xl border border-amber-200 overflow-hidden z-20">
            <div className="flex items-center justify-between px-4 py-3 border-b border-amber-100" style={{ backgroundColor: '#FFFBEB' }}>
              <p className="text-sm font-bold text-amber-800">Contenus non planifiés</p>
              <button onClick={() => setOpen(false)} className="text-amber-400 hover:text-amber-600 text-xl leading-none">×</button>
            </div>
            <div className="max-h-80 overflow-y-auto divide-y divide-gray-100">
              {groups.map(group => (
                <div key={group.id}>
                  <button
                    onClick={() => setExpandedGroup(expandedGroup === group.id ? null : group.id)}
                    className="w-full flex items-center gap-2.5 px-4 py-2.5 hover:bg-gray-50 transition text-left"
                  >
                    <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: group.color ?? '#94A3B8' }} />
                    <span className="flex-1 text-sm font-medium text-gray-700">{group.name}</span>
                    <span
                      className="text-xs font-bold px-2 py-0.5 rounded-full shrink-0"
                      style={{ backgroundColor: `${group.color ?? '#94A3B8'}20`, color: group.color ?? '#6B7280' }}
                    >
                      {group.items.length}
                    </span>
                    <span className="text-gray-400 text-xs shrink-0">{expandedGroup === group.id ? '▲' : '▼'}</span>
                  </button>
                  {expandedGroup === group.id && (
                    <ul className="py-1.5 px-2 bg-gray-50">
                      {group.items.map(item => (
                        <li key={item.id}>
                          <a
                            href={`/dashboard/annual/${planId}`}
                            className="block text-xs px-3 py-2 rounded-lg hover:bg-amber-50 text-gray-700 transition leading-snug"
                          >
                            {item.name_fr}
                          </a>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              ))}
            </div>
            <div className="px-4 py-2.5 border-t border-amber-100 bg-amber-50 flex items-center justify-between">
              <p className="text-xs text-amber-700">Cliquez sur un contenu pour l'assigner.</p>
              <a
                href={`/dashboard/annual/${planId}`}
                className="text-xs font-semibold text-amber-700 hover:text-amber-900 transition whitespace-nowrap ml-3"
              >
                Ouvrir →
              </a>
            </div>
          </div>
        </>
      )}

      <button
        onClick={() => setOpen(v => !v)}
        className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl font-bold text-xs shadow-md transition hover:shadow-lg active:scale-95"
        style={{ backgroundColor: '#F59E0B', color: 'white' }}
      >
        <span>⚠️</span>
        <span>{count} non planifié{count > 1 ? 's' : ''}</span>
      </button>
    </div>
  )
}
