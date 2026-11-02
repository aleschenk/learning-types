import { describe, expect, it } from 'vitest'
import {
  conflicts,
  difference,
  dom,
  isPartialFunction,
  isTotalFunction,
  powerset,
  preservationCounterexample,
  preserves,
  range,
  sameSet,
  togglePair,
  undefinedOn,
  antisymmetryCounterexample,
  coveringPairs,
  equivalenceClasses,
  fromHasse,
  hasPair,
  isEquivalence,
  isPartialOrder,
  isPreorder,
  isTotalOrder,
  isTransitive,
  join,
  meet,
  reflexiveClosure,
  reflexiveTransitiveClosure,
  reflexivityCounterexample,
  sameRelation,
  symmetryCounterexample,
  totalityCounterexample,
  transitiveClosure,
  transitivityCounterexample,
  upperBounds,
  transitiveClosureSteps,
  type Relation,
} from './relations'

const S = ['1', '2', '3']
const T = ['a', 'b', 'c']

describe('relaciones', () => {
  it('dom y range', () => {
    const r: Relation = [
      ['1', 'a'],
      ['1', 'b'],
      ['3', 'a'],
    ]
    expect(dom(S, r)).toEqual(['1', '3'])
    expect(range(T, r)).toEqual(['a', 'b'])
  })

  it('función parcial vs. total', () => {
    const noFn: Relation = [
      ['1', 'a'],
      ['1', 'b'],
    ]
    expect(conflicts(S, noFn)).toEqual(['1'])
    expect(isPartialFunction(S, noFn)).toBe(false)

    const parcial: Relation = [
      ['1', 'a'],
      ['3', 'a'],
    ]
    expect(isPartialFunction(S, parcial)).toBe(true)
    expect(isTotalFunction(S, parcial)).toBe(false)
    expect(undefinedOn(S, parcial)).toEqual(['2'])

    const total = togglePair(parcial, '2', 'c')
    expect(isTotalFunction(S, total)).toBe(true)
    expect(togglePair(total, '2', 'c')).toEqual(parcial)
  })

  it('la relación vacía es función parcial, y total sólo sobre el vacío', () => {
    expect(isPartialFunction(S, [])).toBe(true)
    expect(isTotalFunction(S, [])).toBe(false)
    expect(isTotalFunction([], [])).toBe(true)
  })

  it('preservación de un predicado', () => {
    // s R s' sii s' = s + 2
    const paso: Relation = [
      ['0', '2'],
      ['1', '3'],
      ['2', '4'],
      ['3', '5'],
    ]
    expect(preserves(paso, ['1', '3', '5'])).toBe(true)
    expect(preservationCounterexample(paso, ['0', '1'])).toEqual(['0', '2'])
    expect(preserves(paso, [])).toBe(true)
  })

  it('diferencia, potencia e igualdad de conjuntos', () => {
    expect(difference(['1', '2', '3', '4'], ['2', '4', '6'])).toEqual(['1', '3'])
    expect(powerset(['a', 'b', 'c'])).toHaveLength(8)
    expect(powerset([])).toEqual([[]])
    expect(sameSet(['a', 'b'], ['b', 'a'])).toBe(true)
    expect(sameSet(['a'], ['a', 'b'])).toBe(false)
  })
})

describe('clausura transitiva', () => {
  it('una cadena a → b → c → d → e', () => {
    const r: Relation = [
      ['a', 'b'],
      ['b', 'c'],
      ['c', 'd'],
      ['d', 'e'],
    ]
    const steps = transitiveClosureSteps(r)
    // Cada paso duplica el largo de los caminos que se "acortan": 1, 2, 4.
    expect(steps.map((s) => s.length)).toEqual([4, 7, 10])
    const plus = steps[steps.length - 1]
    expect(hasPair(plus, 'a', 'e')).toBe(true)
    expect(hasPair(plus, 'e', 'a')).toBe(false)
    expect(isTransitive(plus)).toBe(true)
    expect(isTransitive(r)).toBe(false)
  })

  it('una relación transitiva no cambia', () => {
    const r: Relation = [
      ['a', 'b'],
      ['b', 'c'],
      ['a', 'c'],
    ]
    expect(transitiveClosureSteps(r)).toEqual([r])
  })

  it('con ciclos aparecen pares (s, s)', () => {
    const steps = transitiveClosureSteps([
      ['a', 'b'],
      ['b', 'a'],
    ])
    const plus = steps[steps.length - 1]
    expect(hasPair(plus, 'a', 'a') && hasPair(plus, 'b', 'b')).toBe(true)
  })
})

describe('órdenes (TT 2.2)', () => {
  const S3 = ['a', 'b', 'c']
  // Divisores de 12 con "divide".
  const D = ['1', '2', '3', '4', '6', '12']
  const divides: Relation = D.flatMap((x) => D.filter((y) => Number(y) % Number(x) === 0).map((y) => [x, y] as const))

  it('propiedades con contraejemplos', () => {
    const r: Relation = [
      ['a', 'b'],
      ['b', 'a'],
      ['b', 'c'],
    ]
    expect(reflexivityCounterexample(S3, r)).toBe('a')
    expect(symmetryCounterexample(r)).toEqual(['b', 'c'])
    expect(transitivityCounterexample(r)).toEqual(['a', 'b', 'a'])
    expect(antisymmetryCounterexample(r)).toEqual(['a', 'b'])
  })

  it('preorden, orden parcial, total y equivalencia', () => {
    expect(isPartialOrder(D, divides)).toBe(true)
    expect(isTotalOrder(D, divides)).toBe(false)
    expect(totalityCounterexample(D, divides)).toEqual(['2', '3'])
    const both: Relation = [...reflexiveClosure(S3, []), ['a', 'b'], ['b', 'a']]
    expect(isPreorder(S3, both)).toBe(true)
    expect(isPartialOrder(S3, both)).toBe(false)
    expect(isEquivalence(S3, both)).toBe(true)
    expect(equivalenceClasses(S3, both)).toEqual([['a', 'b'], ['c']])
  })

  it('join y meet: mcm y mcd en los divisores de 12', () => {
    expect(join(D, divides, '4', '6')).toBe('12')
    expect(meet(D, divides, '4', '6')).toBe('2')
    expect(join(D, divides, '2', '3')).toBe('6')
    expect(meet(D, divides, '4', '3')).toBe('1')
  })

  it('join que no existe: dos cotas superiores incomparables', () => {
    const P = ['b', 'c', 'd', 'e']
    const le = fromHasse(P, [
      ['b', 'd'],
      ['b', 'e'],
      ['c', 'd'],
      ['c', 'e'],
    ])
    expect(upperBounds(P, le, 'b', 'c')).toEqual(['d', 'e'])
    expect(join(P, le, 'b', 'c')).toBeUndefined()
  })

  it('clausuras y Hasse', () => {
    const chain: Relation = [
      ['a', 'b'],
      ['b', 'c'],
    ]
    expect(sameRelation(transitiveClosure(chain), [...chain, ['a', 'c']])).toBe(true)
    const star = reflexiveTransitiveClosure(S3, chain)
    expect(isPartialOrder(S3, star) && isTotalOrder(S3, star)).toBe(true)
    expect(sameRelation(coveringPairs(S3, star), chain)).toBe(true)
    expect(sameRelation(coveringPairs(D, divides), [['1', '2'], ['1', '3'], ['2', '4'], ['2', '6'], ['3', '6'], ['4', '12'], ['6', '12']])).toBe(true)
  })
})
