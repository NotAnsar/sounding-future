import CuratedList from '@/components/curated/CuratedList';
import Error from '@/components/Error';
import HeaderBanner from '@/components/HeaderBanner';
import { getPartners } from '@/db/partner';
import { generatePartnersListingSchema } from '@/schema/curators-schema';

export async function generateMetadata() {
	const partners = await getPartners();
	const schema = generatePartnersListingSchema(partners.data);

	return {
		title: 'Curators - Browse Our Partners',
		description: 'Explore our collection of music curators and sound experts',
		openGraph: {
			title: 'Curators Collection',
			description: 'Browse our collection of music curators and sound experts',
			images: ['/banners/curated.jpg'],
			type: 'website',
		},
		other: {
			'schema:collection-page': JSON.stringify(schema),
		},
	};
}

export default async function Page() {
	const partners = await getPartners();

	if (partners.error) {
		return <Error message={partners.message} />;
	}

	return (
		<>
			<script
				type='application/ld+json'
				key='structured-data'
				dangerouslySetInnerHTML={{
					__html: JSON.stringify(generatePartnersListingSchema(partners.data)),
				}}
			/>
			<HeaderBanner img={'/banners/curated.jpg'} title='Curated' />
			<CuratedList partners={partners.data} className='mt-12' />
		</>
	);
}
