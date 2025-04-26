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
import { roles } from '@/config/roles';
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
			const worksheet = workbook.addWorksheet('Users');

			// Define all the headers for user data
			const headers = [
				'Username',
				'Email',
				'First Name',
				'Last Name',
				'Role',
				'Email Verified',
				'Artist Name',
				'Creation Date',
				'Last Login',
			];

			// Add headers row
			worksheet.addRow(headers);

			// Create type-safe rows for Excel export
			interface ExcelRowData {
				username: string;
				email: string;
				firstName: string;
				lastName: string;
				role: string;
				emailVerified: string;
				artistName: string;
				creationDate: string;
				lastLogin: string;
			}

			// Add data rows with proper typing
			const excelRows = rows.map((row): ExcelRowData => {
				const user = row.original as {
					name?: string;
					email?: string;
					f_name?: string;
					l_name?: string;
					role?: string;
					emailVerified?: Date | string | null;
					artist?: { name?: string } | null;
					createdAt?: Date | string;
					lastLoginAt?: Date | string | null;
				};

				// Format dates
				const creationDate = user.createdAt
					? new Date(user.createdAt).toLocaleDateString()
					: '';

				const lastLogin = user.lastLoginAt
					? new Date(user.lastLoginAt).toLocaleDateString()
					: 'Never';

				const emailVerified = user.emailVerified ? 'Verified' : 'Not Verified';

				return {
					username: user.name || '',
					email: user.email || '',
					firstName: user.f_name || '',
					lastName: user.l_name || '',
					role: user.role || '',
					emailVerified: emailVerified,
					artistName: user.artist?.name || '',
					creationDate: creationDate,
					lastLogin: lastLogin,
				};
			});

			// Add rows to worksheet
			excelRows.forEach((row) => {
				worksheet.addRow([
					row.username,
					row.email,
					row.firstName,
					row.lastName,
					row.role,
					row.emailVerified,
					row.artistName,
					row.creationDate,
					row.lastLogin,
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
			saveAs(blob, 'users_data.xlsx');
		} catch (error) {
			console.error('Error generating Excel file:', error);
			alert('Failed to generate Excel file');
		}
	};

	return (
		<>
			<div className='flex flex-col lg:flex-row items-center gap-2 justify-between'>
				<Input
					placeholder='Filter by username'
					className='flex gap-1 w-full md:w-80 '
					value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
					onChange={(event) =>
						table.getColumn('name')?.setFilterValue(event.target.value)
					}
				/>

				<div className='flex items-center gap-2 w-full lg:w-auto text-sm'>
					<Select
						onValueChange={(e) => table.getColumn('role')?.setFilterValue(e)}
						value={(table.getColumn('role')?.getFilterValue() as string) || ''}
					>
						<SelectTrigger className='order-none md:order-1 text-sm'>
							<SelectValue placeholder='Filter by Role' />
						</SelectTrigger>
						<SelectContent className='w-full text-sm'>
							{roles.map((c) => (
								<SelectItem key={c.value} value={c.value}>
									{c.label}
								</SelectItem>
							))}
						</SelectContent>
					</Select>

					{table.getColumn('role')?.getIsFiltered() && (
						<Button
							variant={'outline'}
							onClick={() => table.getColumn('role')?.setFilterValue('')}
							className=' flex items-center gap-2 '
						>
							<RotateCcw className={'h-[13px] w-[13px] mt-[2px] '} />
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
												cell.column.id === 'image' ? 'w-14' : ''
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
