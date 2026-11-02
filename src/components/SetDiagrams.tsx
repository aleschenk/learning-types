import { useId } from 'react'

// Diagramas de Venn para la leyenda de símbolos. La región sombreada es el
// resultado de la operación.

export type VennOp = 'union' | 'inter' | 'diff' | 'subset' | 'disjoint'

const fill = { fill: 'var(--accent-soft)', stroke: 'none' }
const outline = { fill: 'none', stroke: 'var(--arrow)', strokeWidth: 1.5 }

export function Venn({ op, a = 'A', b = 'B', caption }: { op: VennOp; a?: string; b?: string; caption?: string }) {
  const id = useId().replace(/:/g, '')
  const W = 240
  const H = 150
  if (op === 'subset') {
    return (
      <figure className="venn">
        <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H} role="img" aria-label={`${a} incluido en ${b}`}>
          <ellipse cx={120} cy={75} rx={100} ry={64} style={outline} />
          <circle cx={100} cy={80} r={34} style={{ ...outline, fill: 'var(--accent-soft)' }} />
          <text x={100} y={85} textAnchor="middle">
            {a}
          </text>
          <text x={185} y={50}>
            {b}
          </text>
        </svg>
        {caption && <figcaption>{caption}</figcaption>}
      </figure>
    )
  }
  const ax = op === 'disjoint' ? 70 : 95
  const bx = op === 'disjoint' ? 170 : 145
  const r = op === 'disjoint' ? 45 : 55
  return (
    <figure className="venn">
      <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H} role="img" aria-label={caption ?? op}>
        <defs>
          <clipPath id={`${id}-b`}>
            <circle cx={bx} cy={75} r={r} />
          </clipPath>
          <mask id={`${id}-notb`}>
            <rect width={W} height={H} fill="white" />
            <circle cx={bx} cy={75} r={r} fill="black" />
          </mask>
        </defs>
        {op === 'union' && (
          <>
            <circle cx={ax} cy={75} r={r} style={fill} />
            <circle cx={bx} cy={75} r={r} style={fill} />
          </>
        )}
        {op === 'inter' && <circle cx={ax} cy={75} r={r} style={fill} clipPath={`url(#${id}-b)`} />}
        {op === 'diff' && <circle cx={ax} cy={75} r={r} style={fill} mask={`url(#${id}-notb)`} />}
        <circle cx={ax} cy={75} r={r} style={outline} />
        <circle cx={bx} cy={75} r={r} style={outline} />
        <text x={ax - r + 8} y={28}>
          {a}
        </text>
        <text x={bx + r - 18} y={28}>
          {b}
        </text>
      </svg>
      {caption && <figcaption>{caption}</figcaption>}
    </figure>
  )
}

/** R₀ ⊆ R₁ ⊆ R₂ ⊆ … como elipses anidadas: la unión de todas es la de afuera. */
export function NestedSets({ names }: { names: string[] }) {
  const W = 300
  const H = 170
  return (
    <figure className="venn">
      <svg viewBox={`0 0 ${W} ${H}`} width={W} height={H} role="img" aria-label="conjuntos anidados">
        {names
          .map((n, i) => {
            const k = names.length - 1 - i
            const rx = 40 + i * 32
            const ry = 24 + i * 18
            return (
              <g key={n}>
                <ellipse
                  cx={10 + rx}
                  cy={H / 2}
                  rx={rx}
                  ry={ry}
                  style={{ ...outline, fill: `color-mix(in srgb, var(--accent-soft) ${100 - k * 22}%, transparent)`, strokeDasharray: i === names.length - 1 ? '5 4' : undefined }}
                />
                <text x={10 + 2 * rx - 28} y={H / 2 + 5}>
                  {n}
                </text>
              </g>
            )
          })
          .reverse()}
      </svg>
      <figcaption>Cada uno contiene al anterior. La unión de todos es el más grande.</figcaption>
    </figure>
  )
}
