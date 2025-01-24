import ArtistLink from '@/components/artists/ArtistLink';
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
						className='w-full rounded-3xl aspect-video object-cover '
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
			{artist?.socialLinks && <ArtistLink socialLinks={artist.socialLinks} />}

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
