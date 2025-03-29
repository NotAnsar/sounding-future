'use client';

import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import Link from 'next/link';
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { HelpCenterVideo } from '@prisma/client';
import { usePathname, useRouter } from 'next/navigation';

export default function WelcomeHelpDialog({
	videoData,
}: {
	videoData: HelpCenterVideo;
}) {
	const [open, setOpen] = useState(true);
	const closeButtonClicked = useRef(false);
	const router = useRouter();
	const pathname = usePathname();

	const handleOpenChange = (newOpen: boolean) => {
		// If trying to close the dialog
		if (newOpen === false) {
			// Check if this is from a button or outside click
			if (closeButtonClicked.current) {
				// It's a button click, allow closing
				closeButtonClicked.current = false; // Reset for next time
				setOpen(false);
			} else {
				// It's an outside click, prevent closing
				return;
			}
		} else {
			setOpen(newOpen);
		}
	};

	// Function to handle explicit close button clicks
	const handleCloseClick = () => {
		closeButtonClicked.current = true;
		setOpen(false);
		// Remove welcome parameter from URL
		router.replace(pathname);
	};

	const noAnimationStyle = {
		animation: 'none',
		transition: 'none',
	};

	return (
		<Dialog open={open} onOpenChange={handleOpenChange}>
			<DialogContent className='max-w-xl bg-player' style={noAnimationStyle}>
				<DialogHeader>
					<DialogTitle className='text-3xl font-bold'>
						{videoData.title}
					</DialogTitle>
				</DialogHeader>

				{/* Custom close button that overlays the default one */}
				<button
					onClick={handleCloseClick}
					className='absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground'
					style={{ zIndex: 10 }} // Ensure it appears above the default button
				>
					<svg
						xmlns='http://www.w3.org/2000/svg'
						width='24'
						height='24'
						viewBox='0 0 24 24'
						fill='none'
						stroke='currentColor'
						strokeWidth='2'
						strokeLinecap='round'
						strokeLinejoin='round'
						className='h-4 w-4'
					>
						<line x1='18' y1='6' x2='6' y2='18'></line>
						<line x1='6' y1='6' x2='18' y2='18'></line>
					</svg>
					<span className='sr-only'>Close</span>
				</button>

				<div className='space-y-6'>
					<p>{videoData.description}</p>

					<div className='aspect-video relative w-full mt-2 rounded-lg overflow-hidden'>
						<video
							src={videoData.videoUrl}
							poster={videoData.thumbnailUrl || undefined}
							controls
							className='absolute inset-0 w-full h-full object-cover'
							preload='metadata'
							autoPlay
						>
							Your browser does not support the video tag.
						</video>
					</div>

					<div className='space-y-1 text-[15px] text-muted'>
						<p>Want to upload your own tracks as an artist? </p>

						<p>
							Check out other{' '}
							<Link href={'/help-center'} className='hover:underline font-bold'>
								Videos
							</Link>{' '}
							for creators in our{' '}
							<Link href={'/help-center'} className='hover:underline font-bold'>
								Help Center!
							</Link>{' '}
						</p>
					</div>

					<div className='flex justify-end mt-4 space-x-3'>
						<Button
							variant='input'
							className='border-muted text-muted hover:bg-muted/20 transition-colors'
							onClick={handleCloseClick}
						>
							Close
						</Button>
						<Button>
							<Link href='/help-center'>Go to Help Center</Link>
						</Button>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}
