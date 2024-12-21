'use client';

import { useFormState } from 'react-dom';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import ErrorMessage from '@/components/ErrorMessage';
import SoundingFutureArticlesInput from '@/components/profile/links/SoundingFutureArticlesInput';
import { Facebook, Instagram, Linkedin, Youtube } from 'lucide-react';
import { ArtistDetails } from '@/db/artist';
import { myArticles } from '@/db/articles';
import ArtistNav from './ArtistNav';
import { updateArtistLinks } from '@/actions/artists/links';

export default function ArtistLinksForm({
	artistId,
	initialData,
	articles,
}: {
	initialData?: ArtistDetails;
	articles?: myArticles[];
	artistId: string;
}) {
	const [state, formAction] = useFormState(
		updateArtistLinks.bind(null, artistId),
		{ prev: { articles: articles?.map((a) => a.articleId) } }
	);

	return (
		<form action={formAction}>
			<Tabs value='links' className='mt-4 sm:mt-8 grid sm:gap-3'>
				<ArtistNav id={artistId} step={2} />

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
				</TabsContent>
			</Tabs>
		</form>
	);
}
