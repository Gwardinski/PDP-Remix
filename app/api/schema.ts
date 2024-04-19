import { relations } from "drizzle-orm";
import { integer, pgTable, serial, text, timestamp } from "drizzle-orm/pg-core";

// User Details
export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").unique().notNull(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// User Content
export const profiles = pgTable("profiles", {
  id: serial("id").primaryKey(),
  uid: serial("uid")
    .notNull()
    .references(() => users.id),
  // image, stats, isPublic etc
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Items
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

// Questions
export const questions = pgTable("questions", {
  id: serial("id").primaryKey(),
  uid: serial("uid")
    .notNull()
    .references(() => users.id),
  title: text("title").notNull(),
  answer: text("answer").notNull(),
  points: integer("points").notNull(),
  category: text("category").notNull(),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// Rounds
export const rounds = pgTable("rounds", {
  id: serial("id").primaryKey(),
  uid: serial("uid")
    .notNull()
    .references(() => users.id),
  title: text("title").notNull(),
  description: text("description"),
  createdAt: timestamp("created_at").notNull().defaultNow(),
  updatedAt: timestamp("updated_at").notNull().defaultNow(),
});

// User Relations
export const usersItemsRelations = relations(users, ({ many, one }) => ({
  profile: one(profiles),
  item: many(items),
}));

export const usersQuestionsRelations = relations(users, ({ many, one }) => ({
  profile: one(profiles),
  question: many(questions),
}));

export const usersRoundsRelations = relations(users, ({ many, one }) => ({
  profile: one(profiles),
  round: many(rounds),
}));

// Question Relations
export const questionRoundsRelations = relations(questions, ({ many }) => ({
  question: many(questions),
  round: many(rounds),
}));
