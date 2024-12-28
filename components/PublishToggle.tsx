import { useState, useId } from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Music } from 'lucide-react';
import { cn } from '@/lib/utils';

interface PublishToggleProps {
	defaultChecked?: boolean;
	onToggle?: (isPublished: boolean) => void;
	label?: string;
	name?: string;
	disabled?: boolean;
	className?: string;
}

export function PublishToggle({
	defaultChecked = false,
	onToggle,
	label = 'Track',
	disabled = false,
	name = 'published',
	className,
}: PublishToggleProps) {
	const [isPublished, setIsPublished] = useState<boolean>(defaultChecked);
	const id = useId();

	const handleToggle = (checked: boolean) => {
		setIsPublished(checked);
		onToggle?.(checked);
	};

	return (
		<div
			className={cn(
				'flex items-center justify-between gap-4 w-full max-w-sm p-4 rounded-lg border',
				className
			)}
		>
			<div className='flex items-center gap-3'>
				<Music className='h-5 w-5 text-gray-500' />
				<div className='space-y-1'>
					<Label htmlFor={id}>Publish {label}</Label>
					<p className='text-sm text-gray-500' id={`${id}-description`}>
						{isPublished ? `${label} is public` : `${label} is private`}
					</p>
				</div>
			</div>
			<div className='flex flex-col items-end gap-1'>
				<Switch
					id={id}
					// name='published'
					checked={isPublished}
					onCheckedChange={handleToggle}
					// onChange={(e) => console.log('')}
					disabled={disabled}
					aria-describedby={`${id}-description`}
				/>
				<span className='text-xs text-gray-500'>
					{isPublished ? 'Public' : 'Private'}
				</span>
			</div>
			<input type='hidden' name={name} value={isPublished ? 'true' : 'false'} />
		</div>
	);
}
