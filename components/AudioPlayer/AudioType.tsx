import { Dispatch, SetStateAction, useState } from 'react';
import { Icons } from '../icons/audio-player';
import { cn } from '@/lib/utils';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { InfoPopUp } from './AudioVolume';

export default function AudioType() {
	const [isBinaural, setisBinaural] = useState<boolean | undefined>(true);

	return (
		<>
			<MobileAudioType isBinaural={isBinaural} setisBinaural={setisBinaural} />
			<div className='hidden lg:flex gap-3 px-2 mt-2'>
				<div
					className={cn(
						'flex flex-col items-center cursor-pointer ',
						isBinaural === undefined
							? 'text-white'
							: 'dark:text-muted text-muted/50'
					)}
					onClick={() => setisBinaural(undefined)}
				>
					<div
						className={cn(
							'w-8 h-auto aspect-square flex items-center justify-center  rounded-full',
							isBinaural === undefined
								? 'bg-white'
								: 'dark:bg-muted bg-muted/50'
						)}
					>
						<Icons.binaural className='w-5 h-auto aspect-square   fill-black' />
					</div>
					<p className='text-[10px] text-inherit lowercase'>Binaural+</p>
				</div>
				<div
					className={cn(
						'flex flex-col items-center cursor-pointer ',
						isBinaural ? 'text-white' : 'dark:text-muted text-muted/50'
					)}
					onClick={() => setisBinaural(true)}
				>
					<div
						className={cn(
							'w-8 h-auto aspect-square flex items-center justify-center  rounded-full',
							isBinaural ? 'bg-white' : 'dark:bg-muted bg-muted/50'
						)}
					>
						<Icons.binaural className='w-5 h-auto aspect-square   fill-black' />
					</div>
					<p className='text-[10px] text-inherit lowercase'>Binaural</p>
				</div>

				<div
					className={cn(
						'flex flex-col items-center cursor-pointer ',
						isBinaural === false
							? 'text-white'
							: 'dark:text-muted text-muted/50'
					)}
					onClick={() => setisBinaural(false)}
				>
					<div
						className={cn(
							'w-8 h-auto aspect-square flex items-center justify-center  rounded-full',
							isBinaural === false ? 'bg-white' : 'dark:bg-muted bg-muted/50'
						)}
					>
						<Icons.sterio className='w-5 h-auto aspect-square fill-black' />
					</div>
					<p className='text-[10px] text-inherit lowercase'>Stereo</p>
				</div>
			</div>
		</>
	);
}

function MobileAudioType({
	className,
	setisBinaural,
	isBinaural,
}: {
	className?: string;
	setisBinaural: Dispatch<SetStateAction<boolean | undefined>>;
	isBinaural: boolean | undefined;
}) {
	return (
		<DropdownMenu>
			<DropdownMenuTrigger className={cn('relative', className)}>
				<Icons.setting className='w-6 h-auto aspect-square cursor-pointer text-foreground fill-foreground lg:hidden ml-auto' />
			</DropdownMenuTrigger>
			<DropdownMenuContent
				align='start'
				className='bg-player backdrop-blur-md border-border mr-3 mb-2 grid grid-cols-2 p-2'
			>
				<DropdownMenuItem
					className={cn(
						'flex flex-col items-center cursor-pointer ',
						isBinaural === undefined
							? 'text-white'
							: 'dark:text-muted text-muted/50'
					)}
					onClick={() => setisBinaural(undefined)}
				>
					<div
						className={cn(
							'w-8 h-auto aspect-square flex items-center justify-center  rounded-full',
							isBinaural === undefined
								? 'bg-white'
								: 'dark:bg-muted bg-muted/50'
						)}
					>
						<Icons.binaural className='w-5 h-auto aspect-square   fill-black' />
					</div>
					<p className='text-[10px] text-inherit lowercase'>Binaural+</p>
				</DropdownMenuItem>
				<DropdownMenuItem
					className={cn(
						'flex flex-col items-center cursor-pointer ',
						isBinaural ? 'text-white' : 'dark:text-muted text-muted/50'
					)}
					onClick={() => setisBinaural(true)}
				>
					<div
						className={cn(
							'w-8 h-auto aspect-square flex items-center justify-center  rounded-full',
							isBinaural ? 'bg-white' : 'dark:bg-muted bg-muted/50'
						)}
					>
						<Icons.binaural className='w-5 h-auto aspect-square   fill-black' />
					</div>
					<p className='text-[10px] text-inherit lowercase'>Binaural</p>
				</DropdownMenuItem>

				<DropdownMenuItem
					className={cn(
						'flex flex-col items-center cursor-pointer ',
						isBinaural === false
							? 'text-white'
							: 'dark:text-muted text-muted/50'
					)}
					onClick={() => setisBinaural(false)}
				>
					<div
						className={cn(
							'w-8 h-auto aspect-square flex items-center justify-center  rounded-full',
							isBinaural === false ? 'bg-white' : 'dark:bg-muted bg-muted/50'
						)}
					>
						<Icons.sterio className='w-5 h-auto aspect-square fill-black' />
					</div>
					<p className='text-[10px] text-inherit lowercase'>Stereo</p>
				</DropdownMenuItem>
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
