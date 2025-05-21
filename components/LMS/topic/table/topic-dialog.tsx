'use client';

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { Loader, Plus } from 'lucide-react';
import { useFormStatus } from 'react-dom';
import { cn } from '@/lib/utils';
import { useFormState } from 'react-dom';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
	TopicState,
	createTopic,
	updateTopic,
} from '@/actions/lms/topic-action';
import { toast } from '@/hooks/use-toast';
import { Icons } from '@/components/icons/track-icons';
import { CourseTopic } from '@prisma/client';

import ErrorMessage from '@/components/ErrorMessage';

export function TopicDialog({
	open,
	setopen,
	initialData,
}: {
	initialData?: CourseTopic;
	open: boolean;
	setopen: Dispatch<SetStateAction<boolean>>;
}) {
	const isEdit = !!initialData?.id;
	const initialState: TopicState = {
		message: undefined,
		errors: {},
	};
	const [state, action] = useFormState(
		isEdit ? updateTopic.bind(null, initialData.id) : createTopic,
		initialState
	);

	useEffect(() => {
		if (state === undefined) {
			setopen(false);

			toast({
				description: `Course Topic ${
					isEdit ? 'updated' : 'created'
				} successfully.`,
			});
		}
	}, [state, setopen, isEdit]);

	return (
		<Dialog open={open} onOpenChange={setopen}>
			<DialogContent className='sm:max-w-[425px]'>
				<DialogHeader>
					<DialogTitle>{isEdit ? 'Update' : 'Create'} Course Topic</DialogTitle>
					<DialogDescription>
						{isEdit ? 'Update a course topic.' : 'Create a new course topic.'}
						{" Enter the details and click save when you're done."}
					</DialogDescription>
				</DialogHeader>

				<form className='grid gap-4 ' id='update' action={action}>
					<div>
						<div className='flex items-center gap-4'>
							<Label
								htmlFor='name'
								className={cn(
									'text-nowrap',
									state?.errors?.name ? 'text-destructive' : ''
								)}
							>
								Topic Name
							</Label>
							<Input
								id='name'
								name='name'
								defaultValue={initialData?.name || undefined}
								className={cn(
									'bg-transparent col-span-3',
									state?.errors?.name
										? 'border-destructive focus-visible:ring-destructive '
										: ''
								)}
							/>
						</div>

						<ErrorMessage errors={state?.errors?.name} />
					</div>

					{/* <div>
						<Label
							htmlFor='description'
							className={cn(
								state?.errors?.description ? 'text-destructive' : ''
							)}
						>
							Description
						</Label>
						<Textarea
							id='description'
							name='description'
							defaultValue={initialData?.description || undefined}
							className={cn(
								'bg-transparent',
								state?.errors?.description
									? 'border-destructive focus-visible:ring-destructive'
									: ''
							)}
							rows={3}
						/>
						{state?.errors?.description &&
							state.errors.description.map((error: string) => (
								<p
									className='text-sm font-medium text-destructive mt-2'
									key={error}
								>
									{error}
								</p>
							))}
					</div> */}

					<DialogFooter>
						<ErrorMessage
							errors={state?.message ? [state?.message] : undefined}
						/>
						<PendingButton isUpdate={!!initialData} />
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}

function PendingButton({ isUpdate = false }: { isUpdate?: boolean }) {
	const { pending } = useFormStatus();

	return (
		<Button type='submit' aria-disabled={pending} disabled={pending}>
			{pending ? (
				<Loader className='mr-2 h-4 w-4 animate-spin' />
			) : (
				<Plus className='mr-2 h-4 w-4' />
			)}
			{isUpdate ? 'Update' : 'Add'} Topic
		</Button>
	);
}

export function CreateTopicButton() {
	const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

	return (
		<>
			<Button onClick={() => setIsCreateDialogOpen(true)}>
				<Plus className='w-4 h-auto aspect-square mr-2' /> Add Topic
			</Button>
			<TopicDialog
				open={isCreateDialogOpen}
				setopen={setIsCreateDialogOpen}
				key={isCreateDialogOpen ? 'opened' : 'closed'}
			/>
		</>
	);
}

export function EditTopicButton({ data }: { data: CourseTopic }) {
	const [open, setOpen] = useState(false);

	return (
		<>
			<Button variant={'ghost'} onClick={() => setOpen(true)}>
				<Icons.edit className='w-5 h-auto aspect-square fill-muted text-muted' />
			</Button>
			{open && (
				<TopicDialog
					open={open}
					setopen={setOpen}
					initialData={data}
					key={open ? 'opened' : 'closed'}
				/>
			)}
		</>
	);
}
