import { Search } from 'lucide-react';
import React from 'react';
import { Input } from '../ui/input';
import { cn } from '@/lib/utils';

interface SearchInputProps {
	className?: string;
	placeholder?: string;
	iconColor?: string;
	inputStyles?: string;
}

export default function SearchInput({
	className,
	placeholder = 'Search artists, albums, songs...',
	iconColor = 'text-white',
	inputStyles,
}: SearchInputProps) {
	return (
		<div className={cn('relative', className)}>
			<Search
				className={`absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 ${iconColor}`}
			/>
			<Input
				type={'search'}
				className={cn(
					'pl-8 w-full bg-player placeholder:text-[15px] text-[15px] py-4 border-foreground focus:border-primary/70 rounded-xl font-light',
					inputStyles
				)}
				placeholder={placeholder}
			/>
		</div>
	);
}
