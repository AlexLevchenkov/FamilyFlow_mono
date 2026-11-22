-- AlterEnum
ALTER TYPE "Repeatability" ADD VALUE 'none';

-- AlterTable
ALTER TABLE "Event" ALTER COLUMN "repeatability" SET DEFAULT 'none';
