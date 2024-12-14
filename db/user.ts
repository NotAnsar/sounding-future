import { prisma } from '@/lib/prisma';
import { auth } from '@/middleware';
import { User } from '@prisma/client';

export class AuthenticationError extends Error {
	constructor(message: string = 'User not authenticated') {
		super(message);
		this.name = 'AuthenticationError';
	}
}

export class UserNotFoundError extends Error {
	constructor(email: string) {
		super(`User not found for email: ${email}`);
		this.name = 'UserNotFoundError';
	}
}

export async function getCurrentUser(): Promise<User> {
	const session = await auth();

	if (!session?.user?.email) {
		throw new AuthenticationError();
	}

	const user = await prisma.user.findUnique({
		where: { email: session.user.email },
	});

	if (!user) {
		throw new UserNotFoundError(session.user.email);
	}

	return user;
}

export async function getCurrentUserSafe(): Promise<{
	user: User | null;
	message?: string;
	error?: boolean;
}> {
	try {
		const user = await getCurrentUser();
		return { user, error: false };
	} catch (error) {
		if (error instanceof AuthenticationError) {
			return { user: null, message: 'User not authenticated', error: true };
		}
		if (error instanceof UserNotFoundError) {
			return { user: null, message: error.message, error: true };
		}
		return { user: null, message: 'Unknown error occurred', error: true };
	}
}

export async function isAuthenticated(): Promise<boolean> {
	try {
		await getCurrentUser();
		return true;
	} catch {
		return false;
	}
}
