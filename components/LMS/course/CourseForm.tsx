'use client';

import { useFormState } from 'react-dom';
import ErrorMessage from '@/components/ErrorMessage';
import SaveButton from '@/components/profile/SaveButton';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { CourseSeries, CourseTopic, Instructor } from '@prisma/client';
import { PublishToggle } from '@/components/PublishToggle';
import {
	CourseFormState,
	addCourse,
	updateCourse,
} from '@/actions/lms/course-action';
import ImageUpload from '@/components/profile/ImageUpload';
import SelectInput from '@/components/ui/select-input';
import { CourseWithRelations } from '@/db/course';
import { MultiSelect } from '@/components/ui/multi-select';
import SortableLearningItems from './SortableLearningItem';
import SortableChapterItems from './SortableChapterItems';

export default function CourseForm({
	initialData,
	instructors,
	topics,
	series,
}: {
	initialData?: CourseWithRelations;
	instructors: Instructor[];
	topics: CourseTopic[];
	series: CourseSeries[];
}) {
	const initialState: CourseFormState = { message: null, errors: {} };
	const [state, action] = useFormState(
		initialData?.id ? updateCourse.bind(null, initialData?.id) : addCourse,
		initialState
	);

	// Get topic IDs for the initial value of multi-select
	const initialTopicIds =
		initialData?.topics.map((relation) => relation.topic.id) || [];

	// Access type options
	const accessTypeOptions = [
		{ label: 'Free', value: 'FREE' },
		{ label: 'Pro', value: 'PRO' },
	];

	// Level options
	const levelOptions = [
		{ label: 'Beginner', value: 'BEGINNER' },
		{ label: 'Advanced', value: 'ADVANCED' },
		{ label: 'Expert', value: 'EXPERT' },
	];

	const isEditing = !!initialData?.id;

	return (
		<form action={action} className='mt-4 sm:mt-8 grid'>
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
						Course Title
					</Label>
					<Input
						type='text'
						name='title'
						id='title'
						defaultValue={initialData?.title || ''}
						className={cn(
							state?.errors?.title
								? 'border-destructive focus-visible:ring-destructive'
								: ''
						)}
					/>
					<p className='text-muted-foreground text-sm'>
						Enter the title of the course.
					</p>
					<ErrorMessage errors={state?.errors?.title} />
				</div>

				<div className='grid gap-2'>
					<Label
						htmlFor='description'
						className={cn(state?.errors?.description ? 'text-destructive' : '')}
					>
						Description (Optional)
					</Label>
					<Textarea
						name='description'
						id='description'
						rows={4}
						defaultValue={initialData?.description || ''}
						className={cn(
							state?.errors?.description
								? 'border-destructive focus-visible:ring-destructive'
								: ''
						)}
					/>
					<ErrorMessage errors={state?.errors?.description} />
				</div>

				<ImageUpload
					name='thumbnail'
					label='Course Thumbnail'
					error={state?.errors?.thumbnail}
					initialData={initialData?.thumbnail || undefined}
					type='square'
					size='xl'
					message='Upload course thumbnail, max. 2MB'
				/>

				<div className='grid gap-x-2 gap-y-4 sm:grid-cols-2'>
					<div className='grid gap-2'>
						<Label
							htmlFor='level'
							className={cn(state?.errors?.level ? 'text-destructive' : '')}
						>
							Course Level
						</Label>
						<SelectInput
							name='level'
							options={levelOptions}
							initialValue={initialData?.level || 'BEGINNER'}
							placeholder='Select Level'
							className={cn(
								state?.errors?.level
									? 'border-destructive focus-visible:ring-destructive'
									: ''
							)}
						/>
						<ErrorMessage errors={state?.errors?.level} />
					</div>

					<div className='grid gap-2'>
						<Label
							htmlFor='accessType'
							className={cn(
								state?.errors?.accessType ? 'text-destructive' : ''
							)}
						>
							Access Type
						</Label>
						<SelectInput
							name='accessType'
							options={accessTypeOptions}
							initialValue={initialData?.accessType || 'PRO'}
							placeholder='Select Access Type'
							className={cn(
								state?.errors?.accessType
									? 'border-destructive focus-visible:ring-destructive'
									: ''
							)}
						/>
						<ErrorMessage errors={state?.errors?.accessType} />
					</div>
				</div>

				<div className='grid gap-2'>
					<Label
						htmlFor='instructorId'
						className={cn(
							state?.errors?.instructorId ? 'text-destructive' : ''
						)}
					>
						Instructor (Optional)
					</Label>
					<SelectInput
						name='instructorId'
						options={instructors.map((i) => ({ label: i.name, value: i.id }))}
						initialValue={initialData?.instructorId || undefined}
						placeholder='Select Instructor'
						searchPlaceholder='Search Instructor...'
						emptyMessage='No instructor found.'
						allowClear
						className={cn(
							state?.errors?.instructorId
								? 'border-destructive focus-visible:ring-destructive'
								: ''
						)}
					/>
					<ErrorMessage errors={state?.errors?.instructorId} />
				</div>

				<div className='grid gap-2'>
					<Label
						htmlFor='seriesId'
						className={cn(state?.errors?.seriesId ? 'text-destructive' : '')}
					>
						Course Series (Optional)
					</Label>
					<SelectInput
						name='seriesId'
						options={series.map((s) => ({ label: s.name, value: s.id }))}
						initialValue={initialData?.seriesId || undefined}
						placeholder='Select Series'
						searchPlaceholder='Search Series...'
						emptyMessage='No series found.'
						allowClear
						className={cn(
							state?.errors?.seriesId
								? 'border-destructive focus-visible:ring-destructive'
								: ''
						)}
					/>
					<ErrorMessage errors={state?.errors?.seriesId} />
				</div>

				<div className='grid gap-2'>
					<Label
						htmlFor='topicIds'
						className={cn(state?.errors?.topicIds ? 'text-destructive' : '')}
					>
						Course Topics (Optional)
					</Label>
					<MultiSelect
						name='topicIds'
						options={topics.map((t) => ({ label: t.name, value: t.id }))}
						initialValue={initialTopicIds}
						placeholder='Select Topics'
						searchPlaceholder='Search Topics...'
						emptyMessage='No topics found.'
						className={cn(
							state?.errors?.topicIds
								? 'border-destructive focus-visible:ring-destructive'
								: ''
						)}
					/>
					<ErrorMessage errors={state?.errors?.topicIds} />
				</div>

				{/* Sortable Learning Items Component */}
				<SortableLearningItems
					initialItems={initialData?.learnings || ['']}
					label='Learnings'
					required={false}
					errors={state?.errors?.learnings}
					helpText='Add points that users will learn from this course'
				/>

				{/* Sortable Chapter Items Component */}
				<SortableChapterItems
					initialChapters={initialData?.chapters || []}
					courseId={initialData?.id}
					isEditing={isEditing}
					// errors={state?.errors?.chapters}
				/>

				<div className='grid gap-2'>
					<Label
						htmlFor='skills'
						className={cn(state?.errors?.skills ? 'text-destructive' : '')}
					>
						Skills (Optional)
					</Label>
					<Textarea
						name='skills'
						id='skills'
						rows={5}
						defaultValue={initialData?.skills || ''}
						className={cn(
							state?.errors?.skills
								? 'border-destructive focus-visible:ring-destructive'
								: ''
						)}
					/>
					<p className='text-muted-foreground text-sm'>
						Add skill that users need for this course
					</p>
					<ErrorMessage errors={state?.errors?.skills} />
				</div>

				<div className='grid gap-2'>
					<Label
						htmlFor='credits'
						className={cn(state?.errors?.credits ? 'text-destructive' : '')}
					>
						Credits (Optional)
					</Label>
					<Textarea
						rows={5}
						name='credits'
						id='credits'
						defaultValue={initialData?.credits || ''}
						className={cn(
							state?.errors?.credits
								? 'border-destructive focus-visible:ring-destructive'
								: ''
						)}
					/>
					<p className='text-muted-foreground text-sm'>
						Add a description for this course
					</p>
					<ErrorMessage errors={state?.errors?.credits} />
				</div>

				<PublishToggle defaultChecked={initialData?.published} label='Course' />
			</div>
		</form>
	);
}
