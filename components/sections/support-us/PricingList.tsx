'use client';

import { useState } from 'react';
import { Button, buttonVariants } from '@/components/ui/button';
import { Edit2, GripVertical, Shield, ShieldCheck, Trash2 } from 'lucide-react';
import {
	deletePricingPlan,
	updatePricingPlanOrder,
} from '@/actions/sections/pricing';
import { toast } from '@/hooks/use-toast';
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

import { SubscriptionCardData } from '@/db/support-us';
import Badge from '@/components/Badge';
import Link from 'next/link';

interface SortablePricingPlanProps {
	plan: SubscriptionCardData;
	onDeleteClick: (id: string) => void;
}

function SortablePricingPlan({
	plan,
	onDeleteClick,
}: SortablePricingPlanProps) {
	const {
		attributes,
		listeners,
		setNodeRef,
		transform,
		transition,
		isDragging,
	} = useSortable({ id: plan.id });

	const style = {
		transform: CSS.Transform.toString(transform),
		transition,
	};

	return (
		<div
			ref={setNodeRef}
			style={style}
			className={cn(
				'border rounded-lg px-4 py-3 flex items-center',
				isDragging && 'bg-muted/50 border-dashed'
			)}
		>
			<div
				{...attributes}
				{...listeners}
				className='cursor-grab hover:text-muted-foreground p-2'
			>
				<GripVertical className='w-4 h-4' />
			</div>

			<div className='flex-1 ml-2'>
				<div className='flex items-center gap-2'>
					<h3 className='font-semibold'>{plan.name}</h3>

					<Badge variant={plan.published ? 'success' : 'archive'}>
						{plan.published ? (
							<>
								<ShieldCheck className='w-3 h-auto' /> Published
							</>
						) : (
							<>
								<Shield className='w-3 h-auto' /> Draft
							</>
						)}
					</Badge>
				</div>
				<p className='text-sm text-muted'>{plan.description}</p>
				<div className='text-sm text-muted-foreground'>
					{plan.priceCurrency}
					{plan.priceAmount}/{plan.pricePeriod}
				</div>
			</div>

			<div className='flex items-center gap-2'>
				<Link
					href={`/user/sections/pricing/${plan.id}`}
					className={cn(
						buttonVariants({ variant: 'ghost', size: 'icon' }),
						'hover:bg-muted'
					)}
				>
					<Edit2 className='w-4 h-4' />
				</Link>
				<Button
					variant='ghost'
					size='icon'
					onClick={() => onDeleteClick(plan.id)}
					className='hover:bg-muted'
				>
					<Trash2 className='w-4 h-4' />
				</Button>
			</div>
		</div>
	);
}

export function PricingList({
	initialPlans,
}: {
	initialPlans: SubscriptionCardData[];
}) {
	const [plans, setPlans] = useState(initialPlans);
	const [deletingId, setDeletingId] = useState<string | null>(null); // Fixed type here

	const sensors = useSensors(
		useSensor(PointerSensor),
		useSensor(KeyboardSensor, {
			coordinateGetter: sortableKeyboardCoordinates,
		})
	);

	const handleDragEnd = async (event: DragEndEvent) => {
		const { active, over } = event;

		if (over && active.id !== over.id) {
			const oldIndex = plans.findIndex((plan) => plan.id === active.id);
			const newIndex = plans.findIndex((plan) => plan.id === over.id);

			const newOrder = [...plans];
			const [movedItem] = newOrder.splice(oldIndex, 1);
			newOrder.splice(newIndex, 0, movedItem);

			// Update display orders
			const updatedPlans = newOrder.map((plan, index) => ({
				...plan,
				displayOrder: index + 1,
			}));

			setPlans(updatedPlans);

			try {
				await updatePricingPlanOrder(
					updatedPlans.map((plan) => ({
						id: plan.id,
						displayOrder: plan.displayOrder,
					}))
				);

				toast({
					title: 'Order Updated',
					description: 'Plan order has been updated successfully.',
				});
			} catch (error) {
				toast({
					title: 'Error',
					description: 'Failed to update plan order. Please try again.',
					variant: 'destructive',
				});
			}
		}
	};

	const handleDelete = async (id: string) => {
		try {
			await deletePricingPlan(id);
			setPlans((prev) => prev.filter((plan) => plan.id !== id));
			toast({
				title: 'Plan Deleted',
				description: 'The plan has been deleted successfully.',
			});
		} catch (error) {
			toast({
				title: 'Error',
				description: 'Failed to delete plan. Please try again.',
				variant: 'destructive',
			});
		}
		setDeletingId(null);
	};

	if (plans.length === 0) {
		return (
			<div className='text-center py-12'>
				<p className='text-muted-foreground'>No subscription plans found.</p>
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
				<div className='space-y-2'>
					<SortableContext items={plans} strategy={verticalListSortingStrategy}>
						{plans.map((plan) => (
							<SortablePricingPlan
								key={plan.id}
								plan={plan}
								onDeleteClick={(id: string) => setDeletingId(id)}
							/>
						))}
					</SortableContext>
				</div>
			</DndContext>

			<AlertDialog open={!!deletingId} onOpenChange={() => setDeletingId(null)}>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>Are you sure?</AlertDialogTitle>
						<AlertDialogDescription>
							This action cannot be undone. This will permanently delete the
							subscription plan.
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
