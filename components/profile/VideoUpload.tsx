'use client';

import React, { useCallback, useEffect, useState } from 'react';

import { Label } from '../ui/label';
import ErrorMessage from '../ErrorMessage';
import { cn } from '@/lib/utils';
import { TvMinimalPlay } from 'lucide-react';

export default function StudioVideoUpload({
	initialData,
	name,
	error,
	type = 'square',
	message = 'Upload your video, max. 10mb',
	label = 'Video',
}: {
	name: string;
	initialData?: string;
	error?: string[] | undefined;
	type?: 'circle' | 'square';
	message?: string;
	label?: string;
	size?: 'default' | 'lg';
}) {
	const [preview, setPreview] = useState<string | null>(initialData || null);

	useEffect(() => {
		if (initialData) setPreview(initialData);
	}, [initialData]);

	const handleVideoChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			const file = e.target.files?.[0];
			if (file) {
				const reader = new FileReader();
				reader.onloadend = () => {
					setPreview(reader.result as string);
				};
				reader.readAsDataURL(file);
			} else {
				setPreview(null);
			}
		},
		[]
	);
	return (
		<div className='grid gap-2'>
			<Label className={error ? 'text-destructive' : ''}>{label}</Label>
			<input
				id={name}
				name={name}
				type='file'
				onChange={handleVideoChange}
				className='hidden'
				accept='video/*'
			/>
			<div
				className='flex gap-4 items-center cursor-pointer w-full max-w-lg'
				onClick={() => document.getElementById(name)?.click()}
			>
				{preview ? (
					<video
						src={preview}
						controls
						className={cn(
							'border border-foreground mt-2 w-full aspect-video',
							type === 'circle' ? 'rounded-full' : 'rounded-xl'
						)}
					/>
				) : (
					<div
						className={cn(
							'h-auto border border-foreground mt-2 flex items-center justify-center cursor-pointer w-full aspect-video',
							type === 'circle' ? 'rounded-full' : 'rounded-xl'
						)}
					>
						<TvMinimalPlay className='w-8 h-auto stroke-[1px]' />
					</div>
				)}
			</div>
			<p className='text-sm text-muted'>{message}</p>
			<ErrorMessage errors={error} />
		</div>
	);
}
