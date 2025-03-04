import AudioPlayer from '@/components/AudioPlayer/AudioPlayer';
import SideBarNav from '@/components/Nav/SIdeBarNav';
import TopNav from '@/components/Nav/TopNav';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { buttonVariants } from '@/components/ui/button';
import { isAuthenticated } from '@/db/user';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import NextTopLoader from 'nextjs-toploader';

export default async function Layout({
	children,
}: {
	children: React.ReactNode;
}) {
	const auth = await isAuthenticated();

	return (
		<div
			className='relative flex h-[100dvh]'
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
				className={`hidden md:flex top-[var(--top-nav-height-md)] h-[calc(100dvh-var(--top-nav-height-md))] fixed`}
				isAuth={auth}
			/>

			<main
				className={`md:ml-64 pb-32 p-4 md:px-8 md:pt-0 overflow-y-auto w-full mt-[var(--top-nav-height)] md:mt-[var(--top-nav-height-md)] mx-auto max-w-screen-2xl relative`}
			>
				{!auth && (
					<Alert className='mb-4'>
						<AlertTitle className='text-[27px] leading-tight font-bold'>
							Listen to all audio tracks for free!
						</AlertTitle>
						<AlertDescription className='mb-2 mt-1 '>
							Sign up for free access to all audio tracks and explore our
							community features.
						</AlertDescription>

						<span>
							<Link
								href={'/signup'}
								className={cn(
									buttonVariants(),
									'bg-button hover:bg-button/80 px-3.5'
								)}
							>
								Sign Up Now
							</Link>
						</span>
					</Alert>
				)}

				{children}
			</main>
			<AudioPlayer />
		</div>
	);
}
