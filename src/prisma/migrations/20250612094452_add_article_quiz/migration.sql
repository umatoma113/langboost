-- CreateTable
CREATE TABLE "ArticleQuiz" (
    "id" SERIAL NOT NULL,
    "articleId" INTEGER NOT NULL,
    "question" VARCHAR(512) NOT NULL,
    "choice1" VARCHAR(255) NOT NULL,
    "choice2" VARCHAR(255) NOT NULL,
    "choice3" VARCHAR(255) NOT NULL,
    "answer" INTEGER NOT NULL,
    "explanation" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ArticleQuiz_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ArticleQuiz" ADD CONSTRAINT "ArticleQuiz_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "Article"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
