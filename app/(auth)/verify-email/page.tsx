import React from 'react';
import VerifyEmailPage from './VerifyEmailPage';

export default function page({
	searchParams,
}: {
	searchParams: { token?: string };
}) {
	return <VerifyEmailPage token={searchParams.token || ''} />;
}
