'use client';

import { loginGuest } from '@/actions/auth/login';
import { LoaderCircle } from 'lucide-react';
import { redirect } from 'next/navigation';
import { useEffect, useRef } from 'react';
import { useFormState } from 'react-dom';

export default function GuestLoginPage() {
	const [state, formAction] = useFormState(loginGuest, {});
	const hiddenButtonRef = useRef<HTMLButtonElement | null>(null);

	if (state?.message) {
		redirect(`/login?error=${encodeURIComponent(state.message)}`);
	}
	useEffect(() => {
		if (hiddenButtonRef.current) {
			hiddenButtonRef.current.click();
		}
	}, []);

	return (
		<div className='flex h-screen items-center justify-center'>
			<div className='text-center'>
				<h1 className='text-2xl font-bold mb-4'>Logging in as guest...</h1>
				<LoaderCircle className='animate-spin h-8 w-8 text-primary mx-auto' />
				<form action={formAction}>
					<button ref={hiddenButtonRef} className='hidden' type='submit' />
				</form>
			</div>
		</div>
	);
}
