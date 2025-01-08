'use client';

import { useEffect, useState } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useFormState } from 'react-dom';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { SubscriptionCard } from '@prisma/client';
import ErrorMessage from '../ErrorMessage';
import {
	SubscriptionCardState,
	updateSubscriptionCard,
} from '@/actions/pages/Subscription-card';
import SaveButton from '../profile/SaveButton';
import { useRouter } from 'next/navigation';

export function SubscriptionForm({
	initialData,
}: {
	initialData?: SubscriptionCard;
	className?: string;
}) {
	const initialState: SubscriptionCardState = { message: null, errors: {} };
	const [state, action] = useFormState(updateSubscriptionCard, initialState);
	const [reasons, setReasons] = useState<string[]>(initialData?.reasons || []);
	const router = useRouter();

	useEffect(() => {
		if (!state) return;

		if (state.success !== undefined) {
			router.push('/support-us');
			toast({
				variant: state.success ? 'default' : 'destructive',
				title: state.success ? 'Success' : 'Error',
				description: state.success
					? 'Subscription Card updated successfully'
					: state.message || 'Failed to update Subscription Card',
			});
		}
	}, [state, router]);

	const addReason = () => {
		setReasons([...reasons, '']);
	};

	const removeReason = (index: number) => {
		setReasons(reasons.filter((_, i) => i !== index));
	};

	const updateReason = (index: number, value: string) => {
		const newItems = [...reasons];
		newItems[index] = value;
		setReasons(newItems);
	};

	return (
		<form action={action} className='mt-4 grid'>
			<div className='w-full flex justify-end'>
				<SaveButton />
			</div>
			<div className='grid gap-4 max-w-lg'>
				<ErrorMessage errors={state?.message ? [state?.message] : undefined} />

				<div className='grid gap-2'>
					<Label
						htmlFor='title'
						className={cn(state?.errors?.title ? 'text-destructive' : '')}
					>
						Title
					</Label>

					<Input
						type='text'
						name='title'
						id='title'
						defaultValue={initialData?.title || undefined}
						className={cn(
							'flex-1',
							state?.errors?.title
								? 'border-destructive focus-visible:ring-destructive'
								: ''
						)}
						required
					/>

					<ErrorMessage errors={state?.errors?.title} />
				</div>

				<div className='grid gap-2'>
					<Label
						htmlFor='subtitle'
						className={cn(state?.errors?.subtitle ? 'text-destructive' : '')}
					>
						Subtitle
					</Label>

					<Input
						type='text'
						name='subtitle'
						id='subtitle'
						defaultValue={initialData?.subtitle || undefined}
						className={cn(
							'flex-1',
							state?.errors?.subtitle
								? 'border-destructive focus-visible:ring-destructive'
								: ''
						)}
					/>

					<ErrorMessage errors={state?.errors?.subtitle} />
				</div>

				<div className='grid gap-2'>
					<Label
						htmlFor='priceInfo'
						className={cn(state?.errors?.priceInfo ? 'text-destructive' : '')}
					>
						Price Information
					</Label>

					<Input
						type='text'
						name='priceInfo'
						id='priceInfo'
						defaultValue={initialData?.priceInfo || undefined}
						className={cn(
							'flex-1',
							state?.errors?.priceInfo
								? 'border-destructive focus-visible:ring-destructive'
								: ''
						)}
						required
					/>

					<ErrorMessage errors={state?.errors?.priceInfo} />
				</div>

				<div className='grid gap-2'>
					<Label
						htmlFor='reasonsTitle'
						className={cn(
							state?.errors?.reasonsTitle ? 'text-destructive' : ''
						)}
					>
						Reasons Title
					</Label>

					<Input
						type='text'
						name='reasonsTitle'
						id='reasonsTitle'
						defaultValue={initialData?.reasonsTitle || undefined}
						className={cn(
							'flex-1',
							state?.errors?.reasonsTitle
								? 'border-destructive focus-visible:ring-destructive'
								: ''
						)}
						required
					/>

					<ErrorMessage errors={state?.errors?.reasonsTitle} />
				</div>

				<div className='grid gap-2'>
					<Label
						className={cn(state?.errors?.reasons ? 'text-destructive' : '')}
					>
						Items
					</Label>
					{reasons.map((item, index) => (
						<div key={index} className='flex gap-2'>
							<Input
								name='reasons'
								value={item}
								onChange={(e) => updateReason(index, e.target.value)}
								className={cn(
									state?.errors?.reasons
										? 'border-destructive focus-visible:ring-destructive'
										: ''
								)}
							/>
							<Button
								type='button'
								variant='outline'
								size='icon'
								onClick={() => removeReason(index)}
								className='shrink-0'
							>
								<X className='h-4 w-4' />
							</Button>
						</div>
					))}
					<Button type='button' variant='outline' onClick={addReason}>
						Add Reasons
					</Button>
					<ErrorMessage errors={state?.errors?.reasons} />
				</div>

				<div className='grid gap-2'>
					<Label
						htmlFor='footer'
						className={cn(state?.errors?.footer ? 'text-destructive' : '')}
					>
						Footer Text
					</Label>

					<Input
						type='text'
						name='footer'
						id='footer'
						defaultValue={initialData?.footer || undefined}
						className={cn(
							'flex-1',
							state?.errors?.footer
								? 'border-destructive focus-visible:ring-destructive'
								: ''
						)}
					/>

					<ErrorMessage errors={state?.errors?.footer} />
				</div>
			</div>
		</form>
	);
}
