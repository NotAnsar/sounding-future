'use server';

import { AWS_S3_BUCKET_NAME, AWS_URL } from '@/config/links';
import { s3 } from '@/lib/s3';
import {
	PutObjectCommand,
	DeleteObjectCommand,
	CompleteMultipartUploadCommand,
	UploadPartCommand,
	CreateMultipartUploadCommand,
} from '@aws-sdk/client-s3';
import sharp from 'sharp';
import { v4 as uuidv4 } from 'uuid';

export async function checkFile(image: FormDataEntryValue | null) {
	const imageFile = image as File | null;
	if (imageFile && imageFile?.size > 0) {
		return imageFile;
	}
	return undefined;
}

// export async function uploadFile(
// 	file: File,
// 	type: 'image' | 'audio' = 'image',
// 	audioFileName?: string
// ) {
// 	if (!file) throw new Error('File is required for upload.');

// 	// Extract file metadata
// 	const extension = file.name.split('.').pop();
// 	const randomSuffix = Math.floor(Math.random() * 10000);
// 	const fileName = `${type}s/${
// 		audioFileName ? `${audioFileName}-${randomSuffix}` : uuidv4()
// 	}.${extension}`; // Unique file name
// 	const arrayBuffer = await file.arrayBuffer();

// 	try {
// 		// Prepare and execute the S3 PutObject command
// 		const command = new PutObjectCommand({
// 			Bucket: process.env.AWS_S3_BUCKET_NAME,
// 			Key: fileName,
// 			Body: Buffer.from(arrayBuffer),
// 			ContentType: file?.type,
// 		});

// 		await s3.send(command);

// 		return `${AWS_URL}/${AWS_S3_BUCKET_NAME}/${fileName}`;
// 		// return `${AWS_URL}${fileName}`;
// 	} catch (error) {
// 		console.error('Error uploading file to S3:', error);
// 		throw new Error('Failed to upload the file to S3.');
// 	}
// }

// export async function deleteFile(fileUrl: string): Promise<void> {
// 	if (!fileUrl) throw new Error('File URL is required for deletion.');

// 	const fileKey = fileUrl.replace(AWS_URL, '');

// 	try {
// 		// Prepare and execute the S3 DeleteObject command
// 		const command = new DeleteObjectCommand({
// 			Bucket: process.env.AWS_S3_BUCKET_NAME,
// 			Key: fileKey,
// 		});

// 		await s3.send(command);
// 		console.log(`Successfully deleted file: ${fileKey}`);
// 	} catch (error) {
// 		console.error('Error deleting file from S3:', error);
// 		throw new Error('Failed to delete the file from S3.');
// 	}
// }

export async function deleteFile(fileUrl: string): Promise<void> {
	if (!fileUrl) throw new Error('File URL is required for deletion.');

	try {
		const urlParts = fileUrl.split(`/${AWS_S3_BUCKET_NAME}/`);
		if (urlParts.length !== 2) {
			// throw new Error();
			console.log('Invalid file URL format');
			return;
		}

		const fileKey = urlParts[1];

		const command = new DeleteObjectCommand({
			Bucket: AWS_S3_BUCKET_NAME,
			Key: fileKey,
		});

		await s3.send(command);
		console.log(`Successfully deleted file with key: ${fileKey}`);
	} catch (error) {
		console.error('Error deleting file from S3:', error);
		throw new Error(`Failed to delete file from S3`);
	}
}

export async function updateFile(
	imageFormdata: FormDataEntryValue | null,
	prevImageUrl: string | undefined,
	type: 'image' | 'audio' = 'image',
	audioFileName?: string
) {
	const imageFile = await checkFile(imageFormdata);
	let imageUrl = prevImageUrl;
	if (imageFile) {
		if (imageUrl) {
			await deleteFile(imageUrl);
		}
		imageUrl = await uploadFile(imageFile, type, audioFileName);
	}
	return imageUrl;
}

export async function uploadFile2(
	file: File,
	type: 'image' | 'audio' = 'image'
) {
	if (!file) throw new Error('File is required for upload.');

	// Extract file metadata
	const extension = file.name.split('.').pop();
	const fileName = `${type}s/${uuidv4()}.${extension}`; // Unique file name

	try {
		let uploadBuffer: Buffer;

		if (type === 'image') {
			// Resize and compress image before upload
			uploadBuffer = await resizeAndCompressImage(file);
		} else {
			// For non-image files, use the original buffer
			const arrayBuffer = await file.arrayBuffer();
			uploadBuffer = Buffer.from(arrayBuffer);
		}

		// Prepare and execute the S3 PutObject command
		const command = new PutObjectCommand({
			Bucket: process.env.AWS_S3_BUCKET_NAME,
			Key: fileName,
			Body: uploadBuffer,
			ContentType: file?.type,
		});

		await s3.send(command);
		console.log(`Successfully uploaded file: ${fileName}`);

		return `${AWS_URL}${fileName}`;
	} catch (error) {
		console.error('Error uploading file to S3:', error);
		throw new Error('Failed to upload the file to S3.');
	}
}

async function resizeAndCompressImage(
	file: File,
	width: number = 1000,
	height: number = 1000,
	quality: number = 95
): Promise<Buffer> {
	const buffer = await file.arrayBuffer();
	return sharp(Buffer.from(buffer))
		.resize(width, height)
		.jpeg({ quality })
		.toBuffer();
}

// export async function getPresignedUrl(
// 	fileName: string,
// 	fileType: string,
// 	type: 'image' | 'audio' = 'image'
// ) {
// 	const extension = fileName.split('.').pop();
// 	const key = `${type}s/${uuidv4()}.${extension}`;

// 	const command = new PutObjectCommand({
// 		Bucket: process.env.AWS_S3_BUCKET_NAME,
// 		Key: key,
// 		ContentType: fileType,
// 	});

// 	try {
// 		const url = await getSignedUrl(s3, command, { expiresIn: 3600 });
// 		return {
// 			url,
// 			key,
// 			finalUrl: `${process.env.AWS_URL}/${process.env.AWS_S3_BUCKET_NAME}/${key}`,
// 		};
// 	} catch (error) {
// 		console.error('Error generating presigned URL:', error);
// 		throw new Error('Failed to generate upload URL');
// 	}
// }

// // Modified upload function that checks file size
// export async function uploadFile(
// 	file: File,
// 	type: 'image' | 'audio' = 'image',
// 	audioFileName?: string
// ) {
// 	console.log(audioFileName);

// 	if (!file) throw new Error('File is required for upload.');

// 	// If file is larger than 2MB, use presigned URL
// 	if (file.size > 2 * 1024 * 1024) {
// 		const { url, finalUrl } = await getPresignedUrl(file.name, file.type, type);

// 		// Upload directly to Hetzner
// 		await fetch(url, {
// 			method: 'PUT',
// 			body: file,
// 			headers: {
// 				'Content-Type': file.type,
// 			},
// 		});

// 		return finalUrl;
// 	} else {
// 		// Your existing upload code for small files
// 		const arrayBuffer = await file.arrayBuffer();
// 		const command = new PutObjectCommand({
// 			Bucket: process.env.AWS_S3_BUCKET_NAME,
// 			Key: `${type}s/${uuidv4()}.${file.name.split('.').pop()}`,
// 			Body: Buffer.from(arrayBuffer),
// 			ContentType: file.type,
// 		});

// 		await s3.send(command);
// 		return `${process.env.AWS_URL}/${process.env.AWS_S3_BUCKET_NAME}/${command.input.Key}`;
// 	}
// }

const CHUNK_SIZE = 1024 * 1024; // 1MB chunks

export async function uploadFile(
	file: File,
	type: 'image' | 'audio' = 'image',
	audioFileName?: string
) {
	if (!file) throw new Error('File is required for upload.');

	const extension = file.name.split('.').pop();
	const key = `${type}s/${
		audioFileName
			? `${audioFileName}-${Math.floor(Math.random() * 10000)}`
			: uuidv4()
	}.${extension}`;

	try {
		const arrayBuffer = await file.arrayBuffer();
		const chunks = Math.ceil(arrayBuffer.byteLength / CHUNK_SIZE);

		if (chunks === 1) {
			// Small file, use direct upload
			const command = new PutObjectCommand({
				Bucket: process.env.AWS_S3_BUCKET_NAME,
				Key: key,
				Body: Buffer.from(arrayBuffer),
				ContentType: file.type,
			});

			await s3.send(command);
		} else {
			// Large file, use multipart upload
			const uploadId = (await initiateMultipartUpload(key, file.type)) || '';
			const parts = [];

			for (let i = 0; i < chunks; i++) {
				const start = i * CHUNK_SIZE;
				const end = Math.min(start + CHUNK_SIZE, arrayBuffer.byteLength);
				const chunk = arrayBuffer.slice(start, end);

				const partNumber = i + 1;
				const uploadedPart = await uploadPart(
					key,
					uploadId,
					partNumber,
					Buffer.from(chunk)
				);
				parts.push({ PartNumber: partNumber, ETag: uploadedPart.ETag });
			}

			await completeMultipartUpload(key, uploadId, parts);
		}

		return `${process.env.AWS_URL}/${process.env.AWS_S3_BUCKET_NAME}/${key}`;
	} catch (error) {
		console.error('Error uploading file:', error);
		throw new Error('Failed to upload file');
	}
}

async function initiateMultipartUpload(key: string, contentType: string) {
	const { UploadId } = await s3.send(
		new CreateMultipartUploadCommand({
			Bucket: process.env.AWS_S3_BUCKET_NAME,
			Key: key,
			ContentType: contentType,
		})
	);
	return UploadId;
}

async function uploadPart(
	key: string,
	uploadId: string,
	partNumber: number,
	body: Buffer
) {
	const command = new UploadPartCommand({
		Bucket: process.env.AWS_S3_BUCKET_NAME,
		Key: key,
		UploadId: uploadId,
		PartNumber: partNumber,
		Body: body,
	});

	return await s3.send(command);
}

async function completeMultipartUpload(
	key: string,
	uploadId: string,
	parts: {
		PartNumber: number;
		ETag: string | undefined;
	}[]
) {
	const command = new CompleteMultipartUploadCommand({
		Bucket: process.env.AWS_S3_BUCKET_NAME,
		Key: key,
		UploadId: uploadId,
		MultipartUpload: { Parts: parts },
	});

	return await s3.send(command);
}
