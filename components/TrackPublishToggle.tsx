import { useState, useId } from 'react';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Music } from 'lucide-react';

interface TrackPublishToggleProps {
	defaultChecked?: boolean;
	onToggle?: (isPublished: boolean) => void;
	label?: string;
	name?: string;
	disabled?: boolean;
}

export function TrackPublishToggle({
	defaultChecked = false,
	onToggle,
	label = 'Publish Track',
	disabled = false,
	name = 'published',
}: TrackPublishToggleProps) {
	const [isPublished, setIsPublished] = useState<boolean>(defaultChecked);
	const id = useId();

	const handleToggle = (checked: boolean) => {
		setIsPublished(checked);
		onToggle?.(checked);
	};

	return (
		<div className='flex items-center justify-between gap-4 w-full max-w-sm p-4 rounded-lg border'>
			<div className='flex items-center gap-3'>
				<Music className='h-5 w-5 text-gray-500' />
				<div className='space-y-1'>
					<Label htmlFor={id}>{label}</Label>
					<p className='text-sm text-gray-500' id={`${id}-description`}>
						{isPublished ? 'Track is public' : 'Track is private'}
					</p>
				</div>
			</div>
			<div className='flex flex-col items-end gap-1'>
				<Switch
					id={id}
					// name='published'
					checked={isPublished}
					onCheckedChange={handleToggle}
					onChange={(e) => console.log(e.currentTarget.value)}
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
