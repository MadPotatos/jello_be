/*
  Warnings:

  - You are about to alter the column `priority` on the `Issue` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Enum(EnumId(1))`.
  - You are about to alter the column `type` on the `Issue` table. The data in that column could be lost. The data in that column will be cast from `Int` to `Enum(EnumId(2))`.

*/
-- AlterTable
ALTER TABLE `Issue` MODIFY `priority` ENUM('HIGH', 'MEDIUM', 'LOW') NOT NULL,
    MODIFY `type` ENUM('TASK', 'BUG', 'REVIEW', 'SUBISSUE') NOT NULL;
