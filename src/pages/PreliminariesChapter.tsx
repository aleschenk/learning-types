import { Definition, Example, Pitfall } from '../components/Boxes'
import { OrderedSetsSection } from './OrderedSetsSection'
import { ChoiceExercise, NumberExercise, SubsetExercise } from '../components/Exercise'
import { RelationExercise, RelationGrid } from '../components/RelationGrid'
import {
  conflicts,
  difference,
  dom,
  isPartialFunction,
  isTotalFunction,
  preservationCounterexample,
  range,
  sameSet,
  showRelation,
  undefinedOn,
  type Relation,
} from '../core/relations'

// TT, capítulo 2 del libro: preliminares matemáticos. Por ahora sólo la sección
// 2.1 (conjuntos, relaciones y funciones). Los textos son resúmenes propios.

const digits = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
const diffS = ['1', '2', '3', '4', '5', '6']
const diffT = ['2', '4', '6', '8']

const relS = ['1', '2', '3', '4']
const relT = ['a', 'b', 'c', 'd']
const fixed: Relation = [
  ['1', 'b'],
  ['1', 'c'],
  ['3', 'b'],
  ['4', 'a'],
]

const fnS = ['1', '2', '3']
const fnT = ['a', 'b']

// Tres relaciones entre fnS y fnT para comparar: no-función, parcial y total.
const notFn: Relation = [
  ['1', 'a'],
  ['1', 'b'],
  ['2', 'a'],
  ['3', 'b'],
]
const partialFn: Relation = [
  ['1', 'a'],
  ['3', 'b'],
]
const totalFn: Relation = [
  ['1', 'a'],
  ['2', 'a'],
  ['3', 'b'],
]

const states = ['0', '1', '2', '3', '4', '5', '6', '7']
const step: Relation = states.filter((s) => Number(s) + 2 <= 7).map((s) => [s, String(Number(s) + 2)])

const list = (xs: string[]) => `{${xs.join(', ')}}`

export function PreliminariesChapter() {
  return (
    <div className="prose">
      <p className="badge">TT · Capítulo 2</p>
      <h1>Preliminares matemáticos</h1>
      <p>
        Antes de hablar de tipos, el libro fija notación. No hay teoremas nuevos: es el vocabulario que después se usa en
        cada definición. Conviene entenderlo bien ahora, porque el libro lo va a usar sin volver a explicarlo.
      </p>
      <p>
        La idea central de la sección 2.1 es que <strong>casi todo es un conjunto</strong>. Una relación es un conjunto
        de tuplas. Una función es una relación que cumple una restricción. Y "el término <em>t</em> tiene tipo{' '}
        <em>T</em>", que es la frase más importante del libro, va a ser una relación más. Por eso arrancamos por los
        conjuntos.
      </p>

      <p className="row">
        <strong>En esta página:</strong>
        {[
          ['tt2-2-1', '2.1 Conjuntos, relaciones y funciones'],
          ['tt2-2-2', '2.2 Conjuntos ordenados'],
        ].map(([id, label]) => (
          <button key={id} onClick={() => document.getElementById(id)?.scrollIntoView()}>
            {label}
          </button>
        ))}
      </p>

      <div className="callout">
        ¿Un símbolo que no conocés o no te acordás? Está en la <a href="#/simbolos">leyenda de símbolos</a>.
      </div>

      <h2 id="tt2-2-1">2.1 · Conjuntos, relaciones y funciones</h2>

      {/* ───────────────────────────── 2.1.1 ───────────────────────────── */}
      <h3>2.1.1 · Notación de conjuntos</h3>
      <Definition n="2.1.1">
        <p>Un conjunto es una colección de cosas, sus elementos. Hay pocas formas de escribirlo y de operar:</p>
        <ul>
          <li>
            <strong>Por extensión</strong>: <code>{'{1, 2, 3}'}</code> lista los elementos uno por uno.
          </li>
          <li>
            <strong>Por comprensión</strong>: <code>{'{x ∈ S | condición}'}</code> son los elementos de S que cumplen la
            condición. Se lee "los x de S tales que…".
          </li>
          <li>
            <code>∅</code> es el conjunto vacío, el que no tiene elementos.
          </li>
          <li>
            <code>S \ T</code> (diferencia) son los elementos de S que no están en T.
          </li>
          <li>
            <code>|S|</code> es el <strong>tamaño</strong> de S, cuántos elementos tiene.
          </li>
          <li>
            <code>P(S)</code> es el <strong>conjunto potencia</strong>: el conjunto cuyos elementos son todos los
            subconjuntos de S.
          </li>
        </ul>
      </Definition>

      <Example title="por extensión">
        <p>
          En un conjunto no importa el orden ni las repeticiones: <code>{'{1, 2, 2, 3}'}</code>,{' '}
          <code>{'{3, 1, 2}'}</code> y <code>{'{1, 2, 3}'}</code> son el mismo conjunto, de tamaño 3. Lo único que
          importa es qué está adentro y qué no.
        </p>
      </Example>

      <Example title="por comprensión">
        <ul>
          <li>
            <code>{'{x ∈ ℕ | x < 4}'}</code> = {'{0, 1, 2, 3}'}
          </li>
          <li>
            <code>{'{x ∈ ℕ | x es par}'}</code> = {'{0, 2, 4, 6, …}'} (infinito: no se puede listar entero, por eso la
            comprensión es útil).
          </li>
          <li>
            <code>{'{x ∈ {1, 2, 3} | x > 5}'}</code> = ∅. Nada cumple la condición, y el resultado es el vacío.
          </li>
        </ul>
        <p>
          En código es un <code>filter</code>: <code>S.filter(x =&gt; x &lt; 4)</code> en JavaScript o{' '}
          <code>{'{x for x in S if x < 4}'}</code> en Python.
        </p>
      </Example>

      <Example title="diferencia y tamaño">
        <ul>
          <li>
            {'{1, 2, 3}'} \ {'{2, 5}'} = {'{1, 3}'}. El 5 no molesta: no estaba en el primero.
          </li>
          <li>S \ S = ∅ y S \ ∅ = S, para cualquier S.</li>
          <li>
            |{'{a, b, c}'}| = 3, |∅| = 0 y |{'{∅}'}| = 1.
          </li>
        </ul>
      </Example>

      <Example title="conjunto potencia">
        <p>
          P({'{a, b}'}) = {'{ ∅, {a}, {b}, {a, b} }'}. Tiene 4 elementos, y <em>cada elemento es un conjunto</em>.
        </p>
        <p>
          Para armarlo, pensá que por cada elemento de S decidís "lo pongo o no lo pongo". Con 2 elementos son 2 × 2 = 4
          decisiones posibles. En general, |P(S)| = 2<sup>|S|</sup>.
        </p>
      </Example>

      <Pitfall>
        <p>
          <strong>∅ no es lo mismo que {'{∅}'}</strong>. El primero es una caja vacía. El segundo es una caja que adentro
          tiene una caja vacía: tiene un elemento.
        </p>
        <p>
          <strong>Pertenecer (∈) no es lo mismo que estar incluido (⊆)</strong>. Con S = {'{a, b}'}: <code>a ∈ S</code>{' '}
          porque a es un elemento, y <code>{'{a}'} ⊆ S</code> porque todo lo que está en {'{a}'} está en S. Pero{' '}
          <code>{'{a}'} ∈ S</code> es falso: {'{a}'} no es uno de los elementos de S. En cambio,{' '}
          <code>{'{a}'} ∈ P(S)</code> sí es verdadero.
        </p>
      </Pitfall>

      <SubsetExercise
        id="tt2-comprension"
        title="Comprensión"
        prompt={
          <p>
            Sea U = {list(digits)}. Marcá los elementos de <code>{'{x ∈ U | x es par y x > 3}'}</code>.
          </p>
        }
        universe={digits}
        check={(p) =>
          sameSet(p, ['4', '6', '8'])
            ? { ok: true, message: 'Exacto: {4, 6, 8}. Recorrés U y te quedás con los que cumplen las dos condiciones a la vez.' }
            : {
                ok: false,
                message: p.some((x) => Number(x) % 2 === 1 || Number(x) <= 3)
                  ? 'Sobra alguno: cada elemento tiene que ser par y además mayor que 3.'
                  : 'Falta alguno.',
              }
        }
      />

      <SubsetExercise
        id="tt2-diferencia"
        title="Diferencia"
        prompt={
          <p>
            S = {list(diffS)} y T = {list(diffT)}. Marcá <code>S \ T</code>.
          </p>
        }
        universe={[...new Set([...diffS, ...diffT])]}
        check={(p) =>
          sameSet(p, difference(diffS, diffT))
            ? { ok: true, message: 'Bien: {1, 3, 5}. El 8 no aparece porque nunca estuvo en S: la diferencia sólo saca elementos.' }
            : p.includes('8')
              ? { ok: false, message: 'El 8 está en T pero no en S. S \\ T sólo puede tener elementos de S.' }
              : { ok: false, message: 'Quedate con los de S que no aparecen en T.' }
        }
      />

      <NumberExercise
        id="tt2-potencia"
        title="Conjunto potencia"
        prompt={<p>¿Cuántos elementos tiene P({'{a, b, c}'})?</p>}
        answer={8}
        wrong="No es eso. Listalos: el vacío, los de un elemento, los de dos, y el conjunto entero."
        explanation={
          <p>
            2³ = 8: ∅, {'{a}'}, {'{b}'}, {'{c}'}, {'{a, b}'}, {'{a, c}'}, {'{b, c}'} y {'{a, b, c}'}. Si leíste el
            capítulo 1 de TC: un subconjunto de S es lo mismo que una función S → {'{0, 1}'} (1 = "está", 0 = "no
            está"), y hay 2^|S| de esas.
          </p>
        }
      />

      <NumberExercise
        id="tt2-potencia-vacio"
        title="Potencia del vacío"
        prompt={<p>¿Cuántos elementos tiene P(∅)?</p>}
        answer={1}
        wrong="Pensá: ¿qué subconjuntos tiene un conjunto sin elementos? ¿Hay alguno?"
        explanation={
          <p>
            Uno: P(∅) = {'{∅}'}. El vacío es subconjunto de cualquier conjunto, incluso de sí mismo. Y cuadra con la
            fórmula: 2⁰ = 1.
          </p>
        }
      />

      <ChoiceExercise
        id="tt2-pertenece"
        title="¿Elemento o subconjunto?"
        prompt={<p>Sea S = {'{1, 2}'}. ¿Cuál de estas afirmaciones es verdadera?</p>}
        options={[
          { label: '{1} ∈ S', why: 'Los elementos de S son 1 y 2, que son números. {1} es un conjunto: no es ninguno de ellos.' },
          { label: '1 ⊆ S', why: '⊆ compara conjuntos con conjuntos, y 1 es un número. Lo correcto sería {1} ⊆ S, o 1 ∈ S.' },
          {
            label: '{1} ∈ P(S)',
            ok: true,
            why: 'Sí. P(S) = {∅, {1}, {2}, {1, 2}}, y {1} es uno de esos elementos. Ser subconjunto de S es lo mismo que ser elemento de P(S).',
          },
          { label: '∅ ∈ S', why: 'El vacío es subconjunto de S (∅ ⊆ S), pero no es uno de sus elementos.' },
        ]}
      />

      {/* ───────────────────────────── 2.1.2 ───────────────────────────── */}
      <h3>2.1.2 · Naturales y conjuntos numerables</h3>
      <Definition n="2.1.2">
        <p>
          ℕ = {'{0, 1, 2, 3, …}'} son los números naturales. En este libro <strong>el 0 está incluido</strong>.
        </p>
        <p>
          Un conjunto es <strong>numerable</strong> si podés ponerles a sus elementos los números 0, 1, 2, … de modo que
          a cada elemento le toque un número distinto y a cada número le toque un elemento. Es decir, si hay una biyección
          con ℕ: podés hacer una lista (infinita) que no repite y no se saltea a nadie.
        </p>
      </Definition>

      <Example title="conjuntos numerables, aunque no lo parezcan">
        <table className="plain">
          <thead>
            <tr>
              <th>Conjunto</th>
              <th>Cómo numerarlo</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Los pares</td>
              <td>
                0 → 0, 1 → 2, 2 → 4, … (el n-ésimo par es 2n). Son "la mitad" de ℕ y aun así alcanzan para numerarlos a
                todos.
              </td>
            </tr>
            <tr>
              <td>ℤ (con negativos)</td>
              <td>Alternando: 0, −1, 1, −2, 2, −3, …</td>
            </tr>
            <tr>
              <td>ℕ × ℕ (pares de naturales)</td>
              <td>Por diagonales: primero los que suman 0, después los que suman 1, después 2, etc.</td>
            </tr>
            <tr>
              <td>Los textos (strings)</td>
              <td>Primero los de largo 0, después los de largo 1 en orden alfabético, después los de largo 2…</td>
            </tr>
          </tbody>
        </table>
        <p>
          El último es el que importa en el libro: <strong>todo programa es un texto finito</strong>, así que el conjunto
          de todos los programas (o términos) de un lenguaje es numerable.
        </p>
      </Example>

      <Example title="un conjunto que no es numerable">
        <p>
          P(ℕ), el conjunto de todos los subconjuntos de ℕ, <em>no</em> es numerable (es el argumento diagonal de
          Cantor). Lo mismo pasa con las funciones ℕ → ℕ. Como los programas sí son numerables, hay funciones ℕ → ℕ que{' '}
          <strong>ningún programa calcula</strong>. No es un tema central del libro, pero explica por qué importa
          distinguir "numerable" de "infinito".
        </p>
      </Example>

      <ChoiceExercise
        id="tt2-numerable"
        title="¿Cuál no es numerable?"
        prompt={<p>Uno de estos conjuntos no es numerable. ¿Cuál?</p>}
        options={[
          { label: 'Los múltiplos de 10', why: 'Es numerable: 0 → 0, 1 → 10, 2 → 20, … Infinito, pero se puede listar.' },
          { label: 'Los programas de JavaScript', why: 'Es numerable: son textos finitos, y los textos se listan por largo y después en orden alfabético.' },
          { label: 'ℤ', why: 'Es numerable: 0, −1, 1, −2, 2, … no se saltea ninguno.' },
          {
            label: 'P(ℕ)',
            ok: true,
            why: 'Exacto. Cualquier lista de subconjuntos de ℕ deja alguno afuera (diagonal de Cantor). Hay "más" subconjuntos de ℕ que naturales.',
          },
        ]}
      />

      {/* ───────────────────────────── 2.1.3–5 ───────────────────────────── */}
      <h3>2.1.3 a 2.1.5 · Relaciones</h3>
      <p>
        Primero hace falta el <strong>producto cartesiano</strong>: S × T es el conjunto de todos los pares (s, t) con s
        de S y t de T. Por ejemplo, {'{1, 2}'} × {'{a, b}'} = {'{(1, a), (1, b), (2, a), (2, b)}'}. Tiene |S| · |T|
        elementos. Con más conjuntos es igual, pero con tuplas más largas: S₁ × S₂ × S₃ tiene triplas.
      </p>

      <Definition n="2.1.3">
        <p>
          Una <strong>relación de n lugares</strong> sobre S₁, …, Sₙ es <em>cualquier</em> subconjunto R de S₁ × … ×
          Sₙ. Las tuplas que están en R son las que "están relacionadas", y las que no están, no.
        </p>
        <p>
          No hay ninguna condición: elegís las tuplas que quieras, y eso es una relación. Una relación no es una regla ni
          una fórmula; es la lista (posiblemente infinita) de casos en que vale.
        </p>
      </Definition>

      <Example title="una relación de 3 lugares">
        <p>
          Suma = {'{(x, y, z) ∈ ℕ × ℕ × ℕ | x + y = z}'}. Entonces (1, 2, 3) ∈ Suma y (2, 2, 4) ∈ Suma, pero (1, 1, 3) ∉
          Suma.
        </p>
        <p>
          Pensalo como una tabla de una base de datos: cada fila es una tupla y la tabla entera es la relación. La tabla
          "Inscripciones(alumno, materia, nota)" es una relación de 3 lugares.
        </p>
      </Example>

      <Definition n="2.1.4">
        <p>
          Una relación de <strong>un solo lugar</strong> sobre S es simplemente un subconjunto P ⊆ S, y se llama{' '}
          <strong>predicado</strong>. En lugar de <code>s ∈ P</code> se escribe <code>P(s)</code> y se dice "P vale para
          s". Es la misma información que una función S → {'{verdadero, falso}'}.
        </p>
      </Definition>

      <Example title="predicados">
        <ul>
          <li>
            Par = {'{0, 2, 4, …}'} ⊆ ℕ. Entonces Par(4) vale y Par(7) no.
          </li>
          <li>
            En código, <code>isEven: (n: number) =&gt; boolean</code> y el conjunto de los pares son dos formas de decir
            lo mismo: el conjunto es "los n para los que la función da true".
          </li>
          <li>Más adelante en el libro: "t es un valor" y "t está bien tipado" son predicados sobre términos.</li>
        </ul>
      </Example>

      <Definition n="2.1.5">
        <p>
          Una relación de <strong>dos lugares</strong> se llama <strong>relación binaria</strong>. En lugar de{' '}
          <code>(s, t) ∈ R</code> se escribe <code>s R t</code>. Si los dos conjuntos son el mismo U, se dice que R es una
          relación binaria <em>sobre U</em>.
        </p>
      </Definition>

      <Example title="relaciones binarias">
        <ul>
          <li>
            ≤ sobre ℕ: escribimos <code>3 ≤ 5</code> en vez de <code>(3, 5) ∈ ≤</code>. Ya usabas esta notación sin
            saberlo.
          </li>
          <li>"es divisor de" sobre ℕ: 3 divide a 12, 3 no divide a 7.</li>
          <li>
            Más adelante en el libro: <code>t → t'</code>, "el término t da un paso de evaluación y queda t'", es una
            relación binaria sobre términos.
          </li>
        </ul>
        <p>Una relación binaria entre S y T se puede dibujar como una grilla, con un punto en cada par que está en R:</p>
        <RelationGrid S={relS} T={relT} value={fixed} />
        <p className="mono">R = {showRelation(fixed)}</p>
        <p>
          Se lee: 1 R b, 1 R c, 3 R b y 4 R a. El 2 no está relacionado con nada, y nada está relacionado con d. Las dos
          cosas están permitidas.
        </p>
      </Example>

      <NumberExercise
        id="tt2-producto"
        title="Producto cartesiano"
        prompt={<p>¿Cuántos elementos tiene {'{a, b}'} × {'{1, 2, 3}'}?</p>}
        answer={6}
        wrong="Listá los pares: (a, 1), (a, 2), … ¿cuántos salen?"
        explanation={<p>2 · 3 = 6: (a, 1), (a, 2), (a, 3), (b, 1), (b, 2) y (b, 3). Son las 6 casillas de una grilla de 2 × 3.</p>}
      />

      <NumberExercise
        id="tt2-cuantas-rel"
        title="¿Cuántas relaciones?"
        prompt={<p>¿Cuántas relaciones binarias distintas hay entre {'{a, b}'} y {'{1, 2, 3}'}?</p>}
        answer={64}
        wrong="Una relación es un subconjunto del producto. ¿Cuántos subconjuntos tiene un conjunto de 6 elementos?"
        explanation={
          <p>
            2⁶ = 64. Una relación es <em>cualquier</em> subconjunto de S × T, o sea un elemento de P(S × T). En la
            grilla: cada una de las 6 casillas puede estar marcada o no. Juntaste las dos ideas anteriores: producto y
            potencia.
          </p>
        }
      />

      {/* ───────────────────────────── 2.1.6 ───────────────────────────── */}
      <h3>2.1.6 · Notación mixfix</h3>
      <Definition n="2.1.6">
        <p>
          Las relaciones de tres lugares o más se escriben intercalando símbolos entre sus componentes. Esos símbolos,
          todos juntos, son el nombre de la relación. Es una convención de lectura, nada más: por debajo sigue siendo un
          conjunto de tuplas.
        </p>
      </Definition>

      <Example title="la relación de tipado">
        <p>
          La que vas a ver en todo el libro es <code>Γ ⊢ t : T</code>. Tiene tres componentes:
        </p>
        <ul>
          <li>
            <strong>Γ</strong> (gamma), el <strong>contexto</strong>: qué variables existen y de qué tipo son, por
            ejemplo <code>x : Bool, y : Nat</code>.
          </li>
          <li>
            <strong>t</strong>, un término (un pedazo de programa).
          </li>
          <li>
            <strong>T</strong>, un tipo.
          </li>
        </ul>
        <p>
          Se lee "con las variables de Γ, el término t tiene tipo T". El <code>⊢</code> y los <code>:</code> no
          significan nada por separado; juntos forman el nombre "es tipable como". Algunas triplas de la relación:
        </p>
        <ul>
          <li>
            <code>∅ ⊢ true : Bool</code>. Sin variables, true tiene tipo Bool.
          </li>
          <li>
            <code>x : Bool ⊢ x : Bool</code>. Si x es Bool, entonces x tiene tipo Bool.
          </li>
          <li>
            <code>∅ ⊢ x : Bool</code> <em>no</em> está en la relación: sin declarar x, no se le puede dar tipo.
          </li>
        </ul>
      </Example>

      <Example title="mixfix en otros lados">
        <p>
          Ya conocés este estilo: <code>if _ then _ else _</code> es un solo operador con tres huecos, y{' '}
          <code>a ? b : c</code> en JavaScript también. El libro hace lo mismo, pero con relaciones.
        </p>
      </Example>

      <NumberExercise
        id="tt2-mixfix"
        title="¿Cuántos lugares?"
        prompt={
          <p>
            La relación de tipado <code>Γ ⊢ t : T</code>, ¿de cuántos lugares es?
          </p>
        }
        answer={3}
        wrong="Contá las cosas que se relacionan, no los símbolos."
        explanation={
          <p>
            Tres: es la tripla (Γ, t, T). La relación de tipado es el conjunto de todas las triplas válidas, y "t tiene
            tipo T en Γ" quiere decir que esa tripla pertenece al conjunto.
          </p>
        }
      />

      {/* ───────────────────────────── 2.1.7 ───────────────────────────── */}
      <h3>2.1.7 · Dominio y rango</h3>
      <Definition n="2.1.7">
        <p>Para una relación R entre S y T:</p>
        <ul>
          <li>
            <code>dom(R)</code>, el <strong>dominio</strong>, son los elementos de S que están relacionados con{' '}
            <em>al menos un</em> elemento de T.
          </li>
          <li>
            <code>range(R)</code>, el <strong>rango</strong>, son los elementos de T a los que les llega{' '}
            <em>al menos un</em> elemento de S.
          </li>
        </ul>
        <p>En la grilla: dom(R) son las filas con algún punto y range(R) las columnas con algún punto.</p>
      </Definition>

      <Example title="la función edad">
        <p>
          Sea Edad la relación entre Personas y ℕ que asocia cada persona con su edad, pero sólo para las personas que
          cargaron su fecha de nacimiento. dom(Edad) son las personas con fecha cargada (puede no ser todas). range(Edad)
          son las edades que efectivamente aparecen (seguro no es todo ℕ: nadie tiene 500 años).
        </p>
      </Example>

      <Pitfall>
        <p>
          En este libro, "codominio" y "rango" son sinónimos y quieren decir <em>lo que efectivamente se alcanza</em>. En
          TC (y en mucha matemática), en cambio, el codominio de f : S → T es <em>todo</em> T, alcanzado o no, y a lo
          alcanzado se le dice "imagen". Cuando leas los dos libros a la vez, fijate cuál de los dos significados se usa.
        </p>
      </Pitfall>

      <SubsetExercise
        id="tt2-dom"
        title="Dominio"
        prompt={<p>Con la relación de la grilla de 2.1.5, R = {showRelation(fixed)}, marcá dom(R).</p>}
        universe={relS}
        check={(p) =>
          sameSet(p, dom(relS, fixed))
            ? { ok: true, message: 'Sí: {1, 3, 4}. El 1 aparece una sola vez en dom(R) aunque esté relacionado con dos cosas.' }
            : { ok: false, message: 'Mirá las filas: ¿cuáles tienen al menos un punto?' }
        }
      />
      <SubsetExercise
        id="tt2-range"
        title="Rango"
        prompt={<p>Y ahora range(R).</p>}
        universe={relT}
        check={(p) =>
          sameSet(p, range(relT, fixed))
            ? { ok: true, message: 'Sí: {a, b, c}. A d no le llega nada.' }
            : { ok: false, message: 'Mirá las columnas: ¿cuáles tienen al menos un punto?' }
        }
      />

      {/* ───────────────────────────── 2.1.8 ───────────────────────────── */}
      <h3>2.1.8 · Funciones parciales y totales</h3>
      <Definition n="2.1.8">
        <p>Una función es una relación binaria R entre S y T que cumple condiciones:</p>
        <ul>
          <li>
            <strong>Función parcial</strong>: cada elemento de S está relacionado con <em>a lo sumo uno</em> de T. Si (s,
            t₁) y (s, t₂) están en R, entonces t₁ = t₂. Dicho de otra forma: si hay respuesta, es única.
          </li>
          <li>
            <strong>Función total</strong>, o simplemente <strong>función</strong>: es parcial y además dom(R) = S. Todo
            elemento de S tiene su respuesta.
          </li>
        </ul>
      </Definition>

      <Example title="las tres situaciones en la grilla">
        <p>Con S = {list(fnS)} y T = {list(fnT)}:</p>
        <div className="row" style={{ alignItems: 'flex-start', gap: 28 }}>
          <div>
            <strong>No es función</strong>
            <RelationGrid S={fnS} T={fnT} value={notFn} flagged={conflicts(fnS, notFn)} />
            <small>La fila 1 tiene dos puntos.</small>
          </div>
          <div>
            <strong>Parcial, no total</strong>
            <RelationGrid S={fnS} T={fnT} value={partialFn} />
            <small>La fila 2 está vacía.</small>
          </div>
          <div>
            <strong>Total</strong>
            <RelationGrid S={fnS} T={fnT} value={totalFn} />
            <small>Exactamente un punto por fila.</small>
          </div>
        </div>
        <p>
          Fijate que en la total dos filas van a la misma columna (1 y 2 van a a). Eso está permitido: la restricción es
          por <em>fila</em>, no por columna.
        </p>
      </Example>

      <Example title="funciones parciales en programación">
        <ul>
          <li>
            La división entera <code>a / b</code> es parcial: no está definida para b = 0.
          </li>
          <li>
            <code>head</code>, que devuelve el primer elemento de una lista, es parcial: no está definida para la lista
            vacía.
          </li>
          <li>
            <code>length</code> es total: toda lista tiene un largo.
          </li>
          <li>
            Una función que entra en un loop infinito con ciertas entradas es parcial: con esas entradas no da respuesta.
          </li>
        </ul>
      </Example>

      <div className="callout">
        Puente con TC: las funciones del capítulo 1 de Categorías son las <em>totales</em>. Acá aparecen también las
        parciales porque un programa puede no terminar con ciertas entradas, y el libro necesita hablar de eso.
      </div>

      <RelationExercise
        id="tt2-parcial"
        title="Parcial pero no total"
        prompt={<p>Armá una relación entre S = {list(fnS)} y T = {list(fnT)} que sea función parcial pero no total.</p>}
        S={fnS}
        T={fnT}
        check={(r) => {
          const c = conflicts(fnS, r)
          if (c.length) return { ok: false, message: `No es función parcial: ${c.join(', ')} va a dos lugares.`, flagged: c }
          if (isTotalFunction(fnS, r)) return { ok: false, message: 'Es total: todo S tiene imagen. Dejá alguno sin definir.' }
          return {
            ok: true,
            message: `Bien. Está indefinida en ${undefinedOn(fnS, r).join(', ')}: f(x)↑. ${r.length === 0 ? 'Incluso la relación vacía es una función parcial válida.' : ''}`,
          }
        }}
      />

      <RelationExercise
        id="tt2-no-funcion"
        title="Dominio completo no alcanza"
        prompt={
          <p>
            Armá una relación con dom(R) = S que <strong>no</strong> sea una función.
          </p>
        }
        S={fnS}
        T={fnT}
        check={(r) => {
          const u = undefinedOn(fnS, r)
          if (u.length) return { ok: false, message: `dom(R) todavía no es S: falta ${u.join(', ')}.`, flagged: u }
          if (isPartialFunction(fnS, r)) return { ok: false, message: 'Así es una función total. Hacé que algún elemento vaya a dos lugares.' }
          return {
            ok: true,
            message: `Exacto: ${conflicts(fnS, r).join(', ')} tiene dos imágenes. Para ser función hacen falta las dos condiciones: a lo sumo una imagen y dominio completo.`,
            flagged: conflicts(fnS, r),
          }
        }}
      />

      {/* ───────────────────────────── 2.1.9 ───────────────────────────── */}
      <h3>2.1.9 · Definido, indefinido y fallar</h3>
      <Definition n="2.1.9">
        <p>
          Una función parcial f está <strong>definida</strong> en x si x ∈ dom(f), y se escribe <code>f(x)↓</code>. Si
          no, está <strong>indefinida</strong> y se escribe <code>f(x)↑</code>.
        </p>
        <p>
          El libro separa dos cosas que en la práctica parecen parecidas. <strong>Divergir</strong> (↑) es no dar ninguna
          respuesta, por ejemplo por quedarse en un loop. <strong>Fallar</strong> es terminar y avisar que algo salió
          mal: es un resultado, aunque sea un resultado malo. Para modelarlo se agrega un valor especial{' '}
          <code>fail</code> a la salida, que no es ninguno de los valores normales.
        </p>
      </Definition>

      <Example title="los tres desenlaces de una llamada">
        <table className="plain">
          <thead>
            <tr>
              <th>Qué pasa</th>
              <th>Ejemplo</th>
              <th>Notación</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Devuelve un valor</td>
              <td>
                <code>length([1, 2])</code> da 2
              </td>
              <td>
                f(x)↓ y f(x) = 2
              </td>
            </tr>
            <tr>
              <td>Falla</td>
              <td>
                <code>head([])</code> tira un error
              </td>
              <td>f(x) = fail</td>
            </tr>
            <tr>
              <td>Diverge</td>
              <td>
                <code>while (true) {'{}'}</code>
              </td>
              <td>f(x)↑</td>
            </tr>
          </tbody>
        </table>
        <p>
          Desde afuera, un fallo se puede observar (recibís el error), pero una divergencia no: nunca sabés si el programa
          está por terminar o no va a terminar nunca. Por eso el libro los trata distinto.
        </p>
      </Example>

      <Example title="el truco de agregar fail">
        <p>
          Una función de S a T que puede fallar es, formalmente, una función de S a T ∪ {'{fail}'}. Si además siempre
          termina, es <em>total</em> en ese conjunto ampliado. Es lo mismo que hacés cuando una función devuelve{' '}
          <code>T | null</code>, <code>Option&lt;T&gt;</code> o <code>Result&lt;T, E&gt;</code>: el error pasa a ser un
          valor de retorno más.
        </p>
      </Example>

      <ChoiceExercise
        id="tt2-fail"
        title="Modelar el fallo"
        prompt={<p>Una función de S a T que puede fallar, pero que siempre termina, ¿qué es formalmente?</p>}
        options={[
          {
            label: 'Una función parcial de S a T',
            why: 'Parcial sería "puede no devolver nada", que es divergir. Fallar sí devuelve algo.',
          },
          {
            label: 'Una función total de S a T ∪ {fail}',
            ok: true,
            why: 'Eso es. Para todo x devuelve algo: un t o fail. Es la misma idea que Option<T> o Result en programación.',
          },
          {
            label: 'Una relación de tres lugares entre S, T y {fail}',
            why: 'No hace falta un tercer lugar: el fallo es un valor más de la salida.',
          },
        ]}
      />

      {/* ───────────────────────────── 2.1.10 ───────────────────────────── */}
      <h3>2.1.10 · Un predicado que se preserva</h3>
      <Definition n="2.1.10">
        <p>
          Tomá una relación binaria R sobre un conjunto S y un predicado P sobre S. P <strong>se preserva</strong> por R
          si, cada vez que vale P(s) y s R s', también vale P(s').
        </p>
        <p>
          Pensá R como "dar un paso". Que P se preserve quiere decir que P es una propiedad que <em>no se pierde</em> al
          avanzar: una vez que vale, sigue valiendo en todos los pasos siguientes.
        </p>
      </Definition>

      <Example title="números que avanzan">
        <p>Sobre ℕ, tomá s R s' cuando s' = s + 2.</p>
        <ul>
          <li>
            <strong>Par</strong> se preserva: si s es par, s + 2 también.
          </li>
          <li>
            <strong>Impar</strong> también se preserva, por el mismo motivo.
          </li>
          <li>
            <strong>"Mayor que 10"</strong> se preserva: si s &gt; 10, s + 2 &gt; 10.
          </li>
          <li>
            <strong>"Menor que 5"</strong> <em>no</em> se preserva: vale para 4, pero 4 R 6 y 6 no es menor que 5. Alcanza
            con un solo contraejemplo.
          </li>
        </ul>
      </Example>

      <Example title="lo que viene en el libro">
        <p>
          Con R = "dar un paso de evaluación" y P = "estar bien tipado", la preservación es uno de los dos teoremas
          centrales del libro (el otro es "progreso"). Por ejemplo, <code>if true then 0 else succ 0</code> tiene tipo
          Nat y da un paso a <code>0</code>, que también tiene tipo Nat. El teorema dice que eso pasa <em>siempre</em>:
          evaluar nunca rompe los tipos.
        </p>
      </Example>

      <Pitfall>
        <p>
          La dirección importa. Preservar dice "si vale antes, vale después", no al revés. Por ejemplo,{' '}
          <code>if true then 0 else false</code> está mal tipado (las ramas tienen tipos distintos), pero da un paso a{' '}
          <code>0</code>, que está bien tipado. Eso no contradice la preservación: P(s') puede valer aunque P(s) no.
        </p>
      </Pitfall>

      <p>
        Para el ejercicio: S = {list(states)} y s R s' cuando s' = s + 2. Es decir: <code>0 → 2 → 4 → 6</code> y{' '}
        <code>1 → 3 → 5 → 7</code>.
      </p>

      <SubsetExercise
        id="tt2-preserva"
        title="Preservación"
        prompt={<p>Marcá un predicado P (un subconjunto de S) que contenga al 1, que se preserve por R y que no sea todo S.</p>}
        universe={states}
        check={(p) => {
          if (!p.includes('1')) return { ok: false, message: 'P tiene que contener al 1.' }
          if (p.length === states.length) return { ok: false, message: 'Todo S se preserva trivialmente. Buscá uno más chico.' }
          const bad = preservationCounterexample(step, p)
          if (bad)
            return {
              ok: false,
              message: `No se preserva: vale P(${bad[0]}) y ${bad[0]} R ${bad[1]}, pero no vale P(${bad[1]}).`,
            }
          return {
            ok: true,
            message:
              'Se preserva. Si incluiste el 1, tuviste que incluir el 3, el 5 y el 7: todo lo que se alcanza desde el 1. Esa es la forma del teorema de preservación: "estar bien tipado" es el predicado y "dar un paso" es la relación.',
          }
        }}
      />

      <OrderedSetsSection />

      <div className="callout">
        Lo que sigue del capítulo (secuencias e inducción) se suma cuando llegues a esa parte.
      </div>
    </div>
  )
}
