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
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { Input } from './input';

export interface Option {
	label: string;
	value: string;
	code?: string;
}

interface SelectProps {
	options: Option[];
	onChange?: (value: string | null) => void;
	initialValue?: string;
	placeholder?: string;
	searchPlaceholder?: string;
	emptyMessage?: string;
	className?: string;
	disabled?: boolean;
	onFocus?: () => void;
	onBlur?: () => void;
	name?: string;
	error?: boolean | string;
	other?: boolean;
	onOtherChange?: (value: string) => void;
	allowClear?: boolean;
}

export function SelectInput({
	options,
	initialValue,
	onChange,
	placeholder = 'Select an option',
	searchPlaceholder = 'Search options...',
	emptyMessage = 'No options found.',
	className,
	disabled = false,
	onFocus,
	onBlur,
	name,
	error,
	other = false,
	onOtherChange,
	allowClear = false,
}: SelectProps) {
	const [open, setOpen] = React.useState(false);
	const [searchQuery, setSearchQuery] = React.useState('');
	const [selectedItem, setSelectedItem] = React.useState<string | null>(
		initialValue || null
	);
	const [otherValue, setOtherValue] = React.useState('');
	const [showOtherInput, setShowOtherInput] = React.useState(false);

	const handleSelect = (itemValue: string) => {
		if (itemValue === 'other') {
			setShowOtherInput(true);
			setSelectedItem('other');
		} else {
			setShowOtherInput(false);
			setSelectedItem(itemValue);
			onChange?.(itemValue);
		}
		setOpen(false);
	};

	const handleClear = (e: React.MouseEvent) => {
		e.stopPropagation();
		setSelectedItem(null);
		setShowOtherInput(false);
		setOtherValue('');
		onChange?.(null);
	};

	const handleOtherInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value;
		setOtherValue(value);
		onOtherChange?.(value);
	};

	const filteredOptions = options.filter((option) =>
		option.label.toLowerCase().includes(searchQuery.toLowerCase())
	);

	if (other) {
		filteredOptions.push({ label: 'Other', value: 'other' });
	}

	const selectedOption = options.find((opt) => opt.value === selectedItem);

	return (
		<div className='relative w-full'>
			<Popover open={open} onOpenChange={setOpen}>
				<PopoverTrigger asChild>
					<Button
						variant='outline'
						role='combobox'
						aria-expanded={open}
						className={cn(
							'w-full justify-between',
							error ? 'border-destructive focus-visible:ring-destructive' : '',
							className
						)}
						disabled={disabled}
						onFocus={onFocus}
						onBlur={onBlur}
					>
						<span className='truncate'>
							{selectedOption?.code && (
								<span
									className={`fi fi-${selectedOption?.code} w-4 h-4 mr-2`}
								/>
							)}
							{selectedOption ? selectedOption.label : placeholder}
						</span>
						<div className='flex items-center gap-2'>
							{allowClear && selectedItem && (
								<X
									className='h-4 w-4 shrink-0 opacity-50 hover:opacity-100 cursor-pointer'
									onClick={handleClear}
								/>
							)}
							<ChevronsUpDown className='h-4 w-4 shrink-0 opacity-50' />
						</div>
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

						<CommandGroup>
							<CommandList className='max-h-64 overflow-auto'>
								{filteredOptions.map((option) => (
									<CommandItem
										key={option.value}
										onSelect={() => handleSelect(option.value)}
									>
										{!option.code && (
											<Check
												className={cn(
													'mr-2 h-4 w-4',
													selectedItem === option.value
														? 'opacity-100'
														: 'opacity-0'
												)}
											/>
										)}

										{option.code && (
											<span className={`fi fi-${option.code} w-4 h-4 mr-2`} />
										)}
										{option.label}
										{option.code && (
											<Check
												className={cn(
													'mr-2 ml-auto h-4 w-4',
													selectedItem === option.value
														? 'opacity-100'
														: 'opacity-0'
												)}
											/>
										)}
									</CommandItem>
								))}
							</CommandList>
						</CommandGroup>
					</Command>
				</PopoverContent>
			</Popover>

			{showOtherInput && (
				<Input
					type='text'
					className={cn(
						'mt-2',
						error ? 'border-destructive focus-visible:ring-destructive' : ''
					)}
					placeholder='Please specify'
					value={otherValue}
					onChange={handleOtherInputChange}
				/>
			)}

			{name && selectedItem && (
				<input
					type='hidden'
					name={name}
					value={selectedItem === 'other' ? otherValue : selectedItem}
				/>
			)}
		</div>
	);
}

export default SelectInput;
