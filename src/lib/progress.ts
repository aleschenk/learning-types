import { useCallback, useSyncExternalStore } from 'react'

// Progreso del usuario (ejercicios resueltos), guardado en localStorage.
const KEY = 'ct-progress-v1'
const listeners = new Set<() => void>()

function read(): string[] {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? '[]')
  } catch {
    return []
  }
}

let cache = read()

export function markSolved(id: string) {
  if (cache.includes(id)) return
  cache = [...cache, id]
  try {
    localStorage.setItem(KEY, JSON.stringify(cache))
  } catch {
    /* sin storage: el progreso vive sólo en memoria */
  }
  listeners.forEach((l) => l())
}

export function resetProgress() {
  cache = []
  try {
    localStorage.removeItem(KEY)
  } catch {
    /* idem */
  }
  listeners.forEach((l) => l())
}

const subscribe = (l: () => void) => {
  listeners.add(l)
  return () => listeners.delete(l)
}

export function useProgress() {
  const solved = useSyncExternalStore(subscribe, () => cache)
  const isSolved = useCallback((id: string) => solved.includes(id), [solved])
  return { solved, isSolved }
}
