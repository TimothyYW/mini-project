/*
  Warnings:

  - The primary key for the `coupons` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `coupons` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- AlterTable
ALTER TABLE "coupons" DROP CONSTRAINT "coupons_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "coupons_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "transactions" ADD COLUMN     "couponId" INTEGER,
ADD COLUMN     "voucherId" INTEGER;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_couponId_fkey" FOREIGN KEY ("couponId") REFERENCES "coupons"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_voucherId_fkey" FOREIGN KEY ("voucherId") REFERENCES "vouchers"("id") ON DELETE SET NULL ON UPDATE CASCADE;
