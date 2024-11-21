/*
  Warnings:

  - You are about to drop the column `realeaseBy` on the `tracks` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "tracks" DROP COLUMN "realeaseBy",
ADD COLUMN     "releaseBy" TEXT DEFAULT 'self-published';
