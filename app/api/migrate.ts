import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { migrate } from "drizzle-orm/neon-http/migrator";
import * as schema from "./schema";

const connectionString = process.env.CONNECTION_STRING;

if (!connectionString) {
  throw new Error("Missing environment variable: CONNECTION_STRING");
}

const sql = neon<boolean, boolean>(connectionString);

export const db = drizzle(sql, { schema });

const runMigration = async () => {
  try {
    await migrate(db, { migrationsFolder: "app/api/migrations" });
  } catch (e) {
    console.error(e);
  }
};

runMigration();
