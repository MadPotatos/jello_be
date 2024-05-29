/*
  Warnings:

  - You are about to drop the column `projectId` on the `Assignee` table. All the data in the column will be lost.
  - You are about to drop the column `order` on the `Issue` table. All the data in the column will be lost.
  - Added the required column `projectId` to the `Issue` table without a default value. This is not possible if the table is not empty.
  - Added the required column `order` to the `Sprint` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Assignee` DROP FOREIGN KEY `Assignee_projectId_fkey`;

-- AlterTable
ALTER TABLE `Assignee` DROP COLUMN `projectId`;

-- AlterTable
ALTER TABLE `Issue` DROP COLUMN `order`,
    ADD COLUMN `dueDate` DATETIME(3) NULL,
    ADD COLUMN `listOrder` INTEGER NULL,
    ADD COLUMN `parentId` INTEGER NULL,
    ADD COLUMN `progress` INTEGER NOT NULL DEFAULT 0,
    ADD COLUMN `projectId` INTEGER NOT NULL,
    ADD COLUMN `sprintOrder` INTEGER NULL,
    MODIFY `descr` LONGTEXT NULL;

-- AlterTable
ALTER TABLE `Sprint` ADD COLUMN `order` INTEGER NOT NULL;

-- CreateTable
CREATE TABLE `Notification` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `type` ENUM('ASSIGNED_TO_ISSUE', 'PROJECT_INVITE', 'SPRINT_STARTED', 'SPRINT_COMPLETED') NOT NULL,
    `isRead` BOOLEAN NOT NULL DEFAULT false,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `userId` INTEGER NOT NULL,
    `projectId` INTEGER NULL,
    `issueId` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Issue` ADD CONSTRAINT `Issue_projectId_fkey` FOREIGN KEY (`projectId`) REFERENCES `Project`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Issue` ADD CONSTRAINT `Issue_parentId_fkey` FOREIGN KEY (`parentId`) REFERENCES `Issue`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Notification` ADD CONSTRAINT `Notification_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Notification` ADD CONSTRAINT `Notification_projectId_fkey` FOREIGN KEY (`projectId`) REFERENCES `Project`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Notification` ADD CONSTRAINT `Notification_issueId_fkey` FOREIGN KEY (`issueId`) REFERENCES `Issue`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;
