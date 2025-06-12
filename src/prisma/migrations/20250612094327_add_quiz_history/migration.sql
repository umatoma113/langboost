-- CreateTable
CREATE TABLE "QuizHistory" (
    "id" SERIAL NOT NULL,
    "userId" VARCHAR(32) NOT NULL,
    "quizTemplateId" INTEGER NOT NULL,
    "userAnswer" INTEGER NOT NULL,
    "isCorrect" BOOLEAN NOT NULL,
    "executedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "QuizHistory_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "QuizHistory" ADD CONSTRAINT "QuizHistory_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuizHistory" ADD CONSTRAINT "QuizHistory_quizTemplateId_fkey" FOREIGN KEY ("quizTemplateId") REFERENCES "QuizTemplate"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
