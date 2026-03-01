-- CreateEnum
CREATE TYPE "ReferralStatus" AS ENUM ('PENDING', 'COMPLETED', 'EXPIRED');

-- AlterTable: add referralCode as nullable first
ALTER TABLE "Member" ADD COLUMN "referralCode" TEXT;

-- Populate existing rows with unique UUIDs
UPDATE "Member" SET "referralCode" = gen_random_uuid()::TEXT WHERE "referralCode" IS NULL;

-- Make it required and unique
ALTER TABLE "Member" ALTER COLUMN "referralCode" SET NOT NULL;
ALTER TABLE "Member" ALTER COLUMN "referralCode" SET DEFAULT gen_random_uuid()::TEXT;
CREATE UNIQUE INDEX "Member_referralCode_key" ON "Member"("referralCode");

-- CreateTable
CREATE TABLE "Referral" (
    "id" TEXT NOT NULL,
    "referrerId" TEXT NOT NULL,
    "referredId" TEXT NOT NULL,
    "status" "ReferralStatus" NOT NULL DEFAULT 'PENDING',
    "referrerBonus" INTEGER NOT NULL DEFAULT 0,
    "referredBonus" INTEGER NOT NULL DEFAULT 0,
    "completedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Referral_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "Referral_referrerId_idx" ON "Referral"("referrerId");
CREATE INDEX "Referral_referredId_idx" ON "Referral"("referredId");
CREATE UNIQUE INDEX "Referral_referrerId_referredId_key" ON "Referral"("referrerId", "referredId");

-- AddForeignKey
ALTER TABLE "Referral" ADD CONSTRAINT "Referral_referrerId_fkey" FOREIGN KEY ("referrerId") REFERENCES "Member"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
ALTER TABLE "Referral" ADD CONSTRAINT "Referral_referredId_fkey" FOREIGN KEY ("referredId") REFERENCES "Member"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
