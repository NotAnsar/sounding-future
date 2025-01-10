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
import { SocialLinks } from '@prisma/client';
import ErrorMessage from '../ErrorMessage';
import {
	SocialLinksState,
	updateSocialLinks,
} from '@/actions/sections/social-links';
import { Icons } from '../icons/socials';

export function SocialsDialog({
	open,
	setopen,
	initialData,
}: {
	initialData?: SocialLinks;
	open: boolean;
	setopen: Dispatch<SetStateAction<boolean>>;
}) {
	const initialState: SocialLinksState = { message: null, errors: {} };
	const [state, action] = useFormState(updateSocialLinks, initialState);

	useEffect(() => {
		if (!state) return;

		const handleStateChange = () => {
			setopen(false);
			toast({
				variant: state.success ? 'default' : 'destructive',
				title: state.success ? 'Success' : 'Error',
				description: state.success
					? 'Social Links updated successfully'
					: state.message || 'Failed to update social links',
			});
		};

		if (state.success !== undefined) {
			handleStateChange();
		}
	}, [state, setopen]);

	return (
		<Dialog open={open} onOpenChange={setopen}>
			<DialogContent className='sm:max-w-[620px]'>
				<DialogHeader>
					<DialogTitle>Update Social Links</DialogTitle>
					<DialogDescription>
						{
							"Update Social Links. Enter the Social Links details and click save when you're done."
						}
					</DialogDescription>
				</DialogHeader>

				<form className='grid gap-2 ' id='update' action={action}>
					{/* <div className='grid md:grid-cols-2 gap-3'> */}
					<div className='grid gap-2 items-center'>
						<Label
							htmlFor='facebook'
							className={cn(state?.errors?.facebook ? 'text-destructive' : '')}
						>
							Facebook
						</Label>
						<div className='flex items-center '>
							<Icons.facebook className='mr-2 w-6 h-auto aspect-square fill-foreground' />
							<Input
								type='text'
								name='facebook'
								id='facebook'
								defaultValue={initialData?.facebook || undefined}
								className={cn(
									'flex-1',
									state?.errors?.facebook
										? 'border-destructive focus-visible:ring-destructive '
										: ''
								)}
							/>
						</div>
						<ErrorMessage errors={state?.errors?.facebook} />
					</div>
					<div className='grid gap-2 items-center'>
						<Label
							htmlFor='instagram'
							className={cn(state?.errors?.instagram ? 'text-destructive' : '')}
						>
							Instagram
						</Label>
						<div className='flex items-center '>
							<Icons.instagram className='mr-2 w-6 h-auto aspect-square fill-foreground' />
							<Input
								type='text'
								name='instagram'
								id='instagram'
								defaultValue={initialData?.instagram || undefined}
								className={cn(
									'flex-1',
									state?.errors?.instagram
										? 'border-destructive focus-visible:ring-destructive '
										: ''
								)}
							/>
						</div>
						<ErrorMessage errors={state?.errors?.instagram} />
					</div>

					<div className='grid gap-2 items-center'>
						<Label
							htmlFor='linkedin'
							className={cn(state?.errors?.linkedin ? 'text-destructive' : '')}
						>
							LinkedIn
						</Label>
						<div className='flex items-center '>
							<Icons.linkedin className='mr-2 w-6 h-auto aspect-square fill-foreground' />
							<Input
								type='text'
								name='linkedin'
								id='linkedin'
								defaultValue={initialData?.linkedin || undefined}
								className={cn(
									'flex-1',
									state?.errors?.linkedin
										? 'border-destructive focus-visible:ring-destructive '
										: ''
								)}
							/>
						</div>
						<ErrorMessage errors={state?.errors?.linkedin} />
					</div>
					<div className='grid gap-2 items-center'>
						<Label
							htmlFor='youtube'
							className={cn(state?.errors?.youtube ? 'text-destructive' : '')}
						>
							YouTube
						</Label>
						<div className='flex items-center '>
							<Icons.youtube className='mr-2 w-6 h-auto aspect-square fill-foreground' />
							<Input
								type='text'
								name='youtube'
								id='youtube'
								defaultValue={initialData?.youtube || undefined}
								className={cn(
									'flex-1',
									state?.errors?.youtube
										? 'border-destructive focus-visible:ring-destructive '
										: ''
								)}
							/>
						</div>
						<ErrorMessage errors={state?.errors?.youtube} />
					</div>
					<div className='grid gap-2 items-center'>
						<Label
							htmlFor='mastodon'
							className={cn(state?.errors?.mastodon ? 'text-destructive' : '')}
						>
							Mastodon
						</Label>
						<div className='flex items-center '>
							<Icons.mastodon className='mr-2 w-6 h-auto aspect-square fill-foreground' />
							<Input
								type='text'
								name='mastodon'
								id='mastodon'
								defaultValue={initialData?.mastodon || undefined}
								className={cn(
									'flex-1',
									state?.errors?.mastodon
										? 'border-destructive focus-visible:ring-destructive '
										: ''
								)}
							/>
						</div>
						<ErrorMessage errors={state?.errors?.mastodon} />
					</div>
					<div className='grid gap-2 items-center'>
						<Label
							htmlFor='youtube'
							className={cn(
								state?.errors?.websiteLink ? 'text-destructive' : ''
							)}
						>
							Website Link
						</Label>
						<div className='flex items-center '>
							<Icons.world className='mr-2 w-6 h-auto aspect-square fill-foreground' />
							<Input
								type='text'
								name='websiteLink'
								id='websiteLink'
								defaultValue={initialData?.website || undefined}
								className={cn(
									'flex-1',
									state?.errors?.websiteLink
										? 'border-destructive focus-visible:ring-destructive '
										: ''
								)}
							/>
						</div>
						<ErrorMessage errors={state?.errors?.websiteLink} />
					</div>
					{/* </div> */}

					<DialogFooter>
						{(state?.message || state?.errors) && (
							<p className='text-sm font-medium text-destructive mr-auto'>
								{state?.message}
							</p>
						)}
						<PendingButton />
					</DialogFooter>
				</form>
			</DialogContent>
		</Dialog>
	);
}

function PendingButton() {
	const { pending } = useFormStatus();

	return (
		<Button type='submit' aria-disabled={pending} disabled={pending}>
			{pending ? (
				<Loader className='mr-2 h-4 w-4 animate-spin' />
			) : (
				<Plus className='mr-2 h-4 w-4' />
			)}
			Update Social Links
		</Button>
	);
}

export function EditSocialsButton({
	data,
	children,
}: {
	data?: SocialLinks;
	children: React.ReactNode;
}) {
	const [open, setOpen] = useState(false);

	return (
		<>
			<span className='cursor-pointer' onClick={() => setOpen(true)}>
				{children}
			</span>
			<SocialsDialog
				open={open}
				setopen={setOpen}
				initialData={data}
				key={open ? 'open' : 'close'}
			/>
		</>
	);
}
