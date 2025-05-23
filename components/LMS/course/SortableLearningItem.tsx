'use client';

import { useState, useEffect } from 'react';
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
import { GripVertical, Plus, Trash } from 'lucide-react';
import { v4 as uuidv4 } from 'uuid';
import ErrorMessage from '@/components/ErrorMessage';

// Learning item interface with unique id for sorting
interface LearningItem {
	id: string;
	text: string;
}

// Sortable item component
function SortableLearningItem({
	item,
	onChange,
	onRemove,
	onAddNew,
	error,
	canRemove,
}: {
	item: LearningItem;
	onChange: (id: string, value: string) => void;
	onRemove: (id: string) => void;
	onAddNew: () => void;
	error?: boolean;
	canRemove: boolean;
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
			e.preventDefault(); // Prevent form submission
			onAddNew(); // Add new item instead
		}
	};

	return (
		<div
			ref={setNodeRef}
			style={style}
			className={cn(
				'flex items-center gap-2 mb-2 bg-player rounded-md',
				isDragging ? 'z-50' : ''
			)}
		>
			<Button
				type='button'
				variant='ghost'
				className='cursor-grab p-1 h-auto'
				{...attributes}
				{...listeners}
			>
				<GripVertical className='h-4 w-4' />
			</Button>

			<Input
				value={item.text}
				onChange={(e) => onChange(item.id, e.target.value)}
				onKeyDown={handleKeyDown}
				className={cn(
					'flex-1 border-transparent',
					error ? 'border-destructive focus-visible:ring-destructive ' : ''
				)}
				placeholder='Enter a learning outcome'
			/>

			{canRemove && (
				<Button
					type='button'
					variant='ghost'
					size='icon'
					onClick={() => onRemove(item.id)}
					className='text-muted-foreground'
				>
					<Trash className='h-4 w-4' />
				</Button>
			)}
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

interface SortableLearningItemsProps {
	initialItems?: string[];
	label?: string;
	required?: boolean;
	errors?: string[];
	placeholder?: string;
	helpText?: string;
}

export default function SortableLearningItems({
	initialItems = [''],
	label = 'Learning Items',
	required = false,
	errors,
	// placeholder = 'Enter a learning outcome',
	helpText = 'Drag to reorder items. Press Enter to add a new item.',
}: SortableLearningItemsProps) {
	// Initial learning items
	const [learningItems, setLearningItems] = useState<LearningItem[]>(
		initialItems.map((text) => ({ id: uuidv4(), text }))
	);

	// Ensure at least one item exists
	useEffect(() => {
		if (learningItems.length === 0) {
			setLearningItems([{ id: uuidv4(), text: '' }]);
		}
	}, [learningItems]);

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
			setLearningItems((items) => {
				const oldIndex = items.findIndex((item) => item.id === active.id);
				const newIndex = items.findIndex((item) => item.id === over.id);

				return arrayMove(items, oldIndex, newIndex);
			});
		}
	}

	// Add a new learning item
	function addLearningItem() {
		const newItem = { id: uuidv4(), text: '' };
		setLearningItems([...learningItems, newItem]);

		// Focus the new input after a short delay
		setTimeout(() => {
			const inputs = document.querySelectorAll(
				'input[placeholder="Enter a learning outcome"]'
			);
			const lastInput = inputs[inputs.length - 1] as HTMLInputElement;
			if (lastInput) {
				lastInput.focus();
			}
		}, 100);
	}

	// Remove a learning item
	function removeLearningItem(id: string) {
		if (learningItems.length > 1) {
			setLearningItems(learningItems.filter((item) => item.id !== id));
		}
	}

	// Update a learning item's text
	function updateLearningItem(id: string, text: string) {
		setLearningItems(
			learningItems.map((item) => (item.id === id ? { ...item, text } : item))
		);
	}

	return (
		<div className='grid gap-2'>
			<div className='flex justify-between items-center'>
				<Label
					htmlFor='learnings'
					className={cn(errors && errors.length > 0 ? 'text-destructive' : '')}
				>
					{required && <span className='text-destructive mr-1'>*</span>}
					{label}
				</Label>
				<Button
					type='button'
					variant='outline'
					size='sm'
					onClick={addLearningItem}
					className='flex items-center gap-1'
				>
					<Plus className='h-3.5 w-3.5' /> Add Item
				</Button>
			</div>

			<div>
				<DndContext
					sensors={sensors}
					collisionDetection={closestCenter}
					onDragEnd={handleDragEnd}
				>
					<SortableContext
						items={learningItems.map((item) => item.id)}
						strategy={verticalListSortingStrategy}
					>
						{learningItems.map((item) => (
							<SortableLearningItem
								key={item.id}
								item={item}
								onChange={updateLearningItem}
								onRemove={removeLearningItem}
								onAddNew={addLearningItem}
								error={!!(errors && errors.length > 0)}
								canRemove={learningItems.length > 1}
							/>
						))}
					</SortableContext>
				</DndContext>
			</div>

			{/* Hidden inputs to submit learning items */}
			{learningItems.map((item, index) => (
				<input
					key={item.id}
					type='hidden'
					name={`learnings[${index}]`}
					value={item.text}
				/>
			))}

			{helpText && <p className='text-muted-foreground text-sm'>{helpText}</p>}

			<ErrorMessage errors={errors} />
		</div>
	);
}
