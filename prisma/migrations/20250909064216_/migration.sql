-- CreateEnum
CREATE TYPE "public"."QuestionType" AS ENUM ('SINGLE', 'MULTIPLE', 'INDEFINITE', 'JUDGEMENT', 'FILL', 'ESSAY', 'COMPOUND');

-- CreateTable
CREATE TABLE "public"."Question" (
    "id" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "analysis" TEXT,
    "type" "public"."QuestionType",
    "meta" JSONB,
    "difficulty" INTEGER NOT NULL DEFAULT 1,
    "knowledgePoints" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "source" TEXT,
    "grade" INTEGER,
    "subject" TEXT,
    "parentId" TEXT,
    "status" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Question_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."Paper" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "score" INTEGER NOT NULL DEFAULT 100,
    "structure" JSONB,
    "difficulty" INTEGER NOT NULL DEFAULT 1,
    "tags" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "grade" INTEGER,
    "subject" TEXT,
    "status" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Paper_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "public"."PaperQuestion" (
    "paperId" TEXT NOT NULL,
    "questionId" TEXT NOT NULL,
    "questionSnapshot" JSONB NOT NULL,
    "status" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PaperQuestion_pkey" PRIMARY KEY ("paperId","questionId")
);

-- AddForeignKey
ALTER TABLE "public"."Question" ADD CONSTRAINT "Question_parentId_fkey" FOREIGN KEY ("parentId") REFERENCES "public"."Question"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PaperQuestion" ADD CONSTRAINT "PaperQuestion_paperId_fkey" FOREIGN KEY ("paperId") REFERENCES "public"."Paper"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "public"."PaperQuestion" ADD CONSTRAINT "PaperQuestion_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "public"."Question"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
