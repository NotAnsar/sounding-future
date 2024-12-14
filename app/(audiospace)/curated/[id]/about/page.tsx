import CuratedDetails from '@/components/curated/CuratedDetails';
import TracksCarousel from '@/components/home/NewTracks';
import { Icons } from '@/components/icons/socials';
import Image from 'next/image';
import { getPartnerDetailsById } from '@/db/partner';
import Link from 'next/link';
import { getPublicTracksByPartner } from '@/db/tracks';
import Error from '@/components/Error';

export default async function page({
	params: { id },
}: {
	params: { id: string };
}) {
	const [curatedRes, tracks] = await Promise.all([
		getPartnerDetailsById(id),
		getPublicTracksByPartner(id),
	]);

	if (curatedRes.error || !curatedRes.data) {
		return <Error message={curatedRes.message} />;
	}
	const curated = curatedRes.data;

	return (
		<>
			<CuratedDetails curated={curated} isAbout={true} />
			<main className='mt-8'>
				<div className='space-y-8 '>
					{curated?.studioPic && (
						<div className='max-w-2xl xl:w-2/3'>
							<Image
								className='w-full rounded-3xl aspect-video object-cover'
								src={curated?.studioPic}
								width={500}
								height={500}
								alt={curated?.name}
							/>
						</div>
					)}
					<div className='flex flex-col gap-y-6 xl:flex-row gap-x-12'>
						<p className='text-pretty leading-7 max-w-2xl xl:w-2/3'>
							{curated?.bio}
						</p>
						<div>
							<h1 className='text-xl font-semibold text-primary-foreground mb-4'>
								Links
							</h1>
							<div className='flex gap-4 items-center'>
								{curated.socialLinks?.website && (
									<Link href={curated?.socialLinks?.website} target='_blank'>
										<Icons.world className='w-9 h-auto aspect-square text-foreground fill-foreground cursor-pointer hover:text-primary-foreground transition-colors duration-200 ease-out' />
									</Link>
								)}
								{curated.socialLinks?.facebook && (
									<Link href={curated?.socialLinks?.facebook} target='_blank'>
										<Icons.facebook className='w-9 h-auto aspect-square text-foreground cursor-pointer hover:text-primary-foreground transition-colors duration-200 ease-out' />
									</Link>
								)}
								{curated.socialLinks?.instagram && (
									<Link href={curated?.socialLinks?.instagram} target='_blank'>
										<Icons.instagram className='w-9 h-auto aspect-square text-foreground cursor-pointer hover:text-primary-foreground transition-colors duration-200 ease-out' />
									</Link>
								)}

								{curated.socialLinks?.linkedin && (
									<Link href={curated?.socialLinks?.linkedin} target='_blank'>
										<Icons.linkedin className='w-9 h-auto aspect-square text-foreground cursor-pointer hover:text-primary-foreground transition-colors duration-200 ease-out' />
									</Link>
								)}
								{curated.socialLinks?.vimeo && (
									<Link href={curated?.socialLinks?.vimeo} target='_blank'>
										<Icons.vimeo className='w-9 h-auto aspect-square text-foreground cursor-pointer hover:text-primary-foreground transition-colors duration-200 ease-out' />
									</Link>
								)}
								{curated.socialLinks?.youtube && (
									<Link href={curated?.socialLinks?.youtube} target='_blank'>
										<Icons.youtube className='w-9 h-auto aspect-square text-foreground cursor-pointer hover:text-primary-foreground transition-colors duration-200 ease-out' />
									</Link>
								)}
							</div>
						</div>
					</div>
				</div>
			</main>

			<TracksCarousel
				tracks={tracks.data}
				title={`Tracks selected by ${curated?.name}`}
				classNameItem='basis-36 sm:basis-52 lg:basis-64'
				className='mt-12 xl:w-2/3'
				classNameTitle='text-[18px] sm:text-[22px]'
			/>
		</>
	);
}
