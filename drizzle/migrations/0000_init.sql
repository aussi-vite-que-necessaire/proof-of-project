CREATE TABLE IF NOT EXISTS "VisitorLog" (
	"id" serial PRIMARY KEY NOT NULL,
	"message" text NOT NULL,
	"userAgent" text,
	"createdAt" timestamp DEFAULT now() NOT NULL
);

