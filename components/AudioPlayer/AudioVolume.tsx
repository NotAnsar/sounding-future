import { useAudio } from '@/context/AudioContext';
import CustomSlider from './CustomSlider';
import { Icons } from '../icons/audio-player';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from '@/components/ui/dialog';
import Link from 'next/link';
import { cn } from '@/lib/utils';

export default function AudioVolume() {
	const { volume, isMuted, setVolume, toggleMute } = useAudio();

	return (
		<div className='gap-3 items-center hidden md:flex'>
			<button onClick={toggleMute}>
				{isMuted ? (
					<Icons.muted className='w-7 h-auto aspect-square cursor-pointer fill-foreground' />
				) : (
					<Icons.speaker className='w-7 h-auto aspect-square cursor-pointer fill-foreground' />
				)}
			</button>

			<CustomSlider
				max={1}
				step={0.1}
				value={volume}
				onChange={(e) => setVolume(parseFloat(e.target.value))}
				className='w-[100px]'
			/>
			{/* <Link href={'/about'} target='_blank'>
				<Icons.info className='w-[22px] h-auto aspect-square cursor-pointer text-foreground fill-foreground' />
			</Link> */}
			<InfoPopUp />
		</div>
	);
}

export function InfoPopUp({ mobile = false }: { mobile?: boolean }) {
	const audioTypes = [
		{
			icon: Icons.binaural,
			title: 'binaural+',
			description:
				'Binaural audio plus room rendering. Listen to the audio track in a realistic virtual listening room. Suitable for headphones.',
		},
		{
			icon: Icons.binaural,
			title: 'binaural',
			description: 'Binaural audio rendering. Suitable for headphones.',
		},
		{
			icon: Icons.sterio,
			title: 'stereo',
			description:
				'Stereo audio playback. Listen to the audio track in stereo mode. Suitable for standard stereo sound systems.',
		},
		{
			icon: Icons.binaural,
			title: '',
			description:
				'By double-clicking on one of the 3 buttons a variant can be set as default. This variant will then always be preferred.',
		},
	];

	return (
		<Dialog>
			<DialogTrigger className='flex items-center justify-center flex-col'>
				<Icons.info
					className={cn(
						'w-[22px] h-auto aspect-square cursor-pointer text-foreground fill-foreground',
						mobile ? 'w-7' : ''
					)}
				/>
				{mobile && <p className='text-[10px] text-inherit lowercase'>info</p>}
			</DialogTrigger>
			<DialogContent className='max-w-xl bg-player'>
				<DialogHeader>
					<DialogTitle className='text-3xl font-bold mb-6'>Info</DialogTitle>
				</DialogHeader>

				<div className='space-y-6'>
					<p className='text-sm font-semibold'>
						Audio tracks can be streamed in up to 3 ways:
					</p>

					<div className='space-y-6'>
						{audioTypes.map(({ description, icon: Icon, title }, index) => (
							<div key={index} className='flex items-start space-x-4'>
								<div className='flex flex-col items-center cursor-pointer min-w-14 max-w-14 gap-1'>
									<div
										className={cn(
											'w-10 h-auto aspect-square flex items-center justify-center rounded-full bg-foreground',
											title === '' ? 'border-2 border-[#B03795]' : null
										)}
									>
										<Icon className='w-6 h-auto aspect-squar fill-white dark:fill-black' />
									</div>
									<p className='text-xs text-inherit lowercase'>{title}</p>
								</div>

								<p className='text-sm font-medium'>{description}</p>
							</div>
						))}
					</div>

					<div className='space-y-4 text-sm text-muted'>
						<p>
							Please note that your listening experience will vary greatly
							depending on the quality of your headphones or speakers. Learn
							more about the Sounding Future 3D AudioSpace under{' '}
							<Link href={'/about'} className='hover:underline '>
								ABOUT
							</Link>
							. In the future we will also dynamically stream audio tracks with
							head-tracking. More about this here.
						</p>

						<p>The Sounding Future team wishes you many sonic adventures!</p>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}
