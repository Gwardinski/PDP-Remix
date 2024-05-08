import { relations } from "drizzle-orm";
import {
  boolean,
  integer,
  pgTable,
  primaryKey,
  serial,
  text,
  timestamp,
} from "drizzle-orm/pg-core";

// User
export const User = pgTable("users", {
  id: serial("id").primaryKey(),
  email: text("email").unique().notNull(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  createdAt: timestamp("created_at", { mode: "string" }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "string" }).notNull().defaultNow(),
});

// Questions
export const Question = pgTable("questions", {
  id: serial("id").primaryKey(),
  uid: serial("uid")
    .notNull()
    .references(() => User.id),
  title: text("title").notNull(),
  answer: text("answer").notNull(),
  points: integer("points").notNull(),
  category: text("category").notNull(),
  published: boolean("published").notNull().default(false),
  createdAt: timestamp("created_at", { mode: "string" }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "string" }).notNull().defaultNow(),
});

// Rounds
export const Round = pgTable("rounds", {
  id: serial("id").primaryKey(),
  uid: serial("uid")
    .notNull()
    .references(() => User.id),
  title: text("title").notNull(),
  description: text("description").notNull().default(""),
  published: boolean("published").notNull().default(false),
  createdAt: timestamp("created_at", { mode: "string" }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "string" }).notNull().defaultNow(),
});

export const roundToQuestion = pgTable(
  "round_to_question",
  {
    rid: integer("rid")
      .notNull()
      .references(() => Round.id),
    qid: integer("qid")
      .notNull()
      .references(() => Question.id),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.rid, t.qid] }),
  }),
);

// Quizzes
export const Quiz = pgTable("quizzes", {
  id: serial("id").primaryKey(),
  uid: serial("uid")
    .notNull()
    .references(() => User.id),
  title: text("title").notNull(),
  description: text("description"),
  published: boolean("published").notNull().default(false),
  createdAt: timestamp("created_at", { mode: "string" }).notNull().defaultNow(),
  updatedAt: timestamp("updated_at", { mode: "string" }).notNull().defaultNow(),
});

export const quizToRound = pgTable(
  "quiz_to_round",
  {
    zid: integer("zid")
      .notNull()
      .references(() => Quiz.id),
    rid: integer("rid")
      .notNull()
      .references(() => Round.id),
  },
  (t) => ({
    pk: primaryKey({ columns: [t.zid, t.rid] }),
  }),
);

export const quizRelations = relations(Quiz, ({ one, many }) => ({
  users: one(User, {
    fields: [Quiz.uid],
    references: [User.id],
  }),
  quizRounds: many(quizToRound),
}));

export const roundRelations = relations(Round, ({ one, many }) => ({
  users: one(User, {
    fields: [Round.uid],
    references: [User.id],
  }),
  quizRounds: many(quizToRound),
  roundQuestions: many(roundToQuestion),
}));

export const questionRelations = relations(Question, ({ one, many }) => ({
  users: one(User, {
    fields: [Question.uid],
    references: [User.id],
  }),
  roundQuestions: many(roundToQuestion),
}));

export const roundToQuestionRelations = relations(
  roundToQuestion,
  ({ one }) => ({
    round: one(Round, {
      fields: [roundToQuestion.rid],
      references: [Round.id],
    }),
    question: one(Question, {
      fields: [roundToQuestion.qid],
      references: [Question.id],
    }),
  }),
);

export const quizToRoundRelations = relations(quizToRound, ({ one }) => ({
  quiz: one(Quiz, {
    fields: [quizToRound.zid],
    references: [Quiz.id],
  }),
  round: one(Round, {
    fields: [quizToRound.rid],
    references: [Round.id],
  }),
}));
