'use client';

import React, { useCallback, useEffect, useState } from 'react';
import { Icons } from '../icons/profile-icons';
import { Label } from '../ui/label';
import Image from 'next/image';
import ErrorMessage from '../ErrorMessage';
import { cn } from '@/lib/utils';

export default function StudioImageUpload({
	initialData,
	name,
	error,
	type = 'circle',
	size = 'lg',
	message = 'Upload your profile image, max. 1mb',
	label = 'User Image',
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

	const handleImageChange = useCallback(
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
				onChange={handleImageChange}
				className='hidden'
				accept='image/*'
			/>
			<div
				className='flex gap-4 items-center cursor-pointer w-full max-w-lg '
				onClick={() => document.getElementById(name)?.click()}
			>
				{preview ? (
					<Image
						src={preview}
						alt='Avatar'
						width={size === 'default' ? 500 : 500}
						height={size === 'default' ? 500 : 500}
						className={cn(
							'border border-foreground mt-2 w-full aspect-video',
							type === 'circle' ? 'rounded-full' : 'rounded-xl'
						)}
						style={{ objectFit: 'cover' }}
					/>
				) : (
					<div
						className={cn(
							'h-auto border border-foreground mt-2 flex items-center justify-center cursor-pointer w-full aspect-video',
							type === 'circle' ? 'rounded-full' : 'rounded-xl'
						)}
					>
						<Icons.image className='w-12 h-auto aspect-video' />
					</div>
				)}
			</div>
			<p className='text-sm text-muted'>{message}</p>
			<ErrorMessage errors={error} />
		</div>
	);
}
