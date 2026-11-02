// Posibles erratas del libro. Encontrar el error es un ejercicio en sí:
// primero se muestra la frase sospechosa y la explicación queda escondida.

const items = [
  {
    where: 'Functores, p. 413',
    claim:
      '"La categoría de grupos contiene a la categoría de monoides como subcategoría, ya que todos los monoides son grupos."',
    question: '¿Quién contiene a quién? Pensá en un monoide donde algún elemento no tenga inverso.',
    answer:
      'Es al revés: todo grupo es un monoide (uno donde todo elemento tiene inverso), así que Grp es una subcategoría de Mon, y no Mon de Grp. Contraejemplo de "todo monoide es grupo": los naturales con la suma. El 0 es neutro, pero el 3 no tiene inverso en ℕ.',
  },
  {
    where: 'Órdenes, definición de join (pp. 209 y 240)',
    claim: 'El join G de A y B es menor que cualquier otro P "tal que P ≤ A y P ≤ B".',
    question: '¿Los P con los que se compara G están arriba o abajo de A y B?',
    answer:
      'G es la menor cota superior, así que hay que compararlo con las otras cotas superiores: los P tales que A ≤ P y B ≤ P. Con "P ≤ A y P ≤ B" se describen cotas inferiores, que son las que aparecen en la definición del meet. El error está repetido en las dos páginas.',
  },
  {
    where: 'De conjuntos a categorías, Task 6 (p. 141)',
    claim: 'Pregunta dónde definimos ya una "composición 2-dimensional", y responde sólo "Yes we did — products."',
    question: '¿En qué sentido el producto es una composición "en otra dimensión"?',
    answer:
      'No es un error sino una respuesta muy escueta. Dadas f : A → B y g : C → D, el producto da f × g : A × C → B × D: pone dos flechas "una al lado de la otra" en vez de "una después de la otra" (composición ∘). Esa es la idea de categoría monoidal: dos formas de combinar flechas, en serie (∘) y en paralelo (×).',
  },
]

export function ErrataPage() {
  return (
    <div className="prose">
      <h1>Cazando erratas</h1>
      <p>
        Frases del libro que están mal o son confusas. Las páginas son las del PDF (numeración impresa). Antes de abrir la explicación, tratá de entender por qué la frase está mal. Si lo descubrís solo, es que
        entendiste el tema.
      </p>
      {items.map((it) => (
        <div key={it.where} className="card exercise">
          <h3>{it.where}</h3>
          <p>
            <strong>Dice:</strong> {it.claim}
          </p>
          <p>{it.question}</p>
          <details>
            <summary>Ver explicación</summary>
            <p>{it.answer}</p>
          </details>
        </div>
      ))}
    </div>
  )
}
