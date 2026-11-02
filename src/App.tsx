import { bookOf, books } from './content/books'
import { useProgress } from './lib/progress'
import { useRoute } from './lib/router'
import { ErrataPage } from './pages/ErrataPage'
import { Home } from './pages/Home'
import { LabPage } from './pages/LabPage'
import { PreliminariesChapter } from './pages/PreliminariesChapter'
import { SetsChapter } from './pages/SetsChapter'
import { SymbolsPage } from './pages/SymbolsPage'

const pages: Record<string, () => React.ReactElement> = {
  '/': Home,
  '/tc/conjuntos': SetsChapter,
  '/tt/preliminares': PreliminariesChapter,
  '/lab': LabPage,
  '/errata': ErrataPage,
  '/simbolos': SymbolsPage,
}

const UPCOMING = 3

// Rutas viejas, de cuando había un solo libro.
const aliases: Record<string, string> = { '/conjuntos': '/tc/conjuntos' }

export default function App() {
  const raw = useRoute()
  const route = aliases[raw] ?? raw
  const { isSolved } = useProgress()
  const Page = pages[route] ?? Home
  const current = bookOf(route)
  const link = (to: string, label: React.ReactNode) => (
    <a key={to} href={`#${to}`} className={route === to ? 'active' : ''}>
      {label}
    </a>
  )

  return (
    <div className="layout">
      <aside className="sidebar">
        <a href="#/" className="brand">
          ∘ Flechas y tipos
        </a>
        <nav>
          {link('/', 'Inicio')}
          {link('/simbolos', '📖 Símbolos')}
          {books.map((b) => {
            const ids = b.chapters.flatMap((c) => c.exercises)
            // Para no tener un menú eterno: los capítulos hechos y unos pocos de los que siguen.
            const lastReady = b.chapters.reduce((last, c, i) => (c.route ? i : last), -1)
            const shown = b.chapters.slice(0, lastReady + 1 + UPCOMING)
            const hidden = b.chapters.length - shown.length
            return (
              // `key` incluye el libro actual para que al navegar se abra la sección que corresponde.
              <details key={`${b.id}-${current?.id === b.id}`} className="book" open={!current || current.id === b.id}>
                <summary>
                  <span>
                    <strong>{b.short}</strong> · {b.title}
                  </span>
                  <span className="badge">
                    {ids.filter(isSolved).length}/{ids.length}
                  </span>
                </summary>
                {b.extras.map((e) => link(e.route, e.label))}
                {shown.map((c) =>
                  c.route ? (
                    link(
                      c.route,
                      <>
                        <span>
                          {c.n}. {c.title}
                        </span>
                        <span className="badge">
                          {c.exercises.filter(isSolved).length}/{c.exercises.length}
                        </span>
                      </>,
                    )
                  ) : (
                    <a key={c.n} className="soon" title="Próximamente">
                      <span>
                        {c.n}. {c.title}
                      </span>
                    </a>
                  ),
                )}
                {hidden > 0 && (
                  <a href="#/" className="soon">
                    + {hidden} capítulos más
                  </a>
                )}
              </details>
            )
          })}
        </nav>
      </aside>
      <main key={route}>
        <Page />
      </main>
    </div>
  )
}
