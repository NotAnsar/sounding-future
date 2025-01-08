import { getTermsData } from '@/db/pages';
import React from 'react';

export default async function TermsOfUse() {
	const { data } = await getTermsData();

	if (!data) {
		return <div>Terms of use data not found</div>;
	}

	return (
		<div className='max-w-3xl'>
			<div className='space-y-8'>
				<p className='mt-4'>{data.introduction}</p>

				{data.sections.map((section, index) => (
					<section key={section.id} className='space-y-4'>
						<h2 className='text-2xl font-semibold'>
							{index + 1}. {section.title}
						</h2>

						<p>{section.content}</p>

						{section.items && (
							<ul className='list-disc pl-6 space-y-2'>
								{section.items.map((item: string, index) => (
									<li key={index}>{item}</li>
								))}
							</ul>
						)}

						{section.footer && <p className='text-muted'>{section.footer}</p>}
					</section>
				))}

				<p className='mt-4'>{data.footer}</p>
			</div>
		</div>
	);
}
