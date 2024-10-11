'use server';

import { z } from 'zod';
import { redirect } from 'next/navigation';
import { State } from '@/actions/utils';

const LoginSchema = z.object({
	email: z.string().email({ message: 'Invalid email address' }),
	password: z
		.string()
		.min(8, { message: 'Password must contain at least 8 characters' }),
	// .regex(
	// 	/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
	// 	{
	// 		message:
	// 			'Password must contain at least one uppercase letter, one lowercase letter, one number, and one special character',
	// 	}
	// ),
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
			message: 'Validation failed',
		};
	}

	const { email, password } = validatedFields.data;

	try {
		// Here you would typically interact with your authentication service
		// For example, you might use a function to check the credentials:
		//
		// const user = await authenticateUser(email, password);
		// if (!user) {
		//   throw new Error('Invalid credentials');
		// }

		console.log('User logged in:', { email, password });

		// If login is successful, you would typically set up a session or JWT token here
	} catch (error) {
		console.error('Login failed', error);

		// Check for specific error types
		if (error instanceof Error) {
			if (error.message === 'Invalid credentials') {
				return { message: 'Invalid email or password' };
			}
		}

		// Generic error message
		return { message: 'An error occurred during login. Please try again.' };
	}

	redirect('/');
}
