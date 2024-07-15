/*
  Warnings:

  - You are about to drop the column `issueId` on the `Assignee` table. All the data in the column will be lost.
  - You are about to drop the column `issueId` on the `Comment` table. All the data in the column will be lost.
  - You are about to drop the column `issueId` on the `Notification` table. All the data in the column will be lost.
  - You are about to drop the `Issue` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[repo]` on the table `Project` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `workItemId` to the `Assignee` table without a default value. This is not possible if the table is not empty.
  - Added the required column `workItemId` to the `Comment` table without a default value. This is not possible if the table is not empty.
  - Added the required column `point` to the `UserStory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `priority` to the `UserStory` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `Assignee` DROP FOREIGN KEY `Assignee_issueId_fkey`;

-- DropForeignKey
ALTER TABLE `Comment` DROP FOREIGN KEY `Comment_issueId_fkey`;

-- DropForeignKey
ALTER TABLE `Issue` DROP FOREIGN KEY `Issue_listId_fkey`;

-- DropForeignKey
ALTER TABLE `Issue` DROP FOREIGN KEY `Issue_parentId_fkey`;

-- DropForeignKey
ALTER TABLE `Issue` DROP FOREIGN KEY `Issue_projectId_fkey`;

-- DropForeignKey
ALTER TABLE `Issue` DROP FOREIGN KEY `Issue_reporterId_fkey`;

-- DropForeignKey
ALTER TABLE `Issue` DROP FOREIGN KEY `Issue_sprintId_fkey`;

-- DropForeignKey
ALTER TABLE `Notification` DROP FOREIGN KEY `Notification_issueId_fkey`;

-- AlterTable
ALTER TABLE `Assignee` DROP COLUMN `issueId`,
    ADD COLUMN `workItemId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `Comment` DROP COLUMN `issueId`,
    ADD COLUMN `workItemId` INTEGER NOT NULL;

-- AlterTable
ALTER TABLE `Member` ADD COLUMN `role` ENUM('SCRUM_MASTER', 'PRODUCT_OWNER', 'DEVELOPER', 'TESTER') NULL;

-- AlterTable
ALTER TABLE `Notification` DROP COLUMN `issueId`,
    ADD COLUMN `workItemId` INTEGER NULL;

-- AlterTable
ALTER TABLE `UserStory` ADD COLUMN `point` INTEGER NOT NULL,
    ADD COLUMN `priority` ENUM('HIGH', 'MEDIUM', 'LOW') NOT NULL;

-- DropTable
DROP TABLE `Issue`;

-- CreateTable
CREATE TABLE `WorkItem` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `listOrder` INTEGER NULL,
    `sprintOrder` INTEGER NULL,
    `priority` ENUM('HIGH', 'MEDIUM', 'LOW') NOT NULL,
    `type` ENUM('TASK', 'BUG', 'REVIEW', 'SUBISSUE') NOT NULL,
    `statusInSprint` ENUM('IN_SPRINT_PLANNING', 'IN_SPRINT', 'IN_SPRINT_REVIEW') NULL,
    `assignRole` ENUM('SCRUM_MASTER', 'PRODUCT_OWNER', 'DEVELOPER', 'TESTER') NULL,
    `summary` VARCHAR(100) NOT NULL,
    `descr` LONGTEXT NULL,
    `progress` INTEGER NOT NULL DEFAULT 0,
    `dueDate` DATETIME(3) NULL,
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `listId` INTEGER NULL,
    `sprintId` INTEGER NULL,
    `projectId` INTEGER NOT NULL,
    `userStoryId` INTEGER NULL,
    `reporterId` INTEGER NOT NULL,
    `parentId` INTEGER NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateIndex
CREATE UNIQUE INDEX `Project_repo_key` ON `Project`(`repo`);

-- AddForeignKey
ALTER TABLE `WorkItem` ADD CONSTRAINT `WorkItem_listId_fkey` FOREIGN KEY (`listId`) REFERENCES `List`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `WorkItem` ADD CONSTRAINT `WorkItem_sprintId_fkey` FOREIGN KEY (`sprintId`) REFERENCES `Sprint`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `WorkItem` ADD CONSTRAINT `WorkItem_projectId_fkey` FOREIGN KEY (`projectId`) REFERENCES `Project`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `WorkItem` ADD CONSTRAINT `WorkItem_userStoryId_fkey` FOREIGN KEY (`userStoryId`) REFERENCES `UserStory`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `WorkItem` ADD CONSTRAINT `WorkItem_reporterId_fkey` FOREIGN KEY (`reporterId`) REFERENCES `User`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `WorkItem` ADD CONSTRAINT `WorkItem_parentId_fkey` FOREIGN KEY (`parentId`) REFERENCES `WorkItem`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Assignee` ADD CONSTRAINT `Assignee_workItemId_fkey` FOREIGN KEY (`workItemId`) REFERENCES `WorkItem`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Comment` ADD CONSTRAINT `Comment_workItemId_fkey` FOREIGN KEY (`workItemId`) REFERENCES `WorkItem`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Notification` ADD CONSTRAINT `Notification_workItemId_fkey` FOREIGN KEY (`workItemId`) REFERENCES `WorkItem`(`id`) ON DELETE CASCADE ON UPDATE CASCADE;
