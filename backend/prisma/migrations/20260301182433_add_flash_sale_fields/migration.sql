-- AlterTable
ALTER TABLE "Promotion" ADD COLUMN     "flashSaleStock" INTEGER,
ADD COLUMN     "isFlashSale" BOOLEAN NOT NULL DEFAULT false;
