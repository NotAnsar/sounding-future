import { cn } from '@/lib/utils';

export default function ErrorMessage({
	errors,
	className,
	classNameParent,
}: {
	errors?: string[] | undefined;
	className?: string;
	classNameParent?: string;
}) {
	return (
		<div className={classNameParent}>
			{errors &&
				errors.map((error: string, i) => (
					<p
						className={cn('text-sm font-medium text-destructive', className)}
						key={`${error}_${i}`}
					>
						{error}
					</p>
				))}
		</div>
	);
}
