import { drizzle } from "drizzle-orm/postgres-js";
import { migrate } from "drizzle-orm/postgres-js/migrator";
import postgres from "postgres";
import * as schema from "./schema";

const connectionString = process.env.CONNECTION_STRING;

if (!connectionString) {
  throw new Error("Missing environment variable: CONNECTION_STRING");
}

const client = postgres(connectionString);

export const db = drizzle(client, { schema });

export const connectionCheck = async () => {
  const dbResponse = await client`SELECT NOW();`;
  return dbResponse;
};

const runMigration = async () => {
  try {
    await migrate(db, { migrationsFolder: "app/api/migrations" });
  } catch (e) {
    console.error(e);
  }
};

// runMigration();
