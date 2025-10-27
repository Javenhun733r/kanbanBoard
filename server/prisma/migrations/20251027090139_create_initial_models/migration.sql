-- CreateEnum
CREATE TYPE "ColumnStatus" AS ENUM ('ToDo', 'InProgress', 'Done');

-- CreateTable
CREATE TABLE "card" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "boardId" TEXT NOT NULL,
    "column" "ColumnStatus" NOT NULL,
    "orderIndex" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "card_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "board" (
    "id" TEXT NOT NULL,
    "uniqueHashedId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "board_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "card_boardId_column_orderIndex_idx" ON "card"("boardId", "column", "orderIndex");

-- CreateIndex
CREATE UNIQUE INDEX "board_uniqueHashedId_key" ON "board"("uniqueHashedId");

-- AddForeignKey
ALTER TABLE "card" ADD CONSTRAINT "card_boardId_fkey" FOREIGN KEY ("boardId") REFERENCES "board"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
