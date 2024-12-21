'use client';
import { cn } from '@/lib/utils';
import React from 'react';
import { useFormStatus } from 'react-dom';

import { Loader } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

export default function ArtistNav({
	step = 1,
	id,
}: {
	id?: string;
	step?: number;
}) {
	return (
		<div className='flex flex-col sm:flex-row sm:items-center w-full gap-2 justify-between'>
			<ol className='flex items-center w-full text-sm font-medium text-center text-muted sm:text-base max-w-sm'>
				<Link
					href={id ? `/user/artists/edit/${id}` : '#'}
					className={`flex md:w-full items-center after:content-[''] after:w-full after:h-1 after:border-b after:border-muted after:border-1 after:hidden md:after:inline-block after:mx-3  `}
				>
					<span
						className={cn(
							"flex items-center after:content-['/'] md:after:hidden after:mx-2 after:text-gray-200 dark:after:text-gray-500 text-nowrap",
							step === 1 && 'text-primary'
						)}
					>
						<ConfirmSvg />
						Artist Info
					</span>
				</Link>

				<Link
					href={id ? `/user/artists/links/${id}` : '#'}
					className='flex items-center'
				>
					<span
						className={cn(
							'flex items-center text-nowrap',
							step === 2 && 'text-primary'
						)}
					>
						{step >= 2 ? <ConfirmSvg /> : <span className='me-2'>2</span>}
						Artist Links
					</span>
				</Link>
			</ol>

			<SaveButton className='w-full sm:w-auto' step={step} />
		</div>
	);
}

function SaveButton({
	className,
	step = 1,
}: {
	className?: string;
	step?: number;
	isAdmin?: boolean;
}) {
	const { pending } = useFormStatus();

	return (
		<Button
			variant={'submit'}
			size={'submit'}
			disabled={pending}
			className={className}
		>
			{pending ? <Loader className='mr-2 h-4 w-4 animate-spin' /> : null}{' '}
			{step === 1 ? `Save & go next` : `Save`}
		</Button>
	);
}

function ConfirmSvg() {
	return (
		<svg
			className='w-3.5 h-3.5 sm:w-4 sm:h-4 me-2.5'
			aria-hidden='true'
			xmlns='http://www.w3.org/2000/svg'
			fill='currentColor'
			viewBox='0 0 20 20'
		>
			<path d='M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z' />
		</svg>
	);
}
