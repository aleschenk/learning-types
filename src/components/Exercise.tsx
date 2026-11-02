import { useState, type ReactNode } from 'react'
import { markSolved, useProgress } from '../lib/progress'
import { SetFunctionEditor } from './SetFunctionEditor'
import { composeFn, type FiniteSet, type FnMap } from '../core/sets'

export interface Verdict {
  ok: boolean
  message: string
}

export function ExerciseCard({ id, title, children }: { id: string; title: string; children: ReactNode }) {
  const { isSolved } = useProgress()
  const solved = isSolved(id)
  return (
    <section className={`card exercise ${solved ? 'solved' : ''}`}>
      <h3>
        <span>✎ {title}</span>
        {solved && <span className="badge ok">resuelto</span>}
      </h3>
      {children}
    </section>
  )
}

function Feedback({ verdict }: { verdict: Verdict | null }) {
  if (!verdict) return null
  return <div className={`feedback ${verdict.ok ? 'ok' : 'bad'}`}>{verdict.message}</div>
}

/** Armá una función A → B que cumpla una condición. */
export function FunctionExercise(props: {
  id: string
  title: string
  prompt: ReactNode
  dom: FiniteSet
  cod: FiniteSet
  check: (f: FnMap) => Verdict
  hint?: ReactNode
}) {
  const [f, setF] = useState<FnMap>({})
  const [verdict, setVerdict] = useState<Verdict | null>(null)
  const submit = () => {
    const v = props.check(f)
    setVerdict(v)
    if (v.ok) markSolved(props.id)
  }
  return (
    <ExerciseCard id={props.id} title={props.title}>
      <div>{props.prompt}</div>
      <SetFunctionEditor
        dom={props.dom}
        cod={props.cod}
        value={f}
        onChange={(next) => {
          setF(next)
          setVerdict(null)
        }}
      />
      <div className="row">
        <button className="primary" onClick={submit}>
          Verificar
        </button>
        <button
          onClick={() => {
            setF({})
            setVerdict(null)
          }}
        >
          Limpiar
        </button>
        {props.hint && (
          <details>
            <summary>Pista</summary>
            {props.hint}
          </details>
        )}
      </div>
      <Feedback verdict={verdict} />
    </ExerciseCard>
  )
}

/** Dadas f: A → B y g: B → C fijas, construí g ∘ f. */
export function CompositionExercise(props: {
  id: string
  A: FiniteSet
  B: FiniteSet
  C: FiniteSet
  f: FnMap
  g: FnMap
}) {
  const { A, B, C, f, g } = props
  const [guess, setGuess] = useState<FnMap>({})
  const [verdict, setVerdict] = useState<Verdict | null>(null)
  const expected = composeFn(A, f, g)
  const submit = () => {
    const wrong = A.elements.filter((x) => guess[x] !== expected[x])
    const v =
      wrong.length === 0
        ? { ok: true, message: '¡Exacto! Para calcular g ∘ f(x) seguís primero la flecha de f y después la de g.' }
        : {
            ok: false,
            message: `Revisá ${wrong.join(', ')}: seguí la flecha de f y, desde donde caés en ${B.name}, la de g.`,
          }
    setVerdict(v)
    if (v.ok) markSolved(props.id)
  }
  return (
    <ExerciseCard id={props.id} title="Composición a mano">
      <p>
        Tenés <em>f</em> : {A.name} → {B.name} y <em>g</em> : {B.name} → {C.name}. Construí <em>g ∘ f</em> :{' '}
        {A.name} → {C.name} (se lee "g después de f").
      </p>
      <div className="grid-2">
        <SetFunctionEditor dom={A} cod={B} value={f} fnName="f" width={300} />
        <SetFunctionEditor dom={B} cod={C} value={g} fnName="g" width={300} />
      </div>
      <SetFunctionEditor
        dom={A}
        cod={C}
        value={guess}
        fnName="g ∘ f"
        onChange={(next) => {
          setGuess(next)
          setVerdict(null)
        }}
      />
      <div className="row">
        <button className="primary" onClick={submit}>
          Verificar
        </button>
      </div>
      <Feedback verdict={verdict} />
    </ExerciseCard>
  )
}

/** Pregunta con respuesta numérica. */
export function NumberExercise(props: {
  id: string
  title: string
  prompt: ReactNode
  answer: number
  explanation: ReactNode
  wrong?: string
}) {
  const [value, setValue] = useState('')
  const [verdict, setVerdict] = useState<Verdict | null>(null)
  const submit = () => {
    const n = Number(value)
    const ok = value.trim() !== '' && n === props.answer
    setVerdict(ok ? { ok, message: '¡Correcto!' } : { ok, message: props.wrong ?? 'No es eso. Probá dibujar todas las funciones posibles.' })
    if (ok) markSolved(props.id)
  }
  return (
    <ExerciseCard id={props.id} title={props.title}>
      <div>{props.prompt}</div>
      <div className="row">
        <input
          type="number"
          value={value}
          onChange={(e) => {
            setValue(e.target.value)
            setVerdict(null)
          }}
          onKeyDown={(e) => e.key === 'Enter' && submit()}
          style={{ width: 100 }}
        />
        <button className="primary" onClick={submit}>
          Verificar
        </button>
      </div>
      <Feedback verdict={verdict} />
      {verdict?.ok && <div className="callout">{props.explanation}</div>}
    </ExerciseCard>
  )
}

/** Elegí los elementos de un conjunto que cumplen algo. */
export function SubsetExercise(props: {
  id: string
  title: string
  prompt: ReactNode
  universe: string[]
  check: (picked: string[]) => Verdict
}) {
  const [picked, setPicked] = useState<string[]>([])
  const [verdict, setVerdict] = useState<Verdict | null>(null)
  const toggle = (x: string) => {
    // Se mantiene el orden del universo para que la respuesta se lea prolija.
    setPicked((p) => props.universe.filter((u) => (u === x ? !p.includes(x) : p.includes(u))))
    setVerdict(null)
  }
  const submit = () => {
    const v = props.check(picked)
    setVerdict(v)
    if (v.ok) markSolved(props.id)
  }
  return (
    <ExerciseCard id={props.id} title={props.title}>
      <div>{props.prompt}</div>
      <div className="chips">
        {props.universe.map((x) => (
          <button key={x} className={picked.includes(x) ? 'active' : ''} onClick={() => toggle(x)}>
            {x}
          </button>
        ))}
      </div>
      <div className="row">
        <span className="mono">{`{${picked.join(', ')}}`}</span>
        <button className="primary" onClick={submit}>
          Verificar
        </button>
      </div>
      <Feedback verdict={verdict} />
    </ExerciseCard>
  )
}

/** Pregunta de opción única. */
export function ChoiceExercise(props: {
  id: string
  title: string
  prompt: ReactNode
  options: { label: ReactNode; ok?: boolean; why: string }[]
}) {
  const [verdict, setVerdict] = useState<Verdict | null>(null)
  const [chosen, setChosen] = useState<number | null>(null)
  return (
    <ExerciseCard id={props.id} title={props.title}>
      <div>{props.prompt}</div>
      <div className="chips" style={{ flexDirection: 'column', alignItems: 'flex-start' }}>
        {props.options.map((o, i) => (
          <button
            key={i}
            className={chosen === i ? 'active' : ''}
            onClick={() => {
              setChosen(i)
              const v = { ok: !!o.ok, message: o.why }
              setVerdict(v)
              if (v.ok) markSolved(props.id)
            }}
          >
            {o.label}
          </button>
        ))}
      </div>
      <Feedback verdict={verdict} />
    </ExerciseCard>
  )
}
