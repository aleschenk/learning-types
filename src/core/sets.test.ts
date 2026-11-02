import { describe, expect, it } from 'vitest'
import {
  allFunctions,
  composeFn,
  countFunctions,
  inverse,
  isBijective,
  isInjective,
  isSurjective,
  isTotal,
  sameFn,
  type FiniteSet,
} from './sets'

const A: FiniteSet = { name: 'A', elements: ['a', 'b', 'c'] }
const B: FiniteSet = { name: 'B', elements: ['1', '2', '3'] }

describe('funciones finitas', () => {
  it('clasifica funciones', () => {
    const f = { a: '1', b: '1', c: '2' }
    expect(isTotal(A, f)).toBe(true)
    expect(isInjective(A, f)).toBe(false)
    expect(isSurjective(A, B, f)).toBe(false)
    expect(isTotal(A, { a: '1' })).toBe(false)
  })

  it('las biyecciones tienen inversa', () => {
    const f = { a: '2', b: '3', c: '1' }
    expect(isBijective(A, B, f)).toBe(true)
    const g = inverse(A, B, f)!
    expect(sameFn(A, composeFn(A, f, g), { a: 'a', b: 'b', c: 'c' })).toBe(true)
  })

  it('cuenta funciones', () => {
    expect(countFunctions(2, 3)).toBe(9)
    expect(countFunctions(0, 5)).toBe(1)
    expect(countFunctions(3, 0)).toBe(0)
    expect(allFunctions(A, B)).toHaveLength(27)
  })
})
