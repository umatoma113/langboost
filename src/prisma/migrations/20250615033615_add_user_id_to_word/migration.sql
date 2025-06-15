/*
  Warnings:

  - Added the required column `userId` to the `Word` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Word" ADD COLUMN     "userId" VARCHAR(32) NOT NULL;
