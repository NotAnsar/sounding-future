'use client';

import React, { useState } from 'react';
import { Label } from '@/components/ui/label';
import ErrorMessage from '@/components/ErrorMessage';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import {
	Popover,
	PopoverTrigger,
	PopoverContent,
} from '@/components/ui/popover';
import { Checkbox } from '@/components/ui/checkbox';

interface GenreSelectorProps {
	error?: string[];
	genres: string[];
	initialGenres: string[];
}

const GenreSelector: React.FC<GenreSelectorProps> = ({
	error,
	genres,
	initialGenres,
}) => {
	const [selectedGenres, setselectedGenres] = useState<string[]>(
		initialGenres || []
	);
	return (
		<div className='grid gap-2'>
			<Label className={cn(error ? 'text-destructive' : '')}>
				Artist genre tags
			</Label>
			<Popover>
				<PopoverTrigger asChild>
					<Button
						variant='input'
						className={cn(
							'max-w-md justify-start text-left font-normal ',
							error ? 'border-destructive focus-visible:ring-destructive ' : ''
						)}
					>
						{selectedGenres.length
							? `${selectedGenres.length} Selected`
							: 'Choose genres'}
					</Button>
				</PopoverTrigger>
				<PopoverContent className='w-60 popover-content-width-same-as-its-trigger '>
					<div className='space-y-2'>
						{genres.map((genre) => (
							<div key={genre} className='flex items-center'>
								<Checkbox
									id={genre}
									name='genres'
									value={genre}
									defaultChecked={selectedGenres.includes(genre)}
									onCheckedChange={(checked) => {
										const newGenres = checked
											? [...selectedGenres, genre]
											: selectedGenres.filter((sm) => sm !== genre);
										console.log(newGenres);

										setselectedGenres(newGenres);
									}}
								/>
								<label htmlFor={genre} className='ml-2 text-sm cursor-pointer'>
									{genre}
								</label>
							</div>
						))}
					</div>
				</PopoverContent>
			</Popover>
			{selectedGenres.map((genre) => (
				<input key={genre} type='hidden' name='genres' value={genre} />
			))}
			<p className='text-muted text-sm'>
				Select up to 3 genre tags for your music
			</p>
			<ErrorMessage errors={error} />
		</div>
	);
};

export default GenreSelector;
