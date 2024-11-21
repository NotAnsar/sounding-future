/*
  Warnings:

  - You are about to drop the column `releaseBy` on the `tracks` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "tracks" DROP COLUMN "releaseBy",
ADD COLUMN     "releasedBy" TEXT NOT NULL DEFAULT 'self-published';
