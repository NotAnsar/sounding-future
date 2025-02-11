import { prisma } from '@/lib/prisma';
import { auth } from '@/middleware';
import { Prisma, User } from '@prisma/client';

export type UserStats = Prisma.UserGetPayload<{
	include: { artist: true };
}>;

export async function getUsers(): Promise<{
	data: UserStats[];
	message?: string;
	error?: boolean;
}> {
	try {
		const data = await prisma.user.findMany({
			orderBy: { createdAt: 'desc' },
			include: { artist: true },
		});

		return { data, error: false };
	} catch (error) {
		if (error instanceof Prisma.PrismaClientKnownRequestError) {
			console.error(`Database error: ${error.code}`, error);

			return { data: [], error: true, message: 'Database error' };
		}

		if (error instanceof Prisma.PrismaClientValidationError) {
			console.error('Validation error:', error);
			return { data: [], error: true, message: 'Invalid data provided' };
		}

		console.error('Error fetching users:', error);

		return {
			data: [],
			error: true,
			message: 'Unable to retrieve users. Please try again later.',
		};
	}
}

export async function getUserbyId(id?: string): Promise<{
	data: User | null;
	message?: string;
	error?: boolean;
}> {
	try {
		const data = await prisma.user.findFirst({
			where: { id },
		});

		if (!data) {
			return {
				data: null,
				error: true,
				message: `User with ID ${id} not found.`,
			};
		}

		return { data, error: false };
	} catch (error) {
		let message = `Unable to retrieve user data for ID ${id}. Please try again later.`;
		if (error instanceof Prisma.PrismaClientKnownRequestError) {
			console.error(`Database error: ${error.code}`, error);
			message = `Database error`;
		}

		if (error instanceof Prisma.PrismaClientValidationError) {
			console.error('Validation error:', error);
			message = 'Invalid data provided';
		}

		console.error(`Error fetching user with ID ${id}:`, error);
		return { data: null, error: true, message };
	}
}

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
			return { user: null, error: true, message: 'User not found' };
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
