import * as React from 'react';
import { Check, ChevronsUpDown } from 'lucide-react';
import {
	Command,
	CommandEmpty,
	CommandGroup,
	CommandInput,
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

export interface Option {
	label: string;
	value: string;
}

interface SelectProps {
	options: Option[];
	onChange?: (value: string) => void;
	placeholder?: string;
	searchPlaceholder?: string;
	emptyMessage?: string;
	className?: string;
	disabled?: boolean;
	onFocus?: () => void;
	onBlur?: () => void;
	name?: string;
}

export function SelectInput({
	options,
	onChange,
	placeholder = 'Select an option',
	searchPlaceholder = 'Search options...',
	emptyMessage = 'No options found.',
	className,
	disabled = false,
	onFocus,
	onBlur,
	name,
}: SelectProps) {
	const [open, setOpen] = React.useState(false);
	const [searchQuery, setSearchQuery] = React.useState('');
	const [selectedItem, setSelectedItem] = React.useState<string | null>(null);

	const handleSelect = (itemValue: string) => {
		setSelectedItem(itemValue);
		onChange?.(itemValue);
		setOpen(false);
	};

	const filteredOptions = options.filter((option) =>
		option.label.toLowerCase().includes(searchQuery.toLowerCase())
	);

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
							{selectedOption ? selectedOption.label : placeholder}
						</span>
						<ChevronsUpDown className='h-4 w-4 shrink-0 opacity-50' />
					</Button>
				</PopoverTrigger>
				<PopoverContent className='w-full p-0 popover-content-width-same-as-its-trigger '>
					<Command className='bg-background'>
						<CommandInput
							placeholder={searchPlaceholder}
							value={searchQuery}
							onValueChange={setSearchQuery}
						/>
						<CommandEmpty>{emptyMessage}</CommandEmpty>
						<CommandGroup className='max-h-64 overflow-auto'>
							<CommandList>
								{filteredOptions.map((option) => (
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
