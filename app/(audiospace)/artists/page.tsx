import ExploreArtists from '@/components/artists/ExploreArtists';
import HeaderBanner from '@/components/HeaderBanner';
import React from 'react';
import Link from 'next/link';
import { cn } from '@/lib/utils';
import { buttonVariants } from '@/components/ui/button';
import { Icons } from '@/components/icons/audio-player';
import ArtistList from '@/components/artists/ArtistList';
import { getArtistsList } from '@/db/artist';
import Error from '@/components/Error';
import { generateArtistsListingSchema } from '@/schema/artists-schema';

export async function generateMetadata() {
	const artists = await getArtistsList();

	if (artists.error) {
		return { title: 'Artists Not Found' };
	}

	return {
		title: 'Artists - Explore Our Audio Collection',
		description: 'Browse our collection of innovative audio artists',
		openGraph: {
			title: 'Artists - Explore Our Audio Collection',
			description: 'Browse our collection of innovative audio artists',
			images: ['/banners/artists.jpg'],
			type: 'website',
		},
		other: {
			'schema:collection-page': JSON.stringify(
				generateArtistsListingSchema(artists.data)
			),
		},
	};
}

export default async function page({
	searchParams: { type },
}: {
	searchParams: { type: string };
}) {
	const isTable = type === 'table';
	const artists = await getArtistsList();

	if (artists.error) {
		return <Error message={artists.message} />;
	}

	return (
		<>
			<script
				type='application/ld+json'
				key='structured-data'
				dangerouslySetInnerHTML={{
					__html: JSON.stringify(generateArtistsListingSchema(artists.data)),
				}}
			/>

			<HeaderBanner img={'/banners/artists.jpg'} title='Artists' />
			<div className='flex justify-between gap-1.5 mt-8 mb-6'>
				<h1 className='text-[22px] font-semibold text-primary-foreground '>
					Explore our artists
				</h1>
				<div className='flex gap-1 ml-auto sm:ml-0  '>
					<Link
						href={`?type=table`}
						className={cn(
							buttonVariants(),
							'bg-transparent p-1.5 sm:p-2 hover:bg-button group h-fit duration-200 transition-all shadow-none',
							isTable ? 'bg-button' : ''
						)}
					>
						<Icons.table
							className={cn(
								'w-5 sm:w-6 h-auto aspect-square text-foreground group-hover:text-white',
								isTable ? 'text-white' : ''
							)}
						/>
					</Link>
					<Link
						href={`?type=grid`}
						className={cn(
							buttonVariants(),
							'bg-transparent p-1.5 sm:p-2 hover:bg-button h-fit group shadow-none duration-200 transition-all',
							!isTable ? 'bg-button' : ''
						)}
					>
						<Icons.grid
							className={cn(
								'w-5 sm:w-6 h-auto aspect-square text-foreground group-hover:text-white shadow-none',
								!isTable ? 'text-white' : ''
							)}
						/>
					</Link>
				</div>
			</div>
			<div className='xl:w-2/3'>
				{isTable ? (
					<ArtistList artists={artists.data} />
				) : (
					<ExploreArtists artists={artists.data} />
				)}
			</div>
		</>
	);
}
