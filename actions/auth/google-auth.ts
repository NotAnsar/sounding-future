'use server';

import { signIn } from '@/lib/auth';

export async function googleSignIn() {
	await signIn('google');
}
