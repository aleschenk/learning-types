// Posiciones de nodos para dibujar grafos (RelationGraph).

export interface NodePos {
  id: string
  x: number
  y: number
}

/** Nodos repartidos en un círculo, empezando arriba. */
export const circleLayout = (ids: string[], cx: number, cy: number, r: number): NodePos[] =>
  ids.map((id, i) => {
    const a = -Math.PI / 2 + (2 * Math.PI * i) / ids.length
    return { id, x: cx + r * Math.cos(a), y: cy + r * Math.sin(a) }
  })
