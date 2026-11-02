import { describe, expect, it } from 'vitest'
import {
  addArrow,
  build,
  checkCategory,
  compose,
  composePath,
  fillForced,
  inverseOf,
  pathsCommute,
  properties,
  removeArrow,
} from './category'
import { presets } from './presets'

const kinds = (c: Parameters<typeof checkCategory>[0]) => checkCategory(c).map((i) => i.kind)

describe('checkCategory', () => {
  it('todos los presets son categorías salvo los que están rotos a propósito', () => {
    const broken = new Set(['roto-asoc', 'cuadrado'])
    for (const p of presets) expect(checkCategory(p.make()).length === 0, p.id).toBe(!broken.has(p.id))
  })

  it('detecta composiciones faltantes', () => {
    const c = build({ objects: [['A', 0, 0], ['B', 0, 0], ['C', 0, 0]], arrows: [['f', 'A', 'B'], ['g', 'B', 'C']] })
    expect(kinds(c)).toEqual(['missing-composition'])
  })

  it('detecta composiciones mal tipadas', () => {
    const c = build({
      objects: [['A', 0, 0], ['B', 0, 0], ['C', 0, 0]],
      arrows: [['f', 'A', 'B'], ['g', 'B', 'C']],
      comp: [['g', 'f', 'f']],
    })
    expect(kinds(c)).toEqual(['ill-typed-composition'])
  })

  it('detecta falta de asociatividad', () => {
    const c = presets.find((p) => p.id === 'roto-asoc')!.make()
    expect(kinds(c)).toContain('associativity')
  })

  it('las identidades componen implícitamente', () => {
    const c = build({ objects: [['A', 0, 0], ['B', 0, 0]], arrows: [['f', 'A', 'B']] })
    expect(compose(c, 'f', 'id_A')).toBe('f')
    expect(compose(c, 'id_B', 'f')).toBe('f')
    expect(compose(c, 'f', 'f')).toBeUndefined()
  })
})

describe('caminos y diagramas', () => {
  const tri = presets.find((p) => p.id === 'triangulo')!.make()
  it('compone caminos en orden de aplicación', () => {
    expect(composePath(tri, ['f', 'g'])).toBe('h')
  })
  it('el triángulo conmuta', () => {
    expect(pathsCommute(tri, ['f', 'g'], ['h'])).toBe(true)
  })
})

describe('propiedades', () => {
  it('Z₃ es un grupo', () => {
    const p = properties(presets.find((p) => p.id === 'z3')!.make())
    expect(p.monoid && p.group && !p.thin).toBe(true)
  })
  it('un orden es un orden parcial', () => {
    const p = properties(presets.find((p) => p.id === 'orden')!.make())
    expect(p.thin && p.partialOrder && !p.groupoid).toBe(true)
  })
  it('encuentra inversas', () => {
    const c = presets.find((p) => p.id === 'iso')!.make()
    expect(inverseOf(c, 'f')).toBe('g')
    expect(properties(c).partialOrder).toBe(false)
  })
})

describe('edición', () => {
  it('fillForced completa los pares con un único candidato', () => {
    let c = build({ objects: [['A', 0, 0], ['B', 0, 0], ['C', 0, 0]], arrows: [['f', 'A', 'B'], ['g', 'B', 'C']] })
    c = addArrow(c, 'h', 'A', 'C', 'h')
    expect(checkCategory(fillForced(c))).toEqual([])
  })
  it('removeArrow limpia la tabla de composición', () => {
    const c = removeArrow(presets.find((p) => p.id === 'triangulo')!.make(), 'h')
    expect(c.composition).toEqual({})
  })
})
