'use server';

import { z } from 'zod';
import { getEmailString, sendEmail } from '@/lib/email';

const ContactSchema = z.object({
	lastName: z.string().min(1, 'Last Name is required'),
	firstName: z.string().min(1, 'First Name is required'),
	email: z.string().email('Invalid email address'),
	subject: z.string().min(1, 'Subject is required'),
	message: z.string().min(10, 'Message must be at least 10 characters long'),
});

type ContactFormData = z.infer<typeof ContactSchema>;

export interface ContactState {
	message: string | null;
	errors?: { [K in keyof ContactFormData]?: string[] };
	success?: boolean;
}

export async function submitContact(
	prevState: ContactState,
	formData: FormData
): Promise<ContactState> {
	const validatedFields = ContactSchema.safeParse({
		firstName: formData.get('firstName'),
		lastName: formData.get('lastName'),
		email: formData.get('email'),
		subject: formData.get('subject'),
		message: formData.get('message'),
	});

	if (!validatedFields.success) {
		return {
			message: 'Validation failed',
			errors: validatedFields.error.flatten().fieldErrors,
			success: false,
		};
	}

	const { firstName, lastName, email, subject, message } = validatedFields.data;
	const name = `${firstName} ${lastName}`;

	try {
		await sendEmail({
			subject: `Contact submission From Sounding Future : ${subject}`,
			body: getEmailString(subject, name, message, email),
			name,
			from: email,
		});

		return { message: 'Message sent successfully!', success: true };
	} catch (error) {
		console.error('Failed to send email:', error);
		return {
			message: 'Failed to send message. Please try again later.',
			success: false,
		};
	}
}
