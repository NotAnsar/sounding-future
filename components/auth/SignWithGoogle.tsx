import { googleSignIn } from '@/actions/auth/google-auth';
import { Icons } from '../icons/audio-player';
import { SubmitButton } from './SubmitButton';

export default function SignWithGoogle() {
	return (
		<form action={googleSignIn} className='w-full'>
			<SubmitButton variant={'outline'} className='w-full'>
				<Icons.google className='mr-2 w-6 fill-white' />
				Sign Up With Google
			</SubmitButton>
		</form>
	);
}
