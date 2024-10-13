'use client';

import { useFormStatus } from 'react-dom';
import { Button } from '../ui/button';
import { Loader } from 'lucide-react';

export default function SaveButton() {
	const { pending } = useFormStatus();
	return (
		<Button variant={'submit'} size={'submit'} disabled={pending}>
			{pending ? <Loader className='mr-2 h-4 w-4 animate-spin' /> : null} save
		</Button>
	);
}
