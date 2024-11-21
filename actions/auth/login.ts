'use server';

import { z } from 'zod';
import { compare } from 'bcrypt';
import { prisma } from '@/lib/prisma';
import { State } from '@/actions/utils/utils';
import { signIn } from '@/lib/auth';
import { redirect } from 'next/navigation';

const LoginSchema = z.object({
	email: z.string().email({ message: 'Please enter a valid email address.' }),
	password: z
		.string()
		.min(8, { message: 'Your password must have at least 8 characters.' }),
});

type LoginData = z.infer<typeof LoginSchema>;

export type LoginState = State<LoginData>;

export async function login(
	prevState: LoginState,
	formData: FormData
): Promise<LoginState> {
	const validatedFields = LoginSchema.safeParse({
		email: formData.get('email'),
		password: formData.get('password'),
	});

	if (!validatedFields.success) {
		return {
			errors: validatedFields.error.flatten().fieldErrors,
			message: 'There were validation errors. Please check your input.',
		};
	}

	const { email, password } = validatedFields.data;

	try {
		const user = await prisma.user.findUnique({
			where: { email: email },
		});

		if (!user || !user.password) {
			return { message: 'No account found with that email address.' };
		}

		const isPasswordValid = await compare(password, user.password);

		if (!isPasswordValid) {
			return { message: 'The password you entered is incorrect.' };
		}

		// If password is valid, sign in the user
		const result = await signIn('credentials', {
			email,
			password,
			redirect: false,
		});

		if (result?.error) {
			return { message: 'Login failed. Please try again later.' };
		}
	} catch (error) {
		console.error('Login failed', error);
		return { message: 'An unexpected error occurred. Please try again.' };
	}

	redirect('/');
}

export async function loginGuest(): Promise<LoginState> {
	try {
		const result = await signIn('credentials', {
			email: 'guest.user@example.com',
			password: 'Guest1234',
			redirect: false,
		});

		if (result?.error) {
			return { message: 'Login failed. Please try again later.' };
		}
	} catch (error) {
		console.error('Login failed', error);
		return { message: 'An unexpected error occurred. Please try again.' };
	}

	redirect('/');
}
