import { TabsList, TabsTrigger } from '@/components/ui/tabs';

export default function CoursesDetailsNav({
	tabs,
}: {
	tabs: { label: string; link: string }[];
}) {
	//
	return (
		<div className='flex gap-1.5 justify-between flex-col sm:flex-row'>
			<TabsList className='flex w-full sm:w-fit gap-2 sm:gap-2.5 bg-background text-white justify-start flex-wrap'>
				{tabs.map((tab) => (
					<TabsTrigger
						key={tab.label}
						value={tab.link}
						className='px-2 py-1.5 sm:px-4 sm:py-1.5 rounded-full whitespace-nowrap text-sm sm:text-[15px] flex-shrink-0'
					>
						{tab.label}
					</TabsTrigger>
				))}
			</TabsList>
		</div>
	);
}
