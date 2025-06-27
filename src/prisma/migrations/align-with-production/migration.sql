-- DropIndex
DROP INDEX "Word_baseForm_key";

-- AlterTable
ALTER TABLE "Word" ADD COLUMN     "userId" VARCHAR(64) NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Word_userId_word_key" ON "Word"("userId" ASC, "word" ASC);

-- AddForeignKey
ALTER TABLE "Word" ADD CONSTRAINT "Word_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

