/*
  Warnings:

  - You are about to drop the column `userId` on the `Otp` table. All the data in the column will be lost.
  - Added the required column `data` to the `Otp` table without a default value. This is not possible if the table is not empty.
  - Added the required column `user` to the `Otp` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "Otp" DROP CONSTRAINT "Otp_userId_fkey";

-- AlterTable
ALTER TABLE "Otp" DROP COLUMN "userId",
ADD COLUMN     "data" JSONB NOT NULL,
ADD COLUMN     "user" TEXT NOT NULL;
