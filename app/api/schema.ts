import { relations } from "drizzle-orm";
import { pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

// User
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").unique().notNull(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// User Details
export const profiles = pgTable("profiles", {
  id: serial("id").primaryKey(),
  uid: serial("uid")
    .notNull()
    .references(() => users.id),
  // TODO: image, stats etc
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const items = pgTable("items", {
  id: serial("id").primaryKey(),
  uid: serial("uid")
    .notNull()
    .references(() => users.id),
  title: text("title").notNull(),
  description: text("description"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

export const usersRelations = relations(users, ({ many, one }) => ({
  profile: one(profiles),
  item: many(items),
}));
