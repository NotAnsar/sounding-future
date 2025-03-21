'use client';

import { useFormStatus } from 'react-dom';
import { Button } from '../ui/button';
import { Loader } from 'lucide-react';

export default function SaveButton({
	className,
	children,
}: {
	className?: string;
	children: React.ReactNode;
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
			{children}
		</Button>
	);
}
