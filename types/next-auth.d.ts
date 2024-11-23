import { DefaultSession } from 'next-auth';

declare module 'next-auth' {
	interface Session {
		user: {
			id: string;
			role?: string;
			artistId?: string | null;
		} & DefaultSession['user'];
	}

	interface User {
		role?: string;
	}
}

declare module 'next-auth/jwt' {
	interface JWT {
		id: string;
		role?: string;
	}
}
