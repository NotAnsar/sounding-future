import { TabsList, TabsTrigger } from '@/components/ui/tabs';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export default function CoursesDetailsNav({
	tabs,
	searchParams,
}: {
	tabs: { label: string; link: string }[];
	searchParams?: { [key: string]: string | string[] | undefined };
}) {
	const createTabLink = (tabLink: string) => {
		const params = new URLSearchParams();

		// Preserve existing search params
		if (searchParams) {
			Object.entries(searchParams).forEach(([key, value]) => {
				if (key !== 'tab' && value) {
					params.set(key, Array.isArray(value) ? value[0] : value);
				}
			});
		}

		// Set the new tab
		params.set('tab', tabLink);

		return `?${params.toString()}`;
	};

	return (
		<div className='flex gap-1.5 justify-between flex-col sm:flex-row'>
			<TabsList className='flex w-full sm:w-fit gap-2 sm:gap-2.5 bg-background text-white justify-start flex-wrap'>
				{tabs.map((tab) => (
					<TabsTrigger
						key={tab.label}
						value={tab.link}
						className={cn(
							'!p-0 rounded-full flex-shrink-0',
							tab.link === 'content' && 'lg:hidden'
						)}
					>
						<Link
							href={createTabLink(tab.link)}
							className='px-2 py-1.5 sm:px-4 sm:py-1.5 rounded-full whitespace-nowrap text-sm sm:text-[15px]'
						>
							{tab.label}
						</Link>
					</TabsTrigger>
				))}
			</TabsList>
		</div>
	);
}
