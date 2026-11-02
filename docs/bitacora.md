# Bitácora

Una entrada por sesión, **la más nueva arriba**. Cada una dice qué se hizo, qué se decidió y qué quedó pendiente.

---

## 2026-11-02: Sesión 5, preparación para publicar en GitHub

**Contexto.** El usuario quiere subir el proyecto a GitHub como repo público, sin exponer datos personales.

**Hecho.**

- Nombre nuevo: **flechas-y-tipos** (`package.json`, título, marca del sidebar, README, CLAUDE.md). La carpeta local
  no se renombró. Las claves de localStorage (`ct-progress-v1`, `ct-lab-v1`) se dejaron igual para no perder progreso.
- Auditoría de los archivos que entran al repo: sin rutas locales, nombres, mails ni secretos. `libros/`,
  `node_modules/` y `dist/` están ignorados.
- Se probó una identidad de git local con la cuenta de trabajo y su mail `noreply`, pero el usuario va a publicar
  con su **cuenta personal** (acepta que se vea su nombre). Se sacó esa configuración: los commits usan la identidad
  global, y el remoto (`aleschenk/learning-types`) pasó a SSH, porque por HTTPS se autenticaba con el token de la
  cuenta de trabajo y daba 403.
- `LICENSE` con el texto completo de CC BY-NC-SA 4.0 (obligatorio por adaptar *Category Theory Illustrated*) y
  sección de créditos en el README y en el pie del inicio, con los autores de los dos libros.
- CLAUDE.md: la regla de privacidad ahora dice explícitamente "datos del dueño del repo", y que a los autores de los
  libros sí hay que nombrarlos (atribución).
- Primer commit.

**Pendiente.**

- Push al repo `learning-types` de la cuenta personal (lo hace el usuario).

---

## 2026-11-02: Sesión 4, TT 2.2 (Conjuntos ordenados)

**Contexto.** El usuario preguntó por un nombre nuevo para el proyecto (se propusieron `flechas-y-tipos`, que es el
recomendado, `morfismo`, `cuaderno-lambda` y `categorias-y-tipos`; **todavía no eligió**, no se renombró nada) y pidió
seguir con lo pendiente.

**Hecho.**

- Motor: propiedades de relaciones con contraejemplos, preorden, orden parcial y total, equivalencia y sus clases,
  cotas, join y meet, clausuras reflexiva, transitiva y reflexiva-transitiva, pares cubiertos (Hasse). 28 tests.
- `RelationGraph` (grafo con lazos y flechas de ida y vuelta curvadas, o diagrama de Hasse) y `lib/layout.ts`.
- `RelationExercise` acepta `initial` (para "completar la clausura") y `name`.
- Sección 2.2 en `OrderedSetsSection.tsx`, dentro del capítulo 2 de TT: definiciones 2.2.1 a 2.2.10 con cajas, tabla
  de propiedades de relaciones conocidas, Hasse de P({a, b}) y de los divisores de 12, join que no existe,
  equivalencia mod 3, demostraciones guiadas (plegadas) de los Ejercicios 2.2.6, 2.2.7 y 2.2.8, y 12 ejercicios.
- El capítulo tiene un índice arriba (2.1 y 2.2) con botones que hacen scroll. Las definiciones de 2.1 pasaron a h3.
- Símbolos: entradas nuevas para ≤ / < y ⊑. La sección de fórmulas ahora enlaza al capítulo.

**Decisiones.**

- En "¿cuál es bien fundado?" se descartó "strings ordenados por largo": con s < t definido como s ≤ t y s ≠ t, un
  preorden con empates tiene cadenas decrecientes infinitas (a, b, a, b, …). Se agregó una caja "Ojo" sobre eso.

**Pendiente.**

- TT 2.3 y 2.4 cuando el usuario llegue.

---

## 2026-10-31: Sesión 3, más explicación en TT 2.1

**Contexto.** El usuario pidió más ejemplos y explicaciones más completas de las definiciones de 2.1. Su mensaje
llegó cortado ("También sería bueno…"): falta saber qué más quería.

**Hecho.**

- Componentes `Definition`, `Example` y `Pitfall` en `src/components/Boxes.tsx`, con estilos `.box`.
- TT 2.1 reescrito: cada definición tiene su versión "en criollo", uno o más ejemplos (matemáticos y de programación)
  y, donde hace falta, una caja de errores comunes. Por ejemplo: ∅ vs. {∅}, ∈ vs. ⊆, "codominio" en TAPL vs. en TC y
  la dirección de la preservación.
- 5 ejercicios nuevos (15 en total): potencia del vacío, elemento o subconjunto, numerables, producto cartesiano y
  cantidad de relaciones.
- Verificado: `make check` en verde y captura headless de la página.

- Después: página **Símbolos** (`src/pages/SymbolsPage.tsx`) con buscador y unas 40 entradas en 5 grupos (cómo leer
  la notación, conjuntos, relaciones y funciones, lógica, lo que viene en TT). Al final, "Fórmulas paso a paso" con
  R′ = R ∪ {(s, s) | s ∈ S}, Rᵢ₊₁ = Rᵢ ∪ {…} y R⁺ = ⋃ᵢ Rᵢ desarmadas pieza por pieza. Lo pidió el usuario
  porque no entendía la fórmula del Ejercicio 2.2.7 (p. 18 del libro, p. 40 del PDF).
- `transitivityStep`, `transitiveClosureSteps` e `isTransitive` en `relations.ts`, con 3 tests (23 en total).
- Componentes `Venn`, `NestedSets` y `ClosureStepper`.

**Decisiones.**

- Los símbolos se explican en la leyenda (significado general) **y** en el capítulo donde aparecen (en contexto),
  enlazando a la leyenda. La sección de fórmulas adelanta 2.2.7 porque el usuario ya la estaba leyendo.

**Pendiente.**

- El usuario no se acordó de qué quería en el mensaje cortado: no hay nada pendiente por eso.
- TT 2.2: el usuario ya está leyendo por la p. 18 del libro (2.2.7). Es lo próximo.

---

## 2026-10-30: Sesión 2, dos libros (TC y TT) y pnpm

**Contexto.** El usuario suma un segundo libro, *Types and Programming Languages*, para aprender Teoría de Tipos. Pidió
dos secciones (una por libro), cada capítulo con su página en un menú lateral, e ir capítulo por capítulo a medida que
lee. También pidió dejar npm por seguridad y usar pnpm con un Makefile.

**Hecho.**

- `libros/` con los PDFs (y el EPUB de TC), agregado a `.gitignore`.
- pnpm en lugar de npm: se borró `package-lock.json` y se generó `pnpm-lock.yaml`. `packageManager` fijado y el
  script de instalación de esbuild queda ignorado (`pnpm.ignoredBuiltDependencies`); el build anda igual.
- `Makefile` con `install`, `dev`, `test`, `lint`, `typecheck`, `build`, `check`, `preview`, `clean` y `help`.
- `src/content/chapters.ts` se reemplazó por `books.ts`, con los dos libros y los 32 capítulos de TT listados.
- Sidebar con una sección plegable por libro. Se abre la del libro actual y muestra los capítulos hechos más los 3
  siguientes. Inicio con un bloque por libro.
- Motor nuevo `src/core/relations.ts` con 5 tests (20 en total).
- Componentes nuevos: `SubsetExercise`, `ChoiceExercise`, `RelationGrid` y `RelationExercise`.
- TT capítulo 2, sección 2.1, con resúmenes propios de las definiciones 2.1.1 a 2.1.10 y 10 ejercicios.
- Verificado: `make check` en verde y capturas headless del inicio y del capítulo de TT.

**Decisiones.**

- Rutas con prefijo de libro (`/tc/...`, `/tt/...`). `/lab` y `/errata` siguen sin prefijo y quedan como extras de TC.
- TT se arma de a una **sección** cuando el capítulo es largo. El capítulo 2 tiene sólo 2.1 por ahora, porque es lo que
  el usuario está leyendo.
- Las referencias a páginas de TT usan el número del libro; el del PDF es 22 más (p. 15 del libro = p. 37 del PDF).

**Pendiente.**

- TT 2.2 (Conjuntos ordenados) cuando el usuario llegue. Ver [plan.md](plan.md).
- TC capítulo 2 sigue pendiente.
- Sigue sin haber commits: preguntarle al usuario.

---

## 2026-10-18: Sesión 1, arranque del proyecto

**Contexto.** La idea es aprender teoría de categorías con *Category Theory Illustrated* y hacer una web para
estudiar de forma didáctica. Se propuso un motor común (el "laboratorio de categorías") y un módulo por capítulo.
Se pidió arrancar y documentar todo en `docs/` para poder retomar en otra sesión.

**Hecho.**

- Proyecto creado con Vite 6, React 19, TypeScript 5.8 y vitest 3.
- Motor de categorías finitas (`src/core/category.ts`): leyes, composición de caminos, propiedades e isomorfismos.
  Hay 12 tests.
- Funciones entre conjuntos finitos (`src/core/sets.ts`): total, inyectiva, sobreyectiva, biyectiva, inversa,
  composición y conteo. Hay 3 tests.
- Laboratorio interactivo con 10 ejemplos, incluidos dos rotos a propósito ("Monoide trucho" y "Cuadrado incompleto").
- Capítulo 1 (Conjuntos) con 9 ejercicios autocorregibles: armar funciones con condiciones, componer a mano y contar
  funciones (que lleva a los objetos inicial y terminal).
- Página "Cazando erratas" con 3 ítems.
- Inicio con el progreso por capítulo y la barra lateral con el índice.
- Docs: este directorio y `CLAUDE.md` en la raíz.
- Verificado: `tsc`, `eslint`, 15 tests y `build` en verde, más capturas headless del lab (triángulo, Z₃, cuadrado y
  monoide trucho) y del capítulo 1.

**Decisiones.**

- Las identidades componen implícitamente (ver [arquitectura.md](arquitectura.md)). La tabla de composición sólo muestra
  los pares interesantes.
- Se saltó el prototipo como Artifact publicado y se fue directo al proyecto local, porque se pidió "el proyecto"
  con docs para retomar.
- Textos de los capítulos: resúmenes propios en español, sin copiar el libro.
- Sin librerías extra: SVG a mano en lugar de una librería de grafos, y router por hash propio.

**Pendiente / ideas.**

- No se hizo commit: el repo tiene `git init` en `main`, todo sin commitear. Hay que preguntarle al usuario.
- ~~Las erratas no se verificaron contra el PDF.~~ Hecho el 2026-10-19: se encontró el PDF y se verificaron las tres
  (ver [errata.md](errata.md)). Hubo dos correcciones: la de "monoides son grupos" está en Functores (p. 413), no en
  Monoides, y el Task 6 sí trae respuesta, aunque muy corta.
- Próximo: capítulo 2. Ver [plan.md](plan.md).
