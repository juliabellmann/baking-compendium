import { createClient } from "@/lib/supabase/server";

export default async function Home() {
  const supabase = await createClient();

  const { data, error } = await supabase
    .from("recipes")
    .select("*");

  return (
    <main>
      <h1>Baking Compendium</h1>

      <p>Supabase-Test</p>

      <pre>
        {JSON.stringify({ data, error }, null, 2)}
      </pre>
    </main>
  );
}