# Documentación del proyecto

## Qué es

Un sitio web estático (Vite + React + TypeScript) para aprender practicando con dos libros, cada uno en su sección del
menú lateral:

- **TC · Teoría de Categorías**: *Category Theory Illustrated*.
- **TT · Teoría de Tipos**: *Types and Programming Languages*.

Los capítulos se agregan de a uno, cuando el usuario llega a ellos en la lectura. Los PDFs viven en `libros/`, que está
en `.gitignore`. La idea pedagógica:

1. Se lee el capítulo en el libro.
2. En el sitio hay un **resumen propio** del capítulo y **ejercicios con corrección automática**, que salen de los
   *Tasks* del libro y de ideas nuevas.
3. Un **laboratorio** permite construir categorías y recibir feedback de un motor que verifica las leyes. El mismo motor
   se reutiliza en todos los capítulos: monoides, órdenes, functores y transformaciones naturales.

Ritmo propuesto: un capítulo por semana.

## Índice

| Documento | Para qué |
|---|---|
| [plan.md](plan.md) | Hoja de ruta por módulo, estado y **próximo paso**. |
| [bitacora.md](bitacora.md) | Registro de cada sesión de trabajo (lo más nuevo arriba). |
| [arquitectura.md](arquitectura.md) | Estructura del código, diseño del motor y decisiones técnicas. |
| [errata.md](errata.md) | Posibles erratas del libro, usadas como ejercicio. |

## Estado actual (resumen)

- TC: capítulo 1 (Conjuntos) con 9 ejercicios, laboratorio de categorías con 10 ejemplos y la página de erratas.
- TT: capítulo 2 (Preliminares matemáticos), secciones 2.1 y 2.2, con 27 ejercicios.
- Página Símbolos: leyenda de notación con fórmulas desarmadas paso a paso.
- Pendiente: el resto, de a un capítulo. Ver [plan.md](plan.md).

## Cómo correrlo

Se usa **pnpm** (npm no, por seguridad). Todo pasa por el `Makefile`:

```sh
make install   # pnpm install --frozen-lockfile
make dev
make check     # typecheck, lint, tests y build
```

## Licencia y contenido

*Category Theory Illustrated* (Jencel Panic) es CC BY-NC-SA 4.0; *Types and Programming Languages* (Benjamin C.
Pierce) tiene copyright y su PDF no se publica. El repo entero se distribuye bajo CC BY-NC-SA 4.0 (ver `LICENSE` y la
sección de créditos del `README.md` de la raíz).
Los textos del sitio son reformulaciones propias, no copias.
