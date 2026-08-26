"use client";

import { useState } from "react";
import Link from "next/link";

export default function RecipeGrid({ recipes }) {
  const [search, setSearch] = useState("");

  const filteredRecipes = recipes.filter((recipe) => {
    const searchTerm = search.toLowerCase();

    return (
      recipe.name?.toLowerCase().includes(searchTerm) ||
      recipe.description?.toLowerCase().includes(searchTerm) ||
      recipe.category?.toLowerCase().includes(searchTerm)
    );
  });

  return (
    <div className="recipe-dashboard">
      {/* Suche */}

      <div className="recipe-search">
        <input
          type="search"
          placeholder="Rezept suchen..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
      </div>

      {/* Anzahl */}

      <p className="recipe-count">
        {filteredRecipes.length}{" "}
        {filteredRecipes.length === 1 ? "Rezept" : "Rezepte"}
      </p>

      {/* Rezeptkarten */}

      {filteredRecipes.length > 0 ? (
        <div className="recipe-grid">
          {filteredRecipes.map((recipe) => {
            const imageUrl = recipe.image_url;

            return (
              <Link
                key={recipe.id}
                href={`/rezepte/${recipe.id}`}
                className="recipe-card-link"
              >
                <article className="recipe-card">
                  {/* Bild */}

                  <div className="recipe-card-image">
                    {imageUrl ? (
                      <img src={imageUrl} alt={recipe.name} />
                    ) : (
                      <div className="recipe-card-placeholder">
                        <span>🧁</span>
                      </div>
                    )}
                  </div>

                  {/* Inhalt */}

                  <div className="recipe-card-content">
                    {recipe.category && (
                      <span className="recipe-category">{recipe.category}</span>
                    )}

                    <h3>{recipe.name}</h3>

                    {recipe.description && (
                      <p className="recipe-description">{recipe.description}</p>
                    )}

                    <div className="recipe-meta">
                      <span>
                        🍰 {recipe.base_amount} {recipe.base_unit}
                      </span>

                      {recipe.baking_time !== null && (
                        <span>⏱ {recipe.baking_time} Min.</span>
                      )}
                    </div>
                  </div>
                </article>
              </Link>
            );
          })}
        </div>
      ) : (
        <div className="no-recipes">
          <p>Keine Rezepte gefunden.</p>

          <button type="button" onClick={() => setSearch("")}>
            Suche zurücksetzen
          </button>
        </div>
      )}
    </div>
  );
}
