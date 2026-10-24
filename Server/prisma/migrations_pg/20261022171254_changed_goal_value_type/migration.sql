/*
  Warnings:

  - You are about to alter the column `currentValue` on the `Goal` table. The data in that column could be lost. The data in that column will be cast from `Decimal(14,2)` to `Integer`.
  - You are about to alter the column `targetValue` on the `Goal` table. The data in that column could be lost. The data in that column will be cast from `Decimal(14,2)` to `Integer`.
  - Made the column `currentValue` on table `Goal` required. This step will fail if there are existing NULL values in that column.
  - Made the column `targetValue` on table `Goal` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "Family" ALTER COLUMN "updatedAt" DROP DEFAULT;

-- AlterTable
ALTER TABLE "FamilyMember" ALTER COLUMN "updatedAt" DROP DEFAULT;

-- AlterTable
ALTER TABLE "Goal" ALTER COLUMN "currentValue" SET NOT NULL,
ALTER COLUMN "currentValue" SET DEFAULT 0,
ALTER COLUMN "currentValue" SET DATA TYPE INTEGER,
ALTER COLUMN "targetValue" SET NOT NULL,
ALTER COLUMN "targetValue" SET DATA TYPE INTEGER;
