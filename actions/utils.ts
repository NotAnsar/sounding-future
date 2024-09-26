'use server';

export type State<T> = {
	errors?: { [K in keyof T]?: string[] };
	message?: string | null;
};
