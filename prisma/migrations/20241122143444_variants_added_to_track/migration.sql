/*
  Warnings:

  - You are about to drop the column `url_flac` on the `tracks` table. All the data in the column will be lost.
  - You are about to drop the column `url_mp3` on the `tracks` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "tracks" DROP COLUMN "url_flac",
DROP COLUMN "url_mp3",
ADD COLUMN     "variant1" TEXT,
ADD COLUMN     "variant2" TEXT,
ADD COLUMN     "variant3" TEXT;
