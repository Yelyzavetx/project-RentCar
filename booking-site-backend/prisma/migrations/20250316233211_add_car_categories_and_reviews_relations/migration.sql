/*
  Warnings:

  - The `category` column on the `CatalogItem` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "CarCategory" AS ENUM ('ECONOMY', 'COMFORT', 'BUSINESS', 'ELITE');

-- AlterTable
ALTER TABLE "Booking" ADD COLUMN     "hasReview" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "CatalogItem" DROP COLUMN "category",
ADD COLUMN     "category" "CarCategory";

-- AlterTable
ALTER TABLE "Review" ADD COLUMN     "catalogItemId" TEXT;

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_catalogItemId_fkey" FOREIGN KEY ("catalogItemId") REFERENCES "CatalogItem"("id") ON DELETE SET NULL ON UPDATE CASCADE;
