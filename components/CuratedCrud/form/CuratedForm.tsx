'use client';

import { toast } from '@/hooks/use-toast';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useFormState } from 'react-dom';
import ErrorMessage from '@/components/ErrorMessage';
import ImageUpload from '@/components/profile/ImageUpload';
import SaveButton from '@/components/profile/SaveButton';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { Globe, Facebook, Instagram, Linkedin, Youtube } from 'lucide-react';
import { addPartner } from '@/actions/curated';
import StudioImageUpload from '@/components/profile/StudioImageUpload';
import { SelectInput } from '@/components/ui/select-input';
import { countries } from '@/config/countries';

export default function CuratedForm() {
	const initialState = { message: null, errors: {} };
	const [state, action] = useFormState(addPartner, initialState);
	const router = useRouter();

	useEffect(() => {
		if (state.message === 'Partner Added successfully') {
			router.push('/');
			toast({ description: 'Partner Added successfully', title: 'Success' });
		}
	}, [state, router]);

	return (
		<form action={action} className='mt-4 sm:mt-8 grid '>
			<div className='w-full flex justify-end'>
				<SaveButton />
			</div>
			<div className='grid gap-4'>
				<ErrorMessage errors={state.message ? [state.message] : undefined} />

				<div className='grid gap-2'>
					<Label
						htmlFor='name'
						className={cn(state?.errors?.name ? 'text-destructive' : '')}
					>
						Partner name *
					</Label>
					<Input
						type='text'
						name='name'
						id='name'
						className={cn(
							'max-w-lg',
							state?.errors?.name
								? 'border-destructive focus-visible:ring-destructive '
								: ''
						)}
					/>

					<ErrorMessage errors={state?.errors?.name} />
				</div>
				<ImageUpload
					name='image'
					size='lg'
					error={state?.errors?.image}
					label='Upload Partner Image *'
					message='Upload Partner Image in jpg format'
					type='square'
				/>
				<div className='grid gap-2'>
					<Label
						htmlFor='info'
						className={cn(state?.errors?.info ? 'text-destructive' : '')}
					>
						Partner Info
					</Label>
					<Textarea
						className={cn(
							'max-w-lg min-h-48',
							state?.errors?.info
								? 'border-destructive focus-visible:ring-destructive '
								: ''
						)}
						name='info'
						id='info'
					/>
					<p className='text-muted text-sm max-w-lg'>
						Introduce your institution, association, ... briefly.
					</p>
					<ErrorMessage errors={state?.errors?.info} />
				</div>
				<div className='grid gap-2'>
					<Label
						htmlFor='country'
						className={cn(state?.errors?.country ? 'text-destructive' : '')}
					>
						Country *
					</Label>

					<SelectInput
						options={countries.map((c) => ({
							label: c.name,
							value: c.name,
							code: c.code,
						}))}
						name='country'
						placeholder='Select Country'
						searchPlaceholder='Search Country...'
						className='max-w-lg'
					/>

					<p className='text-muted text-sm max-w-lg'>
						Select country where partner is located
					</p>

					<ErrorMessage errors={state?.errors?.country} />
				</div>
				<StudioImageUpload
					name='studioPic'
					error={state?.errors?.studioPic}
					label='Upload Studio Image'
					message='Upload Studio Image in jpg format'
					type='square'
				/>
				<div className='grid gap-2 items-center'>
					<Label
						htmlFor='website'
						className={cn(state?.errors?.website ? 'text-destructive' : '')}
					>
						Website
					</Label>
					<div className='flex items-center max-w-lg'>
						<Globe className='mr-2' strokeWidth='1.5' />
						<Input
							type='text'
							name='website'
							id='website'
							className={cn(
								'flex-1',
								state?.errors?.website
									? 'border-destructive focus-visible:ring-destructive '
									: ''
							)}
						/>
					</div>
					<ErrorMessage errors={state?.errors?.website} />
				</div>
				<div className='grid gap-2 items-center'>
					<Label
						htmlFor='facebook'
						className={cn(state?.errors?.facebook ? 'text-destructive' : '')}
					>
						Facebook
					</Label>
					<div className='flex items-center max-w-lg'>
						<Facebook className='mr-2' strokeWidth='1.5' />
						<Input
							type='text'
							name='facebook'
							id='facebook'
							className={cn(
								'flex-1',
								state?.errors?.facebook
									? 'border-destructive focus-visible:ring-destructive '
									: ''
							)}
						/>
					</div>
					<ErrorMessage errors={state?.errors?.facebook} />
				</div>
				<div className='grid gap-2 items-center'>
					<Label
						htmlFor='instagram'
						className={cn(state?.errors?.instagram ? 'text-destructive' : '')}
					>
						Instagram
					</Label>
					<div className='flex items-center max-w-lg'>
						<Instagram className='mr-2' strokeWidth='1.5' />
						<Input
							type='text'
							name='instagram'
							id='instagram'
							className={cn(
								'flex-1',
								state?.errors?.instagram
									? 'border-destructive focus-visible:ring-destructive '
									: ''
							)}
						/>
					</div>
					<ErrorMessage errors={state?.errors?.instagram} />
				</div>

				<div className='grid gap-2 items-center'>
					<Label
						htmlFor='linkedin'
						className={cn(state?.errors?.linkedin ? 'text-destructive' : '')}
					>
						LinkedIn
					</Label>
					<div className='flex items-center max-w-lg'>
						<Linkedin className='mr-2 ' strokeWidth='1.5' />
						<Input
							type='text'
							name='linkedin'
							id='linkedin'
							className={cn(
								'flex-1',
								state?.errors?.linkedin
									? 'border-destructive focus-visible:ring-destructive '
									: ''
							)}
						/>
					</div>
					<ErrorMessage errors={state?.errors?.linkedin} />
				</div>
				<div className='grid gap-2 items-center'>
					<Label
						htmlFor='youtube'
						className={cn(state?.errors?.youtube ? 'text-destructive' : '')}
					>
						YouTube
					</Label>
					<div className='flex items-center max-w-lg'>
						<Youtube className='mr-2' strokeWidth='1.5' />
						<Input
							type='text'
							name='youtube'
							id='youtube'
							className={cn(
								'flex-1',
								state?.errors?.youtube
									? 'border-destructive focus-visible:ring-destructive '
									: ''
							)}
						/>
					</div>
					<ErrorMessage errors={state?.errors?.youtube} />
				</div>
			</div>
		</form>
	);
}
