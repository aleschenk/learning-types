import { build, emptyCategory, type Category } from './category'

export interface Preset {
  id: string
  name: string
  description: string
  make: () => Category
}

export const presets: Preset[] = [
  {
    id: 'vacia',
    name: 'Vacía',
    description: 'Ningún objeto, ninguna flecha. También es una categoría (la categoría 0).',
    make: emptyCategory,
  },
  {
    id: 'uno',
    name: 'Un objeto',
    description: 'Un objeto con su identidad y nada más: la categoría 1. Es terminal en Cat.',
    make: () => build({ objects: [['★', 300, 220]] }),
  },
  {
    id: 'flecha',
    name: 'Una flecha',
    description: 'Dos objetos y una flecha f : A → B. La categoría más chica que no es discreta.',
    make: () => build({ objects: [['A', 180, 220], ['B', 420, 220]], arrows: [['f', 'A', 'B']] }),
  },
  {
    id: 'triangulo',
    name: 'Triángulo conmutativo',
    description: 'f : A → B, g : B → C y h : A → C con g ∘ f = h. El diagrama conmuta.',
    make: () =>
      build({
        objects: [['A', 160, 320], ['B', 300, 110], ['C', 440, 320]],
        arrows: [['f', 'A', 'B'], ['g', 'B', 'C'], ['h', 'A', 'C']],
        comp: [['g', 'f', 'h']],
      }),
  },
  {
    id: 'iso',
    name: 'Isomorfismo',
    description: 'f : A → B y g : B → A inversas entre sí: g ∘ f = idA y f ∘ g = idB.',
    make: () =>
      build({
        objects: [['A', 180, 220], ['B', 420, 220]],
        arrows: [['f', 'A', 'B'], ['g', 'B', 'A']],
        comp: [['g', 'f', 'id_A'], ['f', 'g', 'id_B']],
      }),
  },
  {
    id: 'orden',
    name: 'Orden 1 ≤ 2 ≤ 3',
    description: 'Un orden total visto como categoría: una flecha por cada "≤". La transitividad es la composición.',
    make: () =>
      build({
        objects: [['1', 140, 300], ['2', 300, 160], ['3', 460, 300]],
        arrows: [['a', '1', '2'], ['b', '2', '3'], ['c', '1', '3']],
        comp: [['b', 'a', 'c']],
      }),
  },
  {
    id: 'z2',
    name: 'Monoide Z₂',
    description: 'Un solo objeto y una flecha s con s ∘ s = id. Es el grupo de dos elementos (girar 180°).',
    make: () =>
      build({ objects: [['★', 300, 240]], arrows: [['s', '★', '★']], comp: [['s', 's', 'id_★']] }),
  },
  {
    id: 'z3',
    name: 'Monoide Z₃',
    description: 'Rotaciones de un triángulo: r (120°) y r² (240°). Un objeto, tres flechas.',
    make: () =>
      build({
        objects: [['★', 300, 240]],
        arrows: [['r', '★', '★'], ['r²', '★', '★']],
        comp: [['r', 'r', 'r²'], ['r', 'r²', 'id_★'], ['r²', 'r', 'id_★'], ['r²', 'r²', 'r']],
      }),
  },
  {
    id: 'roto-asoc',
    name: 'Monoide trucho',
    description: 'Un objeto con flechas a y b cuya tabla de composición NO es asociativa. Encontrá el problema y arreglalo.',
    make: () =>
      build({
        objects: [['★', 300, 240]],
        arrows: [['a', '★', '★'], ['b', '★', '★']],
        comp: [['a', 'a', 'b'], ['a', 'b', 'a'], ['b', 'a', 'a'], ['b', 'b', 'a']],
      }),
  },
  {
    id: 'cuadrado',
    name: 'Cuadrado incompleto',
    description: 'Dos caminos de A a D. Falta decidir las composiciones: ¿hacés que el cuadrado conmute o no?',
    make: () =>
      build({
        objects: [['A', 170, 120], ['B', 430, 120], ['C', 170, 340], ['D', 430, 340]],
        arrows: [['f', 'A', 'B'], ['g', 'A', 'C'], ['h', 'B', 'D'], ['k', 'C', 'D'], ['d₁', 'A', 'D'], ['d₂', 'A', 'D']],
      }),
  },
]
