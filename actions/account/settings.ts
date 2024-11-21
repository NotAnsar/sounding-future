'use server';

import { revalidatePath } from 'next/cache';
import { z } from 'zod';
import { State } from '../utils/utils';

// Define the schema for registration
const SettingSchema = z
	.object({
		firstName: z
			.string()
			.min(1, 'First name is required')
			.max(50, 'First name must be 50 characters or less'),
		secondName: z
			.string()
			.min(1, 'Second name is required')
			.max(50, 'Second name must be 50 characters or less'),
		email: z
			.string()
			.min(1, 'Email is required')
			.email('Invalid email address'),
		username: z
			.string()
			.min(1, 'Username is required')
			.max(30, 'Username must be 30 characters or less'),
		password: z
			.string()
			.min(8, { message: 'Your password must have at least 8 characters.' }),
		confirmPassword: z.string().min(1, 'Please confirm your password'),
	})
	.refine((data) => data.password === data.confirmPassword, {
		message: "Passwords don't match",
		path: ['confirmPassword'],
	});

type SettingsData = z.infer<typeof SettingSchema>;

export type SettingsState = State<SettingsData>;

export async function updateUserAccount(
	prevState: SettingsState,
	formData: FormData
): Promise<SettingsState> {
	const validatedFields = SettingSchema.safeParse({
		firstName: formData.get('firstName'),
		secondName: formData.get('secondName'),
		email: formData.get('email'),
		username: formData.get('username'),
		password: formData.get('password'),
		confirmPassword: formData.get('confirmPassword'),
	});

	if (!validatedFields.success) {
		return {
			errors: validatedFields.error.flatten().fieldErrors,
			message: 'Failed to register. Please check the form for errors.',
		};
	}

	const { firstName, secondName, email, username, password } =
		validatedFields.data;

	try {
		// Here you would typically:
		// 1. Hash the password
		// 2. Check if email/username already exists
		// 3. Create the user in your database
		// 4. Send verification email
		// 5. Create session/token

		console.log('Account user:', {
			firstName,
			secondName,
			email,
			username,
			password,
			// Don't log passwords in production!
		});

		revalidatePath('/', 'layout');
		return { message: 'Account updated successfully' };
	} catch (error) {
		console.error('Registration error:', error);
		return { message: 'Failed to register. Please try again.' };
	}
}
