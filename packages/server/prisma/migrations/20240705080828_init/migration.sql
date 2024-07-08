/*
  Warnings:

  - You are about to drop the column `clientid` on the `App` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `App` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[platformId]` on the table `App` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `clientId` to the `App` table without a default value. This is not possible if the table is not empty.
  - Added the required column `platformId` to the `App` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `App` DROP FOREIGN KEY `App_userId_fkey`;

-- AlterTable
ALTER TABLE `App` DROP COLUMN `clientid`,
    DROP COLUMN `userId`,
    ADD COLUMN `clientId` JSON NOT NULL,
    ADD COLUMN `platformId` INTEGER NOT NULL;

-- CreateTable
CREATE TABLE `PlatformInfo` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userId` INTEGER NOT NULL,

    UNIQUE INDEX `PlatformInfo_userId_key`(`userId`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `App_platformId_key` ON `App`(`platformId`);

-- AddForeignKey
ALTER TABLE `PlatformInfo` ADD CONSTRAINT `PlatformInfo_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `App` ADD CONSTRAINT `App_platformId_fkey` FOREIGN KEY (`platformId`) REFERENCES `PlatformInfo`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
