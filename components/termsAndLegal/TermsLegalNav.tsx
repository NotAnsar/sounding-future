'use client';
import { LEGAL_NAV } from '@/config/legal';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import React from 'react';

export default function TermsLegalNav() {
	const path = usePathname();
	return (
		<div className='flex w-fit gap-2 sm:gap-4 bg-background text-white justify-start'>
			{LEGAL_NAV.map((l) => (
				<Link
					href={l.href}
					className={cn(
						'inline-flex text-sm ring-0 sm:text-base px-2 py-1.5 sm:px-3 sm:py-1.5 items-center justify-center whitespace-nowrap rounded-md font-medium transition-all focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 border border-foreground/60 text-foreground',
						l.href === path &&
							'border-foreground/20 bg-button text-white shadow'
					)}
					key={l.href}
				>
					{l.label}
				</Link>
			))}
		</div>
	);
}


