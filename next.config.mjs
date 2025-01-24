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
};

export default nextConfig;
