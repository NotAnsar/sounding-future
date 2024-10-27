import { Icons } from '@/components/icons/socials';
import { TabsContent } from '@/components/ui/tabs';
import { Artist } from '@/config/dummy-data';
import Image from 'next/image';
import React from 'react';

export default function ArtistBio({ artist }: { artist: Artist }) {
	return (
		<TabsContent value='bio'>
			<main>
				<div className='space-y-8 '>
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
					<div className='flex flex-col gap-y-6 xl:flex-row gap-x-12 '>
						<div className='max-w-2xl xl:w-2/3 space-y-8'>
							<p className='text-pretty leading-7 '>
								Lorem ipsum dolor sit amet consectetur adipisicing elit. Dicta
								architecto illo optio, sed, ratione unde voluptate fuga ullam
								qui obcaecati nostrum enim? Enim provident ut eum praesentium
								aliquid deleniti. Mollitia delectus vitae dolorem dicta
								laboriosam tenetur at, corporis accusantium facere, ducimus eum.
								Quidem sunt reiciendis magni distinctio nihil nemo et
								consectetur in corrupti blanditiis vitae, fugiat, iure molestias
								suscipit accusantium Lorem ipsum dolor sit amet consectetur
								adipisicing elit. Deleniti soluta labore voluptates quidem
								ducimus maxime dolore expedita doloremque autem nihil? Nobis sed
								consequuntur at architecto.
							</p>
							<div>
								<h1 className='text-xl font-semibold text-primary-foreground mb-4'>
									Artist Links
								</h1>
								<div className='flex gap-4 items-center'>
									<Icons.facebook className='w-10 h-auto aspect-square text-foreground cursor-pointer hover:text-primary-foreground transition-colors duration-200 ease-out' />
									<Icons.instagram className='w-10 h-auto aspect-square text-foreground cursor-pointer hover:text-primary-foreground transition-colors duration-200 ease-out' />
									<Icons.linkedin className='w-10 h-auto aspect-square text-foreground cursor-pointer hover:text-primary-foreground transition-colors duration-200 ease-out' />
									<Icons.vimeo className='w-10 h-auto aspect-square text-foreground cursor-pointer hover:text-primary-foreground transition-colors duration-200 ease-out' />
									<Icons.youtube className='w-10 h-auto aspect-square text-foreground cursor-pointer hover:text-primary-foreground transition-colors duration-200 ease-out' />
								</div>
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
					</div>
				</div>
			</main>
		</TabsContent>
	);
}
