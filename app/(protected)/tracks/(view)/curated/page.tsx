import TracksNav from '@/components/tracks/TracksNav';
import { TabsContent } from '@/components/ui/tabs';

export default function page({
	searchParams: { type },
}: {
	searchParams: { type: string };
}) {
	return (
		<>
			<TracksNav type={type} />

			<TabsContent value='curated'>curated</TabsContent>
		</>
	);
}
