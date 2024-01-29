/*
  Warnings:

  - You are about to drop the column `isDeleted` on the `Member` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `Member` DROP COLUMN `isDeleted`;

-- AlterTable
ALTER TABLE `Project` ADD COLUMN `isDeleted` BOOLEAN NOT NULL DEFAULT false;
