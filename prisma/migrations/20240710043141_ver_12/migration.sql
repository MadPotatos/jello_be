/*
  Warnings:

  - The values [SUBISSUE] on the enum `Issue_type` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterTable
ALTER TABLE `Issue` MODIFY `type` ENUM('TASK', 'BUG', 'REVIEW') NOT NULL;

-- AlterTable
ALTER TABLE `Project` ADD COLUMN `productGoal` VARCHAR(191) NULL;

-- CreateTable
CREATE TABLE `UserStory` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `title` VARCHAR(100) NOT NULL,
    `description` VARCHAR(255) NULL,
    `status` ENUM('TO_DO', 'IN_PROGRESS', 'DONE') NOT NULL DEFAULT 'TO_DO',
    `projectId` INTEGER NOT NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `sprintId` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `UserStory` ADD CONSTRAINT `UserStory_projectId_fkey` FOREIGN KEY (`projectId`) REFERENCES `Project`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `UserStory` ADD CONSTRAINT `UserStory_sprintId_fkey` FOREIGN KEY (`sprintId`) REFERENCES `Sprint`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
