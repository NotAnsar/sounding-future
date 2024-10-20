'use client';
import { updateProfile } from '@/actions/profile/profile';
import ErrorMessage from '@/components/ErrorMessage';
import GenreSelector from '@/components/profile/GenreSelector';
import ImageUpload from '@/components/profile/ImageUpload';
import ProfileNav from '@/components/profile/ProfileNav';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useFormState } from 'react-dom';

export const AVAILABLE_GENRES = [
	'Rock',
	'Pop',
	'Jazz',
	'Classical',
	'Hip Hop',
	'Electronic',
	'Country',
	'R&B',
];

export default function Page() {
	const initialState = { message: null, errors: {} };
	const [state, action] = useFormState(updateProfile, initialState);
	const router = useRouter();

	useEffect(() => {
		if (state.message === 'Profile updated successfully') {
			router.push('/');
			toast({ description: 'Profile updated successfully', title: 'Success' });
		}
	}, [state, router]);

	return (
		<form action={action}>
			<Tabs value={'profile'} className='mt-4 sm:mt-8 grid sm:gap-3'>
				<ProfileNav />
				<TabsContent value='profile' className='lg:w-2/3 mt-2 grid gap-6'>
					<ErrorMessage errors={state.message ? [state.message] : undefined} />
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
							className={cn(
								'max-w-lg',
								state?.errors?.name
									? 'border-destructive focus-visible:ring-destructive '
									: ''
							)}
						/>
						<p className='text-muted text-sm'>
							Your artist name (visible and searchable for other users)
						</p>
						<ErrorMessage errors={state?.errors?.name} />
					</div>
					<ImageUpload name='image' error={state?.errors?.image} />
					<div className='grid gap-2'>
						<Label
							htmlFor='biography'
							className={cn(state?.errors?.biography ? 'text-destructive' : '')}
						>
							User Biography
						</Label>
						<Textarea
							className={cn(
								'max-w-lg min-h-32',
								state?.errors?.biography
									? 'border-destructive focus-visible:ring-destructive '
									: ''
							)}
							name='biography'
							id='biography'
						/>
						<p className='text-muted text-sm'>Max. 500 characters</p>
						<ErrorMessage errors={state?.errors?.biography} />
					</div>

					<GenreSelector
						genres={AVAILABLE_GENRES}
						initialGenres={[]}
						error={state?.errors?.genres}
						message='Select up to 3 genre tags for your music'
					/>
				</TabsContent>
			</Tabs>
		</form>
	);
}
