import type { Metadata } from 'next';
import { Inter as FontSans } from 'next/font/google';
import './globals.css';
import { cn } from '@/lib/utils';
import { auth } from '@/lib/auth';
import { SessionProvider } from 'next-auth/react';
import { ThemeProvider } from '@/components/theme-provider';

const fontSans = FontSans({
	subsets: ['latin'],
	variable: '--font-sans',
	weight: ['200', '300', '400', '500', '600', '700'],
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
	const session = await auth();
	console.log('my session', session);

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
					<SessionProvider>{children}</SessionProvider>
				</ThemeProvider>
			</body>
		</html>
	);
}
