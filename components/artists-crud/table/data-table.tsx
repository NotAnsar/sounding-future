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
import { Download, RotateCcw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from '@/components/ui/select';
import * as ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';

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

	// Function to download table data as Excel file using ExcelJS
	const handleExcelDownload = async () => {
		try {
			// Get filtered rows
			const rows = table.getFilteredRowModel().rows;

			// Create a new workbook and worksheet
			const workbook = new ExcelJS.Workbook();
			const worksheet = workbook.addWorksheet('Artists');

			// Define all the headers for artist data
			const headers = [
				'Artist Name',
				'First Name',
				'Last Name',
				'Slug',
				'Bio',

				'Creation Date',
				'Status',
				'Tracks Count',
				'Followers Count',
			];

			// Add headers row
			worksheet.addRow(headers);

			// Create type-safe rows for Excel export
			interface ExcelRowData {
				artistName: string;
				firstName: string;
				lastName: string;
				slug: string;
				bio: string;
				creationDate: string;
				status: string;
				tracksCount: number;
				followersCount: number;
			}

			// Add data rows with proper typing
			const excelRows = rows.map((row): ExcelRowData => {
				const artist = row.original as {
					name?: string;
					f_name?: string;
					l_name?: string;
					slug?: string;
					bio?: string;
					createdAt?: Date | string;
					published?: boolean;
					_count?: {
						tracks?: number;
						followers?: number;
						trackArtists?: number;
					};
				};

				// Format creation date
				const creationDate = artist.createdAt
					? new Date(artist.createdAt).toLocaleDateString()
					: '';

				// Get track count - could be in _count.tracks or _count.trackArtists depending on your data structure
				const tracksCount =
					artist._count?.tracks || artist._count?.trackArtists || 0;

				// Get follower count
				const followersCount = artist._count?.followers || 0;

				return {
					artistName: artist.name || '',
					firstName: artist.f_name || '',
					lastName: artist.l_name || '',
					slug: artist.slug || '',
					bio: artist.bio || '',
					creationDate: creationDate,
					status: artist.published ? 'Published' : 'Unpublished',
					tracksCount,
					followersCount,
				};
			});

			// Add rows to worksheet
			excelRows.forEach((row) => {
				worksheet.addRow([
					row.artistName,
					row.firstName,
					row.lastName,
					row.slug,
					row.bio,
					row.creationDate,
					row.status,
					row.tracksCount,
					row.followersCount,
				]);
			});

			// Style the header row
			const headerRow = worksheet.getRow(1);
			headerRow.font = { bold: true };
			headerRow.fill = {
				type: 'pattern',
				pattern: 'solid',
				fgColor: { argb: 'FFE0E0E0' },
			};

			// Auto-size columns based on content
			worksheet.columns.forEach((column) => {
				if (column && column.eachCell) {
					let maxLength = 10;
					column.eachCell({ includeEmpty: true }, (cell) => {
						const columnLength = cell.value ? cell.value.toString().length : 10;
						if (columnLength > maxLength) {
							maxLength = columnLength;
						}
					});
					column.width = Math.min(maxLength + 2, 30); // Cap at 30 to prevent very wide columns
				}
			});

			// Generate Excel file buffer
			const buffer = await workbook.xlsx.writeBuffer();

			// Create a blob and trigger download
			const blob = new Blob([buffer], {
				type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
			});
			saveAs(blob, 'artists_data.xlsx');
		} catch (error) {
			console.error('Error generating Excel file:', error);
			alert('Failed to generate Excel file');
		}
	};

	return (
		<>
			<div className='flex flex-col lg:flex-row items-center py-4 gap-2 justify-between'>
				<Input
					placeholder='Filter by artist name'
					className='flex gap-1 w-full md:w-80 '
					value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
					onChange={(event) =>
						table.getColumn('name')?.setFilterValue(event.target.value)
					}
				/>

				<div className='flex items-center gap-2 w-full lg:w-auto text-sm'>
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

					<Button
						variant='outline'
						onClick={handleExcelDownload}
						className='flex items-center gap-2'
					>
						<Download className='h-4 w-4' />
						<span>Export Excel</span>
					</Button>
				</div>
			</div>

			<div className='rounded-md border border-transparent'>
				<Table>
					<TableHeader className='hover:bg-transparent'>
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
												cell.column.id === 'pic' ? 'w-14' : ''
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
			<PaginationTable table={table} totalCount={data.length} />
		</>
	);
}
