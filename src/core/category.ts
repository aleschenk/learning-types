// Motor de categorías finitas.
//
// Una categoría se representa con objetos, flechas y una tabla de composición.
// Las identidades son flechas marcadas con `identity: true`, una por objeto, y
// su composición NO se guarda en la tabla: `compose` la resuelve implícitamente
// (g ∘ id = g, id ∘ f = f). Así las leyes de identidad valen por construcción y
// la tabla sólo contiene los pares de flechas no-identidad.

export interface CatObject {
  id: string
  name: string
  x: number
  y: number
}

export interface Arrow {
  id: string
  name: string
  src: string
  tgt: string
  identity?: boolean
}

export interface Category {
  objects: CatObject[]
  arrows: Arrow[]
  // compKey(g, f) -> id de la flecha g ∘ f ("g después de f")
  composition: Record<string, string>
}

export type IssueKind =
  | 'missing-identity'
  | 'duplicate-identity'
  | 'missing-composition'
  | 'ill-typed-composition'
  | 'associativity'

export interface Issue {
  kind: IssueKind
  message: string
  arrows: string[]
}

export const compKey = (g: string, f: string) => `${g}∘${f}`

export const emptyCategory = (): Category => ({ objects: [], arrows: [], composition: {} })

export const arrowById = (c: Category, id: string) => c.arrows.find((a) => a.id === id)
export const objectById = (c: Category, id: string) => c.objects.find((o) => o.id === id)
export const identityOf = (c: Category, objId: string) =>
  c.arrows.find((a) => a.identity && a.src === objId)

export const nonIdentityArrows = (c: Category) => c.arrows.filter((a) => !a.identity)

export const hom = (c: Category, src: string, tgt: string) =>
  c.arrows.filter((a) => a.src === src && a.tgt === tgt)

/** Pares componibles de flechas no-identidad: f: A → B, g: B → C. */
export function composablePairs(c: Category): { f: Arrow; g: Arrow }[] {
  const arrows = nonIdentityArrows(c)
  const pairs: { f: Arrow; g: Arrow }[] = []
  for (const f of arrows) for (const g of arrows) if (f.tgt === g.src) pairs.push({ f, g })
  return pairs
}

/** g ∘ f, o undefined si no está definida (o no son componibles). */
export function compose(c: Category, gId: string, fId: string): string | undefined {
  const f = arrowById(c, fId)
  const g = arrowById(c, gId)
  if (!f || !g || f.tgt !== g.src) return undefined
  if (f.identity) return g.id
  if (g.identity) return f.id
  return c.composition[compKey(g.id, f.id)]
}

/**
 * Compone un camino dado en orden de aplicación: [f, g, h] = h ∘ g ∘ f.
 * Devuelve undefined si alguna composición falta o el camino no es componible.
 */
export function composePath(c: Category, path: string[]): string | undefined {
  if (path.length === 0) return undefined
  let acc: string | undefined = path[0]
  for (const next of path.slice(1)) {
    if (acc === undefined) return undefined
    acc = compose(c, next, acc)
  }
  return acc
}

/** ¿Conmuta el diagrama formado por estos dos caminos (mismo origen y destino)? */
export function pathsCommute(c: Category, p: string[], q: string[]): boolean | undefined {
  const a = composePath(c, p)
  const b = composePath(c, q)
  if (a === undefined || b === undefined) return undefined
  return a === b
}

const label = (c: Category, id: string) => arrowById(c, id)?.name ?? '?'
const objLabel = (c: Category, id: string) => objectById(c, id)?.name ?? '?'

export function checkCategory(c: Category): Issue[] {
  const issues: Issue[] = []

  for (const o of c.objects) {
    const ids = c.arrows.filter((a) => a.identity && a.src === o.id)
    if (ids.length === 0)
      issues.push({ kind: 'missing-identity', message: `El objeto ${o.name} no tiene identidad.`, arrows: [] })
    if (ids.length > 1)
      issues.push({
        kind: 'duplicate-identity',
        message: `El objeto ${o.name} tiene ${ids.length} identidades; debe tener exactamente una.`,
        arrows: ids.map((a) => a.id),
      })
  }

  let complete = true
  for (const { f, g } of composablePairs(c)) {
    const r = c.composition[compKey(g.id, f.id)]
    if (r === undefined) {
      complete = false
      issues.push({
        kind: 'missing-composition',
        message: `Falta definir ${g.name} ∘ ${f.name} : ${objLabel(c, f.src)} → ${objLabel(c, g.tgt)}.`,
        arrows: [f.id, g.id],
      })
      continue
    }
    const ra = arrowById(c, r)
    if (!ra || ra.src !== f.src || ra.tgt !== g.tgt) {
      complete = false
      issues.push({
        kind: 'ill-typed-composition',
        message: `${g.name} ∘ ${f.name} tiene que ir de ${objLabel(c, f.src)} a ${objLabel(c, g.tgt)}, pero se definió como ${ra ? `${ra.name} : ${objLabel(c, ra.src)} → ${objLabel(c, ra.tgt)}` : 'una flecha inexistente'}.`,
        arrows: [f.id, g.id, r],
      })
    }
  }

  // Asociatividad sólo tiene sentido si la tabla está completa y bien tipada.
  // Con identidades vale siempre, así que alcanza con revisar ternas no-identidad.
  if (complete) {
    const arrows = nonIdentityArrows(c)
    for (const f of arrows)
      for (const g of arrows.filter((x) => x.src === f.tgt))
        for (const h of arrows.filter((x) => x.src === g.tgt)) {
          const gf = compose(c, g.id, f.id)!
          const hg = compose(c, h.id, g.id)!
          const left = compose(c, h.id, gf)
          const right = compose(c, hg, f.id)
          if (left !== undefined && right !== undefined && left !== right)
            issues.push({
              kind: 'associativity',
              message: `No es asociativa: ${h.name} ∘ (${g.name} ∘ ${f.name}) = ${label(c, left)}, pero (${h.name} ∘ ${g.name}) ∘ ${f.name} = ${label(c, right)}.`,
              arrows: [f.id, g.id, h.id],
            })
        }
  }

  return issues
}

export const isCategory = (c: Category) => checkCategory(c).length === 0

/** ¿f tiene inversa? Devuelve el id de la inversa o undefined. */
export function inverseOf(c: Category, fId: string): string | undefined {
  const f = arrowById(c, fId)
  if (!f) return undefined
  if (f.identity) return f.id
  const idA = identityOf(c, f.src)?.id
  const idB = identityOf(c, f.tgt)?.id
  return hom(c, f.tgt, f.src).find((g) => compose(c, g.id, f.id) === idA && compose(c, f.id, g.id) === idB)?.id
}

export interface Properties {
  monoid: boolean // un solo objeto
  discrete: boolean // sólo identidades
  thin: boolean // a lo sumo una flecha entre dos objetos (preorden)
  partialOrder: boolean // preorden sin isomorfismos no triviales
  groupoid: boolean // toda flecha es un isomorfismo
  group: boolean // monoide + grupoide
  isomorphisms: string[] // flechas no-identidad invertibles
}

export function properties(c: Category): Properties {
  const nonId = nonIdentityArrows(c)
  const pairs = new Set<string>()
  let thin = true
  for (const a of c.arrows) {
    const k = `${a.src}->${a.tgt}`
    if (pairs.has(k)) thin = false
    pairs.add(k)
  }
  const isomorphisms = nonId.filter((a) => inverseOf(c, a.id) !== undefined).map((a) => a.id)
  const monoid = c.objects.length === 1
  const groupoid = isomorphisms.length === nonId.length
  return {
    monoid,
    discrete: nonId.length === 0,
    thin,
    partialOrder: thin && isomorphisms.length === 0,
    groupoid,
    group: monoid && groupoid,
    isomorphisms,
  }
}

// ---------------------------------------------------------------------------
// Edición (funciones puras: devuelven una categoría nueva)

let counter = 0
export const freshId = (prefix: string) => `${prefix}${Date.now().toString(36)}${(counter++).toString(36)}`

export function addObject(c: Category, name: string, x: number, y: number, id = freshId('o')): Category {
  return {
    ...c,
    objects: [...c.objects, { id, name, x, y }],
    arrows: [...c.arrows, { id: `id_${id}`, name: `id${name}`, src: id, tgt: id, identity: true }],
  }
}

export function addArrow(c: Category, name: string, src: string, tgt: string, id = freshId('a')): Category {
  return { ...c, arrows: [...c.arrows, { id, name, src, tgt }] }
}

export function removeArrow(c: Category, id: string): Category {
  const composition: Record<string, string> = {}
  for (const [k, v] of Object.entries(c.composition)) {
    const [g, f] = k.split('∘')
    if (g !== id && f !== id && v !== id) composition[k] = v
  }
  return { ...c, arrows: c.arrows.filter((a) => a.id !== id), composition }
}

export function removeObject(c: Category, id: string): Category {
  let next: Category = { ...c, objects: c.objects.filter((o) => o.id !== id) }
  for (const a of c.arrows) if (a.src === id || a.tgt === id) next = removeArrow(next, a.id)
  return next
}

export function setComposition(c: Category, g: string, f: string, result: string | undefined): Category {
  const composition = { ...c.composition }
  if (result === undefined) delete composition[compKey(g, f)]
  else composition[compKey(g, f)] = result
  return { ...c, composition }
}

/** Completa las composiciones faltantes que tienen un único candidato posible. */
export function fillForced(c: Category): Category {
  let next = c
  for (const { f, g } of composablePairs(c)) {
    if (next.composition[compKey(g.id, f.id)] !== undefined) continue
    const candidates = hom(next, f.src, g.tgt)
    if (candidates.length === 1) next = setComposition(next, g.id, f.id, candidates[0].id)
  }
  return next
}

// ---------------------------------------------------------------------------
// Construcción declarativa (para presets y tests)

export interface Spec {
  objects: [name: string, x: number, y: number][]
  arrows?: [name: string, src: string, tgt: string][]
  // [g, f, resultado]: g ∘ f = resultado. Las identidades se escriben "id_A".
  comp?: [string, string, string][]
}

/** Construye una categoría usando los nombres como ids. */
export function build(spec: Spec): Category {
  let c = emptyCategory()
  for (const [name, x, y] of spec.objects) c = addObject(c, name, x, y, name)
  for (const [name, src, tgt] of spec.arrows ?? []) c = addArrow(c, name, src, tgt, name)
  for (const [g, f, r] of spec.comp ?? []) c = setComposition(c, g, f, r)
  return c
}
