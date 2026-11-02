// Índice del sitio: una sección por libro y un módulo por capítulo.
// `exercises` lista los ids de ejercicios del módulo, para calcular el progreso.
// Un capítulo sin `route` todavía no está implementado.

export interface Chapter {
  n: number
  title: string
  route?: string
  summary?: string
  exercises: string[]
}

export interface Book {
  id: 'tc' | 'tt'
  short: string
  title: string
  source: string
  intro: string
  chapters: Chapter[]
  extras: { route: string; label: string }[]
}

const soon = (n: number, title: string, summary?: string): Chapter => ({ n, title, summary, exercises: [] })

export const books: Book[] = [
  {
    id: 'tc',
    short: 'TC',
    title: 'Teoría de Categorías',
    source: 'Category Theory Illustrated',
    intro: 'Objetos, flechas y composición. Un laboratorio para armar categorías y un motor que verifica las leyes.',
    chapters: [
      {
        n: 1,
        title: 'Conjuntos',
        route: '/tc/conjuntos',
        summary: 'Conjuntos, funciones, composición e isomorfismos. La base sobre la que se construye todo lo demás.',
        exercises: ['c1-total', 'c1-no-iny', 'c1-sobre', 'c1-iso', 'c1-comp', 'c1-cuenta-23', 'c1-cuenta-32', 'c1-terminal', 'c1-inicial'],
      },
      soon(2, 'De conjuntos a categorías', 'Productos, coproductos y propiedades universales. Definición de categoría.'),
      soon(3, 'Monoides', 'Monoides y grupos como categorías de un solo objeto.'),
      soon(4, 'Órdenes', 'Preórdenes, órdenes parciales, joins, meets y retículos.'),
      soon(5, 'Lógica', 'Lógica intuicionista, álgebras de Heyting y la correspondencia Curry-Howard.'),
      soon(6, 'Tipos', 'Tipos como objetos, funciones como flechas. Codificaciones de Church.'),
      soon(7, 'Functores', 'Flechas entre categorías: functores y sus leyes.'),
      soon(8, 'Transformaciones naturales', 'Flechas entre functores y cuadrados de naturalidad.'),
    ],
    extras: [
      { route: '/lab', label: '🧪 Laboratorio' },
      { route: '/errata', label: '🔎 Cazando erratas' },
    ],
  },
  {
    id: 'tt',
    short: 'TT',
    title: 'Teoría de Tipos',
    source: 'Types and Programming Languages',
    intro: 'Sistemas de tipos para lenguajes de programación: semántica operacional, cálculo lambda y sus extensiones.',
    chapters: [
      soon(1, 'Introducción'),
      {
        n: 2,
        title: 'Preliminares matemáticos',
        route: '/tt/preliminares',
        summary: 'Conjuntos, relaciones, funciones parciales, órdenes, clausuras y órdenes bien fundados: el vocabulario que usa todo el libro.',
        exercises: [
          'tt2-comprension',
          'tt2-diferencia',
          'tt2-potencia',
          'tt2-potencia-vacio',
          'tt2-pertenece',
          'tt2-numerable',
          'tt2-producto',
          'tt2-cuantas-rel',
          'tt2-dom',
          'tt2-range',
          'tt2-parcial',
          'tt2-no-funcion',
          'tt2-mixfix',
          'tt2-fail',
          'tt2-preserva',
          'tt2-props-a',
          'tt2-props-b',
          'tt2-props-c',
          'tt2-preorden',
          'tt2-join',
          'tt2-meet',
          'tt2-sin-join',
          'tt2-equivalencia',
          'tt2-clausura-refl',
          'tt2-clausura-trans',
          'tt2-cadena',
          'tt2-bien-fundado',
        ],
      },
      soon(3, 'Expresiones aritméticas sin tipos'),
      soon(4, 'Implementación en ML de expresiones aritméticas'),
      soon(5, 'Cálculo lambda sin tipos'),
      soon(6, 'Representación sin nombres de los términos'),
      soon(7, 'Implementación en ML del cálculo lambda'),
      soon(8, 'Expresiones aritméticas con tipos'),
      soon(9, 'Cálculo lambda simplemente tipado'),
      soon(10, 'Implementación en ML de tipos simples'),
      soon(11, 'Extensiones simples'),
      soon(12, 'Normalización'),
      soon(13, 'Referencias'),
      soon(14, 'Excepciones'),
      soon(15, 'Subtipado'),
      soon(16, 'Metateoría del subtipado'),
      soon(17, 'Implementación en ML del subtipado'),
      soon(18, 'Caso de estudio: objetos imperativos'),
      soon(19, 'Caso de estudio: Featherweight Java'),
      soon(20, 'Tipos recursivos'),
      soon(21, 'Metateoría de tipos recursivos'),
      soon(22, 'Reconstrucción de tipos'),
      soon(23, 'Tipos universales'),
      soon(24, 'Tipos existenciales'),
      soon(25, 'Implementación en ML de System F'),
      soon(26, 'Cuantificación acotada'),
      soon(27, 'Caso de estudio: objetos imperativos, otra vez'),
      soon(28, 'Metateoría de la cuantificación acotada'),
      soon(29, 'Operadores de tipos y kinds'),
      soon(30, 'Polimorfismo de orden superior'),
      soon(31, 'Subtipado de orden superior'),
      soon(32, 'Caso de estudio: objetos puramente funcionales'),
    ],
    extras: [],
  },
]

/** Libro al que pertenece una ruta (por prefijo de capítulo o por extra). */
export const bookOf = (route: string) =>
  books.find((b) => route.startsWith(`/${b.id}/`) || b.extras.some((e) => e.route === route))
