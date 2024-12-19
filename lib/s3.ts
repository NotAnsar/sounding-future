import { S3Client } from '@aws-sdk/client-s3';

export const s3 = new S3Client({
	region: process.env.AWS_REGION! || 'eu-central-1',
	// region: 'eu-west-3',
	credentials: {
		accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
		secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
	},
	// // region: 'us-central', // Region must match the Hetzner setup
	// region: 'eu-central-1', // Region must match the Hetzner setup
	// endpoint: process.env.AWS_URL, // Hetzner endpoint URL
	// credentials: {
	// 	accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
	// 	secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
	// },
});
