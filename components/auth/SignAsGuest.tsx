'use client';

import Link from 'next/link';
import React from 'react';

export default function SignAsGuest() {
	return (
		<p className='px-8 text-center font-semibold'>
			{'Or Just Join as a '}
			<Link
				href='/login-guest'
				className='text-primary-foreground hover:underline'
			>
				Test User
			</Link>
		</p>
	);
}
