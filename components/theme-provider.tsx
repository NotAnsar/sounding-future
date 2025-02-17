'use client';

import * as React from 'react';
import { ThemeProvider as NextThemesProvider } from 'next-themes';
import { type ThemeProviderProps } from 'next-themes/dist/types';

export function ThemeProvider({ children, ...props }: ThemeProviderProps) {
	return (
		<NextThemesProvider
			defaultTheme='dark' // Forces dark mode as default
			enableSystem={false} // Ignores system preference
			{...props}
		>
			{children}
		</NextThemesProvider>
	);
}
