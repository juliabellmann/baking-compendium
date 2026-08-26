import { createClient } from "@/lib/supabase/server";
import RecipeView from "./RecipeView";

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

  if (recipeError) {
    console.error(recipeError);

    return (
      <main>
        <h1>Fehler</h1>
        <p>Das Rezept konnte nicht geladen werden.</p>
      </main>
    );
  }

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

  const { data: ingredients, error: ingredientsError } = await supabase
    .from("ingredients")
    .select("*")
    .eq("recipe_id", id)
    .order("sort_order", {
      ascending: true,
    });

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
    .order("step_number", {
      ascending: true,
    });

  if (stepsError) {
    console.error(stepsError);
  }

  // -------------------------------------------------------
  // Interaktive Rezeptansicht
  // -------------------------------------------------------

  return (
    <RecipeView
      recipe={recipe}
      ingredients={ingredients || []}
      steps={steps || []}
    />
  );
}
