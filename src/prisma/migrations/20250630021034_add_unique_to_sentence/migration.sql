/*
  Warnings:

  - A unique constraint covering the columns `[articleId,order]` on the table `Sentence` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Sentence_articleId_order_key" ON "Sentence"("articleId", "order");
