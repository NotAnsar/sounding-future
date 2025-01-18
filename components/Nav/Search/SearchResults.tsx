'use client';

import React, { useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Artist } from '@prisma/client';
import { SearchedTrack } from '@/db/search';

interface SearchResultsProps {
	searchResults: {
		artists: Artist[];
		tracks: SearchedTrack[];
	};
	onClose: (reset?: boolean) => void;

	searchRef: React.RefObject<HTMLDivElement>;
}

export default function SearchResults({
	searchResults,
	onClose,
	searchRef,
}: SearchResultsProps) {
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				searchRef.current &&
				!searchRef.current.contains(event.target as Node)
			) {
				onClose(false);
			}
		};

		document.addEventListener('mousedown', handleClickOutside);
		return () => {
			document.removeEventListener('mousedown', handleClickOutside);
		};
	}, [onClose, searchRef]);

	return (
		<div className='absolute z-10 w-full mt-2 bg-player rounded-xl border border-background max-h-96 overflow-y-auto'>
			{searchResults.artists.length === 0 &&
				searchResults.tracks.length === 0 && (
					<div className='p-4'>
						<p className='text-muted text-sm'>No results found</p>
					</div>
				)}
			{searchResults.artists.length > 0 && (
				<div className='p-4'>
					<h3 className=' text-sm font-semibold mb-2'>Artists</h3>
					{searchResults.artists.map((artist) => (
						<Link
							key={artist.id}
							href={`/artists/${artist.slug}`}
							className='flex items-center gap-3 p-2 hover:bg-white/10 rounded-lg cursor-pointer'
							onClick={() => onClose()}
						>
							{artist?.pic ? (
								<Image
									src={artist?.pic}
									alt={artist?.name}
									className='w-10 h-10 rounded-full object-cover'
									height={40}
									width={40}
								/>
							) : (
								<div className='min-w-10 max-w-10  h-auto aspect-square object-cover transition-all hover:scale-105 cursor-pointer border-border bg-muted rounded-full' />
							)}
							<span>{artist.name}</span>
						</Link>
					))}
				</div>
			)}

			{searchResults.tracks.length > 0 && (
				<div className='p-4'>
					<h3 className='text-sm font-semibold mb-2'>Tracks</h3>
					{searchResults.tracks.map((track) => (
						<Link
							key={track.id}
							href={`/tracks/${track.slug}`}
							className='flex items-center gap-3 p-2 hover:bg-white/10 rounded-lg cursor-pointer'
							onClick={() => onClose()}
						>
							<Image
								src={track.cover}
								alt={track.title}
								height={40}
								width={40}
								className='w-10 h-10 rounded-lg object-cover'
							/>
							<div>
								<p>{track.title}</p>
								<p className='text-muted text-sm'>{track.artist.name}</p>
							</div>
						</Link>
					))}
				</div>
			)}
		</div>
	);
}
