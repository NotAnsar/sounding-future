import { notFound } from 'next/navigation';
import { collections, tracks } from '@/config/dummy-data';
import CuratedDetails from '@/components/curated/CuratedDetails';
import TracksCarousel from '@/components/home/NewTracks';
import { Icons } from '@/components/icons/socials';
import Image from 'next/image';

export default function page({ params: { id } }: { params: { id: string } }) {
	const curated = collections.find((a) => a.id === id);

	if (!curated) {
		notFound();
	}

	const filteredTracks = tracks.filter((t) => t.collection.id === curated.id);
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
							Lorem ipsum dolor sit amet consectetur adipisicing elit. Dicta
							architecto illo optio, sed, ratione unde voluptate fuga ullam qui
							obcaecati nostrum enim? Enim provident ut eum praesentium aliquid
							deleniti. Mollitia delectus vitae dolorem dicta laboriosam tenetur
							at, corporis accusantium facere, ducimus eum. Quidem sunt
							reiciendis magni distinctio nihil nemo et consectetur in corrupti
							blanditiis vitae, fugiat, iure molestias suscipit accusantium
							Lorem ipsum dolor sit amet consectetur adipisicing elit. Deleniti
							soluta labore voluptates quidem ducimus maxime dolore expedita
							doloremque autem nihil? Nobis sed consequuntur at architecto.
						</p>
						<div>
							<h1 className='text-xl font-semibold text-primary-foreground mb-4'>
								Links
							</h1>
							<div className='flex gap-4 items-center'>
								<Icons.facebook className='w-10 h-auto aspect-square text-foreground cursor-pointer hover:text-primary-foreground transition-colors duration-200 ease-out' />
								<Icons.instagram className='w-10 h-auto aspect-square text-foreground cursor-pointer hover:text-primary-foreground transition-colors duration-200 ease-out' />
								<Icons.linkedin className='w-10 h-auto aspect-square text-foreground cursor-pointer hover:text-primary-foreground transition-colors duration-200 ease-out' />
								<Icons.vimeo className='w-10 h-auto aspect-square text-foreground cursor-pointer hover:text-primary-foreground transition-colors duration-200 ease-out' />
								<Icons.youtube className='w-10 h-auto aspect-square text-foreground cursor-pointer hover:text-primary-foreground transition-colors duration-200 ease-out' />
							</div>
						</div>
					</div>
				</div>
			</main>

			<TracksCarousel
				tracks={filteredTracks}
				title={`Tracks selected by ${curated.name}`}
				classNameItem='basis-36 sm:basis-52 lg:basis-64'
				className='mt-12 xl:w-2/3'
				classNameTitle='text-[18px] sm:text-[22px]'
			/>
		</>
	);
}
