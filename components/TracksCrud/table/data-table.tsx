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
import { TrackWithCounts } from '@/db/tracks';

interface DataTableProps<TData, TValue> {
	columns: ColumnDef<TData, TValue>[];
	data: TData[];
	isAdmin?: boolean;
}

export function DataTable<TData, TValue>({
	columns,
	data,
	isAdmin = false,
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
			const worksheet = workbook.addWorksheet('Tracks');

			// Define all the headers requested by the user
			const headers = [
				'Track Number',
				'Track Title',
				'Duration (mm:ss)',
				'Artists Names',
				'First Name', // Added first name
				'Last Name', // Added last name
				'Label',
				'Year of Release',
				'Track Registration', // Added track registration
				'ISRC Code',
				'Creation Date on Platform',
				'Published',
				'Number of Plays',
				'Number of Likes',
				'Curated by',
				'Binaural',
				'Binaural+',
				'Stereo',
			];

			// Add headers row
			worksheet.addRow(headers);

			// Create type-safe rows for Excel export
			interface ExcelRowData {
				trackNumber: number;
				title: string;
				duration: string; // Added duration
				artists: string;
				firstName: string; // Added first name
				lastName: string; // Added last name
				label: string;
				releaseYear: number | string;
				registration: string; // Added track registration
				isrcCode: string;
				creationDate: string;
				published: string;
				plays: number;
				likes: number;
				curator: string;
				binaural: string;
				binauralPlus: string;
				stereo: string;
			}

			// Helper function to format duration from seconds to mm:ss
			const formatDuration = (seconds: number | null | undefined): string => {
				if (!seconds) return '00:00';
				const minutes = Math.floor(seconds / 60);
				const remainingSeconds = Math.floor(seconds % 60);
				return `${minutes.toString().padStart(2, '0')}:${remainingSeconds
					.toString()
					.padStart(2, '0')}`;
			};

			// Add data rows with proper typing
			const excelRows = rows.map((row, index): ExcelRowData => {
				const track = row.original as TrackWithCounts;

				// Artist name(s) for composer field
				const artistsNames = track.artists
					? track.artists.map((artist) => artist.artist.name).join(', ')
					: '';

				// Get first and last name of primary artist (first artist in the list)
				const primaryArtist =
					track.artists && track.artists.length > 0
						? track.artists[0].artist
						: null;
				const firstName = primaryArtist?.f_name || '';
				const lastName = primaryArtist?.l_name || '';

				// Format date
				const creationDate = track.createdAt
					? new Date(track.createdAt).toLocaleDateString()
					: '';

				// Publishing status
				const publishing = track.published ? 'Published' : 'Unpublished';

				return {
					trackNumber: index + 1,
					title: track.title || '',
					duration: formatDuration(track.duration), // Format duration as mm:ss
					artists: artistsNames || '',
					firstName: firstName,
					lastName: lastName,
					label: track.releasedBy || '',
					releaseYear: track.releaseYear || '',
					registration: track.trackRegistration || '',
					isrcCode: track.isrcCode || '',
					creationDate: creationDate,
					published: publishing,
					plays: track._count?.listeners || 0,
					likes: track._count?.likes || 0,
					curator: track.curator?.name || '',
					binaural: track.variant1Name || '',
					binauralPlus: track.variant2Name || '',
					stereo: track.variant3Name || '',
					// binaural: track.variant1Name?.split('.')[0] || '',
					// binauralPlus: track.variant2Name?.split('.')[0] || '',
					// stereo: track.variant3Name?.split('.')[0] || '',
				};
			});

			// Add rows to worksheet
			excelRows.forEach((row) => {
				worksheet.addRow([
					row.trackNumber,
					row.title,
					row.duration, // Added duration
					row.artists,
					row.firstName, // Added first name
					row.lastName, // Added last name
					row.label,
					row.releaseYear,
					row.registration, // Added track registration
					row.isrcCode,
					row.creationDate,
					row.published,
					row.plays,
					row.likes,
					row.curator,
					row.binaural,
					row.binauralPlus,
					row.stereo,
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
			saveAs(blob, 'tracks_data.xlsx');
		} catch (error) {
			console.error('Error generating Excel file:', error);
			alert('Failed to generate Excel file');
		}
	};

	return (
		<>
			<div className='flex flex-col lg:flex-row items-center py-4 gap-2 justify-between'>
				<div className='flex items-center gap-2 w-full lg:w-auto '>
					<Input
						placeholder='Filter by track name'
						className='flex gap-1 w-full md:w-80 '
						value={(table.getColumn('title')?.getFilterValue() as string) ?? ''}
						onChange={(event) =>
							table.getColumn('title')?.setFilterValue(event.target.value)
						}
					/>

					{isAdmin && (
						<Input
							placeholder='Filter by artist name'
							className='flex gap-1 w-full md:w-80'
							value={
								(table.getColumn('artist')?.getFilterValue() as string) ?? ''
							}
							onChange={(event) =>
								table.getColumn('artist')?.setFilterValue(event.target.value)
							}
						/>
					)}
				</div>

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

					{isAdmin && (
						<Button
							variant='outline'
							onClick={handleExcelDownload}
							className='flex items-center gap-2'
						>
							<Download className='h-4 w-4' />
							<span>Export Excel</span>
						</Button>
					)}
				</div>
			</div>

			<div className='rounded-md border border-transparent'>
				<Table>
					<TableHeader className='hover:bg-transparent'>
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map((header) => (
									<TableHead key={header.id} className='py-3 text-base >'>
										{header.isPlaceholder
											? null
											: flexRender(
													header.column.columnDef.header,
													header.getContext()
											  )}
									</TableHead>
								))}
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
			<PaginationTable table={table} totalCount={data.length} />
		</>
	);
}
