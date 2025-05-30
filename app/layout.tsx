import type { Metadata } from 'next';
import { Inter as FontSans } from 'next/font/google';
import './globals.css';
import { cn } from '@/lib/utils';
import '/node_modules/flag-icons/css/flag-icons.min.css';
import { SessionProvider } from 'next-auth/react';
import { ThemeProvider } from '@/components/theme-provider';
import { AudioProvider } from '@/context/AudioContext';
import { Toaster } from '@/components/ui/toaster';
import MatomoAnalytics from '@/components/MatomoAnalytics';
import { getCurrentUserSafe } from '@/db/user';
import { VariantType } from '@/hooks/useDefaultVariant';
import { isValidVariant } from '@/actions/utils/utils';

const fontSans = FontSans({
	subsets: ['latin'],
	variable: '--font-sans',
	weight: ['200', '300', '400', '500', '600', '700'],
});

export const metadata: Metadata = {
	metadataBase: new URL(
		process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000'
	),
	title: '3D AudioSpace',
	description:
		'Innovative streaming with the 3D AudioSpace from Sounding Future.',
};

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const { user } = await getCurrentUserSafe();

	const isAuth = !!user;
	return (
		<html lang='en'>
			<head>
				<MatomoAnalytics />
			</head>
			<body
				className={cn(
					`${fontSans.variable} font-sans antialiased bg-background`
				)}
			>
				<ThemeProvider
					attribute='class'
					defaultTheme='dark'
					enableSystem={false}
					disableTransitionOnChange
				>
					<SessionProvider>
						<AudioProvider
							isAuth={isAuth}
							intialVariant={
								isValidVariant(user?.preferredVariant || null)
									? (user?.preferredVariant as VariantType)
									: undefined
							}
						>
							{children}
							<Toaster />
						</AudioProvider>
					</SessionProvider>
				</ThemeProvider>
			</body>
		</html>
	);
}
