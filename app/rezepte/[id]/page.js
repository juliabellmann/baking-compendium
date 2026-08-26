import { createClient } from "@/lib/supabase/server";

export default async function RecipePage({ params }) {
  const { id } = await params;

  const supabase = await createClient();

  // -------------------------------------------------------
  // Rezept laden
  // -------------------------------------------------------

  const { data: recipe, error: recipeError } = await supabase
    .from("recipes")
    .select("*")
    .eq("id", id)
    .single();

  // -------------------------------------------------------
  // Fehler beim Laden
  // -------------------------------------------------------

  if (recipeError) {
    console.error(recipeError);

    return (
      <main>
        <h1>Fehler</h1>
        <p>Das Rezept konnte nicht geladen werden.</p>
      </main>
    );
  }

  // -------------------------------------------------------
  // Rezept nicht gefunden
  // -------------------------------------------------------

  if (!recipe) {
    return (
      <main>
        <h1>Rezept nicht gefunden</h1>
        <p>Dieses Rezept existiert nicht.</p>
      </main>
    );
  }

  // -------------------------------------------------------
  // Zutaten laden
  // -------------------------------------------------------

  const { data: ingredients, error: ingredientsError } =
    await supabase
      .from("ingredients")
      .select("*")
      .eq("recipe_id", id)
      .order("sort_order", { ascending: true });

  if (ingredientsError) {
    console.error(ingredientsError);
  }

  // -------------------------------------------------------
  // Zubereitungsschritte laden
  // -------------------------------------------------------

  const { data: steps, error: stepsError } = await supabase
    .from("steps")
    .select("*")
    .eq("recipe_id", id)
    .order("step_number", { ascending: true });

  if (stepsError) {
    console.error(stepsError);
  }

  // -------------------------------------------------------
  // Seite anzeigen
  // -------------------------------------------------------

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
          <strong>Menge:</strong>{" "}
          {recipe.base_amount} {recipe.base_unit}
        </p>

        {recipe.form_type && (
          <p>
            <strong>Backform:</strong>{" "}
            {recipe.form_type}{" "}
            {recipe.form_size && `${recipe.form_size} ${recipe.form_unit}`}
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
        <h2>Zutaten</h2>

        {ingredients && ingredients.length > 0 ? (
          <ul>
            {ingredients.map((ingredient) => (
              <li key={ingredient.id}>
                {ingredient.amount}{" "}
                {ingredient.unit && `${ingredient.unit} `}
                {ingredient.name}
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
                    const ingredient = ingredients.find(
                      (item) =>
                        item.id === part.ingredientId
                    );

                    if (!ingredient) {
                      return null;
                    }

                    return (
                      <strong key={index}>
                        {ingredient.amount}{" "}
                        {ingredient.unit &&
                          `${ingredient.unit} `}
                        {ingredient.name}
                      </strong>
                    );
                  }

                  return null;
                })}
              </li>
            ))}
          </ol>
        ) : (
          <p>Keine Zubereitungsschritte vorhanden.</p>
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