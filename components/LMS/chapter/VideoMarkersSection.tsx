'use client';

import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Trash2, Plus, GripVertical } from 'lucide-react';
import { cn, formatTime } from '@/lib/utils';
import ErrorMessage from '@/components/ErrorMessage';
import { ChapterWithMarkers } from '@/db/chapter';
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

type VideoMarker = ChapterWithMarkers['markers'][number];

interface VideoMarkersSectionProps {
	initialMarkers?: VideoMarker[];
	errors?: string[];
	videoDuration?: number;
}

// Sortable Marker Item Component
function SortableMarkerItem({
	marker,
	index,
	timestampDisplay,
	videoDuration,
	onTimestampChange,
	onTimestampBlur,
	onMarkerUpdate,
	onRemove,
}: {
	marker: VideoMarker;
	index: number;
	timestampDisplay: string;
	videoDuration: number;
	onTimestampChange: (index: number, value: string) => void;
	onTimestampBlur: (index: number) => void;
	onMarkerUpdate: (
		index: number,
		field: keyof VideoMarker,
		value: string | number
	) => void;
	onRemove: (index: number) => void;
}) {
	const {
		attributes,
		listeners,
		setNodeRef,
		transform,
		transition,
		isDragging,
	} = useSortable({ id: marker.id });

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
		opacity: isDragging ? 0.5 : 1,
	};

	return (
		<div
			ref={setNodeRef}
			style={style}
			className={cn(
				'border rounded-lg p-3 bg-muted/30 space-y-2',
				isDragging ? 'z-50 shadow-lg' : ''
			)}
		>
			<div className='flex items-center justify-between'>
				<div className='flex items-center gap-2'>
					<Button
						type='button'
						variant='ghost'
						className='cursor-grab p-1 h-auto'
						{...attributes}
						{...listeners}
					>
						<GripVertical className='h-4 w-4 text-muted-foreground' />
					</Button>
					<span className='text-xs font-medium text-muted-foreground'>
						Marker {index + 1}
					</span>
				</div>
				<Button
					type='button'
					variant='ghost'
					size='sm'
					onClick={() => onRemove(index)}
					className='h-6 w-6 p-0 text-destructive hover:text-destructive'
				>
					<Trash2 className='w-3 h-3' />
				</Button>
			</div>

			<div className='grid grid-cols-2 gap-2'>
				{/* Timestamp */}
				<div>
					<Label htmlFor={`marker-timestamp-${index}`} className='text-xs'>
						Time (mm:ss)
					</Label>
					<div className='flex items-center gap-1'>
						<Input
							id={`marker-timestamp-${index}`}
							type='text'
							placeholder='0:00'
							value={timestampDisplay}
							onChange={(e) => onTimestampChange(index, e.target.value)}
							onBlur={() => onTimestampBlur(index)}
							className='h-8 text-xs'
						/>
						{videoDuration > 0 && (
							<span className='text-xs text-muted-foreground'>
								/{formatTime(videoDuration)}
							</span>
						)}
					</div>
					<p className='text-xs text-muted-foreground mt-1'>
						Format: minutes:seconds
					</p>
				</div>

				{/* Title */}
				<div>
					<Label htmlFor={`marker-title-${index}`} className='text-xs'>
						Title
					</Label>
					<Input
						id={`marker-title-${index}`}
						type='text'
						placeholder='Marker title'
						value={marker.title}
						onChange={(e) => onMarkerUpdate(index, 'title', e.target.value)}
						className='h-8 text-xs'
					/>
				</div>
			</div>

			{/* Description */}
			<div>
				<Label htmlFor={`marker-description-${index}`} className='text-xs'>
					Description (Optional)
				</Label>
				<Textarea
					id={`marker-description-${index}`}
					placeholder='Brief description'
					value={marker.description || ''}
					onChange={(e) => onMarkerUpdate(index, 'description', e.target.value)}
					rows={2}
					className='text-xs resize-none'
				/>
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

export default function VideoMarkersSection({
	initialMarkers = [],
	errors,
	videoDuration = 0,
}: VideoMarkersSectionProps) {
	const [markers, setMarkers] = useState<VideoMarker[]>(
		initialMarkers.length > 0 ? initialMarkers : []
	);

	// Track display values for timestamps (separate from actual values)
	const [timestampDisplays, setTimestampDisplays] = useState<string[]>(
		initialMarkers.map((marker) => formatTime(marker.timestamp))
	);

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
			setMarkers((items) => {
				const oldIndex = items.findIndex((item) => item.id === active.id);
				const newIndex = items.findIndex((item) => item.id === over.id);

				const reorderedItems = arrayMove(items, oldIndex, newIndex);

				// Update positions after reordering
				const updatedItems = reorderedItems.map((item, index) => ({
					...item,
					position: index + 1,
				}));

				return updatedItems;
			});

			// Also reorder timestamp displays
			setTimestampDisplays((displays) => {
				const oldIndex = markers.findIndex((item) => item.id === active.id);
				const newIndex = markers.findIndex((item) => item.id === over.id);
				return arrayMove(displays, oldIndex, newIndex);
			});
		}
	}

	// Parse time from input (mm:ss to seconds)
	const parseTime = (timeString: string): number => {
		if (!timeString || timeString.trim() === '') return 0;

		const parts = timeString.split(':');
		if (parts.length === 1) {
			const secs = parseInt(parts[0]) || 0;
			return Math.max(0, secs);
		} else if (parts.length === 2) {
			const mins = parseInt(parts[0]) || 0;
			const secs = parseInt(parts[1]) || 0;
			return Math.max(0, mins * 60 + secs);
		}
		return 0;
	};

	// Validate time format
	const isValidTimeFormat = (timeString: string): boolean => {
		if (!timeString) return true;
		const timeRegex = /^(\d+):?(\d{0,2})$/;
		return timeRegex.test(timeString);
	};

	// Add new marker
	const addMarker = () => {
		const newMarker: VideoMarker = {
			id: `temp-${Date.now()}`,
			timestamp: 0,
			title: '',
			description: '',
			position: markers.length + 1,
		};
		setMarkers([...markers, newMarker]);
		setTimestampDisplays([...timestampDisplays, '0:00']);
	};

	// Remove marker
	const removeMarker = (index: number) => {
		const newMarkers = markers.filter((_, i) => i !== index);
		const updatedMarkers = newMarkers.map((marker, i) => ({
			...marker,
			position: i + 1,
		}));
		setMarkers(updatedMarkers);

		// Update timestamp displays
		const newDisplays = timestampDisplays.filter((_, i) => i !== index);
		setTimestampDisplays(newDisplays);
	};

	// Update marker
	const updateMarker = (
		index: number,
		field: keyof VideoMarker,
		value: string | number
	) => {
		const newMarkers = [...markers];
		newMarkers[index] = { ...newMarkers[index], [field]: value };
		setMarkers(newMarkers);
	};

	// Handle timestamp change
	const handleTimestampChange = (index: number, value: string) => {
		const newDisplays = [...timestampDisplays];
		newDisplays[index] = value;
		setTimestampDisplays(newDisplays);

		if (isValidTimeFormat(value)) {
			const seconds = parseTime(value);
			updateMarker(index, 'timestamp', seconds);
		}
	};

	// Handle timestamp blur (format the display value)
	const handleTimestampBlur = (index: number) => {
		const currentMarker = markers[index];
		if (currentMarker) {
			const formatted = formatTime(currentMarker.timestamp);
			const newDisplays = [...timestampDisplays];
			newDisplays[index] = formatted;
			setTimestampDisplays(newDisplays);
		}
	};

	return (
		<div className='space-y-3'>
			<div className='flex items-center justify-between'>
				<div>
					<Label className={cn(errors ? 'text-destructive' : '')}>
						Video Markers
					</Label>
					<p className='text-muted-foreground text-xs mt-1'>
						Add timestamps to mark important sections. Drag to reorder.
					</p>
				</div>
				<Button
					type='button'
					variant='outline'
					size='sm'
					onClick={addMarker}
					className='h-8 px-3'
				>
					<Plus className='w-3 h-3 mr-1' />
					Add
				</Button>
			</div>

			<ErrorMessage errors={errors} />

			{/* Hidden inputs for form submission */}
			{markers.map((marker, index) => (
				<div key={marker.id} className='hidden'>
					<input name={`markers[${index}][id]`} value={marker.id} readOnly />
					<input
						name={`markers[${index}][timestamp]`}
						value={marker.timestamp}
						readOnly
					/>
					<input
						name={`markers[${index}][title]`}
						value={marker.title}
						readOnly
					/>
					<input
						name={`markers[${index}][description]`}
						value={marker.description || ''}
						readOnly
					/>
					<input
						name={`markers[${index}][position]`}
						value={marker.position}
						readOnly
					/>
				</div>
			))}

			{/* Markers List with Drag and Drop */}
			<div className='space-y-2'>
				{markers.length > 0 ? (
					<DndContext
						sensors={sensors}
						collisionDetection={closestCenter}
						onDragEnd={handleDragEnd}
					>
						<SortableContext
							items={markers.map((marker) => marker.id)}
							strategy={verticalListSortingStrategy}
						>
							{markers.map((marker, index) => (
								<SortableMarkerItem
									key={marker.id}
									marker={marker}
									index={index}
									timestampDisplay={timestampDisplays[index] || '0:00'}
									videoDuration={videoDuration}
									onTimestampChange={handleTimestampChange}
									onTimestampBlur={handleTimestampBlur}
									onMarkerUpdate={updateMarker}
									onRemove={removeMarker}
								/>
							))}
						</SortableContext>
					</DndContext>
				) : (
					<div className='text-center py-6 text-muted-foreground border-2 border-dashed rounded-lg'>
						<p className='text-sm'>No markers added</p>
						<p className='text-xs'>
							{'Click "Add" to create your first marker'}
						</p>
					</div>
				)}
			</div>
		</div>
	);
}
