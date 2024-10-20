'use client';

import * as React from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover';

type DatePickerInputProps = {
	name: string;
	defaultValue?: Date;
	className?: string;
};

export function DatePickerInput({
	className,
	name,
	defaultValue,
}: DatePickerInputProps) {
	const [date, setDate] = React.useState<Date | undefined>(defaultValue);

	return (
		<>
			<Popover>
				<PopoverTrigger asChild>
					<Button
						variant={'outline'}
						className={cn(
							'justify-start text-left font-normal',
							!date && 'text-muted-foreground',
							className
						)}
					>
						<CalendarIcon className='mr-2 h-4 w-4' />
						{date ? format(date, 'PPP') : <span>Choisissez une date</span>}
					</Button>
				</PopoverTrigger>
				<PopoverContent className='w-auto p-0'>
					<Calendar
						initialFocus
						className='rounded-md border'
						mode='single'
						captionLayout='dropdown-buttons'
						selected={date}
						onSelect={setDate}
						fromYear={1960}
						toYear={2030}
					/>
				</PopoverContent>
			</Popover>
			<input type='hidden' name={name} value={date ? date.toISOString() : ''} />
		</>
	);
}
