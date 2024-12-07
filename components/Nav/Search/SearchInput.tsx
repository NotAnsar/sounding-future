'use client';
import React, { useState, useEffect, useRef } from 'react';
import { Search } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import SearchResults from './SearchResults';
import { Artist } from '@prisma/client';
import { SearchedTrack } from '@/db/search';

interface SearchInputProps {
	className?: string;
	placeholder?: string;
	iconColor?: string;
	inputStyles?: string;
}

export default function SearchInput({
	className,
	placeholder = 'Search artists, tracks...',
	iconColor = 'text-foreground',
	inputStyles,
}: SearchInputProps) {
	const [searchTerm, setSearchTerm] = useState('');
	const [isOpen, setIsOpen] = useState(false);
	const searchRef = useRef<HTMLDivElement>(null);
	const [searchResults, setSearchResults] = useState<{
		artists: Artist[];
		tracks: SearchedTrack[];
	} | null>(null);

	useEffect(() => {
		const fetchSearchResults = async () => {
			if (searchTerm.trim() === '') {
				setSearchResults(null);
				return;
			}

			try {
				const response = await fetch(
					`/api/search?query=${encodeURIComponent(searchTerm)}`
				);
				if (!response.ok) throw new Error('Failed to fetch search results');

				const data = await response.json();
				setSearchResults(data);
			} catch (error) {
				console.error('Error fetching search results:', error);
			}
		};

		const debounce = setTimeout(fetchSearchResults, 300); // Add debounce to reduce API calls
		return () => clearTimeout(debounce);
	}, [searchTerm]);

	const handleClose = (reset: boolean = true) => {
		setIsOpen(false);
		if (reset) setSearchTerm('');
	};

	return (
		<div className={cn('relative', className)} ref={searchRef}>
			<div className='relative'>
				<Search
					className={`absolute left-2 top-1/2 -translate-y-1/2 h-4 w-4 ${iconColor}`}
				/>
				<Input
					type='search'
					className={cn(
						'pl-8 w-full placeholder:text-[15px] text-[15px] h-10 rounded-xl font-light ring-2 ring-transparent focus-visible:ring-2 focus-visible:ring-primary/40',
						inputStyles
					)}
					placeholder={placeholder}
					value={searchTerm}
					onChange={(e) => setSearchTerm(e.target.value)}
					onFocus={() => setIsOpen(true)}
				/>
			</div>

			{isOpen && searchResults && (
				<SearchResults
					searchResults={searchResults}
					onClose={handleClose}
					searchRef={searchRef}
				/>
			)}
		</div>
	);
}
