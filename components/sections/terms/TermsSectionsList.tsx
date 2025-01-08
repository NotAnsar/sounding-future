'use client';

import { useEffect, useState } from 'react';
import { GripVertical, MoreHorizontal } from 'lucide-react';
import {
	DndContext,
	DragEndEvent,
	KeyboardSensor,
	PointerSensor,
	closestCenter,
	useSensor,
	useSensors,
} from '@dnd-kit/core';
import {
	SortableContext,
	arrayMove,
	sortableKeyboardCoordinates,
	useSortable,
	verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import { EditTermsSection } from '@/components/sections/LegalSectionDialog';
import {
	deleteTermsSection,
	reorderTermsSections,
} from '@/actions/pages/terms-action';
import { toast } from '@/hooks/use-toast';
import { TermsSection } from '@prisma/client';
import { UpdateTermsMetadata } from './TermsMetaData';

function SortableSection({ section }: { section: TermsSection }) {
	const {
		attributes,
		listeners,
		setNodeRef,
		transform,
		transition,
		isDragging,
	} = useSortable({ id: section.id });

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
		opacity: isDragging ? 0.5 : 1,
	};

	const handleDelete = async () => {
		const result = await deleteTermsSection(section.id);

		if (result.success) {
			toast({
				title: 'Success',
				description: 'Section deleted successfully',
			});
		} else {
			toast({
				variant: 'destructive',
				title: 'Error',
				description: result.message || 'Failed to delete section',
			});
		}
	};

	return (
		<div ref={setNodeRef} style={style} className='mb-4'>
			<div className='bg-player rounded-lg p-6 '>
				<div className='flex items-center justify-between mb-4'>
					<div className='flex items-center gap-3'>
						<div
							{...attributes}
							{...listeners}
							className='cursor-grab active:cursor-grabbing'
						>
							<GripVertical className='h-5 w-5 text-muted-foreground' />
						</div>
						<span className='font-semibold text-xl'>{section.title} </span>
					</div>
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<Button variant='ghost' size='sm' className='h-8 w-8 p-0'>
								<MoreHorizontal className='h-4 w-4' />
							</Button>
						</DropdownMenuTrigger>
						<DropdownMenuContent align='end'>
							<EditTermsSection data={section}>
								<DropdownMenuItem onSelect={(e) => e.preventDefault()}>
									Edit Section
								</DropdownMenuItem>
							</EditTermsSection>
							<DropdownMenuItem onSelect={handleDelete}>
								Delete Section
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</div>

				<div className='space-y-4 text-foreground'>
					<p className=''>{section.content}</p>

					{section.items.length > 0 && (
						<ul className='space-y-2'>
							{section.items.map((item, i) => (
								<li key={i}>• {item}</li>
							))}
						</ul>
					)}

					{section.footer && (
						<p className='text-muted pt-4 border-t border-muted/20'>
							{section.footer}
						</p>
					)}
				</div>
			</div>
		</div>
	);
}

export default function TermsSectionsList({
	sections: initialSections,
}: {
	sections: TermsSection[];
}) {
	const [sections, setSections] = useState(
		[...initialSections].sort((a, b) => a.order - b.order)
	);

	useEffect(() => {
		setSections([...initialSections].sort((a, b) => a.order - b.order));
	}, [initialSections]);

	const sensors = useSensors(
		useSensor(PointerSensor, {
			activationConstraint: { distance: 8 },
		}),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		})
	);

	const handleDragEnd = async (event: DragEndEvent) => {
		const { active, over } = event;

		if (!over || active.id === over.id) {
			return;
		}

		const oldIndex = sections.findIndex((section) => section.id === active.id);
		const newIndex = sections.findIndex((section) => section.id === over.id);

		const newSections = arrayMove(sections, oldIndex, newIndex);
		setSections(newSections);

		const updates = newSections.map((section, index) => ({
			id: section.id,
			order: index + 1,
		}));

		const result = await reorderTermsSections(updates);

		if (!result.success) {
			toast({
				variant: 'destructive',
				title: 'Error',
				description: 'Failed to update section order',
			});
			setSections(initialSections);
		}
	};

	return (
		<DndContext
			sensors={sensors}
			collisionDetection={closestCenter}
			onDragEnd={handleDragEnd}
			modifiers={[restrictToVerticalAxis]}
		>
			<SortableContext items={sections} strategy={verticalListSortingStrategy}>
				{sections.map((section) => (
					<SortableSection key={section.id} section={section} />
				))}
			</SortableContext>
		</DndContext>
	);
}

export function EditContent({
	content,
	field = 'introduction',
	type = 'terms',
}: {
	type?: 'terms' | 'privacy';
	content?: string;
	field?: 'introduction' | 'footer';
}) {
	return (
		<div className='bg-player rounded-lg p-6 '>
			<div className='flex items-center justify-between mb-4 font-semibold text-xl'>
				{field.charAt(0).toUpperCase() + field.slice(1)} Content
				<UpdateTermsMetadata defaultValue={content} field={field} type={type} />
			</div>

			{content ? (
				<p className='space-y-4 text-foreground'>{content}</p>
			) : (
				<p className='text-muted'>No content available</p>
			)}
		</div>
	);
}
