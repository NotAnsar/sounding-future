'use server';

import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { State } from '@/actions/utils/utils';
import { randomBytes } from 'crypto';
import { hash } from 'bcrypt';
import { sendPasswordResetEmail } from '@/lib/email';

const ResetPasswordSchema = z.object({
	email: z.string().email({ message: 'Please enter a valid email address.' }),
});

type ResetPasswordData = z.infer<typeof ResetPasswordSchema>;

export type ResetPasswordState = State<ResetPasswordData> & {
	success?: boolean;
};

export async function resetPasswordRequest(
	prevState: ResetPasswordState,
	formData: FormData
): Promise<ResetPasswordState> {
	const validatedFields = ResetPasswordSchema.safeParse({
		email: formData.get('email'),
	});

	if (!validatedFields.success) {
		return {
			errors: validatedFields.error.flatten().fieldErrors,
			message: 'There were validation errors. Please check your input.',
		};
	}

	const { email } = validatedFields.data;

	try {
		const user = await prisma.user.findUnique({
			where: { email: email },
		});

		if (!user) {
			return {
				message: 'No account associated with this email exists',
			};
		}

		// Create reset token
		const token = await createPasswordResetToken(email);

		// Send reset email
		await sendPasswordResetEmail(email, token);

		return {
			message: 'Password reset link sent to your email',
			success: true,
		};
	} catch (error) {
		console.error('Recover failed', error);
		return {
			message: 'An unexpected error occurred. Please try again.',
			success: false,
		};
	}
}

const UpdatePasswordSchema = z
	.object({
		password: z
			.string()
			.min(8, { message: 'Password must contain at least 8 characters' })
			.max(32, { message: 'Password must contain at most 32 characters' }),
		confirmPassword: z
			.string()
			.min(8, { message: 'Password must contain at least 8 characters' })
			.max(32, { message: 'Password must contain at most 32 characters' }),
	})
	.refine(
		(values) => {
			return values.password === values.confirmPassword;
		},
		{
			message: 'Passwords must match!',
			path: ['confirmPassword'],
		}
	);

type UpdatePasswordData = z.infer<typeof UpdatePasswordSchema>;

export type UpdatePasswordState = State<UpdatePasswordData> & {
	success?: boolean;
};

export async function resetPasswordCompletion(
	token: string,
	prevState: UpdatePasswordState,
	formData: FormData
): Promise<UpdatePasswordState> {
	try {
		if (!token)
			return {
				message: 'Invalid or expired reset token',
				success: false,
			};

		const validatedFields = UpdatePasswordSchema.safeParse({
			password: formData.get('password'),
			confirmPassword: formData.get('confirmPassword'),
		});

		if (!validatedFields.success) {
			return {
				errors: validatedFields.error.flatten().fieldErrors,
				message: 'Invalid Credentials. Unable to Send Reset Link.',
			};
		}

		const { password } = validatedFields.data;

		// Find valid reset token
		const resetTokenRecord = await prisma.passwordResetToken.findFirst({
			where: {
				token,
				expiresAt: { gt: new Date() },
			},
		});

		if (!resetTokenRecord) {
			return {
				message: 'Invalid or expired reset token',
				success: false,
			};
		}

		// Hash new password
		const hashedPassword = await hash(password, 10);

		// Update user password
		await prisma.user.update({
			where: { email: resetTokenRecord.email },
			data: { password: hashedPassword },
		});

		// Delete used token
		await prisma.passwordResetToken.delete({
			where: { token },
		});

		return {
			message: 'Password successfully reset',
			success: true,
		};
	} catch (error) {
		console.error('Password reset completion error:', error);
		return {
			message: 'An unexpected error occurred. Please try again.',
			success: false,
		};
	}
}

// Create a reset token
async function createPasswordResetToken(email: string) {
	const token = randomBytes(32).toString('hex');
	const expiresAt = new Date(Date.now() + 3600000); // 1 hour from now

	await prisma.passwordResetToken.create({
		data: {
			email,
			token,
			expiresAt,
		},
	});

	return token;
}
