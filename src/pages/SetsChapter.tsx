import { CompositionExercise, FunctionExercise, NumberExercise } from '../components/Exercise'
import { SetFunctionEditor } from '../components/SetFunctionEditor'
import { isBijective, isInjective, isSurjective, isTotal, type FiniteSet, type FnMap } from '../core/sets'

// Capítulo 1 del libro: conjuntos y funciones. Los textos son resúmenes propios,
// no transcripciones del libro.

const frutas: FiniteSet = { name: 'Frutas', elements: ['🍎', '🍌', '🍇'] }
const colores: FiniteSet = { name: 'Colores', elements: ['🔴', '🟡', '🟣'] }
const cuatro: FiniteSet = { name: 'A', elements: ['1', '2', '3', '4'] }
const dos: FiniteSet = { name: 'B', elements: ['a', 'b'] }

const notTotal = (dom: FiniteSet, f: FnMap) =>
  !isTotal(dom, f) && {
    ok: false,
    message: `Todavía no es una función: le falta imagen a ${dom.elements.filter((x) => f[x] === undefined).join(', ')}. Todo elemento del dominio tiene que ir a algún lado.`,
  }

const ejemploF: FnMap = { '🍎': '🔴', '🍌': '🟡', '🍇': '🟣' }

const compA: FiniteSet = { name: 'A', elements: ['1', '2', '3'] }
const compB: FiniteSet = { name: 'B', elements: ['x', 'y'] }
const compC: FiniteSet = { name: 'C', elements: ['★', '♥', '♦'] }

export function SetsChapter() {
  return (
    <div className="prose">
      <p className="badge">Capítulo 1</p>
      <h1>Conjuntos</h1>
      <p>
        El libro arranca por la teoría de conjuntos porque es el ejemplo de categoría que todos ya conocemos sin
        saberlo. Los <strong>objetos</strong> son conjuntos y las <strong>flechas</strong> son funciones. Todo lo que
        venga después va a ser generalizar lo que pasa acá.
      </p>

      <h2>Funciones</h2>
      <p>
        Una función <em>f</em> : A → B le asigna a <strong>cada</strong> elemento de A <strong>exactamente uno</strong>{' '}
        de B. En un diagrama interno, eso quiere decir que de cada punto de la izquierda sale una sola flecha. A la
        derecha puede haber puntos sin flechas, o con varias.
      </p>
      <SetFunctionEditor dom={frutas} cod={colores} value={ejemploF} fnName="color" />
      <p>
        Para editar los diagramas de los ejercicios, clickeá un elemento del dominio (se resalta) y después su imagen.
        Si clickeás de nuevo la misma imagen, la flecha se borra.
      </p>

      <FunctionExercise
        id="c1-total"
        title="Tu primera función"
        prompt={<p>Armá cualquier función de Frutas a Colores.</p>}
        dom={frutas}
        cod={colores}
        check={(f) => notTotal(frutas, f) || { ok: true, message: 'Es una función: cada fruta tiene exactamente un color.' }}
      />

      <h2>Inyectivas, sobreyectivas y biyectivas</h2>
      <ul>
        <li>
          <strong>Inyectiva</strong>: elementos distintos van a imágenes distintas. No hay dos flechas que lleguen al
          mismo punto.
        </li>
        <li>
          <strong>Sobreyectiva</strong>: a todo punto de B le llega al menos una flecha.
        </li>
        <li>
          <strong>Biyectiva</strong>: las dos cosas. A cada punto de B le llega exactamente una flecha.
        </li>
      </ul>

      <FunctionExercise
        id="c1-no-iny"
        title="Perder información"
        prompt={<p>Armá una función de Frutas a Colores que <strong>no</strong> sea inyectiva.</p>}
        dom={frutas}
        cod={colores}
        check={(f) =>
          notTotal(frutas, f) ||
          (isInjective(frutas, f)
            ? { ok: false, message: 'Esa es inyectiva: cada color recibe a lo sumo una fruta.' }
            : {
                ok: true,
                message:
                  'Bien. Si dos frutas van al mismo color, mirando el color no podés saber de qué fruta viniste: la función "olvida" información.',
              })
        }
      />

      <FunctionExercise
        id="c1-sobre"
        title="Cubrir todo"
        prompt={<p>Armá una función sobreyectiva de A (4 elementos) a B (2 elementos).</p>}
        dom={cuatro}
        cod={dos}
        check={(f) =>
          notTotal(cuatro, f) ||
          (isSurjective(cuatro, dos, f)
            ? { ok: true, message: 'Sobreyectiva: a los dos elementos de B les llega alguna flecha.' }
            : { ok: false, message: 'Hay un elemento de B al que no le llega ninguna flecha.' })
        }
        hint={<p>¿Puede una función de A a B ser inyectiva? Contá: 4 elementos en 2 lugares.</p>}
      />

      <h2>Isomorfismos</h2>
      <p>
        Una función biyectiva tiene <strong>inversa</strong>: si das vuelta todas las flechas, obtenés otra función.
        Componer una con la otra no hace nada (da la identidad). Cuando entre dos conjuntos hay un isomorfismo, desde el
        punto de vista de la estructura "son el mismo conjunto con otros nombres". Esta idea, que{' '}
        <em>importan las flechas y no los elementos</em>, es el corazón de la teoría de categorías.
      </p>

      <FunctionExercise
        id="c1-iso"
        title="Un isomorfismo"
        prompt={<p>Armá un isomorfismo entre Frutas y Colores.</p>}
        dom={frutas}
        cod={colores}
        check={(f) =>
          notTotal(frutas, f) ||
          (isBijective(frutas, colores, f)
            ? { ok: true, message: '¡Es una biyección! Si das vuelta las flechas tenés su inversa. ¿Cuántos isomorfismos distintos hay? (Son 3! = 6.)' }
            : { ok: false, message: 'No es biyectiva: algún color recibe dos frutas o ninguna.' })
        }
      />

      <h2>Composición</h2>
      <p>
        Si <em>f</em> : A → B y <em>g</em> : B → C, la composición <em>g ∘ f</em> : A → C hace primero <em>f</em> y
        después <em>g</em>. Se escribe "al revés" (g a la izquierda) porque <em>(g ∘ f)(x) = g(f(x))</em>. La
        composición es asociativa y la función identidad es neutra. Esas dos leyes son exactamente las que van a definir
        una categoría en el capítulo 2.
      </p>

      <CompositionExercise
        id="c1-comp"
        A={compA}
        B={compB}
        C={compC}
        f={{ '1': 'x', '2': 'y', '3': 'x' }}
        g={{ x: '♦', y: '★' }}
      />

      <h2>Contar funciones</h2>
      <p>
        Mirar <em>cuántas</em> funciones hay entre dos conjuntos dice mucho. Algunos conjuntos se caracterizan sólo por
        cómo se relacionan con los demás, sin mirar sus elementos. Esto anticipa las propiedades universales.
      </p>

      <NumberExercise
        id="c1-cuenta-23"
        title="De 2 a 3"
        prompt={<p>¿Cuántas funciones distintas hay de un conjunto de 2 elementos a uno de 3?</p>}
        answer={9}
        explanation={<p>Cada uno de los 2 elementos elige libremente entre 3 imágenes: 3 × 3 = 3² = 9. En general hay |B|^|A| funciones A → B.</p>}
      />
      <NumberExercise
        id="c1-cuenta-32"
        title="De 3 a 2"
        prompt={<p>¿Y de un conjunto de 3 elementos a uno de 2?</p>}
        answer={8}
        explanation={<p>2³ = 8. Por eso a veces se escribe B^A para el conjunto de funciones A → B.</p>}
      />
      <NumberExercise
        id="c1-terminal"
        title="Hacia el singleton"
        prompt={<p>Sea {'{★}'} un conjunto de un solo elemento. ¿Cuántas funciones hay de un conjunto cualquiera A (no vacío) a {'{★}'}?</p>}
        answer={1}
        explanation={
          <p>
            Exactamente una: todos van a ★. Que desde <em>cualquier</em> objeto haya una única flecha hacia él hace que el
            singleton sea un <strong>objeto terminal</strong>. Es una definición que no menciona elementos, sólo flechas.
          </p>
        }
      />
      <NumberExercise
        id="c1-inicial"
        title="Desde el vacío"
        prompt={<p>¿Cuántas funciones hay del conjunto vacío ∅ a un conjunto cualquiera B?</p>}
        answer={1}
        explanation={
          <p>
            Una sola: la función vacía, que no tiene que asignarle nada a nadie (|B|⁰ = 1). Por eso ∅ es el{' '}
            <strong>objeto inicial</strong> de Set. Ojo: de B a ∅ no hay ninguna si B no es vacío.
          </p>
        }
      />

      <div className="callout">
        Siguiente paso: abrí el <a href="#/lab?ejemplo=iso">laboratorio con el ejemplo "Isomorfismo"</a>. Es lo mismo que acabás
        de hacer con frutas y colores, pero sin mirar elementos: sólo flechas y cómo componen.
      </div>
    </div>
  )
}
