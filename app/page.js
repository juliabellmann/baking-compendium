import { createClient } from "@/lib/supabase/server";
import RecipeGrid from "./components/RecipeGrid";

export default async function Home() {
  const supabase = await createClient();

  const { data: recipes, error } = await supabase
    .from("recipes")
    .select("*")
    .order("name", {
      ascending: true,
    });

  if (error) {
    console.error("Fehler beim Laden der Rezepte:", error);
  }

  return (
    <main>
      <header>
        <h1>Baking Compendium</h1>

        <p>Deine Sammlung für Backrezepte</p>
      </header>

      <section>
        <h2>Meine Backrezepte</h2>

        {error ? (
          <p>Die Rezepte konnten nicht geladen werden.</p>
        ) : (
          <RecipeGrid recipes={recipes || []} />
        )}
      </section>
    </main>
  );
}
