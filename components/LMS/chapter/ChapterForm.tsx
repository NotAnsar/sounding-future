'use client';

import { useFormState } from 'react-dom';
import {
	addChapter,
	updateChapter,
	type ChapterFormState,
} from '@/actions/lms/chapter-action';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';
import ErrorMessage from '@/components/ErrorMessage';
import SaveButton from '@/components/profile/SaveButton';
import { Course, Instructor } from '@prisma/client';
import { ChapterWithMarkers } from '@/db/chapter';
import SelectInput from '@/components/ui/select-input';
import { PublishToggle } from '@/components/PublishToggle';
import VideoUploadSection from './VideoUploadSection';
import StudioImageUpload from '@/components/profile/StudioImageUpload';
import { MultiSelect } from '@/components/ui/multi-select';
import DownloadsUploadSection from './DownloadsUploadSection';
import VideoMarkersSection from './VideoMarkersSection';
import HLSUploadSection from './HLSUploadSection';
import { useState } from 'react';

interface ChapterFormProps {
	initialData?: ChapterWithMarkers;
	courses: Course[];
	instructors: Instructor[];
	preSelectedCourseId?: string;
}

const initialState: ChapterFormState = {
	message: null,
	errors: {},
	prev: {
		videoUrl: undefined,
		thumbnail: undefined,
		downloads: undefined,
		hlsUrl: undefined,
	},
};

export default function ChapterForm({
	initialData,
	courses,
	instructors,
	preSelectedCourseId,
}: ChapterFormProps) {
	const isEditing = !!initialData;

	const [videoDuration, setVideoDuration] = useState<number>(
		initialData?.videoDuration || 0
	);

	const initialStateWithPrev: ChapterFormState = {
		...initialState,
		prev: {
			videoUrl: initialData?.videoUrl || undefined,
			thumbnail: initialData?.thumbnail || undefined,
			downloads: initialData?.downloads || undefined,
			hlsUrl: initialData?.hlsUrl || undefined,
		},
	};

	const action = isEditing
		? updateChapter.bind(null, initialData.id)
		: addChapter;

	const [state, formAction] = useFormState(action, initialStateWithPrev);

	// ADD: Handle duration from video upload
	const handleVideoDurationExtracted = (duration: number) => {
		setVideoDuration(duration);
	};

	// ADD: Handle duration from HLS upload
	const handleHLSDurationExtracted = (duration: number) => {
		setVideoDuration(duration);
	};

	// Access type options
	const accessTypeOptions = [
		{ label: 'Free', value: 'FREE' },
		{ label: 'Pro', value: 'PRO' },
	];

	// Determine initial course value
	const initialCourseValue =
		initialData?.courseId || preSelectedCourseId || undefined;

	// Get initial instructor IDs for multi-select
	const initialInstructorIds =
		initialData?.instructors?.map((relation) => relation.instructorId) || [];

	return (
		<form action={formAction} className='mt-4 sm:mt-8 grid'>
			<div className='w-full flex justify-end'>
				<SaveButton />
			</div>

			<div className='grid gap-4 max-w-lg'>
				<ErrorMessage errors={state?.message ? [state?.message] : undefined} />

				{/* Chapter Title */}
				<div className='grid gap-2'>
					<Label
						htmlFor='title'
						className={cn(state?.errors?.title ? 'text-destructive' : '')}
					>
						Chapter Title
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
						placeholder='Enter chapter title'
					/>
					<p className='text-muted-foreground text-sm'>
						Enter the title of the chapter.
					</p>
					<ErrorMessage errors={state?.errors?.title} />
				</div>

				{/* Course Selection */}
				<div className='grid gap-2'>
					<Label
						htmlFor='courseId'
						className={cn(state?.errors?.courseId ? 'text-destructive' : '')}
					>
						Course
					</Label>
					<SelectInput
						name='courseId'
						options={courses.map((course) => ({
							label: course.title,
							value: course.id,
						}))}
						initialValue={initialCourseValue}
						placeholder='Select Course'
						searchPlaceholder='Search Course...'
						emptyMessage='No course found.'
						className={cn(
							state?.errors?.courseId
								? 'border-destructive focus-visible:ring-destructive'
								: ''
						)}
					/>
					<p className='text-muted-foreground text-sm'>
						Select the course this chapter belongs to.
					</p>
					<ErrorMessage errors={state?.errors?.courseId} />
				</div>

				{/* Instructors Selection (Multi-select) */}
				<div className='grid gap-2'>
					<Label
						htmlFor='instructorIds'
						className={cn(
							state?.errors?.instructorIds ? 'text-destructive' : ''
						)}
					>
						Instructors
					</Label>
					<MultiSelect
						name='instructorIds'
						options={instructors.map((instructor) => ({
							label: instructor.name,
							value: instructor.id,
						}))}
						initialValue={initialInstructorIds}
						placeholder='Select Instructors'
						searchPlaceholder='Search Instructors...'
						emptyMessage='No instructors found.'
						required
						className={cn(
							state?.errors?.instructorIds
								? 'border-destructive focus-visible:ring-destructive'
								: ''
						)}
					/>
					<p className='text-muted-foreground text-sm'>
						Select one or more instructors for this chapter.
					</p>
					<ErrorMessage errors={state?.errors?.instructorIds} />
				</div>

				{/* Access Type */}
				<div className='grid gap-2'>
					<Label
						htmlFor='accessType'
						className={cn(state?.errors?.accessType ? 'text-destructive' : '')}
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
					<p className='text-muted-foreground text-sm'>
						Set who can access this chapter.
					</p>
					<ErrorMessage errors={state?.errors?.accessType} />
				</div>

				{/* Description */}
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
						placeholder='Enter chapter description'
						className={cn(
							state?.errors?.description
								? 'border-destructive focus-visible:ring-destructive'
								: ''
						)}
					/>
					<p className='text-muted-foreground text-sm'>
						Provide a brief description of what this chapter covers.
					</p>
					<ErrorMessage errors={state?.errors?.description} />
				</div>

				{/* Video Upload Section */}
				<VideoUploadSection
					errors={{
						videoUrl: state?.errors?.videoUrl,
						videoDuration: state?.errors?.videoDuration,
					}}
					initialVideoUrl={initialData?.videoUrl || undefined}
					initialDuration={videoDuration || 0}
					onDurationExtracted={handleVideoDurationExtracted} // ADD this
				/>

				<input type='hidden' name='videoDuration' value={videoDuration} />

				<HLSUploadSection
					errors={{
						hlsUrl: state?.errors?.hlsUrl,
					}}
					initialHlsUrl={initialData?.hlsUrl || undefined}
					initialDuration={videoDuration || 0}
					onDurationExtracted={handleHLSDurationExtracted} // ADD this
				/>

				{/* Video Markers Section */}
				<VideoMarkersSection
					initialMarkers={initialData?.markers || []}
					errors={state?.errors?.markers}
					videoDuration={initialData?.videoDuration || 0}
				/>

				{/* Thumbnail Upload */}
				<StudioImageUpload
					name='thumbnail'
					error={state?.errors?.thumbnail}
					label='Chapter Thumbnail'
					type='square'
					initialData={initialData?.thumbnail || undefined}
					message='Upload thumbnail image, max. 2mb'
				/>

				{/* Downloads Upload Section */}
				<DownloadsUploadSection
					errors={state?.errors?.downloads}
					initialDownloads={initialData?.downloads || []}
				/>

				{/* Publish Toggle */}
				<PublishToggle
					defaultChecked={initialData?.published}
					label='Chapter'
				/>
			</div>
		</form>
	);
}
