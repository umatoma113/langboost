/*
  Warnings:

  - Added the required column `choice4` to the `ArticleQuiz` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "ArticleQuiz" ADD COLUMN     "choice4" VARCHAR(255) NOT NULL;
