import ProfileNav from '@/components/profile/ProfileNav';
import { Tabs, TabsContent } from '@/components/ui/tabs';
import React from 'react';

export default function page() {
	return (
		<Tabs value={'links'} className='mt-4 sm:mt-8 grid sm:gap-3'>
			<ProfileNav />
			<TabsContent value='links'>links</TabsContent>
		</Tabs>
	);
}
