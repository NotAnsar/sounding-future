import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

async function addListeningHistory(trackId: string) {
	const session = await auth();

	if (!session?.user) {
		return { error: 'User not authenticated' };
	}
	try {
		const newHistory = await prisma.listeningHistory.create({
			data: {
				userId: session?.user.id ?? '',
				trackId,
			},
		});

		revalidatePath('/', 'layout');
		return newHistory;
	} catch (error) {
		console.error('Error adding listening history:', error);
		throw error;
	}
}

export { addListeningHistory };
