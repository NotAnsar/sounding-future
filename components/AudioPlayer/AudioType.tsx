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

type VariantType = 'variant1' | 'variant2' | 'variant3';

interface VariantConfig {
	key: VariantType;
	label: string;
	icon: keyof typeof Icons;
}

const VARIANTS: VariantConfig[] = [
	{ key: 'variant2', label: 'Binaural+', icon: 'binaural' },
	{ key: 'variant1', label: 'Binaural', icon: 'binaural' },
	{ key: 'variant3', label: 'Stereo', icon: 'sterio' },
];

function VariantButton({
	variant,
	isActive,
	isDefault,
	isSingleVariant,
	onClick,
}: {
	variant: VariantConfig;
	isActive: boolean;
	isDefault: boolean;
	isSingleVariant: boolean;
	onClick: () => void;
}) {
	const Icon = Icons[variant.icon];

	return (
		<button
			className={cn(
				'flex flex-col items-center cursor-pointer',
				isActive ? 'text-foreground' : 'dark:text-muted text-muted/50',
				isSingleVariant && 'pointer-events-none'
			)}
			onClick={onClick}
			type='submit'
		>
			<div
				className={cn(
					'w-8 h-auto aspect-square flex items-center justify-center rounded-full',
					isActive ? 'bg-foreground' : 'dark:bg-muted bg-muted/50',
					isDefault && 'border-2 border-[#B03795]'
				)}
			>
				<Icon className='w-5 h-auto aspect-square fill-background' />
			</div>
			<p className='text-[10px] text-inherit lowercase'>{variant.label}</p>
		</button>
	);
}

export default function AudioType() {
	const {
		currentTrack,
		currentVariant,
		switchVariant,
		defaultVariant,
		setDefaultVariant,
	} = useAudio();

	const availableVariants = VARIANTS.filter(
		(variant) => currentTrack?.[variant.key]
	);
	const isSingleVariant = availableVariants.length === 1;

	const handleVariantClick = (variantKey: VariantType) => {
		if (currentVariant === variantKey) {
			setDefaultVariant(variantKey);
		}
		if (!isSingleVariant) {
			switchVariant(variantKey);
		}
	};

	return (
		<>
			<MobileAudioType
				variants={availableVariants}
				currentVariant={currentVariant}
				defaultVariant={defaultVariant}
				isSingleVariant={isSingleVariant}
				onVariantClick={handleVariantClick}
			/>
			<div className='hidden lg:flex gap-3 px-2 mt-2'>
				{availableVariants.map((variant) => (
					<VariantButton
						key={variant.key}
						variant={variant}
						isActive={currentVariant === variant.key}
						isDefault={defaultVariant === variant.key}
						isSingleVariant={isSingleVariant}
						onClick={() => handleVariantClick(variant.key)}
					/>
				))}
			</div>
		</>
	);
}

function MobileAudioType({
	variants,
	currentVariant,
	defaultVariant,
	isSingleVariant,
	onVariantClick,
	className,
}: {
	variants: VariantConfig[];
	currentVariant?: string;
	defaultVariant?: string;
	isSingleVariant: boolean;
	onVariantClick: (variant: VariantType) => void;
	className?: string;
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
				{variants.map((variant) => (
					<DropdownMenuItem
						key={variant.key}
						onSelect={(e) => e.preventDefault()}
						onClick={() => onVariantClick(variant.key)}
					>
						<VariantButton
							variant={variant}
							isActive={currentVariant === variant.key}
							isDefault={defaultVariant === variant.key}
							isSingleVariant={isSingleVariant}
							onClick={() => {}}
						/>
					</DropdownMenuItem>
				))}
				<DropdownMenuItem
					className='flex justify-center items-center cursor-pointer'
					asChild
				>
					<InfoPopUp mobile />
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
