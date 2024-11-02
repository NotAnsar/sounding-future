import { useFormStatus } from 'react-dom';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Loader } from 'lucide-react';

export function SubmitButton({
	children,
	className,
	disabled = false,
	...props
}: {
	children: React.ReactNode;
	className?: string;
	disabled?: boolean;
} & React.ComponentPropsWithoutRef<typeof Button>) {
	const { pending } = useFormStatus();

	return (
		<Button
			type='submit'
			size='xl'
			disabled={disabled || pending}
			className={cn('flex items-center font-semibold text-[15px]', className)}
			{...props}
		>
			{pending ? <Loader className='mr-2 h-4 w-4 animate-spin' /> : null}
			{children}
		</Button>
	);
}
