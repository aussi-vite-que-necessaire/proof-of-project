-- Étape 1: Ajouter la colonne comme nullable
ALTER TABLE "VisitorLog" ADD COLUMN IF NOT EXISTS "email" text;

-- Étape 2: Remplir les valeurs NULL avec une valeur par défaut
UPDATE "VisitorLog" SET "email" = 'unknown@example.com' WHERE "email" IS NULL;

-- Étape 3: Rendre la colonne NOT NULL
ALTER TABLE "VisitorLog" ALTER COLUMN "email" SET NOT NULL;