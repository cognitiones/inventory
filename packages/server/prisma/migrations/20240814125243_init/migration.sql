-- CreateTable
CREATE TABLE `TaskOccurrence` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `taskId` INTEGER NOT NULL,
    `occurrenceDate` DATETIME(3) NOT NULL,
    `completed` BOOLEAN NOT NULL,

    UNIQUE INDEX `TaskOccurrence_taskId_occurrenceDate_key`(`taskId`, `occurrenceDate`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `TaskOccurrence` ADD CONSTRAINT `TaskOccurrence_taskId_fkey` FOREIGN KEY (`taskId`) REFERENCES `Task`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
