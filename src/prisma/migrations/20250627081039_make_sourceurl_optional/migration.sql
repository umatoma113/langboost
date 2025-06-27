/*
  Warnings:

  - You are about to drop the column `userId` on the `Word` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[baseForm]` on the table `Word` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `baseForm` to the `Word` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Word" DROP CONSTRAINT "Word_userId_fkey";

-- DropIndex
DROP INDEX "Word_userId_word_key";

-- AlterTable
ALTER TABLE "Article" ALTER COLUMN "sourceUrl" DROP NOT NULL,
ALTER COLUMN "sourceUrl" SET DATA TYPE VARCHAR(2048);

-- AlterTable
ALTER TABLE "UserWord" ALTER COLUMN "registeredAt" SET DATA TYPE TIMESTAMPTZ(6),
ALTER COLUMN "lastTestedAt" SET DATA TYPE TIMESTAMPTZ(6),
ALTER COLUMN "nextReviewDate" SET DATA TYPE TIMESTAMPTZ(6);

-- AlterTable
ALTER TABLE "Word" DROP COLUMN "userId",
ADD COLUMN     "baseForm" VARCHAR(64) NOT NULL;

-- CreateTable
CREATE TABLE "BaseWord" (
    "id" SERIAL NOT NULL,
    "word" TEXT NOT NULL,
    "meaning" TEXT NOT NULL,
    "partOfSpeech" TEXT,
    "isFunctionWord" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "BaseWord_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BaseWord_word_key" ON "BaseWord"("word");

-- CreateIndex
CREATE UNIQUE INDEX "Word_baseForm_key" ON "Word"("baseForm");
