import { NextResponse } from 'next/server';
import { authConfig } from './lib/auth.config';
import NextAuth from 'next-auth';

const API_AUTH_PREFIX = '/api/auth';
const AUTH_ROUTES = ['/login', '/signup', '/login-guest'];
const PROTECTED_ROUTES = ['/'];
const PUBLIC_ROUTES = ['/about', '/legal', '/privacy'];

export const { auth } = NextAuth(authConfig);

export default auth((req) => {
	const pathname = req.nextUrl.pathname;
	const isAuth = req.auth;

	const isAccessingApiAuthRoute = pathname.startsWith(API_AUTH_PREFIX);
	const isAccessingAuthRoute = AUTH_ROUTES.some((route) =>
		pathname.startsWith(route)
	);
	const isAccessingProtectedRoute = PROTECTED_ROUTES.some((route) =>
		pathname.startsWith(route)
	);
	const isPublicRoute = PUBLIC_ROUTES.some((route) =>
		pathname.startsWith(route)
	);

	if (isAccessingApiAuthRoute || isPublicRoute) {
		return NextResponse.next();
	}

	if (isAccessingAuthRoute) {
		if (isAuth) {
			return NextResponse.redirect(new URL('/', req.url));
		}

		return NextResponse.next();
	}

	if (!isAuth && isAccessingProtectedRoute) {
		return NextResponse.redirect(new URL('/login', req.url));
	}
});

export const config = {
	matcher: ['/((?!.+\\.[\\w]+$|_next).*)', '/', '/(api|trpc)(.*)'],
};
