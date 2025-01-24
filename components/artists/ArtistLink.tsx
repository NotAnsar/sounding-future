import { SocialLinks } from '@prisma/client';
import Link from 'next/link';
import { Icons } from '@/components/icons/socials';

export default function ArtistLink({
	socialLinks,
}: {
	socialLinks: SocialLinks;
}) {
	const allLinksNull =
		!socialLinks.facebook &&
		!socialLinks.instagram &&
		!socialLinks.linkedin &&
		!socialLinks.vimeo &&
		!socialLinks.website &&
		!socialLinks.youtube &&
		!socialLinks.mastodon;

	if (allLinksNull) {
		return null;
	}

	return (
		<div>
			<h1 className='text-xl font-semibold text-primary-foreground mb-4'>
				Artist Links
			</h1>
			<div className='flex gap-4 items-center'>
				{socialLinks?.website && (
					<Link href={socialLinks?.website} target='_blank'>
						<Icons.world className='w-9 h-auto aspect-square text-foreground cursor-pointer fill-foreground hover:text-primary-foreground hover:fill-primary-foreground transition-colors duration-200 ease-out' />
					</Link>
				)}
				{socialLinks?.facebook && (
					<Link href={socialLinks?.facebook} target='_blank'>
						<Icons.facebook className='w-9 h-auto aspect-square text-foreground cursor-pointer hover:text-primary-foreground transition-colors duration-200 ease-out' />
					</Link>
				)}
				{socialLinks?.instagram && (
					<Link href={socialLinks?.instagram} target='_blank'>
						<Icons.instagram className='w-9 h-auto aspect-square text-foreground cursor-pointer hover:text-primary-foreground transition-colors duration-200 ease-out' />
					</Link>
				)}
				{socialLinks?.linkedin && (
					<Link href={socialLinks?.linkedin} target='_blank'>
						<Icons.linkedin className='w-9 h-auto aspect-square text-foreground cursor-pointer hover:text-primary-foreground transition-colors duration-200 ease-out' />
					</Link>
				)}
				{socialLinks?.vimeo && (
					<Link href={socialLinks?.vimeo} target='_blank'>
						<Icons.linkedin className='w-9 h-auto aspect-square text-foreground cursor-pointer hover:text-primary-foreground transition-colors duration-200 ease-out' />
					</Link>
				)}
				{socialLinks?.youtube && (
					<Link href={socialLinks?.youtube} target='_blank'>
						<Icons.youtube className='w-9 h-auto aspect-square text-foreground cursor-pointer hover:text-primary-foreground transition-colors duration-200 ease-out' />
					</Link>
				)}
			</div>
		</div>
	);
}
