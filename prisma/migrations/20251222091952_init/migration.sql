/*
  Warnings:

  - The primary key for the `coupons` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `code` on the `coupons` table. All the data in the column will be lost.
  - You are about to drop the column `discount` on the `coupons` table. All the data in the column will be lost.
  - You are about to drop the column `used` on the `coupons` table. All the data in the column will be lost.
  - The primary key for the `events` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `date` on the `events` table. All the data in the column will be lost.
  - You are about to drop the column `location` on the `events` table. All the data in the column will be lost.
  - The primary key for the `points` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Added the required column `discountValue` to the `coupons` table without a default value. This is not possible if the table is not empty.
  - Added the required column `eventDate` to the `events` table without a default value. This is not possible if the table is not empty.
  - Added the required column `price` to the `events` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `events` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "TransactionStatus" AS ENUM ('PENDING', 'ACCEPTED', 'REJECTED');

-- DropIndex
DROP INDEX "coupons_code_key";

-- AlterTable
ALTER TABLE "coupons" DROP CONSTRAINT "coupons_pkey",
DROP COLUMN "code",
DROP COLUMN "discount",
DROP COLUMN "used",
ADD COLUMN     "discountValue" INTEGER NOT NULL,
ADD COLUMN     "isUsed" BOOLEAN NOT NULL DEFAULT false,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "coupons_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "coupons_id_seq";

-- AlterTable
ALTER TABLE "events" DROP CONSTRAINT "events_pkey",
DROP COLUMN "date",
DROP COLUMN "location",
ADD COLUMN     "eventDate" TIMESTAMP(3) NOT NULL,
ADD COLUMN     "price" INTEGER NOT NULL,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "events_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "events_id_seq";

-- AlterTable
ALTER TABLE "points" DROP CONSTRAINT "points_pkey",
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ADD CONSTRAINT "points_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "points_id_seq";

-- CreateTable
CREATE TABLE "transactions" (
    "id" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "eventId" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "totalPrice" INTEGER NOT NULL,
    "status" "TransactionStatus" NOT NULL DEFAULT 'PENDING',
    "paymentProof" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "transactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "vouchers" (
    "id" TEXT NOT NULL,
    "organizerId" INTEGER NOT NULL,
    "eventId" TEXT NOT NULL,
    "discountValue" INTEGER NOT NULL,
    "isUsed" BOOLEAN NOT NULL DEFAULT false,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "vouchers_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "transactions" ADD CONSTRAINT "transactions_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "events"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vouchers" ADD CONSTRAINT "vouchers_organizerId_fkey" FOREIGN KEY ("organizerId") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "vouchers" ADD CONSTRAINT "vouchers_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "events"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
