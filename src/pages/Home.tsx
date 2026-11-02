import { books } from '../content/books'
import { resetProgress, useProgress } from '../lib/progress'

export function Home() {
  const { isSolved } = useProgress()
  return (
    <div className="prose">
      <h1>Flechas y tipos: aprender practicando</h1>
      <p>
        Un compañero de estudio para dos libros relacionados. Cada capítulo tiene un resumen propio y ejercicios que se
        corrigen solos. Los capítulos se van sumando a medida que avanza la lectura.
      </p>
      <div className="callout">
        Forma de uso sugerida: leé el capítulo en el libro y después hacé los ejercicios acá. Si un ejercicio no sale,
        volvé al libro.
      </div>

      {books.map((b) => {
        const ready = b.chapters.filter((c) => c.route)
        const next = b.chapters.filter((c) => !c.route)
        return (
          <section key={b.id}>
            <h2>
              {b.short} · {b.title}
            </h2>
            <p style={{ color: 'var(--muted)', marginTop: -8 }}>
              Libro: <em>{b.source}</em>. {b.intro}
            </p>
            {b.extras.length > 0 && (
              <p className="row">
                {b.extras.map((e) => (
                  <a key={e.route} href={`#${e.route}`}>
                    {e.label}
                  </a>
                ))}
              </p>
            )}
            {ready.map((c) => {
              const done = c.exercises.filter(isSolved).length
              const total = c.exercises.length
              return (
                <div key={c.n} className="card">
                  <div className="row" style={{ justifyContent: 'space-between' }}>
                    <h3 style={{ margin: 0, fontFamily: 'inherit', fontSize: '1.05rem' }}>
                      {c.n}. <a href={`#${c.route}`}>{c.title}</a>
                    </h3>
                    <span className={`badge ${done === total ? 'ok' : ''}`}>
                      {done}/{total} ejercicios
                    </span>
                  </div>
                  {c.summary && <p style={{ margin: '6px 0 0', color: 'var(--muted)' }}>{c.summary}</p>}
                </div>
              )
            })}
            <details>
              <summary>Próximamente ({next.length} capítulos)</summary>
              <ol className="soon-list">
                {next.map((c) => (
                  <li key={c.n} value={c.n}>
                    {c.title}
                  </li>
                ))}
              </ol>
            </details>
          </section>
        )
      })}

      <p style={{ fontSize: '0.85rem', color: 'var(--muted)', marginTop: 40 }}>
        Basado en <em>Category Theory Illustrated</em> de Jencel Panic (CC BY-NC-SA 4.0) y en{' '}
        <em>Types and Programming Languages</em> de Benjamin C. Pierce (MIT Press). Los textos de este sitio son
        resúmenes propios, sin relación oficial con los autores. Sitio no comercial, bajo CC BY-NC-SA 4.0.{' '}
        <button style={{ fontSize: '0.8rem' }} onClick={() => confirm('¿Borrar todo el progreso?') && resetProgress()}>
          Reiniciar progreso
        </button>
      </p>
    </div>
  )
}
