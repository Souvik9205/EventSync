/*
  Warnings:

  - Added the required column `type` to the `Otp` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "OTP_Type" AS ENUM ('UserOtp', 'EverntOtp', 'RegisterOtp');

-- AlterTable
ALTER TABLE "Otp" ADD COLUMN     "type" "OTP_Type" NOT NULL;
