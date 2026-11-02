import { useSyncExternalStore } from 'react'

// Router mínimo por hash (#/ruta?param=valor). Alcanza para un sitio estático
// sin backend.
const subscribe = (l: () => void) => {
  window.addEventListener('hashchange', l)
  return () => window.removeEventListener('hashchange', l)
}

const hash = () => window.location.hash.replace(/^#/, '') || '/'

export const useRoute = () => useSyncExternalStore(subscribe, () => hash().split('?')[0])

export const queryParam = (name: string) => new URLSearchParams(hash().split('?')[1] ?? '').get(name)

/** Como `queryParam`, pero se actualiza cuando cambia el hash sin cambiar la ruta. */
export const useQueryParam = (name: string) => useSyncExternalStore(subscribe, () => queryParam(name))
