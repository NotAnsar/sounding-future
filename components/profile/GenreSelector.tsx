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
	name?: string;
	label?: string;
	message?: string;
	initialGenres: string[];
}

export default function GenreSelector({
	name = 'genres',
	error,
	genres,
	initialGenres,
	label = 'Artist genre tags',
	message,
}: GenreSelectorProps) {
	const [selectedGenres, setselectedGenres] = useState<string[]>(
		initialGenres || []
	);
	return (
		<div className='grid gap-2'>
			<Label className={cn(error ? 'text-destructive' : '')} htmlFor={name}>
				{label}
			</Label>
			<Popover>
				<PopoverTrigger asChild>
					<Button
						variant='input'
						className={cn(
							'max-w-lg justify-start text-left font-normal ',
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
									name={name}
									value={genre}
									defaultChecked={selectedGenres.includes(genre)}
									onCheckedChange={(checked) => {
										const newGenres = checked
											? [...selectedGenres, genre]
											: selectedGenres.filter((sm) => sm !== genre);

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
				<input key={genre} type='hidden' name={name} value={genre} />
			))}
			{message && <p className='text-muted text-sm'>{message}</p>}
			<ErrorMessage errors={error} />
		</div>
	);
}
