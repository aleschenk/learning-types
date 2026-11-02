import { useId, useState } from 'react'
import { hasPair, showRelation, transitiveClosureSteps, type Relation } from '../core/relations'

// Muestra R₀, R₁, R₂, … de la clausura transitiva (Ejercicio 2.2.7 de TAPL)
// sobre un grafo con los nodos en fila. Los pares nuevos de cada paso se
// resaltan.

const presets: { label: string; nodes: string[]; r: Relation }[] = [
  {
    label: 'Cadena',
    nodes: ['a', 'b', 'c', 'd', 'e'],
    r: [
      ['a', 'b'],
      ['b', 'c'],
      ['c', 'd'],
      ['d', 'e'],
    ],
  },
  {
    label: 'Con un ciclo',
    nodes: ['a', 'b', 'c', 'd'],
    r: [
      ['a', 'b'],
      ['b', 'c'],
      ['c', 'a'],
      ['c', 'd'],
    ],
  },
]

const sub = (n: number) => String(n).replace(/\d/g, (d) => '₀₁₂₃₄₅₆₇₈₉'[Number(d)])

export function ClosureStepper() {
  const [preset, setPreset] = useState(0)
  const [i, setI] = useState(0)
  const id = useId().replace(/:/g, '')
  const { nodes, r } = presets[preset]
  const steps = transitiveClosureSteps(r)
  const last = steps.length - 1
  const cur = steps[i]
  const prev = i > 0 ? steps[i - 1] : []
  const added = i > 0 ? cur.filter(([s, u]) => !hasPair(prev, s, u)) : []

  const W = 80 * nodes.length
  const H = 230
  const y = 130
  const x = (n: string) => 40 + nodes.indexOf(n) * 80

  const edge = ([s, u]: readonly [string, string], isNew: boolean) => {
    const cls = isNew ? 'new' : 'old'
    if (s === u) {
      const cx = x(s)
      return (
        <path
          key={`${s}-${u}`}
          className={cls}
          d={`M ${cx - 8} ${y - 14} C ${cx - 30} ${y - 60}, ${cx + 30} ${y - 60}, ${cx + 8} ${y - 14}`}
          markerEnd={`url(#${id}-${cls})`}
        />
      )
    }
    const x1 = x(s)
    const x2 = x(u)
    const d = Math.abs(nodes.indexOf(u) - nodes.indexOf(s))
    // Hacia la derecha los arcos van arriba; hacia la izquierda, abajo.
    const dir = x2 > x1 ? -1 : 1
    const h = d === 1 ? 0 : 22 * d
    const sx = x1 + Math.sign(x2 - x1) * 14
    const ex = x2 - Math.sign(x2 - x1) * 14
    const path = h === 0 && dir === -1 ? `M ${sx} ${y} L ${ex} ${y}` : `M ${sx} ${y + dir * 6} Q ${(x1 + x2) / 2} ${y + dir * (h || 30) * 1.4} ${ex} ${y + dir * 6}`
    return <path key={`${s}-${u}`} className={cls} d={path} markerEnd={`url(#${id}-${cls})`} />
  }

  return (
    <div className="card closure">
      <div className="row" style={{ justifyContent: 'space-between' }}>
        <div className="row">
          {presets.map((p, k) => (
            <button
              key={p.label}
              className={k === preset ? 'active' : ''}
              onClick={() => {
                setPreset(k)
                setI(0)
              }}
            >
              {p.label}
            </button>
          ))}
        </div>
        <div className="row">
          <button onClick={() => setI(Math.max(0, i - 1))} disabled={i === 0}>
            ← anterior
          </button>
          <strong className="mono">R{sub(i)}</strong>
          <button className="primary" onClick={() => setI(Math.min(last, i + 1))} disabled={i === last}>
            siguiente paso →
          </button>
        </div>
      </div>
      <svg viewBox={`0 0 ${W} ${H}`} width="100%" style={{ maxWidth: W }} role="img" aria-label={`R${sub(i)}`}>
        <defs>
          {['old', 'new'].map((c) => (
            <marker key={c} id={`${id}-${c}`} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" className={`head ${c}`} />
            </marker>
          ))}
        </defs>
        {cur.filter((p) => !added.includes(p)).map((p) => edge(p, false))}
        {added.map((p) => edge(p, true))}
        {nodes.map((n) => (
          <g key={n}>
            <circle cx={x(n)} cy={y} r={13} className="node" />
            <text x={x(n)} y={y + 5} textAnchor="middle">
              {n}
            </text>
          </g>
        ))}
      </svg>
      <p style={{ margin: '4px 0' }}>
        {i === 0 ? (
          <>
            R₀ = R, la relación original: {r.length} pares.
          </>
        ) : (
          <>
            R{sub(i)} = R{sub(i - 1)} más {added.length} {added.length === 1 ? 'par nuevo' : 'pares nuevos'} (en color):{' '}
            <span className="mono">{showRelation(added)}</span>. Cada uno sale de encadenar dos flechas que ya estaban en R
            {sub(i - 1)}.
          </>
        )}{' '}
        {i === last && (
          <strong>
            {i === 0 ? 'Ya era transitiva.' : `Un paso más no agrega nada: R${sub(i)} es R⁺, la clausura transitiva.`}
          </strong>
        )}
      </p>
    </div>
  )
}
