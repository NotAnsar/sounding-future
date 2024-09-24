import AudioPlayer from '@/components/AudioPlayer/AudioPlayer';
import SideBarNav from '@/components/Nav/SIdeBarNav';
import TopNav from '@/components/Nav/TopNav';
import { AudioProvider } from '@/context/AudioContext';

export default function Layout({ children }: { children: React.ReactNode }) {
	return (
		<div
			className='relative flex h-screen'
			style={
				{
					'--top-nav-height': '72px',
					'--top-nav-height-md': '128px',
				} as React.CSSProperties
			}
		>
			<TopNav
				className={`top-0 h-[var(--top-nav-height)] md:h-[var(--top-nav-height-md)]`}
			/>
			<SideBarNav
				className={`hidden md:flex top-[var(--top-nav-height-md)] h-[calc(100vh-var(--top-nav-height-md))] fixed`}
			/>
			<AudioProvider>
				<main
					className={`md:ml-64 pb-24 p-4 md:px-8 md:pt-0 overflow-y-auto w-full mt-[var(--top-nav-height)] md:mt-[var(--top-nav-height-md)]`}
				>
					{children}
					Lorem ipsum, dolor sit amet consectetur adipisicing elit. Pariatur
					tempore nulla eligendi unde quo quia laboriosam ipsam obcaecati dicta
					illo quos voluptatem cumque quas reprehenderit libero saepe
					praesentium, odit eveniet? Consequatur, ex, distinctio ducimus
					recusandae inventore molestiae mollitia dignissimos nulla voluptatibus
					repellendus impedit alias temporibus voluptates excepturi quibusdam,
					non minus nesciunt aspernatur? Soluta veritatis, corrupti accusantium
					minima illo vero explicabo beatae ut, quas necessitatibus repellat quo
					maxime natus? Deserunt repudiandae ducimus culpa iusto quod libero
					facilis ad. Molestiae, eligendi voluptas. Enim quibusdam quis voluptas
					sed, veritatis repellat inventore commodi voluptatum explicabo
					molestias minima dolores harum nobis blanditiis cupiditate rem autem
					esse saepe! Sed ducimus, enim quam ipsam corrupti at dolor cupiditate.
					Sunt velit molestiae cumque laborum ea necessitatibus eum explicabo
					voluptatem nemo recusandae consequatur facilis, excepturi ullam
					molestias alias praesentium architecto ex ducimus quos voluptatibus
					provident quasi aliquid nihil. Ducimus ipsa necessitatibus magnam
					molestiae quia non, tempora, accusamus corrupti tenetur nam
					architecto, cumque cum facilis id laboriosam! Nobis commodi sed libero
					suscipit itaque eum maiores. Minima aut laborum quo consequuntur, vero
					quam optio mollitia laboriosam, officiis, quae amet? Suscipit, quia
					maxime! Totam optio veniam dolorem praesentium temporibus non sint ex
					minus velit magnam, animi delectus? Assumenda distinctio odio facere,
					reiciendis similique iusto aspernatur debitis expedita ipsa asperiores
					doloribus culpa ipsam consectetur possimus aliquid sit quidem
					repudiandae facilis iste quis recusandae temporibus libero tempora
					laboriosam. Inventore quo non impedit reiciendis quis minus nostrum
					consequatur cupiditate libero mollitia, blanditiis voluptas
					perspiciatis dolore illo quasi, quae voluptatem, quisquam aliquid
					ipsam sequi? A deserunt soluta dolor harum sed nulla! Fuga tenetur
					repellat nesciunt dolor nihil iure repudiandae dolorem dolorum eius
					sed consequuntur nostrum quasi fugiat saepe vel nobis harum, explicabo
					reiciendis sit facilis laudantium! Illum nesciunt distinctio in et,
					commodi voluptatem, delectus perspiciatis quasi quod ratione maiores
					nihil accusamus eum iusto a atque repellendus qui doloremque ea fuga.
					Facere quos perferendis, blanditiis tenetur nostrum distinctio
					explicabo unde fugit ipsam et commodi pariatur itaque a at nobis
					asperiores beatae! Enim facilis quos ab commodi minus recusandae
					accusamus error doloribus praesentium a ad quasi adipisci dolorum
					veniam, ex doloremque suscipit nisi, officiis vitae, atque laudantium
					nam officia delectus iusto? Nihil maiores placeat qui voluptatibus,
					omnis explicabo incidunt officia temporibus dolor beatae quasi. Eaque,
					atque aliquam quam, a, porro ex libero consectetur odit aut adipisci
					ducimus modi quis et sunt accusamus quos voluptates culpa omnis alias
					rem dolorem illum vel nemo optio! Laudantium officiis ducimus quam
					nisi tenetur! Cumque voluptatibus soluta accusantium deleniti possimus
					recusandae, optio minima, placeat odit maxime autem, dicta laborum ex
					quos distinctio! Sunt eos vero quisquam ipsam, omnis amet itaque,
					culpa saepe laboriosam earum similique illum aliquam quos repellendus,
					iure minus nisi nam minima ipsa eum blanditiis obcaecati
					necessitatibus. Neque illo omnis molestias!
				</main>
				<AudioPlayer />
			</AudioProvider>
		</div>
	);
}
