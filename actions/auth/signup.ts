// 'use server';

// import { z } from 'zod';
// import { hash } from 'bcrypt';
// import { prisma } from '@/lib/prisma';
// import { State } from '@/actions/utils/utils';
// import { signIn } from '@/lib/auth';
// import { redirect } from 'next/navigation';
// import { sendWelcomeEmail } from '@/lib/email';

// const RegisterSchema = z.object({
// 	username: z
// 		.string()
// 		.min(3, { message: 'Username must contain at least 3 characters' }),
// 	email: z.string().email({ message: 'Invalid email address' }),
// 	password: z
// 		.string()
// 		.min(8, { message: 'Password must contain at least 8 characters' })
// 		.max(32, { message: 'Password must contain at most 32 characters' }),
// });

// type RegisterData = z.infer<typeof RegisterSchema>;

// export type RegisterState = State<RegisterData>;

// export async function register(
// 	prevState: RegisterState,
// 	formData: FormData
// ): Promise<RegisterState> {
// 	const validatedFields = RegisterSchema.safeParse({
// 		username: formData.get('username'),
// 		email: formData.get('email'),
// 		password: formData.get('password'),
// 	});

// 	if (!validatedFields.success) {
// 		return {
// 			errors: validatedFields.error.flatten().fieldErrors,
// 			message: 'Validation failed',
// 		};
// 	}

// 	const { username, email, password } = validatedFields.data;

// 	try {
// 		const hashedPassword = await hash(password, 10);

// 		await prisma.$transaction(async (tx) => {
// 			const user = await tx.user.create({
// 				data: {
// 					name: username,
// 					email,
// 					password: hashedPassword,
// 				},
// 			});
// 			return user;
// 		});

// 		try {
// 			await sendWelcomeEmail(email, username);
// 		} catch (emailError) {
// 			console.error('Failed to send welcome email:', emailError);
// 			// Continue with registration even if email fails
// 		}

// 		const result = await signIn('credentials', {
// 			email,
// 			password,
// 			redirect: false,
// 		});

// 		if (result?.error) {
// 			return { message: 'Invalid email or password' };
// 		}
// 	} catch (error) {
// 		console.error('Registration failed', error);

// 		if (error instanceof Error) {
// 			if (
// 				error.message.includes(
// 					'Unique constraint failed on the fields: (`email`)'
// 				)
// 			) {
// 				return { message: 'This email is already in use' };
// 			}
// 			if (
// 				error.message.includes(
// 					'Unique constraint failed on the fields: (`name`)'
// 				)
// 			) {
// 				return { message: 'This username is already in use' };
// 			}
// 		}

// 		return {
// 			message: 'An error occurred during registration. Please try again.',
// 		};
// 	}

// 	redirect('/?welcome=true');
// }

'use server';

import { z } from 'zod';
import { hash } from 'bcrypt';
import { prisma } from '@/lib/prisma';
import { State } from '@/actions/utils/utils';

import { sendVerificationEmail, sendWelcomeEmail } from '@/lib/email';
import crypto from 'crypto';

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

export type RegisterState = State<RegisterData> & { success?: boolean };

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

		// Generate verification token
		const verificationToken = crypto.randomBytes(32).toString('hex');
		const tokenExpiration = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

		await prisma.$transaction(async (tx) => {
			// Create user with emailVerified as null
			const user = await tx.user.create({
				data: {
					name: username,
					email,
					password: hashedPassword,
				},
			});

			// Create verification token
			await tx.verificationToken.create({
				data: {
					identifier: email,
					token: verificationToken,
					expires: tokenExpiration,
				},
			});

			return user;
		});

		try {
			await sendVerificationEmail(email, verificationToken);
		} catch (emailError) {
			console.error('Failed to send verification email:', emailError);
		}

		return {
			message:
				'Registration successful. Please check your email to verify your account.',
			success: true,
		};
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
}

export async function verifyEmail(token: string) {
	if (!token) {
		return {
			success: false,
			message: 'Missing verification token',
		};
	}

	try {
		const verificationToken = await prisma.verificationToken.findFirst({
			where: { token },
		});
		console.log(token, verificationToken);

		if (!verificationToken) {
			return { success: false, message: 'Invalid verification token' };
		}

		if (new Date(verificationToken.expires) < new Date()) {
			// Delete expired token
			await prisma.verificationToken.deleteMany({
				where: { token },
			});

			return { success: false, message: 'Verification token has expired' };
		}

		const user = await prisma.user.findFirst({
			where: { email: verificationToken.identifier },
		});

		if (!user) {
			return { success: false, message: 'User not found' };
		}

		// Update user
		await prisma.user.update({
			where: { id: user.id },
			data: { emailVerified: new Date() },
		});

		// Delete used token
		await prisma.verificationToken.deleteMany({
			where: { token },
		});

		// Send welcome email now that the account is verified
		await sendWelcomeEmail(user.email, user.name);

		return { success: true, message: 'Email verified successfully' };
	} catch (error) {
		console.error('Email verification error:', error);
		return {
			success: false,
			message: 'An error occurred during verification',
		};
	}
}

export async function resendVerification(email: string) {
	if (!email) {
		return { success: false, message: 'Email is required' };
	}

	try {
		const user = await prisma.user.findUnique({
			where: { email },
		});

		if (!user) {
			// Return success even if user doesn't exist for security reasons
			return {
				success: true,
				message:
					'If your email exists in our system, a verification link has been sent',
			};
		}

		// If user is already verified
		if (user.emailVerified) {
			return {
				success: true,
				message: 'Your email is already verified. You can log in now.',
			};
		}

		// Delete any existing tokens for this email
		await prisma.verificationToken.deleteMany({
			where: { identifier: email },
		});

		// Create new verification token
		const verificationToken = crypto.randomBytes(32).toString('hex');
		const tokenExpiration = new Date(Date.now() + 24 * 60 * 60 * 1000); // 24 hours

		await prisma.verificationToken.create({
			data: {
				identifier: email,
				token: verificationToken,
				expires: tokenExpiration,
			},
		});

		// Send verification email
		await sendVerificationEmail(email, verificationToken);

		return {
			success: true,
			message: 'Verification email sent. Please check your inbox.',
		};
	} catch (error) {
		console.error('Failed to resend verification email:', error);
		return {
			success: false,
			message: 'An error occurred. Please try again later.',
		};
	}
}
