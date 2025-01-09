import {
	Accordion,
	AccordionContent,
	AccordionItem,
	AccordionTrigger,
} from '@/components/ui/accordion';
import { getFaqs } from '@/db/section';
import Link from 'next/link';

export default async function FAQ() {
	const { data: Faq } = await getFaqs();

	if (Faq.length === 0) return null;

	return (
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
	);
}
