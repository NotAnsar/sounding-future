import TopNavPublic from '@/components/Nav/TopNavPublic';
import TermsLegalBanner from '@/components/termsAndLegal/TermsLegalBanner';
import TermsLegalNav from '@/components/termsAndLegal/TermsLegalNav';
import TermsLinks from '@/components/termsAndLegal/TermsLinks';

export default function Layout({ children }: { children: React.ReactNode }) {
	return (
		<>
			<TopNavPublic />

			<main className='mt-20 max-w-screen-xl mx-auto p-4 md:p-6 space-y-6'>
				<TermsLegalBanner />
				<TermsLegalNav />

				<div className='grid md:grid-cols-3 gap-6'>
					<div className='md:col-span-2 max-w-2xl'>{children}</div>
					<TermsLinks />
				</div>
			</main>
		</>
	);
}
