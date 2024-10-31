import TermsLegalBanner from '@/components/termsAndLegal/TermsLegalBanner';
import TermsLegalNav from '@/components/termsAndLegal/TermsLegalNav';

export default function Layout({ children }: { children: React.ReactNode }) {
	return (
		<main className=' space-y-6'>
			<TermsLegalBanner />
			<TermsLegalNav />

			{children}
		</main>
	);
}
