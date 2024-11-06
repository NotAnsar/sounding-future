'use client';

import CuratedForm from '@/components/CuratedCrud/form/CuratedForm';

export default function Page() {
	return (
		<div className='mt-4'>
			<h2 className='text-[42px] md:text-5xl lg:text-6xl font-semibold'>
				Curating Partner
			</h2>
			<CuratedForm />
		</div>
	);
}
