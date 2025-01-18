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

// Utility function for slug generation
export function generateSlug(name: string): string {
	return name
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, '-')
		.replace(/(^-|-$)/g, '');
}
