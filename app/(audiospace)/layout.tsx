import AudioPlayer from '@/components/AudioPlayer/AudioPlayer';
import SideBarNav from '@/components/Nav/SIdeBarNav';
import TopNav from '@/components/Nav/TopNav';
import NextTopLoader from 'nextjs-toploader';

export default async function Layout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div
			className='relative flex h-screen'
			style={
				{
					'--top-nav-height': '72px',
					'--top-nav-height-md': '100px',
				} as React.CSSProperties
			}
		>
			<NextTopLoader
				color='#AE3795'
				initialPosition={0.08}
				crawlSpeed={200}
				height={4}
				crawl={true}
				showSpinner={false}
				easing='ease'
				speed={200}
				shadow='0 0 10px #AE3795,0 0 5px #AE3795'
			/>

			<TopNav
				className={`top-0 h-[var(--top-nav-height)] md:h-[var(--top-nav-height-md)]`}
			/>
			<SideBarNav
				className={`hidden md:flex top-[var(--top-nav-height-md)] h-[calc(100vh-var(--top-nav-height-md))] fixed`}
			/>

			<main
				className={`md:ml-64 pb-32 p-4 md:px-8 md:pt-0 overflow-y-auto w-full mt-[var(--top-nav-height)] md:mt-[var(--top-nav-height-md)] mx-auto max-w-screen-2xl relative`}
			>
				{children}
			</main>
			<AudioPlayer />
		</div>
	);
}
