import * as React from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';
import {
	Command,
	CommandGroup,
	CommandItem,
	CommandList,
} from '@/components/ui/command';
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface SelectProps {
	onChange?: (value: string) => void;
	initialValue?: string;
	className?: string;
	disabled?: boolean;
	onFocus?: () => void;
	onBlur?: () => void;
	name?: string;
}

export function YearSelect({
	onChange,
	initialValue,
	className,
	disabled = false,
	onFocus,
	onBlur,
	name,
}: SelectProps) {
	const [open, setOpen] = React.useState(false);
	const [selectedItem, setSelectedItem] = React.useState<string | null>(
		initialValue || null
	);

	const currentYear = new Date().getFullYear();

	const options = Array.from({ length: currentYear - 1959 }, (_, i) => {
		const year = currentYear - i;
		return {
			label: year.toString(),
			value: year.toString(),
		};
	});

	const handleSelect = (itemValue: string) => {
		setSelectedItem(itemValue);
		onChange?.(itemValue);
		setOpen(false);
	};

	const selectedOption = options.find((opt) => opt.value === selectedItem);

	return (
		<div className='relative'>
			<Popover open={open} onOpenChange={setOpen}>
				<PopoverTrigger asChild>
					<Button
						variant='outline'
						role='combobox'
						aria-expanded={open}
						className={cn('w-full justify-between', className)}
						disabled={disabled}
						onFocus={onFocus}
						onBlur={onBlur}
					>
						<span className='truncate'>
							{selectedOption?.label || 'Choose a year'}
						</span>
						<ChevronsUpDown className='h-4 w-4 shrink-0 opacity-50' />
					</Button>
				</PopoverTrigger>
				<PopoverContent className='w-full p-0 popover-content-width-same-as-its-trigger'>
					<Command className='bg-background '>
						<CommandGroup>
							<CommandList className='max-h-64 overflow-auto'>
								{options.map((option) => (
									<CommandItem
										key={option.value}
										onSelect={() => handleSelect(option.value)}
									>
										<Check
											className={cn(
												'mr-2 h-4 w-4',
												selectedItem === option.value
													? 'opacity-100'
													: 'opacity-0'
											)}
										/>
										{option.label}
									</CommandItem>
								))}
							</CommandList>
						</CommandGroup>
					</Command>
				</PopoverContent>
			</Popover>

			{name && selectedItem && (
				<input type='hidden' name={name} value={selectedItem} />
			)}
		</div>
	);
}
