import { Icons } from '@/components/icons/legal-icons';
import NewsLetter from '@/components/termsAndLegal/NewsLetter';
import TermsLinks from '@/components/termsAndLegal/TermsLinks';
import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from '@/components/ui/accordion';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import React from 'react';

export default function page() {
	return (
		<>
			<div className='max-w-6xl'>
				<div className='space-y-8'>
					<header className='space-y-2'>
						<p className='text-lg text-muted'>
							In the 3D AudioSpace we want to give innovative 3D audio a stage.
						</p>
						<h1 className='text-3xl font-bold text-primary-foreground'>
							{"What's in it for audio producers?"}
						</h1>
					</header>

					<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-white'>
						{producerCards.map((p, i) => (
							<div
								className='bg-secondary-foreground rounded-2xl p-6 space-y-4'
								key={i}
							>
								<p.icon className='w-9 h-auto aspect-square fill-white' />
								<p>{p.description}</p>
							</div>
						))}

						<div className='bg-primary rounded-2xl p-6 flex items-center justify-center'>
							{/* <div className='border border-foreground rounded-2xl p-6 flex items-center justify-center'> */}
							<Link
								href='/login'
								className={cn(buttonVariants({ variant: 'button' }))}
							>
								Sign up now
							</Link>
						</div>
					</div>

					<h2 className='text-3xl font-bold mt-12 text-primary-foreground'>
						{"What's in it for audio consumers?"}
					</h2>

					<div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 text-white'>
						{consumerCards.map((p, i) => (
							<div
								className='bg-secondary-foreground rounded-2xl p-6 space-y-4'
								key={i}
							>
								<p.icon className='w-9 h-auto aspect-square fill-white' />
								<p>{p.description}</p>
							</div>
						))}

						<div className='bg-primary rounded-2xl p-6 flex items-center justify-center'>
							<Link
								href='/login'
								className={cn(buttonVariants({ variant: 'button' }))}
							>
								Sign up now
							</Link>
						</div>
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
									<p>{f.answer}</p>
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

const producerCards = [
	{
		icon: Icons.megaphone,
		description:
			'We will actively promote your tracks on our social media channels and in our monthly newsletter.',
	},
	{
		icon: Icons.access,
		description:
			'Your 1-3 showcase tracks will always be freely accessible on soundingfuture.com.',
	},
	{
		icon: Icons.audiomaster,
		description:
			'We convert your multi-channel or ambisonics files into high-quality binaural audio tracks.',
	},
	{
		icon: Icons.infosquared,
		description:
			'Add meta information about you (bio, links, etc.) and your tracks (lyrics, credits, etc.).',
	},
	{
		icon: Icons.musiclibrary,
		description:
			'Partner institutions can highlight your tracks by including them in their curated by collection.',
	},
];

const consumerCards = [
	{
		icon: Icons.listening,
		description:
			'We present innovative music (field recordings, drama music, ...) from artists around the world.',
	},
	{
		icon: Icons.access,
		description: 'You can listen to showcase tracks for free after logging in.',
	},
	{
		icon: Icons.infosquared,
		description:
			'In addition to the audio experience, you will also find information about the tracks and the artists.',
	},

	{
		icon: Icons.infosquared,
		description:
			'Enjoy high-quality 3D audio experiences with immersive soundscapes.',
	},
	{
		icon: Icons.usersgroup,
		description:
			'In the future, functions such as "like" or creating a playlist will be available.',
	},
];

const Faq = [
	{
		question: 'How do I send my audio track to Sounding Future?',
		answer:
			'If you are logged in, you can enter the meta data (track info, credits, ..) of your track under Upload Tracks. Then you can send us your audio track via a file sharing service like Wetransfer, Filemail, Dropbox, ... to office@soundingfuture.com.',
	},
	{
		question: 'Which format must my audio track have?',
		answer:
			'We need either a multichannel audio format like 5.1, 7.2, etc. or ideally a HOA 5 (Higher Order Ambisonics) file. Please send us your audio file and photos. File Specification: Multichannel .wav file, AmbiX format, 48kHz sampling rate, 24bit resolution | Here you can find a Reaper template from our partner IEM: https://iaem.at/ambisonics/s3dapc/2024/reapertemplate_s3dapc.zip/view',
	},
	{
		question: 'Which information do you need from me as an artist?',
		answer:
			'If you are logged in, you can enter information about yourself in your artist profile. Like your biography, your links, your artist photo, ...',
	},
];
