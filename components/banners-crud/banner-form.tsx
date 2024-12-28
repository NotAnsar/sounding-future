'use client';

import { useFormState } from 'react-dom';
import ErrorMessage from '@/components/ErrorMessage';
import SaveButton from '@/components/profile/SaveButton';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import StudioImageUpload from '@/components/profile/StudioImageUpload';
import { Banner } from '@prisma/client';
import {
	BannerState,
	updateBanner,
	createBanner,
} from '@/actions/banner-action';
import { useState } from 'react';
import { PublishToggle } from '../PublishToggle';

export default function BannerForm({ initialData }: { initialData?: Banner }) {
	const initialState: BannerState = {
		message: null,
		errors: {},
		prev: {
			backgroundImage: initialData?.backgroundImage || undefined,
		},
	};
	const [state, action] = useFormState(
		initialData?.id ? updateBanner.bind(null, initialData?.id) : createBanner,
		initialState
	);

	const [backgroundColor, setBackgroundColor] = useState(
		initialData?.backgroundColor || '#481B95'
	);

	const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		let value = e.target.value;
		if (value.length === 4) {
			value = `#${value[1]}${value[1]}${value[2]}${value[2]}${value[3]}${value[3]}`;
		}
		setBackgroundColor(value);
	};

	return (
		<form action={action} className='mt-4 sm:mt-8 grid '>
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
							'max-w-lg',
							state?.errors?.title
								? 'border-destructive focus-visible:ring-destructive '
								: ''
						)}
					/>

					<ErrorMessage errors={state?.errors?.title} />
				</div>

				<div className='grid gap-2'>
					<Label
						htmlFor='description'
						className={cn(state?.errors?.description ? 'text-destructive' : '')}
					>
						Description
					</Label>
					<Textarea
						className={cn(
							'max-w-lg min-h-80',
							state?.errors?.description
								? 'border-destructive focus-visible:ring-destructive '
								: ''
						)}
						defaultValue={initialData?.description || undefined}
						name='description'
						id='description'
					/>

					<ErrorMessage errors={state?.errors?.description} />
				</div>

				<div className='grid gap-2'>
					<Label htmlFor='backgroundColor'>Background Color</Label>
					<div className='flex gap-2 items-center'>
						<Input
							type='color'
							id='backgroundColor'
							value={backgroundColor}
							onChange={handleColorChange}
							className={cn(
								'w-14 h-10 p-1',
								state?.errors?.backgroundColor
									? 'border-destructive focus-visible:ring-destructive '
									: ''
							)}
						/>
						<Input
							type='text'
							name='backgroundColor'
							value={backgroundColor}
							onChange={handleColorChange}
							className={cn(
								'flex-1',
								state?.errors?.backgroundColor
									? 'border-destructive focus-visible:ring-destructive '
									: ''
							)}
						/>
					</div>
					<ErrorMessage errors={state?.errors?.backgroundColor} />
				</div>

				<StudioImageUpload
					name='backgroundImage'
					error={state?.errors?.backgroundImage}
					label='Upload Background Image'
					type='square'
					initialData={initialData?.backgroundImage || undefined}
					message='Upload Background image, max. 2mb'
				/>
				<div className='grid gap-2 items-center'>
					<Label
						htmlFor='buttonText'
						className={cn(state?.errors?.buttonText ? 'text-destructive' : '')}
					>
						Button Text
					</Label>

					<Input
						type='text'
						name='buttonText'
						id='buttonText'
						defaultValue={initialData?.buttonText || undefined}
						className={cn(
							state?.errors?.buttonText
								? 'border-destructive focus-visible:ring-destructive '
								: ''
						)}
					/>

					<ErrorMessage errors={state?.errors?.link} />
				</div>
				<div className='grid gap-2 items-center'>
					<Label
						htmlFor='link'
						className={cn(state?.errors?.link ? 'text-destructive' : '')}
					>
						Button Link
					</Label>

					<Input
						type='text'
						name='link'
						id='link'
						defaultValue={initialData?.link || undefined}
						className={cn(
							state?.errors?.link
								? 'border-destructive focus-visible:ring-destructive '
								: ''
						)}
					/>

					<ErrorMessage errors={state?.errors?.link} />
				</div>

				<PublishToggle
					defaultChecked={initialData?.published}
					label='Banner'
					className='max-w-lg'
				/>
			</div>
		</form>
	);
}
