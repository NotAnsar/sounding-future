'use client';

import Image from 'next/image';
import { useState, useCallback, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { User, Trash2 } from 'lucide-react';
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from '@/components/ui/alert-dialog';

interface ProfileImageInputProps {
	initialData?: string;
	error?: string[] | undefined;
	name: string;
	userFullName: string;
}

export default function ProfileImageInput({
	initialData,
	name,
	userFullName,
}: ProfileImageInputProps) {
	const [preview, setPreview] = useState<string | null>(initialData || null);
	const [showDeleteDialog, setShowDeleteDialog] = useState(false);
	const [pendingDelete, setPendingDelete] = useState(false);

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

	const handleDeleteImage = () => {
		setPendingDelete(true);
		setPreview(null);
		setShowDeleteDialog(false);

		// Add a hidden input to track deletion state
		const input = document.createElement('input');
		input.type = 'hidden';
		input.name = 'deleteImage';
		input.value = 'true';
		document.querySelector('form')?.appendChild(input);
	};

	return (
		<div className='space-y-2'>
			<div className='flex space-x-5 items-center'>
				{preview ? (
					<div className='relative group'>
						<Image
							src={preview}
							alt='Avatar'
							width={128}
							height={128}
							className='rounded-full aspect-square object-cover'
						/>

						<Button
							className='w-32 h-auto aspect-square rounded-full flex items-center justify-center absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity '
							variant='destructive'
							type='button'
							onClick={() => setShowDeleteDialog(true)}
						>
							<Trash2 className='w-12 h-12' />
						</Button>
					</div>
				) : (
					<Button
						className='w-32 h-auto aspect-square rounded-full flex items-center justify-center'
						variant='outline'
						type='button'
						onClick={() => document.getElementById(name)?.click()}
					>
						<User className='w-12 h-12' />
					</Button>
				)}

				<div className='space-y-1'>
					<h1 className='text-2xl font-bold'>{userFullName}</h1>
					<Button
						size='sm'
						type='button'
						onClick={() => document.getElementById(name)?.click()}
					>
						Change photo
					</Button>
				</div>
			</div>

			<input
				id={name}
				name={name}
				type='file'
				onChange={handleImageChange}
				className='hidden'
				accept='image/*'
			/>

			{pendingDelete && <input type='hidden' name='deleteImage' value='true' />}

			<AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Delete Profile Picture</AlertDialogTitle>
						<AlertDialogDescription>
							Are you sure you want to delete your profile picture? This action
							cannot be undone.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction
							onClick={handleDeleteImage}
							className='bg-destructive text-destructive-foreground hover:bg-destructive/90'
						>
							Delete
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</div>
	);
}
