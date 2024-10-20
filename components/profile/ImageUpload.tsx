'use client';

import { PlusCircle } from 'lucide-react';
import React, { useCallback, useEffect, useState } from 'react';
import { Icons } from '../icons/profile-icons';
import { Label } from '../ui/label';
import Image from 'next/image';
import ErrorMessage from '../ErrorMessage';
import { cn } from '@/lib/utils';

export default function ImageUpload({
	initialData,
	name,
	error,
	type = 'circle',
	size = 'default',
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
				className='flex gap-4 items-center cursor-pointer'
				onClick={() => document.getElementById(name)?.click()}
			>
				{preview ? (
					<Image
						src={preview}
						alt='Avatar'
						width={size === 'default' ? 112 : 144}
						height={size === 'default' ? 112 : 144}
						className={cn(
							'border border-foreground mt-2',
							type === 'circle' ? 'rounded-full' : 'rounded-md'
						)}
						style={{ aspectRatio: '96/96', objectFit: 'cover' }}
					/>
				) : (
					<div
						className={cn(
							'h-auto aspect-square border border-foreground mt-2 flex items-center justify-center cursor-pointer',
							type === 'circle' ? 'rounded-full' : 'rounded-md',
							size === 'default' ? 'w-28' : 'w-36'
						)}
					>
						<Icons.image className='w-8 h-auto aspect-square' />
					</div>
				)}
				<div className='flex gap-2 items-center'>
					<PlusCircle className='w-6 h-auto aspect-square ' />

					<p className='text-muted text-sm max-w-lg'>{message}</p>
				</div>
			</div>
			<ErrorMessage errors={error} />
		</div>
	);
}
