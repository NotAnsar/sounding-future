import { ArticleLink } from '@prisma/client';
import Link from 'next/link';
import React from 'react';

export default function ArtistArticles({
	articles,
}: {
	articles: ({ article: ArticleLink } & {
		createdAt: Date;
		artistId: string;
		articleId: string;
	})[];
}) {
	return (
		<div className='max-w-2xl xl:w-1/3'>
			<h1 className='text-xl font-semibold text-primary-foreground mb-4'>
				Sounding Future articles
			</h1>
			{articles.length === 0 && (
				<p className='text-muted'>No articles available</p>
			)}
			<ul className='space-y-2 text-sm sm:text-[15px]'>
				{articles.map((a) => {
					return (
						<Link
							href={a?.article?.url}
							target='_blank'
							className='hover:underline cursor-pointer'
							key={a?.articleId}
						>
							{a?.article?.title ||
								a?.article?.url
									.split('/')
									.pop()
									?.replaceAll('-', ' ')

									.split(' ')
									.map(
										(word) =>
											word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()
									)
									.join(' ')}
						</Link>
					);
				})}
			</ul>
		</div>
	);
}
