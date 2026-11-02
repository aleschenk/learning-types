# flechas-y-tipos

Sitio para aprender practicando con dos libros, cada uno en su sección:

- **TC (Teoría de Categorías)**: *Category Theory Illustrated* (CC BY-NC-SA 4.0).
- **TT (Teoría de Tipos)**: *Types and Programming Languages*.

Los capítulos se suman de a uno, a medida que el usuario avanza la lectura: no adelantar capítulos sin que lo pida.
Los PDFs están en `libros/` (ignorado por git, nunca commitearlo).
Proyecto personal.

## Al empezar una sesión

1. Leé [docs/README.md](docs/README.md): resume el proyecto y enlaza al resto.
2. Leé la última entrada de [docs/bitacora.md](docs/bitacora.md) y la sección "Próximo paso" de [docs/plan.md](docs/plan.md).
3. Retomá desde ahí. Si el usuario pide otra cosa, eso tiene prioridad.

## Al terminar una sesión (obligatorio)

- Agregá una entrada **arriba de todo** en `docs/bitacora.md` con fecha, qué se hizo, qué decisiones se tomaron y qué quedó pendiente.
- Actualizá los checkboxes y el "Próximo paso" de `docs/plan.md`.
- Si cambió algo del diseño del motor o de la estructura, actualizá `docs/arquitectura.md`.

## Convenciones

- Docs y textos de la interfaz en **español rioplatense** (voseo). Identificadores de código en inglés.
- Los textos de los capítulos son **resúmenes propios**: nunca copiar párrafos del libro (licencia NC-SA, y además el valor está en reformular).
- El repo es **público**: no poner rutas absolutas o del entorno local (`/home/...`, `~/...`), mails ni datos de la máquina en docs ni código. Rutas siempre relativas al repo. A los autores de los libros sí hay que nombrarlos: la licencia CC BY-NC-SA exige atribución.
- Los commits usan la identidad global de git del dueño (cuenta personal). No configurar otra identidad en el repo ni usar `--author`. El remoto va por SSH (`git@github.com:...`), que usa la clave personal; por HTTPS se usaría el token de otra cuenta y da 403.
- Toda lógica matemática va en `src/core/` (TypeScript puro, sin React) y lleva tests en vitest.
- **No usar npm ni npx.** El gestor es pnpm (`pnpm install`, `pnpm exec ...`) y los comandos van por el `Makefile`.
- Antes de dar algo por terminado: `make check` (typecheck, lint, tests y build).
- Para chequear la UI visualmente: `make preview` y capturas con `google-chrome --headless=new --screenshot=... "http://localhost:4317/#/lab?ejemplo=z3"`.
  Para cortar el server, no uses `pkill -f "vite preview"` en el mismo comando (mata la propia shell).

## Comandos

```sh
make install     # dependencias con pnpm (lockfile congelado)
make dev         # servidor de desarrollo
make test        # tests del motor (vitest)
make check       # todo lo que tiene que pasar antes de terminar
make help        # lista completa
```
