import * as React from 'react';
import { Check, ChevronsUpDown, X } from 'lucide-react';
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
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

export interface Option {
	label: string;
	value: string;
}

interface MultiSelectProps {
	options: Option[];
	onChange?: (value: string[]) => void;
	placeholder?: string;
	searchPlaceholder?: string;
	emptyMessage?: string;
	maxSelected?: number;
	className?: string;
	classNameMaxWidth?: string;
	disabled?: boolean;
	onFocus?: () => void;
	onBlur?: () => void;
	name?: string;
}

export function MultiSelect({
	options,
	onChange,
	placeholder = 'Select options',
	searchPlaceholder = 'Search options...',
	emptyMessage = 'No options found.',
	maxSelected,
	className,
	disabled = false,
	onFocus,
	onBlur,
	name,
	classNameMaxWidth = 'max-w-lg',
}: MultiSelectProps) {
	const [open, setOpen] = React.useState(false);
	const [searchQuery, setSearchQuery] = React.useState('');
	const [selectedItems, setSelectedItems] = React.useState<string[]>([]);

	const handleUnselect = (itemValue: string) => {
		const newValue = selectedItems.filter((val) => val !== itemValue);
		setSelectedItems(newValue);
		onChange?.(newValue);
	};

	const handleSelect = (itemValue: string) => {
		let newValue: string[];
		if (selectedItems.includes(itemValue)) {
			newValue = selectedItems.filter((val) => val !== itemValue);
		} else if (!maxSelected || selectedItems.length < maxSelected) {
			newValue = [...selectedItems, itemValue];
		} else {
			return; // Don't update if max selected is reached
		}
		setSelectedItems(newValue);
		onChange?.(newValue);
	};

	const filteredOptions = options.filter((option) =>
		option.label.toLowerCase().includes(searchQuery.toLowerCase())
	);

	return (
		<div className='relative'>
			<Popover open={open} onOpenChange={setOpen}>
				<PopoverTrigger asChild>
					<Button
						variant='outline'
						role='combobox'
						aria-expanded={open}
						className={cn(
							'w-full justify-between',
							className,
							classNameMaxWidth
						)}
						disabled={disabled}
						onFocus={onFocus}
						onBlur={onBlur}
					>
						<div className='flex gap-1 flex-wrap'>
							{selectedItems.length === 0 && placeholder}
							{selectedItems.length > 0 && (
								<>
									{maxSelected && (
										<span className='text-muted-foreground'>
											{selectedItems.length}/{maxSelected}
										</span>
									)}
									{!maxSelected && `${selectedItems.length} selected`}
								</>
							)}
						</div>
						<ChevronsUpDown className='h-4 w-4 shrink-0 opacity-50' />
					</Button>
				</PopoverTrigger>
				<PopoverContent className='w-full p-0 popover-content-width-same-as-its-trigger'>
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
												selectedItems.includes(option.value)
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

			{name &&
				selectedItems.length > 0 &&
				selectedItems.map((s) => (
					<input type='hidden' name={name} value={s} key={s} />
				))}

			{selectedItems.length > 0 && (
				<div className={cn('flex gap-1 flex-wrap mt-2', classNameMaxWidth)}>
					{selectedItems.map((val) => {
						const option = options.find((opt) => opt.value === val);
						if (!option) return null;

						return (
							<Badge
								key={val}
								variant='secondary'
								className='flex items-center gap-1'
							>
								{option.label}
								<button
									type='button'
									className='rounded-full outline-none focus:ring-2 focus:ring-offset-1'
									onKeyDown={(e) => {
										if (e.key === 'Enter') {
											handleUnselect(val);
										}
									}}
									onMouseDown={(e) => {
										e.preventDefault();
										e.stopPropagation();
									}}
									onClick={() => handleUnselect(val)}
								>
									<X className='h-3 w-3' />
								</button>
							</Badge>
						);
					})}
				</div>
			)}
		</div>
	);
}
