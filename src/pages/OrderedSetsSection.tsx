import { Definition, Example, Pitfall } from '../components/Boxes'
import { ClosureStepper } from '../components/ClosureStepper'
import { ChoiceExercise, NumberExercise, SubsetExercise } from '../components/Exercise'
import { RelationExercise } from '../components/RelationGrid'
import { RelationGraph } from '../components/RelationGraph'
import { circleLayout, type NodePos } from '../lib/layout'
import {
  antisymmetryCounterexample,
  coveringPairs,
  equivalenceClasses,
  hasPair,
  isAntisymmetric,
  isReflexive,
  isSymmetric,
  isTransitive,
  reflexiveClosure,
  reflexivityCounterexample,
  showRelation,
  symmetryCounterexample,
  transitiveClosure,
  transitivityCounterexample,
  type Relation,
} from '../core/relations'

// TT, capítulo 2, sección 2.2: conjuntos ordenados. Va dentro de la página del
// capítulo 2 (PreliminariesChapter). Los textos son resúmenes propios.

const S3 = ['a', 'b', 'c']
const S4 = ['a', 'b', 'c', 'd']
// En fila: los lazos suben y las flechas van de costado, sin chocarse.
const row: NodePos[] = S3.map((id, i) => ({ id, x: 40 + i * 100, y: 100 }))

// ── 2.2.1: tres relaciones para clasificar ──
const identity: Relation = S3.map((s) => [s, s])
const abSwap: Relation = [
  ['a', 'b'],
  ['b', 'a'],
  ['a', 'a'],
  ['b', 'b'],
]
const abcChain: Relation = [
  ['a', 'b'],
  ['b', 'c'],
]

const PROPS = ['reflexiva', 'simétrica', 'transitiva', 'antisimétrica']

/** Qué propiedades tiene `r` sobre `S`, y una explicación de cada una que falla. */
function analyze(S: string[], r: Relation) {
  const has = {
    reflexiva: isReflexive(S, r),
    simétrica: isSymmetric(r),
    transitiva: isTransitive(r),
    antisimétrica: isAntisymmetric(r),
  } as Record<string, boolean>
  const why: Record<string, string> = {}
  const rc = reflexivityCounterexample(S, r)
  if (rc) why.reflexiva = `no es reflexiva: falta el lazo (${rc}, ${rc})`
  const sc = symmetryCounterexample(r)
  if (sc) why.simétrica = `no es simétrica: está (${sc[0]}, ${sc[1]}) pero no (${sc[1]}, ${sc[0]})`
  const tc = transitivityCounterexample(r)
  if (tc) why.transitiva = `no es transitiva: hay ${tc[0]} → ${tc[1]} → ${tc[2]} pero falta el atajo (${tc[0]}, ${tc[2]})`
  const ac = antisymmetryCounterexample(r)
  if (ac) why.antisimétrica = `no es antisimétrica: ${ac[0]} y ${ac[1]} son distintos y van y vuelven`
  return { has, why }
}

function PropertiesExercise({ id, title, r, note }: { id: string; title: string; r: Relation; note: string }) {
  const { has, why } = analyze(S3, r)
  return (
    <SubsetExercise
      id={id}
      title={title}
      prompt={
        <>
          <p>
            Sobre S = {'{a, b, c}'}, R = {showRelation(r)}. Marcá <strong>todas</strong> las propiedades que tiene.
          </p>
          <RelationGraph nodes={row} r={r} width={280} height={140} />
        </>
      }
      universe={PROPS}
      check={(picked) => {
        const wrong = PROPS.filter((p) => picked.includes(p) !== has[p])
        if (!wrong.length) return { ok: true, message: `¡Bien! ${note}` }
        const p = wrong[0]
        return {
          ok: false,
          message: has[p]
            ? `Te falta una: R sí es ${p}. Revisá la definición: ¿hay algún caso que la rompa?`
            : `Revisá "${p}": ${why[p]}.`,
        }
      }}
    />
  )
}

// ── 2.2.2 y 2.2.3: diagramas de Hasse ──
const D = ['1', '2', '3', '4', '6', '12']
const divides: Relation = D.flatMap((x) => D.filter((y) => Number(y) % Number(x) === 0).map((y) => [x, y] as const))
const divLayout: NodePos[] = [
  { id: '1', x: 130, y: 250 },
  { id: '2', x: 80, y: 180 },
  { id: '3', x: 190, y: 180 },
  { id: '4', x: 40, y: 110 },
  { id: '6', x: 140, y: 110 },
  { id: '12', x: 90, y: 35 },
]

const p2Covers: Relation = [
  ['∅', '{a}'],
  ['∅', '{b}'],
  ['{a}', '{a,b}'],
  ['{b}', '{a,b}'],
]
const p2Layout: NodePos[] = [
  { id: '∅', x: 100, y: 190 },
  { id: '{a}', x: 45, y: 115 },
  { id: '{b}', x: 155, y: 115 },
  { id: '{a,b}', x: 100, y: 40 },
]

const xCovers: Relation = [
  ['a', 'b'],
  ['a', 'c'],
  ['b', 'd'],
  ['b', 'e'],
  ['c', 'd'],
  ['c', 'e'],
]
const xLayout: NodePos[] = [
  { id: 'a', x: 100, y: 190 },
  { id: 'b', x: 50, y: 115 },
  { id: 'c', x: 150, y: 115 },
  { id: 'd', x: 50, y: 40 },
  { id: 'e', x: 150, y: 40 },
]

// ── 2.2.4: congruencia módulo 3 sobre 0..5, sin los lazos para que se lea ──
const M = ['0', '1', '2', '3', '4', '5']
const mod3: Relation = M.flatMap((x) =>
  M.filter((y) => x !== y && Number(x) % 3 === Number(y) % 3).map((y) => [x, y] as const),
)
const modLayout = circleLayout(['0', '3', '1', '4', '2', '5'], 120, 115, 80)

// ── 2.2.5 a 2.2.7: clausuras ──
const reflBase: Relation = [
  ['a', 'b'],
  ['b', 'c'],
]
const transBase: Relation = [
  ['a', 'b'],
  ['b', 'c'],
  ['c', 'd'],
]

/** Feedback común para "completá la clausura": no sacar pares y no agregar de más. */
function closureCheck(base: Relation, target: Relation, missingHint: (r: Relation) => string | undefined, done: string) {
  return (r: Relation) => {
    const removed = base.find(([s, t]) => !hasPair(r, s, t))
    if (removed) return { ok: false, message: `Sacaste (${removed[0]}, ${removed[1]}), que estaba en R. Una clausura contiene a R: sólo se agregan pares.` }
    const hint = missingHint(r)
    if (hint) return { ok: false, message: hint }
    const extra = r.find(([s, t]) => !hasPair(target, s, t))
    if (extra)
      return {
        ok: false,
        message: `(${extra[0]}, ${extra[1]}) sobra. La clausura es la relación más chica que cumple la propiedad: agregá sólo lo indispensable.`,
      }
    return { ok: true, message: done }
  }
}

export function OrderedSetsSection() {
  return (
    <>
      <h2 id="tt2-2-2">2.2 · Conjuntos ordenados</h2>
      <p>
        En 2.1 vimos que una relación es cualquier conjunto de pares. Ahora el libro les pone nombre a las propiedades
        que puede tener una relación <strong>sobre un mismo conjunto S</strong> (de S en S). Combinándolas aparecen los
        órdenes y las equivalencias, que el libro usa todo el tiempo: el subtipado es un preorden, "evaluar en varios
        pasos" es una clausura, y muchas demostraciones se apoyan en órdenes bien fundados.
      </p>
      <p>
        Para estas relaciones conviene dibujarlas como <strong>grafo</strong>: un punto por elemento de S y una flecha de s
        a t por cada par (s, t). Un par (s, s) es un lazo.
      </p>

      {/* ───────────────────────────── 2.2.1 ───────────────────────────── */}
      <h3>2.2.1 · Reflexiva, simétrica, transitiva y antisimétrica</h3>
      <Definition n="2.2.1">
        <p>Una relación R sobre S puede ser:</p>
        <ul>
          <li>
            <strong>Reflexiva</strong>: todo elemento está relacionado consigo mismo. s R s para todo s ∈ S. En el grafo:{' '}
            <em>cada punto tiene su lazo</em>.
          </li>
          <li>
            <strong>Simétrica</strong>: si s R t, entonces t R s. En el grafo: <em>toda flecha tiene su vuelta</em>.
          </li>
          <li>
            <strong>Transitiva</strong>: si s R t y t R u, entonces s R u. En el grafo: <em>todo camino de dos flechas
            tiene su atajo directo</em>.
          </li>
          <li>
            <strong>Antisimétrica</strong>: si s R t y t R s, entonces s = t. En el grafo: <em>entre dos puntos distintos
            nunca hay ida y vuelta</em> (los lazos sí están permitidos).
          </li>
        </ul>
      </Definition>

      <Example title="relaciones conocidas">
        <table className="plain">
          <thead>
            <tr>
              <th>Relación</th>
              <th>Refl.</th>
              <th>Sim.</th>
              <th>Trans.</th>
              <th>Antisim.</th>
            </tr>
          </thead>
          <tbody>
            {[
              ['= (igualdad)', '✓', '✓', '✓', '✓'],
              ['≤ en ℕ', '✓', '✗', '✓', '✓'],
              ['< en ℕ', '✗', '✗', '✓', '✓'],
              ['"divide a" en {1, 2, 3, …}', '✓', '✗', '✓', '✓'],
              ['"tiene la misma edad que"', '✓', '✓', '✓', '✗'],
              ['"es hermano de"', '✗', '✓', '✗', '✗'],
            ].map(([name, ...cells]) => (
              <tr key={name}>
                <td>{name}</td>
                {cells.map((c, i) => (
                  <td key={i} style={{ color: c === '✓' ? 'var(--ok)' : 'var(--bad)', textAlign: 'center' }}>
                    {c}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
        <p>
          Dos que vale la pena pensar. "Misma edad" no es antisimétrica porque dos personas <em>distintas</em> pueden
          tener la misma edad. "Es hermano de" no es transitiva: Ana es hermana de Beto y Beto de Ana, pero Ana no es
          hermana de sí misma.
        </p>
      </Example>

      <Pitfall>
        <p>
          <strong>Simétrica y antisimétrica no son opuestas.</strong> La igualdad es las dos cosas a la vez. Y{' '}
          {'{(a, b), (b, a), (b, c)}'} no es ninguna: (a, b) con (b, a) rompe la antisimetría, y (b, c) sin su vuelta
          rompe la simetría.
        </p>
        <p>
          <strong>Las propiedades con "si…, entonces…" valen solas cuando no hay casos.</strong> Una relación sin ningún par
          de ida y vuelta es antisimétrica aunque no tenga casi nada: el "si" nunca se cumple, así que nada la rompe (ver{' '}
          <a href="#/simbolos?ver=implica">implica</a>). Lo mismo con la transitividad cuando no hay caminos de dos flechas.
        </p>
      </Pitfall>

      <PropertiesExercise
        id="tt2-props-a"
        title="Clasificar: la igualdad"
        r={identity}
        note="La igualdad tiene las cuatro. Es el ejemplo de que simétrica y antisimétrica pueden convivir: los únicos pares de ida y vuelta son lazos."
      />
      <PropertiesExercise
        id="tt2-props-b"
        title="Clasificar: ida y vuelta"
        r={abSwap}
        note="No es reflexiva porque a c le falta el lazo: tiene que valer para todos los elementos de S, no sólo para los que aparecen."
      />
      <PropertiesExercise
        id="tt2-props-c"
        title="Clasificar: una cadena"
        r={abcChain}
        note="Sólo es antisimétrica, y es porque no hay ningún par de ida y vuelta: la condición nunca se activa."
      />

      {/* ───────────────────────────── 2.2.2 ───────────────────────────── */}
      <h3>2.2.2 · Preórdenes y órdenes</h3>
      <Definition n="2.2.2">
        <p>Combinando propiedades salen tres tipos de orden, cada uno más exigente que el anterior:</p>
        <ul>
          <li>
            <strong>Preorden</strong>: reflexiva y transitiva. Se suele escribir con ≤ o ⊑, y se dice "S es un conjunto
            preordenado" sobreentendiendo cuál es el ≤.
          </li>
          <li>
            <strong>Orden parcial</strong>: un preorden que además es antisimétrico. Ya no hay dos elementos distintos
            "empatados".
          </li>
          <li>
            <strong>Orden total</strong>: un orden parcial en el que además todo par se puede comparar: para cualquier s y
            t, vale s ≤ t o t ≤ s.
          </li>
        </ul>
        <p>
          Con cualquiera de ellos, <code>s &lt; t</code> ("estrictamente menor") quiere decir s ≤ t y s ≠ t.
        </p>
      </Definition>

      <Example title="uno de cada uno">
        <ul>
          <li>
            <strong>Preorden, no orden parcial</strong>: "pesa lo mismo o menos que", entre personas. Es reflexivo y
            transitivo, pero dos personas distintas que pesan igual quedan relacionadas en los dos sentidos. En el
            capítulo 15 del libro, el <strong>subtipado</strong> va a ser un preorden de este estilo.
          </li>
          <li>
            <strong>Orden parcial, no total</strong>: ⊆ entre subconjuntos. {'{a}'} y {'{b}'} no se pueden comparar:
            ninguno está incluido en el otro. Por eso es "parcial": hay pares sin orden.
          </li>
          <li>
            <strong>Orden total</strong>: ≤ entre números, o el orden alfabético entre palabras. Cualquier par se compara.
          </li>
        </ul>
      </Example>

      <Example title="diagramas de Hasse">
        <p>
          Dibujar todas las flechas de un orden es un lío: todos los lazos y todos los atajos. Un{' '}
          <strong>diagrama de Hasse</strong> se queda sólo con lo esencial: no dibuja los lazos (se sabe que es
          reflexivo), no dibuja los atajos (se sabe que es transitivo), y pone lo más grande arriba, así que las líneas se
          leen de abajo hacia arriba. s ≤ t si podés subir de s a t por las líneas.
        </p>
        <RelationGraph
          nodes={p2Layout}
          r={p2Covers}
          width={200}
          height={220}
          hasse
          caption="P({a, b}) ordenado por ⊆. {a} y {b} están a la misma altura y sin línea entre ellos: no se comparan."
        />
        <RelationGraph
          nodes={divLayout}
          r={coveringPairs(D, divides)}
          width={240}
          height={280}
          hasse
          caption={'Los divisores de 12 ordenados por "divide a". 2 ≤ 12 porque se puede subir 2 → 4 → 12 (o 2 → 6 → 12).'}
        />
      </Example>

      <RelationExercise
        id="tt2-preorden"
        title="Un preorden que no es orden parcial"
        prompt={
          <p>
            Sobre S = {'{a, b, c}'}, marcá en la grilla un <strong>preorden</strong> (reflexivo y transitivo) que{' '}
            <strong>no</strong> sea un orden parcial. La fila es el de la izquierda: marcar la casilla (a, b) es a ≤ b.
          </p>
        }
        S={S3}
        T={S3}
        name="≤"
        check={(r) => {
          const rc = reflexivityCounterexample(S3, r)
          if (rc) return { ok: false, message: `No es reflexiva: falta (${rc}, ${rc}). En un preorden todo elemento es ≤ que sí mismo.`, flagged: [rc] }
          const tc = transitivityCounterexample(r)
          if (tc) return { ok: false, message: `No es transitiva: hay ${tc[0]} ≤ ${tc[1]} y ${tc[1]} ≤ ${tc[2]}, pero falta (${tc[0]}, ${tc[2]}).`, flagged: [tc[0]] }
          const ac = antisymmetryCounterexample(r)
          if (!ac) return { ok: false, message: 'Es un preorden, pero también es antisimétrico: es un orden parcial. Hacé que dos elementos distintos queden "empatados": cada uno ≤ que el otro.' }
          return { ok: true, message: `Exacto: ${ac[0]} ≤ ${ac[1]} y ${ac[1]} ≤ ${ac[0]} con ${ac[0]} ≠ ${ac[1]}. Están empatados, como dos personas que pesan lo mismo.` }
        }}
      />

      {/* ───────────────────────────── 2.2.3 ───────────────────────────── */}
      <h3>2.2.3 · Join y meet</h3>
      <Definition n="2.2.3">
        <p>En un orden parcial, tomá dos elementos s y t.</p>
        <ul>
          <li>
            Una <strong>cota superior</strong> de s y t es un k que está por encima de los dos: s ≤ k y t ≤ k.
          </li>
          <li>
            El <strong>join</strong> (o supremo, o menor cota superior) es la cota superior <em>más baja</em>: una cota
            superior j que es ≤ que cualquier otra cota superior. Es "lo más chico que está por encima de los dos".
          </li>
          <li>
            Al revés, una <strong>cota inferior</strong> está por debajo de los dos, y el <strong>meet</strong> (o ínfimo,
            o mayor cota inferior) es la cota inferior <em>más alta</em>.
          </li>
        </ul>
        <p>
          En el diagrama de Hasse: el join es el primer punto donde se encuentran los caminos que <em>suben</em> desde s y
          desde t; el meet, el primero donde se encuentran los que <em>bajan</em>.
        </p>
      </Definition>

      <Example title="join y meet que ya conocés">
        <table className="plain">
          <thead>
            <tr>
              <th>Orden</th>
              <th>Join de s y t</th>
              <th>Meet de s y t</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>≤ en ℕ</td>
              <td>el máximo</td>
              <td>el mínimo</td>
            </tr>
            <tr>
              <td>⊆ en P(S)</td>
              <td>
                la <a href="#/simbolos?ver=union">unión</a> s ∪ t
              </td>
              <td>
                la <a href="#/simbolos?ver=interseccion">intersección</a> s ∩ t
              </td>
            </tr>
            <tr>
              <td>"divide a"</td>
              <td>el mínimo común múltiplo</td>
              <td>el máximo común divisor</td>
            </tr>
          </tbody>
        </table>
        <p>
          Por ejemplo, en P({'{a, b, c}'}): las cotas superiores de {'{a}'} y {'{b}'} son {'{a, b}'} y {'{a, b, c}'}. La más
          chica es {'{a, b}'} = {'{a}'} ∪ {'{b}'}: ese es el join.
        </p>
      </Example>

      <Example title="un join que no existe">
        <RelationGraph nodes={xLayout} r={xCovers} width={200} height={220} hasse caption="b y c tienen dos cotas superiores, d y e, que no se comparan entre sí." />
        <p>
          Las cotas superiores de b y c son d y e. Para que haya join, una de ellas tendría que ser ≤ que la otra, pero d
          y e no se comparan. No hay "la más baja": <strong>b y c no tienen join</strong>. La definición dice "un join",
          porque no siempre existe; cuando existe, en un orden parcial es único (por la antisimetría).
        </p>
      </Example>

      <Pitfall>
        <p>
          El join se compara con las <em>otras cotas superiores</em> (los k que están arriba de s y de t), no con
          cualquier elemento. Este es justo el error que tiene el libro de TC en su definición de join (ver{' '}
          <a href="#/errata">Cazando erratas</a>).
        </p>
      </Pitfall>

      <p>Para los ejercicios, usá el diagrama de los divisores de 12 de más arriba.</p>
      <ChoiceExercise
        id="tt2-join"
        title="Join en los divisores de 12"
        prompt={<p>¿Cuál es el join de 4 y 6?</p>}
        options={[
          { label: '2', why: '2 está por debajo de los dos (es una cota inferior). El join tiene que estar por encima.' },
          { label: '6', why: '6 no está por encima de 4: 4 no divide a 6.' },
          { label: '12', ok: true, why: 'Sí: es la única cota superior de 4 y 6 en el conjunto, así que es la menor. Es el mcm(4, 6).' },
          { label: '24', why: '24 sería el mcm si no importara el conjunto, pero no es uno de los divisores de 12: no está en S.' },
        ]}
      />
      <ChoiceExercise
        id="tt2-meet"
        title="Meet en los divisores de 12"
        prompt={<p>¿Cuál es el meet de 4 y 6?</p>}
        options={[
          { label: '1', why: '1 es una cota inferior de 4 y 6, pero no la mayor: 2 también lo es, y 1 ≤ 2.' },
          { label: '2', ok: true, why: 'Sí: las cotas inferiores son 1 y 2, y la mayor es 2. Es el mcd(4, 6).' },
          { label: '4', why: '4 no está por debajo de 6: 4 no divide a 6.' },
          { label: '12', why: '12 está por encima de los dos: es el join, no el meet.' },
        ]}
      />
      <ChoiceExercise
        id="tt2-sin-join"
        title="¿Siempre hay join?"
        prompt={
          <>
            <p>En este orden, ¿cuál es el join de b y c?</p>
            <RelationGraph nodes={xLayout} r={xCovers} width={200} height={220} hasse />
          </>
        }
        options={[
          { label: 'd', why: 'd es cota superior, pero no es ≤ que la otra cota superior, e.' },
          { label: 'e', why: 'Mismo problema: e no es ≤ que d.' },
          { label: 'a', why: 'a está debajo de b y c: es su meet, no su join.' },
          { label: 'No tiene', ok: true, why: 'Exacto. Hay dos cotas superiores incomparables y ninguna es la más baja.' },
        ]}
      />

      {/* ───────────────────────────── 2.2.4 ───────────────────────────── */}
      <h3>2.2.4 · Equivalencias</h3>
      <Definition n="2.2.4">
        <p>
          Una relación <strong>reflexiva, transitiva y simétrica</strong> es una <strong>equivalencia</strong>. Es una
          forma de decir "s y t son iguales en lo que me importa". Si la comparás con el preorden, la diferencia es que en
          vez de antisimetría pide simetría.
        </p>
        <p>
          Una equivalencia parte a S en grupos que no se pisan, las <strong>clases de equivalencia</strong>: dentro de cada
          grupo todos están relacionados con todos, y entre grupos distintos nadie.
        </p>
      </Definition>

      <Example title="mismo resto al dividir por 3">
        <p>
          Sobre {'{0, 1, 2, 3, 4, 5}'}, s ~ t si s y t dan el mismo resto al dividir por 3. Las clases son {'{0, 3}'},{' '}
          {'{1, 4}'} y {'{2, 5}'}. En el dibujo no están los lazos (todos los tienen) para que se vean las clases:
        </p>
        <RelationGraph nodes={modLayout} r={mod3} width={240} height={230} caption="Tres clases que no se tocan entre sí." />
        <p>
          En programación: dos strings son "equivalentes ignorando mayúsculas" si <code>a.toLowerCase() ===
          b.toLowerCase()</code>. Eso es una equivalencia, y cada clase es un grupo de strings que difieren sólo en
          mayúsculas.
        </p>
      </Example>

      <RelationExercise
        id="tt2-equivalencia"
        title="Una equivalencia con dos clases"
        prompt={
          <p>
            Sobre S = {'{a, b, c}'}, marcá una equivalencia que parta a S en exactamente <strong>dos</strong> clases.
          </p>
        }
        S={S3}
        T={S3}
        name="~"
        check={(r) => {
          const rc = reflexivityCounterexample(S3, r)
          if (rc) return { ok: false, message: `No es reflexiva: falta (${rc}, ${rc}).`, flagged: [rc] }
          const sc = symmetryCounterexample(r)
          if (sc) return { ok: false, message: `No es simétrica: está (${sc[0]}, ${sc[1]}) pero no (${sc[1]}, ${sc[0]}).`, flagged: [sc[1]] }
          const tc = transitivityCounterexample(r)
          if (tc) return { ok: false, message: `No es transitiva: ${tc[0]} ~ ${tc[1]} y ${tc[1]} ~ ${tc[2]}, pero falta (${tc[0]}, ${tc[2]}).`, flagged: [tc[0]] }
          const classes = equivalenceClasses(S3, r)
          const show = classes.map((c) => `{${c.join(', ')}}`).join(' y ')
          if (classes.length !== 2) return { ok: false, message: `Es una equivalencia, pero con ${classes.length} ${classes.length === 1 ? 'clase' : 'clases'}: ${show}.` }
          return { ok: true, message: `Bien: las clases son ${show}. Juntaste dos elementos y dejaste uno solo.` }
        }}
      />

      {/* ───────────────────────────── 2.2.5 a 2.2.8 ───────────────────────────── */}
      <h3>2.2.5 · Clausuras</h3>
      <Definition n="2.2.5">
        <p>
          Si R no tiene una propiedad, la <strong>clausura</strong> es lo que obtenés agregándole a R los pares mínimos
          para que la tenga. "Mínimos" en un sentido preciso: es la relación <em>más chica</em> (con{' '}
          <a href="#/simbolos?ver=incluido">⊆</a>) que contiene a R y tiene la propiedad. Cualquier otra relación con la
          propiedad que contenga a R, la contiene.
        </p>
        <ul>
          <li>
            <strong>Clausura reflexiva</strong>: se agregan los lazos que falten.
          </li>
          <li>
            <strong>Clausura transitiva</strong>, <a href="#/simbolos?ver=clausura-transitiva">R⁺</a>: se agregan los
            atajos, y los atajos de los atajos, hasta que no falte ninguno.
          </li>
          <li>
            <strong>Clausura reflexiva y transitiva</strong>, <a href="#/simbolos?ver=clausura-rt">R*</a>: las dos cosas.
          </li>
        </ul>
      </Definition>

      <Example title="parentesco">
        <p>
          Si R es "es padre o madre de": R⁺ es "es ancestro de" (uno o más pasos) y R* es "es ancestro de, o es la misma
          persona" (cero o más pasos). La clausura reflexiva de R sería "es padre o madre de, o es uno mismo".
        </p>
      </Example>

      <RelationExercise
        id="tt2-clausura-refl"
        title="Completar la clausura reflexiva"
        prompt={
          <p>
            La grilla arranca con R = {showRelation(reflBase)} sobre {'{a, b, c}'}. Agregá lo necesario para tener su
            clausura reflexiva, y nada más.
          </p>
        }
        S={S3}
        T={S3}
        initial={reflBase}
        check={closureCheck(
          reflBase,
          reflexiveClosure(S3, reflBase),
          (r) => {
            const rc = reflexivityCounterexample(S3, r)
            return rc && `Todavía no es reflexiva: falta (${rc}, ${rc}).`
          },
          'Exacto: R más la diagonal. Es justo la fórmula del Ejercicio 2.2.6: R ∪ {(s, s) | s ∈ S}.',
        )}
      />

      <RelationExercise
        id="tt2-clausura-trans"
        title="Completar la clausura transitiva"
        prompt={
          <p>
            La grilla arranca con R = {showRelation(transBase)} sobre {'{a, b, c, d}'}. Agregá lo necesario para tener R⁺,
            y nada más.
          </p>
        }
        S={S4}
        T={S4}
        initial={transBase}
        check={closureCheck(
          transBase,
          transitiveClosure(transBase),
          (r) => {
            const tc = transitivityCounterexample(r)
            return tc && `Todavía no es transitiva: hay ${tc[0]} → ${tc[1]} → ${tc[2]} pero falta el atajo (${tc[0]}, ${tc[2]}).`
          },
          'Bien: agregaste (a, c), (b, d) y (a, d). Fijate que (a, d) recién aparece cuando ya están los otros atajos: por eso hacen falta varios pasos (R₁, R₂, …).',
        )}
      />

      <h3>2.2.6 a 2.2.8 · Los ejercicios del libro</h3>
      <p>
        Las fórmulas de 2.2.6 y 2.2.7 están desarmadas pieza por pieza en{' '}
        <a href="#/simbolos?ver=formulas">Símbolos → Fórmulas paso a paso</a>. Acá va el gráfico de nuevo, y abajo, qué
        pide demostrar cada ejercicio y una idea de cómo hacerlo. Intentalo antes de abrir las demostraciones.
      </p>
      <ClosureStepper />

      <p>
        <strong>Qué quiere decir "mostrá que R′ es la clausura"</strong>. Por la definición 2.2.5, hay que probar tres
        cosas: (1) R′ contiene a R, (2) R′ tiene la propiedad, y (3) R′ es la más chica: si otra R″ contiene a R y tiene la
        propiedad, entonces R′ ⊆ R″.
      </p>

      <details>
        <summary>Una demostración del Ejercicio 2.2.6 (clausura reflexiva)</summary>
        <p>R′ = R ∪ {'{(s, s) | s ∈ S}'}.</p>
        <ol>
          <li>R ⊆ R′: R′ es R unión algo, así que todo lo de R está.</li>
          <li>R′ es reflexiva: para cada s ∈ S, (s, s) está en el segundo pedazo de la unión.</li>
          <li>
            Es la más chica: sea R″ reflexiva con R ⊆ R″. Tomá un par cualquiera de R′. O está en R, y entonces está en
            R″ porque R ⊆ R″; o es un (s, s), y entonces está en R″ porque R″ es reflexiva. En los dos casos está en R″,
            así que R′ ⊆ R″.
          </li>
        </ol>
      </details>

      <details>
        <summary>Una demostración del Ejercicio 2.2.7 (clausura transitiva)</summary>
        <p>R⁺ = ⋃ᵢ Rᵢ, con R₀ = R y Rᵢ₊₁ = Rᵢ más los atajos de los caminos de dos flechas en Rᵢ.</p>
        <ol>
          <li>R ⊆ R⁺: R = R₀, y R₀ es uno de los conjuntos de la unión.</li>
          <li>
            R⁺ es transitiva: supongamos (s, t) ∈ R⁺ y (t, u) ∈ R⁺. Entonces (s, t) está en algún Rᵢ y (t, u) en algún
            Rⱼ. Como la lista crece (R₀ ⊆ R₁ ⊆ …), los dos están en R<sub>k</sub> con k el mayor entre i y j. Pero
            entonces s → t → u es un camino de dos flechas en R<sub>k</sub>, y por la definición (s, u) ∈ R
            <sub>k+1</sub> ⊆ R⁺.
          </li>
          <li>
            Es la más chica: sea R″ transitiva con R ⊆ R″. Veamos que cada Rᵢ ⊆ R″, uno por uno. R₀ = R ⊆ R″. Y si Rᵢ ⊆
            R″, todo par nuevo de Rᵢ₊₁ viene de un (s, t) y un (t, u) que están en Rᵢ, o sea en R″; como R″ es transitiva,
            (s, u) ∈ R″. Así que todos los Rᵢ están dentro de R″, y su unión también. (Este "uno por uno" es una
            demostración por inducción, que el libro formaliza en 2.4.)
          </li>
        </ol>
      </details>

      <details>
        <summary>Una idea para el Ejercicio 2.2.8 (preservación por R*)</summary>
        <p>
          Hay que ver que si P se preserva por R (ver 2.1.10), también se preserva por R*. Que s R* s′ quiere decir que se
          llega de s a s′ con cero o más pasos de R: s = s₀ R s₁ R s₂ … R sₙ = s′. Si vale P(s₀), como P se preserva por R,
          vale P(s₁); de ahí, P(s₂); y así hasta P(sₙ) = P(s′). Si son cero pasos, s′ = s y no hay nada que probar.
        </p>
        <p>
          Esto es lo que en el libro va a decir que <em>evaluar varios pasos</em> tampoco rompe los tipos: alcanza con que
          no los rompa un paso.
        </p>
      </details>

      {/* ───────────────────────────── 2.2.9 y 2.2.10 ───────────────────────────── */}
      <h3>2.2.9 y 2.2.10 · Cadenas decrecientes y órdenes bien fundados</h3>
      <Definition n="2.2.9">
        <p>
          Con un preorden ≤, una <strong>cadena decreciente</strong> es una lista s₁, s₂, s₃, … en la que cada elemento es
          estrictamente menor que el anterior: sᵢ₊₁ &lt; sᵢ. Es una "escalera que sólo baja". Puede ser finita o infinita.
        </p>
      </Definition>
      <Definition n="2.2.10">
        <p>
          Un preorden es <strong>bien fundado</strong> si no tiene cadenas decrecientes <em>infinitas</em>: toda escalera
          que baja, en algún momento se termina.
        </p>
      </Definition>

      <Example title="ℕ sí, ℤ no">
        <ul>
          <li>
            En ℕ con el ≤ de siempre, cualquier cadena decreciente termina: 9 &gt; 5 &gt; 2 &gt; 0, y debajo del 0 no hay
            nada. ℕ es bien fundado.
          </li>
          <li>
            En ℤ, 0 &gt; −1 &gt; −2 &gt; −3 &gt; … nunca termina. ℤ no es bien fundado.
          </li>
          <li>
            Todo orden parcial sobre un conjunto <em>finito</em> es bien fundado: una cadena que baja estrictamente no puede
            repetir elementos, y se le acaban.
          </li>
        </ul>
      </Example>

      <Pitfall>
        <p>
          Con un preorden que tiene empates pasa algo raro. Como s &lt; t es "s ≤ t y s ≠ t", si a y b están empatados (a ≤
          b y b ≤ a, distintos), entonces a &lt; b <em>y</em> b &lt; a. Así, a, b, a, b, … es una cadena decreciente
          infinita. Por ejemplo, los strings ordenados por largo no son bien fundados con esta definición, aunque el
          largo nunca baje de 0.
        </p>
      </Pitfall>

      <Example title="para qué sirve">
        <p>
          Es la herramienta para demostrar que algo <strong>termina</strong>. Si cada paso de un programa hace bajar un
          número natural (el largo de una lista, el tamaño de un término), el programa no puede dar infinitos pasos: sería
          una cadena decreciente infinita en ℕ. El libro lo usa así, por ejemplo, para probar que la evaluación de ciertos
          lenguajes siempre termina. También es la base de la inducción (2.4).
        </p>
      </Example>

      <NumberExercise
        id="tt2-cadena"
        title="La escalera más larga"
        prompt={
          <p>
            En los divisores de 12 ordenados por "divide a", ¿cuántos elementos tiene la cadena decreciente más larga que
            empieza en 12?
          </p>
        }
        answer={4}
        wrong="Bajá por el diagrama de Hasse de a un escalón por vez, sin saltearte ninguno. ¿Cuántos puntos tocás?"
        explanation={
          <p>
            4: por ejemplo 12, 6, 3, 1 o 12, 4, 2, 1. Cada uno es estrictamente menor (divide y es distinto) que el
            anterior. Más larga no hay, porque el diagrama tiene 4 niveles.
          </p>
        }
      />

      <ChoiceExercise
        id="tt2-bien-fundado"
        title="¿Cuál es bien fundado?"
        prompt={<p>Uno solo de estos órdenes es bien fundado. ¿Cuál?</p>}
        options={[
          { label: 'ℤ con ≤', why: '0, −1, −2, … baja para siempre.' },
          {
            label: 'ℕ con ≥ (el orden al revés)',
            why: 'Con el orden al revés, "más chico" quiere decir "número más grande": 0, 1, 2, 3, … es una cadena decreciente infinita.',
          },
          { label: 'Los racionales entre 0 y 1 con ≤', why: '1, 1/2, 1/4, 1/8, … baja para siempre sin llegar nunca al 0.' },
          {
            label: 'Los subconjuntos finitos de ℕ con ⊆',
            ok: true,
            why: 'Sí. Bajar estrictamente con ⊆ es sacar al menos un elemento, así que el tamaño (un natural) baja en cada paso, y eso no puede pasar infinitas veces.',
          },
        ]}
      />
    </>
  )
}
