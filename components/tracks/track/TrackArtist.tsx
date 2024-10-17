import { Icons } from '@/components/icons/socials';
import { TabsContent } from '@/components/ui/tabs';
import { artists, Track } from '@/config/dummy-data';
import Image from 'next/image';
import React from 'react';

export default function TrackArtist({ track }: { track: Track }) {
	const artist = artists.find((a) => a.id === track.artist.id);

	return (
		<TabsContent value='artist' className='space-y-8'>
			{artist?.picture && (
				<div className='max-w-2xl '>
					<Image
						className='w-full rounded-3xl aspect-video object-cover'
						src={artist?.picture}
						width={500}
						height={500}
						alt={artist?.name}
					/>
				</div>
			)}
			<p className='text-pretty leading-7 max-w-2xl'>
				Lorem ipsum dolor sit amet consectetur adipisicing elit. Dicta
				architecto illo optio, sed, ratione unde voluptate fuga ullam qui
				obcaecati nostrum enim? Enim provident ut eum praesentium aliquid
				deleniti. Mollitia delectus vitae dolorem dicta laboriosam tenetur at,
				corporis accusantium facere, ducimus eum. Quidem sunt reiciendis magni
				distinctio nihil nemo et consectetur in corrupti blanditiis vitae,
				fugiat, iure molestias suscipit accusantium soluta enim nostrum
				possimus! Vel laboriosam fugit voluptates non deleniti obcaecati numquam
				quasi totam ipsa voluptatibus consectetur eaque asperiores, cumque velit
				optio dolorum eius sapiente rerum. Tempore id nulla possimus suscipit
				aut at iusto est minima explicabo, modi deserunt, expedita ab
				exercitationem fugiat iste quas voluptate ea voluptatum eveniet?
				Explicabo corrupti assumenda minus cumque dolores possimus iusto ad
				nesciunt aperiam error, sit, eligendi beatae incidunt temporibus rem
				illo soluta veniam. Assumenda, similique earum iusto, magnam eaque, sint
				blanditiis perspiciatis ab quasi modi corporis. Assumenda harum fuga hic
				doloremque atque architecto natus libero non, neque deserunt corporis
				saepe ducimus ab aspernatur reprehenderit reiciendis? Doloremque iusto
				reiciendis pariatur placeat, dolorum labore delectus maiores tempore
				tempora? Voluptatum obcaecati error, dicta fugiat quam iusto harum omnis
				culpa hic aspernatur commodi ipsum at veritatis iure saepe voluptatem
			</p>
			<div>
				<h1 className='text-xl font-semibold text-primary-foreground mb-4'>
					Artist Links
				</h1>
				<div className='flex gap-4 items-center'>
					<Icons.facebook className='w-10 h-auto aspect-square text-foreground cursor-pointer' />
					<Icons.instagram className='w-10 h-auto aspect-square text-foreground cursor-pointer' />
					<Icons.linkedin className='w-10 h-auto aspect-square text-foreground cursor-pointer' />
					<Icons.vimeo className='w-10 h-auto aspect-square text-foreground cursor-pointer' />
					<Icons.youtube className='w-10 h-auto aspect-square text-foreground cursor-pointer' />
				</div>
			</div>
			<div>
				<h1 className='text-xl font-semibold text-primary-foreground mb-4'>
					Sounding Future articles
				</h1>
				<ul className='space-y-2'>
					<li className='hover:underline cursor-pointer'>
						dolores nasci fatemur e corporis
					</li>
					<li className='hover:underline cursor-pointer'>
						eorum tamen utrumque et ortum esse{' '}
					</li>
				</ul>
			</div>
		</TabsContent>
	);
}
