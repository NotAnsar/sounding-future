import React from 'react';
import { Icons } from '../icons/socials';
import Link from 'next/link';

export default function SocialLinks() {
	return (
		<div>
			<h1 className='text-xl font-semibold text-primary-foreground mb-4'>
				Find us on social media
			</h1>
			<div className='flex gap-4 items-center'>
				<Link
					href={'https://www.facebook.com/soundingfutureworld'}
					target='_blank'
				>
					<Icons.facebook className='w-8 h-auto aspect-square text-foreground cursor-pointer hover:text-primary-foreground transition-colors duration-200 ease-out' />
				</Link>
				<Link href={'https://www.instagram.com/soundingfuture'} target='_blank'>
					<Icons.instagram className='w-8 h-auto aspect-square text-foreground cursor-pointer hover:text-primary-foreground transition-colors duration-200 ease-out' />
				</Link>
				<Link
					href={'https://www.linkedin.com/company/soundingfuture/'}
					target='_blank'
				>
					<Icons.linkedin className='w-8 h-auto aspect-square text-foreground cursor-pointer hover:text-primary-foreground transition-colors duration-200 ease-out' />
				</Link>
				<Link href={'https://mastodon.social/@soundingfuture'} target='_blank'>
					<Icons.mastodon className='w-8 h-auto aspect-square text-foreground fill-foreground cursor-pointer hover:text-primary-foreground transition-colors duration-200 ease-out' />
				</Link>
			</div>
		</div>
	);
}
