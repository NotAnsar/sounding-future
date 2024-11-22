'use server';

import { AWS_URL } from '@/config/links';
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

export async function uploadFile(
	file: File,
	type: 'image' | 'audio' = 'image'
) {
	if (!file) throw new Error('File is required for upload.');

	// Extract file metadata
	const extension = file.name.split('.').pop();
	const fileName = `${type}s/${uuidv4()}.${extension}`; // Unique file name
	const arrayBuffer = await file.arrayBuffer();

	try {
		// Prepare and execute the S3 PutObject command
		const command = new PutObjectCommand({
			Bucket: process.env.AWS_S3_BUCKET_NAME,
			Key: fileName,
			Body: Buffer.from(arrayBuffer),
			ContentType: file.type,
		});

		await s3.send(command);

		console.log(`Successfully uploaded file: ${fileName}`);

		return `${AWS_URL}${fileName}`;
	} catch (error) {
		console.error('Error uploading file to S3:', error);
		throw new Error('Failed to upload the file to S3.');
	}
}

export async function deleteImage(fileUrl: string): Promise<void> {
	if (!fileUrl) throw new Error('File URL is required for deletion.');

	const fileKey = fileUrl.replace(AWS_URL, '');

	try {
		// Prepare and execute the S3 DeleteObject command
		const command = new DeleteObjectCommand({
			Bucket: process.env.AWS_S3_BUCKET_NAME,
			Key: fileKey,
		});

		await s3.send(command);
		console.log(`Successfully deleted file: ${fileKey}`);
	} catch (error) {
		console.error('Error deleting file from S3:', error);
		throw new Error('Failed to delete the file from S3.');
	}
}

export async function updateFile(
	imageFormdata: FormDataEntryValue | null,
	prevImageUrl: string | undefined,
	type: 'image' | 'audio' = 'image'
) {
	const imageFile = await checkFile(imageFormdata);
	let imageUrl = prevImageUrl;
	if (imageFile) {
		if (imageUrl) {
			await deleteImage(imageUrl);
		}
		imageUrl = await uploadFile(imageFile, type);
	}
	return imageUrl;
}
