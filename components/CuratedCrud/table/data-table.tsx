'use client';

import {
	ColumnDef,
	SortingState,
	flexRender,
	getCoreRowModel,
	getSortedRowModel,
	getFacetedUniqueValues,
	getFilteredRowModel,
	useReactTable,
	ColumnFiltersState,
} from '@tanstack/react-table';
import {
	DndContext,
	closestCenter,
	KeyboardSensor,
	PointerSensor,
	useSensor,
	useSensors,
	DragEndEvent,
} from '@dnd-kit/core';
import {
	arrayMove,
	SortableContext,
	sortableKeyboardCoordinates,
	verticalListSortingStrategy,
	useSortable,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from '@/components/ui/table';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Input } from '@/components/ui/input';
import { Download, GripVertical, RotateCcw } from 'lucide-react';
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
	onReorder?: (
		updates: { id: string; displayOrder: number }[]
	) => Promise<
		| { success: boolean; error?: undefined }
		| { success: boolean; error: string }
	>;
}

function DraggableTableRow({
	children,
	id,
	...props
}: {
	id: string;
	children: React.ReactNode;
}) {
	const {
		attributes,
		listeners,
		setNodeRef,
		transform,
		transition,
		isDragging,
	} = useSortable({ id });

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
		opacity: isDragging ? 0.5 : 1,
	};

	return (
		<TableRow
			ref={setNodeRef}
			style={style}
			className={cn(
				'border-transparent hover:bg-player/50',
				isDragging ? 'cursor-grabbing' : ''
			)}
			{...props}
		>
			<TableCell className='w-[40px] p-2'>
				<Button
					variant='ghost'
					className='cursor-grab p-1 h-auto'
					{...attributes}
					{...listeners}
				>
					<GripVertical className='h-4 w-4' />
				</Button>
			</TableCell>
			{children}
		</TableRow>
	);
}

export function DataTable<TData extends { id: string }, TValue>({
	columns,
	data,
	onReorder,
}: DataTableProps<TData, TValue>) {
	const [sorting, setSorting] = useState<SortingState>([]);
	const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
	const [items, setItems] = useState(data);

	const sensors = useSensors(
		useSensor(PointerSensor),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		})
	);

	const table = useReactTable({
		data: items,
		columns,
		state: { sorting, columnFilters },
		onColumnFiltersChange: setColumnFilters,
		onSortingChange: setSorting,
		getCoreRowModel: getCoreRowModel(),
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
			const worksheet = workbook.addWorksheet('Partners');

			// Define all the headers for partner data
			const headers = [
				'Partner Name',
				'Country',
				'Bio',
				'Creation Date',
				'Tracks Count',
				'Likes Count',
				'Plays Count',
			];

			// Add headers row
			worksheet.addRow(headers);

			// Create type-safe rows for Excel export
			interface ExcelRowData {
				name: string;
				country: string;
				bio: string;
				creationDate: string;
				tracksCount: number;
				likesCount: number;
				playsCount: number;
			}

			// Add data rows with proper typing - using two-step type assertion to fix the TypeScript error
			const excelRows = rows.map((row): ExcelRowData => {
				const partner = row.original as unknown as {
					id: string;
					name: string;
					country: string;
					bio?: string;
					createdAt: Date | string;
					tracks?: number;
					liked?: number;
					played?: number;
				};

				// Format creation date
				const creationDate = partner.createdAt
					? new Date(partner.createdAt).toLocaleDateString()
					: '';

				return {
					name: partner.name || '',
					country: partner.country || '',
					bio: partner.bio || '',
					creationDate: creationDate,
					tracksCount: partner.tracks || 0,
					likesCount: partner.liked || 0,
					playsCount: partner.played || 0,
				};
			});

			// Add rows to worksheet
			excelRows.forEach((row) => {
				worksheet.addRow([
					row.name,
					row.country,
					row.bio,
					row.creationDate,
					row.tracksCount,
					row.likesCount,
					row.playsCount,
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
			saveAs(blob, 'partners_data.xlsx');
		} catch (error) {
			console.error('Error generating Excel file:', error);
			alert('Failed to generate Excel file');
		}
	};

	function handleDragEnd(event: DragEndEvent) {
		const { active, over } = event;

		if (over && active.id !== over.id) {
			setItems((items) => {
				const oldIndex = items.findIndex((item) => item.id === active.id);
				const newIndex = items.findIndex((item) => item.id === over.id);

				const newItems = arrayMove(items, oldIndex, newIndex);

				if (onReorder) {
					const updates = newItems.map((item, index) => ({
						id: item.id,
						displayOrder: index + 1,
					}));
					onReorder(updates);
				}

				return newItems;
			});
		}
	}

	return (
		<>
			<div className='flex flex-col lg:flex-row items-center py-4 gap-2 justify-between'>
				<Input
					placeholder='Filter by Partner Name'
					className='flex gap-1 w-full md:w-80'
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
								<TableHead className='w-[40px]'></TableHead>
								{headerGroup.headers.map((header) => (
									<TableHead key={header.id} className='py-3 text-base'>
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
						<DndContext
							sensors={sensors}
							collisionDetection={closestCenter}
							onDragEnd={handleDragEnd}
						>
							<SortableContext
								items={table.getRowModel().rows.map((row) => row.original.id)}
								strategy={verticalListSortingStrategy}
							>
								{table.getRowModel().rows?.length ? (
									table.getRowModel().rows.map((row) => (
										<DraggableTableRow
											key={row.original.id}
											id={row.original.id}
										>
											{row.getVisibleCells().map((cell) => (
												<TableCell
													key={cell.id}
													className={cn(
														'py-5',
														cell.column.id === 'cover' ? 'w-14' : ''
													)}
												>
													{flexRender(
														cell.column.columnDef.cell,
														cell.getContext()
													)}
												</TableCell>
											))}
										</DraggableTableRow>
									))
								) : (
									<TableRow>
										<TableCell
											colSpan={columns.length + 1}
											className='h-24 text-center'
										>
											No results.
										</TableCell>
									</TableRow>
								)}
							</SortableContext>
						</DndContext>
					</TableBody>
				</Table>
			</div>
		</>
	);
}
