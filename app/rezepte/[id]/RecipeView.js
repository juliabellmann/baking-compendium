"use client";

import { useState } from "react";
import { formatIngredient } from "@/lib/recipe/formatting";

export default function RecipeView({
  recipe,
  ingredients,
  steps,
}) {
  const [portions, setPortions] = useState(
    recipe.base_amount
  );

  const portionFactor =
    portions / recipe.base_amount;

  function calculateAmount(amount) {
    return amount * portionFactor;
  }

  return (
    <main>
      <h1>{recipe.name}</h1>

      {recipe.description && (
        <p>{recipe.description}</p>
      )}

      <hr />

      <section>
        <h2>Rezeptinformationen</h2>

        <p>
          <strong>Portionen:</strong>{" "}
          {recipe.base_amount} {recipe.base_unit}
        </p>

        {recipe.form_type && (
          <p>
            <strong>Backform:</strong>{" "}
            {recipe.form_type}{" "}
            {recipe.form_size &&
              `${recipe.form_size} ${recipe.form_unit}`}
          </p>
        )}

        {recipe.preparation_time !== null && (
          <p>
            <strong>Zubereitungszeit:</strong>{" "}
            {recipe.preparation_time} Minuten
          </p>
        )}

        {recipe.baking_time !== null && (
          <p>
            <strong>Backzeit:</strong>{" "}
            {recipe.baking_time} Minuten
          </p>
        )}

        {recipe.temperature !== null && (
          <p>
            <strong>Temperatur:</strong>{" "}
            {recipe.temperature}
            {recipe.temperature_unit}
          </p>
        )}

        {recipe.oven_type && (
          <p>
            <strong>Backofen:</strong>{" "}
            {recipe.oven_type}
          </p>
        )}
      </section>

      <hr />

      <section>
        <h2>Portionen anpassen</h2>

        <button
          type="button"
          onClick={() =>
            setPortions((current) =>
              Math.max(1, current - 1)
            )
          }
        >
          −
        </button>

        <strong>
          {" "}
          {portions} {recipe.base_unit}
          {" "}
        </strong>

        <button
          type="button"
          onClick={() =>
            setPortions((current) => current + 1)
          }
        >
          +
        </button>
      </section>

      <hr />

      <section>
        <h2>Zutaten</h2>

        {ingredients && ingredients.length > 0 ? (
          <ul>
            {ingredients.map((ingredient) => (
<li key={ingredient.id}>
  {formatIngredient(
    ingredient,
    calculateAmount(ingredient.amount)
  )}
</li>
            ))}
          </ul>
        ) : (
          <p>Keine Zutaten vorhanden.</p>
        )}
      </section>

      <hr />

      <section>
        <h2>Zubereitung</h2>

        {steps && steps.length > 0 ? (
          <ol>
            {steps.map((step) => (
              <li key={step.id}>
                {step.content.map((part, index) => {
                  if (part.type === "text") {
                    return (
                      <span key={index}>
                        {part.value}
                      </span>
                    );
                  }

                  if (part.type === "ingredient") {
                    const ingredient =
                      ingredients.find(
                        (item) =>
                          item.id ===
                          part.ingredientId
                      );

                    if (!ingredient) {
                      return null;
                    }

return (
  <strong key={index}>
    {formatIngredient(
      ingredient,
      calculateAmount(ingredient.amount)
    )}
  </strong>
);
                  }

                  return null;
                })}
              </li>
            ))}
          </ol>
        ) : (
          <p>
            Keine Zubereitungsschritte vorhanden.
          </p>
        )}
      </section>

      {recipe.notes && (
        <>
          <hr />

          <section>
            <h2>Hinweise</h2>
            <p>{recipe.notes}</p>
          </section>
        </>
      )}
    </main>
  );
}