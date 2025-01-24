import { TabsContent } from '@/components/ui/tabs';
import React from 'react';
import CollapsibleText from '../CollapsibleText';
import { ArtistDetails } from '@/db/artist';
import ArtistLink from './ArtistLink';
import ArtistArticles from './ArtistArticles';

export default function ArtistBio({ artist }: { artist: ArtistDetails }) {
	return (
		<TabsContent value='bio'>
			<main>
				<div className='space-y-8 '>
					<div className='flex flex-col gap-y-6 xl:flex-row gap-x-12 '>
						<div className='max-w-2xl xl:w-2/3 space-y-8'>
							<CollapsibleText text={artist?.bio || 'No bio available'} />

							{artist.socialLinks && (
								<ArtistLink socialLinks={artist.socialLinks} />
							)}
						</div>

						<ArtistArticles articles={artist?.articles} />
					</div>
				</div>
			</main>
		</TabsContent>
	);
}
