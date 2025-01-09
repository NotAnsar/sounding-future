import ContactUsButton from '@/components/termsAndLegal/ContactUsButton';
import FAQ from '@/components/termsAndLegal/FAQ';
import NewsLetter from '@/components/termsAndLegal/NewsLetter';
import TermsLinks from '@/components/termsAndLegal/TermsLinks';
import { buttonVariants } from '@/components/ui/button';
import { consumerCards, producerCards } from '@/config/about';
import { IconProps } from '@/config/sidenav';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export default async function page() {
	return (
		<div className='grid gap-14 '>
			<div className='max-w-6xl mt-4'>
				<div className='space-y-14'>
					<header className='space-y-2'>
						<p className=' max-w-5xl'>
							<Link
								href={'https://www.soundingfuture.com/'}
								target='_blank'
								className='text-primary-foreground hover:underline'
							>
								soundingfuture.com
							</Link>{' '}
							is a unique online platform for artistic and technical innovations
							in music. We have published numerous articles by internationally
							renowned musicians and audio developers on topics such as 3D
							audio, music and KI, sound art, electronic music, .... We offer
							practical tutorials, book recommendations and news about open
							calls, festival dates, podcasts, ... are available.
						</p>
					</header>

					<div className='space-y-8'>
						<h1 className='text-3xl font-bold text-primary-foreground'>
							{"What's in it for audio producers?"}
						</h1>

						<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-white'>
							{producerCards.map((p, i) => (
								<AboutCard description={p.description} icon={p.icon} key={i} />
							))}

							<SignUpCard />
						</div>
					</div>

					<div className='space-y-8'>
						<h2 className='text-3xl font-bold mt-12 text-primary-foreground'>
							{"What's in it for audio consumers?"}
						</h2>

						<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-white'>
							{consumerCards.map((p, i) => (
								<AboutCard description={p.description} icon={p.icon} key={i} />
							))}

							<SignUpCard />
						</div>
					</div>
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
