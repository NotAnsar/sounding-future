'use client';

import Image from 'next/image';
import { PauseIcon, PlayIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Track, useAudio } from '@/context/AudioContext';
import Link from 'next/link';
import { Icons } from '@/components/icons/track-icons';
import { useState } from 'react';

export default function TrackDetails({ track }: { track: Track }) {
	const { currentTrack, isPlaying, togglePlayPause, playNewTrack } = useAudio();
	const [liked, setliked] = useState(false);
	const isCurrentTrack = currentTrack?.id === track.id;

	return (
		<div className='w-full flex flex-col sm:flex-row  gap-4'>
			<div
				className={cn(
					'rounded-3xl border overflow-hidden relative group cursor-pointer w-full sm:min-w-64 sm:w-64 xl:min-w-72 xl:w-72  h-auto aspect-square'
				)}
				onClick={() => {
					if (isCurrentTrack) {
						togglePlayPause();
					} else {
						playNewTrack([track]);
					}
				}}
			>
				<div
					className={cn(
						'w-1/4 h-auto aspect-square flex justify-center items-center bg-white rounded-full absolute inset-1/2 -translate-x-1/2 -translate-y-1/2 z-[1]',
						isCurrentTrack ? 'visible' : 'invisible',
						'group-hover:visible'
					)}
				>
					<PauseIcon
						className={cn(
							'w-3/5 h-auto aspect-square text-black fill-black ',
							!(isPlaying && isCurrentTrack) ? 'hidden' : 'block'
						)}
					/>

					<PlayIcon
						className={cn(
							'w-3/5 h-auto aspect-square text-black fill-black cursor-pointer ',
							isPlaying && isCurrentTrack ? 'hidden' : 'block'
						)}
					/>
				</div>
				<Image alt={track.title} src={track.cover} width={640} height={640} />
			</div>
			<div className='flex flex-col gap-3 mt-auto mb-2'>
				<span
					className={cn(
						'text-xs px-2 py-1 rounded-sm uppercase font-medium text-white bg-primary-foreground w-fit'
					)}
				>
					Track
				</span>

				<div className='flex gap-3 flex-col xl:flex-row'>
					<h2 className='text-3xl sm:text-5xl xl:text-6xl font-bold line-clamp-2 '>
						{track.title}
					</h2>

					<div className='flex gap-3 items-center ml-auto md:ml-0'>
						<div
							onClick={() => setliked((l) => !l)}
							className='cursor-pointer h-full flex justify-center items-center'
						>
							{liked ? (
								<Icons.heartFilled className='w-8 h-auto aspect-square fill-white ' />
							) : (
								<Icons.heartOutline className='w-8 h-auto aspect-square fill-white' />
							)}
						</div>
						<Icons.share className='w-7 h-auto aspect-square fill-white' />
					</div>
				</div>

				<div className='flex gap-2.5 items-center'>
					<Image
						alt={track.artist}
						src={'/artists/Anna-Novak.png'}
						className='rounded-full w-8 sm:w-12 h-auto'
						width={48}
						height={48}
					/>
					<Link
						href={`/player/artist/${5}`}
						className='text-lg sm:text-2xl font-semibold hover:underline cursor-pointer line-clamp-1 '
					>
						{track.artist} Lorem ipsum dolor sit amet consectetur adipisicing
						elit. Accusamus earum ducimus, vel fugit est ipsum sint unde
						laboriosam, dolor at inventore reiciendis, sunt impedit? Maiores id
						amet ducimus? Beatae numquam odit error asperiores autem doloremque
						sequi ipsam quis, aperiam, ab labore incidunt vel officia dolores
						minus iure totam. Quisquam non tempora recusandae nisi, dicta ullam
						ipsam neque quas accusamus, illo odit fugit aut. Sapiente eum
						voluptate laborum earum dolore dignissimos veniam dolores architecto
						repellat. Ex, doloribus. Ex sit excepturi illo repellat maiores
						dolorum quidem corrupti qui quis! Pariatur velit nobis hic quidem
						cupiditate esse voluptas porro nam ipsam. Omnis commodi illum quis,
						odio eum inventore! Odit nobis commodi, dicta cum necessitatibus ab
						placeat quod ipsa hic quaerat facilis eveniet possimus eligendi
						autem nesciunt? Unde laudantium, minima dolore reiciendis delectus
						consequatur pariatur temporibus porro voluptatem eum quia, sunt
						tenetur. Hic qui quam alias, aliquam impedit laudantium expedita
						incidunt, eius omnis vitae, quasi dignissimos quidem. Esse, dolorem
						aspernatur obcaecati soluta voluptatem sapiente magni vel deleniti
						at est eveniet maxime, hic natus a iure ullam. Iure aspernatur nemo
						alias deserunt sint quis eos voluptas ut adipisci, consectetur
						blanditiis sapiente eius voluptates laudantium accusantium, tempora
						voluptate voluptatem, a harum libero unde vel ipsa. Tempora nulla
						voluptatem nemo quod reiciendis pariatur, earum veniam
						exercitationem dolor molestias nihil rerum architecto amet facilis a
						laborum, quo voluptatum harum iste! Cum ab, perferendis atque nihil
						doloribus saepe similique sint consectetur temporibus sunt veniam
						incidunt! Velit nemo, culpa ipsa modi laboriosam incidunt similique
						itaque quisquam maxime ea labore totam cumque temporibus animi at
						commodi? Exercitationem error similique expedita facilis ab a non
						eius! Delectus, excepturi rerum ducimus ipsum, aspernatur ipsam
						tempora, alias totam voluptatibus at voluptas veniam. Harum
						consequuntur animi dolorem! Ratione architecto dicta in quas autem
						quaerat labore beatae aspernatur magni facere numquam molestias
						voluptatem culpa provident eaque, dolorem voluptates, quo non sequi,
						quos eligendi vero? Aperiam minus molestias sunt consequuntur,
						pariatur eos blanditiis tempora laboriosam voluptates qui voluptate
						inventore officia maiores saepe corrupti esse alias odit excepturi?
						In laborum maxime repudiandae voluptatem, nemo voluptas! Ea ad alias
						voluptatibus consequatur odio, distinctio qui ut laboriosam sapiente
						deleniti fugit nesciunt similique ipsum reiciendis laborum maxime
						quos sequi est omnis nobis cumque molestias. Animi, incidunt
						aspernatur quaerat sed vel voluptate dolorem omnis rerum delectus
						error qui nisi ex! Nesciunt harum ex voluptatem dicta, ea aliquam
						voluptas at saepe veritatis magni fuga voluptate quidem temporibus
						ipsum pariatur quos laborum possimus? Harum minus aliquam ab beatae
						fugiat distinctio voluptas id facilis explicabo, sapiente rem
						quaerat veritatis, eius qui voluptatibus impedit in deleniti
						consequatur esse placeat et temporibus hic, itaque asperiores.
						Expedita labore, animi, laboriosam quidem eos quos esse enim dolorum
						nulla perspiciatis pariatur nemo asperiores incidunt, ratione
						dignissimos reiciendis eveniet cupiditate tenetur?s
					</Link>
					<Icons.follow className='min-w-8 w-8 h-auto aspect-square fill-white flex-nowrap text-nowrap cursor-pointer' />
				</div>
			</div>
		</div>
	);
}
