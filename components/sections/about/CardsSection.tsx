'use client';

import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogFooter,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { Loader, Plus } from 'lucide-react';
import { useFormStatus } from 'react-dom';
import { cn } from '@/lib/utils';
import { useFormState } from 'react-dom';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/use-toast';
import { AboutCards } from '@prisma/client';
import ErrorMessage from '../../ErrorMessage';
import {
	updateAboutCards,
	AboutCardsState,
} from '@/actions/pages/about/about-cards';
import { ProducerIcons, ConsumerIcons } from '@/config/about';

export function AboutCardsDialog({
	open,
	setopen,
	initialData,
	type = 'producers',
}: {
	initialData?: AboutCards;
	open: boolean;
	setopen: Dispatch<SetStateAction<boolean>>;
	type?: 'producers' | 'consumers';
}) {
	const initialState: AboutCardsState = { message: null, errors: {} };
	const [state, action] = useFormState(
		updateAboutCards.bind(null, type),
		initialState
	);

	useEffect(() => {
		if (!state) return;

		const handleStateChange = () => {
			setopen(false);
			toast({
				variant: state.success ? 'default' : 'destructive',
				title: state.success ? 'Success' : 'Error',
				description: state.success
					? `${type} cards section updated successfully`
					: state.message || `Failed to update ${type} section cards`,
			});
		};

		if (state.success !== undefined) {
			handleStateChange();
		}
	}, [state, setopen, type]);

	return (
		<Dialog open={open} onOpenChange={setopen}>
			<DialogContent className='sm:max-w-[740px]'>
				<DialogHeader>
					<DialogTitle>Update {type} Cards</DialogTitle>
					<DialogDescription>
						{`Update the cards that appear on the ${
							type === 'producers' ? "producer's" : "consumer's"
						} section of the about page. You can add 5 cards with a title.`}
					</DialogDescription>
				</DialogHeader>

				<form className='grid gap-2 ' id='update' action={action}>
					<div className='grid gap-2 items-center'>
						<Label
							htmlFor='heading'
							className={cn(state?.errors?.heading ? 'text-destructive' : '')}
						>
							Title
						</Label>

						<Input
							type='text'
							name='heading'
							id='heading'
							defaultValue={initialData?.heading || undefined}
							className={cn(
								'flex-1',
								state?.errors?.heading
									? 'border-destructive focus-visible:ring-destructive '
									: ''
							)}
						/>

						<ErrorMessage errors={state?.errors?.heading} />
					</div>
					<div className='grid gap-2 items-center'>
						<Label
							htmlFor='card1'
							className={cn(state?.errors?.card1 ? 'text-destructive' : '')}
						>
							Card 1
						</Label>
						<div className='flex items-center '>
							{type === 'producers' ? (
								<ProducerIcons.card1 className='mr-2 w-6 h-auto aspect-square fill-foreground' />
							) : (
								<ConsumerIcons.card1 className='mr-2 w-6 h-auto aspect-square fill-foreground' />
							)}

							<Input
								type='text'
								name='card1'
								id='card1'
								defaultValue={initialData?.card1 || undefined}
								className={cn(
									'flex-1',
									state?.errors?.card1
										? 'border-destructive focus-visible:ring-destructive '
										: ''
								)}
							/>
						</div>
						<ErrorMessage errors={state?.errors?.card1} />
					</div>
					<div className='grid gap-2 items-center'>
						<Label
							htmlFor='card2'
							className={cn(state?.errors?.card2 ? 'text-destructive' : '')}
						>
							Card 2
						</Label>
						<div className='flex items-center '>
							{type === 'producers' ? (
								<ProducerIcons.card2 className='mr-2 w-6 h-auto aspect-square fill-foreground' />
							) : (
								<ConsumerIcons.card2 className='mr-2 w-6 h-auto aspect-square fill-foreground' />
							)}
							<Input
								type='text'
								name='card2'
								id='card2'
								defaultValue={initialData?.card2 || undefined}
								className={cn(
									'flex-1',
									state?.errors?.card2
										? 'border-destructive focus-visible:ring-destructive '
										: ''
								)}
							/>
						</div>
						<ErrorMessage errors={state?.errors?.card2} />
					</div>
					<div className='grid gap-2 items-center'>
						<Label
							htmlFor='card3'
							className={cn(state?.errors?.card3 ? 'text-destructive' : '')}
						>
							Card 3
						</Label>
						<div className='flex items-center '>
							{type === 'producers' ? (
								<ProducerIcons.card3 className='mr-2 w-6 h-auto aspect-square fill-foreground' />
							) : (
								<ConsumerIcons.card3 className='mr-2 w-6 h-auto aspect-square fill-foreground' />
							)}
							<Input
								type='text'
								name='card3'
								id='card3'
								defaultValue={initialData?.card3 || undefined}
								className={cn(
									'flex-1',
									state?.errors?.card3
										? 'border-destructive focus-visible:ring-destructive '
										: ''
								)}
							/>
						</div>
						<ErrorMessage errors={state?.errors?.card3} />
					</div>
					<div className='grid gap-2 items-center'>
						<Label
							htmlFor='card4'
							className={cn(state?.errors?.card4 ? 'text-destructive' : '')}
						>
							Card 4
						</Label>
						<div className='flex items-center '>
							{type === 'producers' ? (
								<ProducerIcons.card4 className='mr-2 w-6 h-auto aspect-square fill-foreground' />
							) : (
								<ConsumerIcons.card4 className='mr-2 w-6 h-auto aspect-square fill-foreground' />
							)}
							<Input
								type='text'
								name='card4'
								id='card4'
								defaultValue={initialData?.card4 || undefined}
								className={cn(
									'flex-1',
									state?.errors?.card4
										? 'border-destructive focus-visible:ring-destructive '
										: ''
								)}
							/>
						</div>
						<ErrorMessage errors={state?.errors?.card4} />
					</div>
					<div className='grid gap-2 items-center'>
						<Label
							htmlFor='card5'
							className={cn(state?.errors?.card5 ? 'text-destructive' : '')}
						>
							Card 5
						</Label>
						<div className='flex items-center '>
							{type === 'producers' ? (
								<ProducerIcons.card5 className='mr-2 w-6 h-auto aspect-square fill-foreground' />
							) : (
								<ConsumerIcons.card5 className='mr-2 w-6 h-auto aspect-square fill-foreground' />
							)}
							<Input
								type='text'
								name='card5'
								id='card5'
								defaultValue={initialData?.card5 || undefined}
								className={cn(
									'flex-1',
									state?.errors?.card5
										? 'border-destructive focus-visible:ring-destructive '
										: ''
								)}
							/>
						</div>
						<ErrorMessage errors={state?.errors?.card5} />
					</div>

					<DialogFooter>
						{(state?.message || state?.errors) && (
							<p className='text-sm font-medium text-destructive mr-auto'>
								{state?.message}
							</p>
						)}
						<PendingButton type={type} />
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}

function PendingButton({
	type = 'producers',
}: {
	type: 'producers' | 'consumers';
}) {
	const { pending } = useFormStatus();

	return (
		<Button type='submit' aria-disabled={pending} disabled={pending}>
			{pending ? (
				<Loader className='mr-2 h-4 w-4 animate-spin' />
			) : (
				<Plus className='mr-2 h-4 w-4' />
			)}
			Update {type} cards
		</Button>
	);
}

export function EditAboutCardsButton({
	data,
	type = 'producers',
	children,
}: {
	data?: AboutCards;
	children: React.ReactNode;
	type: 'producers' | 'consumers';
}) {
	const [open, setOpen] = useState(false);

	return (
		<>
			<span className='cursor-pointer' onClick={() => setOpen(true)}>
				{children}
			</span>
			<AboutCardsDialog
				open={open}
				setopen={setOpen}
				initialData={data}
				key={open ? 'open' : 'close'}
				type={type}
			/>
		</>
	);
}
