import type { ReactNode } from 'react'

// Cajas para los textos de los capítulos: la definición reformulada, ejemplos
// trabajados y errores comunes.

export function Definition({ n, children }: { n: string; children: ReactNode }) {
  return (
    <div className="box definition">
      <div className="box-label">Definición {n}, en criollo</div>
      {children}
    </div>
  )
}

export function Example({ title, children }: { title?: string; children: ReactNode }) {
  return (
    <div className="box example">
      <div className="box-label">Ejemplo{title ? `: ${title}` : ''}</div>
      {children}
    </div>
  )
}

export function Pitfall({ children }: { children: ReactNode }) {
  return (
    <div className="box pitfall">
      <div className="box-label">Ojo</div>
      {children}
    </div>
  )
}
