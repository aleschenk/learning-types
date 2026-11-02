# Erratas del libro

Frases de *Category Theory Illustrated* que están mal o son confusas. En el sitio están en la página `#/errata` como
ejercicio: primero se muestra la frase y la explicación queda escondida.

Verificadas contra el PDF el 2026-10-19. Las páginas usan la numeración impresa, que es una menos que el índice de
página del visor de PDF.

| # | Dónde | Qué dice | Qué debería decir | Estado |
|---|---|---|---|---|
| 1 | Functores, p. 413 | "the category of groups … contains the category of monoids as a subcategory, as all monoids are groups" | Es al revés: todo grupo es un monoide, así que Grp ⊂ Mon (contraejemplo: ℕ con +) | verificada |
| 2 | Órdenes, definición de join, pp. 209 y 240 | "for any other object P such that P ≤ A and P ≤ B then … G ≤ P" | "A ≤ P y B ≤ P": se compara con las otras cotas **superiores** | verificada (aparece dos veces) |
| 3 | De conjuntos a categorías, Task 6, p. 141 | pregunta por la "composición 2-dimensional" y responde sólo "Yes we did — products." | No es un error, la respuesta es muy escueta: f × g compone "en paralelo", que es la idea de categoría monoidal | verificada |

Si aparecen más, sumarlas acá **y** en `src/pages/ErrataPage.tsx`.
