'use client';

import {
	ColumnDef,
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	SortingState,
	useReactTable,
} from '@tanstack/react-table';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { Input } from '@/components/ui/input';
import { useState } from 'react';
import PaginationTable from '@/components/PaginationTable';

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
	const [globalFilter, setGlobalFilter] = useState('');

	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		onSortingChange: setSorting,
		onGlobalFilterChange: setGlobalFilter,
		state: {
			sorting,
			globalFilter,
		},
	});

	return (
		<>
			<div className='flex flex-col lg:flex-row items-center py-4 gap-2 justify-between'>
				<Input
					placeholder='Search chapters...'
					value={globalFilter ?? ''}
					onChange={(event) => setGlobalFilter(String(event.target.value))}
					className='max-w-sm'
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
								{ label: 'Draft', value: 'false' },
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
			<div>
				<Table>
					<TableHeader>
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map((header) => {
									return (
										<TableHead key={header.id}>
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
								>
									{row.getVisibleCells().map((cell) => (
										<TableCell key={cell.id}>
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
									No chapters found.
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>
			<PaginationTable table={table} totalCount={data.length} />
		</>
	);
}
