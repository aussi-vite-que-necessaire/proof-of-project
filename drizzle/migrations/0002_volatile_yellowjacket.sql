ALTER TABLE "VisitorLog" ADD COLUMN IF NOT EXISTS "name" text;
UPDATE "VisitorLog" SET "name" = 'Visitor' WHERE "name" IS NULL;
ALTER TABLE "VisitorLog" ALTER COLUMN "name" SET NOT NULL;