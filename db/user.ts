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

export async function getCurrentUserSafe(): Promise<User | null> {
	try {
		return await getCurrentUser();
	} catch (error) {
		return null;
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
