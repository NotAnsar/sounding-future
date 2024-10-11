/*
  Warnings:

  - You are about to drop the column `pic` on the `users` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "users" DROP COLUMN "pic",
ADD COLUMN     "image" TEXT;
