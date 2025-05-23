'use client';

import { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
	DndContext,
	closestCenter,
	KeyboardSensor,
	PointerSensor,
	useSensor,
	useSensors,
	DragEndEvent,
} from '@dnd-kit/core';
import {
	SortableContext,
	sortableKeyboardCoordinates,
	verticalListSortingStrategy,
	useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { GripVertical, Plus, Trash, Edit, Eye, EyeOff } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import ErrorMessage from '@/components/ErrorMessage';
import Link from 'next/link';
import { buttonVariants } from '@/components/ui/button';
import { Chapter } from '@prisma/client';
import Badge from '@/components/Badge';

// Chapter item interface
interface ChapterItem {
	id: string;
	title: string;
	description?: string | null;
	accessType: string;
	published: boolean;
	position: number;
	isNew?: boolean;
	isDeleted?: boolean; // Track deleted chapters
}

// Sortable chapter item component
function SortableChapterItem({
	item,
	onChange,
	onRemove,
	onAddNew,
	error,
	canRemove,
	courseId,
	isEditing,
}: {
	item: ChapterItem;
	onChange: (id: string, field: string, value: string) => void;
	onRemove: (id: string) => void;
	onAddNew: () => void;
	error?: boolean;
	canRemove: boolean;
	courseId?: string;
	isEditing: boolean;
}) {
	const {
		attributes,
		listeners,
		setNodeRef,
		transform,
		transition,
		isDragging,
	} = useSortable({ id: item.id });

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
		opacity: isDragging ? 0.5 : 1,
	};

	// Handle key down events
	const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
		if (e.key === 'Enter') {
			e.preventDefault();
			onAddNew();
		}
	};

	return (
		<div
			ref={setNodeRef}
			style={style}
			className={cn('rounded-md mb-2 bg-player p-3', isDragging ? 'z-50' : '')}
		>
			<div className='flex items-start gap-2'>
				<Button
					type='button'
					variant='ghost'
					className='cursor-grab p-1 h-auto mt-1'
					{...attributes}
					{...listeners}
				>
					<GripVertical className='h-4 w-4' />
				</Button>

				<div className='flex-1 space-y-2'>
					<div className='flex items-center gap-2'>
						<Input
							value={item.title}
							onChange={(e) => onChange(item.id, 'title', e.target.value)}
							onKeyDown={handleKeyDown}
							className={cn(
								'flex-1 border-transparent',
								error ? 'border-destructive focus-visible:ring-destructive' : ''
							)}
							placeholder='Enter chapter title (optional)'
						/>

						<div className='flex items-center gap-1'>
							<Badge variant={item.accessType === 'PRO' ? 'admin' : 'archive'}>
								{item.accessType}
							</Badge>

							<Badge variant={item.published ? 'admin' : 'archive'}>
								{item.published ? (
									<>
										<Eye className='w-3 h-3 mr-1' />
										Published
									</>
								) : (
									<>
										<EyeOff className='w-3 h-3 mr-1' />
										Draft
									</>
								)}
							</Badge>
						</div>
					</div>

					{item.description && (
						<p className='text-sm text-muted-foreground line-clamp-2'>
							{item.description}
						</p>
					)}
				</div>

				<div className='flex items-center gap-1'>
					{/* Edit button - only show if chapter exists (not new) and we're editing a course */}
					{isEditing && !item.isNew && courseId && (
						<Link
							href={`/user/lms/chapters/edit/${item.id}`}
							className={cn(buttonVariants({ variant: 'ghost', size: 'icon' }))}
						>
							<Edit className='h-4 w-4' />
						</Link>
					)}

					{canRemove && (
						<Button
							type='button'
							variant='ghost'
							size='icon'
							onClick={() => onRemove(item.id)}
							className='text-muted-foreground hover:text-destructive'
						>
							<Trash className='h-4 w-4' />
						</Button>
					)}
				</div>
			</div>
		</div>
	);
}

// Helper function to reorder array items
function arrayMove<T>(array: T[], from: number, to: number): T[] {
	const newArray = array.slice();
	newArray.splice(
		to < 0 ? newArray.length + to : to,
		0,
		newArray.splice(from, 1)[0]
	);
	return newArray;
}

interface SortableChapterItemsProps {
	initialChapters?: Chapter[];
	courseId?: string;
	isEditing?: boolean;
	errors?: string[];
}

export default function SortableChapterItems({
	initialChapters = [],
	courseId,
	isEditing = false,
	errors,
}: SortableChapterItemsProps) {
	// Convert existing chapters to chapter items with proper null handling
	const [chapterItems, setChapterItems] = useState<ChapterItem[]>(
		initialChapters.map((chapter, index) => ({
			id: chapter.id,
			title: chapter.title,
			description: chapter.description,
			accessType: chapter.accessType,
			published: chapter.published,
			position: chapter.position || index + 1,
			isNew: false,
			isDeleted: false,
		}))
	);

	// Track deleted chapter IDs for the server action
	const [deletedChapterIds, setDeletedChapterIds] = useState<string[]>([]);

	// DnD sensors
	const sensors = useSensors(
		useSensor(PointerSensor),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		})
	);

	// Handle drag end for reordering
	function handleDragEnd(event: DragEndEvent) {
		const { active, over } = event;

		if (over && active.id !== over.id) {
			setChapterItems((items) => {
				const oldIndex = items.findIndex((item) => item.id === active.id);
				const newIndex = items.findIndex((item) => item.id === over.id);

				const newItems = arrayMove(items, oldIndex, newIndex);

				// Update positions
				return newItems.map((item, index) => ({
					...item,
					position: index + 1,
				}));
			});
		}
	}

	// Add a new chapter item
	function addChapterItem() {
		const newItem: ChapterItem = {
			id: uuidv4(),
			title: '',
			accessType: 'PRO',
			published: false,
			position: chapterItems.length + 1,
			isNew: true,
			isDeleted: false,
		};
		setChapterItems([...chapterItems, newItem]);

		// Focus the new input after a short delay
		setTimeout(() => {
			const inputs = document.querySelectorAll(
				'input[placeholder="Enter chapter title (optional)"]'
			);
			const lastInput = inputs[inputs.length - 1] as HTMLInputElement;
			if (lastInput) {
				lastInput.focus();
			}
		}, 100);
	}

	// Remove a chapter item
	function removeChapterItem(id: string) {
		const itemToRemove = chapterItems.find((item) => item.id === id);

		if (itemToRemove) {
			if (itemToRemove.isNew) {
				// If it's a new chapter, just remove it from the list
				setChapterItems(chapterItems.filter((item) => item.id !== id));
			} else {
				// If it's an existing chapter, mark it for deletion
				setDeletedChapterIds((prev) => [...prev, id]);
				setChapterItems(chapterItems.filter((item) => item.id !== id));
			}
		}
	}

	// Update a chapter item field
	function updateChapterItem(id: string, field: string, value: string) {
		setChapterItems(
			chapterItems.map((item) =>
				item.id === id ? { ...item, [field]: value } : item
			)
		);
	}

	return (
		<div className='grid gap-2'>
			<div className='flex justify-between items-center'>
				<Label
					className={cn(errors && errors.length > 0 ? 'text-destructive' : '')}
				>
					Chapters ({chapterItems.length})
				</Label>

				<Button
					type='button'
					variant='outline'
					size='sm'
					onClick={addChapterItem}
					className='flex items-center gap-1'
				>
					<Plus className='h-3.5 w-3.5' /> Add Chapter
				</Button>
			</div>

			{chapterItems.length > 0 ? (
				<div className='mt-1'>
					<DndContext
						sensors={sensors}
						collisionDetection={closestCenter}
						onDragEnd={handleDragEnd}
					>
						<SortableContext
							items={chapterItems.map((item) => item.id)}
							strategy={verticalListSortingStrategy}
						>
							{chapterItems.map((item, index) => (
								<SortableChapterItem
									key={item.id}
									item={{ ...item, position: index + 1 }}
									onChange={updateChapterItem}
									onRemove={removeChapterItem}
									onAddNew={addChapterItem}
									error={!!(errors && errors.length > 0)}
									canRemove={true}
									courseId={courseId}
									isEditing={isEditing}
								/>
							))}
						</SortableContext>
					</DndContext>
				</div>
			) : (
				<div className='border rounded-md p-8 bg-muted/10 text-center'>
					<p className='text-muted-foreground mb-4'>No chapters yet</p>
					<Button
						type='button'
						variant='outline'
						onClick={addChapterItem}
						className='flex items-center gap-1 mx-auto'
					>
						<Plus className='h-3.5 w-3.5' /> Add First Chapter
					</Button>
				</div>
			)}

			{/* Hidden inputs to submit chapter data */}
			{chapterItems.map((item, index) => (
				<div key={item.id}>
					<input
						type='hidden'
						name={`chapters[${index}][id]`}
						value={item.id}
					/>
					<input
						type='hidden'
						name={`chapters[${index}][title]`}
						value={item.title}
					/>
					<input
						type='hidden'
						name={`chapters[${index}][position]`}
						value={index + 1}
					/>
					<input
						type='hidden'
						name={`chapters[${index}][isNew]`}
						value={item.isNew ? 'true' : 'false'}
					/>
				</div>
			))}

			{/* Hidden inputs for deleted chapter IDs */}
			{deletedChapterIds.map((id, index) => (
				<input
					key={`deleted-${id}`}
					type='hidden'
					name={`deletedChapters[${index}]`}
					value={id}
				/>
			))}

			<p className='text-muted-foreground text-sm'>
				{isEditing
					? 'Drag to reorder chapters. Click edit to modify chapter content.'
					: 'Add and organize chapters for your course. Chapter titles are optional.'}
			</p>

			<ErrorMessage errors={errors} />
		</div>
	);
}
