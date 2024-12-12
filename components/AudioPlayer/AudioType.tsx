import { Icons } from '../icons/audio-player';
import { cn } from '@/lib/utils';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { InfoPopUp } from './AudioVolume';
import { useAudio } from '@/context/AudioContext';

export default function AudioType() {
	const { currentTrack, currentVariant, switchVariant } = useAudio();
	const variants = [
		currentTrack?.variant1,
		currentTrack?.variant2,
		currentTrack?.variant3,
	].filter(Boolean);
	const isSingleVariant = variants.length === 1;

	return (
		<>
			<MobileAudioType isSingleVariant={isSingleVariant} />
			<div className='hidden lg:flex gap-3 px-2 mt-2'>
				{currentTrack?.variant2 && (
					<div
						className={cn(
							'flex flex-col items-center cursor-pointer ',
							currentVariant === 'variant2'
								? 'text-white'
								: 'dark:text-muted text-muted/50',
							isSingleVariant && 'pointer-events-none'
						)}
						onClick={() => !isSingleVariant && switchVariant('variant2')}
					>
						<div
							className={cn(
								'w-8 h-auto aspect-square flex items-center justify-center rounded-full',
								currentVariant === 'variant2'
									? 'bg-white'
									: 'dark:bg-muted bg-muted/50'
							)}
						>
							<Icons.binaural className='w-5 h-auto aspect-square fill-black' />
						</div>
						<p className='text-[10px] text-inherit lowercase'>Binaural+</p>
					</div>
				)}
				{currentTrack?.variant1 && (
					<div
						className={cn(
							'flex flex-col items-center cursor-pointer ',
							currentVariant === 'variant1'
								? 'text-white'
								: 'dark:text-muted text-muted/50',
							isSingleVariant && 'pointer-events-none'
						)}
						onClick={() => !isSingleVariant && switchVariant('variant1')}
					>
						<div
							className={cn(
								'w-8 h-auto aspect-square flex items-center justify-center rounded-full',
								currentVariant === 'variant1'
									? 'bg-white'
									: 'dark:bg-muted bg-muted/50'
							)}
						>
							<Icons.binaural className='w-5 h-auto aspect-square fill-black' />
						</div>
						<p className='text-[10px] text-inherit lowercase'>Binaural</p>
					</div>
				)}
				{currentTrack?.variant3 && (
					<div
						className={cn(
							'flex flex-col items-center cursor-pointer ',
							currentVariant === 'variant3'
								? 'text-white'
								: 'dark:text-muted text-muted/50',
							isSingleVariant && 'pointer-events-none'
						)}
						onClick={() => !isSingleVariant && switchVariant('variant3')}
					>
						<div
							className={cn(
								'w-8 h-auto aspect-square flex items-center justify-center rounded-full',
								currentVariant === 'variant3'
									? 'bg-white'
									: 'dark:bg-muted bg-muted/50'
							)}
						>
							<Icons.sterio className='w-5 h-auto aspect-square fill-black' />
						</div>
						<p className='text-[10px] text-inherit lowercase'>Stereo</p>
					</div>
				)}
			</div>
		</>
	);
}

function MobileAudioType({
	className,
	isSingleVariant,
}: {
	className?: string;
	isSingleVariant: boolean;
}) {
	const { currentTrack, currentVariant, switchVariant } = useAudio();

	return (
		<DropdownMenu>
			<DropdownMenuTrigger className={cn('relative', className)}>
				<Icons.setting className='w-6 h-auto aspect-square cursor-pointer text-foreground fill-foreground lg:hidden ml-auto' />
			</DropdownMenuTrigger>
			<DropdownMenuContent
				align='start'
				className='bg-player backdrop-blur-md border-border mr-3 mb-2 grid grid-cols-2 p-2'
			>
				{currentTrack?.variant2 && (
					<DropdownMenuItem
						className={cn(
							'flex flex-col items-center cursor-pointer ',
							currentVariant === 'variant2'
								? 'text-white'
								: 'dark:text-muted text-muted/50',
							isSingleVariant && 'pointer-events-none'
						)}
						onClick={() => !isSingleVariant && switchVariant('variant2')}
					>
						<div
							className={cn(
								'w-8 h-auto aspect-square flex items-center justify-center rounded-full',
								currentVariant === 'variant2'
									? 'bg-white'
									: 'dark:bg-muted bg-muted/50'
							)}
						>
							<Icons.binaural className='w-5 h-auto aspect-square fill-black' />
						</div>
						<p className='text-[10px] text-inherit lowercase'>Binaural+</p>
					</DropdownMenuItem>
				)}
				{currentTrack?.variant1 && (
					<DropdownMenuItem
						className={cn(
							'flex flex-col items-center cursor-pointer ',
							currentVariant === 'variant1'
								? 'text-white'
								: 'dark:text-muted text-muted/50',
							isSingleVariant && 'pointer-events-none'
						)}
						onClick={() => !isSingleVariant && switchVariant('variant1')}
					>
						<div
							className={cn(
								'w-8 h-auto aspect-square flex items-center justify-center rounded-full',
								currentVariant === 'variant1'
									? 'bg-white'
									: 'dark:bg-muted bg-muted/50'
							)}
						>
							<Icons.binaural className='w-5 h-auto aspect-square fill-black' />
						</div>
						<p className='text-[10px] text-inherit lowercase'>Binaural</p>
					</DropdownMenuItem>
				)}
				{currentTrack?.variant3 && (
					<DropdownMenuItem
						className={cn(
							'flex flex-col items-center cursor-pointer ',
							currentVariant === 'variant3'
								? 'text-white'
								: 'dark:text-muted text-muted/50',
							isSingleVariant && 'pointer-events-none'
						)}
						onClick={() => !isSingleVariant && switchVariant('variant3')}
					>
						<div
							className={cn(
								'w-8 h-auto aspect-square flex items-center justify-center rounded-full',
								currentVariant === 'variant3'
									? 'bg-white'
									: 'dark:bg-muted bg-muted/50'
							)}
						>
							<Icons.sterio className='w-5 h-auto aspect-square fill-black' />
						</div>
						<p className='text-[10px] text-inherit lowercase'>Stereo</p>
					</DropdownMenuItem>
				)}
				<DropdownMenuItem
					className={'flex justify-center items-center cursor-pointer '}
					asChild
				>
					<InfoPopUp mobile />
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
