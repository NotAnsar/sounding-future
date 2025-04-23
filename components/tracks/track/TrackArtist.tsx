'use client';
import ArtistLink from '@/components/artists/ArtistLink';
import { TabsContent } from '@/components/ui/tabs';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TrackDetails } from '@/db/tracks';
import { cn } from '@/lib/utils';
import Image from 'next/image';
import Link from 'next/link';
import React, { useState } from 'react';

export default function TrackArtistDetails({
	artists,
}: {
	artists: TrackDetails['artists'];
}) {
	const [activeArtist, setActiveArtist] = useState<string | null>(
		artists && artists.length > 0 ? artists[0].artist.id : null
	);

	return (
		<TabsContent value='artist' className='space-y-8'>
			{artists && artists.length > 0 ? (
				<div>
					<Tabs
						value={activeArtist || ''}
						onValueChange={setActiveArtist}
						className='w-full'
					>
						<TabsList className='mb-6 flex-wrap gap-3 justify-start'>
							{artists.map((artistItem) => (
								<TabsTrigger
									key={artistItem.artist.id}
									value={artistItem.artist.id}
									className='px-4 py-2 max-w-[200px] truncate '
									title={artistItem.artist.name}
								>
									{artistItem.artist.name}
								</TabsTrigger>
							))}
						</TabsList>

						{artists.map((artistItem) => {
							const artist = artistItem.artist;
							return (
								<div
									key={artist.id}
									className={cn(
										'transition-all duration-300',
										activeArtist === artist.id ? 'block' : 'hidden'
									)}
								>
									{artist.pic && (
										<div className='max-w-2xl mb-6'>
											<Image
												className='w-full rounded-3xl aspect-video object-cover'
												src={artist.pic}
												width={500}
												height={500}
												alt={artist.name}
											/>
										</div>
									)}

									<p
										className={cn(
											'text-pretty leading-7 max-w-2xl',
											!artist.bio && 'text-muted'
										)}
									>
										{artist.bio || 'No bio available'}
									</p>

									{'socialLinks' in artist && artist.socialLinks && (
										<div className='my-6'>
											<ArtistLink socialLinks={artist.socialLinks} />
										</div>
									)}

									{'articles' in artist &&
										artist.articles &&
										artist.articles.length > 0 && (
											<div className='mt-6'>
												<h3 className='text-xl font-semibold text-primary-foreground mb-4'>
													Sounding Future articles
												</h3>
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
								</div>
							);
						})}
					</Tabs>
				</div>
			) : (
				<p className='text-muted'>No artist information available</p>
			)}
		</TabsContent>
	);
}
