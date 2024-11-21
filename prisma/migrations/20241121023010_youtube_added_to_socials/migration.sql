/*
  Warnings:

  - Made the column `pic` on table `artist` required. This step will fail if there are existing NULL values in that column.
  - Made the column `picture` on table `partner` required. This step will fail if there are existing NULL values in that column.
  - Made the column `country` on table `partner` required. This step will fail if there are existing NULL values in that column.
  - Made the column `cover` on table `tracks` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "artist" ALTER COLUMN "pic" SET NOT NULL;

-- AlterTable
ALTER TABLE "partner" ALTER COLUMN "picture" SET NOT NULL,
ALTER COLUMN "country" SET NOT NULL;

-- AlterTable
ALTER TABLE "social_links" ADD COLUMN     "youtube" TEXT;

-- AlterTable
ALTER TABLE "tracks" ALTER COLUMN "cover" SET NOT NULL;
