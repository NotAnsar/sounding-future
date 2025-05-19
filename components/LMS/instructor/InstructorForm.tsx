'use client';

import { useFormState } from 'react-dom';
import ErrorMessage from '@/components/ErrorMessage';
import SaveButton from '@/components/profile/SaveButton';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { Instructor } from '@prisma/client';
import { PublishToggle } from '@/components/PublishToggle';
import {
	InstructorFormState,
	addInstructor,
	updateInstructor,
} from '@/actions/lms/instructor-action';
import ImageUpload from '@/components/profile/ImageUpload';

export default function InstructorForm({
	initialData,
}: {
	initialData?: Instructor;
}) {
	const initialState: InstructorFormState = { message: null, errors: {} };
	const [state, action] = useFormState(
		initialData?.id
			? updateInstructor.bind(null, initialData?.id)
			: addInstructor,
		initialState
	);

	return (
		<form action={action} className='mt-4 sm:mt-8 grid'>
			<div className='w-full flex justify-end'>
				<SaveButton />
			</div>
			<div className='grid gap-4 max-w-lg'>
				<ErrorMessage errors={state?.message ? [state?.message] : undefined} />

				<div className='grid gap-2'>
					<Label
						htmlFor='name'
						className={cn(state?.errors?.name ? 'text-destructive' : '')}
					>
						Instructor Name
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
					<p className='text-muted-foreground text-sm'>
						Add the name of the instructor
					</p>
					<ErrorMessage errors={state?.errors?.name} />
				</div>

				<div className='grid gap-2'>
					<Label
						htmlFor='bio'
						className={cn(state?.errors?.bio ? 'text-destructive' : '')}
					>
						Biography
					</Label>
					<Textarea
						className={cn(
							'max-w-lg min-h-40',
							state?.errors?.bio
								? 'border-destructive focus-visible:ring-destructive '
								: ''
						)}
						defaultValue={initialData?.bio || undefined}
						name='bio'
						id='bio'
					/>

					<ErrorMessage errors={state?.errors?.bio} />
				</div>

				<ImageUpload
					name='image'
					error={state?.errors?.image}
					initialData={initialData?.image || undefined}
					type='square'
					size='xl'
					message='Upload instructor image, max. 2MB'
				/>

				<PublishToggle
					defaultChecked={initialData?.published}
					label='Instructor'
					className='max-w-lg'
				/>
			</div>
		</form>
	);
}
