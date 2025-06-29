-- CreateTable
CREATE TABLE "ListType" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,

    CONSTRAINT "ListType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_WordList" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_WordList_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE UNIQUE INDEX "ListType_name_key" ON "ListType"("name");

-- CreateIndex
CREATE INDEX "_WordList_B_index" ON "_WordList"("B");

-- AddForeignKey
ALTER TABLE "_WordList" ADD CONSTRAINT "_WordList_A_fkey" FOREIGN KEY ("A") REFERENCES "BaseWord"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_WordList" ADD CONSTRAINT "_WordList_B_fkey" FOREIGN KEY ("B") REFERENCES "ListType"("id") ON DELETE CASCADE ON UPDATE CASCADE;
