PNPM ?= pnpm
PORT ?= 4317

.PHONY: help install dev test lint typecheck build check preview clean

help: ## Lista los comandos
	@grep -E '^[a-z-]+:.*## ' $(MAKEFILE_LIST) | awk -F':.*## ' '{printf "  make %-10s %s\n", $$1, $$2}'

install: ## Instala dependencias (lockfile congelado, sin scripts de instalación)
	$(PNPM) install --frozen-lockfile

dev: ## Servidor de desarrollo
	$(PNPM) dev

test: ## Tests del motor (vitest)
	$(PNPM) test

lint: ## ESLint
	$(PNPM) exec eslint .

typecheck: ## TypeScript
	$(PNPM) exec tsc -b

build: ## Build de producción
	$(PNPM) build

check: typecheck lint test build ## Todo lo que tiene que pasar antes de dar algo por terminado

preview: build ## Sirve el build (puerto 4317, cambiable con PORT=...)
	$(PNPM) exec vite preview --port $(PORT)

clean: ## Borra dist y node_modules
	rm -rf dist node_modules
