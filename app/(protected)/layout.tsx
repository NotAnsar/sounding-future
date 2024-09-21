import AudioPlayer from '@/components/AudioPlayer/AudioPlayer';
import UserNav from '@/components/Nav/UserNav';
import { Input } from '@/components/ui/input';
import { AudioProvider } from '@/context/AudioContext';
import Image from 'next/image';

export default async function Layout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className='relative flex h-screen '>
			<div className='bg-background fixed top-0 h-[72px] md:h-[128px] w-full flex z-10 gap-4 md:gap-0'>
				<div className='md:w-64 md:min-w-64 md:max-w-64 h-full grid pl-8 items-center'>
					<Image
						src={'/logo.png'}
						alt='logo'
						width={288.33}
						height={132}
						className='w-24 md:w-36 h-auto'
					/>
				</div>
				<div className='w-full h-full flex items-center justify-between px-4 md:p-8 '>
					<Input
						type='search'
						placeholder='Search'
						className='w-1/2 bg-player placeholder:text-base py-4 border border-border/10 rounded-xl'
					/>
					<UserNav />
				</div>
			</div>
			<div className='hidden w-64 md:flex flex-col h-[calc(100vh-128px)] fixed top-[128px] p-5 bg-foreground rounded-tr-3xl  '></div>

			<AudioProvider>
				<main className='md:ml-64 pb-24 p-4 md:px-8 md:pt-0 overflow-y-auto w-full mt-[72px] md:mt-[128px]'>
					{children}
					Lorem ipsum dolor sit amet consectetur adipisicing elit. Debitis id,
					odio modi fugiat praesentium porro molestias, perferendis ullam sint
					expedita similique fuga. Sit modi assumenda sapiente illo, enim
					aspernatur quod tempore voluptatem doloribus accusamus! Adipisci illo
					facilis labore dolor tempore? Ratione suscipit quaerat eius impedit
					natus illum quas maiores, excepturi saepe repellendus quam rem
					sapiente consectetur blanditiis qui numquam. Odit natus neque quos
					fugiat vitae totam, ipsum rerum temporibus autem error repellendus
					alias provident, nostrum pariatur officia veniam quo. Possimus totam
					sunt, laboriosam maxime laudantium tenetur ab harum quam nemo non
					voluptates repellat voluptate animi aspernatur facere sint vel!
					Aliquam quibusdam error quis aliquid ab quaerat alias, accusamus optio
					possimus fugit, corporis pariatur quam provident modi deserunt est
					odit? Placeat corporis repellendus laudantium hic error adipisci est
					aperiam dolorem fugiat consectetur sed iure, explicabo, optio, odit
					impedit. Tempora ipsa doloremque voluptate est veritatis nam, sapiente
					fuga. Tempore labore inventore voluptatem fugiat deserunt repellat
					odio numquam eligendi eum delectus quis debitis placeat molestias
					neque omnis molestiae, commodi blanditiis facilis officia optio magni.
					Consequatur praesentium, recusandae perspiciatis obcaecati maiores,
					veritatis nihil unde, assumenda enim autem possimus architecto atque
					aliquid magnam voluptatibus voluptatum officia? Voluptatibus
					exercitationem ex dolorum quibusdam minus voluptatem dolorem omnis,
					labore hic consequuntur dolore sint id reiciendis odit odio, porro
					esse eveniet fugiat sunt praesentium cum officiis. Ad aliquam ab aut
					voluptate excepturi, illo, suscipit id nam debitis maxime blanditiis!
					Rerum vel, animi recusandae porro, odio sunt, eum perspiciatis
					reprehenderit dolore quidem nihil ullam nobis ab dolorem id alias
					deserunt ut dicta provident? Debitis quaerat obcaecati tempora
					provident sequi, nihil iste expedita nesciunt minus nisi quae
					cupiditate neque similique placeat ad id. Fugit sed sit at autem
					voluptatem. Repellat velit magni cum magnam corporis dolorum in
					recusandae porro eos facilis iure iste debitis aperiam dolore
					dignissimos enim, rem rerum autem id! Qui magni quaerat laboriosam
					tenetur. Corrupti exercitationem fuga ad veritatis facilis? Voluptatem
					quisquam cupiditate ab. Fugiat esse inventore porro tenetur
					voluptatibus, suscipit eligendi quos quia, sapiente aut fugit nobis
					nostrum doloribus, ratione quas blanditiis laborum minima maiores
					recusandae tempore. Soluta ipsa nam omnis repellat nostrum est facere,
					hic perferendis exercitationem accusantium cum cumque beatae
					voluptates autem dolore dolor aliquid nemo suscipit similique iste
					dicta voluptatum earum ipsam. Iusto eligendi, cum adipisci aperiam
					voluptas, necessitatibus maiores ut esse nam, officia obcaecati
					consequatur laboriosam maxime temporibus corporis distinctio nulla!
					Ipsam, necessitatibus? Laborum dolore voluptate consequatur ducimus
					reprehenderit delectus non molestiae sequi vero dignissimos, soluta
					similique, eius accusamus molestias corporis, iusto amet ratione
					accusantium. Porro, quos culpa? Beatae distinctio eius ut nihil,
					dolorum cum, possimus consequuntur laboriosam tempore animi
					consectetur voluptatem? Consectetur ut aliquid, dolorem amet ullam
					dolor! Totam eaque dicta doloremque, dolore quo necessitatibus,
					delectus minus reiciendis alias suscipit quas facilis?
				</main>
				<AudioPlayer />
			</AudioProvider>
		</div>
	);
}
