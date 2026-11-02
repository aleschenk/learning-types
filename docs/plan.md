# Plan

Dos secciones, una por libro (TC y TT). Un módulo por capítulo. Cada módulo agrega una página en `src/pages/`, su
ruta en `src/App.tsx`, completa la entrada del capítulo en `src/content/books.ts` (con `route` y los ids de sus
ejercicios) y, si hace falta, suma lógica nueva en `src/core/` con tests.

Los capítulos se arman **cuando el usuario llega a ellos**, no por adelantado.

## Próximo paso

**TT, capítulo 2, secciones 2.3 (Secuencias) y 2.4 (Inducción)**, cuando el usuario llegue. Ideas para 2.4:
ejercicios de "completar la inducción" (caso base y paso), y enlazar desde las demostraciones de 2.2.7 y 2.2.8, que ya
usan inducción sin nombrarla.

**TC:** sigue pendiente el capítulo 2:

**Capítulo 2: De conjuntos a categorías.** Antes de arrancar, preguntarle al usuario por dónde va en la lectura y cómo
le resultó el capítulo 1. Si algo no le sirvió, se corrige primero.

Tareas concretas del capítulo 2:

1. Ejercicio de **producto**: dados A y B, armar A × B con sus proyecciones. Después, dado un "impostor" X con flechas a
   A y B, encontrar la flecha universal X → A × B, que es única. Verificarlo con `sets.ts`, que necesita productos y
   coproductos de conjuntos finitos.
2. Ejercicio de **coproducto** (unión disjunta), análogo.
3. Explicar la **definición de categoría** usando el laboratorio con links `#/lab?ejemplo=...`. Por ejemplo, arreglar el
   "Monoide trucho" y completar el "Cuadrado incompleto" para que conmute.
4. Ejercicios sobre **diagramas conmutativos**: el motor ya tiene `pathsCommute`, falta la UI para elegir dos caminos.
5. Pasar los *Tasks* del capítulo 2 del libro a ejercicios, incluido el Task 6 de "composición 2-dimensional"
   (ver [errata.md](errata.md)).

## Hoja de ruta

### Infraestructura

- [x] Dos secciones (TC y TT) con sidebar plegable por libro. Muestra los capítulos hechos y los 3 siguientes.
- [x] pnpm en lugar de npm, y `Makefile`.

- [x] Proyecto Vite + React + TS, vitest, eslint.
- [x] Router por hash con parámetros (`#/lab?ejemplo=z3`).
- [x] Progreso en localStorage (`src/lib/progress.ts`).
- [x] Motor de categorías finitas (`src/core/category.ts`) con tests.
- [x] Laboratorio: crear, mover y borrar objetos y flechas, tabla de composición, chequeo de leyes en vivo, propiedades (monoide, grupo, preorden, orden parcial, grupoide, discreta), isomorfismos y ejemplos precargados.
- [ ] Laboratorio: exportar/importar JSON (para guardar soluciones o compartirlas).
- [ ] Laboratorio: modo "elegir dos caminos" para chequear si un diagrama conmuta.
- [ ] Laboratorio: modos restringidos (sólo monoide, sólo preorden) para los capítulos 3 y 4.
- [ ] Mejor soporte mobile del laboratorio (hoy funciona, pero el canvas queda chico).
- [x] Repo público en GitHub (`learning-types` en la cuenta personal; el proyecto se llama `flechas-y-tipos`), con `LICENSE` CC BY-NC-SA 4.0 y créditos en el README.
- [ ] Publicación del sitio (opcional): build estático en GitHub Pages o similar.

### TC · Teoría de Categorías (*Category Theory Illustrated*)

- [x] **1. Conjuntos**: funciones, inyectiva/sobreyectiva/biyectiva, isomorfismos, composición, conteo de funciones, objetos inicial y terminal en Set. 9 ejercicios.
- [ ] **2. De conjuntos a categorías**: productos y coproductos (propiedad universal con "impostores"), definición de categoría, diagramas conmutativos.
- [ ] **3. Monoides**: Z₃, el grupo de Klein, Dih₃, tabla de Cayley interactiva, presentaciones con generadores y relaciones. El monoide como categoría de un objeto (el lab ya lo detecta).
- [ ] **4. Órdenes**: diagramas de Hasse, joins y meets validados por el motor, retículos (el retículo de colores del libro).
- [ ] **5. Lógica**: álgebras de Heyting (meet, join, exponencial), lógica intuicionista vs. clásica, Curry-Howard.
- [ ] **6. Tipos**: ejercicios en Haskell con un GHC local, codificaciones de Church. Hay que decidir si se corren localmente o se muestran como código para hacer aparte.
- [ ] **7. Functores**: definir el mapeo de objetos y flechas entre dos categorías del lab; el motor dice qué ley se rompe.
- [ ] **8. Transformaciones naturales**: cuadrados de naturalidad con `reverse`, `take1` y `[a]`, más uno que no es natural para detectar.

### TT · Teoría de Tipos (*Types and Programming Languages*)

- [ ] **1. Introducción** (sin ejercicios, quizás un resumen).
- [ ] **2. Preliminares matemáticos**
  - [x] 2.1 Conjuntos, relaciones y funciones: 15 ejercicios y, por cada definición, una caja "en criollo" más
        ejemplos trabajados y errores comunes.
  - [x] 2.2 Conjuntos ordenados: 12 ejercicios (clasificar propiedades, preorden, join y meet en Hasse, join que no
        existe, equivalencia con dos clases, completar clausuras reflexiva y transitiva, cadenas y bien fundado) y
        demostraciones guiadas de 2.2.6 a 2.2.8.
  - [ ] 2.3 Secuencias.
  - [ ] 2.4 Inducción.
- [ ] **3 en adelante**: de a uno.

### Transversales

- [x] Página **Símbolos** (`#/simbolos`): leyenda con buscador, una entrada por símbolo (cómo se lee, qué significa,
      ejemplo fácil y ejemplo del libro, diagramas de Venn) y "Fórmulas paso a paso" con 2.2.6 y 2.2.7 desarmadas y
      un visualizador de la clausura transitiva. **Al sumar un capítulo, agregar acá los símbolos nuevos que use.**

- [x] Página "Cazando erratas" (3 ítems).
- [x] Verificar las erratas contra el PDF del libro (página exacta). Ver [errata.md](errata.md).
- [ ] Glosario español–inglés de términos (join/supremo, meet/ínfimo, coproduct/coproducto…).
