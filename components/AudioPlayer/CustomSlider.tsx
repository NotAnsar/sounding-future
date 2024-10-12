import { cn } from '@/lib/utils';
import React, { ChangeEvent } from 'react';

type CustomSliderProps = {
	min?: number;
	max: number;
	step: number;
	value: number;
	onChange: (e: ChangeEvent<HTMLInputElement>) => void;
	className?: string;
	trackClassName?: string;
	progressClassName?: string;
	backgroundClassName?: string;
};

export default function CustomSlider({
	min = 0,
	max = 1,
	step = 0.01,
	value,
	onChange,
	className = '',
	trackClassName = 'h-[5px] rounded-full ring-red-950 accent-[#141B29] dark:accent-[#B3B3B3]',
	progressClassName = 'bg-[#141B29] dark:bg-[#B3B3B3]',

	backgroundClassName = 'bg-[#847F7F] dark:bg-[#525151]',
	...props
}: CustomSliderProps) {
	return (
		<span
			className={cn(
				`relative flex items-center rounded-full !ring-red-950`,
				className
			)}
		>
			<input
				type='range'
				className={cn(
					`h-[5px] w-full rounded-full appearance-none opacity-0 bg-transparent hover:opacity-100 z-20`,
					trackClassName
				)}
				min={min}
				max={max}
				step={step}
				value={value}
				onChange={onChange}
				{...props}
			/>

			<div
				className={cn(
					`h-[5px] rounded-full absolute pointer-events-none z-20 `,
					progressClassName
				)}
				style={{
					width: `${((value - min) / (max - min)) * 100}%`,
				}}
			/>
			<div
				className={cn(
					`h-[5px] w-full rounded-full absolute pointer-events-none z-10 `,
					backgroundClassName
				)}
			/>
		</span>
	);
}
