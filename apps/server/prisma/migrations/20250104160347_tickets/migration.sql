/*
  Warnings:

  - You are about to drop the column `refreshToken` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Event" ADD COLUMN     "price" INTEGER NOT NULL DEFAULT 0,
ADD COLUMN     "tickets" INTEGER;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "refreshToken";
