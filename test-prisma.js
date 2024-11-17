import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
	try {
		// Create a new user
		const newUser = await prisma.user.delete({
			where: { id: 'cm3lhv7zq00007kvvsutnsjbq' },
		});
		console.log('New User Created:', newUser);

		// Fetch all users
		const allUsers = await prisma.user.findMany();
		console.log('All Users:', allUsers);
	} catch (error) {
		console.error('Error:', error.message);
	} finally {
		await prisma.$disconnect();
	}
}

main();
