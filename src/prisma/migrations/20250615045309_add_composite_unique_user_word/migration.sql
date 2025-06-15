/*
  Warnings:

  - A unique constraint covering the columns `[userId,word]` on the table `Word` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "Word_word_key";

-- CreateIndex
CREATE UNIQUE INDEX "Word_userId_word_key" ON "Word"("userId", "word");
