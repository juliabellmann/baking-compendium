"use client";

import Link from "next/link";
import { useState } from "react";
import { formatIngredient } from "@/lib/recipe/formatting";

export default function RecipeView({ recipe, ingredients, steps }) {
  const [portions, setPortions] = useState(recipe.base_amount);

  const portionFactor = portions / recipe.base_amount;

  function calculateAmount(amount) {
    return amount * portionFactor;
  }

  const imageUrl = recipe.image_url;

  return (
    <main className="recipe-page">
      {/* -------------------------------------------------
          ZURÜCK
      ------------------------------------------------- */}

      <Link href="/" className="back-link">
        ← Alle Rezepte
      </Link>

      {/* -------------------------------------------------
          HERO
      ------------------------------------------------- */}

      <section className="recipe-hero">
        <div className="recipe-hero-image">
          {imageUrl ? (
            <img src={imageUrl} alt={recipe.name} />
          ) : (
            <div className="recipe-hero-placeholder">🧁</div>
          )}
        </div>

        <div className="recipe-hero-content">
          {recipe.category && (
            <span className="recipe-category">{recipe.category}</span>
          )}

          <h1>{recipe.name}</h1>

          {recipe.description && (
            <p className="recipe-hero-description">{recipe.description}</p>
          )}
        </div>
      </section>

      {/* -------------------------------------------------
          REZEPTINFORMATIONEN
      ------------------------------------------------- */}

      <section className="recipe-info">
        <div className="recipe-info-item">
          <span className="recipe-info-icon">🍰</span>

          <div>
            <small>Menge</small>

            <strong>
              {recipe.base_amount} {recipe.base_unit}
            </strong>
          </div>
        </div>

        {recipe.preparation_time !== null && (
          <div className="recipe-info-item">
            <span className="recipe-info-icon">⏱</span>

            <div>
              <small>Zubereitung</small>

              <strong>{recipe.preparation_time} Min.</strong>
            </div>
          </div>
        )}

        {recipe.baking_time !== null && (
          <div className="recipe-info-item">
            <span className="recipe-info-icon">🔥</span>

            <div>
              <small>Backzeit</small>

              <strong>{recipe.baking_time} Min.</strong>
            </div>
          </div>
        )}

        {recipe.temperature !== null && (
          <div className="recipe-info-item">
            <span className="recipe-info-icon">🌡</span>

            <div>
              <small>Temperatur</small>

              <strong>
                {recipe.temperature}
                {recipe.temperature_unit}
              </strong>
            </div>
          </div>
        )}
      </section>

      {/* -------------------------------------------------
          PORTIONEN
      ------------------------------------------------- */}

      <section className="portion-section">
        <div>
          <span className="section-label">PORTIONEN ANPASSEN</span>

          <p>Die Zutatenmengen werden automatisch angepasst.</p>
        </div>

        <div className="portion-controls">
          <button
            type="button"
            onClick={() => setPortions((current) => Math.max(1, current - 1))}
            aria-label="Eine Portion weniger"
          >
            −
          </button>

          <strong>{portions}</strong>

          <button
            type="button"
            onClick={() => setPortions((current) => current + 1)}
            aria-label="Eine Portion mehr"
          >
            +
          </button>
        </div>
      </section>

      {/* -------------------------------------------------
          REZEPTINHALT
      ------------------------------------------------- */}

      <div className="recipe-content">
        {/* Zutaten */}

        <section className="ingredients-section">
          <div className="section-heading">
            <span className="section-label">ZUTATEN</span>

            <h2>
              Für {portions} {recipe.base_unit}
            </h2>
          </div>

          {ingredients.length > 0 ? (
            <ul className="ingredients-list">
              {ingredients.map((ingredient) => (
                <li key={ingredient.id}>
                  <span className="ingredient-amount">
                    {formatIngredient(
                      ingredient,
                      calculateAmount(ingredient.amount),
                    )
                      .split(ingredient.name)[0]
                      .trim()}
                  </span>

                  <span className="ingredient-name">{ingredient.name}</span>
                </li>
              ))}
            </ul>
          ) : (
            <p>Keine Zutaten vorhanden.</p>
          )}
        </section>

        {/* Zubereitung */}

        <section className="steps-section">
          <div className="section-heading">
            <span className="section-label">ZUBEREITUNG</span>

            <h2>Schritt für Schritt</h2>
          </div>

          {steps.length > 0 ? (
            <ol className="steps-list">
              {steps.map((step) => (
                <li key={step.id} className="step">
                  <div className="step-number">{step.step_number}</div>

                  <div className="step-content">
                    {step.content.map((part, index) => {
                      if (part.type === "text") {
                        return <span key={index}>{part.value}</span>;
                      }

                      if (part.type === "ingredient") {
                        const ingredient = ingredients.find(
                          (item) => item.id === part.ingredientId,
                        );

                        if (!ingredient) {
                          return null;
                        }

                        return (
                          <strong key={index}>
                            {formatIngredient(
                              ingredient,
                              calculateAmount(ingredient.amount),
                            )}
                          </strong>
                        );
                      }

                      return null;
                    })}
                  </div>
                </li>
              ))}
            </ol>
          ) : (
            <p>Keine Zubereitungsschritte vorhanden.</p>
          )}
        </section>
      </div>

      {/* -------------------------------------------------
          HINWEISE
      ------------------------------------------------- */}

      {recipe.notes && (
        <section className="recipe-notes">
          <span className="section-label">HINWEISE</span>

          <p>{recipe.notes}</p>
        </section>
      )}
    </main>
  );
}
