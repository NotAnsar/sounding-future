'use server';

import { z } from 'zod';
import { hash } from 'bcrypt';
import { prisma } from '@/lib/prisma';
import { State } from '@/actions/utils/utils';
import { signIn } from '@/lib/auth';
import { redirect } from 'next/navigation';
// import { sendWelcomeEmail } from '@/lib/email';

const RegisterSchema = z.object({
	username: z
		.string()
		.min(3, { message: 'Username must contain at least 3 characters' }),
	email: z.string().email({ message: 'Invalid email address' }),
	password: z
		.string()
		.min(8, { message: 'Password must contain at least 8 characters' })
		.max(32, { message: 'Password must contain at most 32 characters' }),
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
		const hashedPassword = await hash(password, 10);

		await prisma.$transaction(async (tx) => {
			const user = await tx.user.create({
				data: {
					name: username,
					email,
					password: hashedPassword,
				},
			});
			return user;
		});

		// // Send welcome email after successful registration
		// try {
		// 	await sendWelcomeEmail(email, username);
		// } catch (emailError) {
		// 	console.error('Failed to send welcome email:', emailError);
		// 	// Continue with registration even if email fails
		// }

		const result = await signIn('credentials', {
			email,
			password,
			redirect: false,
		});

		if (result?.error) {
			return { message: 'Invalid email or password' };
		}
	} catch (error) {
		console.error('Registration failed', error);

		if (error instanceof Error) {
			if (
				error.message.includes(
					'Unique constraint failed on the fields: (`email`)'
				)
			) {
				return { message: 'This email is already in use' };
			}
			if (
				error.message.includes(
					'Unique constraint failed on the fields: (`name`)'
				)
			) {
				return { message: 'This username is already in use' };
			}
		}

		return {
			message: 'An error occurred during registration. Please try again.',
		};
	}

	redirect('/?welcome=true');
}
