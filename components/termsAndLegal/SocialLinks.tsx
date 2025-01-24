import React from 'react';
import { Icons } from '../icons/socials';
import Link from 'next/link';
import { getSocialLinks } from '@/db/section';

export default async function SocialLinks() {
	const socialLinks = await getSocialLinks();

	if (socialLinks.error || !socialLinks.data) {
		return null;
	}

	return (
		<div>
			<h1 className='text-xl font-semibold text-primary-foreground mb-4'>
				Find us on social media
			</h1>
			<div className='flex gap-4 items-center'>
				{socialLinks.data.facebook && (
					<Link href={socialLinks.data.facebook} target='_blank'>
						<Icons.facebook className='w-8 h-auto aspect-square text-foreground cursor-pointer hover:text-primary-foreground transition-colors duration-200 ease-out' />
					</Link>
				)}
				{socialLinks.data.instagram && (
					<Link href={socialLinks.data.instagram} target='_blank'>
						<Icons.instagram className='w-8 h-auto aspect-square text-foreground cursor-pointer hover:text-primary-foreground transition-colors duration-200 ease-out' />
					</Link>
				)}
				{socialLinks.data.linkedin && (
					<Link href={socialLinks.data.linkedin} target='_blank'>
						<Icons.linkedin className='w-8 h-auto aspect-square text-foreground cursor-pointer hover:text-primary-foreground transition-colors duration-200 ease-out' />
					</Link>
				)}
				{socialLinks.data.mastodon && (
					<Link href={socialLinks.data.mastodon} target='_blank'>
						<Icons.mastodon className='w-8 h-auto aspect-square text-foreground fill-foreground cursor-pointer hover:text-primary-foreground transition-colors duration-200 ease-out hover:fill-primary-foreground' />
					</Link>
				)}
				{socialLinks.data.youtube && (
					<Link href={socialLinks.data.youtube} target='_blank'>
						<Icons.youtube className='w-8 h-auto aspect-square text-foreground fill-foreground cursor-pointer hover:text-primary-foreground transition-colors duration-200 ease-out hover:fill-primary-foreground' />
					</Link>
				)}
				{socialLinks.data.website && (
					<Link href={socialLinks.data.website} target='_blank'>
						<Icons.world className='w-8 h-auto aspect-square text-foreground fill-foreground cursor-pointer hover:text-primary-foreground hover:fill-primary-foreground transition-colors duration-200 ease-out' />
					</Link>
				)}
			</div>
		</div>
	);
}
