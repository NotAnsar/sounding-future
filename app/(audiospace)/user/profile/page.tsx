'use client';
import { updateProfile } from '@/actions/profile/profile';
import ErrorMessage from '@/components/ErrorMessage';
import ImageUpload from '@/components/profile/ImageUpload';
import ProfileNav from '@/components/profile/ProfileNav';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { MultiSelect } from '@/components/ui/multi-select';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import { Textarea } from '@/components/ui/textarea';
import { genres } from '@/config/dummy-data';
import { toast } from '@/hooks/use-toast';
import { cn } from '@/lib/utils';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';
import { useFormState } from 'react-dom';

export default function Page() {
	const initialState = { message: null, errors: {} };
	const [state, action] = useFormState(updateProfile, initialState);
	const router = useRouter();

	useEffect(() => {
		if (state?.message === 'Profile updated successfully') {
			router.push('/');
			toast({ description: 'Profile updated successfully', title: 'Success' });
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
					<ImageUpload name='image' error={state?.errors?.image} />
					<div className='grid gap-2'>
						<Label
							htmlFor='biography'
							className={cn(state?.errors?.biography ? 'text-destructive' : '')}
						>
							Artist Biography
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
						<p className='text-muted text-sm max-w-lg'>Max. 500 characters</p>
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
