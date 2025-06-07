import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Link from 'next/link';

// Auth Gate Component
export const AuthGate = () => (
	<div className='bg-secondary flex items-center justify-center sm:aspect-video relative w-full mt-2 rounded-2xl overflow-hidden border-2'>
		<div className='text-center space-y-3 sm:space-y-4 p-4 sm:p-8 max-w-md mx-auto'>
			<div className='w-12 h-12 sm:w-16 sm:h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto'>
				<svg
					className='w-6 h-6 sm:w-8 sm:h-8 text-primary'
					fill='none'
					stroke='currentColor'
					viewBox='0 0 24 24'
				>
					<path
						strokeLinecap='round'
						strokeLinejoin='round'
						strokeWidth={2}
						d='M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z'
					/>
				</svg>
			</div>
			<div className='space-y-2 sm:space-y-3'>
				<h3 className='text-lg sm:text-xl font-semibold'>Sign in to watch</h3>
				<p className='text-muted-foreground text-sm sm:text-base leading-relaxed'>
					You need to be signed in to access course videos
				</p>
				<div className='flex flex-col sm:flex-row items-center gap-2 sm:gap-3 justify-center pt-1'>
					<Link
						href='/login'
						className={cn(
							buttonVariants({ variant: 'default', size: 'sm' }),
							'w-full sm:w-auto min-w-[100px]'
						)}
					>
						Login
					</Link>
					<Link
						href='/signup'
						className={cn(
							buttonVariants({ variant: 'secondary', size: 'sm' }),
							'w-full sm:w-auto min-w-[100px]'
						)}
					>
						Sign Up
					</Link>
				</div>
			</div>
		</div>
	</div>
);

// Pro Gate Component
export const ProGate = () => (
	<div className='bg-secondary flex items-center justify-center sm:aspect-video relative w-full mt-2 rounded-2xl overflow-hidden border-2 border-primary/60'>
		<div className='text-center space-y-3 sm:space-y-4 p-4 sm:p-8 max-w-md mx-auto'>
			<div className='w-12 h-12 sm:w-16 sm:h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto'>
				<svg
					className='w-6 h-6 sm:w-8 sm:h-8 text-primary'
					fill='none'
					stroke='currentColor'
					viewBox='0 0 24 24'
				>
					<path
						strokeLinecap='round'
						strokeLinejoin='round'
						strokeWidth={2}
						d='M5 3l14 9-14 9V3z'
					/>
				</svg>
			</div>
			<div className='space-y-2 sm:space-y-3'>
				<h3 className='text-lg sm:text-xl font-semibold '>Pro Content</h3>
				<p className='text-muted-foreground text-sm sm:text-base leading-relaxed font-medium'>
					This chapter is only available to Pro subscribers
				</p>
				<div className='flex flex-col sm:flex-row items-center gap-2 sm:gap-3 justify-center pt-1'>
					<Link
						href='/user/settings/membership'
						className={cn(
							buttonVariants({ variant: 'default', size: 'sm' }),
							'w-full sm:w-auto min-w-[100px]'
						)}
					>
						Manage Membership
					</Link>
					<Link
						href='/support-us'
						className={cn(
							buttonVariants({ variant: 'outline', size: 'sm' }),
							'w-full sm:w-auto min-w-[100px]'
						)}
					>
						Learn More
					</Link>
				</div>
			</div>
		</div>
	</div>
);
