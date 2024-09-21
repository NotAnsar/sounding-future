import AudioPlayer from '@/components/AudioPlayer/AudioPlayer';
import { AudioProvider } from '@/context/AudioContext';

export default async function Layout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className='relative flex h-screen '>
			<div className='bg-black fixed top-0 w-0 h-32 z-1'></div>
			<div className='hidden w-64 md:flex flex-col h-screen fixed p-5 bg-foreground'></div>

			<AudioProvider>
				<main className='md:ml-64 pb-24 p-4 md:p-8 overflow-y-auto min-h-screen w-full'>
					{children}
				</main>
				<AudioPlayer />
			</AudioProvider>
		</div>
	);
}
