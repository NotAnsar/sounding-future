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
import { GripVertical, RotateCcw } from 'lucide-react';
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
					placeholder='Filter by banner title'
					className='flex gap-1 w-full md:w-80'
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
