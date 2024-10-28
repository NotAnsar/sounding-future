import { cn } from '@/lib/utils';
import Image from 'next/image';
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table';
import Link from 'next/link';
import { Artist, tracks } from '@/config/dummy-data';
import { Icons } from '../icons/track-icons';

export default function ArtistList({
	artists,
	className,
}: {
	artists: Artist[];
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
						const tracksCount = tracks.filter(
							(a) => a.artist.id === artist.id
						).length;

						const artistTracks = `${tracksCount} track${
							tracksCount !== 1 ? 's' : ''
						}`;

						return (
							<TableRow
								key={index}
								className={cn('hover:bg-player/50 border-none group')}
							>
								<TableCell className='w-16 relative'>
									<Image
										src={artist.picture}
										alt={artist.name}
										width={64}
										height={64}
										className=' min-w-16 max-w-16 h-auto aspect-square object-cover border border-border rounded-full'
									/>
								</TableCell>
								<TableCell>
									<Link
										href={`/artists/${artist.id}?sort=bio`}
										className={cn(
											'text-base font-semibold line-clamp-1 hover:opacity-80'
										)}
									>
										{artist.name}
									</Link>
									<Link
										href={`/artists/${artist.id}`}
										className='text-sm font-medium text-muted line-clamp-1 sm:hidden block'
									>
										{artistTracks}
									</Link>
								</TableCell>
								<TableCell className='hidden sm:table-cell'>
									<Link
										href={`/artists/${artist.id}`}
										className={cn('text-base font-semibold hover:opacity-80')}
									>
										{artistTracks}
									</Link>
								</TableCell>

								<TableCell className='hidden sm:table-cell'>
									<ul>
										{artist.genres.map((genre) => (
											<li
												key={genre.id}
												className='font-medium text-muted text-[15px]'
											>
												{genre.name}
											</li>
										))}
									</ul>
								</TableCell>

								<TableCell>
									{+artist.id % 2 == 0 ? (
										<Icons.follow
											className={cn(
												'w-6 h-6 fill-muted hover:fill-foreground duration-200 transition-all ease-out cursor-pointer'
											)}
										/>
									) : (
										<Icons.unfollow
											className={cn(
												'w-6 h-6 fill-muted hover:fill-foreground duration-200 transition-all ease-out cursor-pointer'
											)}
										/>
									)}
								</TableCell>
							</TableRow>
						);
					})}
				</TableBody>
			</Table>
		</div>
	);
}
