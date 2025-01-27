/** @type {import('next').NextConfig} */
const nextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: 'https',
				hostname: '**',
				port: '',
				pathname: '/**',
			},
			{
				protocol: 'https',
				hostname: 'sfdata01.fsn1.your-objectstorage.com',
				port: '',
				pathname: '/sfdata01/images/**',
			},
		],
	},
	experimental: {
		serverActions: { bodySizeLimit: '10mb' },
	},
};

export default nextConfig;
