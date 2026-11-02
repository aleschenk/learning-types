// Relaciones entre conjuntos finitos (TT, capítulo 2: preliminares matemáticos).
// Una relación binaria es un conjunto de pares; acá la guardamos como lista sin
// duplicados. Las funciones parciales y totales son casos particulares.

export type Pair = readonly [string, string]
export type Relation = Pair[]

export const hasPair = (r: Relation, s: string, t: string) => r.some(([a, b]) => a === s && b === t)

/** `{(1, a), (2, b)}`, o `∅` si está vacía. */
export const showRelation = (r: Relation) => (r.length ? `{${r.map(([a, b]) => `(${a}, ${b})`).join(', ')}}` : '∅')

/** Agrega el par si no está, lo saca si está. */
export const togglePair = (r: Relation, s: string, t: string): Relation =>
  hasPair(r, s, t) ? r.filter(([a, b]) => !(a === s && b === t)) : [...r, [s, t]]

/** Elementos de la izquierda que están relacionados con algo. Se devuelven en el orden de `S`. */
export const dom = (S: string[], r: Relation) => S.filter((s) => r.some(([a]) => a === s))

/** Elementos de la derecha a los que llega algo. Se devuelven en el orden de `T`. */
export const range = (T: string[], r: Relation) => T.filter((t) => r.some(([, b]) => b === t))

/** Elementos de `S` relacionados con dos o más cosas: los que impiden que `r` sea función. */
export const conflicts = (S: string[], r: Relation) => S.filter((s) => r.filter(([a]) => a === s).length > 1)

export const isPartialFunction = (S: string[], r: Relation) => conflicts(S, r).length === 0

/** Elementos de `S` donde `r` está indefinida (f(x)↑). */
export const undefinedOn = (S: string[], r: Relation) => S.filter((s) => !r.some(([a]) => a === s))

export const isTotalFunction = (S: string[], r: Relation) => isPartialFunction(S, r) && undefinedOn(S, r).length === 0

/**
 * ¿El predicado `P` (un subconjunto) se preserva por `r`? Devuelve el primer par
 * (s, s') con P(s) y no P(s'), o `undefined` si se preserva.
 */
export function preservationCounterexample(r: Relation, P: string[]): Pair | undefined {
  return r.find(([s, s2]) => P.includes(s) && !P.includes(s2))
}

export const preserves = (r: Relation, P: string[]) => preservationCounterexample(r, P) === undefined

/** S \ T, en el orden de `S`. */
export const difference = (S: string[], T: string[]) => S.filter((x) => !T.includes(x))

/** Todos los subconjuntos de `S` (P(S)). Para conjuntos chicos. */
export function powerset(S: string[]): string[][] {
  return S.reduce<string[][]>((acc, x) => [...acc, ...acc.map((sub) => [...sub, x])], [[]])
}

/** Igualdad de conjuntos, ignorando orden y duplicados. */
export const sameSet = (a: string[], b: string[]) => {
  const A = new Set(a)
  const B = new Set(b)
  return A.size === B.size && [...A].every((x) => B.has(x))
}

/**
 * Un paso de transitividad (Ejercicio 2.2.7 de TAPL):
 * Rᵢ₊₁ = Rᵢ ∪ {(s, u) | para algún t, (s, t) ∈ Rᵢ y (t, u) ∈ Rᵢ}.
 */
export function transitivityStep(r: Relation): Relation {
  const next = [...r]
  for (const [s, t] of r)
    for (const [t2, u] of r) if (t === t2 && !hasPair(next, s, u)) next.push([s, u])
  return next
}

/**
 * La sucesión R₀ = R, R₁, R₂, … hasta que deja de crecer. El último elemento es
 * R⁺, la clausura transitiva (en un conjunto finito siempre se llega).
 */
export function transitiveClosureSteps(r: Relation): Relation[] {
  const steps = [r]
  for (;;) {
    const last = steps[steps.length - 1]
    const next = transitivityStep(last)
    if (next.length === last.length) return steps
    steps.push(next)
  }
}

export const isTransitive = (r: Relation) => transitivityStep(r).length === r.length

// ── Relaciones sobre un solo conjunto (TT 2.2: conjuntos ordenados) ──
// Cada chequeo devuelve un contraejemplo, o `undefined` si la propiedad vale,
// para poder explicarle al usuario por qué falla.

/** Un s ∈ S sin (s, s). */
export const reflexivityCounterexample = (S: string[], r: Relation) => S.find((s) => !hasPair(r, s, s))

/** Un (s, t) ∈ R sin (t, s). */
export const symmetryCounterexample = (r: Relation) => r.find(([s, t]) => !hasPair(r, t, s))

/** Una terna s R t, t R u sin s R u. */
export function transitivityCounterexample(r: Relation): [string, string, string] | undefined {
  for (const [s, t] of r) for (const [t2, u] of r) if (t === t2 && !hasPair(r, s, u)) return [s, t, u]
  return undefined
}

/** Un par s ≠ t con s R t y t R s. */
export const antisymmetryCounterexample = (r: Relation) => r.find(([s, t]) => s !== t && hasPair(r, t, s))

/** Dos elementos que no se pueden comparar: ni s R t ni t R s. */
export function totalityCounterexample(S: string[], r: Relation): [string, string] | undefined {
  for (const s of S) for (const t of S) if (!hasPair(r, s, t) && !hasPair(r, t, s)) return [s, t]
  return undefined
}

export const isReflexive = (S: string[], r: Relation) => reflexivityCounterexample(S, r) === undefined
export const isSymmetric = (r: Relation) => symmetryCounterexample(r) === undefined
export const isAntisymmetric = (r: Relation) => antisymmetryCounterexample(r) === undefined

export const isPreorder = (S: string[], r: Relation) => isReflexive(S, r) && isTransitive(r)
export const isPartialOrder = (S: string[], r: Relation) => isPreorder(S, r) && isAntisymmetric(r)
export const isTotalOrder = (S: string[], r: Relation) =>
  isPartialOrder(S, r) && totalityCounterexample(S, r) === undefined
export const isEquivalence = (S: string[], r: Relation) => isPreorder(S, r) && isSymmetric(r)

/** Las clases de una equivalencia: cada una es el conjunto de los relacionados con un elemento. */
export function equivalenceClasses(S: string[], r: Relation): string[][] {
  const classes: string[][] = []
  for (const s of S) {
    if (classes.some((c) => c.includes(s))) continue
    classes.push(S.filter((t) => hasPair(r, s, t)))
  }
  return classes
}

/** Los k con s ≤ k y t ≤ k. */
export const upperBounds = (S: string[], le: Relation, s: string, t: string) =>
  S.filter((k) => hasPair(le, s, k) && hasPair(le, t, k))

/** Los n con n ≤ s y n ≤ t. */
export const lowerBounds = (S: string[], le: Relation, s: string, t: string) =>
  S.filter((n) => hasPair(le, n, s) && hasPair(le, n, t))

/** La menor cota superior, si existe (2.2.3). */
export function join(S: string[], le: Relation, s: string, t: string) {
  const ub = upperBounds(S, le, s, t)
  return ub.find((j) => ub.every((k) => hasPair(le, j, k)))
}

/** La mayor cota inferior, si existe (2.2.3). */
export function meet(S: string[], le: Relation, s: string, t: string) {
  const lb = lowerBounds(S, le, s, t)
  return lb.find((m) => lb.every((n) => hasPair(le, n, m)))
}

/** R ∪ {(s, s) | s ∈ S} (Ejercicio 2.2.6). */
export const reflexiveClosure = (S: string[], r: Relation): Relation => [
  ...r,
  ...S.filter((s) => !hasPair(r, s, s)).map((s) => [s, s] as const),
]

/** R⁺ (Ejercicio 2.2.7). */
export const transitiveClosure = (r: Relation) => {
  const steps = transitiveClosureSteps(r)
  return steps[steps.length - 1]
}

/** R*: la clausura reflexiva de R⁺. */
export const reflexiveTransitiveClosure = (S: string[], r: Relation) => reflexiveClosure(S, transitiveClosure(r))

/**
 * Pares cubiertos de un orden parcial: s < t sin nada en el medio. Son las
 * líneas de un diagrama de Hasse.
 */
export function coveringPairs(S: string[], le: Relation): Relation {
  const lt = (a: string, b: string) => a !== b && hasPair(le, a, b)
  return le.filter(([s, t]) => lt(s, t) && !S.some((m) => lt(s, m) && lt(m, t)))
}

/** El orden parcial generado por un diagrama de Hasse (sus pares cubiertos). */
export const fromHasse = (S: string[], covers: Relation) => reflexiveTransitiveClosure(S, covers)

/** Igualdad de relaciones, ignorando orden y duplicados. */
export const sameRelation = (a: Relation, b: Relation) =>
  a.every(([s, t]) => hasPair(b, s, t)) && b.every(([s, t]) => hasPair(a, s, t))
