-- CreateTable
CREATE TABLE "Word" (
    "id" SERIAL NOT NULL,
    "word" VARCHAR(255) NOT NULL,
    "meaning" TEXT NOT NULL,
    "partOfSpeech" VARCHAR(100),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Word_pkey" PRIMARY KEY ("id")
);
