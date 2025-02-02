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
			const dbUser = await prisma.user.findFirst({
				where: { email: token.email || undefined },
			});

			if (!dbUser) {
				if (user) token.id = user.id;
				return token;
			}

			// Update last login time when generating JWT
			await prisma.user.update({
				where: { id: dbUser.id },
				data: { lastLoginAt: new Date() },
			});

			return {
				...token,
				id: dbUser.id,
				email: dbUser.email,
				name: dbUser.name,
				image: dbUser.image,
				role: dbUser.role,
				artistId: dbUser.artistId,
			};
		},
		async session({ session, token }) {
			return {
				...session,
				user: {
					...session.user,
					id: token.id as string,
					email: token.email,
					name: token.name,
					image: token.image as string | null | undefined,
					role: token.role as string | undefined,
					artistId: token.artistId as string | undefined,
				},
			};
		},

		redirect() {
			return '/login';
		},
	},
});
