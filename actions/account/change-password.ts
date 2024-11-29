'use server';

import { z } from 'zod';
import { revalidatePath } from 'next/cache';
import { State } from '../utils/utils';
import { prisma } from '@/lib/prisma';
import { auth } from '@/lib/auth';
import { compare, hash } from 'bcrypt';

const ChangePasswordSchema = z
	.object({
		current_password: z
			.string()
			.min(1, { message: 'Current password is required' }),
		new_password: z
			.string()
			.min(8, { message: 'Your password must have at least 8 characters.' }),
		new_passwordconfirm: z.string().min(1, 'Please confirm your password'),
	})
	.refine((data) => data.new_password === data.new_passwordconfirm, {
		message: 'New passwords do not match',
		path: ['new_passwordconfirm'],
	});

type ChangePasswordData = z.infer<typeof ChangePasswordSchema>;

export type ChangePasswordState = State<ChangePasswordData> & {
	success?: boolean;
	message?: string;
};

export async function changePassword(
	prevState: ChangePasswordState,
	formData: FormData
): Promise<ChangePasswordState> {
	const validatedFields = ChangePasswordSchema.safeParse({
		current_password: formData.get('current_password'),
		new_password: formData.get('new_password'),
		new_passwordconfirm: formData.get('new_passwordconfirm'),
	});

	if (!validatedFields.success) {
		return {
			errors: validatedFields.error.flatten().fieldErrors,
			message: 'Validation failed',
		};
	}

	if (
		validatedFields.data.current_password === validatedFields.data.new_password
	) {
		return {
			errors: {
				new_password: [
					'New password must not be the same as the current password',
				],
			},
			message: 'Validation failed',
		};
	}

	const { current_password, new_password } = validatedFields.data;
	const session = await auth();
	if (!session?.user?.id) {
		return { message: 'You must be logged in to change your password' };
	}

	try {
		const user = await prisma.user.findUnique({
			where: { id: session?.user?.id },
		});

		if (!user || !user.password) {
			return { message: 'No account found' };
		}

		const isPasswordValid = await compare(current_password, user.password);

		if (!isPasswordValid) {
			return { message: 'The password you entered is incorrect.' };
		}

		const hashedPassword = await hash(new_password, 10);

		await prisma.user.update({
			where: { id: user.id },
			data: { password: hashedPassword },
		});

		revalidatePath('/');
		return { message: 'Password updated successfully', success: true };
	} catch (error) {
		console.error('Password change failed:', error);
		return { message: 'Password change failed', success: false };
	}
}
