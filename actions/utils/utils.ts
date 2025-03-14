import { z } from 'zod';

export type State<T> = {
	errors?: { [K in keyof T]?: string[] };
	message?: string | null;
};

export type DeleteState = {
	message?: string | null;
	success?: boolean;
};

const MAX_FILE_SIZE = 2 * 1024 * 1024;

export const imageSchema = z.object({
	file: z
		.any()
		.refine((file: File) => file?.size !== 0, 'File is required')
		.refine(
			(file: File) => file?.size < MAX_FILE_SIZE,
			`Max size is ${MAX_FILE_SIZE / (1024 * 1024)}MB.`
		)
		.refine(
			(file: File) => checkFileType(file),
			'Only .png, .jpg, .jpeg formats are supported.'
		),
});

const MAX_VIDEO_FILE_SIZE = 200 * 1024 * 1024; // 200MB

export const videoallowedTypes = [
	'video/mp4',
	'video/webm',
	'video/quicktime',
	'video/x-msvideo',
];

export const videoSchema = z.object({
	file: z
		.any()
		.refine((file: File) => file?.size !== 0, 'File is required')
		.refine(
			(file: File) => file?.size < MAX_VIDEO_FILE_SIZE,
			`Max size is ${MAX_VIDEO_FILE_SIZE / (1024 * 1024)}MB.`
		)
		.refine((file: File) => {
			const allowedTypes = [
				'video/mp4',
				'video/webm',
				'video/quicktime',
				'video/x-msvideo',
			];
			return allowedTypes.includes(file?.type);
		}, 'Only .mp4, .webm, .mov, and .avi formats are supported.'),
});

export const squareImageSchema = z.object({
	file: z
		.any()
		.refine((file: File) => file?.size !== 0, 'File is required')
		.refine(
			(file: File) => file?.size < MAX_FILE_SIZE,
			`Max size is ${MAX_FILE_SIZE / (1024 * 1024)}MB.`
		)
		.refine(
			(file: File) => checkFileType(file),
			'Only .png, .jpg, .jpeg formats are supported.'
		)
		.refine(async (file: File) => {
			const dimensions = await getImageDimensions(file);
			return dimensions.width === dimensions.height;
		}, 'Image must be square'),
});

const getImageDimensions = (
	file: File
): Promise<{ width: number; height: number }> => {
	return new Promise((resolve) => {
		const img = new Image();
		img.onload = () => resolve({ width: img.width, height: img.height });
		img.src = URL.createObjectURL(file);
	});
};

const checkFileType = (file: File) => {
	const allowedTypes = ['image/png', 'image/jpeg', 'image/jpg'];
	return allowedTypes.includes(file?.type);
};

// // Utility function for slug generation
// export function generateSlug(name: string): string {
// 	return name
// 		.toLowerCase()
// 		.replace(/[^a-z0-9]+/g, '-')
// 		.replace(/(^-|-$)/g, '');
// }

export function generateSlug(name: string): string {
	return name
		.normalize('NFD') // Decompose accented characters into base + diacritic
		.replace(/[\u0300-\u036f]/g, '') // Remove all diacritical marks
		.replace(/ł/g, 'l') // Replace ł with l
		.replace(/ø/g, 'o') // Replace ø with o
		.replace(/ç/g, 'c') // Replace ç with c
		.replace(/ñ/g, 'n') // Replace ñ with n
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-') // Replace non-alphanumeric sequences with hyphens
		.replace(/^-|-$/g, ''); // Trim leading/trailing hyphens
}

export const isValidVariant = (variant: string | null): boolean =>
	variant === 'variant1' || variant === 'variant2' || variant === 'variant3';
