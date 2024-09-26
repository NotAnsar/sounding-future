export default function ErrorMessage({
	errors,
	className,
}: {
	errors?: string[] | undefined;
	className?: string;
}) {
	return (
		<div className={className}>
			{errors &&
				errors.map((error: string) => (
					<p className='text-sm font-medium text-destructive' key={error}>
						{error}
					</p>
				))}
		</div>
	);
}
