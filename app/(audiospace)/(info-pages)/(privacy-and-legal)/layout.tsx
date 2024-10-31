import NewsLetter from '@/components/termsAndLegal/NewsLetter';
import TermsLinks from '@/components/termsAndLegal/TermsLinks';

export default function Layout({ children }: { children: React.ReactNode }) {
	return (
		<div className='grid xl:grid-cols-3 gap-6'>
			<div className='md:col-span-2 max-w-3xl space-y-8'>
				{children}
				<NewsLetter />
			</div>
			<TermsLinks />
		</div>
	);
}
