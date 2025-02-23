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
	// display: 'swap',
});

export const metadata: Metadata = {
	title: 'Sounding Future',
	description:
		'Sounding Future is a platform for experimental music and sound art.',
};

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const { user } = await getCurrentUserSafe();
	console.log(user?.preferredVariant);

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
					defaultTheme='system'
					enableSystem
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
