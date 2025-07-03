/*
  Warnings:

  - You are about to drop the `ArticleSummary` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ArticleSummary" DROP CONSTRAINT "ArticleSummary_articleId_fkey";

-- DropTable
DROP TABLE "ArticleSummary";
