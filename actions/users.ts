'use server';

import { z } from 'zod';
import { DeleteState, imageSchema, State } from './utils/utils';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { Prisma } from '@prisma/client';
import { hash } from 'bcrypt';
import {
	checkFile,
	deleteFile,
	updateFile,
	uploadFile,
} from './utils/s3-image';

const UserSchema = z.object({
	f_name: z.string().optional(),
	l_name: z.string().optional(),
	image: imageSchema.shape.file.optional(),
	email: z.string().email('Invalid email address'),
	password: z
		.string()
		.min(8, { message: 'Password must contain at least 8 characters' })
		.max(32, { message: 'Password must contain at most 32 characters' }),
	name: z
		.string()
		.min(1, 'User name is required')
		.max(100, 'User name must be 100 characters or less'),
	role: z.string().optional(),
	artistId: z.string().optional(),
	deleteImage: z.string().optional(),
});

type UserData = z.infer<typeof UserSchema>;

export type UserFormState = State<UserData> & {
	prev?: { image?: string | undefined };
};

export async function addUser(
	prevState: UserFormState,
	formData: FormData
): Promise<UserFormState> {
	const validatedFields = UserSchema.omit({ deleteImage: true }).safeParse({
		email: formData.get('email'),
		password: formData.get('password'),
		name: formData.get('name'),
		f_name: formData.get('f_name') || undefined,
		l_name: formData.get('l_name') || undefined,
		role: formData.get('role') || undefined,
		artistId: formData.get('artistId') || undefined,
		image: await checkFile(formData.get('image')),
	});

	if (!validatedFields.success) {
		return {
			errors: validatedFields.error.flatten().fieldErrors,
			message: 'Failed to add new User. Please check the form for errors.',
		};
	}

	const { f_name, l_name, email, password, name, role, artistId, image } =
		validatedFields.data;

	try {
		const hashedPassword = await hash(password, 10);
		const imageUrl = image ? await uploadFile(image) : undefined;

		await prisma.user.create({
			data: {
				f_name,
				l_name,
				email,
				password: hashedPassword,
				name,
				role: role ? role : 'user',
				artistId,
				image: imageUrl,
			},
		});

		revalidatePath('/', 'layout');
	} catch (error) {
		if (
			error instanceof Prisma.PrismaClientKnownRequestError &&
			error.code === 'P2002'
		) {
			return { message: 'User already exists' };
		}
		return { message: 'Failed to create user' };
	}
	redirect('/user/users');
}

export async function updateUser(
	id: string,
	prevState: UserFormState,
	formData: FormData
): Promise<UserFormState> {
	const validatedFields = UserSchema.omit({
		image: true,
		password: true,
	}).safeParse({
		email: formData.get('email'),
		name: formData.get('name'),
		f_name: formData.get('f_name') || undefined,
		l_name: formData.get('l_name') || undefined,
		role: formData.get('role') || undefined,
		artistId: formData.get('artistId') || undefined,
		deleteImage: formData.get('deleteImage') || undefined,
	});

	if (!validatedFields.success) {
		return {
			errors: validatedFields.error.flatten().fieldErrors,
			message: 'Failed to update User. Please check the form for errors.',
		};
	}

	const { f_name, l_name, email, name, role, artistId, deleteImage } =
		validatedFields.data;

	try {
		const image = formData.get('image');

		// Check file size
		if (image instanceof File && image.size > 2 * 1024 * 1024) {
			return {
				message: 'User image must be less than 2MB',
				errors: { image: ['User image must be less than 2MB'] },
			};
		}

		let imageUrl: string | undefined | null = prevState?.prev?.image;
		if (deleteImage === 'true') {
			if (prevState?.prev?.image) await deleteFile(prevState.prev.image);
			imageUrl = null;
		} else {
			imageUrl = await updateFile(image, prevState?.prev?.image);
		}

		// Update user details
		await prisma.user.update({
			where: { id },
			data: {
				f_name,
				l_name,
				email,
				name,
				role,
				artistId,
				image: imageUrl,
			},
		});

		revalidatePath('/', 'layout');
	} catch (error) {
		if (
			error instanceof Prisma.PrismaClientKnownRequestError &&
			error.code === 'P2002'
		) {
			return { message: 'A user with this name already exists' };
		}
		return { message: 'Failed to update user' };
	}
	redirect('/user/users');
}

export async function deleteUser(id: string): Promise<DeleteState> {
	try {
		const user = await prisma.user.delete({ where: { id } });

		if (!user) {
			return { success: false, message: 'User not found' };
		}

		// Delete images if they exist
		if (user.image) await deleteFile(user.image);
		revalidatePath('/user/users', 'layout');
		return { success: true, message: 'User deleted successfully' };
	} catch (error) {
		console.error('Delete error:', error);

		if (error instanceof Prisma.PrismaClientKnownRequestError) {
			return {
				success: false,
				message: 'User not found or cannot be deleted',
			};
		}

		return { success: false, message: 'Failed to delete User' };
	}
}
