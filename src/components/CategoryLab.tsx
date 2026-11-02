import { useEffect, useMemo, useRef, useState, type PointerEvent } from 'react'
import {
  addArrow,
  addObject,
  arrowById,
  checkCategory,
  compKey,
  composablePairs,
  fillForced,
  hom,
  objectById,
  properties,
  removeArrow,
  removeObject,
  setComposition,
  type Arrow,
  type Category,
  type CatObject,
} from '../core/category'
import { presets } from '../core/presets'
import { queryParam } from '../lib/router'

type Mode = 'move' | 'object' | 'arrow'

const W = 600
const H = 440
const R = 22
const STORAGE = 'ct-lab-v1'

function loadSaved(): Category | undefined {
  try {
    const raw = localStorage.getItem(STORAGE)
    return raw ? (JSON.parse(raw) as Category) : undefined
  } catch {
    return undefined
  }
}

const nextName = (used: string[], pool: string[]) =>
  pool.find((n) => !used.includes(n)) ?? `${pool[0]}${used.length}`
const OBJECT_NAMES = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('')
const ARROW_NAMES = 'fghkmnpqrstuvw'.split('')

// Geometría: las flechas entre el mismo par de objetos se curvan con offsets
// distintos; los endomorfismos se dibujan como lazos encima del objeto.
interface Geometry {
  d: string
  lx: number
  ly: number
}

function arrowGeometry(a: Arrow, src: CatObject, tgt: CatObject, index: number, total: number): Geometry {
  if (a.src === a.tgt) {
    // Lazos repartidos en abanico, centrados hacia arriba.
    const theta = ((-90 + (index - (total - 1) / 2) * 62) * Math.PI) / 180
    const at = (angle: number, dist: number) => [src.x + dist * Math.cos(angle), src.y + dist * Math.sin(angle)]
    const [sx, sy] = at(theta - 0.38, R)
    const [ex, ey] = at(theta + 0.38, R + 3)
    const [c1x, c1y] = at(theta - 0.55, 88)
    const [c2x, c2y] = at(theta + 0.55, 88)
    const [lx, ly] = at(theta, 78)
    return { d: `M ${sx} ${sy} C ${c1x} ${c1y}, ${c2x} ${c2y}, ${ex} ${ey}`, lx, ly: ly - 4 }
  }
  // Normal respecto de un orden canónico del par, para que flechas en sentidos
  // opuestos no se superpongan.
  const [p, q] = a.src < a.tgt ? [src, tgt] : [tgt, src]
  const dx = q.x - p.x
  const dy = q.y - p.y
  const len = Math.hypot(dx, dy) || 1
  const nx = -dy / len
  const ny = dx / len
  const offset = (index - (total - 1) / 2) * 44
  const mx = (src.x + tgt.x) / 2 + nx * offset
  const my = (src.y + tgt.y) / 2 + ny * offset
  const unit = (fx: number, fy: number, tx: number, ty: number) => {
    const l = Math.hypot(tx - fx, ty - fy) || 1
    return [(tx - fx) / l, (ty - fy) / l]
  }
  const [ux, uy] = unit(src.x, src.y, mx, my)
  const [vx, vy] = unit(tgt.x, tgt.y, mx, my)
  const sx = src.x + ux * R
  const sy = src.y + uy * R
  const ex = tgt.x + vx * (R + 3)
  const ey = tgt.y + vy * (R + 3)
  const lx = 0.25 * sx + 0.5 * mx + 0.25 * ex + nx * 12 * (offset >= 0 ? 1 : -1)
  const ly = 0.25 * sy + 0.5 * my + 0.25 * ey + ny * 12 * (offset >= 0 ? 1 : -1)
  return { d: `M ${sx} ${sy} Q ${mx} ${my} ${ex} ${ey}`, lx, ly }
}

export function CategoryLab() {
  // ?ejemplo=<id> en la URL carga un preset; si no, se retoma lo último guardado.
  const linked = presets.find((p) => p.id === queryParam('ejemplo'))
  const [cat, setCat] = useState<Category>(
    () => linked?.make() ?? loadSaved() ?? presets.find((p) => p.id === 'triangulo')!.make(),
  )
  const [mode, setMode] = useState<Mode>('move')
  const [showIds, setShowIds] = useState(false)
  const [arrowSrc, setArrowSrc] = useState<string | null>(null)
  const [pending, setPending] = useState<{ src: string; tgt: string; name: string } | null>(null)
  const [highlight, setHighlight] = useState<string[]>([])
  const [selected, setSelected] = useState<{ kind: 'object' | 'arrow'; id: string } | null>(null)
  const [presetInfo, setPresetInfo] = useState<string | null>(linked?.description ?? null)
  const svgRef = useRef<SVGSVGElement>(null)
  const drag = useRef<{ id: string; moved: boolean } | null>(null)

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE, JSON.stringify(cat))
    } catch {
      /* sin storage */
    }
  }, [cat])

  const issues = useMemo(() => checkCategory(cat), [cat])
  const props = useMemo(() => properties(cat), [cat])
  const pairs = useMemo(() => composablePairs(cat), [cat])

  const toSvg = (e: { clientX: number; clientY: number }) => {
    const svg = svgRef.current!
    const pt = svg.createSVGPoint()
    pt.x = e.clientX
    pt.y = e.clientY
    const p = pt.matrixTransform(svg.getScreenCTM()!.inverse())
    return { x: Math.max(R, Math.min(W - R, p.x)), y: Math.max(R, Math.min(H - R, p.y)) }
  }

  const onCanvasClick = (e: React.MouseEvent<SVGSVGElement>) => {
    if (e.target !== svgRef.current) return
    setSelected(null)
    if (mode === 'object') {
      const { x, y } = toSvg(e)
      setCat(addObject(cat, nextName(cat.objects.map((o) => o.name), OBJECT_NAMES), x, y))
    }
    if (mode === 'arrow') setArrowSrc(null)
  }

  const onObjectDown = (e: PointerEvent, o: CatObject) => {
    e.stopPropagation()
    if (mode === 'arrow') {
      if (arrowSrc === null) setArrowSrc(o.id)
      else {
        setPending({ src: arrowSrc, tgt: o.id, name: nextName(cat.arrows.map((a) => a.name), ARROW_NAMES) })
        setArrowSrc(null)
      }
      return
    }
    ;(e.target as Element).setPointerCapture(e.pointerId)
    drag.current = { id: o.id, moved: false }
  }

  const onPointerMove = (e: PointerEvent) => {
    if (!drag.current) return
    const { x, y } = toSvg(e)
    drag.current.moved = true
    const id = drag.current.id
    setCat((c) => ({ ...c, objects: c.objects.map((o) => (o.id === id ? { ...o, x, y } : o)) }))
  }

  const onPointerUp = () => {
    if (drag.current && !drag.current.moved) setSelected({ kind: 'object', id: drag.current.id })
    drag.current = null
  }

  const confirmArrow = () => {
    if (!pending || !pending.name.trim()) return
    setCat(addArrow(cat, pending.name.trim(), pending.src, pending.tgt))
    setPending(null)
  }

  const deleteSelected = () => {
    if (!selected) return
    if (selected.kind === 'object') setCat(removeObject(cat, selected.id))
    else if (!arrowById(cat, selected.id)?.identity) setCat(removeArrow(cat, selected.id))
    setSelected(null)
  }

  const loadPreset = (id: string) => {
    const p = presets.find((x) => x.id === id)
    if (!p) return
    setCat(p.make())
    setPresetInfo(p.description)
    setSelected(null)
    setPending(null)
    setArrowSrc(null)
  }

  const newCompositeArrow = (f: Arrow, g: Arrow) => {
    const name = `${g.name}∘${f.name}`
    let next = addArrow(cat, name, f.src, g.tgt)
    const created = next.arrows[next.arrows.length - 1]
    next = setComposition(next, g.id, f.id, created.id)
    setCat(next)
  }

  const visibleArrows = cat.arrows.filter((a) => showIds || !a.identity)
  const groups = new Map<string, Arrow[]>()
  for (const a of visibleArrows) {
    const k = a.src === a.tgt ? `loop:${a.src}` : [a.src, a.tgt].sort().join('|')
    groups.set(k, [...(groups.get(k) ?? []), a])
  }

  const objName = (id: string) => objectById(cat, id)?.name ?? '?'
  const selectedArrow = selected?.kind === 'arrow' ? arrowById(cat, selected.id) : undefined
  const selectedObject = selected?.kind === 'object' ? objectById(cat, selected.id) : undefined

  return (
    <div className="lab">
      <div className="row" style={{ marginBottom: 10 }}>
        <button className={mode === 'move' ? 'active' : ''} onClick={() => setMode('move')}>
          ✋ Mover / seleccionar
        </button>
        <button className={mode === 'object' ? 'active' : ''} onClick={() => setMode('object')}>
          ● Agregar objeto
        </button>
        <button className={mode === 'arrow' ? 'active' : ''} onClick={() => setMode('arrow')}>
          → Agregar flecha
        </button>
        <label className="row" style={{ gap: 4, fontSize: '0.9rem' }}>
          <input type="checkbox" checked={showIds} onChange={(e) => setShowIds(e.target.checked)} />
          mostrar identidades
        </label>
        <select value="" onChange={(e) => loadPreset(e.target.value)}>
          <option value="">Cargar ejemplo…</option>
          {presets.map((p) => (
            <option key={p.id} value={p.id}>
              {p.name}
            </option>
          ))}
        </select>
      </div>

      <div className="callout" style={{ margin: '0 0 10px' }}>
        {mode === 'move' && 'Arrastrá los objetos. Clickeá un objeto o una flecha para seleccionarlo.'}
        {mode === 'object' && 'Clickeá en un lugar vacío para crear un objeto.'}
        {mode === 'arrow' &&
          (arrowSrc ? `Origen: ${objName(arrowSrc)}. Ahora clickeá el destino.` : 'Clickeá el objeto de origen.')}
        {presetInfo && mode === 'move' && <div style={{ marginTop: 6 }}>📌 {presetInfo}</div>}
      </div>

      <div className="lab-grid">
        <div>
          <svg
            ref={svgRef}
            viewBox={`0 0 ${W} ${H}`}
            width="100%"
            className="lab-canvas"
            onClick={onCanvasClick}
            onPointerMove={onPointerMove}
            onPointerUp={onPointerUp}
          >
            <defs>
              <marker id="lab-head" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse">
                <path d="M0,0 L10,5 L0,10 z" fill="var(--arrow)" />
              </marker>
              <marker id="lab-head-hl" viewBox="0 0 10 10" refX="8" refY="5" markerWidth="8" markerHeight="8" orient="auto-start-reverse">
                <path d="M0,0 L10,5 L0,10 z" fill="var(--accent)" />
              </marker>
            </defs>

            {[...groups.values()].flatMap((group) =>
              group.map((a, i) => {
                const src = objectById(cat, a.src)
                const tgt = objectById(cat, a.tgt)
                if (!src || !tgt) return null
                const g = arrowGeometry(a, src, tgt, i, group.length)
                const hl = highlight.includes(a.id) || selected?.id === a.id
                return (
                  <g
                    key={a.id}
                    onClick={(e) => {
                      e.stopPropagation()
                      setSelected({ kind: 'arrow', id: a.id })
                    }}
                    style={{ cursor: 'pointer' }}
                  >
                    <path d={g.d} fill="none" stroke="transparent" strokeWidth={14} />
                    <path
                      d={g.d}
                      fill="none"
                      stroke={hl ? 'var(--accent)' : 'var(--arrow)'}
                      strokeWidth={hl ? 2.6 : 1.6}
                      strokeDasharray={a.identity ? '4 3' : undefined}
                      markerEnd={`url(#${hl ? 'lab-head-hl' : 'lab-head'})`}
                    />
                    <text
                      x={g.lx}
                      y={g.ly + 5}
                      textAnchor="middle"
                      fontSize={15}
                      fontStyle="italic"
                      fill={hl ? 'var(--accent)' : 'var(--text)'}
                      style={{ paintOrder: 'stroke', stroke: 'var(--surface)', strokeWidth: 4 }}
                    >
                      {a.name}
                    </text>
                  </g>
                )
              }),
            )}

            {cat.objects.map((o) => {
              const active = arrowSrc === o.id || selected?.id === o.id
              return (
                <g key={o.id} onPointerDown={(e) => onObjectDown(e, o)} style={{ cursor: mode === 'move' ? 'grab' : 'pointer' }}>
                  <circle
                    cx={o.x}
                    cy={o.y}
                    r={R}
                    fill={active ? 'var(--accent-soft)' : 'var(--obj-soft)'}
                    stroke={active ? 'var(--accent)' : 'var(--obj)'}
                    strokeWidth={active ? 2.5 : 1.5}
                  />
                  <text x={o.x} y={o.y + 6} textAnchor="middle" fontSize={17} fontWeight={700}>
                    {o.name}
                  </text>
                </g>
              )
            })}
          </svg>

          {pending && (
            <div className="card row" style={{ marginTop: 10 }}>
              <span>
                Nueva flecha {objName(pending.src)} → {objName(pending.tgt)}, nombre:
              </span>
              <input
                autoFocus
                value={pending.name}
                onChange={(e) => setPending({ ...pending, name: e.target.value })}
                onKeyDown={(e) => e.key === 'Enter' && confirmArrow()}
                style={{ width: 90 }}
              />
              <button className="primary" onClick={confirmArrow}>
                Agregar
              </button>
              <button onClick={() => setPending(null)}>Cancelar</button>
            </div>
          )}

          {(selectedArrow || selectedObject) && (
            <div className="card row" style={{ marginTop: 10 }}>
              {selectedObject && (
                <>
                  <span>Objeto</span>
                  <input
                    value={selectedObject.name}
                    onChange={(e) =>
                      setCat({
                        ...cat,
                        objects: cat.objects.map((o) => (o.id === selectedObject.id ? { ...o, name: e.target.value } : o)),
                        arrows: cat.arrows.map((a) =>
                          a.identity && a.src === selectedObject.id ? { ...a, name: `id${e.target.value}` } : a,
                        ),
                      })
                    }
                    style={{ width: 80 }}
                  />
                </>
              )}
              {selectedArrow && (
                <>
                  <span>
                    Flecha {objName(selectedArrow.src)} → {objName(selectedArrow.tgt)}
                  </span>
                  {!selectedArrow.identity && (
                    <input
                      value={selectedArrow.name}
                      onChange={(e) =>
                        setCat({
                          ...cat,
                          arrows: cat.arrows.map((a) => (a.id === selectedArrow.id ? { ...a, name: e.target.value } : a)),
                        })
                      }
                      style={{ width: 80 }}
                    />
                  )}
                  {selectedArrow.identity && <em>(identidad: no se puede borrar)</em>}
                </>
              )}
              {!selectedArrow?.identity && <button onClick={deleteSelected}>🗑 Borrar</button>}
            </div>
          )}
        </div>

        <aside>
          <div className={`card ${issues.length === 0 ? 'exercise solved' : 'exercise'}`} style={{ marginTop: 0 }}>
            <h3>{issues.length === 0 ? '✔ Es una categoría' : `✘ Todavía no es una categoría (${issues.length})`}</h3>
            {issues.length === 0 ? (
              <p style={{ margin: 0, fontSize: '0.92rem' }}>
                Toda flecha tiene identidades a ambos lados, todo par componible tiene composición y la composición es
                asociativa.
              </p>
            ) : (
              <ul className="issues">
                {issues.slice(0, 8).map((i, k) => (
                  <li key={k} onMouseEnter={() => setHighlight(i.arrows)} onMouseLeave={() => setHighlight([])}>
                    {i.message}
                  </li>
                ))}
                {issues.length > 8 && <li>… y {issues.length - 8} más.</li>}
              </ul>
            )}
          </div>

          <div className="card">
            <h3 style={{ margin: '0 0 8px', fontSize: '1rem', fontFamily: 'inherit' }}>Tabla de composición</h3>
            {pairs.length === 0 ? (
              <p style={{ margin: 0, color: 'var(--muted)', fontSize: '0.92rem' }}>
                No hay pares de flechas componibles (sin contar identidades, que componen solas).
              </p>
            ) : (
              <>
                <table className="comp-table">
                  <tbody>
                    {pairs.map(({ f, g }) => {
                      const key = compKey(g.id, f.id)
                      const current = cat.composition[key]
                      const candidates = hom(cat, f.src, g.tgt)
                      return (
                        <tr
                          key={key}
                          onMouseEnter={() => setHighlight([f.id, g.id, ...(current ? [current] : [])])}
                          onMouseLeave={() => setHighlight([])}
                        >
                          <td className="mono">
                            {g.name} ∘ {f.name}
                          </td>
                          <td>=</td>
                          <td>
                            <select
                              value={current ?? ''}
                              onChange={(e) => setCat(setComposition(cat, g.id, f.id, e.target.value || undefined))}
                            >
                              <option value="">—</option>
                              {candidates.map((h) => (
                                <option key={h.id} value={h.id}>
                                  {h.name}
                                </option>
                              ))}
                            </select>
                          </td>
                          <td>
                            {!current && (
                              <button title="Crear una flecha nueva para esta composición" onClick={() => newCompositeArrow(f, g)}>
                                + nueva
                              </button>
                            )}
                          </td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
                <button style={{ marginTop: 8 }} onClick={() => setCat(fillForced(cat))}>
                  Completar las que tienen una sola opción
                </button>
              </>
            )}
          </div>

          <div className="card">
            <h3 style={{ margin: '0 0 8px', fontSize: '1rem', fontFamily: 'inherit' }}>Qué tipo de categoría es</h3>
            {issues.length > 0 && (
              <p style={{ margin: '0 0 6px', color: 'var(--muted)', fontSize: '0.85rem' }}>
                (Provisorio: primero tiene que ser una categoría.)
              </p>
            )}
            <div className="row">
              <Prop on={props.monoid} label="Monoide" hint="Un solo objeto: las flechas son los elementos del monoide." />
              <Prop on={props.group} label="Grupo" hint="Monoide donde toda flecha es invertible." />
              <Prop on={props.thin} label="Preorden" hint="A lo sumo una flecha entre dos objetos (categoría delgada)." />
              <Prop on={props.partialOrder} label="Orden parcial" hint="Preorden sin isomorfismos salvo identidades." />
              <Prop on={props.groupoid} label="Grupoide" hint="Toda flecha es un isomorfismo." />
              <Prop on={props.discrete} label="Discreta" hint="Sólo identidades." />
            </div>
            {props.isomorphisms.length > 0 && (
              <p style={{ margin: '10px 0 0', fontSize: '0.92rem' }}>
                Isomorfismos: {props.isomorphisms.map((id) => arrowById(cat, id)?.name).join(', ')}
              </p>
            )}
          </div>
        </aside>
      </div>
    </div>
  )
}

function Prop({ on, label, hint }: { on: boolean; label: string; hint: string }) {
  return (
    <span className={`badge ${on ? 'ok' : ''}`} title={hint}>
      {on ? '✔' : '·'} {label}
    </span>
  )
}
