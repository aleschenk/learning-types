import { useId } from 'react'
import { hasPair, type Relation } from '../core/relations'
import type { NodePos } from '../lib/layout'

// Una relación sobre un conjunto dibujada como grafo: un nodo por elemento y una
// flecha por par. Con `hasse`, las flechas pasan a ser líneas sin punta (el
// orden se lee de abajo hacia arriba) y no se dibujan los lazos.

const R = 15

export function RelationGraph(props: {
  nodes: NodePos[]
  r: Relation
  width: number
  height: number
  hasse?: boolean
  /** Pares a resaltar en color. */
  highlight?: Relation
  caption?: string
}) {
  const { nodes, r, width, height, hasse } = props
  const id = useId().replace(/:/g, '')
  const pos = (n: string) => nodes.find((p) => p.id === n)!
  const isHi = (s: string, t: string) => !!props.highlight && hasPair(props.highlight, s, t)

  const edge = ([s, t]: readonly [string, string]) => {
    const cls = `edge ${isHi(s, t) ? 'hi' : ''}`
    const marker = hasse ? undefined : `url(#${id}-${isHi(s, t) ? 'hi' : 'n'})`
    const a = pos(s)
    if (s === t) {
      if (hasse) return null
      return (
        <path
          key={`${s}-${t}`}
          className={cls}
          d={`M ${a.x - 7} ${a.y - R + 2} C ${a.x - 28} ${a.y - 52}, ${a.x + 28} ${a.y - 52}, ${a.x + 7} ${a.y - R + 2}`}
          markerEnd={marker}
        />
      )
    }
    const b = pos(t)
    const dx = b.x - a.x
    const dy = b.y - a.y
    const len = Math.hypot(dx, dy)
    const ux = dx / len
    const uy = dy / len
    const x1 = a.x + ux * R
    const y1 = a.y + uy * R
    const x2 = b.x - ux * (R + 2)
    const y2 = b.y - uy * (R + 2)
    // Si también está la vuelta, cada sentido se curva hacia su lado.
    if (!hasse && hasPair(r, t, s)) {
      const mx = (x1 + x2) / 2 - uy * 18
      const my = (y1 + y2) / 2 + ux * 18
      return <path key={`${s}-${t}`} className={cls} d={`M ${x1} ${y1} Q ${mx} ${my} ${x2} ${y2}`} markerEnd={marker} />
    }
    return <path key={`${s}-${t}`} className={cls} d={`M ${x1} ${y1} L ${x2} ${y2}`} markerEnd={marker} />
  }

  return (
    <figure className="rel-graph">
      <svg viewBox={`0 0 ${width} ${height}`} width={width} height={height} style={{ maxWidth: '100%' }} role="img" aria-label={props.caption}>
        <defs>
          {['n', 'hi'].map((c) => (
            <marker key={c} id={`${id}-${c}`} viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse">
              <path d="M 0 0 L 10 5 L 0 10 z" className={`head ${c}`} />
            </marker>
          ))}
        </defs>
        {r.map(edge)}
        {nodes.map((n) => (
          <g key={n.id}>
            <circle cx={n.x} cy={n.y} r={R} className="node" />
            <text x={n.x} y={n.y + 5} textAnchor="middle" style={{ fontSize: n.id.length > 2 ? 11 : 14 }}>
              {n.id}
            </text>
          </g>
        ))}
      </svg>
      {props.caption && <figcaption>{props.caption}</figcaption>}
    </figure>
  )
}
