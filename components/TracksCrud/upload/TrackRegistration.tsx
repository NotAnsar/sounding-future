import React from 'react';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import ErrorMessage from '@/components/ErrorMessage';

interface TrackRegistrationProps {
	initialValue?: string;
	errors?: string[];
}

export default function TrackRegistration({
	errors,
	initialValue,
}: TrackRegistrationProps) {
	const isRegistered = initialValue !== undefined && initialValue !== '';
	const [selectedType, setSelectedType] = React.useState<'yes' | 'no'>(
		isRegistered ? 'yes' : 'no'
	);
	const [organization, setOrganization] = React.useState(
		isRegistered ? initialValue || '' : ''
	);

	const handleTypeChange = (value: string) => {
		const type = value as 'yes' | 'no';
		setSelectedType(type);
		if (type === 'no') {
			setOrganization('');
		}
	};

	return (
		<div className='grid gap-2'>
			<Label
				htmlFor='track-registration'
				className={cn('mb-2', errors ? 'text-destructive' : '')}
			>
				Track Registration *
			</Label>

			<RadioGroup
				defaultValue={selectedType}
				onValueChange={handleTypeChange}
				className='space-y-2'
			>
				<div className='flex items-center space-x-2'>
					<RadioGroupItem
						value='no'
						id='no'
						className={cn(errors ? 'border-destructive' : '')}
					/>
					<Label htmlFor='no' className='text-muted font-medium'>
						No
					</Label>
				</div>

				<div className='flex items-center space-x-2 h-9'>
					<RadioGroupItem
						value='yes'
						id='yes'
						className={cn(errors ? 'border-destructive' : '')}
					/>
					<Label htmlFor='yes' className='text-muted font-medium text-nowrap'>
						Yes
					</Label>
					{selectedType === 'yes' && (
						<Input
							name='registration-org'
							value={organization}
							onChange={(e) => setOrganization(e.target.value)}
							placeholder='Performance Rights Organization'
							className={cn(
								errors
									? 'border-destructive focus-visible:ring-destructive'
									: ''
							)}
						/>
					)}
				</div>
			</RadioGroup>

			<p className='text-muted text-sm'>
				Is this track registered with any performance rights organization or
				collecting society (e.g., AKM, GEMA, SUISA, SACEM, etc.)?
			</p>

			<ErrorMessage errors={errors} />

			<input
				type='hidden'
				name='trackRegistration'
				value={selectedType === 'yes' ? organization : 'NOT_REGISTERED'}
			/>
		</div>
	);
}
