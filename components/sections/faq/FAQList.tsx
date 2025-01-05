// 'use client';

// import {
// 	Accordion,
// 	AccordionContent,
// 	AccordionItem,
// 	AccordionTrigger,
// } from '@/components/ui/accordion';
// import { FaqDialog } from './FaqDialog';
// import { Button } from '@/components/ui/button';
// import { Edit2, Trash2 } from 'lucide-react';
// import { FAQ } from '@prisma/client';
// import {
// 	AlertDialog,
// 	AlertDialogAction,
// 	AlertDialogCancel,
// 	AlertDialogContent,
// 	AlertDialogDescription,
// 	AlertDialogFooter,
// 	AlertDialogHeader,
// 	AlertDialogTitle,
// } from '@/components/ui/alert-dialog';
// import { useState } from 'react';
// import { deleteFaq } from '@/actions/sections/faq';
// import { toast } from '@/hooks/use-toast';

// export function FAQList({ initialFaqs }: { initialFaqs: FAQ[] }) {
// 	const [faqs, setFaqs] = useState(initialFaqs);
// 	const [deletingId, setDeletingId] = useState<string | null>(null);

// 	const handleDelete = async (id: string) => {
// 		try {
// 			await deleteFaq(id);
// 			setFaqs((prev) => prev.filter((faq) => faq.id !== id));
// 			toast({
// 				title: 'FAQ Deleted',
// 				description: 'The FAQ has been deleted successfully.',
// 			});
// 		} catch (error) {
// 			toast({
// 				title: 'Error',
// 				description: 'Failed to delete FAQ. Please try again.',
// 				variant: 'destructive',
// 			});
// 		}
// 		setDeletingId(null);
// 	};

// 	const updateFaq = (updatedFaq: FAQ) => {
// 		setFaqs((prev) =>
// 			prev.map((faq) => (faq.id === updatedFaq.id ? updatedFaq : faq))
// 		);
// 	};

// 	if (faqs.length === 0) {
// 		return (
// 			<div className='text-center py-12'>
// 				<p className='text-muted-foreground'>
// 					No FAQs found. Add your first FAQ.
// 				</p>
// 			</div>
// 		);
// 	}

// 	return (
// 		<>
// 			<Accordion type='single' collapsible className='space-y-4 mt-4'>
// 				{faqs.map((faq) => (
// 					<AccordionItem
// 						key={faq.id}
// 						value={faq.id}
// 						className='border rounded-lg px-4'
// 					>
// 						<div className='flex items-center justify-between'>
// 							<AccordionTrigger className='flex-1 text-left'>
// 								{faq.question}
// 							</AccordionTrigger>
// 							<div className='flex items-center gap-2 mr-4'>
// 								<FaqDialog faq={faq} onUpdate={updateFaq}>
// 									<Button variant='ghost' size='icon'>
// 										<Edit2 className='w-4 h-4' />
// 									</Button>
// 								</FaqDialog>
// 								<Button
// 									variant='ghost'
// 									size='icon'
// 									onClick={() => setDeletingId(faq.id)}
// 								>
// 									<Trash2 className='w-4 h-4' />
// 								</Button>
// 							</div>
// 						</div>
// 						<AccordionContent>{faq.answer}</AccordionContent>
// 					</AccordionItem>
// 				))}
// 			</Accordion>

// 			<AlertDialog open={!!deletingId} onOpenChange={() => setDeletingId(null)}>
// 				<AlertDialogContent>
// 					<AlertDialogHeader>
// 						<AlertDialogTitle>Are you sure?</AlertDialogTitle>
// 						<AlertDialogDescription>
// 							This action cannot be undone. This will permanently delete the
// 							FAQ.
// 						</AlertDialogDescription>
// 					</AlertDialogHeader>
// 					<AlertDialogFooter>
// 						<AlertDialogCancel>Cancel</AlertDialogCancel>
// 						<AlertDialogAction
// 							onClick={() => deletingId && handleDelete(deletingId)}
// 						>
// 							Delete
// 						</AlertDialogAction>
// 					</AlertDialogFooter>
// 				</AlertDialogContent>
// 			</AlertDialog>
// 		</>
// 	);
// }

'use client';

import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from '@/components/ui/accordion';
import { FaqDialog } from './FaqDialog';
import { Button } from '@/components/ui/button';
import { Edit2, GripVertical, Trash2 } from 'lucide-react';
import { FAQ } from '@prisma/client';
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useState } from 'react';
import { deleteFaq, updateFaqOrder } from '@/actions/sections/faq';
import { toast } from '@/hooks/use-toast';
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
	sortableKeyboardCoordinates,
	useSortable,
	verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { CSS } from '@dnd-kit/utilities';
import { cn } from '@/lib/utils';

interface SortableFAQItemProps {
	faq: FAQ;
	onUpdate: (faq: FAQ) => void;
	onDeleteClick: (id: string) => void;
}

function SortableFAQItem({
	faq,
	onUpdate,
	onDeleteClick,
}: SortableFAQItemProps) {
	const {
		attributes,
		listeners,
		setNodeRef,
		transform,
		transition,
		isDragging,
	} = useSortable({ id: faq.id });

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
	};

	return (
		<AccordionItem
			ref={setNodeRef}
			style={style}
			value={faq.id}
			className={cn(
				'border rounded-lg px-4',
				isDragging && 'bg-muted/50 border-dashed'
			)}
		>
			<div className='flex items-center '>
				<div
					{...attributes}
					{...listeners}
					className='cursor-grab hover:text-muted-foreground p-2'
				>
					<GripVertical className='w-4 h-4' />
				</div>
				<AccordionTrigger className='flex-1 text-left'>
					{faq.question}
				</AccordionTrigger>
				<div className='flex items-center gap-2 mr-4 ml-auto'>
					<FaqDialog faq={faq} onUpdate={onUpdate}>
						<Button variant='ghost' size='icon'>
							<Edit2 className='w-4 h-4' />
						</Button>
					</FaqDialog>
					<Button
						variant='ghost'
						size='icon'
						onClick={() => onDeleteClick(faq.id)}
					>
						<Trash2 className='w-4 h-4' />
					</Button>
				</div>
			</div>
			<AccordionContent>{faq.answer}</AccordionContent>
		</AccordionItem>
	);
}

export function FAQList({ initialFaqs }: { initialFaqs: FAQ[] }) {
	const [faqs, setFaqs] = useState(initialFaqs);
	const [deletingId, setDeletingId] = useState<string | null>(null);

	const sensors = useSensors(
		useSensor(PointerSensor),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		})
	);

	const handleDragEnd = async (event: DragEndEvent) => {
		const { active, over } = event;

		if (over && active.id !== over.id) {
			const oldIndex = faqs.findIndex((faq) => faq.id === active.id);
			const newIndex = faqs.findIndex((faq) => faq.id === over.id);

			const newOrder = [...faqs];
			const [movedItem] = newOrder.splice(oldIndex, 1);
			newOrder.splice(newIndex, 0, movedItem);

			// Update display orders
			const updatedFaqs = newOrder.map((faq, index) => ({
				...faq,
				displayOrder: index + 1,
			}));

			setFaqs(updatedFaqs);

			try {
				await updateFaqOrder(
					updatedFaqs.map((faq) => ({
						id: faq.id,
						displayOrder: faq.displayOrder,
					}))
				);

				toast({
					title: 'Order Updated',
					description: 'FAQ order has been updated successfully.',
				});
			} catch (error) {
				toast({
					title: 'Error',
					description: 'Failed to update FAQ order. Please try again.',
					variant: 'destructive',
				});
			}
		}
	};

	const handleDelete = async (id: string) => {
		try {
			await deleteFaq(id);
			setFaqs((prev) => prev.filter((faq) => faq.id !== id));
			toast({
				title: 'FAQ Deleted',
				description: 'The FAQ has been deleted successfully.',
			});
		} catch (error) {
			toast({
				title: 'Error',
				description: 'Failed to delete FAQ. Please try again.',
				variant: 'destructive',
			});
		}
		setDeletingId(null);
	};

	const updateFaq = (updatedFaq: FAQ) => {
		setFaqs((prev) =>
			prev.map((faq) => (faq.id === updatedFaq.id ? updatedFaq : faq))
		);
	};

	if (faqs.length === 0) {
		return (
			<div className='text-center py-12'>
				<p className='text-muted-foreground'>
					No FAQs found. Add your first FAQ.
				</p>
			</div>
		);
	}

	return (
		<>
			<DndContext
				sensors={sensors}
				collisionDetection={closestCenter}
				onDragEnd={handleDragEnd}
				modifiers={[restrictToVerticalAxis]}
			>
				<Accordion type='single' collapsible className='space-y-4 mt-4'>
					<SortableContext items={faqs} strategy={verticalListSortingStrategy}>
						{faqs.map((faq) => (
							<SortableFAQItem
								key={faq.id}
								faq={faq}
								onUpdate={updateFaq}
								onDeleteClick={setDeletingId}
							/>
						))}
					</SortableContext>
				</Accordion>
			</DndContext>

			<AlertDialog open={!!deletingId} onOpenChange={() => setDeletingId(null)}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Are you sure?</AlertDialogTitle>
						<AlertDialogDescription>
							This action cannot be undone. This will permanently delete the
							FAQ.
						</AlertDialogDescription>
					</AlertDialogHeader>
					<AlertDialogFooter>
						<AlertDialogCancel>Cancel</AlertDialogCancel>
						<AlertDialogAction
							onClick={() => deletingId && handleDelete(deletingId)}
						>
							Delete
						</AlertDialogAction>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</>
	);
}
