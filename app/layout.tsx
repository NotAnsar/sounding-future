import type { Metadata } from 'next';
import { Inter as FontSans } from 'next/font/google';
import './globals.css';
import { cn } from '@/lib/utils';
import '/node_modules/flag-icons/css/flag-icons.min.css';
import { SessionProvider } from 'next-auth/react';
import { ThemeProvider } from '@/components/theme-provider';
import { AudioProvider } from '@/context/AudioContext';
import { Toaster } from '@/components/ui/toaster';

const fontSans = FontSans({
	subsets: ['latin'],
	variable: '--font-sans',
	weight: ['200', '300', '400', '500', '600', '700'],
	// display: 'swap',
});

export const metadata: Metadata = {
	title: 'Sounding Future',
	description: '',
};

export default async function RootLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<html lang='en'>
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
						<AudioProvider>
							{children}
							<Toaster />
						</AudioProvider>
					</SessionProvider>
				</ThemeProvider>
			</body>
		</html>
	);
}
