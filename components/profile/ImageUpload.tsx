'use client';

import { PlusCircle, Check, X } from 'lucide-react';
import React, { useCallback, useState } from 'react';
import { Icons } from '../icons/profile-icons';
import { Label } from '../ui/label';
import NextImage from 'next/image';
import ErrorMessage from '../ErrorMessage';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import Cropper, { Area, Point } from 'react-easy-crop';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { DialogDescription, DialogTitle } from '@radix-ui/react-dialog';

interface ImageUploadProps {
	initialData?: string;
	name: string;
	error?: string[] | undefined;
	type?: 'circle' | 'square';
	size?: 'default' | 'lg';
	message?: string;
	label?: string;
	onImageChange?: (dataUrl: string) => void;
}

export default function ImageUpload({
	initialData,
	name,
	error,
	type = 'circle',
	size = 'default',
	message = 'Upload your image, max. 1mb',
	label = 'Image Upload',
	onImageChange,
}: ImageUploadProps) {
	const [preview, setPreview] = useState<string | null>(initialData || null);
	const [showCropper, setShowCropper] = useState(false);
	const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
	const [zoom, setZoom] = useState(1);
	const [originalImage, setOriginalImage] = useState<string | null>(null);
	const [croppedAreaPixels, setCroppedAreaPixels] = useState<Area | null>(null);

	const createImage = (url: string): Promise<HTMLImageElement> =>
		new Promise((resolve, reject) => {
			const image = new window.Image();
			image.addEventListener('load', () => resolve(image));
			image.addEventListener('error', (error) => reject(error));
			image.setAttribute('crossOrigin', 'anonymous');
			image.src = url;
		});

	const handleImageChange = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			const file = e.target.files?.[0];
			if (file) {
				if (file.size > 2 * 1024 * 1024) {
					alert('File size must be less than 2MB');
					return;
				}
				const reader = new FileReader();
				reader.onloadend = () => {
					const result = reader.result as string;
					setOriginalImage(result);
					setShowCropper(true);
				};
				reader.readAsDataURL(file);
			}
		},
		[]
	);

	const onCropComplete = useCallback(
		(croppedArea: Area, croppedAreaPixels: Area) => {
			setCroppedAreaPixels(croppedAreaPixels);
		},
		[]
	);

	const handleCropConfirm = useCallback(async () => {
		const getCroppedImg = async (
			imageSrc: string,
			pixelCrop: Area
		): Promise<string> => {
			try {
				const image = await createImage(imageSrc);
				const canvas = document.createElement('canvas');
				const ctx = canvas.getContext('2d');

				if (!ctx) {
					throw new Error('No 2d context');
				}

				// Use the width as both dimensions to ensure square output
				const size = pixelCrop.width;
				canvas.width = size;
				canvas.height = size;

				ctx.drawImage(
					image,
					pixelCrop.x,
					pixelCrop.y,
					pixelCrop.width,
					pixelCrop.height,
					0,
					0,
					size,
					size
				);

				return new Promise((resolve, reject) => {
					canvas.toBlob(
						(blob) => {
							if (!blob) {
								reject(new Error('Canvas is empty'));
								return;
							}
							const reader = new FileReader();
							reader.readAsDataURL(blob);
							reader.onloadend = () => {
								if (reader.result && typeof reader.result === 'string') {
									resolve(reader.result);
								} else {
									reject(new Error('Failed to convert blob to base64'));
								}
							};
						},
						'image/jpeg',
						0.9
					);
				});
			} catch (e) {
				console.error('Error in getCroppedImg:', e);
				throw e;
			}
		};

		try {
			if (!originalImage || !croppedAreaPixels) {
				console.error('Missing originalImage or croppedAreaPixels');
				return;
			}

			const croppedImage = await getCroppedImg(
				originalImage,
				croppedAreaPixels
			);
			setPreview(croppedImage);
			onImageChange?.(croppedImage);
			setShowCropper(false);
			setOriginalImage(null);
		} catch (e) {
			console.error('Error in handleCropConfirm:', e);
		}
	}, [originalImage, croppedAreaPixels, onImageChange]);

	const previewSize = size === 'default' ? 'w-28' : 'w-36';

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

			<Dialog open={showCropper} onOpenChange={setShowCropper}>
				<DialogDescription className='sr-only'>image upload</DialogDescription>
				<DialogTitle className='sr-only'>image upload</DialogTitle>
				<DialogContent className='sm:max-w-[600px]'>
					<div className='relative w-full h-[400px]'>
						{originalImage && (
							<Cropper
								image={originalImage}
								crop={crop}
								zoom={zoom}
								aspect={1} // Fixed square aspect ratio
								onCropChange={setCrop}
								onZoomChange={setZoom}
								onCropComplete={onCropComplete}
								classes={{
									containerClassName: 'h-full',
								}}
								objectFit='contain'
							/>
						)}
					</div>
					<div className='flex gap-2 mt-4'>
						<Button
							onClick={handleCropConfirm}
							className='flex items-center gap-2'
							type='button'
						>
							<Check className='w-4 h-4' />
							Apply Crop
						</Button>
						<Button
							variant='outline'
							onClick={() => {
								setShowCropper(false);
								setOriginalImage(null);
							}}
							className='flex items-center gap-2'
							type='button'
						>
							<X className='w-4 h-4' />
							Cancel
						</Button>
					</div>
				</DialogContent>
			</Dialog>

			<div
				className='flex gap-4 items-center cursor-pointer'
				onClick={() => document.getElementById(name)?.click()}
			>
				{preview ? (
					<div className={cn(previewSize, 'aspect-square')}>
						<NextImage
							src={preview}
							alt='Uploaded image'
							width={500}
							height={500}
							className={cn(
								'border border-foreground mt-2 w-full h-full',
								type === 'circle' ? 'rounded-full' : 'rounded-md'
							)}
							style={{ objectFit: 'cover' }}
						/>
					</div>
				) : (
					<div
						className={cn(
							'h-auto aspect-square border border-foreground mt-2 flex items-center justify-center cursor-pointer',
							type === 'circle' ? 'rounded-full' : 'rounded-md',
							previewSize
						)}
					>
						<Icons.image className='w-8 h-auto aspect-square' />
					</div>
				)}
				<div className='flex gap-2 items-center'>
					<PlusCircle className='w-6 h-auto aspect-square' />
					<p className='text-muted text-sm max-w-lg'>{message}</p>
				</div>
			</div>
			<ErrorMessage errors={error} />
		</div>
	);
}

// 'use client';

// import { PlusCircle } from 'lucide-react';
// import React, { useCallback, useEffect, useState } from 'react';
// import { Icons } from '../icons/profile-icons';
// import { Label } from '../ui/label';
// import Image from 'next/image';
// import ErrorMessage from '../ErrorMessage';
// import { cn } from '@/lib/utils';

// export default function ImageUpload({
// 	initialData,
// 	name,
// 	error,
// 	type = 'circle',
// 	size = 'default',
// 	message = 'Upload your profile image, max. 1mb',
// 	label = 'User Image',
// }: {
// 	name: string;
// 	initialData?: string;
// 	error?: string[] | undefined;
// 	type?: 'circle' | 'square';
// 	message?: string;
// 	label?: string;
// 	size?: 'default' | 'lg';
// }) {
// 	const [preview, setPreview] = useState<string | null>(initialData || null);

// 	useEffect(() => {
// 		if (initialData) setPreview(initialData);
// 	}, [initialData]);

// 	const handleImageChange = useCallback(
// 		(e: React.ChangeEvent<HTMLInputElement>) => {
// 			const file = e.target.files?.[0];
// 			if (file) {
// 				const reader = new FileReader();
// 				reader.onloadend = () => {
// 					setPreview(reader.result as string);
// 				};
// 				reader.readAsDataURL(file);
// 			} else {
// 				setPreview(null);
// 			}
// 		},
// 		[]
// 	);
// 	return (
// 		<div className='grid gap-2'>
// 			<Label className={error ? 'text-destructive' : ''}>{label}</Label>
// 			<input
// 				id={name}
// 				name={name}
// 				type='file'
// 				onChange={handleImageChange}
// 				className='hidden'
// 				accept='image/*'
// 			/>
// 			<div
// 				className='flex gap-4 items-center cursor-pointer'
// 				onClick={() => document.getElementById(name)?.click()}
// 			>
// 				{preview ? (
// 					<Image
// 						src={preview}
// 						alt='Avatar'
// 						width={size === 'default' ? 112 : 144}
// 						height={size === 'default' ? 112 : 144}
// 						className={cn(
// 							'border border-foreground mt-2',
// 							type === 'circle' ? 'rounded-full' : 'rounded-md'
// 						)}
// 						style={{ aspectRatio: '96/96', objectFit: 'cover' }}
// 					/>
// 				) : (
// 					<div
// 						className={cn(
// 							'h-auto aspect-square border border-foreground mt-2 flex items-center justify-center cursor-pointer',
// 							type === 'circle' ? 'rounded-full' : 'rounded-md',
// 							size === 'default' ? 'w-28' : 'w-36'
// 						)}
// 					>
// 						<Icons.image className='w-8 h-auto aspect-square' />
// 					</div>
// 				)}
// 				<div className='flex gap-2 items-center'>
// 					<PlusCircle className='w-6 h-auto aspect-square ' />

// 					<p className='text-muted text-sm max-w-lg'>{message}</p>
// 				</div>
// 			</div>
// 			<ErrorMessage errors={error} />
// 		</div>
// 	);
// }
