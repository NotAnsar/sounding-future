import React from 'react';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Music2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import ErrorMessage from '../ErrorMessage';

interface TrackUploadProps {
	errors?: { mp3File?: string[]; flacFile?: string[] };
}

export default function TrackUploadSection({ errors }: TrackUploadProps) {
	return (
		<div className='grid gap-6'>
			<div className='grid gap-2'>
				<Label
					htmlFor='flacFile'
					className={cn(errors?.mp3File ? 'text-destructive' : '')}
				>
					Upload Track
				</Label>

				<div className='grid gap-4'>
					<div className='grid gap-2'>
						<div className='relative max-w-lg cursor-pointer '>
							<Input
								type='file'
								name='mp3File'
								id='mp3File'
								accept='.mp3,audio/mpeg'
								className={cn(
									'cursor-pointer h-9 file:h-full file:border-0',
									'file:bg-transparent file:cursor-pointer',
									'flex items-center justify-between',
									errors?.mp3File
										? 'border-destructive focus-visible:ring-destructive'
										: ''
								)}
							/>
							<Music2 className='absolute right-3 top-1/2 transform -translate-y-1/2 text-muted w-4 h-auto aspect-square cursor-pointer' />
						</div>

						<p className='text-muted text-sm'>
							Upload your track in MP3 format (max 50MB)
						</p>

						<ErrorMessage errors={errors?.mp3File} />
					</div>

					{/* FLAC Upload */}
					<div className='grid gap-2'>
						<div className='relative max-w-lg cursor-pointer'>
							<Input
								type='file'
								name='flacFile'
								id='flacFile'
								accept='.flac,audio/flac,audio/x-flac'
								className={cn(
									'cursor-pointer h-9 file:h-full file:border-0',
									'file:bg-transparent file:cursor-pointer',
									'flex items-center justify-between',
									errors?.flacFile
										? 'border-destructive focus-visible:ring-destructive'
										: ''
								)}
							/>
							<Music2 className='absolute right-3 top-1/2 transform -translate-y-1/2 text-muted w-4 h-auto aspect-square' />
						</div>

						<p className='text-muted text-sm'>
							Upload your track in FLAC format for best quality (max 50MB)
						</p>

						<ErrorMessage errors={errors?.flacFile} />
					</div>
				</div>
			</div>
		</div>
	);
}
