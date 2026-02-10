/*
  Warnings:

  - You are about to drop the column `deviceId` on the `refreshtoken` table. All the data in the column will be lost.
  - You are about to drop the column `ipAddress` on the `refreshtoken` table. All the data in the column will be lost.
  - You are about to drop the column `token` on the `refreshtoken` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `refreshtoken` DROP FOREIGN KEY `RefreshToken_userId_fkey`;

-- DropIndex
DROP INDEX `RefreshToken_deviceId_idx` ON `refreshtoken`;

-- DropIndex
DROP INDEX `RefreshToken_userId_deviceId_key` ON `refreshtoken`;

-- AlterTable
ALTER TABLE `refreshtoken` DROP COLUMN `deviceId`,
    DROP COLUMN `ipAddress`,
    DROP COLUMN `token`,
    ADD COLUMN `jti` VARCHAR(191) NOT NULL DEFAULT '';

