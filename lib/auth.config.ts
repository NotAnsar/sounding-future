import { NextAuthConfig } from 'next-auth';
import Google from 'next-auth/providers/google';
import Credentials from 'next-auth/providers/credentials';
import { prisma } from './prisma';

export const authConfig: NextAuthConfig = {
	providers: [
		Google,
		Credentials({
			name: 'Credentials',
			credentials: {
				email: { label: 'Email', type: 'email' },
				password: { label: 'Password', type: 'password' },
			},
			async authorize(credentials) {
				if (!credentials?.email || !credentials?.password) {
					return null;
				}

				const user = await prisma.user.findUnique({
					where: { email: credentials.email as string },
				});

				if (!user || !user.password) {
					return null;
				}

				// Update last login time on successful credential authentication
				await prisma.user.update({
					where: { id: user.id },
					data: { lastLoginAt: new Date() },
				});

				return {
					id: user.id,
					email: user.email,
					name: user.name,
					role: user.role,
					password: user.password,
					artistId: user.artistId,
				};
			},
		}),
	],
	pages: {
		signIn: '/login',
	},
	callbacks: {
		async jwt({ token, user }) {
			if (user) {
				token.id = user.id;
				token.email = user.email;
				token.name = user.name;

				// token.role = user.role;
			}
			return token;
		},
		async session({ session, token }) {
			if (token) {
				session.user.id = token.id as string;
				session.user.email = token.email as string;
				session.user.name = token.name as string;
				// session.user.role = token.role;
			}
			return session;
		},
	},
};
