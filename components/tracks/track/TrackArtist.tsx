import { Icons } from '@/components/icons/socials';
import { TabsContent } from '@/components/ui/tabs';
import { ArtistDetails as ArtistDetailsType } from '@/db/tracks';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

export default function TrackArtistDetails({
	artist,
}: {
	artist: ArtistDetailsType;
}) {
	return (
		<TabsContent value='artist' className='space-y-8'>
			{artist?.pic && (
				<div className='max-w-2xl '>
					<Image
						className='w-full rounded-3xl aspect-video object-cover'
						src={artist?.pic}
						width={500}
						height={500}
						alt={artist?.name}
					/>
				</div>
			)}
			<p
				className={cn(
					'text-pretty leading-7 max-w-2xl',
					!artist?.bio && 'text-muted'
				)}
			>
				{artist?.bio || 'No bio available'}
			</p>
			{artist?.socialLinks && (
				<div>
					<h1 className='text-xl font-semibold text-primary-foreground mb-4'>
						Artist Links
					</h1>
					<div className='flex gap-4 items-center'>
						{artist?.socialLinks?.facebook && (
							<Link href={artist?.socialLinks?.facebook} target='_blank'>
								<Icons.facebook className='w-9 h-auto aspect-square text-foreground cursor-pointer' />
							</Link>
						)}
						{artist?.socialLinks?.instagram && (
							<Link href={artist?.socialLinks?.instagram} target='_blank'>
								<Icons.instagram className='w-9 h-auto aspect-square text-foreground cursor-pointer' />
							</Link>
						)}
						{artist?.socialLinks?.linkedin && (
							<Link href={artist?.socialLinks?.linkedin} target='_blank'>
								<Icons.linkedin className='w-9 h-auto aspect-square text-foreground cursor-pointer' />
							</Link>
						)}
						{artist?.socialLinks?.vimeo && (
							<Link href={artist?.socialLinks?.vimeo} target='_blank'>
								<Icons.linkedin className='w-9 h-auto aspect-square text-foreground cursor-pointer' />
							</Link>
						)}
						{artist?.socialLinks?.youtube && (
							<Link href={artist?.socialLinks?.youtube} target='_blank'>
								<Icons.youtube className='w-9 h-auto aspect-square text-foreground cursor-pointer' />
							</Link>
						)}
					</div>
				</div>
			)}

			{artist?.articles.length > 0 && (
				<div>
					<h1 className='text-xl font-semibold text-primary-foreground mb-4'>
						Sounding Future articles
					</h1>
					<ul className='space-y-2'>
						{artist.articles.map((a) => (
							<Link
								href={a?.article?.url}
								target='_blank'
								className='hover:underline cursor-pointer'
								key={a?.articleId}
							>
								{a?.article?.title}
							</Link>
						))}
					</ul>
				</div>
			)}
		</TabsContent>
	);
}
