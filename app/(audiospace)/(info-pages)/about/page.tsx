import NewsLetter from '@/components/termsAndLegal/NewsLetter';
import TermsLinks from '@/components/termsAndLegal/TermsLinks';
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from '@/components/ui/accordion';
import { buttonVariants } from '@/components/ui/button';
import { consumerCards, Faq, producerCards } from '@/config/about';
import { IconProps } from '@/config/sidenav';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import React from 'react';

export default function page() {
	return (
		<>
			<div className='max-w-6xl'>
				<div className='space-y-8'>
					<header className='space-y-2'>
						<p className='text-[19px] max-w-5xl'>
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
						<h1 className='text-3xl font-bold text-primary-foreground'>
							{"What's in it for audio producers?"}
						</h1>
					</header>

					<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-white'>
						{producerCards.map((p, i) => (
							<AboutCard description={p.description} icon={p.icon} key={i} />
						))}

						<SignUpCard />
					</div>

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
			<div className='max-w-3xl space-y-6'>
				<div className='space-y-4'>
					<h1 className='text-3xl font-bold '>{'FAQ'}</h1>

					<Accordion
						type='single'
						className='grid gap-4 dark:bg-[#141B29]'
						collapsible
					>
						{Faq.map((f, i) => (
							<AccordionItem
								value={f.question}
								key={i}
								className='border border-foreground rounded-md '
							>
								<AccordionTrigger className='text-[17px] font-bold  px-5 hover:no-underline data-[state=open]:border-foreground border-b border-transparent'>
									{f.question}
								</AccordionTrigger>
								<AccordionContent className='text-base px-5 pt-5'>
									{f.answer}{' '}
									{f.link && (
										<Link
											href={f.link}
											target='_blank'
											className='text-primary-foreground hover:underline'
										>
											Click here
										</Link>
									)}
								</AccordionContent>
							</AccordionItem>
						))}
					</Accordion>
				</div>
				<NewsLetter />
				<TermsLinks />
			</div>
		</>
	);
}

function SignUpCard() {
	return (
		<div className='rounded-2xl p-6 flex flex-col gap-2 text-foreground'>
			<p>Be part of the new</p>
			<p>3D AudioSpace!</p>

			<Link
				href='/login'
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
		<div className='bg-[#4B2A63] rounded-2xl p-6 space-y-4'>
			<Icon className='w-9 h-auto aspect-square fill-white' />
			<p>{description}</p>
		</div>
	);
}
