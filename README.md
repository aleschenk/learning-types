# Flechas y tipos

Compañero interactivo para aprender practicando con dos libros, cada uno en su sección:

- **TC · Teoría de Categorías**: *Category Theory Illustrated*, de Jencel Panic.
- **TT · Teoría de Tipos**: *Types and Programming Languages*, de Benjamin C. Pierce.

Por cada capítulo hay resúmenes propios, ejemplos y ejercicios que se corrigen solos. Además tiene un laboratorio donde
armás categorías y un motor verifica las leyes, y una leyenda de símbolos con las fórmulas desarmadas paso a paso. Todo
el sitio está en castellano.

Los capítulos se van sumando a medida que avanza la lectura.

## Cómo correrlo

Hace falta Node 22 y [pnpm](https://pnpm.io/).

```sh
make install   # pnpm install --frozen-lockfile
make dev       # servidor de desarrollo
make check     # typecheck, lint, tests y build
```

Documentación del proyecto: [docs/](docs/README.md).

## Créditos y licencia

- *Category Theory Illustrated* de Jencel Panic se publica bajo
  [CC BY-NC-SA 4.0](https://creativecommons.org/licenses/by-nc-sa/4.0/). Este sitio adapta sus ideas y ejemplos, y en
  la página de erratas cita frases cortas del libro.
- *Types and Programming Languages* de Benjamin C. Pierce (MIT Press, 2002) tiene copyright. Acá no se reproduce su
  texto: sólo hay resúmenes y ejercicios propios que siguen su estructura, y referencias a sus secciones.
- Este proyecto no tiene relación oficial con los autores ni con las editoriales. Los libros no están incluidos: hay
  que conseguirlos por separado.

Por ser una adaptación de material CC BY-NC-SA, este repositorio también se distribuye bajo
**CC BY-NC-SA 4.0** (ver [LICENSE](LICENSE)): podés copiarlo y modificarlo citando la fuente, sin fines comerciales y
con la misma licencia.
