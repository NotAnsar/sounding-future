import NextAuth from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { prisma } from './prisma';
import { authConfig } from './auth.config';

export const { handlers, signIn, signOut, auth } = NextAuth({
	...authConfig,
	adapter: PrismaAdapter(prisma),
	session: { strategy: 'jwt' },
	pages: { signIn: '/login' },
	callbacks: {
		async jwt({ token, user }) {
			console.log(user, token);

			if (user) {
			}

			return token;
		},

		async session({ session, token }) {
			if (token) {
				// set the token data to session
			}

			return session;
		},

		redirect() {
			return '/login';
		},
	},
});
