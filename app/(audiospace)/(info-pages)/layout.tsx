import ContactDialog from '@/components/contactForm/ContactDialog';
import TermsLegalBanner from '@/components/termsAndLegal/TermsLegalBanner';
import TermsLegalNav from '@/components/termsAndLegal/TermsLegalNav';
import { Button } from '@/components/ui/button';

export default function Layout({ children }: { children: React.ReactNode }) {
	return (
		<main className=' space-y-6'>
			<TermsLegalBanner />
			<TermsLegalNav />

			{children}
			<ContactDialog>
				<Button>Contact Us</Button>
			</ContactDialog>
		</main>
	);
}
