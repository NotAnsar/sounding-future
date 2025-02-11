import AudioPlayer from '@/components/AudioPlayer/AudioPlayer';
import SideBarNav from '@/components/Nav/SIdeBarNav';
import TopNav from '@/components/Nav/TopNav';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';

import { isAuthenticated } from '@/db/user';
import { cn } from '@/lib/utils';

import { Terminal } from 'lucide-react';
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
				isAuth={auth}
			/>

			<main
				className={`md:ml-64 pb-32 p-4 md:px-8 md:pt-0 overflow-y-auto w-full mt-[var(--top-nav-height)] md:mt-[var(--top-nav-height-md)] mx-auto max-w-screen-2xl relative`}
			>
				{!auth && (
					<Alert className='mb-4 '>
						<Terminal className='h-4 w-4' />
						<AlertTitle>Welcome to Sounding Future AudioSpace!</AlertTitle>
						<AlertDescription className='mb-1'>
							Sign up for free to unlock the full potential of our features and
							enjoy an enhanced experience.
						</AlertDescription>

						<span>
							<Link
								href={'/signup'}
								className={cn(
									'inline-flex h-8 shrink-0 items-center justify-center rounded-md border bg-transparent px-3 text-sm font-medium transition-colors hover:bg-secondary focus:outline-none focus:ring-1 focus:ring-ring disabled:pointer-events-none disabled:opacity-50 group-[.destructive]:border-muted/40 group-[.destructive]:hover:border-destructive/30 group-[.destructive]:hover:bg-destructive group-[.destructive]:hover:text-destructive-foreground group-[.destructive]:focus:ring-destructive'
								)}
							>
								Sign Up
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
