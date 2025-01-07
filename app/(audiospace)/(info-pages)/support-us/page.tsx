import NewsLetter from '@/components/termsAndLegal/NewsLetter';
import SocialLinks from '@/components/termsAndLegal/SocialLinks';
import SubscriptionSection from '@/components/termsAndLegal/SubscriptionSection';
import SubscriptionCard from '@/components/termsAndLegal/support-us/SubscriptionCard';

import React from 'react';

export default function page() {
	return (
		<div className='grid xl:grid-cols-3 gap-6 '>
			<div className='md:col-span-2 max-w-2xl space-y-6 mt-4'>
				<SubscriptionCard />
				<NewsLetter />
				<SocialLinks />
			</div>
			<SubscriptionSection />
		</div>
	);
}
