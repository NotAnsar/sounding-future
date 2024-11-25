import { Icons } from '@/components/icons/socials';
import { TabsContent } from '@/components/ui/tabs';
import React from 'react';
import CollapsibleText from '../CollapsibleText';
import { ArtistDetails } from '@/db/artist';
import Link from 'next/link';

export default function ArtistBio({ artist }: { artist: ArtistDetails }) {
	return (
		<TabsContent value='bio'>
			<main>
				<div className='space-y-8 '>
					<div className='flex flex-col gap-y-6 xl:flex-row gap-x-12 '>
						<div className='max-w-2xl xl:w-2/3 space-y-8'>
							<CollapsibleText text={artist?.bio || 'No bio available'} />

							{artist?.socialLinks && (
								<div>
									<h1 className='text-xl font-semibold text-primary-foreground mb-4'>
										Artist Links
									</h1>
									<div className='flex gap-4 items-center'>
										{artist?.socialLinks?.facebook && (
											<Link
												href={artist?.socialLinks?.facebook}
												target='_blank'
											>
												<Icons.facebook className='w-9 h-auto aspect-square text-foreground cursor-pointer' />
											</Link>
										)}
										{artist?.socialLinks?.instagram && (
											<Link
												href={artist?.socialLinks?.instagram}
												target='_blank'
											>
												<Icons.instagram className='w-9 h-auto aspect-square text-foreground cursor-pointer' />
											</Link>
										)}
										{artist?.socialLinks?.linkedin && (
											<Link
												href={artist?.socialLinks?.linkedin}
												target='_blank'
											>
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
						</div>

						<div>
							<h1 className='text-xl font-semibold text-primary-foreground mb-4'>
								Sounding Future articles
							</h1>
							{artist?.articles.length === 0 && (
								<p className='text-muted'>No articles available</p>
							)}
							<ul className='space-y-2'>
								{artist?.articles.map((a) => (
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
					</div>
				</div>
			</main>
		</TabsContent>
	);
}
