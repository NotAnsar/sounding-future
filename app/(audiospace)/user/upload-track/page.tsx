import SubmitTrackForm from '@/components/upload-track/SubmitTrackForm';
import { auth } from '@/lib/auth';
import React from 'react';

export default async function page() {
	const session = await auth();

	return <SubmitTrackForm role={session?.user?.role || ''} />;
}
