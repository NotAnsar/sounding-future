import { S3Client } from '@aws-sdk/client-s3';

export const s3 = new S3Client({
	region: process.env.AWS_REGION! || 'eu-central-1',
	credentials: {
		accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
		secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
	},
});

// export const s3 = new S3Client({
// 	region: process.env.AWS_REGION! || 'eu-central-1',
// 	endpoint: process.env.AWS_URL, // Hetzner endpoint URL
// 	credentials: {
// 		accessKeyId: process.env.AWS_ACCESS_KEY_ID!,
// 		secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY!,
// 	},
// 	forcePathStyle: true,
// 	tls: false,
// });
