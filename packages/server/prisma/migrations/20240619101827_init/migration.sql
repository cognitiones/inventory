/*
  Warnings:

  - A unique constraint covering the columns `[userId]` on the table `App` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX `App_userId_key` ON `App`(`userId`);
