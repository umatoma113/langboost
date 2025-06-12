-- CreateTable
CREATE TABLE "Sentence" (
    "id" SERIAL NOT NULL,
    "articleId" INTEGER NOT NULL,
    "english" TEXT NOT NULL,
    "japanese" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Sentence_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Sentence" ADD CONSTRAINT "Sentence_articleId_fkey" FOREIGN KEY ("articleId") REFERENCES "Article"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
