-- CreateTable
CREATE TABLE "WordExample" (
    "id" SERIAL NOT NULL,
    "wordId" INTEGER NOT NULL,
    "english" TEXT NOT NULL,
    "japanese" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "WordExample_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "WordExample" ADD CONSTRAINT "WordExample_wordId_fkey" FOREIGN KEY ("wordId") REFERENCES "Word"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
