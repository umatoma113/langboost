-- DropForeignKey
ALTER TABLE "ArticleQuiz" DROP CONSTRAINT "ArticleQuiz_articleId_fkey";

-- DropForeignKey
ALTER TABLE "Sentence" DROP CONSTRAINT "Sentence_articleId_fkey";

-- AddForeignKey
ALTER TABLE "Sentence" ADD CONSTRAINT "Sentence_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "Article"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ArticleQuiz" ADD CONSTRAINT "ArticleQuiz_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "Article"("id") ON DELETE CASCADE ON UPDATE CASCADE;
