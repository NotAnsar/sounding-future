-- DropForeignKey
ALTER TABLE "partner" DROP CONSTRAINT "partner_social_id_fkey";

-- AddForeignKey
ALTER TABLE "partner" ADD CONSTRAINT "partner_social_id_fkey" FOREIGN KEY ("social_id") REFERENCES "social_links"("id") ON DELETE CASCADE ON UPDATE CASCADE;
