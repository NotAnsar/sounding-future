import type { NextAuthConfig } from 'next-auth';

export const authConfig = {
	pages: {
		signIn: '/login',
	},
	trustHost: true,
	callbacks: {
		authorized({ auth, request: { nextUrl } }) {
			const isLoggedIn = !!auth?.user;
			const isAuthPage =
				nextUrl.pathname === '/login' || nextUrl.pathname === '/signup';

			if (isLoggedIn && isAuthPage) {
				return Response.redirect(new URL('/', nextUrl));
			}
			if (!isLoggedIn && !isAuthPage) {
				return Response.redirect(new URL('/login', nextUrl));
			}

			return true;
		},
	},
	providers: [], // configured in auth.ts
} satisfies NextAuthConfig;
