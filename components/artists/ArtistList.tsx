import { cn } from '@/lib/utils';
import Image from 'next/image';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import Link from 'next/link';
import { type ArtistList } from '@/db/artist';
import FollowForm from '../FollowForm';

export default function ArtistList({
	followedArtists,
	artists,
	className,
}: {
	followedArtists?: ArtistList[];
	artists: ArtistList[];
	className?: string;
}) {
	return (
		<div className={cn(className)}>
			<Table>
				<TableBody>
					{artists.length === 0 && (
						<p className='text-base text-muted'>No artists found</p>
					)}
					{artists.map((artist, index) => {
						const tracksCount = artist._count.tracks;

						const artistTracks = `${tracksCount} track${
							tracksCount !== 1 ? 's' : ''
						}`;

						return (
							<TableRow
								key={index}
								className={cn('hover:bg-player/50 border-none group')}
							>
								<TableCell className='w-16 relative'>
									{artist?.pic ? (
										<Image
											src={artist.pic}
											alt={artist.name}
											width={64}
											height={64}
											className=' min-w-16 max-w-16 h-auto aspect-square object-cover border border-border rounded-full'
										/>
									) : (
										<div className='min-w-16 max-w-16  h-auto aspect-square object-cover transition-all hover:scale-105 cursor-pointer border-border bg-muted rounded-full' />
									)}
								</TableCell>
								<TableCell>
									<Link
										href={`/artists/${artist.slug}?sort=bio`}
										className={cn(
											'text-base font-semibold line-clamp-1 hover:opacity-80'
										)}
									>
										{artist.name}
									</Link>
									<Link
										href={`/artists/${artist.slug}`}
										className='text-sm font-medium text-muted line-clamp-1 sm:hidden block'
									>
										{artistTracks}
									</Link>
								</TableCell>
								<TableCell className='hidden sm:table-cell'>
									<Link
										href={`/artists/${artist.slug}`}
										className={cn(
											'text-base font-semibold hover:opacity-80 text-nowrap'
										)}
									>
										{artistTracks}
									</Link>
								</TableCell>

								<TableCell>
									<ul>
										{artist?.genres?.map((genre) => (
											<li
												key={genre?.genreId}
												className='font-medium text-muted text-[15px]'
											>
												{genre?.genre?.name}
											</li>
										))}
									</ul>
								</TableCell>

								{followedArtists && (
									<TableCell>
										<FollowForm
											artistId={artist.id}
											followed={followedArtists.some(
												(followed) => followed.id === artist.id
											)}
											className='min-w-6 w-6 sm:min-w-7 sm:w-7 h-auto '
										/>
									</TableCell>
								)}
							</TableRow>
						);
					})}
				</TableBody>
			</Table>
		</div>
	);
}
