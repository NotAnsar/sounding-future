import { PrismaClient } from '@prisma/client';

async function testConnection() {
	const prisma = new PrismaClient();

	try {
		// Attempt to connect to the database
		await prisma.$connect();
		console.log('Successfully connected to the database');

		// Optional: Perform a simple query
		const result = await prisma.$queryRaw`SELECT 1 as result`;
		console.log('Query result:', result);
	} catch (error) {
		console.error('Error connecting to the database:', error);
	} finally {
		await prisma.$disconnect();
	}
}

testConnection();
