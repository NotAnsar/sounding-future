import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';

export default async function SignInForm() {
	return (
		<div className={`grid gap-6`}>
			<form>
				<div className='grid gap-4'>
					<div className='grid gap-2'>
						<Label className='font-semibold text-[15px]'>UserName</Label>
						<Input
							name='username'
							placeholder='JohnDoe'
							className='h-12 text-base placeholder:text-base'
							required
						/>
					</div>
					<div className='grid gap-2'>
						<Label className='font-semibold text-[15px]'>Email</Label>
						<Input
							type='email'
							name='email'
							placeholder='name@example.com'
							className='h-12 text-base placeholder:text-base'
							required
						/>
					</div>
					<div className='grid gap-2'>
						<Label className='font-semibold text-[15px]'>Password</Label>
						<Input
							type='password'
							name='password'
							placeholder='********'
							required
							className='h-12 text-base placeholder:text-base'
						/>
					</div>
					<Button
						type='submit'
						size={'xl'}
						className='font-semibold text-[15px] mt-2'
					>
						Sign Up with Email
					</Button>
				</div>
			</form>
			<div className='relative '>
				<div className='absolute inset-0 flex items-center'>
					<span className='w-full border-t' />
				</div>
				<div className='relative flex justify-center text-xs uppercase'>
					<span className='bg-background px-2 text-muted-foreground'>
						Or continue with
					</span>
				</div>
			</div>
			<div className='grid gap-3 w-full'>
				<Button
					type='button'
					variant={'outline'}
					size={'xl'}
					className='font-semibold text-[15px]'
				>
					Sign Up With Google
				</Button>
			</div>
		</div>
	);
}
