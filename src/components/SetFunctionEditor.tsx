import { useState } from 'react'
import type { FiniteSet, FnMap } from '../core/sets'

// Diagrama interno de una función: dos conjuntos como óvalos y una flecha por
// elemento. Se edita clickeando un elemento del dominio y después su imagen.

interface Props {
  dom: FiniteSet
  cod: FiniteSet
  value: FnMap
  onChange?: (f: FnMap) => void
  fnName?: string
  width?: number
}

const ROW = 46
const PAD = 34

export function SetFunctionEditor({ dom, cod, value, onChange, fnName = 'f', width = 340 }: Props) {
  const [selected, setSelected] = useState<string | null>(null)
  const readonly = !onChange
  const rows = Math.max(dom.elements.length, cod.elements.length, 1)
  const height = rows * ROW + PAD * 2
  const lx = 70
  const rx = width - 70
  const yOf = (i: number, n: number) => PAD + (rows - n) * (ROW / 2) + i * ROW + ROW / 2

  const domY = new Map(dom.elements.map((x, i) => [x, yOf(i, dom.elements.length)]))
  const codY = new Map(cod.elements.map((y, i) => [y, yOf(i, cod.elements.length)]))

  const clickDom = (x: string) => {
    if (readonly) return
    setSelected(selected === x ? null : x)
  }
  const clickCod = (y: string) => {
    if (readonly || selected === null) return
    const next = { ...value }
    if (next[selected] === y) delete next[selected]
    else next[selected] = y
    onChange!(next)
    // Avanza al siguiente elemento sin imagen para agilizar la carga.
    const pending = dom.elements.find((x) => next[x] === undefined)
    setSelected(pending ?? null)
  }

  const markerId = `head-${dom.name}-${cod.name}-${fnName}`.replace(/\W/g, '')

  return (
    <svg
      viewBox={`0 0 ${width} ${height}`}
      width="100%"
      style={{ maxWidth: width, display: 'block' }}
      role="img"
      aria-label={`Función ${fnName} de ${dom.name} a ${cod.name}`}
    >
      <defs>
        <marker id={markerId} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto">
          <path d="M0,0 L10,5 L0,10 z" fill="var(--arrow)" />
        </marker>
      </defs>
      <ellipse cx={lx} cy={height / 2 + 6} rx={44} ry={height / 2 - 20} fill="var(--obj-soft)" stroke="var(--obj)" />
      <ellipse cx={rx} cy={height / 2 + 6} rx={44} ry={height / 2 - 20} fill="var(--obj-soft)" stroke="var(--obj)" />
      <text x={lx} y={16} textAnchor="middle" fontWeight={700}>
        {dom.name}
      </text>
      <text x={rx} y={16} textAnchor="middle" fontWeight={700}>
        {cod.name}
      </text>
      <text x={width / 2} y={16} textAnchor="middle" fontStyle="italic" fill="var(--muted)">
        {fnName}
      </text>

      {dom.elements.map((x) => {
        const y = value[x]
        if (y === undefined || !codY.has(y)) return null
        return (
          <line
            key={x}
            x1={lx + 18}
            y1={domY.get(x)}
            x2={rx - 20}
            y2={codY.get(y)}
            stroke="var(--arrow)"
            strokeWidth={1.6}
            markerEnd={`url(#${markerId})`}
          />
        )
      })}

      {dom.elements.map((x) => (
        <g key={x} onClick={() => clickDom(x)} style={{ cursor: readonly ? 'default' : 'pointer' }}>
          <circle
            cx={lx}
            cy={domY.get(x)}
            r={17}
            fill={selected === x ? 'var(--accent-soft)' : 'var(--surface)'}
            stroke={selected === x ? 'var(--accent)' : 'var(--border)'}
            strokeWidth={selected === x ? 2.5 : 1}
          />
          <text x={lx} y={domY.get(x)! + 5} textAnchor="middle" fontSize={15}>
            {x}
          </text>
        </g>
      ))}
      {cod.elements.map((y) => (
        <g key={y} onClick={() => clickCod(y)} style={{ cursor: readonly || !selected ? 'default' : 'pointer' }}>
          <circle cx={rx} cy={codY.get(y)} r={17} fill="var(--surface)" stroke="var(--border)" />
          <text x={rx} y={codY.get(y)! + 5} textAnchor="middle" fontSize={15}>
            {y}
          </text>
        </g>
      ))}
    </svg>
  )
}
