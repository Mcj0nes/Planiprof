'use client'

import { useState, useRef } from 'react'
import { updateGridTitle } from './actions'

interface Props {
  gridId: string
  initial: string
}

export default function GridTitleInput({ gridId, initial }: Props) {
  const [title, setTitle]   = useState(initial)
  const [editing, setEditing] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  function startEdit() {
    setEditing(true)
    setTimeout(() => inputRef.current?.select(), 0)
  }

  async function commit() {
    setEditing(false)
    const trimmed = title.trim()
    if (!trimmed) { setTitle(initial); return }
    await updateGridTitle(gridId, trimmed)
  }

  function handleKey(e: React.KeyboardEvent) {
    if (e.key === 'Enter') inputRef.current?.blur()
    if (e.key === 'Escape') { setTitle(initial); setEditing(false) }
  }

  if (editing) {
    return (
      <input
        ref={inputRef}
        type="text"
        value={title}
        onChange={e => setTitle(e.target.value)}
        onBlur={commit}
        onKeyDown={handleKey}
        autoFocus
        className="text-2xl font-bold text-gray-800 bg-transparent border-b-2 border-blue-400 focus:outline-none w-full max-w-xl"
      />
    )
  }

  return (
    <button
      onClick={startEdit}
      title="Cliquer pour renommer"
      className="text-2xl font-bold text-gray-800 hover:text-blue-700 text-left group flex items-center gap-2"
    >
      {title}
      <span className="text-sm font-normal text-gray-300 group-hover:text-blue-400 transition">✎</span>
    </button>
  )
}
