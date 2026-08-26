"use client";

import { useState } from "react";
import Link from "next/link";

export default function RecipeGrid({ recipes }) {
  const [search, setSearch] = useState("");

  const filteredRecipes = recipes.filter(
    (recipe) =>
      recipe.name.toLowerCase().includes(search.toLowerCase()) ||
      recipe.description?.toLowerCase().includes(search.toLowerCase()) ||
      recipe.category?.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <div>
      {/* Suche */}

      <div>
        <input
          type="search"
          placeholder="Rezept suchen..."
          value={search}
          onChange={(event) => setSearch(event.target.value)}
        />
      </div>

      {/* Anzahl */}

      <p>
        {filteredRecipes.length}{" "}
        {filteredRecipes.length === 1 ? "Rezept" : "Rezepte"}
      </p>

      {/* Rezepte */}

      {filteredRecipes.length > 0 ? (
        <div>
          {filteredRecipes.map((recipe) => (
            <Link key={recipe.id} href={`/rezepte/${recipe.id}`}>
              <article>
                <h3>{recipe.name}</h3>

                {recipe.category && <p>{recipe.category}</p>}

                {recipe.description && <p>{recipe.description}</p>}

                <p>
                  {recipe.base_amount} {recipe.base_unit}
                </p>

                {recipe.baking_time !== null && (
                  <p>{recipe.baking_time} Minuten Backzeit</p>
                )}
              </article>
            </Link>
          ))}
        </div>
      ) : (
        <p>Keine Rezepte gefunden.</p>
      )}
    </div>
  );
}
