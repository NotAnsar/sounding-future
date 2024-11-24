-- DropForeignKey
ALTER TABLE "artist_articles" DROP CONSTRAINT "artist_articles_artist_id_fkey";

-- DropForeignKey
ALTER TABLE "artist_genres" DROP CONSTRAINT "artist_genres_artist_id_fkey";

-- AddForeignKey
ALTER TABLE "artist_genres" ADD CONSTRAINT "artist_genres_artist_id_fkey" FOREIGN KEY ("artist_id") REFERENCES "artist"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "artist_articles" ADD CONSTRAINT "artist_articles_artist_id_fkey" FOREIGN KEY ("artist_id") REFERENCES "artist"("id") ON DELETE CASCADE ON UPDATE CASCADE;
