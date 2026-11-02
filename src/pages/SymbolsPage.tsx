import { useEffect, useState, type ReactNode } from 'react'
import { Example, Pitfall } from '../components/Boxes'
import { ClosureStepper } from '../components/ClosureStepper'
import { RelationGrid } from '../components/RelationGrid'
import { NestedSets, Venn } from '../components/SetDiagrams'
import type { Relation } from '../core/relations'
import { useQueryParam } from '../lib/router'

// Leyenda de símbolos: qué significa cada uno, cómo se lee y ejemplos, de los
// fáciles a los que aparecen en los libros. Al final, fórmulas del libro de TT
// desarmadas pieza por pieza. Los textos son propios.

/** Link a otra entrada de la leyenda. */
const L = ({ to, children }: { to: string; children: ReactNode }) => <a href={`#/simbolos?ver=${to}`}>{children}</a>

/** Un operador grande con su índice abajo, como ⋃ con la i. */
const BigOp = ({ op, below }: { op: string; below: ReactNode }) => (
  <span className="bigop">
    <span>{op}</span>
    <span>{below}</span>
  </span>
)

interface Entry {
  id: string
  glyph: ReactNode
  /** Versión en texto del símbolo, para el buscador. */
  text: string
  name: string
  reads: string
  body: ReactNode
}

interface Group {
  title: string
  intro?: ReactNode
  entries: Entry[]
}

const reflexS = ['a', 'b', 'c']
const reflexR: Relation = [['a', 'b']]
const reflexRp: Relation = [['a', 'b'], ['a', 'a'], ['b', 'b'], ['c', 'c']]
const product: Relation = ['1', '2'].flatMap((s) => ['a', 'b', 'c'].map((t) => [s, t] as const))

const groups: Group[] = [
  {
    title: 'Cómo leer la notación',
    intro: (
      <p>
        Antes de los símbolos en sí, algunas convenciones de escritura. Son las que más confunden, porque nadie las
        explica: se dan por sabidas.
      </p>
    ),
    entries: [
      {
        id: 'definicion',
        glyph: '=',
        text: '=',
        name: 'Igual, en una definición',
        reads: '"se define como", "es, por definición"',
        body: (
          <>
            <p>
              Cuando el libro escribe <code>R₀ = R</code> no está afirmando algo que haya que comprobar: está{' '}
              <strong>poniéndole nombre</strong> a algo. Es como <code>const R0 = R</code> en código. A la izquierda va el
              nombre nuevo y a la derecha, lo que significa.
            </p>
            <p>Algunos autores usan := o ≝ para que se note que es una definición. Este libro usa = y lo deja al contexto.</p>
          </>
        ),
      },
      {
        id: 'prima',
        glyph: "s′",
        text: "prima ' ′ ″",
        name: 'Prima',
        reads: '"s prima"; s″ es "s biprima"',
        body: (
          <>
            <p>
              La prima <strong>no es una operación</strong>: es parte del nombre. s, s′ y s″ son tres variables distintas.
              Se usa para decir "otra cosa del mismo tipo que s, probablemente relacionada". Es como llamar{' '}
              <code>s</code>, <code>s2</code> y <code>s3</code> a tres variables en un programa.
            </p>
            <Example title="fácil">
              <p>
                En <code>s R s′</code>, s y s′ son dos elementos cualesquiera. El nombre s′ sugiere "el que viene después
                de s", pero eso lo dice R, no la prima.
              </p>
            </Example>
            <Example title="del libro (Definición 2.2.5)">
              <p>
                "La clausura reflexiva de R es la relación R′ más chica…; si R″ es otra relación reflexiva que contiene a
                R, entonces R′ ⊆ R″". Acá R′ es la relación que se está definiendo y R″ es cualquier otra con la que se la
                compara. Son dos nombres para dos relaciones distintas.
              </p>
            </Example>
            <Pitfall>
              <p>En análisis matemático f′ es la derivada de f. En estos libros, nunca.</p>
            </Pitfall>
          </>
        ),
      },
      {
        id: 'subindice',
        glyph: 'Rᵢ',
        text: 'subíndice sub i índice R_i',
        name: 'Subíndice',
        reads: '"R sub i"; Rᵢ₊₁ es "R sub i más uno"',
        body: (
          <>
            <p>
              Un subíndice <strong>numera</strong> una familia de cosas parecidas: S₁, S₂, S₃ son tres conjuntos distintos.
              Es exactamente un índice de array: <code>Rᵢ</code> es <code>R[i]</code>.
            </p>
            <p>
              El subíndice puede ser una cuenta. <code>Rᵢ₊₁</code> es "el que viene después de Rᵢ": si i = 2, Rᵢ₊₁ es R₃.
              En código, <code>R[i + 1]</code>.
            </p>
            <Example title="fácil">
              <p>S₁ × S₂ × S₃: el producto de tres conjuntos, que se llaman S₁, S₂ y S₃.</p>
            </Example>
            <Example title="del libro (Ejercicio 2.2.7)">
              <p>
                <code>R₀ = R</code> y <code>Rᵢ₊₁ = Rᵢ ∪ …</code> definen una lista infinita R₀, R₁, R₂, … La primera línea
                dice cómo empieza y la segunda cómo sacar cada una a partir de la anterior. Ver{' '}
                <L to="formulas">fórmulas paso a paso</L>.
              </p>
            </Example>
          </>
        ),
      },
      {
        id: 'superindice',
        glyph: 'R⁺',
        text: 'superíndice + * potencia R+ R*',
        name: 'Superíndice',
        reads: 'depende: "dos al cubo", "R más", "R estrella"',
        body: (
          <>
            <p>Un superíndice (algo chiquito arriba a la derecha) tiene dos usos muy distintos:</p>
            <ul>
              <li>
                <strong>Potencia</strong>, si es un número sobre un número: 2³ = 8, o 2<sup>|S|</sup>.
              </li>
              <li>
                <strong>Decoración del nombre</strong>, si es un símbolo sobre una relación o un conjunto: R⁺ y R* no son
                "R elevado a algo". Son nombres de relaciones nuevas construidas a partir de R. Ver{' '}
                <L to="clausura-transitiva">R⁺</L> y <L to="clausura-rt">R*</L>.
              </li>
            </ul>
            <p>
              Si programaste con expresiones regulares, ya conocés la idea: en <code>a+</code> el + quiere decir "una o
              más veces" y en <code>a*</code>, "cero o más veces". R⁺ y R* usan el + y el * con ese mismo sentido.
            </p>
          </>
        ),
      },
      {
        id: 'barra',
        glyph: '|',
        text: '| barra tales que tamaño',
        name: 'Barra vertical',
        reads: 'depende del lugar: "tales que" o "el tamaño de"',
        body: (
          <>
            <p>El mismo símbolo, dos significados. Se distinguen por dónde está:</p>
            <ul>
              <li>
                <strong>Adentro de llaves, con algo a cada lado</strong>: "tales que". En{' '}
                <code>{'{x ∈ ℕ | x < 4}'}</code>, la barra separa "qué elementos" de "qué condición cumplen". Ver{' '}
                <L to="comprension">comprensión</L>.
              </li>
              <li>
                <strong>Rodeando algo</strong>: tamaño. <code>|S|</code> es la cantidad de elementos de S. Ver{' '}
                <L to="tamano">|S|</L>.
              </li>
            </ul>
          </>
        ),
      },
      {
        id: 'griegas',
        glyph: 'Γ λ',
        text: 'griegas alfa beta gamma lambda sigma tau delta',
        name: 'Letras griegas',
        reads: 'por su nombre',
        body: (
          <>
            <p>Las que vas a cruzarte, para poder leerlas en voz alta:</p>
            <table className="plain">
              <tbody>
                <tr>
                  <td>α β γ</td>
                  <td>alfa, beta, gamma (minúsculas)</td>
                </tr>
                <tr>
                  <td>Γ Δ</td>
                  <td>gamma y delta mayúsculas: en TT, Γ es el contexto de tipado</td>
                </tr>
                <tr>
                  <td>λ</td>
                  <td>lambda: funciones anónimas (cálculo lambda)</td>
                </tr>
                <tr>
                  <td>σ τ</td>
                  <td>sigma y tau: en TT se usan a veces para tipos</td>
                </tr>
              </tbody>
            </table>
            <Pitfall>
              <p>∅ (el conjunto vacío) no es una letra griega, aunque se parece a φ (fi).</p>
            </Pitfall>
          </>
        ),
      },
    ],
  },
  {
    title: 'Conjuntos',
    entries: [
      {
        id: 'pertenece',
        glyph: '∈ ∉',
        text: '∈ ∉ pertenece elemento',
        name: 'Pertenece, no pertenece',
        reads: '"x pertenece a S", "x está en S"; ∉ es "no pertenece"',
        body: (
          <>
            <p>
              <code>x ∈ S</code> dice que x es uno de los elementos de S. Es <code>S.includes(x)</code>.
            </p>
            <Example title="fácil">
              <p>3 ∈ {'{1, 2, 3}'} y 5 ∉ {'{1, 2, 3}'}.</p>
            </Example>
            <Example title="más complejo">
              <p>
                Los elementos pueden ser cualquier cosa, incluso pares o conjuntos. Si R = {'{(1, a), (2, b)}'}, entonces
                (1, a) ∈ R: el par entero es un elemento. Y si S = {'{a, b}'}, entonces {'{a}'} ∈ P(S), porque los
                elementos de <L to="potencia">P(S)</L> son conjuntos.
              </p>
            </Example>
          </>
        ),
      },
      {
        id: 'incluido',
        glyph: '⊆',
        text: '⊆ ⊂ ⊊ ⊇ incluido subconjunto contenido',
        name: 'Incluido (subconjunto)',
        reads: '"A está incluido en B", "A es subconjunto de B"',
        body: (
          <>
            <p>
              <code>A ⊆ B</code> dice que <strong>todo</strong> elemento de A también es elemento de B. A puede ser más
              chico que B o igual a B. En código: <code>A.every(x =&gt; B.includes(x))</code>.
            </p>
            <Venn op="subset" caption="A ⊆ B: A queda entero adentro de B." />
            <Example title="fácil">
              <ul>
                <li>{'{1, 2}'} ⊆ {'{1, 2, 3}'}.</li>
                <li>{'{1, 4}'} ⊈ {'{1, 2, 3}'}: el 4 se escapa.</li>
                <li>
                  S ⊆ S siempre, y ∅ ⊆ S siempre: el vacío no tiene ningún elemento que se pueda escapar.
                </li>
              </ul>
            </Example>
            <Example title="más complejo">
              <ul>
                <li>
                  Una relación entre S y T es un R ⊆ S × T: un subconjunto del <L to="producto">producto</L>, o sea una
                  elección de algunos pares.
                </li>
                <li>
                  En el Ejercicio 2.2.7, R₀ ⊆ R₁ ⊆ R₂ ⊆ …: cada Rᵢ₊₁ se arma agregando pares a Rᵢ, así que lo incluye.
                </li>
                <li>
                  "R′ es la relación <em>más chica</em> que…" quiere decir: R′ ⊆ R″ para cualquier otra R″ que cumpla lo
                  mismo. "Más chica" se mide con ⊆.
                </li>
              </ul>
            </Example>
            <p>
              <strong>Cómo se demuestra A ⊆ B</strong>: tomás un x cualquiera de A y mostrás que x ∈ B. Y para mostrar que
              A = B, se prueban las dos inclusiones: A ⊆ B y B ⊆ A.
            </p>
            <p>Variantes:</p>
            <ul>
              <li>
                <code>A ⊊ B</code>: incluido y distinto (B tiene algo que A no tiene).
              </li>
              <li>
                <code>B ⊇ A</code>: lo mismo que A ⊆ B, escrito al revés: "B contiene a A".
              </li>
              <li>
                <code>A ⊂ B</code>: según el autor, significa ⊆ o ⊊. Mirá el contexto.
              </li>
            </ul>
            <Pitfall>
              <p>
                ⊆ compara <em>conjuntos con conjuntos</em>; <L to="pertenece">∈</L> compara un <em>elemento</em> con un
                conjunto. Con S = {'{a, b}'}: a ∈ S y {'{a}'} ⊆ S son verdaderos, pero a ⊆ S y {'{a}'} ∈ S no.
              </p>
            </Pitfall>
          </>
        ),
      },
      {
        id: 'vacio',
        glyph: '∅',
        text: '∅ vacío',
        name: 'Conjunto vacío',
        reads: '"vacío"',
        body: (
          <>
            <p>El conjunto sin elementos. Hay uno solo. |∅| = 0, ∅ ⊆ S para todo S, y no hay ningún x con x ∈ ∅.</p>
            <Example title="más complejo">
              <p>
                {'{∅}'} <em>no</em> es vacío: tiene un elemento, que es el conjunto vacío. Y P(∅) = {'{∅}'}.
              </p>
            </Example>
          </>
        ),
      },
      {
        id: 'llaves',
        glyph: '{ }',
        text: '{} llaves extensión',
        name: 'Llaves (por extensión)',
        reads: '"el conjunto formado por…"',
        body: (
          <p>
            <code>{'{1, 2, 3}'}</code> es el conjunto con esos elementos. No importa el orden ni las repeticiones:{' '}
            {'{3, 1, 1, 2}'} es el mismo conjunto. Con "…" se indica que sigue el patrón: {'{0, 2, 4, …}'}.
          </p>
        ),
      },
      {
        id: 'comprension',
        glyph: '{x | …}',
        text: 'comprensión tales que filter map',
        name: 'Comprensión',
        reads: '"el conjunto de los x tales que…"',
        body: (
          <>
            <p>Arma un conjunto describiendo sus elementos en lugar de listarlos. Hay dos formas:</p>
            <ul>
              <li>
                <strong>Filtrar</strong>: <code>{'{x ∈ S | condición}'}</code> son los x de S que cumplen la condición. En
                código: <code>S.filter(x =&gt; condición)</code>.
              </li>
              <li>
                <strong>Construir</strong>: <code>{'{expresión | x ∈ S}'}</code> es lo que da la expresión para cada x de S.
                En código: <code>S.map(x =&gt; expresión)</code>.
              </li>
            </ul>
            <p>Las dos se combinan: a la izquierda de la barra va qué se arma y a la derecha, de dónde salen las variables y qué condiciones cumplen.</p>
            <Example title="fácil">
              <ul>
                <li>
                  {'{x ∈ ℕ | x < 4}'} = {'{0, 1, 2, 3}'} (filtrar).
                </li>
                <li>
                  {'{2n | n ∈ ℕ}'} = {'{0, 2, 4, 6, …}'} (construir: el doble de cada natural).
                </li>
              </ul>
            </Example>
            <Example title="del libro (Ejercicio 2.2.6)">
              <p>
                <code>{'{(s, s) | s ∈ S}'}</code>: para cada s de S, el par (s, s). Si S = {'{a, b, c}'}, es{' '}
                {'{(a, a), (b, b), (c, c)}'}. En código: <code>S.map(s =&gt; [s, s])</code>.
              </p>
            </Example>
            <Example title="del libro (Ejercicio 2.2.7)">
              <p>
                <code>{'{(s, u) | para algún t, (s, t) ∈ Rᵢ y (t, u) ∈ Rᵢ}'}</code>: los pares (s, u) para los que hay un t
                intermedio con s → t y t → u. Está desarmada en <L to="formulas">fórmulas paso a paso</L>.
              </p>
            </Example>
          </>
        ),
      },
      {
        id: 'union',
        glyph: '∪',
        text: '∪ unión',
        name: 'Unión',
        reads: '"A unión B"',
        body: (
          <>
            <p>
              <code>A ∪ B</code> tiene todo lo que está en A, en B o en los dos. Un x está en A ∪ B si x ∈ A{' '}
              <L to="o">o</L> x ∈ B. En código: <code>new Set([...A, ...B])</code>.
            </p>
            <Venn op="union" caption="A ∪ B: todo lo sombreado." />
            <Example title="fácil">
              <p>
                {'{1, 2}'} ∪ {'{2, 3}'} = {'{1, 2, 3}'}. El 2 aparece una sola vez: en un conjunto no hay repetidos.
              </p>
            </Example>
            <Example title="del libro">
              <p>
                <code>R ∪ {'{(s, s) | s ∈ S}'}</code>: "a R agregale los pares (s, s)". Cuando el libro escribe "X ∪ algo",
                casi siempre está diciendo "X con algo agregado".
              </p>
            </Example>
          </>
        ),
      },
      {
        id: 'interseccion',
        glyph: '∩',
        text: '∩ intersección disjuntos',
        name: 'Intersección',
        reads: '"A intersección B"',
        body: (
          <>
            <p>
              <code>A ∩ B</code> tiene lo que está en A <L to="y">y</L> en B a la vez. En código:{' '}
              <code>A.filter(x =&gt; B.includes(x))</code>.
            </p>
            <Venn op="inter" caption="A ∩ B: sólo la parte común." />
            <Venn op="disjoint" caption="Disjuntos: A ∩ B = ∅, no comparten nada." />
            <Example title="fácil">
              <p>
                {'{1, 2, 3}'} ∩ {'{2, 3, 4}'} = {'{2, 3}'}. {'{1}'} ∩ {'{2}'} = ∅: se dice que son <em>disjuntos</em>.
              </p>
            </Example>
          </>
        ),
      },
      {
        id: 'diferencia',
        glyph: '∖',
        text: '\\ ∖ diferencia menos',
        name: 'Diferencia',
        reads: '"A menos B"',
        body: (
          <>
            <p>
              <code>A \ B</code> tiene lo que está en A y no en B. En código:{' '}
              <code>A.filter(x =&gt; !B.includes(x))</code>.
            </p>
            <Venn op="diff" caption="A \ B: lo de A que no toca B." />
            <Example title="fácil">
              <p>
                {'{1, 2, 3}'} \ {'{2, 5}'} = {'{1, 3}'}. El 5 no molesta: sólo se saca lo que estaba en A.
              </p>
            </Example>
          </>
        ),
      },
      {
        id: 'producto',
        glyph: '×',
        text: '× producto cartesiano pares tuplas',
        name: 'Producto cartesiano',
        reads: '"S por T", "S cruz T"',
        body: (
          <>
            <p>
              <code>S × T</code> es el conjunto de <strong>todos</strong> los pares (s, t) con s ∈ S y t ∈ T. Tiene |S| ·
              |T| elementos. En código, dos loops anidados.
            </p>
            <p>Se ve como una grilla con todas las casillas marcadas. Acá, {'{1, 2}'} × {'{a, b, c}'}, 6 pares:</p>
            <RelationGrid S={['1', '2']} T={['a', 'b', 'c']} value={product} name="×" />
            <Example title="más complejo">
              <ul>
                <li>En un par importa el orden: (1, a) ≠ (a, 1). Y S × T no es lo mismo que T × S.</li>
                <li>Con tres conjuntos, S × T × U tiene triplas (s, t, u).</li>
                <li>
                  Una relación es un subconjunto de S × T: de la grilla completa, elegís algunas casillas. Por eso hay 2
                  <sup>|S|·|T|</sup> relaciones posibles.
                </li>
              </ul>
            </Example>
          </>
        ),
      },
      {
        id: 'potencia',
        glyph: 'P(S)',
        text: 'P(S) potencia partes subconjuntos 𝒫',
        name: 'Conjunto potencia',
        reads: '"partes de S", "potencia de S"',
        body: (
          <>
            <p>
              El conjunto de <strong>todos los subconjuntos</strong> de S. Tiene 2<sup>|S|</sup> elementos, porque por
              cada elemento de S decidís si lo ponés o no. A veces se escribe 𝒫(S) o 2<sup>S</sup>.
            </p>
            <Example title="fácil">
              <p>P({'{a, b}'}) = {'{∅, {a}, {b}, {a, b}}'}. 2² = 4 elementos.</p>
            </Example>
            <Example title="más complejo">
              <p>
                X ⊆ S y X ∈ P(S) dicen exactamente lo mismo. Y las relaciones entre S y T son justo los elementos de P(S ×
                T).
              </p>
            </Example>
          </>
        ),
      },
      {
        id: 'tamano',
        glyph: '|S|',
        text: '|S| tamaño cardinal cantidad',
        name: 'Tamaño (cardinal)',
        reads: '"el tamaño de S", "el cardinal de S"',
        body: (
          <p>
            La cantidad de elementos de S: <code>S.size</code>. |{'{a, b, c}'}| = 3, |∅| = 0, |S × T| = |S| · |T| y |P(S)|
            = 2<sup>|S|</sup>.
          </p>
        ),
      },
      {
        id: 'union-indexada',
        glyph: (
          <BigOp op="⋃" below="i" />
        ),
        text: '⋃ unión indexada gran unión U grande i debajo',
        name: 'Unión indexada (la "U grande")',
        reads: '"la unión de todos los Rᵢ"',
        body: (
          <>
            <p>
              Es una unión de <strong>muchos</strong> conjuntos de una sola vez. La U grande es la unión ∪ en tamaño
              grande, y lo que va abajo dice qué variable va cambiando:
            </p>
            <p className="formula">
              <BigOp op="⋃" below="i" /> Rᵢ = R₀ ∪ R₁ ∪ R₂ ∪ R₃ ∪ …
            </p>
            <p>
              La <strong>i de abajo</strong> es el índice: dice "hacé variar i por todos sus valores y uní todos los Rᵢ que
              salgan". Si no se aclara el rango, se sobreentiende por el contexto: acá i = 0, 1, 2, … (todos los
              naturales). A veces el rango se escribe explícito: ⋃<sub>i ∈ ℕ</sub>, o ⋃ con i = 1 abajo y n arriba (de 1 a
              n).
            </p>
            <p>
              Si viste la sumatoria Σ, es lo mismo con otra operación: Σᵢ aᵢ = a₀ + a₁ + a₂ + … suma muchos números; ⋃ᵢ Rᵢ
              une muchos conjuntos. En código:
            </p>
            <pre className="mono">{`// ⋃ᵢ Rᵢ, si tenés los Rᵢ en un array
const union = new Set(Rs.flat())`}</pre>
            <p>
              <strong>Cuándo está algo en la unión</strong>: x ∈ ⋃ᵢ Rᵢ si x está en <em>algún</em> Rᵢ (al menos uno).
            </p>
            <Example title="fácil">
              <p>
                Con A₁ = {'{1}'}, A₂ = {'{1, 2}'} y A₃ = {'{5}'}: la unión de los Aᵢ con i de 1 a 3 es A₁ ∪ A₂ ∪ A₃ ={' '}
                {'{1, 2, 5}'}.
              </p>
            </Example>
            <Example title="del libro (Ejercicio 2.2.7)">
              <p>
                En R⁺ = ⋃ᵢ Rᵢ, los Rᵢ están anidados: R₀ ⊆ R₁ ⊆ R₂ ⊆ … Cuando cada uno contiene al anterior, la unión de
                todos es "lo que se acumula al final", como en el dibujo:
              </p>
              <NestedSets names={['R₀', 'R₁', 'R₂', 'R⁺']} />
              <p>
                Ver <L to="formulas">fórmulas paso a paso</L>.
              </p>
            </Example>
          </>
        ),
      },
      {
        id: 'interseccion-indexada',
        glyph: <BigOp op="⋂" below="i" />,
        text: '⋂ intersección indexada',
        name: 'Intersección indexada',
        reads: '"la intersección de todos los Aᵢ"',
        body: (
          <p>
            Igual que la <L to="union-indexada">unión indexada</L>, pero con ∩: ⋂ᵢ Aᵢ = A₀ ∩ A₁ ∩ A₂ ∩ … Un x está si está
            en <em>todos</em> los Aᵢ. Con A₁ = {'{1, 2, 3}'}, A₂ = {'{2, 3}'} y A₃ = {'{3, 4}'}, da {'{3}'}.
          </p>
        ),
      },
      {
        id: 'numeros',
        glyph: 'ℕ ℤ',
        text: 'ℕ ℤ ℝ naturales enteros reales',
        name: 'Conjuntos de números',
        reads: '"los naturales", "los enteros", "los reales"',
        body: (
          <ul>
            <li>
              ℕ = {'{0, 1, 2, …}'}: naturales. En TT el 0 está incluido; otros autores empiezan en 1.
            </li>
            <li>ℤ = {'{…, −2, −1, 0, 1, 2, …}'}: enteros.</li>
            <li>ℝ: reales.</li>
          </ul>
        ),
      },
    ],
  },
  {
    title: 'Relaciones y funciones',
    entries: [
      {
        id: 'infija',
        glyph: 's R t',
        text: 'R relación infija',
        name: 'Relación, escrita en el medio',
        reads: '"s está relacionado con t por R"',
        body: (
          <p>
            Es otra forma de escribir (s, t) ∈ R, igual que escribís 3 &lt; 5 y no (3, 5) ∈ &lt;. Ver el{' '}
            <a href="#/tt/preliminares">capítulo 2 de TT</a>.
          </p>
        ),
      },
      {
        id: 'flecha',
        glyph: 'f : S → T',
        text: '→ flecha función dominio codominio',
        name: 'Tipo de una función',
        reads: '"f va de S a T"',
        body: (
          <>
            <p>
              Dice que f es una función con entradas en S y salidas en T. Es la firma de la función:{' '}
              <code>f: (s: S) =&gt; T</code>.
            </p>
            <Pitfall>
              <p>
                La flecha → tiene otros usos según el contexto. En TC une objetos de una categoría. En TT, más adelante,{' '}
                <code>t → t′</code> es "t da un paso de evaluación" (ver <L to="paso">t → t′</L>) y <code>T₁ → T₂</code> es
                el tipo de las funciones.
              </p>
            </Pitfall>
          </>
        ),
      },
      {
        id: 'mapsto',
        glyph: 'x ↦ x+1',
        text: '↦ mapsto va a',
        name: 'Flecha con palito',
        reads: '"x va a x + 1"',
        body: (
          <p>
            Describe una función sin ponerle nombre, diciendo qué hace con cada entrada. <code>x ↦ x + 1</code> es{' '}
            <code>x =&gt; x + 1</code>. No confundir con →, que dice entre qué conjuntos va la función, no qué hace.
          </p>
        ),
      },
      {
        id: 'composicion',
        glyph: 'g ∘ f',
        text: '∘ composición después',
        name: 'Composición',
        reads: '"g después de f", "g compuesta con f"',
        body: (
          <p>
            (g ∘ f)(x) = g(f(x)): primero f, después g. Se lee de derecha a izquierda. Ver el{' '}
            <a href="#/tc/conjuntos">capítulo 1 de TC</a>.
          </p>
        ),
      },
      {
        id: 'definida',
        glyph: 'f(x)↓ ↑',
        text: '↓ ↑ definida indefinida diverge',
        name: 'Definida, indefinida',
        reads: '"f está definida en x" / "f diverge en x"',
        body: (
          <p>
            Para funciones parciales: ↓ dice que f(x) da un resultado y ↑, que no (por ejemplo, porque el programa no
            termina). Ver el <a href="#/tt/preliminares">capítulo 2 de TT</a>, 2.1.9.
          </p>
        ),
      },
      {
        id: 'orden',
        glyph: '≤ <',
        text: '≤ < menor orden estrictamente',
        name: 'Menor o igual, menor estricto',
        reads: '"s es menor o igual que t"; "s es estrictamente menor que t"',
        body: (
          <>
            <p>
              En los libros, ≤ no es sólo el de los números: es el nombre que se le da a <em>cualquier</em> preorden u orden
              (ver el <a href="#/tt/preliminares">capítulo 2 de TT</a>, 2.2.2). s &lt; t quiere decir s ≤ t y s ≠ t.
            </p>
            <Example title="más complejo">
              <p>
                Con "divide a" como ≤, 2 ≤ 6 y 3 ≤ 6, pero ni 2 ≤ 3 ni 3 ≤ 2: en un orden parcial puede haber pares que no
                se comparan. Con los números de siempre eso nunca pasa.
              </p>
            </Example>
          </>
        ),
      },
      {
        id: 'sqsubseteq',
        glyph: '⊑',
        text: '⊑ orden cuadrado',
        name: 'Menor o igual "cuadrado"',
        reads: '"s está debajo de t", "s es menor o igual que t"',
        body: (
          <p>
            Es otro nombre para un orden, que se usa cuando ≤ ya está ocupado o para que se note que no es el orden de los
            números. Se lee igual que ≤. No es lo mismo que <L to="incluido">⊆</L>, aunque se parezcan.
          </p>
        ),
      },
      {
        id: 'clausura-transitiva',
        glyph: 'R⁺',
        text: 'R+ clausura transitiva más',
        name: 'Clausura transitiva',
        reads: '"R más", "la clausura transitiva de R"',
        body: (
          <>
            <p>
              El + <strong>no es una suma</strong>: es parte del nombre. R⁺ es la relación "se llega con{' '}
              <strong>uno o más</strong> pasos de R". O sea: s R⁺ u si podés ir de s a u siguiendo una o más flechas de R.
            </p>
            <p>
              Es la relación <em>transitiva</em> más chica que contiene a R. Transitiva quiere decir: si s → t y t → u,
              entonces también s → u.
            </p>
            <Example title="fácil">
              <p>
                Si R es "es padre o madre de", R⁺ es "es ancestro de": padre, abuelo, bisabuelo… cualquier cantidad de
                pasos, pero al menos uno.
              </p>
            </Example>
            <Example title="del libro">
              <p>
                El Ejercicio 2.2.7 la construye paso a paso con R₀, R₁, R₂, … y una <L to="union-indexada">unión
                indexada</L>. Está desarmada en <L to="formulas">fórmulas paso a paso</L>, con un gráfico interactivo.
              </p>
            </Example>
          </>
        ),
      },
      {
        id: 'clausura-rt',
        glyph: 'R*',
        text: 'R* estrella clausura reflexiva transitiva',
        name: 'Clausura reflexiva y transitiva',
        reads: '"R estrella"',
        body: (
          <>
            <p>
              Como R⁺, pero con <strong>cero o más</strong> pasos. La diferencia es que con cero pasos te quedás donde
              estás, así que siempre vale s R* s.
            </p>
            <Example title="fácil">
              <p>Si R es "es padre o madre de", R* es "es ancestro de, o es uno mismo".</p>
            </Example>
            <Example title="lo que viene en TT">
              <p>
                <code>t →* t′</code> quiere decir "t evalúa a t′ en cero o más pasos". Es R* aplicado a la relación{' '}
                <L to="paso">→</L> de evaluación.
              </p>
            </Example>
          </>
        ),
      },
    ],
  },
  {
    title: 'Lógica',
    intro: (
      <p>
        El libro de TT escribe casi todo esto en palabras ("for all", "for some", "implies"), pero conviene reconocer los
        símbolos porque aparecen en otros textos y en los apuntes.
      </p>
    ),
    entries: [
      {
        id: 'paratodo',
        glyph: '∀',
        text: '∀ para todo cualquier',
        name: 'Para todo',
        reads: '"para todo x"',
        body: (
          <p>
            <code>∀x ∈ S. P(x)</code>: P vale para cada elemento de S, sin excepción. En código:{' '}
            <code>S.every(x =&gt; P(x))</code>. Para mostrar que es falso alcanza un solo contraejemplo.
          </p>
        ),
      },
      {
        id: 'existe',
        glyph: '∃',
        text: '∃ existe para algún alguno',
        name: 'Existe',
        reads: '"existe un x tal que", "para algún x"',
        body: (
          <>
            <p>
              <code>∃x ∈ S. P(x)</code>: hay al menos un elemento de S para el que vale P. En código:{' '}
              <code>S.some(x =&gt; P(x))</code>.
            </p>
            <Example title="del libro">
              <p>
                "para algún t, (s, t) ∈ Rᵢ y (t, u) ∈ Rᵢ" es ∃t. (s, t) ∈ Rᵢ ∧ (t, u) ∈ Rᵢ: existe un intermedio t.
              </p>
            </Example>
          </>
        ),
      },
      {
        id: 'y',
        glyph: '∧',
        text: '∧ y and',
        name: 'Y',
        reads: '"y"',
        body: (
          <p>
            A ∧ B vale cuando valen las dos. Es <code>&amp;&amp;</code>. Se conecta con <L to="interseccion">∩</L>: x ∈
            A ∩ B es x ∈ A ∧ x ∈ B.
          </p>
        ),
      },
      {
        id: 'o',
        glyph: '∨',
        text: '∨ o or',
        name: 'O',
        reads: '"o"',
        body: (
          <p>
            A ∨ B vale cuando vale al menos una (o las dos: es un "o" inclusivo). Es <code>||</code>. Se conecta con{' '}
            <L to="union">∪</L>.
          </p>
        ),
      },
      {
        id: 'no',
        glyph: '¬',
        text: '¬ no not negación',
        name: 'No',
        reads: '"no"',
        body: (
          <p>
            ¬A vale cuando A no vale. Es <code>!</code>. A veces se tacha el símbolo: x ∉ S es ¬(x ∈ S).
          </p>
        ),
      },
      {
        id: 'implica',
        glyph: '⇒',
        text: '⇒ implica si entonces',
        name: 'Implica',
        reads: '"si A, entonces B"',
        body: (
          <>
            <p>
              A ⇒ B dice que siempre que valga A, también vale B. Sólo es falso cuando A vale y B no. En código:{' '}
              <code>!A || B</code>.
            </p>
            <Example title="del libro (2.1.10)">
              <p>P se preserva por R: ∀s, s′. (P(s) ∧ s R s′) ⇒ P(s′).</p>
            </Example>
            <Pitfall>
              <p>
                Si A es falso, A ⇒ B es verdadero sin importar B (se dice que vale "por vacuidad"). Por eso{' '}
                <L to="vacio">∅</L> ⊆ S: "si x ∈ ∅ entonces x ∈ S" nunca tiene un caso que lo rompa.
              </p>
            </Pitfall>
          </>
        ),
      },
      {
        id: 'sii',
        glyph: '⇔',
        text: '⇔ sii si y sólo si iff equivalente',
        name: 'Si y sólo si',
        reads: '"A si y sólo si B"; se abrevia "sii" (en inglés, "iff")',
        body: <p>A ⇔ B: A y B valen juntas o no vale ninguna. Es (A ⇒ B) ∧ (B ⇒ A). En código, <code>A === B</code> con booleanos.</p>,
      },
    ],
  },
  {
    title: 'Lo que viene en Teoría de Tipos',
    intro: <p>Un adelanto, para que no te tomen por sorpresa. Se explican bien en sus capítulos.</p>,
    entries: [
      {
        id: 'tipado',
        glyph: 'Γ ⊢ t : T',
        text: '⊢ Γ tipado contexto turnstile',
        name: 'Relación de tipado',
        reads: '"en el contexto Γ, t tiene tipo T"',
        body: (
          <p>
            Una relación de tres lugares: el contexto Γ (qué variables hay y de qué tipo), el término t y el tipo T. El
            símbolo ⊢ se llama "turnstile" (molinete). Ver el <a href="#/tt/preliminares">capítulo 2 de TT</a>, 2.1.6.
          </p>
        ),
      },
      {
        id: 'paso',
        glyph: 't → t′',
        text: '→ paso evaluación →*',
        name: 'Paso de evaluación',
        reads: '"t da un paso a t′"',
        body: (
          <p>
            Una relación binaria sobre términos: ejecutar un paso del programa t deja el programa t′. Por ejemplo,{' '}
            <code>if true then 1 else 2 → 1</code>. Su clausura reflexiva y transitiva, <code>t →* t′</code>, es "t llega a
            t′ en cero o más pasos" (ver <L to="clausura-rt">R*</L>).
          </p>
        ),
      },
      {
        id: 'lambda',
        glyph: 'λx. t',
        text: 'λ lambda función anónima',
        name: 'Abstracción lambda',
        reads: '"lambda x punto t"',
        body: (
          <p>
            Una función anónima con parámetro x y cuerpo t. Es <code>x =&gt; t</code>. λx. x + 1 es la función que suma
            uno.
          </p>
        ),
      },
    ],
  },
]

const allEntries = groups.flatMap((g) => g.entries)

const matches = (e: Entry, q: string) =>
  [e.text, e.name, e.reads].some((s) => s.toLowerCase().includes(q.toLowerCase()))

export function SymbolsPage() {
  const ver = useQueryParam('ver')
  const [q, setQ] = useState('')

  useEffect(() => {
    if (ver) document.getElementById(`sym-${ver}`)?.scrollIntoView({ block: 'start' })
  }, [ver])

  const visible = (e: Entry) => !q || matches(e, q) || e.id === ver

  return (
    <div className="prose">
      <h1>Símbolos</h1>
      <p>
        Leyenda de la notación que usan los dos libros: qué significa cada símbolo, cómo se lee en voz alta y ejemplos,
        desde los fáciles hasta los que aparecen en el libro. Al final hay{' '}
        <L to="formulas">fórmulas del libro desarmadas paso a paso</L>.
      </p>

      <input
        type="search"
        placeholder="Buscar: ⊆, unión, para todo…"
        value={q}
        onChange={(e) => setQ(e.target.value)}
        style={{ width: '100%', margin: '8px 0 4px' }}
      />
      {!q && (
        <p className="row toc-chips">
          {allEntries.map((e) => (
            <a key={e.id} href={`#/simbolos?ver=${e.id}`} title={e.name}>
              {e.text.split(' ')[0]}
            </a>
          ))}
        </p>
      )}

      {groups.map((g) => {
        const entries = g.entries.filter(visible)
        if (!entries.length) return null
        return (
          <section key={g.title}>
            <h2>{g.title}</h2>
            {!q && g.intro}
            {entries.map((e) => (
              <article key={e.id} id={`sym-${e.id}`} className={`card symbol-entry ${e.id === ver ? 'target' : ''}`}>
                <div className={`glyph ${typeof e.glyph === 'string' && e.glyph.length > 4 ? 'long' : ''}`}>{e.glyph}</div>
                <div>
                  <h3>{e.name}</h3>
                  <p className="reads">Se lee: {e.reads}</p>
                  {e.body}
                </div>
              </article>
            ))}
          </section>
        )
      })}

      {q && !allEntries.some(visible) && <p>No encontré nada con "{q}".</p>}

      {!q && <Formulas />}
    </div>
  )
}

/** Fórmulas del libro de TT (capítulo 2.2), pieza por pieza. */
function Formulas() {
  return (
    <section id="sym-formulas" style={{ scrollMarginTop: 16 }}>
      <h2>Fórmulas paso a paso</h2>
      <p>
        Las fórmulas de un libro de matemática se leen como código: de a pedazos, sabiendo qué hace cada uno. Estas son
        de la sección 2.2 de TT (clausuras de relaciones). En el <a href="#/tt/preliminares">capítulo 2 de TT</a> están
        los ejercicios y una demostración de cada una.
      </p>

      <h3>1. La clausura reflexiva (Ejercicio 2.2.6)</h3>
      <p className="formula">R′ = R ∪ {'{(s, s) | s ∈ S}'}</p>
      <table className="plain anatomy">
        <tbody>
          <tr>
            <td>R′</td>
            <td>
              El nombre de la relación nueva. La <L to="prima">prima</L> dice "otra R, relacionada con R".
            </td>
          </tr>
          <tr>
            <td>=</td>
            <td>
              <L to="definicion">"se define como"</L>.
            </td>
          </tr>
          <tr>
            <td>R ∪ …</td>
            <td>
              Todos los pares de R, y además (<L to="union">unión</L>) los que vienen después.
            </td>
          </tr>
          <tr>
            <td>{'{(s, s) | s ∈ S}'}</td>
            <td>
              Por cada s de S, el par (s, s): un elemento relacionado consigo mismo (<L to="comprension">comprensión</L>
              ). En la grilla, es la diagonal.
            </td>
          </tr>
        </tbody>
      </table>
      <p>
        <strong>En castellano</strong>: R′ es R con todos los pares (s, s) agregados. Así R′ es reflexiva (todo elemento
        está relacionado consigo mismo), y agrega sólo lo indispensable para serlo.
      </p>
      <Example title="S = {a, b, c}, R = {(a, b)}">
        <div className="row" style={{ alignItems: 'flex-start', gap: 28 }}>
          <div>
            <strong>R</strong>
            <RelationGrid S={reflexS} T={reflexS} value={reflexR} />
          </div>
          <div>
            <strong>R′</strong>
            <RelationGrid S={reflexS} T={reflexS} value={reflexRp} name="R′" />
          </div>
        </div>
        <p>Se sumó la diagonal: (a, a), (b, b) y (c, c).</p>
      </Example>

      <h3>2. Un paso de transitividad (Ejercicio 2.2.7, primera parte)</h3>
      <p className="formula">
        R₀ = R
        <br />
        Rᵢ₊₁ = Rᵢ ∪ {'{(s, u) | para algún t, (s, t) ∈ Rᵢ y (t, u) ∈ Rᵢ}'}
      </p>
      <p>
        Son dos líneas que juntas definen una lista infinita R₀, R₁, R₂, … La primera dice cómo arranca; la segunda, cómo
        sacar cada Rᵢ a partir del anterior. Es como un loop: la primera línea inicializa la variable y la segunda es el
        cuerpo.
      </p>
      <table className="plain anatomy">
        <tbody>
          <tr>
            <td>R₀ = R</td>
            <td>
              El primero de la lista es la relación original. El 0 es un <L to="subindice">subíndice</L>.
            </td>
          </tr>
          <tr>
            <td>Rᵢ₊₁</td>
            <td>"El que sigue a Rᵢ". Si i = 0 es R₁; si i = 1, R₂; y así.</td>
          </tr>
          <tr>
            <td>Rᵢ ∪ …</td>
            <td>Arranca con todo lo que ya tenía Rᵢ y le agrega pares.</td>
          </tr>
          <tr>
            <td>(s, u) | …</td>
            <td>Los pares que se agregan son de la forma (s, u), con una condición que viene después de la barra.</td>
          </tr>
          <tr>
            <td>para algún t</td>
            <td>
              Existe un elemento intermedio t (<L to="existe">∃</L>).
            </td>
          </tr>
          <tr>
            <td>(s, t) ∈ Rᵢ y (t, u) ∈ Rᵢ</td>
            <td>En Rᵢ ya hay una flecha de s a t y otra de t a u.</td>
          </tr>
        </tbody>
      </table>
      <p>
        <strong>En castellano</strong>: para pasar de Rᵢ a Rᵢ₊₁, buscá todos los caminos de dos flechas s → t → u en Rᵢ
        y agregá el atajo s → u. El libro lo llama "un paso de transitividad".
      </p>
      <p>Probalo con el gráfico. Los pares nuevos de cada paso aparecen en color:</p>
      <ClosureStepper />

      <h3>3. La clausura transitiva (Ejercicio 2.2.7, segunda parte)</h3>
      <p className="formula">
        R⁺ = <BigOp op="⋃" below="i" /> Rᵢ
      </p>
      <table className="plain anatomy">
        <tbody>
          <tr>
            <td>R⁺</td>
            <td>
              El nombre de la relación que se define: "R más", la <L to="clausura-transitiva">clausura transitiva</L>. El +
              no es una suma: es parte del nombre y significa "uno o más pasos" (como el + de las expresiones
              regulares).
            </td>
          </tr>
          <tr>
            <td>=</td>
            <td>"se define como".</td>
          </tr>
          <tr>
            <td>⋃ (la U grande)</td>
            <td>
              La <L to="union-indexada">unión de muchos conjuntos</L> de una vez. Es a ∪ lo que Σ es a +.
            </td>
          </tr>
          <tr>
            <td>la i de abajo</td>
            <td>
              La variable que recorre los valores: i = 0, 1, 2, 3, … todos los naturales. Dice "uní los Rᵢ para cada uno
              de esos i".
            </td>
          </tr>
          <tr>
            <td>Rᵢ</td>
            <td>El conjunto número i de la lista de antes.</td>
          </tr>
        </tbody>
      </table>
      <p>
        <strong>En castellano</strong>: R⁺ = R₀ ∪ R₁ ∪ R₂ ∪ … Un par está en R⁺ si aparece en <em>algún</em> Rᵢ. Como
        cada Rᵢ contiene al anterior, la unión es "todo lo que se va acumulando, para siempre".
      </p>
      <NestedSets names={['R₀', 'R₁', 'R₂', 'R⁺']} />
      <p>
        <strong>¿Por qué una unión y no "el último"?</strong> En el gráfico de arriba, la lista deja de crecer en algún
        momento y R⁺ es simplemente el último Rᵢ. Pero en un conjunto infinito puede que nunca deje de crecer. Por ejemplo,
        sobre ℕ con s R s+1: R₁ agrega los saltos de 2, R₂ los de 3 y 4, R₃ hasta 8… y nunca termina. No hay "último", pero
        la unión de todos sí existe: da la relación &lt;. La unión resuelve los dos casos con la misma fórmula.
      </p>
      <p>
        <strong>En código</strong>, para conjuntos finitos (es lo que hace el gráfico):
      </p>
      <pre className="mono">{`let actual = R                      // R₀ = R
for (;;) {
  const sig = pasoDeTransitividad(actual)   // Rᵢ₊₁ a partir de Rᵢ
  if (sig.size === actual.size) break       // no creció: llegamos
  actual = sig
}
// actual es R⁺`}</pre>
      <p>
        <strong>¿Qué pide el ejercicio?</strong> Demostrar que esta R⁺ cumple la definición 2.2.5: que contiene a R, que
        es transitiva y que es la más chica con esas dos propiedades (está incluida en cualquier otra relación transitiva
        que contenga a R). Hay una demostración en el <a href="#/tt/preliminares">capítulo 2 de TT</a>, sección 2.2.
      </p>
    </section>
  )
}
