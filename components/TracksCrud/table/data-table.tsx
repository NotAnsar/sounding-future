'use client';

import {
	ColumnDef,
	SortingState,
	flexRender,
	getCoreRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	getFacetedUniqueValues,
	getFilteredRowModel,
	useReactTable,
	ColumnFiltersState,
} from '@tanstack/react-table';

import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { useState } from 'react';
import PaginationTable from '@/components/PaginationTable';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';

interface DataTableProps<TData, TValue> {
	columns: ColumnDef<TData, TValue>[];
	data: TData[];
}

export function DataTable<TData, TValue>({
	columns,
	data,
}: DataTableProps<TData, TValue>) {
	const [sorting, setSorting] = useState<SortingState>([]);
	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
	const table = useReactTable({
		data,
		columns,
		state: { sorting, columnFilters },
		onColumnFiltersChange: setColumnFilters,
		onSortingChange: setSorting,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFacetedUniqueValues: getFacetedUniqueValues(),
	});

	return (
		<>
			<div className='flex flex-col sm:flex-row items-center py-4 gap-2 justify-between'>
				<Input
					placeholder='Filter by track name'
					className='flex gap-1 w-full md:w-80 '
					value={(table.getColumn('title')?.getFilterValue() as string) ?? ''}
					onChange={(event) =>
						table.getColumn('title')?.setFilterValue(event.target.value)
					}
				/>

				<div className='flex items-center gap-2 w-full lg:w-[225px] text-sm'>
					<Select
						onValueChange={(value) => {
							if (value === '') {
								table.getColumn('published')?.setFilterValue(undefined);
							} else {
								table.getColumn('published')?.setFilterValue(value === 'true');
							}
						}}
						value={
							table.getColumn('published')?.getFilterValue() === undefined
								? ''
								: String(table.getColumn('published')?.getFilterValue())
						}
					>
						<SelectTrigger className='order-none md:order-1 text-sm'>
							<SelectValue placeholder='Filter by Status' />
						</SelectTrigger>
						<SelectContent className='w-full text-sm'>
							{[
								{ label: 'Published', value: 'true' },
								{ label: 'UnPublished', value: 'false' },
							].map((option) => (
								<SelectItem key={option.value} value={option.value}>
									{option.label}
								</SelectItem>
							))}
						</SelectContent>
					</Select>

					{table.getColumn('published')?.getFilterValue() !== undefined && (
						<Button
							variant='outline'
							onClick={() =>
								table.getColumn('published')?.setFilterValue(undefined)
							}
							className='flex items-center gap-2'
						>
							<RotateCcw className='h-[13px] w-[13px] mt-[2px]' />
						</Button>
					)}
				</div>
			</div>

			<div className='rounded-md border border-transparent'>
				<Table>
					<TableHeader className='hover:bg-transparent  '>
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map((header) => {
									return (
										<TableHead key={header.id} className='py-3 text-base >'>
											{header.isPlaceholder
												? null
												: flexRender(
														header.column.columnDef.header,
														header.getContext()
												  )}
										</TableHead>
									);
								})}
							</TableRow>
						))}
					</TableHeader>
					<TableBody>
						{table.getRowModel().rows?.length ? (
							table.getRowModel().rows.map((row) => (
								<TableRow
									key={row.id}
									data-state={row.getIsSelected() && 'selected'}
									className='border-transparent hover:bg-player/50'
								>
									{row.getVisibleCells().map((cell) => (
										<TableCell
											key={cell.id}
											className={cn(
												'py-5 ',
												cell.column.id === 'cover' ? 'w-14' : ''
											)}
										>
											{flexRender(
												cell.column.columnDef.cell,
												cell.getContext()
											)}
										</TableCell>
									))}
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell
									colSpan={columns.length}
									className='h-24 text-center'
								>
									No results.
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>
			<PaginationTable table={table} />
		</>
	);
}
