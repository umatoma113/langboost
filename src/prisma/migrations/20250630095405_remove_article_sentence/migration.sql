/*
  Warnings:

  - You are about to drop the `ArticleSentence` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ArticleSentence" DROP CONSTRAINT "ArticleSentence_articleId_fkey";

-- DropTable
DROP TABLE "ArticleSentence";
