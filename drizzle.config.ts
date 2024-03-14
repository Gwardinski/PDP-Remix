import * as dotenv from "dotenv";
import type { Config } from "drizzle-kit";
dotenv.config();

export default {
  schema: "./app/api/schema.ts",
  out: "./app/api/migrations",
  driver: "pg",
  dbCredentials: {
    connectionString: process.env.CONNECTION_STRING_NEON ?? "",
  },
} satisfies Config;
