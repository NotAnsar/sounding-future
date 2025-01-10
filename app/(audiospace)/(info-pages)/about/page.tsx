import AboutHeader from '@/components/termsAndLegal/about/AboutHeader';
import ContactUsButton from '@/components/termsAndLegal/ContactUsButton';
import FAQ from '@/components/termsAndLegal/FAQ';
import NewsLetter from '@/components/termsAndLegal/NewsLetter';
import TermsLinks from '@/components/termsAndLegal/TermsLinks';
import { buttonVariants } from '@/components/ui/button';
import { IconProps } from '@/config/sidenav';
import { getAboutCards } from '@/db/about';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { Icons } from '@/components/icons/legal-icons';

export default async function page() {
	const [{ data: producerCards }, { data: consumerCards }] = await Promise.all([
		getAboutCards(),
		getAboutCards('consumers'),
	]);

	return (
		<div className='grid gap-14 '>
			<div className='max-w-6xl mt-4'>
				<div className='space-y-14'>
					<AboutHeader />

					{producerCards && (
						<div className='space-y-8'>
							<h1 className='text-3xl font-bold text-primary-foreground'>
								{producerCards?.heading}
							</h1>

							<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-white'>
								<AboutCard
									description={producerCards?.card1}
									icon={Icons.megaphone}
								/>
								<AboutCard
									description={producerCards?.card2}
									icon={Icons.access}
								/>
								<AboutCard
									description={producerCards?.card3}
									icon={Icons.audiomaster}
								/>
								<AboutCard
									description={producerCards?.card4}
									icon={Icons.infosquared}
								/>
								<AboutCard
									description={producerCards?.card5}
									icon={Icons.musiclibrary}
								/>

								<SignUpCard />
							</div>
						</div>
					)}
					{consumerCards && (
						<div className='space-y-8'>
							<h1 className='text-3xl font-bold text-primary-foreground'>
								{consumerCards?.heading}
							</h1>

							<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-white'>
								<AboutCard
									description={consumerCards?.card1}
									icon={Icons.listening}
								/>
								<AboutCard
									description={consumerCards?.card2}
									icon={Icons.access}
								/>
								<AboutCard
									description={consumerCards?.card3}
									icon={Icons.infosquared}
								/>
								<AboutCard
									description={consumerCards?.card4}
									icon={Icons.infosquared}
								/>
								<AboutCard
									description={consumerCards?.card5}
									icon={Icons.usersgroup}
								/>

								<SignUpCard />
							</div>
						</div>
					)}
				</div>
			</div>
			<div className='max-w-3xl space-y-10'>
				<FAQ />
				<NewsLetter />
				<TermsLinks className='space-y-10' />
				<div className='space-y-2'>
					<p>
						If you have any questions or suggestions for us, please contact us
						via our contact form.
					</p>
					<ContactUsButton />
				</div>
			</div>
		</div>
	);
}

function SignUpCard() {
	return (
		<div className='rounded-2xl p-6 flex flex-col gap-2 text-foreground'>
			<p>Be part of the new</p>
			<p>3D AudioSpace!</p>

			<Link
				href='/signup'
				className={cn(buttonVariants({ variant: 'button' }), 'w-fit')}
			>
				Sign up now
			</Link>
		</div>
	);
}

function AboutCard({
	description,
	icon: Icon,
}: {
	icon: (props: IconProps) => React.JSX.Element;
	description: string;
}) {
	return (
		<div className='bg-card rounded-2xl p-6 space-y-4'>
			<Icon className='w-9 h-auto aspect-square fill-white' />
			<p>{description}</p>
		</div>
	);
}
