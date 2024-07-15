/*
  Warnings:

  - You are about to drop the column `userId` on the `Project` table. All the data in the column will be lost.
  - You are about to drop the column `reporterId` on the `WorkItem` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE `Project` DROP FOREIGN KEY `Project_userId_fkey`;

-- DropForeignKey
ALTER TABLE `WorkItem` DROP FOREIGN KEY `WorkItem_reporterId_fkey`;

-- AlterTable
ALTER TABLE `Project` DROP COLUMN `userId`;

-- AlterTable
ALTER TABLE `WorkItem` DROP COLUMN `reporterId`;
