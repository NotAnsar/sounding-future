import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export const dynamic = 'force-dynamic';

const BASE_URL = 'https://audiospace.soundingfuture.com';

interface Partner {
	slug: string;
	createdAt: Date;
}

async function generateSitemapContent() {
	const [staticRoutes, artists, tracks, genres, partners] = await Promise.all([
		Promise.resolve([
			'',
			'/about',
			'/legal',
			'/privacy',
			'/support-us',
			'/artists',
			'/tracks',
			'/genres',
			'/curated',
		]),
		prisma.artist.findMany({
			where: { published: true },
			select: { slug: true, createdAt: true },
		}),
		prisma.track.findMany({
			where: { published: true },
			select: { slug: true, createdAt: true },
		}),
		prisma.genre.findMany({
			select: { slug: true, createdAt: true },
		}),
		prisma.partner.findMany({
			select: { slug: true, createdAt: true },
		}) as Promise<Partner[]>,
	]);

	// XML generation remains the same
	return `
    ${staticRoutes
			.map(
				(route) => `
      <url>
        <loc>${BASE_URL}${route}</loc>
        <lastmod>${new Date().toISOString()}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>${route === '' ? '1.0' : '0.8'}</priority>
      </url>
    `
			)
			.join('')}

    ${artists
			.map(
				({ slug, createdAt }) => `
      <url>
        <loc>${BASE_URL}/artists/${slug}</loc>
        <lastmod>${createdAt.toISOString()}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.7</priority>
      </url>
    `
			)
			.join('')}

    ${tracks
			.map(
				({ slug, createdAt }) => `
      <url>
        <loc>${BASE_URL}/tracks/${slug}</loc>
        <lastmod>${createdAt.toISOString()}</lastmod>
        <changefreq>daily</changefreq>
        <priority>0.7</priority>
      </url>
    `
			)
			.join('')}

    ${genres
			.map(
				({ slug, createdAt }) => `
      <url>
        <loc>${BASE_URL}/genres/${slug}</loc>
        <lastmod>${createdAt.toISOString()}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.6</priority>
      </url>
    `
			)
			.join('')}

    ${partners
			.flatMap(({ slug, createdAt }) => [
				`<url>
        <loc>${BASE_URL}/curated/${slug}</loc>
        <lastmod>${createdAt.toISOString()}</lastmod>
        <changefreq>weekly</changefreq>
        <priority>0.7</priority>
      </url>`,
				`<url>
        <loc>${BASE_URL}/curated/${slug}/about</loc>
        <lastmod>${createdAt.toISOString()}</lastmod>
        <changefreq>monthly</changefreq>
        <priority>0.6</priority>
      </url>`,
			])
			.join('')}
  `;
}

export async function GET() {
	try {
		const sitemapContent = await generateSitemapContent();
		const xml = `<?xml version="1.0" encoding="UTF-8"?>
      <urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
        ${sitemapContent}
      </urlset>
    `;

		return new NextResponse(xml, {
			headers: {
				'Content-Type': 'application/xml',
				'Cache-Control': 'public, s-maxage=86400, stale-while-revalidate=3600',
			},
		});
	} catch (error) {
		console.error('Sitemap generation error:', error);
		return new NextResponse('Internal server error', { status: 500 });
	}
}
