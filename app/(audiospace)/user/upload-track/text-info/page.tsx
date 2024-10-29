import TracksTextInfoForm from '@/components/upload-track/TracksTextInfoForm';
import { auth } from '@/lib/auth';
import React from 'react';

export default async function page() {
	const session = await auth();

	return <TracksTextInfoForm role={session?.user?.role || ''} />;
}
