CREATE TABLE IF NOT EXISTS "questions" (
	"id" serial PRIMARY KEY NOT NULL,
	"uid" serial NOT NULL,
	"title" text NOT NULL,
	"answer" text NOT NULL,
	"points" integer NOT NULL,
	"category" text NOT NULL,
	"published" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "quizzes" (
	"id" serial PRIMARY KEY NOT NULL,
	"uid" serial NOT NULL,
	"title" text NOT NULL,
	"description" text,
	"published" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "rounds" (
	"id" serial PRIMARY KEY NOT NULL,
	"uid" serial NOT NULL,
	"title" text NOT NULL,
	"description" text DEFAULT '' NOT NULL,
	"published" boolean DEFAULT false NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" serial PRIMARY KEY NOT NULL,
	"email" text NOT NULL,
	"password" text NOT NULL,
	"name" text NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL,
	"updated_at" timestamp DEFAULT now() NOT NULL,
	CONSTRAINT "users_email_unique" UNIQUE("email")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "quiz_to_round" (
	"zid" integer NOT NULL,
	"rid" integer NOT NULL,
	CONSTRAINT "quiz_to_round_zid_rid_pk" PRIMARY KEY("zid","rid")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "round_to_question" (
	"rid" integer NOT NULL,
	"qid" integer NOT NULL,
	CONSTRAINT "round_to_question_rid_qid_pk" PRIMARY KEY("rid","qid")
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "questions" ADD CONSTRAINT "questions_uid_users_id_fk" FOREIGN KEY ("uid") REFERENCES "users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "quizzes" ADD CONSTRAINT "quizzes_uid_users_id_fk" FOREIGN KEY ("uid") REFERENCES "users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "rounds" ADD CONSTRAINT "rounds_uid_users_id_fk" FOREIGN KEY ("uid") REFERENCES "users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "quiz_to_round" ADD CONSTRAINT "quiz_to_round_zid_quizzes_id_fk" FOREIGN KEY ("zid") REFERENCES "quizzes"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "quiz_to_round" ADD CONSTRAINT "quiz_to_round_rid_rounds_id_fk" FOREIGN KEY ("rid") REFERENCES "rounds"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "round_to_question" ADD CONSTRAINT "round_to_question_rid_rounds_id_fk" FOREIGN KEY ("rid") REFERENCES "rounds"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "round_to_question" ADD CONSTRAINT "round_to_question_qid_questions_id_fk" FOREIGN KEY ("qid") REFERENCES "questions"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
