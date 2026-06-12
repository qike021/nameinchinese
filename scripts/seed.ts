import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import { nameMappings, poetry } from "../db/schema";
import nameMappingsSeed from "../data/seed/name-mappings.json";
import poetrySeed from "../data/seed/poetry.json";

async function seed() {
  const client = postgres(process.env.DATABASE_URL!);
  const db = drizzle(client);

  console.log(`Seeding ${nameMappingsSeed.length} name mappings...`);
  for (const m of nameMappingsSeed) {
    await db.insert(nameMappings).values({
      englishName: m.englishName,
      origin: m.origin,
      originalMeaning: m.originalMeaning,
      chineseCharacters: m.chineseCharacters,
      suggestedNames: m.suggestedNames,
      avoid: m.avoid,
    }).onConflictDoNothing();
  }

  console.log(`Seeding ${poetrySeed.length} poetry entries...`);
  for (const p of poetrySeed) {
    await db.insert(poetry).values({
      dynasty: p.dynasty,
      author: p.author,
      work: p.work,
      quote: p.quote,
      characters: p.characters,
      themes: p.themes,
    });
  }

  console.log("Seed complete!");
  await client.end();
}

seed().catch(console.error);
