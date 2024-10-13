'use client';
import { logOut } from '@/actions/auth/logOut';
import { useAudio } from '@/context/AudioContext';
import { Loader, LogOut as LogOutIcon } from 'lucide-react';
import React from 'react';
import { useFormStatus } from 'react-dom';

export default function LogOutButton() {
	const { resetAudio } = useAudio();

	const handleLogout = async () => {
		resetAudio();
		await logOut();
	};

	return (
		<form className='w-full relative' action={handleLogout}>
			<SubmitButton />
		</form>
	);
}

function SubmitButton() {
	const { pending } = useFormStatus();

	return (
		<button type='submit' className='p-2 w-full text-left flex items-center'>
			{pending ? (
				<Loader className='mr-2 h-4 w-4 animate-spin' />
			) : (
				<LogOutIcon className='w-4 h-auto mr-2' />
			)}
			Log Out
		</button>
	);
}
