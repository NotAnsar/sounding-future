'use server';

import { z } from 'zod';
import { redirect } from 'next/navigation';
import { State } from '@/actions/utils';

const RegisterSchema = z.object({
	username: z
		.string()
		.min(3, { message: 'Username must contain at least 3 characters' }),
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

type RegisterData = z.infer<typeof RegisterSchema>;

export type RegisterState = State<RegisterData>;

export async function register(
	prevState: RegisterState,
	formData: FormData
): Promise<RegisterState> {
	const validatedFields = RegisterSchema.safeParse({
		username: formData.get('username'),
		email: formData.get('email'),
		password: formData.get('password'),
	});

	if (!validatedFields.success) {
		return {
			errors: validatedFields.error.flatten().fieldErrors,
			message: 'Validation failed',
		};
	}

	const { username, email, password } = validatedFields.data;

	try {
		// Here you would typically interact with your database or authentication service
		// For example, you might use Prisma ORM to create a new user:
		//
		// const user = await prisma.user.create({
		//   data: {
		//     username,
		//     email,
		//     password: await bcrypt.hash(password, 10), // Remember to hash the password!
		//   },
		// });

		console.log('User registered:', { username, email, password });

		// If registration is successful, you might want to log the user in automatically
		// This depends on your authentication strategy
	} catch (error) {
		console.error('Registration failed', error);

		// Check for specific error types
		if (error instanceof Error) {
			if (error.message.includes('unique constraint')) {
				// This assumes your database throws an error for duplicate username/email
				return { message: 'This username or email is already in use' };
			}
		}

		// Generic error message
		return {
			message: 'An error occurred during registration. Please try again.',
		};
	}

	redirect('/');
}
