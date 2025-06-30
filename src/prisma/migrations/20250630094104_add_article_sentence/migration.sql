-- CreateTable
CREATE TABLE "ArticleSentence" (
    "id" SERIAL NOT NULL,
    "articleId" INTEGER NOT NULL,
    "order" INTEGER NOT NULL,
    "english" TEXT NOT NULL,
    "japanese" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ArticleSentence_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ArticleSentence" ADD CONSTRAINT "ArticleSentence_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "Article"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
