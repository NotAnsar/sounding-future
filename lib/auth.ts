import NextAuth, { DefaultSession } from 'next-auth';
import { PrismaAdapter } from '@auth/prisma-adapter';
import { prisma } from './prisma';
import { authConfig } from './auth.config';

interface ExtendedSession extends DefaultSession {
	user: {
		id: string;
		role?: string;
	} & DefaultSession['user'];
}

export const { handlers, signIn, signOut, auth } = NextAuth({
	...authConfig,
	adapter: PrismaAdapter(prisma),
	session: { strategy: 'jwt' },
	pages: { signIn: '/login' },
	callbacks: {
		async jwt({ token, user }) {
			const dbUser = await prisma.user.findFirst({
				where: { email: token.email || undefined },
			});

			if (!dbUser) {
				if (user) token.id = user.id;
				return token;
			}

			return {
				...token,
				id: dbUser.id,
				email: dbUser.email,
				name: dbUser.name,
				image: dbUser.image,
				role: dbUser.role,
			};
		},
		async session({ session, token }): Promise<ExtendedSession> {
			return {
				...session,
				user: {
					...session.user,
					id: token.id as string,
					email: token.email,
					name: token.name,
					image: token.image as string | null | undefined,
					role: token.role as string | undefined,
				},
			};
		},

		redirect() {
			return '/login';
		},
	},
});
