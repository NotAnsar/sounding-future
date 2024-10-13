'use client';

import { PlusCircle } from 'lucide-react';
import React, { useCallback, useEffect, useState } from 'react';
import { Icons } from '../icons/profile-icons';
import { Label } from '../ui/label';
import Image from 'next/image';
import ErrorMessage from '../ErrorMessage';

export default function ImageUpload({
	initialData,
	name,
	error,
}: {
	name: string;
	initialData?: string;
	error?: string[] | undefined;
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
			<Label className={error ? 'text-destructive' : ''}>User image</Label>
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
						width={112}
						height={112}
						className='rounded-full border border-foreground '
						style={{ aspectRatio: '96/96', objectFit: 'cover' }}
					/>
				) : (
					<div className='w-28 h-auto aspect-square rounded-full border border-foreground mt-2 flex items-center justify-center cursor-pointer'>
						<Icons.image className='w-8 h-auto aspect-square' />
					</div>
				)}
				<div className='flex gap-2 items-center'>
					<PlusCircle className='w-6 h-auto aspect-square ' />

					<p className='text-muted text-sm'>
						Upload your profile image, max. 1mb
					</p>
				</div>
			</div>
			<ErrorMessage errors={error} />
		</div>
	);
}
