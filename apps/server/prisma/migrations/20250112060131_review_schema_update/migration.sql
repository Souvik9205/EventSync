/*
  Warnings:

  - You are about to drop the column `user` on the `Review` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[eventId]` on the table `Review` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Review" DROP COLUMN "user";

-- CreateIndex
CREATE UNIQUE INDEX "Review_eventId_key" ON "Review"("eventId");
