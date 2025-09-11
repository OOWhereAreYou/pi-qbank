-- AlterTable
ALTER TABLE "public"."Question" ALTER COLUMN "content" DROP NOT NULL,
ALTER COLUMN "difficulty" DROP NOT NULL,
ALTER COLUMN "difficulty" DROP DEFAULT;
