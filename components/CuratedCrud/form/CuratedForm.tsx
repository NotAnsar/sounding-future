'use client';

import { useFormState } from 'react-dom';
import ErrorMessage from '@/components/ErrorMessage';
import ImageUpload from '@/components/profile/ImageUpload';
import SaveButton from '@/components/profile/SaveButton';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import {
	Globe,
	Facebook,
	Instagram,
	Linkedin,
	Youtube,
	Clock,
} from 'lucide-react';
import { addPartner, PartnerFormState, updatePartner } from '@/actions/curated';
import StudioImageUpload from '@/components/profile/StudioImageUpload';
import { SelectInput } from '@/components/ui/select-input';
import { countries } from '@/config/countries';
import { PartnerLinks } from '@/db/partner';
import { Switch } from '@/components/ui/switch';

export default function CuratedForm({
	initialData,
}: {
	initialData?: PartnerLinks;
}) {
	const initialState: PartnerFormState = {
		message: null,
		errors: {},
		prev: {
			image: initialData?.picture,
			studioPic: initialData?.studioPic || undefined,
		},
	};
	const [state, action] = useFormState(
		initialData?.id ? updatePartner.bind(null, initialData?.id) : addPartner,
		initialState
	);

	return (
		<form action={action} className='mt-4 sm:mt-8 grid '>
			<div className='w-full flex justify-end'>
				<SaveButton />
			</div>
			<div className='grid gap-4'>
				<ErrorMessage errors={state?.message ? [state?.message] : undefined} />

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
						defaultValue={initialData?.name || undefined}
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
					initialData={initialData?.picture || undefined}
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
							'max-w-lg min-h-80',
							state?.errors?.info
								? 'border-destructive focus-visible:ring-destructive '
								: ''
						)}
						defaultValue={initialData?.bio || undefined}
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
						initialValue={initialData?.country || undefined}
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
					initialData={initialData?.studioPic || undefined}
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
							defaultValue={initialData?.socialLinks?.website || undefined}
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
							defaultValue={initialData?.socialLinks?.facebook || undefined}
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
							defaultValue={initialData?.socialLinks?.instagram || undefined}
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
							defaultValue={initialData?.socialLinks?.linkedin || undefined}
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
							defaultValue={initialData?.socialLinks?.youtube || undefined}
							className={cn(
								'flex-1',
								state?.errors?.youtube
									? 'border-destructive focus-visible:ring-destructive '
									: ''
							)}
						/>
					</div>

					<div className='mt-4 p-4 border rounded-md bg-transparent max-w-lg'>
						<div className='flex items-start gap-3'>
							<div className='mt-0.5 text-muted'>
								<Clock className='h-5 w-5' />
							</div>
							<div className='flex-1 space-y-2'>
								<div className='flex items-center justify-between'>
									<div className='flex items-center gap-3'>
										<Label
											htmlFor='inProgress'
											className='text-base font-medium'
										>
											Partner Development Status
										</Label>
										{initialData?.inProgress && (
											<span className='text-xs px-2 py-0.5 rounded-full bg-amber-100 text-amber-800 border border-amber-200 font-medium'>
												In Progress
											</span>
										)}
									</div>
									<Switch
										id='inProgress'
										name='inProgress'
										defaultChecked={initialData?.inProgress || false}
										value='true'
									/>
								</div>
								<p className='text-muted-foreground text-sm'>
									{`Toggle this if the partner profile is still being developed and should be marked as "In Progress" in the system.`}
								</p>
							</div>
						</div>
					</div>
					<ErrorMessage errors={state?.errors?.youtube} />
				</div>
			</div>
		</form>
	);
}
