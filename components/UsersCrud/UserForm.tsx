'use client';

import { useFormState } from 'react-dom';
import ErrorMessage from '@/components/ErrorMessage';
import ImageUpload from '@/components/profile/ImageUpload';
import SaveButton from '@/components/profile/SaveButton';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import { updateUser, UserFormState, addUser } from '@/actions/users';
import { Artist, User } from '@prisma/client';
import SelectInput from '../ui/select-input';
import { roles } from '@/config/roles';
import ProfileImageInput from '../settings/ProfileImageInput';
import { useEffect, useState } from 'react';

export default function UserForm({
	initialData,
	artistsData,
}: {
	initialData?: User;
	artistsData: Artist[];
}) {
	const isEdit = !!initialData?.id;
	const [formattedDate, setFormattedDate] = useState<string>('');

	const initialState: UserFormState = {
		message: null,
		errors: {},
		prev: { image: initialData?.image || undefined },
	};
	const [state, action] = useFormState(
		initialData?.id ? updateUser.bind(null, initialData?.id) : addUser,
		initialState
	);

	useEffect(() => {
		if (initialData?.emailVerified) {
			const date = new Date(initialData.emailVerified);
			setFormattedDate(date.toLocaleString());
		} else {
			setFormattedDate('Not verified');
		}
	}, [initialData?.emailVerified]);

	return (
		<form action={action} className='mt-4 sm:mt-8 grid '>
			<div className='w-full flex justify-end'>
				<SaveButton />
			</div>
			<div className='grid gap-4'>
				<ErrorMessage errors={state?.message ? [state?.message] : undefined} />

				{isEdit ? (
					<div className='grid gap-2'>
						<ProfileImageInput
							name='image'
							userFullName={initialData?.name}
							error={state?.errors?.image}
							initialData={initialData?.image || undefined}
						/>
						<ErrorMessage errors={state?.errors?.image} />
					</div>
				) : (
					<ImageUpload
						name='image'
						size='lg'
						error={state?.errors?.image}
						initialData={initialData?.image || undefined}
						label='Upload User Image '
						message='Upload User Image in jpg format'
						type='circle'
					/>
				)}

				<div className='grid gap-x-4 gap-y-2 sm:grid-cols-2 max-w-lg h-full'>
					<div className='grid gap-2 h-fit'>
						<Label
							htmlFor='name'
							className={cn(state?.errors?.name ? 'text-destructive' : '')}
						>
							Username *
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
					<div className='grid gap-2'>
						<Label
							htmlFor='role'
							className={cn(state?.errors?.role ? 'text-destructive' : '')}
						>
							Role *
						</Label>

						<SelectInput
							options={roles}
							initialValue={initialData?.role || undefined}
							name='role'
							placeholder='Select Role'
							searchPlaceholder='Search Role...'
							className='max-w-lg'
						/>

						<p className='text-muted text-sm max-w-lg'>
							Select role of the user
						</p>

						<ErrorMessage errors={state?.errors?.role} />
					</div>
				</div>

				<div className='grid gap-x-4 gap-y-2 sm:grid-cols-2 max-w-lg'>
					<div className='grid gap-2'>
						<Label
							htmlFor='f_name'
							className={cn(state?.errors?.f_name ? 'text-destructive' : '')}
						>
							First name
						</Label>
						<Input
							type='text'
							name='f_name'
							id='f_name'
							defaultValue={initialData?.f_name || undefined}
							className={cn(
								state?.errors?.f_name
									? 'border-destructive focus-visible:ring-destructive '
									: ''
							)}
						/>

						<ErrorMessage errors={state?.errors?.f_name} />
					</div>
					<div className='grid gap-2'>
						<Label
							htmlFor='l_name'
							className={cn(state?.errors?.l_name ? 'text-destructive' : '')}
						>
							Last name
						</Label>
						<Input
							type='text'
							name='l_name'
							id='l_name'
							defaultValue={initialData?.l_name || undefined}
							className={cn(
								state?.errors?.l_name
									? 'border-destructive focus-visible:ring-destructive '
									: ''
							)}
						/>

						<ErrorMessage errors={state?.errors?.l_name} />
					</div>
					<p className='text-muted text-sm max-w-lg col-span-full'>
						Your first and last name (will not be displayed publicly)
					</p>
				</div>

				<div className='grid gap-2'>
					<Label
						htmlFor='email'
						className={cn(state?.errors?.email ? 'text-destructive' : '')}
					>
						Email *
					</Label>
					<Input
						type='email'
						name='email'
						id='email'
						defaultValue={initialData?.email || undefined}
						className={cn(
							'max-w-lg ',
							state?.errors?.email
								? 'border-destructive focus-visible:ring-destructive '
								: ''
						)}
					/>

					<ErrorMessage errors={state?.errors?.email} />
				</div>

				<div className='grid gap-2 max-w-lg'>
					<Label
						htmlFor='emailVerified'
						className={cn(
							state?.errors?.emailVerified ? 'text-destructive' : ''
						)}
					>
						Email Verification Status
					</Label>

					<SelectInput
						options={[
							{ value: 'verified', label: 'Verified' },
							{ value: 'not_verified', label: 'Not Verified' },
						]}
						initialValue={
							initialData?.emailVerified ? 'verified' : 'not_verified'
						}
						name='emailVerified'
						placeholder='Select Verification Status'
						className='max-w-lg'
					/>

					{isEdit && formattedDate && (
						<p className='text-sm text-muted'>
							{initialData?.emailVerified
								? `Email verified: ${formattedDate}`
								: 'Email not verified'}
						</p>
					)}

					<ErrorMessage errors={state?.errors?.emailVerified} />
				</div>

				{!isEdit && (
					<div className='grid gap-2'>
						<Label
							htmlFor='password'
							className={cn(state?.errors?.password ? 'text-destructive' : '')}
						>
							Password *
						</Label>
						<Input
							type='password'
							name='password'
							id='password'
							defaultValue={initialData?.password || undefined}
							className={cn(
								'max-w-lg ',
								state?.errors?.password
									? 'border-destructive focus-visible:ring-destructive '
									: ''
							)}
						/>

						<ErrorMessage errors={state?.errors?.password} />
					</div>
				)}

				<div className='grid gap-2 max-w-lg'>
					<Label
						htmlFor='artistId'
						className={cn(state?.errors?.artistId ? 'text-destructive' : '')}
					>
						Associate with an Artist (Optional)
					</Label>

					<SelectInput
						name='artistId'
						options={artistsData.map((a) => ({ label: a.name, value: a.id }))}
						initialValue={initialData?.artistId || undefined}
						placeholder='Select Artist'
						searchPlaceholder='Search Artist...'
						emptyMessage='No Artist found.'
						className={cn(
							'max-w-lg',
							state?.errors?.artistId
								? 'border-destructive focus-visible:ring-destructive '
								: ''
						)}
					/>

					<p className='text-sm text-muted'>
						Select an artist to associate with this user. Only artists not
						linked to any user or linked to the current user are available.
					</p>

					<ErrorMessage errors={state?.errors?.artistId} />
				</div>
			</div>
		</form>
	);
}
