import { useState, type ReactNode } from 'react'
import { markSolved } from '../lib/progress'
import { hasPair, showRelation, togglePair, type Relation } from '../core/relations'
import { ExerciseCard, type Verdict } from './Exercise'

/**
 * Una relación R ⊆ S × T como tabla: una fila por elemento de S, una columna
 * por elemento de T, y una marca en cada par que está en R.
 */
export function RelationGrid(props: {
  S: string[]
  T: string[]
  value: Relation
  onChange?: (r: Relation) => void
  name?: string
  /** Filas a resaltar (por ejemplo, las que rompen "ser función"). */
  flagged?: string[]
}) {
  const { S, T, value, onChange, name = 'R' } = props
  return (
    <table className="rel-grid">
      <thead>
        <tr>
          <th className="corner">{name}</th>
          {T.map((t) => (
            <th key={t}>{t}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {S.map((s) => (
          <tr key={s} className={props.flagged?.includes(s) ? 'flag' : ''}>
            <th>{s}</th>
            {T.map((t) => {
              const on = hasPair(value, s, t)
              return (
                <td key={t} className={on ? 'on' : ''}>
                  {onChange ? (
                    <button aria-label={`(${s}, ${t})`} onClick={() => onChange(togglePair(value, s, t))}>
                      {on ? '●' : ''}
                    </button>
                  ) : (
                    on && '●'
                  )}
                </td>
              )
            })}
          </tr>
        ))}
      </tbody>
    </table>
  )
}

/** Armá una relación entre S y T que cumpla una condición. */
export function RelationExercise(props: {
  id: string
  title: string
  prompt: ReactNode
  S: string[]
  T: string[]
  /** Relación con la que arranca la grilla (por ejemplo, para completarla). */
  initial?: Relation
  name?: string
  check: (r: Relation) => Verdict & { flagged?: string[] }
}) {
  const [r, setR] = useState<Relation>(props.initial ?? [])
  const [verdict, setVerdict] = useState<(Verdict & { flagged?: string[] }) | null>(null)
  const submit = () => {
    const v = props.check(r)
    setVerdict(v)
    if (v.ok) markSolved(props.id)
  }
  return (
    <ExerciseCard id={props.id} title={props.title}>
      <div>{props.prompt}</div>
      <RelationGrid
        S={props.S}
        T={props.T}
        value={r}
        name={props.name}
        flagged={verdict?.flagged}
        onChange={(next) => {
          setR(next)
          setVerdict(null)
        }}
      />
      <p className="mono" style={{ margin: '4px 0' }}>
        {props.name ?? 'R'} = {showRelation(r)}
      </p>
      <div className="row">
        <button className="primary" onClick={submit}>
          Verificar
        </button>
        <button
          onClick={() => {
            setR(props.initial ?? [])
            setVerdict(null)
          }}
        >
          {props.initial ? 'Volver al inicio' : 'Limpiar'}
        </button>
      </div>
      {verdict && <div className={`feedback ${verdict.ok ? 'ok' : 'bad'}`}>{verdict.message}</div>}
    </ExerciseCard>
  )
}
