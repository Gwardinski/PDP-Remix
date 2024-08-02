import { integer, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

// User
export const User = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").unique().notNull(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  createdAt: timestamp("created_at", { mode: "string" }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "string" }).notNull().defaultNow(),
});

// Scoreboard
export const Scoreboard = pgTable("scoreboard", {
  id: serial("id").primaryKey(),
  nickname: text("nickname").notNull(),
  score: integer("score"),
  scoreDate: timestamp("score_date", { mode: "string" }),
  hash: text("hash").notNull(),
  hashDate: timestamp("hash_date", { mode: "string" }).notNull().defaultNow(),
});
