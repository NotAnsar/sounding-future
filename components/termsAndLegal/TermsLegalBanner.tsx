'use client';

import { LEGAL_NAV } from '@/config/legal';
import { notFound, usePathname } from 'next/navigation';
import React from 'react';

export default function TermsLegalBanner() {
	const path = usePathname();
	const nav = LEGAL_NAV.find((l) => l.href === path);

	if (!nav) {
		notFound();
	}

	return (
		<div
			className='w-full flex gap-4 p-4 rounded-3xl text-white h-auto min-h-40 sm:min-h-48 md:min-h-52 xl:min-h-60 relative'
			style={{
				background: '#cc2b5e',
				backgroundImage: 'linear-gradient(to right, #753a88, #cc2b5e)',
			}}
		>
			<h2 className='text-[36px] leading-tight mb-0 sm:text-5xl sm:leading-none xl:text-6xl font-bold mt-auto sm:mb-2 md:pl-4'>
				{nav?.label}
			</h2>
		</div>
	);
}
