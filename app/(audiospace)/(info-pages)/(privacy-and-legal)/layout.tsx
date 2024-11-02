import ContactUsButton from '@/components/termsAndLegal/ContactUsButton';
import NewsLetter from '@/components/termsAndLegal/NewsLetter';
import TermsLinks from '@/components/termsAndLegal/TermsLinks';

export default function Layout({ children }: { children: React.ReactNode }) {
	return (
		<div className='grid xl:grid-cols-3 gap-6'>
			<div className='md:col-span-2 max-w-3xl space-y-8'>
				{children}

				<div className='mt-12 space-y-4'>
					<ContactUsButton className='w-full sm:w-auto' />

					<p className='text-sm'>
						We reserve the right to update this Privacy Policy. Changes will be
						posted on the Platform, and your continued use of our Services
						following any such change will constitute your acceptance of the
						updated Policy.
					</p>
				</div>
				<NewsLetter />
			</div>
			<TermsLinks />
		</div>
	);
}
