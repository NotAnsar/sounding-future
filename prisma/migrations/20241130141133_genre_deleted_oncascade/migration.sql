-- DropForeignKey
ALTER TABLE "artist_genres" DROP CONSTRAINT "artist_genres_genre_id_fkey";

-- DropForeignKey
ALTER TABLE "track_genres" DROP CONSTRAINT "track_genres_genre_id_fkey";

-- AddForeignKey
ALTER TABLE "artist_genres" ADD CONSTRAINT "artist_genres_genre_id_fkey" FOREIGN KEY ("genre_id") REFERENCES "genres"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "track_genres" ADD CONSTRAINT "track_genres_genre_id_fkey" FOREIGN KEY ("genre_id") REFERENCES "genres"("id") ON DELETE CASCADE ON UPDATE CASCADE;
