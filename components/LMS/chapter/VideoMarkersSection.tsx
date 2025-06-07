// 'use client';

// import { useState } from 'react';
// import { Label } from '@/components/ui/label';
// import { Input } from '@/components/ui/input';
// import { Textarea } from '@/components/ui/textarea';
// import { Button } from '@/components/ui/button';
// import { Trash2, Plus } from 'lucide-react';
// import { cn } from '@/lib/utils';
// import ErrorMessage from '@/components/ErrorMessage';
// import { ChapterWithMarkers } from '@/db/chapter';

// type VideoMarker = ChapterWithMarkers['markers'][number];

// interface VideoMarkersSectionProps {
// 	initialMarkers?: VideoMarker[];
// 	errors?: string[];
// 	videoDuration?: number;
// }

// export default function VideoMarkersSection({
// 	initialMarkers = [],
// 	errors,
// 	videoDuration = 0,
// }: VideoMarkersSectionProps) {
// 	const [markers, setMarkers] = useState<VideoMarker[]>(
// 		initialMarkers.length > 0 ? initialMarkers : []
// 	);

// 	// Format time for display (mm:ss)
// 	const formatTime = (seconds: number): string => {
// 		const mins = Math.floor(seconds / 60);
// 		const secs = seconds % 60;
// 		return `${mins}:${String(secs).padStart(2, '0')}`;
// 	};

// 	// Parse time from input (mm:ss to seconds)
// 	const parseTime = (timeString: string): number => {
// 		const parts = timeString.split(':');
// 		if (parts.length !== 2) return 0;
// 		const mins = parseInt(parts[0]) || 0;
// 		const secs = parseInt(parts[1]) || 0;
// 		return mins * 60 + secs;
// 	};

// 	// Add new marker
// 	const addMarker = () => {
// 		const newMarker: VideoMarker = {
// 			id: `temp-${Date.now()}`,
// 			timestamp: 0,
// 			title: '',
// 			description: '',
// 			position: markers.length + 1, // Position based on current length
// 		};
// 		setMarkers([...markers, newMarker]);
// 	};

// 	// Remove marker
// 	const removeMarker = (index: number) => {
// 		const newMarkers = markers.filter((_, i) => i !== index);
// 		const updatedMarkers = newMarkers.map((marker, i) => ({
// 			...marker,
// 			position: i + 1,
// 		}));
// 		setMarkers(updatedMarkers);
// 	};

// 	// Update marker
// 	const updateMarker = (
// 		index: number,
// 		field: keyof VideoMarker,
// 		value: string | number
// 	) => {
// 		const newMarkers = [...markers];
// 		newMarkers[index] = { ...newMarkers[index], [field]: value };
// 		setMarkers(newMarkers);
// 	};

// 	return (
// 		<div className='space-y-3'>
// 			<div className='flex items-center justify-between'>
// 				<div>
// 					<Label className={cn(errors ? 'text-destructive' : '')}>
// 						Video Markers
// 					</Label>
// 					<p className='text-muted-foreground text-xs mt-1'>
// 						Add timestamps to mark important sections
// 					</p>
// 				</div>
// 				<Button
// 					type='button'
// 					variant='outline'
// 					size='sm'
// 					onClick={addMarker}
// 					className='h-8 px-3'
// 				>
// 					<Plus className='w-3 h-3 mr-1' />
// 					Add
// 				</Button>
// 			</div>

// 			<ErrorMessage errors={errors} />

// 			{/* Hidden inputs for form submission */}
// 			{markers.map((marker, index) => (
// 				<div key={marker.id} className='hidden'>
// 					<input name={`markers[${index}][id]`} value={marker.id} readOnly />
// 					<input
// 						name={`markers[${index}][timestamp]`}
// 						value={marker.timestamp}
// 						readOnly
// 					/>
// 					<input
// 						name={`markers[${index}][title]`}
// 						value={marker.title}
// 						readOnly
// 					/>
// 					<input
// 						name={`markers[${index}][description]`}
// 						value={marker.description || ''}
// 						readOnly
// 					/>
// 					<input
// 						name={`markers[${index}][position]`}
// 						value={marker.position}
// 						readOnly
// 					/>
// 				</div>
// 			))}

// 			{/* Markers List */}
// 			<div className='space-y-2'>
// 				{markers.map((marker, index) => (
// 					<div
// 						key={marker.id}
// 						className='border rounded-lg p-3 bg-muted/30 space-y-2'
// 					>
// 						<div className='flex items-center justify-between'>
// 							<span className='text-xs font-medium text-muted-foreground'>
// 								Marker {index + 1}
// 							</span>
// 							<Button
// 								type='button'
// 								variant='ghost'
// 								size='sm'
// 								onClick={() => removeMarker(index)}
// 								className='h-6 w-6 p-0 text-destructive hover:text-destructive'
// 							>
// 								<Trash2 className='w-3 h-3' />
// 							</Button>
// 						</div>

// 						<div className='grid grid-cols-2 gap-2'>
// 							{/* Timestamp */}
// 							<div>
// 								<Label
// 									htmlFor={`marker-timestamp-${index}`}
// 									className='text-xs'
// 								>
// 									Time
// 								</Label>
// 								<div className='flex items-center gap-1'>
// 									<Input
// 										id={`marker-timestamp-${index}`}
// 										type='text'
// 										placeholder='0:00'
// 										value={formatTime(marker.timestamp)}
// 										onChange={(e) => {
// 											const seconds = parseTime(e.target.value);
// 											updateMarker(index, 'timestamp', seconds);
// 										}}
// 										className='h-8 text-xs'
// 									/>
// 									{videoDuration > 0 && (
// 										<span className='text-xs text-muted-foreground'>
// 											/{formatTime(videoDuration)}
// 										</span>
// 									)}
// 								</div>
// 							</div>

// 							{/* Title */}
// 							<div>
// 								<Label htmlFor={`marker-title-${index}`} className='text-xs'>
// 									Title
// 								</Label>
// 								<Input
// 									id={`marker-title-${index}`}
// 									type='text'
// 									placeholder='Marker title'
// 									value={marker.title}
// 									onChange={(e) => updateMarker(index, 'title', e.target.value)}
// 									className='h-8 text-xs'
// 								/>
// 							</div>
// 						</div>

// 						{/* Description */}
// 						<div>
// 							<Label
// 								htmlFor={`marker-description-${index}`}
// 								className='text-xs'
// 							>
// 								Description (Optional)
// 							</Label>
// 							<Textarea
// 								id={`marker-description-${index}`}
// 								placeholder='Brief description'
// 								value={marker.description || ''}
// 								onChange={(e) =>
// 									updateMarker(index, 'description', e.target.value)
// 								}
// 								rows={2}
// 								className='text-xs resize-none'
// 							/>
// 						</div>
// 					</div>
// 				))}

// 				{markers.length === 0 && (
// 					<div className='text-center py-6 text-muted-foreground border-2 border-dashed rounded-lg'>
// 						<p className='text-sm'>No markers added</p>
// 						<p className='text-xs'>
// 							{'Click "Add" to create your first marker'}
// 						</p>
// 					</div>
// 				)}
// 			</div>
// 		</div>
// 	);
// }

'use client';

import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Trash2, Plus } from 'lucide-react';
import { cn, formatTime } from '@/lib/utils';
import ErrorMessage from '@/components/ErrorMessage';
import { ChapterWithMarkers } from '@/db/chapter';

type VideoMarker = ChapterWithMarkers['markers'][number];

interface VideoMarkersSectionProps {
	initialMarkers?: VideoMarker[];
	errors?: string[];
	videoDuration?: number;
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

	// Parse time from input (mm:ss to seconds)
	const parseTime = (timeString: string): number => {
		// Handle empty or invalid input
		if (!timeString || timeString.trim() === '') return 0;

		const parts = timeString.split(':');
		if (parts.length === 1) {
			// Just seconds entered
			const secs = parseInt(parts[0]) || 0;
			return Math.max(0, secs);
		} else if (parts.length === 2) {
			// mm:ss format
			const mins = parseInt(parts[0]) || 0;
			const secs = parseInt(parts[1]) || 0;
			return Math.max(0, mins * 60 + secs);
		}
		return 0;
	};

	// Validate time format
	const isValidTimeFormat = (timeString: string): boolean => {
		if (!timeString) return true; // Empty is valid
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
		// Update display value immediately
		const newDisplays = [...timestampDisplays];
		newDisplays[index] = value;
		setTimestampDisplays(newDisplays);

		// Parse and update actual timestamp
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
						Add timestamps to mark important sections
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

			{/* Markers List */}
			<div className='space-y-2'>
				{markers.map((marker, index) => (
					<div
						key={marker.id}
						className='border rounded-lg p-3 bg-muted/30 space-y-2'
					>
						<div className='flex items-center justify-between'>
							<span className='text-xs font-medium text-muted-foreground'>
								Marker {index + 1}
							</span>
							<Button
								type='button'
								variant='ghost'
								size='sm'
								onClick={() => removeMarker(index)}
								className='h-6 w-6 p-0 text-destructive hover:text-destructive'
							>
								<Trash2 className='w-3 h-3' />
							</Button>
						</div>

						<div className='grid grid-cols-2 gap-2'>
							{/* Timestamp */}
							<div>
								<Label
									htmlFor={`marker-timestamp-${index}`}
									className='text-xs'
								>
									Time (mm:ss)
								</Label>
								<div className='flex items-center gap-1'>
									<Input
										id={`marker-timestamp-${index}`}
										type='text'
										placeholder='0:00'
										value={timestampDisplays[index] || '0:00'}
										onChange={(e) =>
											handleTimestampChange(index, e.target.value)
										}
										onBlur={() => handleTimestampBlur(index)}
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
									onChange={(e) => updateMarker(index, 'title', e.target.value)}
									className='h-8 text-xs'
								/>
							</div>
						</div>

						{/* Description */}
						<div>
							<Label
								htmlFor={`marker-description-${index}`}
								className='text-xs'
							>
								Description (Optional)
							</Label>
							<Textarea
								id={`marker-description-${index}`}
								placeholder='Brief description'
								value={marker.description || ''}
								onChange={(e) =>
									updateMarker(index, 'description', e.target.value)
								}
								rows={2}
								className='text-xs resize-none'
							/>
						</div>
					</div>
				))}

				{markers.length === 0 && (
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
