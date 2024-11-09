import React from 'react';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import ErrorMessage from '@/components/ErrorMessage';

interface ReleaseSelectorProps {
	errors?: string[];
}

export default function ReleaseSelector({ errors }: ReleaseSelectorProps) {
	const [selectedType, setSelectedType] = React.useState<
		'self-published' | 'label'
	>('self-published');
	const [labelName, setLabelName] = React.useState('');

	const handleTypeChange = (value: string) => {
		const type = value as 'self-published' | 'label';
		setSelectedType(type);
	};

	return (
		<div className='grid gap-2'>
			<Label
				htmlFor='release'
				className={cn('mb-2', errors ? 'text-destructive' : '')}
			>
				Release *
			</Label>

			<RadioGroup
				// name='release'
				defaultValue='self-published'
				onValueChange={handleTypeChange}
				className='space-y-2'
			>
				<div className='flex items-center space-x-2'>
					<RadioGroupItem
						value='self-published'
						id='self-published'
						className={cn(errors ? 'border-destructive' : '')}
					/>
					<Label htmlFor='self-published' className='text-gray-300 font-medium'>
						Self Published
					</Label>
				</div>

				<div className='flex items-center space-x-2 h-9'>
					<RadioGroupItem
						value='label'
						id='label'
						className={cn(errors ? 'border-destructive' : '')}
					/>
					<Label
						htmlFor='label'
						className='text-gray-300 font-medium text-nowrap'
					>
						By Label
					</Label>
					{selectedType === 'label' && (
						<Input
							name='release'
							value={labelName}
							onChange={(e) => setLabelName(e.target.value)}
							placeholder='label name'
							className={cn(
								errors
									? 'border-destructive focus-visible:ring-destructive'
									: ''
							)}
						/>
					)}
				</div>
			</RadioGroup>

			<p className='text-muted text-sm'>Choose how your track was released.</p>

			<ErrorMessage errors={errors} />

			<input
				type='hidden'
				name='release'
				value={selectedType === 'self-published' ? 'self-published' : labelName}
			/>
		</div>
	);
}
