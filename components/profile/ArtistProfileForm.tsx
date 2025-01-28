'use client';
import { ProfileFormState, updateProfile } from '@/actions/profile/profile';
import ErrorMessage from '@/components/ErrorMessage';
import ImageUpload from '@/components/profile/ImageUpload';
import ProfileNav from '@/components/profile/ProfileNav';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MultiSelect } from '@/components/ui/multi-select';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { myArtistData } from '@/db/artist';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { Genre } from '@prisma/client';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useFormState } from 'react-dom';

const MaxChar = 1500;

export default function ArtistProfileForm({
	initialData,
	genres,
}: {
	initialData?: myArtistData;
	genres: Genre[];
}) {
	const initialState: ProfileFormState = {
		message: null,
		errors: {},
		prev: {
			image: initialData?.pic || undefined,
			genres: initialData?.genres.map((g) => g.genreId) || undefined,
		},
	};
	const [state, action] = useFormState(updateProfile, initialState);
	const router = useRouter();

	useEffect(() => {
		if (state?.success) {
			router.push('/user/profile/links');
			toast({
				description: 'Artist Profile updated successfully',
				title: 'Success',
			});
		}
	}, [state, router]);

	return (
		<form action={action}>
			<Tabs value={'profile'} className='mt-4 sm:mt-8 grid sm:gap-3'>
				<ProfileNav />
				<TabsContent value='profile' className='lg:w-2/3 mt-2 grid gap-6'>
					<ErrorMessage
						errors={state?.message ? [state?.message] : undefined}
					/>
					<div className='grid gap-2'>
						<Label
							htmlFor='name'
							className={cn(state?.errors?.name ? 'text-destructive' : '')}
						>
							Artist name
						</Label>
						<Input
							type='text'
							name='name'
							id='name'
							defaultValue={initialData?.name}
							className={cn(
								'max-w-lg',
								state?.errors?.name
									? 'border-destructive focus-visible:ring-destructive '
									: ''
							)}
						/>
						<p className='text-muted text-sm max-w-lg'>
							Your artist name (visible and searchable for other users)
						</p>
						<ErrorMessage errors={state?.errors?.name} />
					</div>
					<ImageUpload
						name='image'
						error={state?.errors?.image}
						initialData={initialData?.pic || undefined}
					/>
					<div className='grid gap-2'>
						<Label
							htmlFor='biography'
							className={cn(state?.errors?.biography ? 'text-destructive' : '')}
						>
							Artist Biography
						</Label>
						<Textarea
							className={cn(
								'max-w-lg min-h-72',
								state?.errors?.biography
									? 'border-destructive focus-visible:ring-destructive '
									: ''
							)}
							maxLength={MaxChar}
							name='biography'
							id='biography'
							defaultValue={initialData?.bio || undefined}
						/>
						<p className='text-muted text-sm max-w-lg'>
							Max. {MaxChar} characters
						</p>
						<ErrorMessage errors={state?.errors?.biography} />
					</div>

					<div className='grid gap-2'>
						<Label
							className={cn(state?.errors?.genres ? 'text-destructive' : '')}
							htmlFor={'genreTags'}
						>
							Artist genre tags
						</Label>
						<MultiSelect
							options={genres.map((g) => ({ label: g.name, value: g.id }))}
							name='genres'
							placeholder='Select genre tags'
							searchPlaceholder='Search genre tags...'
							emptyMessage='No genre tag found.'
							initialValue={
								initialData?.genres
									? initialData?.genres.map((g) => g.genreId)
									: undefined
							}
							className={cn(
								'max-w-lg',
								state?.errors?.genres
									? 'border-destructive focus-visible:ring-destructive '
									: ''
							)}
						/>
						<p className='text-sm text-muted'>
							Select up to 3 genre tags for your music
						</p>
						<ErrorMessage errors={state?.errors?.genres} />
					</div>
				</TabsContent>
			</Tabs>
		</form>
	);
}
