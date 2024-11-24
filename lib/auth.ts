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
		// async signIn({ user, account }) {
		// 	// console.log('SignIn Callback - User:', user);
		// 	// console.log('SignIn Callback - Account:', account);

		// 	if (account?.provider === 'google') {
		// 		try {
		// 			// First, check if user exists
		// 			const existingUser = await prisma.user.findUnique({
		// 				where: { email: user.email! },
		// 				include: { artist: true, accounts: true },
		// 			});

		// 			// console.log('Existing User:', existingUser);

		// 			if (existingUser) {
		// 				// Check if user has any OAuth accounts
		// 				const hasOAuthAccount = existingUser.accounts.some(
		// 					(acc) => acc.provider === 'google'
		// 				);

		// 				if (!hasOAuthAccount) {
		// 					// User exists but hasn't linked Google - connect the accounts
		// 					await prisma.account.create({
		// 						data: {
		// 							userId: existingUser.id,
		// 							type: account.type!,
		// 							provider: account.provider,
		// 							providerAccountId: account.providerAccountId,
		// 							access_token: account.access_token,
		// 							expires_at: account.expires_at,
		// 							token_type: account.token_type,
		// 							scope: account.scope,
		// 							id_token: account.id_token,
		// 						},
		// 					});

		// 					// If user doesn't have an artist, create one
		// 					if (!existingUser.artistId) {
		// 						const artist = await prisma.artist.create({
		// 							data: {
		// 								name: existingUser.name || user.email!.split('@')[0],
		// 								pic: user.image || undefined,
		// 							},
		// 						});

		// 						await prisma.user.update({
		// 							where: { id: existingUser.id },
		// 							data: { artistId: artist.id },
		// 						});
		// 					}
		// 				}
		// 				return true; // Allow sign in
		// 			}

		// 			// If user doesn't exist, create new user with artist
		// 			await prisma.$transaction(async (tx) => {
		// 				// Create artist first
		// 				const artist = await tx.artist.create({
		// 					data: {
		// 						name: user.name || user.email!.split('@')[0],
		// 						pic: user.image || undefined,
		// 					},
		// 				});

		// 				// Create user with artist relation
		// 				const newUser = await tx.user.create({
		// 					data: {
		// 						email: user.email!,
		// 						name: user.name || user.email!.split('@')[0],
		// 						image: user.image || undefined,
		// 						artistId: artist.id,
		// 					},
		// 				});

		// 				// Create OAuth account record
		// 				await tx.account.create({
		// 					data: {
		// 						userId: newUser.id,
		// 						type: account.type!,
		// 						provider: account.provider,
		// 						providerAccountId: account.providerAccountId,
		// 						access_token: account.access_token,
		// 						expires_at: account.expires_at,
		// 						token_type: account.token_type,
		// 						scope: account.scope,
		// 						id_token: account.id_token,
		// 					},
		// 				});
		// 			});

		// 			return true;
		// 		} catch (error) {
		// 			console.error('Error in signIn callback:', error);
		// 			return false;
		// 		}
		// 	}
		// 	return true; // Allow sign in for other providers
		// },

		redirect() {
			return '/login';
		},
	},
});
