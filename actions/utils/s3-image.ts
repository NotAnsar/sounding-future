'use server';

import { AWS_S3_BUCKET_NAME, AWS_URL } from '@/config/links';
import { s3 } from '@/lib/s3';
import { PutObjectCommand, DeleteObjectCommand } from '@aws-sdk/client-s3';
import { v4 as uuidv4 } from 'uuid';

export async function checkFile(image: FormDataEntryValue | null) {
	const imageFile = image as File | null;
	if (imageFile && imageFile?.size > 0) {
		return imageFile;
	}
	return undefined;
}

export async function deleteFile(fileUrl: string): Promise<void> {
	if (!fileUrl) throw new Error('File URL is required for deletion.');

	try {
		const urlParts = fileUrl.split(`/${AWS_S3_BUCKET_NAME}/`);
		if (urlParts.length !== 2) {
			console.error('Invalid file URL format');
			return;
		}

		const fileKey = urlParts[1];

		const command = new DeleteObjectCommand({
			Bucket: AWS_S3_BUCKET_NAME,
			Key: fileKey,
		});

		await s3.send(command);
	} catch (error) {
		console.error('Error deleting file from S3:', error);
		throw new Error(`Failed to delete file from S3`);
	}
}

export async function updateFile(
	imageFormdata: FormDataEntryValue | null,
	prevImageUrl: string | undefined,
	type: 'image' | 'audio' | 'video' | 'download' = 'image',
	audioFileName?: string
) {
	const imageFile = await checkFile(imageFormdata);
	let imageUrl = prevImageUrl;
	if (imageFile) {
		if (imageUrl) await deleteFile(imageUrl);

		imageUrl = await uploadFile(imageFile, type, audioFileName);
	}
	return imageUrl;
}

export async function uploadFile(
	file: File,
	type: 'image' | 'audio' | 'video' | 'download' = 'image',
	customFileName?: string
) {
	if (!file) throw new Error('File is required for upload.');

	try {
		// Log file details

		const extension = file.name.split('.').pop();
		const randomSuffix = Math.floor(Math.random() * 10000);

		// Generate filename based on type
		let fileName: string;
		if (type === 'download') {
			// For downloads, preserve original filename with random suffix
			const originalName = file.name.replace(/\.[^/.]+$/, ''); // Remove extension
			fileName = `downloads/${
				customFileName || `${originalName}-${randomSuffix}`
			}.${extension}`;
		} else {
			fileName = `${type}s/${
				customFileName ? `${customFileName}-${randomSuffix}` : uuidv4()
			}.${extension}`;
		}

		const arrayBuffer = await file.arrayBuffer();
		const buffer = Buffer.from(arrayBuffer);

		const command = new PutObjectCommand({
			Bucket: process.env.AWS_S3_BUCKET_NAME,
			Key: fileName,
			Body: buffer,
			ContentType: file.type,
			ContentLength: buffer.length,
			// Add Content-Disposition for downloads
			...(type === 'download' && {
				ContentDisposition: `attachment; filename="${file.name}"`,
			}),
		});

		await s3.send(command);

		return `${AWS_URL}/${AWS_S3_BUCKET_NAME}/${fileName}`;
	} catch (error) {
		// Define error type
		type UploadError = {
			name: string;
			message: string;
			stack?: string;
		};

		// Enhanced error logging
		console.error('Detailed upload error:', {
			error,
			errorName: (error as UploadError).name,
			errorMessage: (error as UploadError).message,
			errorStack: (error as UploadError).stack,
			fileInfo: {
				name: file.name,
				type: file.type,
				size: file.size,
			},
		});
		throw new Error(`Failed to upload file: ${(error as UploadError).message}`);
	}
}

// Helper function to upload multiple download files
export async function uploadDownloadFiles(files: File[]): Promise<string[]> {
	const uploadPromises = files.map((file) => uploadFile(file, 'download'));
	return Promise.all(uploadPromises);
}

// Helper function to delete multiple download files
export async function deleteDownloadFiles(fileUrls: string[]): Promise<void> {
	const deletePromises = fileUrls.map((url) => deleteFile(url));
	await Promise.all(deletePromises);
}
