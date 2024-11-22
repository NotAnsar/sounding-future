'use client';
import { cn } from '@/lib/utils';
import React from 'react';
import { useFormStatus } from 'react-dom';

import { Loader } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';

export default function TrackNavUpload({
	step = 1,
	isAdmin = false,
	id,
}: {
	id?: string;
	step?: number;
	isAdmin?: boolean;
}) {
	return (
		<div className='flex flex-col sm:flex-row items-center w-full gap-2 justify-between'>
			<ol className='flex items-center w-full text-sm font-medium text-center text-muted sm:text-base max-w-screen-sm'>
				<Link
					href={id ? `/user/tracks/upload/${id}` : '#'}
					className={`flex md:w-full items-center after:content-[''] after:w-full after:h-1 after:border-b after:border-muted after:border-1 after:hidden md:after:inline-block after:mx-3  `}
				>
					<span
						className={cn(
							"flex items-center after:content-['/'] md:after:hidden after:mx-2 after:text-gray-200 dark:after:text-gray-500 ",
							step === 1 && 'text-primary'
						)}
					>
						<ConfirmSvg />
						<span className='hidden sm:inline-flex sm:me-2'>
							{'Track '}
						</span>{' '}
						Basics
					</span>
				</Link>
				<Link
					href={id ? `/user/tracks/upload/${id}/info` : '#'}
					className="flex md:w-full items-center after:content-[''] after:w-full after:h-1 after:border-b after:border-muted after:border-1 after:hidden md:after:inline-block after:mx-3 "
				>
					<span
						className={cn(
							"flex items-center after:content-['/'] md:after:hidden after:mx-2 after:text-gray-200 dark:after:text-gray-500 md:me-2",
							step === 2 && 'text-primary'
						)}
					>
						{step >= 2 ? <ConfirmSvg /> : <span className='me-2'>2</span>}
						<span className='hidden sm:inline-flex me-2'>Track</span> Info
					</span>
				</Link>
				<Link
					href={id ? `/user/tracks/upload/${id}/audio` : '#'}
					className='flex items-center'
				>
					<span
						className={cn(
							'flex items-center text-nowrap',
							step === 3 && 'text-primary'
						)}
					>
						{step >= 3 ? <ConfirmSvg /> : <span className='me-2'>3</span>}
						Audio File
					</span>
				</Link>
			</ol>

			<SaveButton className='w-full sm:w-auto' step={step} isAdmin={isAdmin} />
		</div>
	);
}

function SaveButton({
	className,
	step = 1,
	isAdmin,
}: {
	className?: string;
	step?: number;
	isAdmin?: boolean;
}) {
	const { pending } = useFormStatus();

	if (step >= 3 && !isAdmin) return null;

	return (
		<Button
			variant={'submit'}
			size={'submit'}
			disabled={pending}
			className={className}
			onClick={() => {
				if (step >= 3 && isAdmin) {
					toast({
						description:
							'Thank you for your patience. Uploading tracks may take some time.',
					});
				}
			}}
		>
			{pending ? <Loader className='mr-2 h-4 w-4 animate-spin' /> : null}{' '}
			{`Save & go next`}
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
