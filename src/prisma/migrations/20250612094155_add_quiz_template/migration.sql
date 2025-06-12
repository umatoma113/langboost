-- CreateTable
CREATE TABLE "QuizTemplate" (
    "id" SERIAL NOT NULL,
    "wordId" INTEGER NOT NULL,
    "quizType" VARCHAR(50) NOT NULL,
    "question" VARCHAR(512) NOT NULL,
    "choice1" VARCHAR(255) NOT NULL,
    "choice2" VARCHAR(255) NOT NULL,
    "choice3" VARCHAR(255) NOT NULL,
    "choice4" VARCHAR(255) NOT NULL,
    "answer" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "QuizTemplate_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "QuizTemplate" ADD CONSTRAINT "QuizTemplate_wordId_fkey" FOREIGN KEY ("wordId") REFERENCES "Word"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
