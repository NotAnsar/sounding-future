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
		],
	},
	experimental: {
		serverActions: { bodySizeLimit: '10mb' },
	},
	// Add headers configuration
	async headers() {
		return [
			{
				source: '/:path*',
				headers: [
					{
						key: 'X-Forwarded-Proto',
						value: 'https',
					},
				],
			},
		];
	},
};

export default nextConfig;
