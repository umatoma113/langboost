/*
  Warnings:

  - A unique constraint covering the columns `[userId,wordId]` on the table `UserWord` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "UserWord_userId_wordId_key" ON "UserWord"("userId", "wordId");
