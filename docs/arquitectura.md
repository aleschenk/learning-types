# Arquitectura

## Estructura

```
src/
  core/                  lógica matemática pura (sin React), con tests
    category.ts          motor de categorías finitas
    sets.ts              conjuntos finitos y funciones (TC 1)
    relations.ts         relaciones, dom/range, funciones parciales y totales, preservación (TT 2.1);
                         propiedades con contraejemplo, órdenes, join/meet, clausuras, Hasse (TT 2.2)
    presets.ts           ejemplos precargados del laboratorio
    *.test.ts            vitest
  components/
    CategoryLab.tsx      laboratorio (canvas SVG + paneles)
    SetFunctionEditor.tsx  diagrama interno de una función, editable
    Exercise.tsx         tarjetas de ejercicio: FunctionExercise, CompositionExercise, NumberExercise,
                         SubsetExercise (elegir elementos), ChoiceExercise (opción única)
    Boxes.tsx            cajas de texto: Definition ("en criollo"), Example y Pitfall ("Ojo")
    SetDiagrams.tsx      diagramas de Venn (Venn) y conjuntos anidados (NestedSets), en SVG
    ClosureStepper.tsx   R₀, R₁, R₂, … de la clausura transitiva, paso a paso, sobre un grafo
    RelationGraph.tsx    relación sobre un conjunto como grafo (lazos, ida y vuelta curvada) o como diagrama de Hasse
    RelationGrid.tsx     relación como grilla S × T, editable; RelationExercise
  content/
    books.ts             los dos libros (TC y TT), sus capítulos y los ids de ejercicios de cada uno
  lib/
    router.ts            router por hash: useRoute(), queryParam()
    progress.ts          ejercicios resueltos en localStorage (useProgress, markSolved)
  lib/layout.ts          posiciones de nodos (circleLayout) para RelationGraph
  pages/                 una página por ruta; OrderedSetsSection es la sección 2.2, dentro del capítulo 2 de TT
  App.tsx                layout (sidebar con una sección plegable por libro) y tabla de rutas
```

Sin dependencias de runtime aparte de React. No hay backend: el sitio es estático.

## Motor de categorías (`src/core/category.ts`)

**Modelo.** `Category = { objects, arrows, composition }`.

- Cada objeto tiene exactamente una flecha identidad (`identity: true`, id `id_<objId>`) que `addObject` crea sola.
- `composition` es un mapa `compKey(g, f) = "g∘f"` → id de la flecha resultado. Sólo guarda pares de flechas
  **no-identidad**.
- `compose(c, g, f)` resuelve las identidades implícitamente (`g ∘ id = g`, `id ∘ f = f`). **Decisión**: así las leyes de
  identidad valen por construcción y la tabla que ve el usuario sólo tiene los pares que importan. Desventaja: no se
  puede armar a propósito una "categoría" que rompa las leyes de identidad. Si en el capítulo de functores hace falta,
  se agrega un modo explícito.

**Verificación.** `checkCategory(c)` devuelve una lista de `Issue` con `kind`, un mensaje en español y las flechas
involucradas (el lab las resalta). Revisa:

1. una identidad por objeto;
2. que todo par componible tenga composición definida y bien tipada (de `src(f)` a `tgt(g)`);
3. la asociatividad sobre ternas no-identidad, sólo si 2 está completo.

**Otras utilidades.**

- `composePath` y `pathsCommute`: para diagramas conmutativos. Los caminos van en orden de aplicación: `[f, g]` = g ∘ f.
- `inverseOf` y `properties`: monoide, grupo, delgada/preorden, orden parcial, grupoide, discreta, isomorfismos.
- `fillForced`: completa las composiciones que tienen un solo candidato. En categorías delgadas completa todo.
- `build(spec)`: construcción declarativa usando los nombres como ids, para presets y tests.
- Todas las funciones de edición son puras: devuelven una `Category` nueva.

## Laboratorio (`CategoryLab.tsx`)

- Tres modos: mover/seleccionar, agregar objeto y agregar flecha (se clickea el origen y después el destino, y se le
  pone nombre).
- Las flechas paralelas se curvan con offsets distintos. La normal se calcula sobre un orden canónico del par, para que
  A→B y B→A no se pisen. Los endomorfismos se dibujan como lazos en abanico.
- El estado se guarda en localStorage (`ct-lab-v1`). `#/lab?ejemplo=<id>` carga un preset y tiene prioridad sobre lo
  guardado. Los ids están en `presets.ts`: `vacia, uno, flecha, triangulo, iso, orden, z2, z3, roto-asoc, cuadrado`.

## Secciones y rutas

- Rutas de capítulos con prefijo de libro: `#/tc/conjuntos`, `#/tt/preliminares`. `#/conjuntos` queda como alias.
- El laboratorio (`#/lab`) y las erratas (`#/errata`) son `extras` de TC. Se dejaron sin prefijo para no romper los
  links `#/lab?ejemplo=...` que ya están en los textos.
- `bookOf(route)` dice a qué libro pertenece una ruta. El sidebar abre esa sección.
- `#/simbolos?ver=<id>` salta a una entrada de la leyenda (`useQueryParam` en `router.ts` escucha el hash aunque la
  ruta no cambie). Para links internos usar siempre `#/simbolos?ver=...`, nunca `#ancla`: con el router por hash, un
  `#ancla` suelto cambia la ruta y manda al inicio.
- Ids de ejercicios: `c1-*` para TC y `tt<capítulo>-*` para TT. El progreso es uno solo en localStorage.

## Ejercicios

- Cada ejercicio tiene un id estable (`c1-total`, etc.). Al resolverlo se llama a `markSolved(id)`.
- El progreso por capítulo se calcula con la lista `exercises` de `books.ts`. **Al agregar un ejercicio hay que
  sumar su id ahí**, si no, no cuenta.
- Para un tipo nuevo de ejercicio, agregar un componente en `Exercise.tsx` que use `ExerciseCard` y `markSolved`.

## Estilo

- Tokens de color en `:root` con variante oscura (`prefers-color-scheme`).
- Tipografía serif para títulos y sans para el cuerpo. Los SVG usan `var(--...)` para respetar el tema.
