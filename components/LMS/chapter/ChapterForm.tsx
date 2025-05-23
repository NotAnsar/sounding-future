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
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import ErrorMessage from '@/components/ErrorMessage';
import { Course } from '@prisma/client';
import { ChapterWithRelations } from '@/db/chapter';
import { cn } from '@/lib/utils';
import { SubmitButton } from '@/components/auth/SubmitButton';

interface ChapterFormProps {
	initialData?: ChapterWithRelations;
	courses: Course[];
}

const initialState: ChapterFormState = {
	message: null,
	errors: {},
};

export default function ChapterForm({
	initialData,
	courses,
}: ChapterFormProps) {
	const isEditing = !!initialData;
	const action = isEditing
		? updateChapter.bind(null, initialData.id)
		: addChapter;

	const [state, formAction] = useFormState(action, initialState);

	return (
		<Card className='w-full max-w-4xl mx-auto'>
			<CardHeader>
				<CardTitle>
					{isEditing ? 'Edit Chapter' : 'Create New Chapter'}
				</CardTitle>
			</CardHeader>
			<CardContent>
				<form action={formAction} className='space-y-6'>
					<div className='grid grid-cols-1 md:grid-cols-2 gap-6'>
						{/* Title */}
						<div className='md:col-span-2'>
							<Label htmlFor='title'>Chapter Title *</Label>
							<Input
								id='title'
								name='title'
								defaultValue={initialData?.title}
								placeholder='Enter chapter title'
								className={cn(state.errors?.title ? 'border-destructive' : '')}
							/>
							<ErrorMessage errors={state.errors?.title} />
						</div>

						{/* Course Selection */}
						<div>
							<Label htmlFor='courseId'>Course *</Label>
							<Select name='courseId' defaultValue={initialData?.courseId}>
								<SelectTrigger
									className={cn(
										state.errors?.courseId ? 'border-destructive' : ''
									)}
								>
									<SelectValue placeholder='Select a course' />
								</SelectTrigger>
								<SelectContent>
									{courses.map((course) => (
										<SelectItem key={course.id} value={course.id}>
											{course.title}
										</SelectItem>
									))}
								</SelectContent>
							</Select>
							<ErrorMessage errors={state.errors?.courseId} />
						</div>

						{/* Access Type */}
						<div>
							<Label htmlFor='accessType'>Access Type</Label>
							<Select
								name='accessType'
								defaultValue={initialData?.accessType || 'PRO'}
							>
								<SelectTrigger>
									<SelectValue />
								</SelectTrigger>
								<SelectContent>
									<SelectItem value='FREE'>Free</SelectItem>
									<SelectItem value='PRO'>Pro</SelectItem>
								</SelectContent>
							</Select>
						</div>

						{/* Video URL */}
						<div>
							<Label htmlFor='videoUrl'>Video URL</Label>
							<Input
								id='videoUrl'
								name='videoUrl'
								type='url'
								defaultValue={initialData?.videoUrl || ''}
								placeholder='https://example.com/video'
								className={cn(
									state.errors?.videoUrl ? 'border-destructive' : ''
								)}
							/>
							<ErrorMessage errors={state.errors?.videoUrl} />
						</div>

						{/* Duration */}
						{/* <div>
							<Label htmlFor='duration'>Duration (minutes)</Label>
							<Input
								id='duration'
								name='duration'
								type='number'
								min='0'
								step='1'
								defaultValue={initialData?.duration || ''}
								placeholder='0'
								className={cn(
									state.errors?.duration ? 'border-destructive' : ''
								)}
							/>
							<ErrorMessage errors={state.errors?.duration} />
						</div> */}

						{/* Description */}
						<div className='md:col-span-2'>
							<Label htmlFor='description'>Description</Label>
							<Textarea
								id='description'
								name='description'
								defaultValue={initialData?.description || ''}
								placeholder='Enter chapter description'
								rows={3}
								className={cn(
									state.errors?.description ? 'border-destructive' : ''
								)}
							/>
							<ErrorMessage errors={state.errors?.description} />
						</div>

						{/* Published Toggle */}
						<div className='md:col-span-2'>
							<div className='flex items-center justify-between p-4 border rounded-lg'>
								<div>
									<Label htmlFor='published' className='text-base font-medium'>
										Publish Chapter
									</Label>
									<p className='text-sm text-muted-foreground'>
										Make this chapter visible to students
									</p>
								</div>
								<Switch
									id='published'
									name='published'
									defaultChecked={initialData?.published}
								/>
							</div>
							<ErrorMessage errors={state.errors?.published} />
						</div>
					</div>

					{/* Submit Button */}
					<div className='flex gap-4'>
						<SubmitButton>
							{isEditing ? 'Update Chapter' : 'Create Chapter'}
						</SubmitButton>
						<Button type='button' variant='outline'>
							Cancel
						</Button>
					</div>

					{state.message && (
						<div className='p-4 border border-destructive bg-destructive/10 text-destructive rounded-lg'>
							{state.message}
						</div>
					)}
				</form>
			</CardContent>
		</Card>
	);
}
