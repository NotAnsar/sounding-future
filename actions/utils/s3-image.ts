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

// Helper function to upload to S3 with buffer
export async function uploadToS3({
	buffer,
	key,
	contentType,
}: {
	buffer: Buffer;
	key: string;
	contentType: string;
}): Promise<string> {
	const command = new PutObjectCommand({
		Bucket: process.env.AWS_S3_BUCKET_NAME,
		Key: key,
		Body: buffer,
		ContentType: contentType,
		ContentLength: buffer.length,
	});

	await s3.send(command);
	return `${AWS_URL}/${AWS_S3_BUCKET_NAME}/${key}`;
}

// Specialized function for uploading HLS files
export async function uploadHLSFiles(files: File[]): Promise<string> {
	try {
		// Separate playlist and segment files
		const playlistFile = files.find((f) =>
			f.name.toLowerCase().endsWith('.m3u8')
		);
		const segmentFiles = files.filter((f) =>
			f.name.toLowerCase().endsWith('.ts')
		);

		if (!playlistFile) {
			throw new Error('No playlist file (.m3u8) found in upload');
		}

		if (segmentFiles.length === 0) {
			throw new Error('No segment files (.ts) found in upload');
		}

		// Generate unique folder for this HLS stream
		const hlsId = uuidv4();
		const hlsFolder = `hls/${hlsId}`;

		// Upload ALL segment files first
		const segmentUploadPromises = segmentFiles.map(async (file) => {
			const segmentKey = `${hlsFolder}/${file.name}`;

			const arrayBuffer = await file.arrayBuffer();

			const url = await uploadToS3({
				buffer: Buffer.from(arrayBuffer),
				key: segmentKey,
				contentType: 'video/mp2t', // Correct MIME type for .ts files
			});

			return { originalName: file.name, url };
		});

		// Wait for all segments to upload
		const uploadedSegments = await Promise.all(segmentUploadPromises);

		// Read and modify playlist content
		const playlistContent = await playlistFile.text();

		// Create mapping of original names to new URLs
		const segmentMap = new Map<string, string>();
		uploadedSegments.forEach(({ originalName, url }) => {
			segmentMap.set(originalName, url);
		});

		// Replace relative paths with absolute URLs in playlist
		const lines = playlistContent.split('\n');
		const modifiedLines = lines.map((line) => {
			const trimmedLine = line.trim();

			// If this line is a segment file reference
			if (trimmedLine.endsWith('.ts')) {
				const absoluteUrl = segmentMap.get(trimmedLine);
				if (absoluteUrl) {
					return absoluteUrl;
				} else {
					console.warn(`⚠️  No uploaded URL found for segment: ${trimmedLine}`);
					return line; // Keep original if not found
				}
			}

			return line; // Keep all other lines unchanged
		});

		const modifiedPlaylistContent = modifiedLines.join('\n');

		// Upload the modified playlist
		const playlistKey = `${hlsFolder}/playlist.m3u8`;
		const playlistUrl = await uploadToS3({
			buffer: Buffer.from(modifiedPlaylistContent),
			key: playlistKey,
			contentType: 'application/x-mpegURL',
		});

		return playlistUrl;
	} catch (error) {
		console.error('❌ HLS upload failed:', error);
		throw new Error(
			`HLS upload failed: ${
				error instanceof Error ? error.message : String(error)
			}`
		);
	}
}

// Add this function to your existing s3-image.ts file:

// Helper function to delete an entire HLS folder and all its contents
export async function deleteHLSFolder(playlistUrl: string): Promise<void> {
	if (!playlistUrl) throw new Error('Playlist URL is required for deletion.');

	try {
		// Extract the folder path from playlist URL
		const urlParts = playlistUrl.split(`/${AWS_S3_BUCKET_NAME}/`);
		if (urlParts.length !== 2) {
			console.error('Invalid HLS URL format');
			return;
		}

		const playlistKey = urlParts[1]; // e.g., "hls/374eb1a4-f379-4b43-832e-2869d57b1f88/playlist.m3u8"
		const folderPath = playlistKey.substring(0, playlistKey.lastIndexOf('/')); // e.g., "hls/374eb1a4-f379-4b43-832e-2869d57b1f88"

		// First, get the playlist content to find all segment files
		try {
			const playlistResponse = await fetch(playlistUrl);
			if (playlistResponse.ok) {
				const playlistContent = await playlistResponse.text();

				// Extract segment URLs from playlist
				const lines = playlistContent.split('\n');
				const segmentUrls = lines.filter(
					(line) =>
						line.trim().startsWith('http') && line.trim().endsWith('.ts')
				);

				// Delete each segment file
				for (const segmentUrl of segmentUrls) {
					try {
						await deleteFile(segmentUrl.trim());
					} catch (error) {
						console.warn(
							'⚠️  Failed to delete segment:',
							segmentUrl.trim(),
							error
						);
						// Continue with other deletions
					}
				}
			}
		} catch (error) {
			console.warn('⚠️  Could not fetch playlist content for cleanup:', error);
			// Continue with folder-based deletion as fallback
		}

		// Delete the playlist file itself
		try {
			await deleteFile(playlistUrl);
		} catch (error) {
			console.warn('⚠️  Failed to delete playlist file:', error);
		}

		// Fallback: Try to delete common segment files in the folder
		// This handles cases where the playlist content couldn't be read
		const commonSegmentPatterns = [
			'kurs1hls0.ts',
			'kurs1hls1.ts',
			'kurs1hls2.ts',
			'kurs1hls3.ts',
			'kurs1hls4.ts',
			'segment0.ts',
			'segment1.ts',
			'segment2.ts',
			'segment3.ts',
			'segment4.ts',
			'segment000.ts',
			'segment001.ts',
			'segment002.ts',
			'segment003.ts',
			'segment004.ts',
		];

		for (const pattern of commonSegmentPatterns) {
			try {
				const segmentKey = `${folderPath}/${pattern}`;
				const segmentUrl = `${AWS_URL}/${AWS_S3_BUCKET_NAME}/${segmentKey}`;

				// Try to delete (will fail silently if file doesn't exist)
				await deleteFile(segmentUrl);
			} catch (error) {
				// Ignore errors for fallback deletion
			}
		}
	} catch (error) {
		console.error('❌ Error deleting HLS folder:', error);
		throw new Error(
			`Failed to delete HLS folder: ${
				error instanceof Error ? error.message : String(error)
			}`
		);
	}
}
