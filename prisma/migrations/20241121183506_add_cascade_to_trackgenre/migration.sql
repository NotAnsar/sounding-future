-- DropForeignKey
ALTER TABLE "track_genres" DROP CONSTRAINT "track_genres_track_id_fkey";

-- AddForeignKey
ALTER TABLE "track_genres" ADD CONSTRAINT "track_genres_track_id_fkey" FOREIGN KEY ("track_id") REFERENCES "tracks"("id") ON DELETE CASCADE ON UPDATE CASCADE;
