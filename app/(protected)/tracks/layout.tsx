import HeaderBanner from '@/components/HeaderBanner';
import { Tabs } from '@/components/ui/tabs';

export default function Layout({ children }: { children: React.ReactNode }) {
	return (
		<>
			<HeaderBanner img={'/tracks.png'} title='Tracks' />
			<Tabs defaultValue='new' className='mt-4 sm:mt-8 grid sm:gap-3'>
				{children}
			</Tabs>
		</>
	);
}
