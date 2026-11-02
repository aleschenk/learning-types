import { CategoryLab } from '../components/CategoryLab'

export function LabPage() {
  return (
    <div>
      <h1>Laboratorio de categorías</h1>
      <p className="prose">
        Armá objetos y flechas y decidí cómo componen. El motor verifica las leyes en vivo: cada objeto tiene su
        identidad, todo par componible tiene composición y la composición es asociativa. Las identidades componen solas,
        así que la tabla sólo muestra los pares interesantes. Pasá el mouse sobre un error para ver las flechas
        involucradas.
      </p>
      <CategoryLab />
    </div>
  )
}
