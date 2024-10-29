import TrackAudioFileForm from '@/components/upload-track/TrackAudioFileForm';
import { auth } from '@/lib/auth';
import { notFound } from 'next/navigation';
import React from 'react';

export default async function page() {
	const session = await auth();

	if (session?.user?.role !== 'admin') {
		notFound();
	}

	return <TrackAudioFileForm role={session?.user?.role || ''} />;
}
