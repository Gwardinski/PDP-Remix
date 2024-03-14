import { migrate } from "drizzle-orm/postgres-js/migrator";
import { db } from "./db";

export const runMigration = async () => {
  try {
    await migrate(db, { migrationsFolder: "app/api/migrations" });
  } catch (e) {
    console.error(e);
  }
};
