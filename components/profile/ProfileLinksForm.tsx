'use client';

import React, { useEffect } from 'react';
import { useFormState } from 'react-dom';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import ErrorMessage from '@/components/ErrorMessage';
import ProfileNav from '@/components/profile/ProfileNav';
import { updateProfileLinks } from '@/actions/profile/links';
import SoundingFutureArticlesInput from '@/components/profile/links/SoundingFutureArticlesInput';
import { Facebook, Instagram, Linkedin, Youtube } from 'lucide-react';
import { myArtistData } from '@/db/artist';
import { myArticles } from '@/db/articles';
import { Icons } from '../icons/socials';

export default function ProfileLinksForm({
	initialData,
	articles,
}: {
	initialData?: myArtistData;
	articles?: myArticles[];
}) {
	const [state, formAction] = useFormState(updateProfileLinks, {
		prev: { articles: articles?.map((a) => a.articleId) },
	});
	const router = useRouter();

	useEffect(() => {
		if (state.success) {
			router.push('/');
			toast({
				description: 'Artist Links updated successfully',
				title: 'Success',
			});
		}
	}, [state, router]);

	return (
		<form action={formAction}>
			<Tabs value='links' className='mt-4 sm:mt-8 grid sm:gap-3'>
				<ProfileNav />

				<TabsContent value='links' className='lg:w-2/3 mt-2 grid gap-6'>
					<ErrorMessage
						errors={state?.message ? [state?.message] : undefined}
					/>

					{/* Website Link */}
					<div className='grid gap-2'>
						<Label
							htmlFor='websiteLink'
							className={cn(
								state?.errors?.websiteLink ? 'text-destructive' : ''
							)}
						>
							Website Link
						</Label>
						<Input
							type='text'
							name='websiteLink'
							id='websiteLink'
							placeholder='http://'
							defaultValue={initialData?.socialLinks?.website || undefined}
							className={cn(
								'max-w-lg',
								state?.errors?.websiteLink
									? 'border-destructive focus-visible:ring-destructive'
									: ''
							)}
						/>
						<p className='text-muted-foreground text-sm'>
							Enter your Website URL here
						</p>
						<ErrorMessage errors={state?.errors?.websiteLink} />
					</div>

					<SoundingFutureArticlesInput
						errors={state?.errors?.soundingFutureArticles}
						defaultValue={articles?.map((a) => a.article.url) || undefined}
					/>

					<div className='grid gap-2 items-center'>
						<Label
							htmlFor='facebook'
							className={cn(state?.errors?.facebook ? 'text-destructive' : '')}
						>
							Facebook
						</Label>
						<div className='flex items-center max-w-lg'>
							<Facebook className='mr-2' strokeWidth='1.5' />
							<Input
								type='text'
								name='facebook'
								id='facebook'
								defaultValue={initialData?.socialLinks?.facebook || undefined}
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
						<div className='flex items-center max-w-lg'>
							<Instagram className='mr-2' strokeWidth='1.5' />
							<Input
								type='text'
								name='instagram'
								id='instagram'
								defaultValue={initialData?.socialLinks?.instagram || undefined}
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
						<div className='flex items-center max-w-lg'>
							<Linkedin className='mr-2 ' strokeWidth='1.5' />
							<Input
								type='text'
								name='linkedin'
								id='linkedin'
								defaultValue={initialData?.socialLinks?.linkedin || undefined}
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
						<div className='flex items-center max-w-lg'>
							<Youtube className='mr-2' strokeWidth='1.5' />
							<Input
								type='text'
								name='youtube'
								id='youtube'
								defaultValue={initialData?.socialLinks?.youtube || undefined}
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
						<div className='flex items-center max-w-lg'>
							<Icons.mastodon className='w-6 mr-2 h-auto aspect-square text-foreground fill-foreground cursor-pointer hover:text-primary-foreground transition-colors duration-200 ease-out hover:fill-primary-foreground' />
							<Input
								type='text'
								name='mastodon'
								id='mastodon'
								defaultValue={initialData?.socialLinks?.mastodon || undefined}
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
				</TabsContent>
			</Tabs>
		</form>
	);
}
