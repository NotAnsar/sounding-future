import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

async function migrateExistingTrackArtists() {
	console.log('Starting migration of existing track-artist relationships...');

	try {
		const tracks = await prisma.track.findMany({
			select: { id: true, artistId: true },
		});

		console.log(`Found ${tracks.length} tracks to migrate.`);

		let count = 0;
		for (const track of tracks) {
			await prisma.trackArtist.create({
				data: {
					trackId: track.id,
					artistId: track.artistId,
					isPrimary: true,
					order: 0,
				},
			});
			count++;
			if (count % 50 === 0) {
				console.log(`Processed ${count}/${tracks.length} tracks...`);
			}
		}

		console.log(`Successfully migrated ${count} track-artist relationships.`);
	} catch (error) {
		console.error('Error during migration:', error);
		throw error;
	}
}

// Main function to run the migration
async function main() {
	try {
		await migrateExistingTrackArtists();
		console.log('Migration completed successfully!');
	} catch (error) {
		console.error('Migration failed:', error);
		process.exit(1);
	} finally {
		await prisma.$disconnect();
	}
}

// Run the script
main();
