// Conjuntos finitos y funciones entre ellos (capítulo 1).
// Una función se representa como un mapa elemento -> elemento; mientras el
// usuario la está armando puede estar incompleta (no total).

export interface FiniteSet {
  name: string
  elements: string[]
}

export type FnMap = Partial<Record<string, string>>

export const isTotal = (dom: FiniteSet, f: FnMap) => dom.elements.every((x) => f[x] !== undefined)

export const image = (dom: FiniteSet, f: FnMap) =>
  new Set(dom.elements.map((x) => f[x]).filter((y): y is string => y !== undefined))

export function isInjective(dom: FiniteSet, f: FnMap) {
  const seen = new Set<string>()
  for (const x of dom.elements) {
    const y = f[x]
    if (y === undefined) continue
    if (seen.has(y)) return false
    seen.add(y)
  }
  return true
}

export const isSurjective = (dom: FiniteSet, cod: FiniteSet, f: FnMap) => {
  const im = image(dom, f)
  return cod.elements.every((y) => im.has(y))
}

export const isBijective = (dom: FiniteSet, cod: FiniteSet, f: FnMap) =>
  isTotal(dom, f) && isInjective(dom, f) && isSurjective(dom, cod, f)

/** g ∘ f */
export function composeFn(dom: FiniteSet, f: FnMap, g: FnMap): FnMap {
  const r: FnMap = {}
  for (const x of dom.elements) {
    const y = f[x]
    if (y !== undefined && g[y] !== undefined) r[x] = g[y]
  }
  return r
}

export function inverse(dom: FiniteSet, cod: FiniteSet, f: FnMap): FnMap | undefined {
  if (!isBijective(dom, cod, f)) return undefined
  const r: FnMap = {}
  for (const x of dom.elements) r[f[x]!] = x
  return r
}

export const sameFn = (dom: FiniteSet, f: FnMap, g: FnMap) => dom.elements.every((x) => f[x] === g[x])

/** Cantidad de funciones A → B: |B|^|A| (con 0^0 = 1: la función vacía). */
export const countFunctions = (a: number, b: number) => b ** a

/** Todos los posibles mapas A → B (para conjuntos chicos). */
export function allFunctions(dom: FiniteSet, cod: FiniteSet): FnMap[] {
  let acc: FnMap[] = [{}]
  for (const x of dom.elements) acc = acc.flatMap((f) => cod.elements.map((y) => ({ ...f, [x]: y })))
  return acc
}
