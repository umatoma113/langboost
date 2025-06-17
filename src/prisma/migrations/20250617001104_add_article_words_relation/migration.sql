-- AlterTable
ALTER TABLE "Word" ADD COLUMN     "articleId" INTEGER;

-- AddForeignKey
ALTER TABLE "Word" ADD CONSTRAINT "Word_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "Article"("id") ON DELETE SET NULL ON UPDATE CASCADE;
