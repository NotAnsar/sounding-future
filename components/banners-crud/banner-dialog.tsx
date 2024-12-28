'use client';
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { cn } from '@/lib/utils';
import { useFormState } from 'react-dom';
import { BannerState, createBanner } from '@/actions/banner-action';
import { useState } from 'react';
import { Plus } from 'lucide-react';
import { Banner } from '@prisma/client';

interface BannerDialogProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
	initialData?: Banner;
}

export default function BannerDialog({
	open,
	onOpenChange,
	initialData,
}: BannerDialogProps) {
	const initialState: BannerState = {
		message: null,
		errors: {},
	};
	const [state, formAction] = useFormState(createBanner, initialState);

	const [backgroundColor, setBackgroundColor] = useState(
		initialData?.backgroundColor || '#ffffff'
	);

	const handleColorChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		setBackgroundColor(e.target.value);
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogContent className='max-w-screen-md'>
				<DialogHeader>
					<DialogTitle>
						{initialData?.id ? 'Edit Banner' : 'Create Banner'}
					</DialogTitle>
				</DialogHeader>
				<form action={formAction}>
					<div className='grid gap-4 py-4'>
						<div className='grid gap-2'>
							<Label htmlFor='title'>Title</Label>
							<Input
								id='title'
								name='title'
								defaultValue={initialData?.title}
								className={cn(state?.errors?.title ? 'border-destructive' : '')}
							/>
							{state?.errors?.title && (
								<p className='text-sm text-destructive'>
									{state.errors.title[0]}
								</p>
							)}
						</div>

						<div className='grid gap-2'>
							<Label htmlFor='description'>Description</Label>
							<Textarea
								id='description'
								name='description'
								defaultValue={initialData?.description}
								className={cn(
									state?.errors?.description ? 'border-destructive' : '',
									'min-h-[100px]'
								)}
								placeholder='Enter banner description...'
							/>
							{state?.errors?.description && (
								<p className='text-sm text-destructive'>
									{state.errors.description[0]}
								</p>
							)}
						</div>

						<div className='grid gap-2'>
							<Label htmlFor='backgroundColor'>Background Color</Label>
							<div className='flex gap-2 items-center'>
								<Input
									type='color'
									id='backgroundColor'
									name='backgroundColor'
									value={backgroundColor}
									onChange={handleColorChange}
									className={cn(
										state?.errors?.backgroundColor ? 'border-destructive' : '',
										'w-14 h-10 p-1'
									)}
								/>
								<Input
									type='text'
									value={backgroundColor}
									onChange={handleColorChange}
									className='flex-1'
								/>
							</div>
						</div>

						<div className='grid gap-2'>
							<Label htmlFor='backgroundImage'>Background Image</Label>
							<Input
								id='backgroundImage'
								name='backgroundImage'
								defaultValue={initialData?.backgroundImage || undefined}
								className={cn(
									state?.errors?.backgroundImage ? 'border-destructive' : ''
								)}
							/>
							{state?.errors?.backgroundImage && (
								<p className='text-sm text-destructive'>
									{state.errors.backgroundImage[0]}
								</p>
							)}
						</div>

						<div className='grid gap-2'>
							<Label htmlFor='buttonText'>Button Text</Label>
							<Input
								id='buttonText'
								name='buttonText'
								defaultValue={initialData?.buttonText}
								className={cn(
									state?.errors?.buttonText ? 'border-destructive' : ''
								)}
							/>
							{state?.errors?.buttonText && (
								<p className='text-sm text-destructive'>
									{state.errors.buttonText[0]}
								</p>
							)}
						</div>

						<div className='grid gap-2'>
							<Label htmlFor='link'>Link</Label>
							<Input
								id='link'
								name='link'
								defaultValue={initialData?.link}
								className={cn(state?.errors?.link ? 'border-destructive' : '')}
							/>
							{state?.errors?.link && (
								<p className='text-sm text-destructive'>
									{state.errors.link[0]}
								</p>
							)}
						</div>

						<div className='grid gap-2'>
							<Label htmlFor='published'>Published</Label>
							<Input
								type='checkbox'
								id='published'
								name='published'
								defaultChecked={initialData?.published}
								className={cn(
									state?.errors?.published ? 'border-destructive' : ''
								)}
							/>
							{state?.errors?.published && (
								<p className='text-sm text-destructive'>
									{state.errors.published[0]}
								</p>
							)}
						</div>
					</div>

					<div className='flex justify-end'>
						<Button type='submit'>
							{initialData?.id ? 'Save changes' : 'Create'}
						</Button>
					</div>
				</form>
			</DialogContent>
		</Dialog>
	);
}

export function CreateBannerButton() {
	const [isCreateDialogOpen, setIsCreateDialogOpen] = useState(false);

	return (
		<>
			<Button onClick={() => setIsCreateDialogOpen(true)}>
				<Plus className='w-4 h-auto aspect-square mr-2' /> Add Banner
			</Button>
			<BannerDialog
				open={isCreateDialogOpen}
				onOpenChange={setIsCreateDialogOpen}
				key={isCreateDialogOpen ? 'opened' : 'closed'}
			/>
		</>
	);
}
